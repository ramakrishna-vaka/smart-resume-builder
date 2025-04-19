// src/components/form/AdditionalInfoForm.jsx
import React from 'react';

const AdditionalInfoForm = ({ formData, handleChange }) => {
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
      <div className="col-12">
        <label htmlFor="achievements" className="form-label">Achievements (Optional)</label>
        <textarea
          className="form-control auto-resize"
          id="achievements"
          rows="2"
          placeholder="List any awards, recognitions, or personal achievements"
          value={formData.achievements}
          onChange={(e) => {
            handleChange(e);
            adjustTextareaHeight(e);
          }}
          onFocus={(e) => adjustTextareaHeight(e)}
          style={{ minHeight: '60px', overflowY: 'hidden' }}
        ></textarea>
      </div>
      
      <div className="col-12">
        <label htmlFor="certifications" className="form-label">Certifications (Optional)</label>
        <textarea
          className="form-control auto-resize"
          id="certifications"
          rows="2"
          placeholder="List any relevant certifications"
          value={formData.certifications}
          onChange={(e) => {
            handleChange(e);
            adjustTextareaHeight(e);
          }}
          onFocus={(e) => adjustTextareaHeight(e)}
          style={{ minHeight: '60px', overflowY: 'hidden' }}
        ></textarea>
      </div>
      
      <div className="col-12">
        <label htmlFor="extraCircularActivities" className="form-label">Extra-curricular Activities (Optional)</label>
        <textarea
          className="form-control auto-resize"
          id="extraCircularActivities"
          rows="2"
          placeholder="Mention any clubs, organizations, volunteer work, etc."
          value={formData.extraCircularActivities}
          onChange={(e) => {
            handleChange(e);
            adjustTextareaHeight(e);
          }}
          onFocus={(e) => adjustTextareaHeight(e)}
          style={{ minHeight: '60px', overflowY: 'hidden' }}
        ></textarea>
      </div>
      
      <div className="col-12">
        <label htmlFor="jobDescription" className="form-label">Target Job Description (Optional)</label>
        <textarea
          className="form-control auto-resize"
          id="jobDescription"
          rows="3"
          placeholder="Paste the job description you're applying for to better tailor your resume"
          value={formData.jobDescription}
          onChange={(e) => {
            handleChange(e);
            adjustTextareaHeight(e);
          }}
          onFocus={(e) => adjustTextareaHeight(e)}
          style={{ minHeight: '80px', overflowY: 'hidden' }}
        ></textarea>
        <div className="form-text">This helps our AI better tailor your resume but won't be included in the output</div>
      </div>
    </div>
  );
};

export default AdditionalInfoForm;