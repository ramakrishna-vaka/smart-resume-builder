// Router implementation for enhancement endpoints
// enhancementRoutes.js
import express from 'express';
import enhancementServices from './enhancementService.js';
const router = express.Router();

// Middleware to handle errors consistently
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(error => {
      console.error('Error in route handler:', error);
      res.status(500).json({ 
        error: error.message,
        success: false,
        message: 'An error occurred while processing your request' 
      });
    });
};

const errorTracker = {
    errors: [],
    addError(route, error) {
      this.errors.push({
        route,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      // Keep only last 100 errors
      if (this.errors.length > 100) {
        this.errors.shift();
      }
    },
    getRecentErrors() {
      return this.errors.slice(-20); // Return last 20 errors
    }
  };
// AI enhancement endpoint for introduction
router.post('/introduction', asyncHandler(async (req, res) => {
    const { introduction, jobDescription } = req.body;
    
    try {
      const enhancedIntroduction = await enhancementServices.enhanceIntroduction(
        introduction,
        jobDescription
      );
      
      res.json({ 
        enhancedIntroduction,
        success: true
      });
    } catch (error) {
      errorTracker.addError('introduction', error);
      res.status(500).json({
        error: error.message,
        success: false,
        originalContent: introduction,
        message: 'Failed to enhance introduction, returning original'
      });
    }
  }));

// AI enhancement endpoint for professional title
router.post('/title', asyncHandler(async (req, res) => {
  const { title, jobDescription } = req.body;
  try{
  const enhancedTitle = await enhancementServices.enhanceTitle(
    title,
    jobDescription
  );
  
  res.json({ 
    enhancedTitle,
    success: true
  });
}catch (error) {
    errorTracker.addError('title', error);
    res.status(500).json({
        error: error.message,
        success: false,
        originalContent: title,
        message: 'Failed to enhance title, returning original'
    });
}
}));

// AI enhancement endpoint for skills
router.post('/skills', asyncHandler(async (req, res) => {
  const { skills, jobDescription } = req.body;
  
  const enhancedSkills = await enhancementServices.enhanceSkills(
    skills,
    jobDescription
  );
  
  res.json({ 
    enhancedSkills,
    success: true
  });
}));

// AI enhancement endpoint for projects
router.post('/projects', asyncHandler(async (req, res) => {
  const { projects, jobDescription } = req.body;
  
  const enhancedProjects = await enhancementServices.enhanceProjects(
    projects,
    jobDescription
  );
  
  res.json({ 
    enhancedProjects,
    success: true
  });
}));

// AI enhancement endpoint for experiences
router.post('/experience', asyncHandler(async (req, res) => {
  const { experienceData, jobDescription } = req.body;
  
  const experiences = experienceData && experienceData.experiences ? 
    experienceData.experiences : [];
  try {
  const enhancedExperiences = await enhancementServices.enhanceExperience(
    experiences,
    jobDescription
  );
  
  res.json({ 
    enhancedExperiences,
    success: true
  });
  }
  catch (error) {
    errorTracker.addError('experience', error);
    res.status(500).json({
        error: error.message,
        success: false,
        originalContent: experienceData,
        message: 'Failed to enhance experience, returning original'
    });
  }
}));

// AI enhancement endpoint for certifications
router.post('/certifications', asyncHandler(async (req, res) => {
  const { certifications, jobDescription } = req.body;
  
  const enhancedCertifications = await enhancementServices.enhanceCertifications(
    certifications,
    jobDescription
  );
  
  res.json({ 
    enhancedCertifications,
    success: true
  });
}));

// AI enhancement endpoint for achievements
router.post('/achievements', asyncHandler(async (req, res) => {
  const { achievements, jobDescription } = req.body;
  
  const enhancedAchievements = await enhancementServices.enhanceAchievements(
    achievements,
    jobDescription
  );
  
  res.json({ 
    enhancedAchievements,
    success: true
  });
}));

// AI enhancement endpoint for extracurricular activities
router.post('/extracurricular', asyncHandler(async (req, res) => {
  const { activities, jobDescription } = req.body;
  
  const enhancedActivities = await enhancementServices.enhanceExtracurricular(
    activities,
    jobDescription
  );
  
  res.json({ 
    enhancedActivities,
    success: true
  });
}));

// Unified route to enhance all resume sections at once
router.post('/resume', asyncHandler(async (req, res) => {
    console.log('Resume enhancement request received');
  const { formData, jobDescription } = req.body;
  console.log('Form data sections available:', Object.keys(formData || {}));
  console.log('Job description:', jobDescription);
  // Validate required data
  if (!formData || !jobDescription) {
    return res.status(400).json({ 
      error: 'Missing required data',
      message: 'Job description and form data are required for AI enhancement',
      success: false
    });
  }
  console.log('Calling enhanceResume service...');
  // Process all sections at once using the service
  try{
    const enhancedData = await enhancementServices.enhanceResume(
    formData,
    jobDescription
  );
  
  res.json({ 
    enhancedData,
    message: 'Resume enhanced successfully',
    success: true
  });
  }
  catch (error) {
    errorTracker.addError('resume', error);
    res.status(500).json({
        error: error.message,
        success: false,
        originalContent: formData,
        message: 'Failed to enhance resume, returning original'
    });
  }
}));

export default router;