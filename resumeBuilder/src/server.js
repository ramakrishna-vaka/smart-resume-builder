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

// Import Clerk properly - use your exact Clerk package imports
import * as clerk from '@clerk/clerk-sdk-node';
import { verifyToken } from '@clerk/backend';

import resumeDataRoutes from './routes/resumeData.js';

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

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

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

function cleanJsonResponse(response) {
  return response
    .replace(/```(json|javascript)?/g, '')
    .replace(/^\s*[\r\n]/gm, '')
    .trim();
}

// AI enhancement endpoints
app.post('/enhance/skills', requireAuth,async (req, res) => {
  try {
    const { skills, jobDescription } = req.body;
    
    if (!jobDescription) {
      return res.json({ enhancedSkills: skills }); // Return original skills if no job description
    }
    
    const userSkills = Array.isArray(skills) 
      ? skills.map(skill => typeof skill === 'object' ? skill.value : skill) 
      : [];
    
    const prompt = `
Job Description:
${jobDescription}

Candidate's Current Skills:
${userSkills.join(', ')}

Based on this job description, perform the following tasks:
1. Keep all the original skills the candidate listed
2. Extract important technical skills from the job description that aren't in the candidate's list
3. Return a comprehensive list of skills relevant to this job (keeping the original skills + adding relevant ones from the job description)
4. Format your response as a comma-separated list of skills only, with no explanation or other text

Expected format example: JavaScript, React, Node.js, Express, MongoDB, RESTful APIs, Git, AWS
`;

    const aiResponse = await callAI(prompt);
    
    if (!aiResponse) {
      return res.json({ enhancedSkills: userSkills });
    }
    
    // Process the response to extract skills
    const enhancedSkills = aiResponse
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    res.json({ enhancedSkills });
    
  } catch (error) {
    console.error('Error enhancing skills:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/enhance/projects', requireAuth,async (req, res) => {
  try {
    const { projects, jobDescription } = req.body;
    
    if (!jobDescription || !Array.isArray(projects) || projects.length === 0) {
      return res.json({ enhancedProjects: projects }); // Return original projects
    }
    
    const prompt = `
Job Description:
${jobDescription}

Candidate's Projects:
${projects.map((p, i) => `
Project ${i+1}: ${p.projectName || ''}
Tech Stack: ${p.projectTechStack || ''}
Description: ${p.projectDescription || ''}
`).join('\n')}

Based on this job description, enhance the projects to better align with the job requirements:
1. Focus on projects that are most relevant to the job description
2. For each project, provide an enhanced name, tech stack, and 2-3 bullet points highlighting achievements and skills relevant to the job
3. Prioritize the most relevant projects first
4. If there are more than 3 projects, only include the most relevant ones
5. Return the results in a structured JSON format

Expected format:
[
  {
    "name": "Enhanced Project Name",
    "techStack": "Enhanced Tech Stack",
    "relevanceScore": 85,
    "bullets": [
      "Enhanced bullet point highlighting achievement and job-relevant skills",
      "Another enhanced bullet point with metrics",
      "Third bullet point if applicable"
    ]
  },
  ...
]
`;

    const aiResponse = await callAI(prompt, true);
    
    if (!aiResponse) {
      return res.json({ enhancedProjects: projects });
    }
    
    try {
      // Parse JSON response
      const cleanedResponse = cleanJsonResponse(aiResponse);
      const enhancedProjects = JSON.parse(cleanedResponse);
      // Sort by relevance score if available
      if (enhancedProjects.some(p => p.relevanceScore)) {
        enhancedProjects.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }
      res.json({ enhancedProjects });
    } catch (jsonError) {
      console.error('Error parsing AI response:', jsonError);
      res.json({ enhancedProjects: projects }); // Return original on error
    }
    
  } catch (error) {
    console.error('Error enhancing projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Replace the entire enhance/experience endpoint with this:

app.post('/enhance/experience', requireAuth,  async (req, res) => {
  try {
    const { experienceData, jobDescription } = req.body;

    if (!jobDescription || !experienceData || !Array.isArray(experienceData.experiences)) {
      return res.json({ enhancedExperiences: [] }); // Return empty array if no valid input
    }
    
    // Process each experience individually
    const enhancementPromises = experienceData.experiences.map(async (experience) => {
      if (!experience.role) {
        return null; // Skip empty experiences
      }
      
      const prompt = `
Job Description:
${jobDescription}

Candidate's Experience:
Role: ${experience.role || ''}
Company: ${experience.company || ''}
Period: ${experience.period || ''}
Tech Stack: ${experience.techStack || ''}
Description: ${experience.description || ''}

Based on this job description, enhance the experience to better align with the job requirements:
1. Keep the original role, company, and period
2. Enhance the tech stack to include relevant technologies (if appropriate)
3. Create 3-4 impactful bullet points that highlight achievements and responsibilities that match the job requirements
4. Include metrics and results where possible
5. Use action verbs and quantifiable achievements
6. Return the results in a structured JSON format

Expected format:
{
  "role": "Original Role",
  "company": "Original Company",
  "period": "Original Period",
  "techStack": "Enhanced Tech Stack",
  "bullets": [
    "Enhanced bullet point with achievement and metric",
    "Another bullet point highlighting job-relevant skills",
    "Third bullet point with responsibility and impact",
    "Fourth bullet point if applicable"
  ]
}
`;

      const aiResponse = await callAI(prompt, true);
      
      if (!aiResponse) {
        return experience; // Return original on error
      }
      
      try {
        // Parse JSON response
        const cleanedResponse = cleanJsonResponse(aiResponse);
        return JSON.parse(cleanedResponse);
      } catch (jsonError) {
        console.error('Error parsing AI response:', jsonError);
        return experience; // Return original on error
      }
    });
    
    // Wait for all enhancements to complete
    const enhancedExperiences = await Promise.all(enhancementPromises);
    
    res.json({ 
      enhancedExperiences: enhancedExperiences.filter(exp => exp !== null)
    });
    
  } catch (error) {
    console.error('Error enhancing experience:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/enhance/certifications', requireAuth, async (req, res) => {
  try {
    const { certifications, jobDescription } = req.body;
    
    if (!jobDescription || !Array.isArray(certifications) || certifications.length === 0) {
      return res.json({ enhancedCertifications: certifications }); // Return original
    }
    
    const prompt = `
Job Description:
${jobDescription}

Candidate's Certifications:
${certifications.map((cert, i) => `
Certification ${i+1}: ${cert.name || ''}
Issuer: ${cert.issuer || ''}
Date: ${cert.date || ''}
Description: ${cert.description || ''}
`).join('\n')}

Based on this job description, enhance the certifications to better align with the job requirements:
1. Keep the original certification names, issuers, and dates
2. Add or enhance descriptions to highlight relevance to the job 
3. Prioritize the certifications most relevant to the position
4. Return the results in a structured JSON format

Expected format:
[
  {
    "name": "Original Certificate Name",
    "issuer": "Original Issuer",
    "date": "Original Date",
    "link": "Original Link",
    "description": "Enhanced description explaining relevance to the job",
    "relevanceScore": 85
  },
  ...
]
`;

    const aiResponse = await callAI(prompt, true);
    
    if (!aiResponse) {
      return res.json({ enhancedCertifications: certifications });
    }
    
    try {
      // Parse JSON response
      const cleanedResponse = cleanJsonResponse(aiResponse);
      const enhancedCertifications = JSON.parse(cleanedResponse);
      
      // Sort by relevance score if available
      if (enhancedCertifications.some(c => c.relevanceScore)) {
        enhancedCertifications.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }
      
      res.json({ enhancedCertifications });
    } catch (jsonError) {
      console.error('Error parsing AI response:', jsonError);
      res.json({ enhancedCertifications: certifications }); // Return original on error
    }
    
  } catch (error) {
    console.error('Error enhancing certifications:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/enhance/achievements', requireAuth, async (req, res) => {
  try {
    const { achievements, jobDescription } = req.body;
    
    if (!jobDescription || !Array.isArray(achievements) || achievements.length === 0) {
      return res.json({ enhancedAchievements: achievements }); // Return original
    }
    
    const prompt = `
Job Description:
${jobDescription}

Candidate's Achievements:
${achievements.map((ach, i) => `
Achievement ${i+1}: ${ach.title || ''}
Organization: ${ach.organization || ''}
Year: ${ach.year || ''}
Description: ${ach.description || ''}
`).join('\n')}

Based on this job description, enhance the achievements to better align with the job requirements:
1. Keep the original achievement titles, organizations, and years
2. Enhance descriptions to quantify results and highlight relevance
3. Prioritize achievements most relevant to the position
4. Return the results in a structured JSON format

Expected format:
[
  {
    "title": "Original Achievement Title",
    "organization": "Original Organization",
    "year": "Original Year",
    "description": "Enhanced description with metrics and relevance to job",
    "relevanceScore": 90
  },
  ...
]
`;

    const aiResponse = await callAI(prompt, true);
    
    if (!aiResponse) {
      return res.json({ enhancedAchievements: achievements });
    }
    
    try {
      // Parse JSON response
      const cleanedResponse = cleanJsonResponse(aiResponse);
      const enhancedAchievements = JSON.parse(cleanedResponse);
      
      // Sort by relevance score if available
      if (enhancedAchievements.some(a => a.relevanceScore)) {
        enhancedAchievements.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }
      
      res.json({ enhancedAchievements });
    } catch (jsonError) {
      console.error('Error parsing AI response:', jsonError);
      res.json({ enhancedAchievements: achievements }); // Return original on error
    }
    
  } catch (error) {
    console.error('Error enhancing achievements:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/enhance/extracurricular', requireAuth, async (req, res) => {
  try {
    const { activities, jobDescription } = req.body;
    
    if (!jobDescription || !Array.isArray(activities) || activities.length === 0) {
      return res.json({ enhancedActivities: activities }); // Return original
    }
    
    const prompt = `
Job Description:
${jobDescription}

Candidate's Extracurricular Activities:
${activities.map((act, i) => `
Activity ${i+1}: ${act.name || ''}
Role: ${act.role || ''}
Organization: ${act.organization || ''}
Period: ${act.period || ''}
Description: ${act.description || ''}
`).join('\n')}

Based on this job description, enhance the extracurricular activities to better align with the job requirements:
1. Keep the original activity names, roles, organizations, and periods
2. Enhance descriptions to highlight transferable skills relevant to the job
3. Prioritize activities that demonstrate leadership, teamwork, and skills mentioned in the job description
4. Return the results in a structured JSON format

Expected format:
[
  {
    "name": "Original Activity Name",
    "role": "Original Role",
    "organization": "Original Organization",
    "period": "Original Period",
    "description": "Enhanced description highlighting transferable skills",
    "relevanceScore": 75
  },
  ...
]
`;

    const aiResponse = await callAI(prompt, true);
    
    if (!aiResponse) {
      return res.json({ enhancedActivities: activities });
    }
    
    try {
      // Parse JSON response
      const cleanedResponse = cleanJsonResponse(aiResponse);
      const enhancedActivities = JSON.parse(cleanedResponse);
      
      // Sort by relevance score if available
      if (enhancedActivities.some(a => a.relevanceScore)) {
        enhancedActivities.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }
      
      res.json({ enhancedActivities });
    } catch (jsonError) {
      console.error('Error parsing AI response:', jsonError);
      res.json({ enhancedActivities: activities }); // Return original on error
    }
    
  } catch (error) {
    console.error('Error enhancing extracurricular activities:', error);
    res.status(500).json({ error: error.message });
  }
});

// Unified route to enhance all resume sections at once
app.post('/enhance/resume', requireAuth, async (req, res) => {
  try {
    const { formData,jobDescription } = req.body;
    
    if (!formData || !jobDescription) {
      return res.json({ 
        enhancedData: null,
        message: 'Job description is required for AI enhancement'
      });
    }
    
    // Process all sections in parallel for efficiency
    const [
      skillsResponse, 
      projectsResponse, 
      experienceResponse, 
      certificationsResponse,
      achievementsResponse, 
      extracurricularResponse
    ] = await Promise.all([
      fetch(`http://localhost:${port}/enhance/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skills: formData.skills || [], 
          jobDescription: jobDescription
        })
      }).then(r => r.json()),
      
      fetch(`http://localhost:${port}/enhance/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projects: formData.projects || [], 
          jobDescription: jobDescription 
        })
      }).then(r => r.json()),
      
      formData.hasExperience ? fetch(`http://localhost:${port}/enhance/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          experienceData: {
            experiences: formData.experiences || []
          }, 
          jobDescription: jobDescription
        })
      }).then(r => r.json()) : Promise.resolve({ enhancedExperiences: [] }),
      
      formData.certifications && formData.certifications.length > 0 ? 
        fetch(`http://localhost:${port}/enhance/certifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            certifications: formData.certifications, 
            jobDescription: jobDescription 
          })
        }).then(r => r.json()) : Promise.resolve({ enhancedCertifications: [] }),
      
      formData.achievements && formData.achievements.length > 0 ? 
        fetch(`http://localhost:${port}/enhance/achievements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            achievements: formData.achievements, 
            jobDescription: jobDescription 
          })
        }).then(r => r.json()) : Promise.resolve({ enhancedAchievements: [] }),
        
      formData.extracurricularActivities && formData.extracurricularActivities.length > 0 ? 
        fetch(`http://localhost:${port}/enhance/extracurricular`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            activities: formData.extracurricularActivities, 
            jobDescription: jobDescription 
          })
        }).then(r => r.json()) : Promise.resolve({ enhancedActivities: [] })
    ]);
    
    // Combine all enhanced data
    const enhancedData = {
      enhancedSkills: skillsResponse.enhancedSkills || [],
      enhancedProjects: projectsResponse.enhancedProjects || [],
      enhancedExperiences: experienceResponse.enhancedExperiences || [],
      enhancedCertifications: certificationsResponse.enhancedCertifications || [],
      enhancedAchievements: achievementsResponse.enhancedAchievements || [],
      enhancedActivities: extracurricularResponse.enhancedActivities || []
    };
    
    res.json({ 
      enhancedData,
      message: 'Resume enhanced successfully'
    });
    
  } catch (error) {
    console.error('Error enhancing resume:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to enhance resume' 
    });
  }
});

