import express from 'express';
import ResumeData from '../models/ResumeData.js';
import { verifyToken } from '@clerk/backend';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Initialize Clerk with your secret key

// Middleware to extract and verify the JWT token
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY
      });

      req.auth = { userId: payload.sub };
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      //return res.status(401).json({ error: 'Invalid or expired token' });
      return res.status(401).json({ error: 'Please Try Now' });
    }
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ error: 'Server error during authentication' });
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
    // Add explicit CORS headers for this critical endpoint
    const origin = req.headers.origin;
    const allowedOrigins = [
      'https://smart-resume-builder-five.vercel.app', 
      'http://localhost:5173'
    ];
    
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }

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