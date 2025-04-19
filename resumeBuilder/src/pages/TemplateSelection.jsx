// src/pages/TemplateSelection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import '../styles/TemplateSelection.css';

const TemplateSelection = () => {
  const { user } = useUser();
  
  // Template data with images
  const templates = [
    { 
      id: 'professional', 
      name: 'Professional', 
      thumbnail: '/templates/professional.jpg',
      description: 'Clean and traditional design perfect for corporate roles'
    },
    { 
      id: 'modern', 
      name: 'Modern', 
      thumbnail: '/templates/modern.jpg',
      description: 'Contemporary design with a creative edge'
    },
    { 
      id: 'minimal', 
      name: 'Minimal', 
      thumbnail: '/templates/minimal.jpg',
      description: 'Sleek and simple design focused on content'
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      thumbnail: '/templates/creative.jpg',
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
                  src={template.thumbnail || `/api/placeholder/300/400`}
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
                <Link 
                  to={`/job-description/${template.id}`} 
                  className="btn btn-primary w-100"
                >
                  Use This Template
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;