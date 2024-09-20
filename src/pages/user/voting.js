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
  const [votedPositions, setVotedPositions] = useState(new Set());
  const [hasVoted, setHasVoted] = useState(false); // Track if user has voted

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
      // Check if the user has already voted
      const votesRef = collection(db, 'votes');
      const querySnapshot = await getDocs(votesRef);
      
      if (querySnapshot.empty) {
        await addDoc(votesRef, { candidateId: selectedCandidate.id });
        setVoteSubmitted(true);
        setHasVoted(true); // Set hasVoted to true
        setSelectedCandidate(null);
      } else {
        alert("You have already voted for a candidate!");
      }
    }
  };

  const handleBackToPositions = () => {
    setSelectedPosition(null);
    setCandidates([]);
    setVoteSubmitted(false);
    setSelectedCandidate(null);
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
                    if (!votedPositions.has(position.id) && !hasVoted) {
                      setSelectedPosition(position);
                    } else {
                      alert("You have already voted for this position or a candidate!");
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
                    onClick={() => {
                      if (!hasVoted) {
                        setSelectedCandidate(candidate);
                      }
                    }}
                  >
                    <h3>{candidate.name}</h3>
                    <p>{candidate.description}</p>
                  </div>
                ))}
              </div>
              <button 
                className="vote-button" 
                onClick={handleVote} 
                disabled={!selectedCandidate || hasVoted}
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