// Helper function to call AI
async function callAI(prompt, isJSON = false) {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // Move to env variable
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          // Add a system message for JSON responses if needed
          isJSON ? { 
            role: "system", 
            content: "You MUST respond with valid JSON only. No explanatory text." 
          } : null,
          { role: "user", content: prompt }
        ].filter(Boolean),
        temperature: isJSON ? 0.1 : 0.3,
        response_format: isJSON ? { type: "json_object" } : undefined
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Check response status
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`API returned error ${aiResponse.status}: ${errorText}`);
    }

    const data = await aiResponse.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content.trim();
      
      // Extra validation for JSON responses
      if (isJSON) {
        try {
          // Test parse to validate JSON
          JSON.parse(content);
        } catch (jsonError) {
          console.error('AI returned invalid JSON:', content);
          throw new Error('Received invalid JSON response from AI');
        }
      }
      
      return content;
    } else {
      console.error('Unexpected AI response format:', data);
      return null;
    }
  } catch (error) {
    // Check if this is an abort error (timeout)
    if (error.name === 'AbortError') {
      console.error('AI request timed out');
    } else {
      console.error('Error calling AI:', error);
    }
    return null;
  }
}


// Main route for generating the PDF
app.post('/generate-resume', requireAuth,  async (req, res) => {
  try {
    const { originalData } = req.body;
    
    // Validate required fields
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
