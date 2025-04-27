// Updated ExperienceForm.jsx
import React from "react";
import { Form, Button } from "react-bootstrap";

const ExperienceForm = ({ 
  formData, 
  handleExperienceChange,
  addExperience,
  removeExperience
}) => {
  // Make sure formData.experiences exists and is an array
  const experiences = Array.isArray(formData.experiences) ? formData.experiences : [];
  
  return (
    <div className="experience-form">
      {experiences.map((experience, index) => (
        <div key={index} className="experience-entry mb-4 border-bottom pb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Experience #{index + 1}</h5>
            {experiences.length > 1 && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => removeExperience(index)}
              >
                Remove
              </Button>
            )}
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              value={experience.company || ""}
              onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
              placeholder="Enter company name"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text" 
              value={experience.role || ""}
              onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
              placeholder="Enter your position title"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Period</Form.Label>
            <Form.Control
              type="text"
              value={experience.period || ""}
              onChange={(e) => handleExperienceChange(index, "period", e.target.value)}
              placeholder=""
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={experience.location || ""}
              onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
              placeholder=""
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Tech Stack/Skills Used</Form.Label>
            <Form.Control
              type="text"
              value={experience.techStack || ""}
              onChange={(e) => handleExperienceChange(index, "techStack", e.target.value)}
              placeholder="Enter technologies used"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              className="auto-resize"
              rows={4}
              value={experience.description || ""}
              onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
              placeholder="Describe your responsibilities and achievements"
            />
          </Form.Group>
        </div>
      ))}
      
      <Button 
        variant="outline-primary" 
        className="w-100" 
        onClick={addExperience}
      >
        Add Another Experience
      </Button>
    </div>
  );
};

export default ExperienceForm;