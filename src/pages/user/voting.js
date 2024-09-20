import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, onSnapshot, addDoc, query, where, getDocs } from 'firebase/firestore';
import './Voting.css';

const Voting = () => {
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [votedPositions, setVotedPositions] = useState(new Set()); // Track voted positions

  useEffect(() => {
    const unsubscribePositions = onSnapshot(collection(db, 'positions'), (snapshot) => {
      const positionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPositions(positionsData);
    });

    return () => unsubscribePositions();
  }, []);

  useEffect(() => {
    if (selectedPosition) {
      const unsubscribeCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
        const candidatesData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(candidate => candidate.positionId === selectedPosition.id);
        setCandidates(candidatesData);
      });

      return () => unsubscribeCandidates();
    }
  }, [selectedPosition]);

  const handleVote = async () => {
    if (selectedCandidate) {
      // Check if the user has already voted for this position
      const votesRef = collection(db, 'votes');
      const q = query(votesRef, where("candidateId", "==", selectedCandidate.id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Check if the position is already voted on
        if (!votedPositions.has(selectedPosition.id)) {
          await addDoc(votesRef, { candidateId: selectedCandidate.id });
          setVoteSubmitted(true);
          setVotedPositions(prev => new Set(prev).add(selectedPosition.id)); // Add position to voted set
          setSelectedCandidate(null);
        } else {
          alert("You have already voted for this position!");
        }
      } else {
        alert("You have already voted!");
      }
    }
  };

  const handleBackToPositions = () => {
    setSelectedPosition(null);
    setCandidates([]);
    setVoteSubmitted(false);
    setSelectedCandidate(null); // Reset selected candidate when going back
  };

  return (
    <div className="voting-container">
      <h1>Vote for Your Candidate</h1>
      {voteSubmitted ? (
        <div>
          <p className="thank-you-message">Thank you for voting!</p>
          <button className="back-button" onClick={handleBackToPositions}>
            Back to Positions
          </button>
        </div>
      ) : (
        <>
          {selectedPosition === null ? (
            <div className="position-list">
              <h2>Select a Position</h2>
              {positions.map(position => (
                <div 
                  key={position.id} 
                  className="position-item"
                  onClick={() => {
                    if (!votedPositions.has(position.id)) {
                      setSelectedPosition(position);
                    } else {
                      alert("You have already voted for this position!");
                    }
                  }}
                >
                  <h3>{position.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h2>Candidates for {selectedPosition.name}</h2>
              <div className="candidate-list">
                {candidates.map(candidate => (
                  <div 
                    key={candidate.id} 
                    className={`candidate-item ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <h3>{candidate.name}</h3>
                    <p>{candidate.description}</p>
                  </div>
                ))}
              </div>
              <button 
                className="vote-button" 
                onClick={handleVote} 
                disabled={!selectedCandidate}
              >
                Submit Vote
              </button>
              <button 
                className="back-button" 
                onClick={handleBackToPositions}
              >
                Back to Positions
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Voting;
