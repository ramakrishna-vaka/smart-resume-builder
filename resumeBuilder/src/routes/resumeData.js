import express from 'express';
import { requireAuth } from '@clerk/express';
import ResumeData from '../models/ResumeData.js';

const router = express.Router();

// Protect all routes with requireAuth middleware
router.use(requireAuth());

// Save resume data
router.post('/save', async (req, res) => {
  try {
    const { userId } = req.auth;
    const { resumeData } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ success: false, error: 'Resume data is required' });
    }
    
    // Check if data already exists for this user
    let existingData = await ResumeData.findOne({ userId });
    
    if (existingData) {
      // Update existing data
      existingData.resumeData = resumeData;
      existingData.updatedAt = Date.now();
      await existingData.save();
      return res.status(200).json({ success: true, data: existingData });
    } else {
      // Create new data
      const newData = new ResumeData({
        userId,
        resumeData
      });
      await newData.save();
      return res.status(201).json({ success: true, data: newData });
    }
  } catch (error) {
    console.error('Error saving resume data:', error);
    return res.status(500).json({ success: false, error: 'Failed to save resume data' });
  }
});

// Get resume data for the authenticated user
router.get('/fetch', async (req, res) => {
  try {
    const { userId } = req.auth;
    
    const resumeData = await ResumeData.findOne({ userId });
    
    if (!resumeData) {
      return res.status(404).json({ success: false, message: 'No saved data found' });
    }
    
    return res.status(200).json({ success: true, data: resumeData.resumeData });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch resume data' });
  }
});

export default router;