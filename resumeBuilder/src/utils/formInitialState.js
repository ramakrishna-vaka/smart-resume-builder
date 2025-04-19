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
    isThereExperience: false,
    experienceRole: '',
    experienceCompany: '',
    experienceTechStack: '',
    experiencePeriod: '',
    experienceDescription: '',
    
    // Projects
    projects: [{ 
      projectName: '', 
      projectTechStack: '', 
      projectDescription: '', 
      projectLink: '',
      githubLink: ''
    }],
    
    // Skills and other sections
    skills: [],
    achievements: '',
    certifications: '',
    extraCircularActivities: '',
    jobDescription: '',
  };