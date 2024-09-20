import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import './PositionInsights.css';

const PositionInsights = ({ positionId, onBack }) => {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    const unsubscribeCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const candidatesData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(candidate => candidate.positionId === positionId);
      setCandidates(candidatesData);
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
      unsubscribeCandidates();
      unsubscribeVotes();
    };
  }, [positionId]);

  return (
    <div className="position-insights">
      <button className="back-button" onClick={onBack}>Back to Positions</button>
      <h1>Insights for Position</h1>
      <div className="candidate-list">
        {candidates.map(candidate => (
          <div key={candidate.id} className="candidate-item">
            <h2>{candidate.name}</h2>
            <p>Votes: {votes[candidate.id] || 0}</p>
          </div>
        ))}
        {candidates.length === 0 && <p>No candidates for this position.</p>}
      </div>
    </div>
  );
};

export default PositionInsights;
