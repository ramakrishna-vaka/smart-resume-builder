// components/layout/ResumeNavHeader.jsx
import React from 'react';
import '../../styles/ResumeNavHeader.css';

const ResumeNavHeader = ({ sections = [], activeSectionId = '', setActiveSectionId = () => {}, loadPreviousData = () => {} }) => {
  const scrollToSection = (sectionId) => {
    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (section) {
      const mainHeader = document.querySelector('header.sticky-top');
      const resumeHeader = document.querySelector('.resume-nav-header');
      
      const mainHeaderHeight = mainHeader?.offsetHeight || 60;
      const resumeHeaderHeight = resumeHeader?.offsetHeight || 50;
      const totalHeaderHeight = mainHeaderHeight + resumeHeaderHeight;
  
      const sectionPosition = section.offsetTop - totalHeaderHeight + 10;
      
      window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
      });
  
      setTimeout(() => {
        setActiveSectionId(sectionId);
      }, 300);
    }
  };

  return (
    <div className="resume-nav-header">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-2"> {/* Reduced padding */}
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-primary btn-sm" // Smaller button
              onClick={loadPreviousData} 
            >
              Use Previous Data
            </button>
          </div>
          
          <div className="d-flex flex-nowrap resume-sections align-items-center">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`btn nav-section-btn ${
                  activeSectionId === section.id ? 'active' : ''
                }`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeNavHeader;