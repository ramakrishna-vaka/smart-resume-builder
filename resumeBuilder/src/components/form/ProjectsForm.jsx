// src/components/form/ProjectsForm.jsx
import React from 'react';
import '../../styles/ProjectsForm.css'; 

const ProjectsForm = ({ projects, handleProjectChange, removeProject }) => {
  // Function to adjust textarea height dynamically
  const adjustTextareaHeight = (e) => {
    const textarea = e.target;
    // Reset height to auto to properly calculate scroll height
    textarea.style.height = 'auto';
    // Set the height to the scroll height to fit all content
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div>
      {projects.map((project, index) => (
        <div key={index} className="mb-4 project-card border rounded p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Project {index + 1}</h6>
            {projects.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeProject(index)}
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor={`projectName${index}`} className="form-label">Project Name</label>
              <input
                type="text"
                className="form-control"
                id={`projectName${index}`}
                placeholder=""
                value={project.projectName}
                onChange={(e) => handleProjectChange(index, 'projectName', e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor={`projectLink${index}`} className="form-label">Deployment Link</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-external-link-alt"></i>
                </span>
                <input
                  type="url"
                  className="form-control small-placeholder"
                  id={`projectLink${index}`}
                  placeholder="Tip: Add your GitHub Link if you haven't deployed it"
                  value={project.projectLink || ''}
                  onChange={(e) => handleProjectChange(index, 'projectLink', e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-100 px-3">
              <label htmlFor={`projectTechStack${index}`} className="form-label">Technologies Used</label>
              <input
                type="text"
                className="form-control"
                id={`projectTechStack${index}`}
                placeholder=""
                value={project.projectTechStack}
                onChange={(e) => handleProjectChange(index, 'projectTechStack', e.target.value)}
                required
              />
            </div>

            
            
            {/* <div className="col-md-6">
              <label htmlFor={`githubLink${index}`} className="form-label">GitHub Repository URL</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fab fa-github"></i>
                </span>
                <input
                  type="url"
                  className="form-control"
                  id={`githubLink${index}`}
                  placeholder=""
                  value={project.githubLink || ''}
                  onChange={(e) => handleProjectChange(index, 'githubLink', e.target.value)}
                />
              </div>
              <div className="form-text"></div>
            </div> */}
            
            <div className="col-12">
              <label htmlFor={`projectDescription${index}`} className="form-label">Description</label>
              <textarea
                className="form-control auto-resize"
                id={`projectDescription${index}`}
                placeholder=""
                value={project.projectDescription}
                onChange={(e) => {
                  handleProjectChange(index, 'projectDescription', e.target.value);
                  adjustTextareaHeight(e);
                }}
                onFocus={(e) => adjustTextareaHeight(e)}
                style={{ minHeight: '80px', overflowY: 'hidden' }}
                required
              ></textarea>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsForm;