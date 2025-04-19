// models/ResumeData.js
import mongoose from 'mongoose';

const ResumeDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  resumeData: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the model
const ResumeData = mongoose.model('ResumeData', ResumeDataSchema);
export default ResumeData;  // Changed to ES module export