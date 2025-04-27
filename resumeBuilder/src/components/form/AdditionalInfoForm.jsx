// src/components/form/AdditionalInfoForm.jsx
import React from 'react';

const AdditionalInfoForm = ({ formData, handleChange, handleCertificationChange, handleAchievementChange, handleActivityChange, addCertification, removeCertification, addAchievement, removeAchievement, addActivity, removeActivity }) => {
  return (
    <div className="additional-info-container">
      {/* Certifications Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Certifications</h5>
          <button 
            type="button" 
            className="btn btn-sm btn-primary"
            onClick={addCertification}
          >
            Add Certification
          </button>
        </div>
        
        {formData.certifications && formData.certifications.length > 0 ? (
          formData.certifications.map((cert, index) => (
            <div key={`cert-${index}`} className="card mb-3">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor={`certName-${index}`} className="form-label">Certification Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`certName-${index}`}
                      value={cert.name}
                      onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`certIssuer-${index}`} className="form-label">Issuing Organization</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`certIssuer-${index}`}
                      value={cert.issuer}
                      onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`certDate-${index}`} className="form-label">Date Issued</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`certDate-${index}`}
                      value={cert.date}
                      onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`certLink-${index}`} className="form-label">Certification Link (Optional)</label>
                    <input
                      type="url"
                      className="form-control"
                      id={`certLink-${index}`}
                      value={cert.link}
                      onChange={(e) => handleCertificationChange(index, 'link', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor={`certDescription-${index}`} className="form-label">Description (Optional)</label>
                    <textarea
                      className="form-control auto-resize"
                      id={`certDescription-${index}`}
                      rows="2"
                      value={cert.description}
                      onChange={(e) => handleCertificationChange(index, 'description', e.target.value)}
                      placeholder="Brief description of the certification and skills acquired"
                      style={{ minHeight: '60px' }}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger"
                      onClick={() => removeCertification(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3 bg-light rounded mb-3">
            <p className="text-muted mb-0">No certifications added yet. Click "Add Certification" to get started.</p>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Achievements</h5>
          <button 
            type="button" 
            className="btn btn-sm btn-primary"
            onClick={addAchievement}
          >
            Add Achievement
          </button>
        </div>
        
        {formData.achievements && formData.achievements.length > 0 ? (
          formData.achievements.map((achievement, index) => (
            <div key={`achievement-${index}`} className="card mb-3">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-8">
                    <label htmlFor={`achievementTitle-${index}`} className="form-label">Achievement Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`achievementTitle-${index}`}
                      value={achievement.title}
                      onChange={(e) => handleAchievementChange(index, 'title', e.target.value)}
                      placeholder="1st Place in Hackathon"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor={`achievementYear-${index}`} className="form-label">Year</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`achievementYear-${index}`}
                      value={achievement.year}
                      onChange={(e) => handleAchievementChange(index, 'year', e.target.value)}
                      placeholder="2023"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor={`achievementOrganization-${index}`} className="form-label">Organization/Event</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`achievementOrganization-${index}`}
                      value={achievement.organization}
                      onChange={(e) => handleAchievementChange(index, 'organization', e.target.value)}
                      placeholder="Google Developer Challenge"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor={`achievementDescription-${index}`} className="form-label">Description</label>
                    <textarea
                      className="form-control auto-resize"
                      id={`achievementDescription-${index}`}
                      rows="2"
                      value={achievement.description}
                      onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                      placeholder="Describe your achievement and its significance"
                      style={{ minHeight: '60px' }}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger"
                      onClick={() => removeAchievement(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3 bg-light rounded mb-3">
            <p className="text-muted mb-0">No achievements added yet. Click "Add Achievement" to get started.</p>
          </div>
        )}
      </div>

      {/* Extracurricular Activities Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Extracurricular Activities</h5>
          <button 
            type="button" 
            className="btn btn-sm btn-primary"
            onClick={addActivity}
          >
            Add Activity
          </button>
        </div>
        
        {formData.extracurricularActivities && formData.extracurricularActivities.length > 0 ? (
          formData.extracurricularActivities.map((activity, index) => (
            <div key={`activity-${index}`} className="card mb-3">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor={`activityName-${index}`} className="form-label">Activity Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`activityName-${index}`}
                      value={activity.name}
                      onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                      placeholder="Volunteer Teaching"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`activityRole-${index}`} className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`activityRole-${index}`}
                      value={activity.role}
                      onChange={(e) => handleActivityChange(index, 'role', e.target.value)}
                      placeholder="Team Lead"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`activityOrganization-${index}`} className="form-label">Organization</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`activityOrganization-${index}`}
                      value={activity.organization}
                      onChange={(e) => handleActivityChange(index, 'organization', e.target.value)}
                      placeholder="Local Community Center"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`activityPeriod-${index}`} className="form-label">Period</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`activityPeriod-${index}`}
                      value={activity.period}
                      onChange={(e) => handleActivityChange(index, 'period', e.target.value)}
                      placeholder="2020 - Present"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor={`activityDescription-${index}`} className="form-label">Description</label>
                    <textarea
                      className="form-control auto-resize"
                      id={`activityDescription-${index}`}
                      rows="2"
                      value={activity.description}
                      onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                      placeholder="Describe your role and impact"
                      style={{ minHeight: '60px' }}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger"
                      onClick={() => removeActivity(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3 bg-light rounded mb-3">
            <p className="text-muted mb-0">No activities added yet. Click "Add Activity" to get started.</p>
          </div>
        )}
      </div>

      {/* Additional Information
      <div className="mb-4">
        <label htmlFor="additionalNotes" className="form-label">Additional Notes (Optional)</label>
        <textarea
          className="form-control auto-resize"
          id="additionalNotes"
          rows="3"
          value={formData.additionalNotes || ''}
          onChange={handleChange}
          placeholder="Any other information you'd like to include in your resume"
          style={{ minHeight: '80px' }}
        />
      </div> */}
    </div>
  );
};

export default AdditionalInfoForm;