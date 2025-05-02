// src/pages/TemplateSelection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import '../styles/TemplateSelection.css';
import professionalTemplate from '../assets/profesional.png';
import modernTemplate from '../assets/modern.png';
import minimalTemplate from '../assets/minimal.jpeg';
import creativeTemplate from '../assets/creative.png';

const TemplateSelection = () => {
  const { user } = useUser();

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      thumbnail: professionalTemplate,
      description: 'Clean and traditional design perfect for corporate roles'
    },
    {
      id: 'modern',
      name: 'Modern',
      thumbnail: modernTemplate,
      description: 'Contemporary design with a creative edge'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      thumbnail: minimalTemplate,
      description: 'Sleek and simple design focused on content'
    },
    {
      id: 'creative',
      name: 'Creative',
      thumbnail: creativeTemplate,
      description: 'Bold design for design and creative industry roles'
    }
  ];

  return (
    <div className="template-selection container py-5">
      <div className="text-center mb-5">
        <h1 className="mb-3">Welcome, {user?.firstName || 'User'}</h1>
        <p className="lead text-muted">
          Choose a template to start building your professional resume
        </p>
      </div>

      <div className="row g-4">
        {templates.map(template => (
          <div key={template.id} className="col-lg-3 col-md-6">
            <div className="card h-100 border-0 shadow-sm template-card">
              <div className="template-thumbnail-container">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="card-img-top template-thumbnail"
                  onError={(e) => {
                    e.target.src = `/api/placeholder/300/400`;
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{template.name}</h5>
                <p className="card-text text-muted">{template.description}</p>
              </div>
              <div className="card-footer bg-white border-0 pb-3">
                {template.id === 'professional' ? (
                  <Link
                    to={`/job-description/${template.id}`}
                    className="btn btn-primary w-100"
                  >
                    Use This Template
                  </Link>
                ) : (
                  <button className="btn btn-secondary w-100" disabled>
                    Coming Soon...
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;
