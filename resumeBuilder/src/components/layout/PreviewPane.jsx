// src/components/layout/PreviewPane.jsx
import React from 'react';
import '../../styles/PreviewPane.css';

const PreviewPane = ({ formData }) => {
  const renderSkills = skills =>
    skills?.map(s => s.label).join(', ');
  const renderList = text =>
    text?.split('\n')
      .map(t => t.trim())
      .filter(Boolean)
      .map((item, i) => (
        <div key={i} className="list-item">• {item}</div>
      ));

  return (
    <div className="preview-container">
      <div className="preview-pane">
        {/* Header */}
        <div className="preview-header">
          <h1 className="resume-name">
            {formData.firstName} {formData.lastName}
          </h1>
          <div className="contact-info">
            {formData.phoneNo && <span>{formData.phoneNo}</span>}
            {formData.phoneNo && formData.email && <span> • </span>}
            {formData.email && <span>{formData.email}</span>}
            {(formData.phoneNo || formData.email) && formData.username && <span> • </span>}
            {formData.username && <span>@{formData.username}</span>}
          </div>
        </div>

        {/* Education */}
        {(formData.graduationCollegeName ||
          formData.interCollegeName ||
          formData.schoolName) && (
          <div className="resume-section">
            <h2 className="section-heading">Education</h2>
            {formData.graduationCollegeName && (
              <div className="education-item">
                <h3 className="item-title">{formData.graduationCollegeName}</h3>
                <div className="edu-line">
                  <span>
                    {formData.graduationDegree} in {formData.graduationCourse}
                  </span>
                  <span className="period-text">{formData.graduationCollegePeriod}</span>
                </div>
                <div className="edu-line">
                  <span>GPA: {formData.graduationScore}</span>
                  <span className="period-text">{formData.graduationCollegeAddress}</span>
                </div>
              </div>
            )}
            {formData.interCollegeName && (
              <div className="education-item">
                <h3 className="item-title">{formData.interCollegeName}</h3>
                <div className="edu-line">
                  <span>Intermediate</span>
                  <span className="period-text">{formData.interPeriod}</span>
                </div>
                {formData.interScore && <div className="edu-line"><span>GPA: {formData.interScore}</span><span/></div>}
              </div>
            )}
            {formData.schoolName && (
              <div className="education-item">
                <h3 className="item-title">{formData.schoolName}</h3>
                <div className="edu-line">
                  <span>High School</span>
                  <span className="period-text">{formData.schoolPeriod}</span>
                </div>
                {formData.schoolScore && <div className="edu-line"><span>GPA: {formData.schoolScore}</span><span/></div>}
              </div>
            )}
          </div>
        )}

        {/* Technical Skills */}
        {formData.skills?.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading">Technical Skills</h2>
            <div className="skills-content">
              <strong>Languages and Technologies:</strong> {renderSkills(formData.skills)}
            </div>
          </div>
        )}

        {/* Experience */}
        {formData.isThereExperience && formData.experienceCompany && (
          <div className="resume-section">
            <h2 className="section-heading">Experience</h2>
            <div className="experience-item">
              <h3 className="item-title">
                {formData.experienceRole} — {formData.experienceCompany}
              </h3>
              <div className="edu-line">
                <span className="tech-stack">{formData.experienceTechStack}</span>
                <span className="period-text">{formData.experiencePeriod}</span>
              </div>
              <div className="description-text">
                {renderList(formData.experienceDescription)}
              </div>
            </div>
          </div>
        )}

        {/* Projects */}
        {formData.projects?.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading">Projects</h2>
            {formData.projects.map((p, i) =>
              p.projectName ? (
                <div key={i} className="project-item">
                  <h3 className="item-title">{p.projectName}</h3>
                  {p.projectTechStack && (
                    <div className="edu-line">
                      <span className="tech-stack">{p.projectTechStack}</span>
                      <span className="period-text" />
                    </div>
                  )}
                  <div className="description-text">
                    {renderList(p.projectDescription)}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Achievements */}
        {formData.achievements && (
          <div className="resume-section">
            <h2 className="section-heading">Achievements</h2>
            <div className="description-text">{renderList(formData.achievements)}</div>
          </div>
        )}

        {/* Certifications */}
        {formData.certifications && (
          <div className="resume-section">
            <h2 className="section-heading">Certifications</h2>
            <div className="description-text">{renderList(formData.certifications)}</div>
          </div>
        )}

        {/* Extra‑Curricular */}
        {formData.extraCircularActivities && (
          <div className="resume-section">
            <h2 className="section-heading">Extra Curricular Activities</h2>
            <div className="description-text">{renderList(formData.extraCircularActivities)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;
