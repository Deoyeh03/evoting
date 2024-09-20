// VoteForPosition.jsx
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CandidateCard from './CandidateCard';
import './Voting.css'; 

const candidatesData = {
  1: [
    { id: 1, name: 'Candidate A', description: 'Description of Candidate A' },
    { id: 2, name: 'Candidate B', description: 'Description of Candidate B' },
  ],
  2: [
    { id: 3, name: 'Candidate C', description: 'Description of Candidate C' },
    { id: 4, name: 'Candidate D', description: 'Description of Candidate D' },
  ],
  // Add candidates for other positions similarly...
};

export default function VoteForPosition() {
  const { positionId } = useParams();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const candidates = candidatesData[positionId] || [];

  const handleVote = () => {
    if (selectedCandidate) {
      setVoteSubmitted(true);
      console.log(`Voted for: ${selectedCandidate.name}`);
    }
  };

  return (
    <div className="voting-container">
      <h1 className="voting-title">Vote for Position ID: {positionId}</h1>

      {voteSubmitted ? (
        <p className="thank-you-message">Thank you for voting!</p>
      ) : (
        <div className="candidate-list">
          {candidates.map((candidate) => (
            <CandidateCard 
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedCandidate?.id === candidate.id}
              onSelect={setSelectedCandidate}
            />
          ))}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleVote} 
            disabled={!selectedCandidate}
            fullWidth
          >
            Submit Vote
          </Button>
        </div>
      )}
    </div>
  );
}
