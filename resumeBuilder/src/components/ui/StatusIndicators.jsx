// src/components/ui/StatusIndicators.jsx
import React from 'react';

const StatusIndicators = ({ 
  isLoading, 
  successMessage, 
  errorMessage, 
  extractedSkills, 
  resumeGenerated, 
  pdfUrl 
}) => {
  return (
    <div className="status-indicators mt-4">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="text-center mt-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Processing your resume...</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
          
          {resumeGenerated && pdfUrl && (
            <div className="mt-2">
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
              >
                View PDF Resume
              </a>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Extracted Skills */}
      {extractedSkills.length > 0 && (
        <div className="alert alert-info mt-3" role="alert">
          <h5 className="alert-heading">Skills Extracted from Job Description:</h5>
          <p>{extractedSkills.join(', ')}</p>
          <hr />
          <p className="mb-0">These skills have been incorporated into your resume.</p>
        </div>
      )}
    </div>
  );
};

export default StatusIndicators;