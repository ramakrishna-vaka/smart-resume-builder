// Improved JobDescriptionPage.jsx with session storage
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JobDescriptionPage.css';

const JobDescriptionPage = () => {
  // Initialize state from sessionStorage if available
  const [jobDescription, setJobDescription] = useState(() => {
    return sessionStorage.getItem('jobDescription') || '';
  });
  const navigate = useNavigate();

  // Save to sessionStorage whenever jobDescription changes
  useEffect(() => {
    sessionStorage.setItem('jobDescription', jobDescription);
  }, [jobDescription]);

  const handleSubmit = () => {
    // We don't need to explicitly save here since we're using useEffect
    // Navigate to next page
    navigate('/generate-resume/templateId');
  };

  return (
    <div className="job-description-container">
      <h2>Optimize Your Resume</h2>
      <p>Enter a job description to tailor your resume (optional)</p>
      
      <textarea
        className="job-description-textarea"
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={10}
      />

      <button 
        className="job-description-button" 
        onClick={handleSubmit}
      >
        {jobDescription.trim() ? 'Proceed' : 'Continue without job description'}
      </button>
    </div>
  );
};

export default JobDescriptionPage;