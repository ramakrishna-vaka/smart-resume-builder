// src/components/layout/ResumeBuilder.jsx
import React, { useState, useEffect, useRef } from 'react';
import FormContainer from '../form/FormContainer';
import PreviewPane from './PreviewPane';
import ResumeNavHeader from './ResumeNavHeader';
import StatusIndicators from '../ui/StatusIndicators';
import { initialFormState } from '../../utils/formInitialState';
import '../../styles/ResumeNavHeader.css';
import '../../styles/ResumeBuilder.css';
import { initStickyPreviewHandler } from '../../utils/stickyPreviewHandler';
import { formatFormDataForApi } from '../../utils/dataFormatter';
import useApiService from '../../services/apiService';

const ResumeBuilder = () => {
  const apiService = useApiService();

  useEffect(() => {
    // Initialize sticky preview handler
    const cleanup = initStickyPreviewHandler();
    return cleanup;
  }, []);

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

  const blobUrlsRef = useRef([]);
  
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

// Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all blob URLs when component unmounts
      if (blobUrlsRef.current && blobUrlsRef.current.length > 0) {
        blobUrlsRef.current.forEach(url => {
          window.URL.revokeObjectURL(url);
        });
        blobUrlsRef.current = [];
      }
    };
  }, []);
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
      for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = section.dataset.sectionId;
          break;
        }
      }
  
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
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Format data to match server expectations
      const formattedData = {
        ...formData,
        skills: formData.skills.map((skill) => typeof skill === 'object' ? skill.value : skill),
      };
      
      const jobDescription = sessionStorage.getItem('jobDescription') || '';
      if (!jobDescription) {
        setErrorMessage('Please provide a job description for enhancement');
        setIsEnhancing(false);
        return;
      }
      
      const enhancementResult = await apiService.enhanceResume(formattedData, jobDescription);
      const enhancedData = enhancementResult.enhancedData || {};
      
      // Start with our current form data
      const mergedData = { ...formData };
      
      // Introduction - enhance if dirty or not previously enhanced
      if (isDirty.introduction && enhancedData.enhancedIntroduction) {
        mergedData.introduction = enhancedData.enhancedIntroduction;
      }
      
      // Professional Title - enhance if dirty or not previously enhanced
      if (isDirty.professionalTitle && enhancedData.enhancedTitle) {
        mergedData.professionalTitle = enhancedData.enhancedTitle;
      }
      
      // Skills - enhance if dirty or not previously enhanced
      if (isDirty.skills && Array.isArray(enhancedData.enhancedSkills)) {
        mergedData.skills = enhancedData.enhancedSkills.map(skill => 
          typeof skill === 'string' ? { value: skill, label: skill } : skill
        );
      }
      
      // Projects - needs more comprehensive handling
      if (isDirty.projects && Array.isArray(enhancedData.enhancedProjects)) {
        mergedData.projects = enhancedData.enhancedProjects.map(project => ({
          projectName: project.name || "",
          projectTechStack: project.techStack || "",
          projectDescription: project.bullets ? '• ' + project.bullets.join('\n• ') : ""
        }));
      }
      
      // Experience - enhance individual fields if they are dirty
      if (isDirty.experiences && Array.isArray(enhancedData.enhancedExperiences)) {
        const enhancedExperiencesFormatted = enhancedData.enhancedExperiences.map(exp => ({
          company: exp.company || '',
          role: exp.role || '',
          period: exp.period || '',
          techStack: exp.techStack || '',
          description: exp.bullets ? '• ' + exp.bullets.join('\n• ') : ''
        }));
        
        if (enhancedExperiencesFormatted.length > 0) {
          mergedData.experiences = enhancedExperiencesFormatted;
        }
      }
      
      // Certifications - enhance if dirty
      if (isDirty.certifications && Array.isArray(enhancedData.enhancedCertifications)) {
        mergedData.certifications = enhancedData.enhancedCertifications.map(cert => ({
          name: cert.name || '',
          issuer: cert.issuer || '',
          date: cert.date || '',
          link: cert.link || '',
          description: cert.description || ''
        }));
      }
  
      // Achievements - enhance if dirty
      if (isDirty.achievements && Array.isArray(enhancedData.enhancedAchievements)) {
        mergedData.achievements = enhancedData.enhancedAchievements.map(achievement => ({
          title: achievement.title || '',
          year: achievement.year || '',
          organization: achievement.organization || '',
          description: achievement.description || ''
        }));
      }
  
      // Extracurricular Activities - enhance if dirty
      if (isDirty.extracurricularActivities && Array.isArray(enhancedData.enhancedActivities)) {
        mergedData.extracurricularActivities = enhancedData.enhancedActivities.map(activity => ({
          name: activity.name || '',
          role: activity.role || '',
          organization: activity.organization || '',
          period: activity.period || '',
          description: activity.description || ''
        }));
      }
      
      // Update form data with source='server' to avoid marking these changes as dirty
      handleFormDataChange(mergedData, 'server');
      setSuccessMessage('Resume content has been enhanced!');
      
    } catch (error) {
      console.error("Error during enhancement:", error);
      setErrorMessage(`Failed to enhance resume content: ${error.message}`);
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const loadPreviousData = async () => {
    try {
      setSuccessMessage('');
      setErrorMessage('');
      setIsLoading(true);
      
      console.log('Fetching previous resume data...');
      
      const responseData = await apiService.fetchResumeData();
      console.log('Resume data response:', responseData);
      
      if (responseData.success && responseData.data) {
        // Convert skills back to the format expected by the form (with value/label)
        const formattedData = {
          ...responseData.data,
          skills: Array.isArray(responseData.data.skills) 
            ? responseData.data.skills.map(skill => typeof skill === 'string' 
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
        setErrorMessage(responseData.message || 'No previous resume data found.');
      }
    } catch (error) {
      console.error('Error loading previous data:', error);
      setErrorMessage(`Failed to load previous data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Clear any previous success/error messages when submitting
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        throw new Error("First name and last name are required");
      }
      
      const jobDescription = sessionStorage.getItem('jobDescription') || '';
      // Format data to match server expectations - do this once for all operations
      const formattedData = formatFormDataForApi({
        ...formData,
        jobDescription // Include job description from session storage
      });
      
      // Step 1: Save data to MongoDB if requested by the user
      if (saveDataForFuture) {
        try {
          await apiService.saveResumeData(formattedData);
          console.log('Resume data saved successfully');
        } catch (saveError) {
          console.error('Error saving resume data:', saveError);
          // Continue with PDF generation even if saving fails
        }
      }
      
      // Step 2: Generate the Resume PDF
      const response = await apiService.generateResume(formattedData);
      
      // Handle different response types
      if (response.blob && response.contentType.includes('application/pdf')) {
        // Handle PDF blob response
        const blob = response.blob;
        const url = window.URL.createObjectURL(blob);
        
        // Set the PDF URL for display/iframe if needed
        setPdfUrl(url);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.firstName}_${formData.lastName}_resume.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Store the URL in the ref for cleanup when component unmounts
        blobUrlsRef.current.push(url);
        
        setResumeGenerated(true);
        setSuccessMessage('Resume generated successfully!');
      } else if (response.pdfUrl) {
        // Handle JSON response with PDF URL
        setPdfUrl(response.pdfUrl);
        setResumeGenerated(true);
        setSuccessMessage('Resume generated successfully!');
      } else {
        throw new Error('No PDF was returned from the server');
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
        handleEnhance={handleEnhance}
        isEnhancing={isEnhancing}
      />
      
      <div className="container mt-4">
        <div className="row">
          {/* Main Form Content */}
          <div className="form-col col-md-8" ref={formContainerRef}>
            <div className="form-container">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Resume Details</h2>
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
          <div className="preview-col col-md-4">
            <div className="preview-container">
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