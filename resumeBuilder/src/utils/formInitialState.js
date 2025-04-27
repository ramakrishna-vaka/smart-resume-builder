// src/utils/formInitialState.js

export const initialFormState = {
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    linkedinUrl: '',
    githubUrl: '',
    leetcodeUrl: '',
    
    // Education
    schoolName: '',
    schoolAddress: '',
    schoolScore: '',
    schoolPeriod: '',
    interCollegeName: '',
    interCollegeAddress: '',
    interScore: '',
    interPeriod: '',
    graduationCollegeName: '',
    graduationCollegeAddress: '',
    graduationScore: '',
    graduationCollegePeriod: '',
    graduationCourse: '',
    graduationDegree: '',
    
    // Experience
    hasExperience: false,
    experiences: [],
    
    // Projects
    projects: [{ 
      projectName: '', 
      projectTechStack: '', 
      projectDescription: '', 
      projectLink: '',
      githubLink: ''
    }],
    
    // Skills
    skills: [],
    
    // Certifications (new structured format)
    certifications: [],
    
    // Achievements (new structured format)
    achievements: [],
    
    // Extracurricular Activities (new structured format)
    extracurricularActivities: [],
    
    // Job Description (for enhancement)
    jobDescription: '',
  };