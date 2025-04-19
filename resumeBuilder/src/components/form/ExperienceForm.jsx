// src/components/form/ExperienceForm.jsx
import React from 'react';

const ExperienceForm = ({ formData, handleChange }) => {
  // Function to adjust textarea height dynamically
  const adjustTextareaHeight = (e) => {
    const textarea = e.target;
    // Reset height to auto to properly calculate scroll height
    textarea.style.height = 'auto';
    // Set the height to the scroll height to fit all content
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label htmlFor="experienceCompany" className="form-label">Company Name</label>
        <input
          type="text"
          className="form-control"
          id="experienceCompany"
          placeholder="e.g., Google Inc."
          value={formData.experienceCompany}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="col-md-6">
        <label htmlFor="experienceRole" className="form-label">Job Title / Role</label>
        <input
          type="text"
          className="form-control"
          id="experienceRole"
          placeholder="e.g., Senior Software Engineer"
          value={formData.experienceRole}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="col-md-6">
        <label htmlFor="experiencePeriod" className="form-label">Duration</label>
        <input
          type="text"
          className="form-control"
          id="experiencePeriod"
          placeholder="e.g., Jan 2020 - Present"
          value={formData.experiencePeriod}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="col-md-6">
        <label htmlFor="experienceTechStack" className="form-label">Technologies Used</label>
        <input
          type="text"
          className="form-control"
          id="experienceTechStack"
          placeholder="e.g., React, Node.js, AWS"
          value={formData.experienceTechStack}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="col-12">
        <label htmlFor="experienceDescription" className="form-label">Job Description</label>
        <textarea
          className="form-control auto-resize"
          id="experienceDescription"
          rows="3"
          placeholder="Describe your responsibilities, achievements, and impact"
          value={formData.experienceDescription}
          onChange={(e) => {
            handleChange(e);
            adjustTextareaHeight(e);
          }}
          onFocus={(e) => adjustTextareaHeight(e)}
          style={{ minHeight: '80px', overflowY: 'hidden' }}
          required
        ></textarea>
      </div>
    </div>
  );
};

export default ExperienceForm;