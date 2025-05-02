import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 

import { verifyToken } from '@clerk/backend';

import resumeDataRoutes from './routes/resumeData.js';
import enhancementRoutes from './enhancementRoutes.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://ramakrishnavaka04:YBS8Aexb4VKdtdPG@cluster0.xhzxm6g.mongodb.net/resume-builder?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  const allowedOrigins = [
    'https://smart-resume-builder-five.vercel.app', 
    'http://localhost:5173'
  ];
  
  // Apply CORS middleware before other middleware
  app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        console.log(`CORS blocked request from origin: ${origin}`);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));
  
  // Add the following headers to all responses for extra CORS support
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', true);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }
    next();
  });

app.use(bodyParser.json({ limit: '10mb' }));

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
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};


// PUBLIC ROUTE: Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// PUBLIC ROUTE: API test
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working properly',
    data: {
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('Resume Builder API is running');
});

// Use your resume data routes - we'll add auth inside the route file
app.use('/api/resume-data', resumeDataRoutes);

// Create temp directory for LaTeX files
const tempDir = path.join(__dirname, 'temp');
fs.ensureDirSync(tempDir);

// function cleanJsonResponse(response) {
//   return response
//     .replace(/```(json|javascript)?/g, '')
//     .replace(/^\s*[\r\n]/gm, '')
//     .trim();
// }

// API routes with authentication
app.use('/enhance', requireAuth, enhancementRoutes);

// Main route for generating the PDF
app.post('/generate-resume', requireAuth,  async (req, res) => {
  try {
    const { originalData } = req.body;
    
    if (!originalData || !originalData.firstName || !originalData.lastName) {
      throw new Error('First name and last name are required');
    }
    
    // Import the LaTeX generation function
    const { generateLaTeX } = await import('./latex-template.js');
    
    // Generate LaTeX code with enhanced content if available
    const latexCode = generateLaTeX(originalData);
    
    // Create unique filenames based on timestamp and sanitized name
    const timestamp = Date.now();
    const safeName = `${originalData.firstName || 'user'}_${originalData.lastName || 'resume'}`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const texFile = path.join(tempDir, `${safeName}_${timestamp}.tex`);
    
    // Write LaTeX to file
    fs.writeFileSync(texFile, latexCode);
    
    try {
      // Compile LaTeX to PDF
      const pdfFile = await compileLaTeX(texFile);
      
      // Check if PDF was created
      if (!fs.existsSync(pdfFile)) {
        throw new Error('PDF file was not created');
      }
      
      // Send the PDF file to the client
      res.download(pdfFile, `${safeName}_Resume.pdf`, (err) => {
        if (err) {
          console.error('Error sending file:', err);
        }
        
        // Clean up temp files after a delay
        setTimeout(() => {
          try {
            // Delete all generated files
            const baseName = path.join(tempDir, `${safeName}_${timestamp}`);
            const extensions = ['.tex', '.pdf', '.aux', '.log', '.out'];
            extensions.forEach(ext => {
              const filePath = baseName + ext;
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            });
          } catch (e) {
            console.error('Error cleaning up temp files:', e);
          }
        }, 5000);
      });
      
    } catch (compileError) {
      console.error('Failed to compile LaTeX:', compileError);
      
      // Send error response with LaTeX code for debugging
      res.status(500).json({
        error: 'Failed to compile resume - LaTeX compilation error',
        latex: latexCode,
        message: 'The server encountered an error while generating your PDF'
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// LaTeX compilation function
const PDFLATEX = process.env.PDFLATEX_PATH || 'pdflatex';

if (!PDFLATEX) {
  console.error('PDFLATEX_PATH environment variable is not set. Defaulting to "pdflatex".');
}

function compileLaTeX(texFile) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(texFile);
    const cmd = `${PDFLATEX} -interaction=nonstopmode -halt-on-error -file-line-error ` +
                `-output-directory="${dir}" "${texFile}"`;

    exec(cmd, (error, stdout, stderr) => {
      console.log('=== pdflatex stdout ===\n', stdout);
      console.error('=== pdflatex stderr ===\n', stderr);

      if (error) {
        return reject(new Error(`pdflatex failed:\n${stdout}\n${stderr}`));
      }
      resolve(texFile.replace(/\.tex$/, '.pdf'));
    });
  });
}

app.listen(port, () => {
  console.log(`\n🚀 Server running on http://localhost:${port}`);
});
