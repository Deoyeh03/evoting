// CandidateCard.jsx
import React from 'react';
import Button from '@mui/material/Button';
import './CandidateCard.css'; // Import external CSS file

const CandidateCard = ({ candidate, isSelected, onSelect }) => {
  return (
    <div 
      className={`candidate-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(candidate)}
    >
      <h2 className="candidate-name">{candidate.name}</h2>
      <p className="candidate-description">{candidate.description}</p>
    </div>
  );
};

export default CandidateCard;
