// src/components/form/FormContainer.jsx (updated)
import React, { useEffect } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import ProjectsForm from './ProjectsForm';
import SkillsForm from './SkillsForm';
import AdditionalInfoForm from './AdditionalInfoForm';

const FormContainer = ({ 
  formData,
  onFormDataChange, 
  onSubmit, 
  isLoading, 
  activeSectionId,
  sections }) => {
  // Function to adjust all textareas when the component mounts
  useEffect(() => {
    const adjustAllTextareas = () => {
      document.querySelectorAll('textarea.auto-resize').forEach(textarea => {
        // Reset height to auto to properly calculate scroll height
        textarea.style.height = 'auto';
        // Set the height to the scroll height to fit all content
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    };
    
    // Adjust on mount and whenever form data changes
    adjustAllTextareas();
    
    // Add global handler for textarea inputs
    const handleTextareaInput = (e) => {
      if (e.target.classList.contains('auto-resize')) {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      }
    };
    
    // Add event listener
    document.addEventListener('input', handleTextareaInput);
    
    // Cleanup
    return () => {
      document.removeEventListener('input', handleTextareaInput);
    };
  }, [formData]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const updatedFormData = {
      ...formData,
      [id]: newValue
    };
    
    onFormDataChange(updatedFormData);
  };

  const handleSkillsChange = (selectedOptions) => {
    const updatedFormData = {
      ...formData,
      skills: selectedOptions
    };
    
    onFormDataChange(updatedFormData);
  };

  // Project handlers
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    
    const updatedFormData = {
      ...formData,
      projects: updatedProjects
    };
    
    onFormDataChange(updatedFormData);
  };

  const addProject = () => {
    const updatedFormData = {
      ...formData,
      projects: [
        ...formData.projects,
        { 
          projectName: '', 
          projectTechStack: '', 
          projectDescription: '',
          projectLink: '',
          githubLink: ''
        }
      ]
    };
    
    onFormDataChange(updatedFormData);
  };

  const removeProject = (index) => {
    const updatedProjects = [...formData.projects];
    updatedProjects.splice(index, 1);
    
    const updatedFormData = {
      ...formData,
      projects: updatedProjects
    };
    
    onFormDataChange(updatedFormData);
  };

  // Experience handlers
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    
    const updatedFormData = {
      ...formData,
      experiences: updatedExperiences
    };
    
    onFormDataChange(updatedFormData);
  };
  
  const addExperience = () => {
    // Use the onFormDataChange prop instead of direct setFormData
    onFormDataChange({
      ...formData,
      experiences: [
        ...(formData.experiences || []),
        {
          company: '',
          role: '',
          period: '',
          description: '',
          techStack: ''
        }
      ]
    });
  };
  
  const removeExperience = (index) => {
    if (formData.experiences.length <= 1) return;
    
    const updatedExperiences = [...formData.experiences];
    updatedExperiences.splice(index, 1);
    
    const updatedFormData = {
      ...formData,
      experiences: updatedExperiences
    };
    
    onFormDataChange(updatedFormData);
  };

  // New handler for Certifications
  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...(formData.certifications || [])];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value
    };
    
    const updatedFormData = {
      ...formData,
      certifications: updatedCertifications
    };
    
    onFormDataChange(updatedFormData);
  };

  const addCertification = () => {
    const updatedFormData = {
      ...formData,
      certifications: [
        ...(formData.certifications || []),
        {
          name: '',
          issuer: '',
          date: '',
          link: '',
          description: ''
        }
      ]
    };
    
    onFormDataChange(updatedFormData);
  };

  const removeCertification = (index) => {
    const updatedCertifications = [...(formData.certifications || [])];
    updatedCertifications.splice(index, 1);
    
    const updatedFormData = {
      ...formData,
      certifications: updatedCertifications
    };
    
    onFormDataChange(updatedFormData);
  };

  // New handler for Achievements
  const handleAchievementChange = (index, field, value) => {
    const updatedAchievements = [...(formData.achievements || [])];
    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [field]: value
    };
    
    const updatedFormData = {
      ...formData,
      achievements: updatedAchievements
    };
    
    onFormDataChange(updatedFormData);
  };

  const addAchievement = () => {
    const updatedFormData = {
      ...formData,
      achievements: [
        ...(formData.achievements || []),
        {
          title: '',
          year: '',
          organization: '',
          description: ''
        }
      ]
    };
    
    onFormDataChange(updatedFormData);
  };

  const removeAchievement = (index) => {
    const updatedAchievements = [...(formData.achievements || [])];
    updatedAchievements.splice(index, 1);
    
    const updatedFormData = {
      ...formData,
      achievements: updatedAchievements
    };
    
    onFormDataChange(updatedFormData);
  };

  // New handler for Extracurricular Activities
  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...(formData.extracurricularActivities || [])];
    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value
    };
    
    const updatedFormData = {
      ...formData,
      extracurricularActivities: updatedActivities
    };
    
    onFormDataChange(updatedFormData);
  };

  const addActivity = () => {
    const updatedFormData = {
      ...formData,
      extracurricularActivities: [
        ...(formData.extracurricularActivities || []),
        {
          name: '',
          role: '',
          organization: '',
          period: '',
          description: ''
        }
      ]
    };
    
    onFormDataChange(updatedFormData);
  };

  const removeActivity = (index) => {
    const updatedActivities = [...(formData.extracurricularActivities || [])];
    updatedActivities.splice(index, 1);
    
    const updatedFormData = {
      ...formData,
      extracurricularActivities: updatedActivities
    };
    
    onFormDataChange(updatedFormData);
  };

  // Toggle experience section
  const handleToggleExperience = (e) => {
    const hasExperience = e.target.checked;
    const updatedFormData = { ...formData, hasExperience };
    
    // If turning on experience, initialize with one empty experience
    if (hasExperience && (!formData.experiences || formData.experiences.length === 0)) {
      updatedFormData.experiences = [{ company: '', role: '', period: '', techStack: '', description: '' }];
    }
    
    onFormDataChange(updatedFormData);
  };

  React.useEffect(() => {
    if (formData.hasExperience && (!formData.experiences || formData.experiences.length === 0)) {
      onFormDataChange({
        ...formData,
        experiences: [{ company: '', role: '', period: '', techStack: '', description: '' }]
      });
    }
  }, [formData.hasExperience]);
  

  return (
    <div className="form-container">
      <h2 className="mb-4">Build Your Professional Resume</h2>
      <form className="needs-validation" noValidate onSubmit={onSubmit}>
        {/* Personal Information */}
        <div className="card mb-4 shadow-sm" data-section-id="personal-info">
          <div className="card-header bg-light">
            <h4 className="mb-0">Personal Information</h4>
          </div>
          <div className="card-body">
            <PersonalInfoForm 
              formData={formData} 
              handleChange={handleChange} 
            />
          </div>
        </div>
        
        {/* Education */}
        <div className="card mb-4 shadow-sm" data-section-id="education">
          <div className="card-header bg-light">
            <h4 className="mb-0">Education</h4>
          </div>
          <div className="card-body">
            <EducationForm 
              formData={formData} 
              handleChange={handleChange} 
            />
          </div>
        </div>
        
        {/* Experience */}
        <div className="card mb-4 shadow-sm" data-section-id="experience">
          <div className="card-header bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Experience</h4>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hasExperience"
                  checked={formData.hasExperience || false}
                  onChange={handleToggleExperience}
                />
                <label className="form-check-label" htmlFor="hasExperience">
                  I have work experience
                </label>
              </div>
            </div>
          </div>
          {formData.hasExperience && (
            <div className="card-body">
              <ExperienceForm 
                formData={formData} 
                handleExperienceChange={handleExperienceChange}
                addExperience={addExperience}
                removeExperience={removeExperience}
              />
            </div>
          )}
        </div>
        
        {/* Projects */}
        <div className="card mb-4 shadow-sm" data-section-id="projects">
          <div className="card-header bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Projects</h4>
              <button 
                type="button" 
                className="btn btn-sm btn-primary"
                onClick={addProject}
              >
                Add Project
              </button>
            </div>
          </div>
          <div className="card-body">
            <ProjectsForm 
              projects={formData.projects}
              handleProjectChange={handleProjectChange}
              removeProject={removeProject}
            />
          </div>
        </div>
        
        {/* Skills */}
        <div className="card mb-4 shadow-sm" data-section-id="skills">
          <div className="card-header bg-light">
            <h4 className="mb-0">Technical Skills</h4>
          </div>
          <div className="card-body">
            <SkillsForm 
              skills={formData.skills}
              handleSkillsChange={handleSkillsChange}
            />
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="card mb-4 shadow-sm" data-section-id="additional-info">
          <div className="card-header bg-light">
            <h4 className="mb-0">Additional Information</h4>
          </div>
          <div className="card-body">
            <AdditionalInfoForm 
              formData={formData}
              handleChange={handleChange}
              handleCertificationChange={handleCertificationChange}
              handleAchievementChange={handleAchievementChange}
              handleActivityChange={handleActivityChange}
              addCertification={addCertification}
              removeCertification={removeCertification}
              addAchievement={addAchievement}
              removeAchievement={removeAchievement}
              addActivity={addActivity}
              removeActivity={removeActivity}
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="d-grid gap-2">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generating Resume...
              </>
            ) : (
              'Generate Resume'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormContainer;