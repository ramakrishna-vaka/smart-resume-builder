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
//import { clerkClient } from '@clerk/backend';
import { clerkMiddleware } from '@clerk/express';
import resumeDataRoutes from './routes/resumeData.js'; // Note the .js extension

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

  
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:5174', // your frontend URL
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));  // Increased limit for larger JSON payloads
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(clerkMiddleware());

// Routes
app.use('/api/resume-data', resumeDataRoutes);

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('Resume Builder API is running');
});


// Create temp directory for LaTeX files
const tempDir = path.join(__dirname, 'temp');
fs.ensureDirSync(tempDir);

// Authentication middleware is applied after static files but before API routes
//app.use(clerkMiddleware());

// Add resume data routes (these are already protected by clerkMiddleware)
app.use('/api/resume-data', resumeDataRoutes);

function cleanJsonResponse(response) {
  // Remove markdown code blocks and any other non-JSON formatting
  return response
    .replace(/```(json|javascript)?/g, '') // Remove markdown code markers
    .replace(/^\s*[\r\n]/gm, '')          // Remove extra newlines
    .trim();                              // Trim whitespace
}

// AI enhancement endpoints
app.post('/enhance/skills', clerkMiddleware(),async (req, res) => {
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

app.post('/enhance/projects', clerkMiddleware(), async (req, res) => {
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

app.post('/enhance/experience', clerkMiddleware(), async (req, res) => {
  try {
    const { experienceData, jobDescription } = req.body;
    
    if (!jobDescription || !experienceData || !experienceData.experienceRole) {
      return res.json({ enhancedExperience: null }); // Return null if no valid input
    }
    
    const prompt = `
Job Description:
${jobDescription}

Candidate's Experience:
Role: ${experienceData.experienceRole || ''}
Company: ${experienceData.experienceCompany || ''}
Period: ${experienceData.experiencePeriod || ''}
Tech Stack: ${experienceData.experienceTechStack || ''}
Description: ${experienceData.experienceDescription || ''}

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
      return res.json({ enhancedExperience: null });
    }
    
    try {
      // Parse JSON response
      const cleanedResponse = cleanJsonResponse(aiResponse);
      const enhancedExperience = JSON.parse(cleanedResponse);
      res.json({ enhancedExperience });
    } catch (jsonError) {
      console.error('Error parsing AI response:', jsonError);
      res.json({ enhancedExperience: null }); // Return null on error
    }
    
  } catch (error) {
    console.error('Error enhancing experience:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/enhance/achievements', clerkMiddleware(), async (req, res) => {
  try {
    const { achievements, jobDescription } = req.body;
    
    if (!jobDescription || !achievements) {
      return res.json({ enhancedAchievements: achievements }); // Return original
    }
    
    const prompt = `
Job Description:
${jobDescription}

Candidate's Achievements:
${achievements}

Based on this job description, enhance the achievements to better align with the job requirements:
1. Prioritize achievements most relevant to the job
2. Quantify achievements where possible
3. Focus on results and impact
4. Format the achievements as 2-3 concise, impactful bullet points
5. Return just the enhanced achievements as plain text bullet points separated by newlines

Format: "• Achievement 1\n• Achievement 2\n• Achievement 3"
`;

    const aiResponse = await callAI(prompt);
    
    if (!aiResponse) {
      return res.json({ enhancedAchievements: achievements });
    }
    
    // Clean up format - remove bullet points if they exist and join with newlines
    const enhancedAchievements = aiResponse
      .split('\n')
      .map(line => line.trim().replace(/^[•\-*]\s*/, ''))
      .filter(line => line.length > 0)
      .join('\n• ');
    
    res.json({ enhancedAchievements: `• ${enhancedAchievements}` });
    
  } catch (error) {
    console.error('Error enhancing achievements:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/enhance/certifications', clerkMiddleware(), async (req, res) => {
  try {
    const { certifications, jobDescription } = req.body;
    
    if (!jobDescription || !certifications) {
      return res.json({ enhancedCertifications: certifications }); // Return original
    }
    
    const prompt = `
Job Description:
${jobDescription}

Candidate's Certifications:
${certifications}

Based on this job description, enhance the certifications to better align with the job requirements:
1. Prioritize certifications most relevant to the job
2. Format the certifications in a professional way
3. Add brief details about the relevance of each certification if appropriate
4. Return just the enhanced certifications as plain text bullet points separated by newlines

Format: "• Certification 1\n• Certification 2\n• Certification 3"
`;

    const aiResponse = await callAI(prompt);
    
    if (!aiResponse) {
      return res.json({ enhancedCertifications: certifications });
    }
    
    // Clean up format - remove bullet points if they exist and join with newlines
    const enhancedCertifications = aiResponse
      .split('\n')
      .map(line => line.trim().replace(/^[•\-*]\s*/, ''))
      .filter(line => line.length > 0)
      .join('\n• ');
    
    res.json({ enhancedCertifications: `• ${enhancedCertifications}` });
    
  } catch (error) {
    console.error('Error enhancing certifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// Unified route to enhance all resume sections at once
app.post('/enhance/resume', clerkMiddleware(), async (req, res) => {
  try {
    const { formData } = req.body;
    
    if (!formData || !formData.jobDescription) {
      return res.json({ 
        enhancedData: null,
        message: 'Job description is required for AI enhancement'
      });
    }
    
    // Process all sections in parallel for efficiency
    const [skillsResponse, projectsResponse, experienceResponse, achievementsResponse, certificationsResponse] = 
      await Promise.all([
        fetch(`http://localhost:${port}/enhance/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            skills: formData.skills || [], 
            jobDescription: formData.jobDescription 
          })
        }).then(r => r.json()),
        
        fetch(`http://localhost:${port}/enhance/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            projects: formData.projects || [], 
            jobDescription: formData.jobDescription 
          })
        }).then(r => r.json()),
        
        formData.isThereExperience ? fetch(`http://localhost:${port}/enhance/experience`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            experienceData: {
              experienceRole: formData.experienceRole,
              experienceCompany: formData.experienceCompany,
              experiencePeriod: formData.experiencePeriod,
              experienceTechStack: formData.experienceTechStack,
              experienceDescription: formData.experienceDescription
            }, 
            jobDescription: formData.jobDescription 
          })
        }).then(r => r.json()) : Promise.resolve({ enhancedExperience: null }),
        
        formData.achievements ? fetch(`http://localhost:${port}/enhance/achievements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            achievements: formData.achievements, 
            jobDescription: formData.jobDescription 
          })
        }).then(r => r.json()) : Promise.resolve({ enhancedAchievements: '' }),
        
        formData.certifications ? fetch(`http://localhost:${port}/enhance/certifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            certifications: formData.certifications, 
            jobDescription: formData.jobDescription 
          })
        }).then(r => r.json()) : Promise.resolve({ enhancedCertifications: '' })
      ]);
    
    // Combine all enhanced data
    const enhancedData = {
      enhancedSkills: skillsResponse.enhancedSkills || [],
      enhancedProjects: projectsResponse.enhancedProjects || [],
      enhancedExperience: experienceResponse.enhancedExperience,
      enhancedAchievements: achievementsResponse.enhancedAchievements || '',
      enhancedCertifications: certificationsResponse.enhancedCertifications || ''
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
app.post('/generate-resume', clerkMiddleware(), async (req, res) => {
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
const PDFLATEX = `"C:\\Program Files\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe"`;

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
