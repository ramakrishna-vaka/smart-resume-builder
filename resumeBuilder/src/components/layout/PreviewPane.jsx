// src/components/layout/PreviewPane.jsx
import React from 'react';
import '../../styles/PreviewPane.css';

const PreviewPane = ({ formData }) => {
  const renderSkills = skills =>
    skills?.map(s => s.label).join(', ');
    
  const renderList = text => {
    // Handle case when text is not a string (might be an array or other type)
    if (!text) return null;
    
    // Convert to string if it's not already
    const textString = typeof text === 'string' ? text : String(text);
    
    return textString
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean)
      .map((item, i) => (
        <div key={i} className="list-item">• {item}</div>
      ));
  };

  return (
    <div className="preview-container">
      <div className="preview-pane">
        {/* Header */}
        <div className="preview-header">
          <h1 className="resume-name">
            {formData.firstName} {formData.lastName}
          </h1>
          
          {/* Professional Title */}
          
          <div className='professional-title'>{formData.professionalTitle && (
            <span>{formData.professionalTitle}</span>
          )}</div>
          
          <div className="contact-info">
            {formData.phoneNo && <span>{formData.phoneNo}</span>}
            {formData.phoneNo && formData.email && <span> • </span>}
            {formData.email && <span>{formData.email}</span>}
            
            {(formData.phoneNo || formData.email) && 
             (formData.linkedinUrl || formData.githubUrl || formData.portfolioUrl) && 
             <span> • </span>}
            
            {formData.linkedinUrl && <span>LinkedIn</span>}
            {formData.linkedinUrl && (formData.githubUrl || formData.portfolioUrl) && <span> • </span>}
            
            {formData.githubUrl && <span>GitHub</span>}
            {formData.githubUrl && formData.portfolioUrl && <span> • </span>}
            
            {formData.portfolioUrl && <span>Portfolio</span>}
          </div>
        </div>

        {/* Introduction */}
        {formData.introduction && (
          <div className="resume-section">
            <h2 className="section-heading">Introduction</h2>
            <div className="introduction-content">
              {formData.introduction}
            </div>
            {/* <hr className="section-divider" /> */}
          </div>
        )}

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
        {formData.hasExperience && formData.experiences?.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading">Experience</h2>
            {formData.experiences.map((exp, index) => (
              <div key={index} className="experience-item">
                <h3 className="item-title">
                  {exp.role} — {exp.company}
                </h3>
                <div className="edu-line">
                  <span className="tech-stack">{exp.techStack}</span>
                  <span className="period-text">{exp.period}</span>
                </div>
                {exp.location && (
                  <div className="edu-line">
                    <span className="location-text">{exp.location}</span>
                    <span />
                  </div>
                )}
                <div className="description-text">
                  {renderList(exp.description)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects - Only show if there's content */}
        {formData.projects?.some(p => p.projectName) && (
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

        {/* Certifications */}
        {formData.certifications && formData.certifications.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading">Certifications</h2>
            {formData.certifications.map((cert, index) => (
              <div key={index} className="certification-item">
                <h3 className="item-title">{cert.name}</h3>
                <div className="edu-line">
                  <span className="organization-text">{cert.issuer}</span>
                  <span className="period-text">{cert.date}</span>
                </div>
                {cert.description && (
                  <div className="description-text">
                    {renderList(cert.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {formData.achievements && formData.achievements.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading">Achievements</h2>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <h3 className="item-title">{achievement.title}</h3>
                <div className="edu-line">
                  <span className="organization-text">{achievement.organization}</span>
                  <span className="period-text">{achievement.year}</span>
                </div>
                {achievement.description && (
                  <div className="description-text">
                    {renderList(achievement.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Extracurricular Activities */}
        {formData.extracurricularActivities && formData.extracurricularActivities.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading">Extracurricular Activities</h2>
            {formData.extracurricularActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <h3 className="item-title">{activity.name} {activity.role && `- ${activity.role}`}</h3>
                <div className="edu-line">
                  <span className="organization-text">{activity.organization}</span>
                  <span className="period-text">{activity.period}</span>
                </div>
                {activity.description && (
                  <div className="description-text">
                    {renderList(activity.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;