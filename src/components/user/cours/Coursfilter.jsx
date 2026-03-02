import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './etudiant.css'; // New CSS file for filter-specific styles

const Coursfilter = ({ selectedLevel, onLevelChange }) => {
  const levels = ['Debutant', 'Intermediaire', 'Avancé'];

  return (
    <div className="cours-filter">
      <h3 className="filter-title">Filtrer par niveau</h3>
      <div className="filter-group">
        <Form.Check
          type="radio"
          id="level-all"
          name="level"
          label="Tous les niveaux"
          checked={selectedLevel === 'all'}
          onChange={() => onLevelChange('all')}
          className="filter-option"
        />
        {levels.map((level) => (
          <Form.Check
            key={level}
            type="radio"
            id={`level-${level}`}
            name="level"
            label={level}
            checked={selectedLevel === level}
            onChange={() => onLevelChange(level)}
            className="filter-option"
          />
        ))}
      </div>
      <Button
        onClick={() => onLevelChange('all')}
        className="filter-reset-button"
      >
        Réinitialiser
      </Button>
    </div>
  );
};

export default Coursfilter;