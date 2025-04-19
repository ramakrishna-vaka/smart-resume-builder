// src/pages/JobDescriptionPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JobDescriptionPage.css';

const JobDescriptionPage = () => {
  const [jobDescription, setJobDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (jobDescription.trim()) {
      // Store job description in localStorage or state management
      localStorage.setItem('jobDescription', jobDescription);
    }
    // Proceed to next page (likely information input)
    navigate('/generate-resume/templateId'); // Replace 'templateId' with actual template ID
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