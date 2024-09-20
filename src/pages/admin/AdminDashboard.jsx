import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, addDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import PositionInsights from './PositionInsights'; 
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const [newPosition, setNewPosition] = useState('');
  const [newCandidate, setNewCandidate] = useState({});
  const [selectedPositionId, setSelectedPositionId] = useState(null); // State for selected position

  useEffect(() => {
    const unsubscribePositions = onSnapshot(collection(db, 'positions'), (snapshot) => {
      setPositions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      setCandidates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeVotes = onSnapshot(collection(db, 'votes'), (snapshot) => {
      const votesData = {};
      snapshot.docs.forEach(doc => {
        const vote = doc.data();
        votesData[vote.candidateId] = (votesData[vote.candidateId] || 0) + 1;
      });
      setVotes(votesData);
    });

    return () => {
      unsubscribePositions();
      unsubscribeCandidates();
      unsubscribeVotes();
    };
  }, []);

  const handleAddPosition = async () => {
    if (newPosition) {
      await addDoc(collection(db, 'positions'), { name: newPosition });
      setNewPosition('');
    }
  };

  const handleAddCandidate = async () => {
    if (newCandidate.name && newCandidate.positionId) {
      await addDoc(collection(db, 'candidates'), newCandidate);
      setNewCandidate({ name: '', positionId: '' });
    }
  };

  const handleDeleteCandidate = async (id) => {
    await deleteDoc(doc(db, 'candidates', id));
  };

  const handleDeletePosition = async (id) => {
    await deleteDoc(doc(db, 'positions', id));
  };

  const getWinningCandidate = () => {
    return Object.entries(votes).reduce((prev, current) => {
      return (prev[1] > current[1]) ? prev : current;
    }, [null, 0]);
  };

  const winningCandidate = getWinningCandidate();

  const handleViewInsights = (positionId) => {
    setSelectedPositionId(positionId);
  };

  const handleBack = () => {
    setSelectedPositionId(null);
  };

  if (selectedPositionId) {
    return <PositionInsights positionId={selectedPositionId} onBack={handleBack} />;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <section>
        <h2>Add Position</h2>
        <input
          type="text"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          placeholder="Position Name"
        />
        <button onClick={handleAddPosition}>Add Position</button>
      </section>

      <section>
        <h2>Add Candidate</h2>
        <input
          type="text"
          value={newCandidate.name}
          onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
          placeholder="Candidate Name"
        />
        <select
          value={newCandidate.positionId}
          onChange={(e) => setNewCandidate({ ...newCandidate, positionId: e.target.value })}
        >
          <option value="">Select Position</option>
          {positions.map(position => (
            <option key={position.id} value={position.id}>{position.name}</option>
          ))}
        </select>
        <button onClick={handleAddCandidate}>Add Candidate</button>
      </section>

      <section>
        <h2>Candidate List by Position</h2>
        {positions.map(position => (
          <div key={position.id} className="position-section">
            <h3>
              {position.name} 
              <button className="remove-button" onClick={() => handleDeletePosition(position.id)}>Remove</button>
              <button onClick={() => handleViewInsights(position.id)}>View Insights</button>
            </h3>
            {candidates
              .filter(candidate => candidate.positionId === position.id)
              .map(candidate => (
                <div key={candidate.id} className="candidate-item">
                  <span>{candidate.name} - Votes: {votes[candidate.id] || 0}</span>
                  <button className="remove-button" onClick={() => handleDeleteCandidate(candidate.id)}>Remove</button>

                </div>
              ))}
            {candidates.filter(candidate => candidate.positionId === position.id).length === 0 && (
              <p>No candidates for this position.</p>
            )}
          </div>
        ))}
      </section>

      <section>
        <h2>Current Leading Candidate</h2>
        {winningCandidate[0] ? (
          <div>
            <h3>{candidates.find(c => c.id === winningCandidate[0])?.name}</h3>
            <p>Votes: {winningCandidate[1]}</p>
          </div>
        ) : (
          <p>No votes yet.</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
