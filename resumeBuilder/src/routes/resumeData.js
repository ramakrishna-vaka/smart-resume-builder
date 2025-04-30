import express from 'express';
import ResumeData from '../models/ResumeData.js';
import { Clerk } from '@clerk/clerk-sdk-node';

const router = express.Router();

// Initialize Clerk with your secret key
const clerk = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY || 'sk_test_MgZVkNNnyGngblhBigvVsBRKbi5ptiUH36T7OnbEWb'
});

// Middleware to extract and verify the JWT token
const requireAuth = async (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required', 
        message: 'No valid authorization token provided'
      });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required',
        message: 'No token found in authorization header'
      });
    }
    
    try {
      // Verify the token with Clerk
      const verifiedToken = await clerk.verifyToken(token);
      
      // Set the user ID in the request object
      req.auth = {
        userId: verifiedToken.sub
      };
      
      next();
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication failed',
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error',
      message: 'An error occurred during authentication'
    });
  }
};

// PUBLIC ROUTE: Test if resume routes are working
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Resume data routes are accessible',
    timestamp: new Date().toISOString()
  });
});

// PROTECTED ROUTE: Save resume data
router.post('/save', requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    const { resumeData } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Resume data is required' 
      });
    }
    
    // Check if data already exists for this user
    let existingData = await ResumeData.findOne({ userId });
    
    if (existingData) {
      // Update existing data
      existingData.resumeData = resumeData;
      existingData.updatedAt = Date.now();
      await existingData.save();
      return res.status(200).json({ 
        success: true, 
        data: existingData 
      });
    } else {
      // Create new data
      const newData = new ResumeData({
        userId,
        resumeData
      });
      await newData.save();
      return res.status(201).json({ 
        success: true, 
        data: newData 
      });
    }
  } catch (error) {
    console.error('Error saving resume data:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save resume data', 
      details: error.message 
    });
  }
});

// PROTECTED ROUTE: Get resume data for the authenticated user
router.get('/fetch', requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const resumeData = await ResumeData.findOne({ userId });
    
    if (!resumeData) {
      return res.status(404).json({ 
        success: false, 
        message: 'No saved data found' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: resumeData.resumeData 
    });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch resume data', 
      details: error.message 
    });
  }
});

// PUBLIC ROUTE: Get a sample resume data (useful for testing)
router.get('/sample', (req, res) => {
  // Sample resume data for testing purposes
  const sampleData = {
    personalInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      location: "New York, NY"
    },
    education: [
      {
        institution: "Sample University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2016-09-01",
        endDate: "2020-05-31"
      }
    ],
    experience: [
      {
        company: "Sample Tech",
        position: "Software Developer",
        startDate: "2020-06-01",
        endDate: "2023-03-31",
        description: "Developed web applications using React and Node.js"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"]
  };
  
  return res.status(200).json({
    success: true,
    message: "Sample resume data retrieved successfully",
    data: sampleData
  });
});

export default router;