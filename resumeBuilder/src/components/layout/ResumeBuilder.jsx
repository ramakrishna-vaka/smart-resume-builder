// src/components/layout/ResumeBuilder.jsx
import React, { useState, useEffect, useRef } from 'react';
import FormContainer from '../form/FormContainer';
import PreviewPane from './PreviewPane';
import ResumeNavHeader from './ResumeNavHeader';
import EnhanceButton from '../controls/EnhanceButton';
import StatusIndicators from '../ui/StatusIndicators';
import { initialFormState } from '../../utils/formInitialState';
import '../../styles/ResumeNavHeader.css';
import '../../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [isDirty, setIsDirty] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [resumeGenerated, setResumeGenerated] = useState(false);
  const [saveDataForFuture, setSaveDataForFuture] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // State for ResumeNavBar
  const [activeSectionId, setActiveSectionId] = useState('personal-info');
  
  // Define resume sections for the NavBar
  const resumeSections = [
    { id: 'personal-info', title: 'Personal Information' },
    { id: 'education', title: 'Education' },
    { id: 'experience', title: 'Experience' },
    { id: 'projects', title: 'Projects' },
    { id: 'skills', title: 'Skills' },
    { id: 'additional-info', title: 'Additional Information' }
  ];

  // Refs for section elements in the FormContainer
  const formContainerRef = useRef(null);

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const mainHeader = document.querySelector('header.sticky-top');
      const resumeHeader = document.querySelector('.resume-nav-header');
      
      const mainHeaderHeight = mainHeader?.offsetHeight || 60;
      const resumeHeaderHeight = resumeHeader?.offsetHeight || 50;
      const totalHeaderHeight = mainHeaderHeight + resumeHeaderHeight;
  
      const sections = formContainerRef.current?.querySelectorAll('[data-section-id]');
      if (!sections) return;
      
      const scrollPosition = window.scrollY + totalHeaderHeight + 10;
  
      let currentSection = resumeSections[0].id;
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = section.dataset.sectionId;
        }
      });
  
      setActiveSectionId(currentSection);
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [resumeSections]);

  const handleFormDataChange = (updatedData, source = 'user') => {
    setFormData(updatedData);
    
    // Only mark as dirty if changes come from user
    if (source === 'user') {
      // Create a diff of what fields changed
      const changedFields = {};
      Object.keys(updatedData).forEach(key => {
        if (JSON.stringify(updatedData[key]) !== JSON.stringify(formData[key])) {
          changedFields[key] = true;
        }
      });
      
      // Update isDirty state with the new changes
      setIsDirty(prev => ({
        ...prev,
        ...changedFields
      }));

      // Clear any status messages when the user makes changes
    // This prevents showing outdated success/error messages
    setSuccessMessage('');
    setErrorMessage('');
    }
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      // Format data to match server expectations
      const formattedData = {
        ...formData,
        skills: formData.skills.map((skill) => typeof skill === 'object' ? skill.value : skill),
      };
      
      // Skip enhancement if no job description is provided
      if (!formattedData.jobDescription) {
        setErrorMessage('Please provide a job description for enhancement');
        return;
      }
      
      const enhancementResponse = await fetch('http://localhost:3000/enhance/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData: formattedData }),
      });
      
      if (enhancementResponse.ok) {
        const enhancementResult = await enhancementResponse.json();
        const enhancedData = enhancementResult.enhancedData || {};
        
        // Start with our current form data
        const mergedData = { ...formData };
        
        // CORRECTED LOGIC: Update fields ONLY IF they are dirty (user changed them)
        // or they haven't been enhanced before
        
        // Skills - enhance if dirty or not previously enhanced
        if (isDirty.skills && Array.isArray(enhancedData.enhancedSkills)) {
          mergedData.skills = enhancedData.enhancedSkills.map(skill => 
            typeof skill === 'string' ? { value: skill, label: skill } : skill
          );
        }
        
        // Projects - needs more comprehensive handling
        if (isDirty.projects && Array.isArray(enhancedData.enhancedProjects)) {
          // Convert enhanced projects to match form data structure
          // This depends on your exact projects structure
          mergedData.projects = enhancedData.enhancedProjects.map(project => ({
            projectName: project.name || "",
            projectTechStack: project.techStack || "",
            projectDescription: project.bullets ? project.bullets.join('\n• ') : ""
          }));
        }
        
        // Experience - enhance individual fields if they are dirty
        if (enhancedData.enhancedExperience && formData.isThereExperience) {
          const exp = enhancedData.enhancedExperience;
          
          // Only update fields that the user modified (are dirty)
          if (isDirty.experienceRole) mergedData.experienceRole = exp.role || mergedData.experienceRole;
          if (isDirty.experienceCompany) mergedData.experienceCompany = exp.company || mergedData.experienceCompany;
          if (isDirty.experiencePeriod) mergedData.experiencePeriod = exp.period || mergedData.experiencePeriod;
          if (isDirty.experienceTechStack) mergedData.experienceTechStack = exp.techStack || mergedData.experienceTechStack;
          
          // Format experience description with bullets
          if (isDirty.experienceDescription && exp.bullets) {
            mergedData.experienceDescription = exp.bullets.join('\n• ');
            if (mergedData.experienceDescription) {
              mergedData.experienceDescription = '• ' + mergedData.experienceDescription;
            }
          }
        }
        
        // Achievements - enhance if dirty
        if (isDirty.achievements && enhancedData.enhancedAchievements) {
          mergedData.achievements = enhancedData.enhancedAchievements;
        }
        
        // Certifications - enhance if dirty
        if (isDirty.certifications && enhancedData.enhancedCertifications) {
          mergedData.certifications = enhancedData.enhancedCertifications;
        }
        
        // Update form data with source='server' to avoid marking these changes as dirty
        handleFormDataChange(mergedData, 'server');
        setSuccessMessage('Resume content has been enhanced!');
        
      } else {
        throw new Error("Enhancement request failed");
      }
    } catch (error) {
      console.error("Error during enhancement:", error);
      setErrorMessage('Failed to enhance resume content. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const loadPreviousData = async () => {
    try {
      // Get the authenticated user's resume data
      const response = await fetch('http://localhost:3000/api/resume-data/fetch', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const { success, data } = await response.json();
        
        if (success && data) {
          // Convert skills back to the format expected by the form (with value/label)
          const formattedData = {
            ...data,
            skills: Array.isArray(data.skills) 
              ? data.skills.map(skill => typeof skill === 'string' 
                  ? { value: skill, label: skill } 
                  : skill)
              : []
          };
          
          // Set form data with server source to avoid marking all fields as dirty
          setFormData(formattedData);
          // Reset dirty state since we're loading from saved data
          setIsDirty({});
          setSuccessMessage('Previous resume data loaded successfully!');
        } else {
          setErrorMessage('No previous resume data found.');
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to load previous data.');
      }
    } catch (error) {
      console.error('Error loading previous data:', error);
      setErrorMessage('Failed to load previous data. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        throw new Error("First name and last name are required");
      }
      
      // Format data to match server expectations - do this once for all operations
      const formattedData = {
        ...formData,
        skills: formData.skills.map((skill) => typeof skill === 'object' ? skill.value : skill) // More robust conversion
      };
      
      // Step 1: Save data to MongoDB if requested by the user
      if (saveDataForFuture) {
        try {
          const saveResponse = await fetch('http://localhost:3000/api/resume-data/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({ resumeData: formattedData })
          });
          
          if (!saveResponse.ok) {
            console.error('Failed to save resume data');
          } else {
            console.log('Resume data saved successfully');
          }
        } catch (saveError) {
          console.error('Error saving resume data:', saveError);
          // Continue with PDF generation even if saving fails
        }
      }
      
      // Step 2: Generate the Resume PDF - Now just sending the formatted data
      const response = await fetch('http://localhost:3000/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalData: formattedData })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error details:', errorText);
        throw new Error(`Failed to generate resume: ${response.statusText}`);
      }
      
      // Process the response
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/pdf')) {
        // Handle PDF download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Set the PDF URL for display/iframe if needed
        setPdfUrl(url);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.firstName}_${formData.lastName}_resume.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        setResumeGenerated(true);
        setSuccessMessage('Resume generated successfully!');
      } else {
        // Handle JSON response
        const data = await response.json();
        
        // If the server returns the PDF URL in JSON instead
        if (data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
          setResumeGenerated(true);
          setSuccessMessage('Resume generated successfully!');
        }
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      setErrorMessage(`Error generating resume: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid px-0">
      {/* Resume Navigation Header */}
      <ResumeNavHeader
        sections={resumeSections}
        activeSectionId={activeSectionId}
        setActiveSectionId={setActiveSectionId}
        loadPreviousData={loadPreviousData}
      />
      
      <div className="container mt-4">
        <div className="row">
          {/* Main Form Content */}
          <div className="form-col col-md-7" ref={formContainerRef}>
            <div className="form-container">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Resume Details</h2>
                <EnhanceButton 
                  onClick={handleEnhance} 
                  isEnhancing={isEnhancing} 
                />
              </div>
              
              <FormContainer 
                formData={formData} 
                onFormDataChange={handleFormDataChange}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                activeSectionId={activeSectionId}
                sections={resumeSections}
              />
              
              {/* Save Data Checkbox */}
              <div className="form-check mt-3 mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="saveDataCheckbox"
                  checked={saveDataForFuture}
                  onChange={(e) => setSaveDataForFuture(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="saveDataCheckbox">
                  Save this data for future use?
                </label>
              </div>
              
              {/* Status Indicators */}
              <StatusIndicators 
                isLoading={isLoading}
                successMessage={successMessage}
                errorMessage={errorMessage}
                extractedSkills={extractedSkills}
                resumeGenerated={resumeGenerated}
                pdfUrl={pdfUrl}
              />
            </div>
          </div>
          
          {/* Preview Section - Right Column */}
          <div className="preview-col col-md-5">
            <div className="sticky-top preview-container" style={{ 
              top: '110px',
              zIndex: 1020
            }}>
              <h2>Resume Preview</h2>
              <PreviewPane formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
