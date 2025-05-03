// src/components/controls/EnhanceButton.jsx
import React from 'react';
import '../../styles/EnhanceButton.css';

const EnhanceButton = ({ onClick, isEnhancing, className = '' }) => (
  <button
    className={`btn btn-sm enhance-btn ${className}`}
    onClick={onClick}
    disabled={isEnhancing}
  >
    {isEnhancing ? (
      <>
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Enhancing...
      </>
    ) : (
      <>
        <i className="bi bi-magic me-2"></i>
        Enhance Content
      </>
    )}
  </button>
);

export default EnhanceButton;
