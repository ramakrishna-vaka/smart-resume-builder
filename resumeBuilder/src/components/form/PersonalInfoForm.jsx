// src/components/form/PersonalInfoForm.jsx
import React from 'react';

const PersonalInfoForm = ({ formData, handleChange }) => {
  return (
    <div className="row g-3">
      
      <div className="col-md-6">
        <label htmlFor="firstName" className="form-label">First Name</label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="col-md-6">
        <label htmlFor="lastName" className="form-label">Last Name</label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="col-12">
        <label htmlFor="professionalTitle" className="form-label">Professional Title</label>
        <input
          type="text"
          className="form-control"
          id="professionalTitle"
          placeholder="e.g. Web Developer, Software Engineer, Data Scientist, Intern"
          value={formData.professionalTitle}
          onChange={handleChange}
        />
      </div>

      <div className="col-12">
        <label htmlFor="introduction" className="form-label">Professional Introduction</label>
        <textarea
          className="form-control auto-resize"
          id="introduction"
          rows="4"
          placeholder="Write a brief introduction about yourself, your background, skills, and career goals...(optional)"
          value={formData.introduction}
          onChange={handleChange}
        ></textarea>
      </div>
      
      <div className="col-md-6">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder=""
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="col-md-6">
        <label htmlFor="phoneNo" className="form-label">Phone Number</label>
        <input
          type="text"
          className="form-control"
          id="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="col-md-6">
        <label htmlFor="linkedinUrl" className="form-label">LinkedIn Profile URL</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fab fa-linkedin"></i>
          </span>
          <input
            type="url"
            className="form-control"
            id="linkedinUrl"
            placeholder=""
            value={formData.linkedinUrl}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="col-md-6">
        <label htmlFor="githubUrl" className="form-label">GitHub Profile URL</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fab fa-github"></i>
          </span>
          <input
            type="url"
            className="form-control"
            id="githubUrl"
            placeholder=""
            value={formData.githubUrl}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="col-md-6">
        <label htmlFor="leetcodeUrl" className="form-label">Coding Profile URL</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-code"></i>
          </span>
          <input
            type="url"
            className="form-control"
            id="leetcodeUrl"
            placeholder="Tip: Add Ur LeetCode profile URL"
            value={formData.leetcodeUrl}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="col-md-6">
        <label htmlFor="portfolioUrl" className="form-label">Portfolio Website</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-globe"></i>
          </span>
          <input
            type="url"
            className="form-control"
            id="portfolioUrl"
            placeholder="Your personal portfolio or website URL"
            value={formData.portfolioUrl}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;