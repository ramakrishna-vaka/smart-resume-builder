// AI enhancement service module
import dotenv from 'dotenv';
dotenv.config();

// Utility function to clean JSON responses from AI
function cleanJsonResponse(response) {
  // Remove any non-JSON content that might be in the response
  let cleanedResponse = response;
  
  // If response starts with ```json, remove it
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.substring(7);
  } else if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.substring(3);
  }
  
  // Remove trailing backticks
  if (cleanedResponse.endsWith('```')) {
    cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length - 3);
  }
  return cleanedResponse.trim();
}

// Helper function to call AI with timeout and error handling
async function callAI(prompt, isJSON = false) {
  try {
    // Define a fixed API key since environment variable is not working
    const API_KEY = "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";
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
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
      console.error(`API returned error ${aiResponse.status}: ${errorText}`);
      throw new Error(`API returned error ${aiResponse.status}: ${errorText}`);
    }

    const data = await aiResponse.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content.trim();
      
      // Extra validation for JSON responses
      if (isJSON) {
        try {
          // Test parse to validate JSON
          JSON.parse(cleanJsonResponse(content));
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
    throw error; // Forward the error to be handled by the caller
  }
}

// Fallback function to use when API calls fail
function processWithoutAI(section, jobDescription) {
  console.log(`Processing ${section} without AI due to API error`);
  // This is a simple fallback that could be enhanced with basic keyword matching
  
  // Simple function to check if a text contains keywords from job description
  const containsJobKeywords = (text, jobDesc) => {
    if (!text || !jobDesc) return false;
    
    // Extract keywords from job description (simple implementation)
    const keywords = jobDesc.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 4) // Only consider words with more than 4 characters
      .filter(word => !['and', 'with', 'the', 'for', 'this', 'that', 'will', 'have'].includes(word));
    
    // Check if text contains any of these keywords
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  };
  
  return {
    containsJobKeywords,
    prioritizeItems: (items, jobDesc) => {
      if (!Array.isArray(items) || items.length === 0) return items;
      
      // Add a simple relevance score based on keyword matches
      return items.map(item => {
        const allText = Object.values(item).filter(val => typeof val === 'string').join(' ');
        const score = containsJobKeywords(allText, jobDesc) ? 80 : 50;
        return {...item, relevanceScore: score};
      }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }
  };
}

// Enhancement services
const enhancementServices = {
  // Introduction enhancement
  async enhanceIntroduction(introduction, jobDescription) {
    if (!jobDescription || !introduction) {
      return introduction; // Return original if no job description
    }
    
    try {
      const prompt = `
Job Description:
${jobDescription}

Candidate's Current Introduction:
${introduction}

Based on this job description, enhance the candidate's introduction:
1. Maintain the core personal details and tone from the original introduction
2. Highlight skills and experiences that align with the job description
3. Keep approximately the same length as the original (2-3 sentences)
4. Use professional language but maintain the candidate's original voice
5. Ensure the enhanced introduction sounds natural and authentic
6. Return ONLY the enhanced introduction text with no additional commentary

Important: Do NOT invent new experiences or qualifications not mentioned in the original introduction.
`;

      const aiResponse = await callAI(prompt);
      return aiResponse || introduction;
    } catch (error) {
      console.error('Error enhancing introduction:', error);
      return introduction; // Return original on error
    }
  },
  
  // Professional title enhancement
  async enhanceTitle(title, jobDescription) {
    if (!jobDescription || !title) {
      return title; // Return original if no job description
    }
    
    try {
      const prompt = `
  Job Description:
  ${jobDescription}
  
  Candidate's Current Professional Title:
  ${title}
  
  Based on this job description, generate 2-3 enhanced professional title variations:
  1. Maintain core elements from the original title
  2. Align titles with the job being applied for
  3. Keep each title concise and professional (maximum 3-5 words)
  4. For titles that include company affiliations (e.g., "Intern@XYZ", "Developer at ABC"), maintain this format in appropriate variations
  5. Return ONLY the enhanced title options separated by commas, with no additional commentary
  
  Important: All enhanced titles must remain realistic and closely related to the original. Do not create entirely different titles. Include variations that:
  - Highlight different aspects of the same role
  - Adjust seniority level appropriately if relevant
  - Use industry-standard terminology from the job description
  `;
  
      const aiResponse = await callAI(prompt);
      
      // If no response, return original title
      if (!aiResponse) return title;
      
      // If the response doesn't contain commas, it might be a single title
      // In that case, combine it with the original title
      if (!aiResponse.includes(',')) {
        return `${title}, ${aiResponse.trim()}`;
      }
      
      // Otherwise return the comma-separated titles
      return aiResponse.trim();
    } catch (error) {
      console.error('Error enhancing titles:', error);
      return title; // Return original on error
    }
  },
  
  // Skills enhancement
  async enhanceSkills(skills, jobDescription) {
    if (!jobDescription) {
      return skills; // Return original skills if no job description
    }
    
    try {
      const userSkills = Array.isArray(skills) 
        ? skills.map(skill => typeof skill === 'object' ? skill.value : skill) 
        : [];
      
      const prompt = `
Job Description:
${jobDescription}

Candidate's Current Skills:
${userSkills.join(', ')}

Based on this job description, perform the following tasks:
1. Keep ALL the original skills the candidate listed exactly as they are
2. Extract 3-5 important technical skills from the job description that aren't in the candidate's list
3. Only add skills that are highly relevant to the job and that the candidate could reasonably have
4. Format your response as a comma-separated list of skills only, with no explanation or other text

Expected format example: JavaScript, React, Node.js, Express, MongoDB, RESTful APIs, Git, AWS
`;

      const aiResponse = await callAI(prompt);
      
      if (!aiResponse) {
        return userSkills;
      }
      
      // Process the response to extract skills
      return aiResponse
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    } catch (error) {
      console.error('Error enhancing skills:', error);
      return skills; // Return original on error
    }
  },
  
  // Projects enhancement
  async enhanceProjects(projects, jobDescription) {
    if (!jobDescription || !Array.isArray(projects) || projects.length === 0) {
      return projects; // Return original projects
    }
    
    try {
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
1. Keep the original project names but make minor improvements if needed
2. Focus on projects that are most relevant to the job description
3. Prioritize the most relevant projects first
4. If there are more than 3 projects, only include the most relevant ones
5. Keep core technologies in the tech stack but add 1-2 relevant technologies if applicable
6. For each project, provide EXACTLY 3 bullet points highlighting achievements and skills relevant to the job
7. Make bullet points concise (15-20 words each)
8. Use quantifiable metrics and action verbs where possible
9. Return the results in a structured JSON format

Expected format:
[
  {
    "name": "Enhanced Project Name (keeping strong similarity to original)",
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
        return projects;
      }
      
      // Parse JSON response
      const cleanedResponse = cleanJsonResponse(aiResponse);
      const enhancedProjects = JSON.parse(cleanedResponse);
      
      // Sort by relevance score if available
      if (enhancedProjects.some(p => p.relevanceScore)) {
        enhancedProjects.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }
      
      return enhancedProjects;
    } catch (error) {
      console.error('Error enhancing projects:', error);
      // Use fallback function if AI fails
      const fallback = processWithoutAI('projects', jobDescription);
      return fallback.prioritizeItems(projects, jobDescription);
    }
  },
  
  // Experience enhancement
  async enhanceExperience(experiences, jobDescription) {
    if (!jobDescription || !Array.isArray(experiences) || experiences.length === 0) {
      return []; // Return empty array if no valid input
    }
    
    try {
      // Process each experience individually with Promise.all for better performance
      const enhancedExperiences = await Promise.all(
        experiences.map(async (experience) => {
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
1. DO NOT CHANGE the original company name, role title, or period
2. Enhance the tech stack to include relevant technologies (ONLY if appropriate)
3. Create EXACTLY 3-4 impactful bullet points that highlight achievements and responsibilities matching the job requirements
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

          try {
            const aiResponse = await callAI(prompt, true);
            
            if (!aiResponse) {
              return experience; // Return original on error
            }
            
            // Parse JSON response
            const cleanedResponse = cleanJsonResponse(aiResponse);
            return JSON.parse(cleanedResponse);
          } catch (jsonError) {
            console.error('Error parsing AI response for experience:', jsonError);
            // If AI response fails, add placeholder bullet points
            const defaultBullets = [
              `Utilized ${experience.techStack || 'relevant technologies'} to deliver high-quality solutions for clients and stakeholders.`,
              `Collaborated with cross-functional teams to implement features and improvements aligned with business goals.`,
              `Maintained code quality through testing, documentation, and following best practices.`
            ];
            return {
              ...experience,
              bullets: defaultBullets
            };
          }
        })
      );
      
      return enhancedExperiences.filter(exp => exp !== null);
    } catch (error) {
      console.error('Error enhancing experiences:', error);
      return experiences.map(exp => ({
        ...exp,
        bullets: [
          `Utilized ${exp.techStack || 'relevant technologies'} to deliver high-quality solutions.`,
          `Collaborated with teams to implement features aligned with business goals.`,
          `Maintained code quality and followed best practices.`
        ]
      }));
    }
  },
  
  // Certifications enhancement
  async enhanceCertifications(certifications, jobDescription) {
    if (!jobDescription || !Array.isArray(certifications) || certifications.length === 0) {
      return certifications; // Return original
    }
    
    try {
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
2. Add or enhance descriptions to be BRIEF (1-2 sentences maximum) and highlight relevance to the job 
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
        return certifications;
      }
      
      // Parse JSON response
      const cleanedResponse = cleanJsonResponse(aiResponse);
      const enhancedCertifications = JSON.parse(cleanedResponse);
      
      // Sort by relevance score if available
      if (enhancedCertifications.some(c => c.relevanceScore)) {
        enhancedCertifications.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }
      
      return enhancedCertifications;
    } catch (error) {
      console.error('Error enhancing certifications:', error);
      // Use fallback function if AI fails
      const fallback = processWithoutAI('certifications', jobDescription);
      return fallback.prioritizeItems(certifications, jobDescription);
    }
  },
  
  // Achievements enhancement
  async enhanceAchievements(achievements, jobDescription) {
    if (!jobDescription || !Array.isArray(achievements) || achievements.length === 0) {
      return achievements; // Return original
    }
    
    try {
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
2. Add or enhance descriptions to be BRIEF (1-2 sentences maximum) and highlight relevance to the job
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
        return achievements;
      }
      
      // Parse JSON response
      const cleanedResponse = cleanJsonResponse(aiResponse);
      const enhancedAchievements = JSON.parse(cleanedResponse);
      
      // Sort by relevance score if available
      if (enhancedAchievements.some(a => a.relevanceScore)) {
        enhancedAchievements.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }
      
      return enhancedAchievements;
    } catch (error) {
      console.error('Error enhancing achievements:', error);
      // Use fallback function if AI fails
      const fallback = processWithoutAI('achievements', jobDescription);
      return fallback.prioritizeItems(achievements, jobDescription);
    }
  },
  
  // Extracurricular activities enhancement
  async enhanceExtracurricular(activities, jobDescription) {
    if (!jobDescription || !Array.isArray(activities) || activities.length === 0) {
      return activities; // Return original
    }
    
    try {
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
2. Enhance descriptions to be BRIEF (1-2 sentences maximum), quantify results, and highlight relevance
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
        return activities;
      }
      
      // Parse JSON response
      const cleanedResponse = cleanJsonResponse(aiResponse);
      const enhancedActivities = JSON.parse(cleanedResponse);
      
      // Sort by relevance score if available
      if (enhancedActivities.some(a => a.relevanceScore)) {
        enhancedActivities.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }
      
      return enhancedActivities;
    } catch (error) {
      console.error('Error enhancing extracurricular activities:', error);
      // Use fallback function if AI fails
      const fallback = processWithoutAI('extracurricular', jobDescription);
      return fallback.prioritizeItems(activities, jobDescription);
    }
  },
  
  // Full resume enhancement
  async enhanceResume(formData, jobDescription) {
    console.log('enhanceResume service called');
    if (!formData || !jobDescription) {
      throw new Error('Job description is required for AI enhancement');
    }
    
    try {
      console.log('Starting parallel enhancement of all sections');
      
      // Add retry logic for enhanced reliability
      const enhanceWithRetry = async (fn, ...args) => {
        try {
          return await fn(...args);
        } catch (error) {
          console.log(`Retrying enhancement after error: ${error.message}`);
          try {
            return await fn(...args);
          } catch (retryError) {
            console.error(`Enhancement failed after retry: ${retryError.message}`);
            // Return fallback results when both attempts fail
            if (args[0] && Array.isArray(args[0])) {
              const fallback = processWithoutAI('section', jobDescription);
              return fallback.prioritizeItems(args[0], jobDescription);
            }
            return args[0]; // Return original input
          }
        }
      };
      
      // Process all sections in parallel for efficiency
      const [
        enhancedIntroduction,
        enhancedTitle,
        enhancedSkills, 
        enhancedProjects, 
        enhancedExperiences, 
        enhancedCertifications,
        enhancedAchievements, 
        enhancedActivities
      ] = await Promise.all([
        enhanceWithRetry(this.enhanceIntroduction, formData.introduction || '', jobDescription),
        enhanceWithRetry(this.enhanceTitle, formData.professionalTitle || '', jobDescription),
        enhanceWithRetry(this.enhanceSkills, formData.skills || [], jobDescription),
        enhanceWithRetry(this.enhanceProjects, formData.projects || [], jobDescription),
        formData.hasExperience ? 
          enhanceWithRetry(this.enhanceExperience, formData.experiences || [], jobDescription) : 
          Promise.resolve([]),
        formData.certifications && formData.certifications.length > 0 ? 
          enhanceWithRetry(this.enhanceCertifications, formData.certifications, jobDescription) : 
          Promise.resolve([]),
        formData.achievements && formData.achievements.length > 0 ? 
          enhanceWithRetry(this.enhanceAchievements, formData.achievements, jobDescription) : 
          Promise.resolve([]),
        formData.extracurricularActivities && formData.extracurricularActivities.length > 0 ? 
          enhanceWithRetry(this.enhanceExtracurricular, formData.extracurricularActivities, jobDescription) : 
          Promise.resolve([])
      ]);
      
      // Combine all enhanced data
      return {
        enhancedIntroduction,
        enhancedTitle,
        enhancedSkills,
        enhancedProjects,
        enhancedExperiences,
        enhancedCertifications,
        enhancedAchievements,
        enhancedActivities
      };
    } catch (error) {
      console.error('Error enhancing resume:', error);
      throw error;
    }
  }
};

export default enhancementServices;