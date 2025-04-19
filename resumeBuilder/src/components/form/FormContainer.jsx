// src/components/form/FormContainer.jsx
import React, { useEffect } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import ProjectsForm from './ProjectsForm';
import SkillsForm from './SkillsForm';
import AdditionalInfoForm from './AdditionalInfoForm';

const FormContainer = ({ formData, onFormDataChange, onSubmit, isLoading }) => {
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
                  id="isThereExperience"
                  checked={formData.isThereExperience}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="isThereExperience">
                  I have work experience
                </label>
              </div>
            </div>
          </div>
          {formData.isThereExperience && (
            <div className="card-body">
              <ExperienceForm 
                formData={formData} 
                handleChange={handleChange} 
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