// src/components/form/EducationForm.jsx
import React from 'react';

const EducationForm = ({ formData, handleChange }) => {
  return (
    <div>
      {/* Graduation */}
      <div className="mb-4">
        <h5 className="mb-3">College/University</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="graduationCollegeName" className="form-label">Institution Name</label>
            <input
              type="text"
              className="form-control"
              id="graduationCollegeName"
              placeholder="e.g., Stanford University"
              value={formData.graduationCollegeName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="graduationCollegeAddress" className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              id="graduationCollegeAddress"
              placeholder="e.g., Palo Alto, CA"
              value={formData.graduationCollegeAddress}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="graduationDegree" className="form-label">Degree</label>
            <select
              className="form-select"
              id="graduationDegree"
              value={formData.graduationDegree}
              onChange={handleChange}
              required
            >
              <option value="">Select Degree</option>
              <option value="BS">BS</option>
              <option value="BA">BA</option>
              <option value="BSc">BSc</option>
              <option value="BTech">BTech</option>
              <option value="BE">BE</option>
              <option value="MS">MS</option>
              <option value="MA">MA</option>
              <option value="MSc">MSc</option>
              <option value="MTech">MTech</option>
              <option value="ME">ME</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="col-md-6">
            <label htmlFor="graduationCourse" className="form-label">Field of Study</label>
            <select
              className="form-select"
              id="graduationCourse"
              value={formData.graduationCourse}
              onChange={handleChange}
              required
            >
              <option value="">Select Field</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Data Science">Data Science</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="col-md-6">
            <label htmlFor="graduationScore" className="form-label">GPA</label>
            <input
              type="text"
              className="form-control"
              id="graduationScore"
              placeholder="e.g., 3.8/4.0"
              value={formData.graduationScore}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="graduationCollegePeriod" className="form-label">Time Period</label>
            <input
              type="text"
              className="form-control"
              id="graduationCollegePeriod"
              placeholder="e.g., 2018-2022"
              value={formData.graduationCollegePeriod}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      
      {/* High School/Intermediate */}
      <div className="mb-4">
        <h5 className="mb-3">High School (Optional)</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="interCollegeName" className="form-label">School Name</label>
            <input
              type="text"
              className="form-control"
              id="interCollegeName"
              value={formData.interCollegeName}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="interCollegeAddress" className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              id="interCollegeAddress"
              value={formData.interCollegeAddress}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="interScore" className="form-label">GPA/Score</label>
            <input
              type="text"
              className="form-control"
              id="interScore"
              value={formData.interScore}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="interPeriod" className="form-label">Time Period</label>
            <input
              type="text"
              className="form-control"
              id="interPeriod"
              value={formData.interPeriod}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      {/* Elementary School */}
      <div>
        <h5 className="mb-3">Elementary School (Optional)</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="schoolName" className="form-label">School Name</label>
            <input
              type="text"
              className="form-control"
              id="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="schoolAddress" className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              id="schoolAddress"
              value={formData.schoolAddress}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="schoolScore" className="form-label">GPA/Score</label>
            <input
              type="text"
              className="form-control"
              id="schoolScore"
              value={formData.schoolScore}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="schoolPeriod" className="form-label">Time Period</label>
            <input
              type="text"
              className="form-control"
              id="schoolPeriod"
              value={formData.schoolPeriod}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationForm;