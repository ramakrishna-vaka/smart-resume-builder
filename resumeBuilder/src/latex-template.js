export function generateLaTeX(formData) {
    // Basic user info with safe defaults
    const firstName = formData.firstName || 'John';
    const lastName = formData.lastName || 'Doe';
    const email = formData.email || 'email@example.com';
    const phoneNo = formData.phoneNo || '123-456-7890';
    const linkedinUrl = formData.linkedinUrl || '';
    const githubUrl = formData.githubUrl || '';
    const leetcodeUrl = formData.leetcodeUrl || '';
    const portfolioUrl = formData.portfolioUrl || ''; // Added portfolio URL
    
    // Professional title with default
    const professionalTitle = formData.professionalTitle || '';

    const formatProfessionalTitle = (title) => {
      if (!title) return '';
      const escapedTitle = escapeLatex(title);
      return escapedTitle.replace(/\s*,\s*/g, ' $|$ ');
    };
    
    // Get introduction text
    const introduction = formData.introduction || '';
    
    // Get education info
    const graduationCollegeName = formData.graduationCollegeName || 'University';
    const graduationDegree = formData.graduationDegree || 'Bachelor';
    const graduationCourse = formData.graduationCourse || 'Computer Science';
    const graduationCollegePeriod = formData.graduationCollegePeriod || '2020-2024';
    const graduationScore = formData.graduationScore || '3.5';
    const graduationCollegeAddress = formData.graduationCollegeAddress || 'City, State';
    
    // Get intermediate education info if available
    const intermediateCollegeName = formData.interCollegeName || '';
    const intermediateDegree = formData.intermediateDegree || 'Intermediate Education';
    const intermediateCollegePeriod = formData.interPeriod || '';
    const intermediateScore = formData.interScore || '';
    const intermediateCollegeAddress = formData.interCollegeAddress || '';
    
    // Get school info if available
    const schoolName = formData.schoolName || '';
    const schoolDegree = formData.schoolDegree || 'Class X';
    const schoolPeriod = formData.schoolPeriod || '';
    const schoolScore = formData.schoolScore || '';
    const schoolAddress = formData.schoolAddress || '';
    
    // Escape special LaTeX characters - IMPROVED VERSION
    const escapeLatex = (text) => {
      if (!text) return '';
      return String(text) 
        .replace(/\\/g, '\\textbackslash{}') // Handle backslash first to avoid double escaping
        .replace(/&/g, '\\&')
        .replace(/_/g, '\\_')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/[<>]/g, '')
        .trim(); // Ensure no trailing or leading whitespace
    };
    
    // Generate projects section
    let projectsSection = '';
    
    // Always ensure we have at least one project to avoid LaTeX errors
    const hasValidProjects = Array.isArray(formData.projects) && formData.projects.length > 0 && 
                            formData.projects.some(p => p && p.projectName);
                            
    if (hasValidProjects) {
      projectsSection = formData.projects
        .filter(project => project && project.projectName) // Only process valid projects
        .map(project => {
          // Convert description to bullet points if it's not already in array form
          let bulletPoints = [];
          if (Array.isArray(project.projectDescription)) {
            bulletPoints = project.projectDescription.filter(point => point && point.trim());
          } else if (typeof project.projectDescription === 'string' && project.projectDescription.trim()) {
            // Split by periods, semicolons, or explicit newlines to create bullet points
            bulletPoints = project.projectDescription
              .split(/(?<=[.;])\s+|\n/)
              .filter(point => point.trim().length > 0);
            
            // If we couldn't split it properly, just use it as a single bullet
            if (bulletPoints.length <= 1) {
              bulletPoints = [project.projectDescription];
            }
          }
          
          // CRITICAL FIX: Ensure we have at least one bullet point to avoid LaTeX errors
          if (bulletPoints.length === 0) {
            bulletPoints = ["Project involved development and implementation."];
          }
          
          // Format bullet points safely - ensure proper escaping and closing braces
          const formattedBullets = bulletPoints
            .map(bullet => {
              const escapedBullet = escapeLatex(bullet.trim());
              return `    \\resumeItem{${escapedBullet}}`;
            })
            .join('\n');
          
          // Project links - make project name a hyperlink if link provided
          const projectName = project.projectLink ? 
            `\\href{${escapeLatex(project.projectLink)}}{\\textbf{${escapeLatex(project.projectName)}}}` :
            `\\textbf{${escapeLatex(project.projectName)}}`;
          
          // Tech stack to the right
          const techStack = project.projectTechStack ? 
            `{${escapeLatex(project.projectTechStack)}}` : '{}';
          
          return `
  \\resumeProjectHeading
    {${projectName}}{${techStack}}
    \\resumeItemListStart
${formattedBullets}
    \\resumeItemListEnd`;
        }).join('\n');
    }
    
    // FIX: If no valid projects, provide a default project to ensure LaTeX compilation works
    if (!projectsSection) {
      projectsSection = `
  \\resumeProjectHeading
    {\\textbf{Personal Project}}{Technology Stack}
    \\resumeItemListStart
    \\resumeItem{Created a web application using modern technologies}
    \\resumeItemListEnd`;
    }
    
    // Generate experience section
    let experienceSection = "";
    if (formData.hasExperience && Array.isArray(formData.experiences) && formData.experiences.length > 0 &&
        formData.experiences.some(exp => exp && (exp.company || exp.role))) {
      
      // Start with the section header and list start command
      experienceSection = "\\section{Experience}\n\\resumeSubHeadingListStart\n";
      
      // Add each valid experience
      const validExperiences = formData.experiences.filter(exp => exp && (exp.company || exp.role));
      
      validExperiences.forEach(exp => {
        // Escape fields and apply defaults
        const company = escapeLatex(exp.company || "Company");
        const period = escapeLatex(exp.period || "Present");
        const role = escapeLatex(exp.role || "Role");
        const location = escapeLatex(exp.location || "");
        const techStack = escapeLatex(exp.techStack || "Technology");
        
        // Handle description - ensure we have at least one item
        let bulletPoints = [];
        if (typeof exp.description === 'string' && exp.description.trim()) {
          // Try to split by explicit bullet points, new lines, or periods
          bulletPoints = exp.description
            .split(/•|\n|(?<=[.;])\s+/)
            .map(point => point.trim())
            .filter(point => point.length > 0);
          
          // If we couldn't split it properly, just use it as a single bullet
          if (bulletPoints.length === 0) {
            bulletPoints = ["Worked on various projects and initiatives."];
          }
        } else if (Array.isArray(exp.description)) {
          bulletPoints = exp.description.filter(point => point && point.trim());
          // Ensure we have at least one bullet point
          if (bulletPoints.length === 0) {
            bulletPoints = ["Worked on various projects and initiatives."];
          }
        } else {
          // Default bullet point if no description
          bulletPoints = ["Worked on various projects and initiatives."];
        }
        
        // Format bullet points - ensure we have content
        const formattedBullets = bulletPoints
          .map(bullet => {
            const escapedBullet = escapeLatex(bullet.trim());
            return `    \\resumeItem{${escapedBullet}}`;
          })
          .join('\n');
        
        experienceSection += `
  \\resumeSubheading
    {${company}}{${period}}
    {${role}}{${location}}
    \\resumeItemListStart
${formattedBullets}
    \\resumeItemListEnd
  \\textbf{Technologies:} ${techStack}\n`;
      });
      
      // End the section with the list end command
      experienceSection += "\\resumeSubHeadingListEnd\n";
    } else {
      experienceSection = ""; // Empty string if no experience
    }
     
    const skills = formData.skills || [];
const allLanguages = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 
  'ruby', 'php', 'swift', 'kotlin', 'rust', 'r', 'dart', 'html', 'css'];

const allCoreCompetencies = ['computer networking', 'cloud computing', 'data structures', 
         'oops', 'operating systems', 'dbms', 'software engineering', 
         'web development', 'penetration testing', 'cyber security', 'data-analysis'];

const { languages, coreCompetencies, technicalSkills } = categorizeUserSkills(skills);
function categorizeUserSkills(userSkills) {

const languages = [];
const coreCompetencies = [];
const technicalSkills = [];

// Categorize each user skill
userSkills.forEach(skill => {
const skillLower = skill.toLowerCase();

if (allLanguages.includes(skillLower)) {
languages.push(skill);
} else if (allCoreCompetencies.includes(skillLower)) {
coreCompetencies.push(skill);
} else {
technicalSkills.push(skill);
}
});

// Convert arrays to comma-separated strings or use defaults if empty
return {
languages: languages.length > 0 ? languages.join(', ') : 'Java, Python, C/C++, SQL, HTML, CSS, JavaScript',
coreCompetencies: coreCompetencies.length > 0 ? coreCompetencies.join(', ') : 'OOPS, Database Management Systems, Computer Networks, SDLC, Operating Systems',
technicalSkills: technicalSkills.length > 0 ? technicalSkills.join(', ') : 'Git, Data structures and algorithms, MERN Stack, Power BI'
};
}
    
    // Generate certifications section
//     let certificationsSection = '';
//     if (Array.isArray(formData.certifications) && formData.certifications.length > 0 && 
//         formData.certifications.some(cert => cert && cert.name)) {
//       certificationsSection = `
// \\section{Certifications}
// \\resumeSubHeadingListStart`;

//       formData.certifications
//         .filter(cert => cert && cert.name)
//         .forEach(cert => {
//           const certName = escapeLatex(cert.name || '');
//           const issuer = escapeLatex(cert.issuer || '');
//           const date = escapeLatex(cert.date || '');
//           const link = cert.link ? `\\href{${escapeLatex(cert.link)}}{${certName}}` : certName;

//           // Handle description - ensure we have at least one item
//         let bulletPoints = [];
//         if (typeof cert.description === 'string' && cert.description.trim()) {
//           // Try to split by explicit bullet points, new lines, or periods
//           bulletPoints = cert.description
//             .split(/•|\n|(?<=[.;])\s+/)
//             .map(point => point.trim())
//             .filter(point => point.length > 0);
          
//           // If we couldn't split it properly, just use it as a single bullet
//           if (bulletPoints.length === 0) {
//             bulletPoints = ["Completed certification requirements and demonstrated proficiency."];
//           }
//         } else if (Array.isArray(cert.description)) {
//           bulletPoints = cert.description.filter(point => point && point.trim());
//           // Ensure we have at least one bullet point
//           if (bulletPoints.length === 0) {
//             bulletPoints = ["Completed certification requirements and demonstrated proficiency."];
//           }
//         } else {
//           // Default bullet point if no description
//           bulletPoints = ["Completed certification requirements and demonstrated proficiency."];
//         }
        
//         // Format bullet points - ensure we have content
//         const formattedBullets = bulletPoints
//           .map(bullet => {
//             const escapedBullet = escapeLatex(bullet.trim());
//             return `    \\resumeItem{${escapedBullet}}`;
//           })
//           .join('\n');
          
//           certificationsSection += `
//   \\resumeProjectHeading
//     {\\textbf{${link}}}{${issuer} | ${date}}
//     \\resumeItemListStart
// ${formattedBullets}
//     \\resumeItemListEnd`;
//         });
      
//       certificationsSection += `
// \\resumeSubHeadingListEnd`;
//     }

//     // Generate achievements section
//     let achievementsSection = '';
//     if (Array.isArray(formData.achievements) && formData.achievements.length > 0 && 
//         formData.achievements.some(achievement => achievement && achievement.title)) {
//       achievementsSection = `
// \\section{Achievements}
// \\resumeSubHeadingListStart`;

//       formData.achievements
//         .filter(achievement => achievement && achievement.title)
//         .forEach(achievement => {
//           const title = escapeLatex(achievement.title || '');
//           const year = escapeLatex(achievement.year || '');
//           const organization = escapeLatex(achievement.organization || '');

//           // Handle description - ensure we have at least one item
//         let bulletPoints = [];
//         if (typeof achievement.description === 'string' && achievement.description.trim()) {
//           // Try to split by explicit bullet points, new lines, or periods
//           bulletPoints = achievement.description
//             .split(/•|\n|(?<=[.;])\s+/)
//             .map(point => point.trim())
//             .filter(point => point.length > 0);
          
//           // If we couldn't split it properly, just use it as a single bullet
//           if (bulletPoints.length === 0) {
//             bulletPoints = ["Recognized for outstanding performance and contributions."];
//           }
//         } else if (Array.isArray(achievement.description)) {
//           bulletPoints = achievement.description.filter(point => point && point.trim());
//           // Ensure we have at least one bullet point
//           if (bulletPoints.length === 0) {
//             bulletPoints = ["Recognized for outstanding performance and contributions."];
//           }
//         } else {
//           // Default bullet point if no description
//           bulletPoints = ["Recognized for outstanding performance and contributions."];
//         }
        
//         // Format bullet points - ensure we have content
//         const formattedBullets = bulletPoints
//           .map(bullet => {
//             const escapedBullet = escapeLatex(bullet.trim());
//             return `    \\resumeItem{${escapedBullet}}`;
//           })
//           .join('\n');
          
//           achievementsSection += `
//   \\resumeProjectHeading
//     {\\textbf{${title}}}{${year}}
//     {${organization}}{}
//     \\resumeItemListStart
//       ${formattedBullets}
//     \\resumeItemListEnd`;
//         });
      
//       achievementsSection += `
// \\resumeSubHeadingListEnd`;
//     }

//     // Generate extracurricular activities section
//     let extracurricularSection = '';
//     if (Array.isArray(formData.extracurricularActivities) && formData.extracurricularActivities.length > 0 && 
//         formData.extracurricularActivities.some(activity => activity && activity.name)) {
//       extracurricularSection = `
// \\section{Extracurricular Activities}
// \\resumeSubHeadingListStart`;

//       formData.extracurricularActivities
//         .filter(activity => activity && activity.name)
//         .forEach(activity => {
//           const name = escapeLatex(activity.name || '');
//           const role = escapeLatex(activity.role || '');
//           const organization = escapeLatex(activity.organization || '');
//           const period = escapeLatex(activity.period || '');
          
//           // Handle description - ensure we have at least one item
//         let bulletPoints = [];
//         if (typeof activity.description === 'string' && activity.description.trim()) {
//           // Try to split by explicit bullet points, new lines, or periods
//           bulletPoints = activity.description
//             .split(/•|\n|(?<=[.;])\s+/)
//             .map(point => point.trim())
//             .filter(point => point.length > 0);
          
//           // If we couldn't split it properly, just use it as a single bullet
//           if (bulletPoints.length === 0) {
//             bulletPoints = ["Participated actively and contributed to the organization\'s goals."];
//           }
//         } else if (Array.isArray(activity.description)) {
//           bulletPoints = activity.description.filter(point => point && point.trim());
//           // Ensure we have at least one bullet point
//           if (bulletPoints.length === 0) {
//             bulletPoints = ["Participated actively and contributed to the organization\'s goals."];
//           }
//         } else {
//           // Default bullet point if no description
//           bulletPoints = ["Participated actively and contributed to the organization\'s goals."];
//         }
        
//         // Format bullet points - ensure we have content
//         const formattedBullets = bulletPoints
//           .map(bullet => {
//             const escapedBullet = escapeLatex(bullet.trim());
//             return `    \\resumeItem{${escapedBullet}}`;
//           })
//           .join('\n');
//           extracurricularSection += `
//   \\resumeSubheading
//     {${name}}{${period}}
//     {${role}}{${organization}}
//     \\resumeItemListStart
//       ${formattedBullets}
//     \\resumeItemListEnd`;
//         });
      
//       extracurricularSection += `
// \\resumeSubHeadingListEnd`;
//     }

let certificationsSection = '';
    if (Array.isArray(formData.certifications) && formData.certifications.length > 0 && 
        formData.certifications.some(cert => cert && cert.name)) {
      certificationsSection = `
\\section{Certifications}
\\resumeSubHeadingListStart`;

      formData.certifications
        .filter(cert => cert && cert.name)
        .forEach(cert => {
          const certName = escapeLatex(cert.name || '');
          const issuer = escapeLatex(cert.issuer || '');
          const date = escapeLatex(cert.date || '');
          const link = cert.link ? `\\href{${escapeLatex(cert.link)}}{${certName}}` : certName;

          // Handle description - don't add default bullet points
          let bulletPoints = [];
          if (typeof cert.description === 'string' && cert.description.trim()) {
            // Try to split by explicit bullet points, new lines, or periods
            bulletPoints = cert.description
              .split(/•|\n|(?<=[.;])\s+/)
              .map(point => point.trim())
              .filter(point => point.length > 0);
          } else if (Array.isArray(cert.description)) {
            bulletPoints = cert.description.filter(point => point && point.trim());
          }
          
          // Format bullet points content - only if we have actual content
          let formattedBullets = '';
          if (bulletPoints.length > 0) {
            formattedBullets = bulletPoints
              .map(bullet => {
                const escapedBullet = escapeLatex(bullet.trim());
                return `    \\resumeItem{${escapedBullet}}`;
              })
              .join('\n');
            
            certificationsSection += `
  \\resumeProjectHeading
    {\\textbf{${link}}}{${issuer} | ${date}}
    \\resumeItemListStart
${formattedBullets}
    \\resumeItemListEnd`;
          } else {
            // If no description, just show the heading without bullets
            certificationsSection += `
  \\resumeProjectHeading
    {\\textbf{${link}}}{${issuer} | ${date}}`;
          }
        });
      
      certificationsSection += `
\\resumeSubHeadingListEnd`;
    }

    // Generate achievements section
    let achievementsSection = '';
    if (Array.isArray(formData.achievements) && formData.achievements.length > 0 && 
        formData.achievements.some(achievement => achievement && achievement.title)) {
      achievementsSection = `
\\section{Achievements}
\\resumeSubHeadingListStart`;

      formData.achievements
        .filter(achievement => achievement && achievement.title)
        .forEach(achievement => {
          const title = escapeLatex(achievement.title || '');
          const year = escapeLatex(achievement.year || '');
          const organization = escapeLatex(achievement.organization || '');

          // Handle description - don't add default bullet points
          let bulletPoints = [];
          if (typeof achievement.description === 'string' && achievement.description.trim()) {
            // Try to split by explicit bullet points, new lines, or periods
            bulletPoints = achievement.description
              .split(/•|\n|(?<=[.;])\s+/)
              .map(point => point.trim())
              .filter(point => point.length > 0);
          } else if (Array.isArray(achievement.description)) {
            bulletPoints = achievement.description.filter(point => point && point.trim());
          }
          
          // Format bullet points content - only if we have actual content
          let formattedBullets = '';
          if (bulletPoints.length > 0) {
            formattedBullets = bulletPoints
              .map(bullet => {
                const escapedBullet = escapeLatex(bullet.trim());
                return `    \\resumeItem{${escapedBullet}}`;
              })
              .join('\n');
            
            achievementsSection += `
  \\resumeProjectHeading
    {\\textbf{${title}}}{${year}}
    {${organization}}{}
    \\resumeItemListStart
      ${formattedBullets}
    \\resumeItemListEnd`;
          } else {
            // If no description, just show the heading without bullets
            achievementsSection += `
  \\resumeProjectHeading
    {\\textbf{${title}}}{${year}}
    {${organization}}{}`;
          }
        });
      
      achievementsSection += `
\\resumeSubHeadingListEnd`;
    }

    // Generate extracurricular activities section
    let extracurricularSection = '';
    if (Array.isArray(formData.extracurricularActivities) && formData.extracurricularActivities.length > 0 && 
        formData.extracurricularActivities.some(activity => activity && activity.name)) {
      extracurricularSection = `
\\section{Extracurricular Activities}
\\resumeSubHeadingListStart`;

      formData.extracurricularActivities
        .filter(activity => activity && activity.name)
        .forEach(activity => {
          const name = escapeLatex(activity.name || '');
          const role = escapeLatex(activity.role || '');
          const organization = escapeLatex(activity.organization || '');
          const period = escapeLatex(activity.period || '');
          
          // Handle description - don't add default bullet points
          let bulletPoints = [];
          if (typeof activity.description === 'string' && activity.description.trim()) {
            // Try to split by explicit bullet points, new lines, or periods
            bulletPoints = activity.description
              .split(/•|\n|(?<=[.;])\s+/)
              .map(point => point.trim())
              .filter(point => point.length > 0);
          } else if (Array.isArray(activity.description)) {
            bulletPoints = activity.description.filter(point => point && point.trim());
          }
          
          // Format bullet points content - only if we have actual content
          let formattedBullets = '';
          if (bulletPoints.length > 0) {
            formattedBullets = bulletPoints
              .map(bullet => {
                const escapedBullet = escapeLatex(bullet.trim());
                return `    \\resumeItem{${escapedBullet}}`;
              })
              .join('\n');
            
            extracurricularSection += `
  \\resumeSubheading
    {${name}}{${period}}
    {${role}}{${organization}}
    \\resumeItemListStart
      ${formattedBullets}
    \\resumeItemListEnd`;
          } else {
            // If no description, just show the heading without bullets
            extracurricularSection += `
  \\resumeSubheading
    {${name}}{${period}}
    {${role}}{${organization}}`;
          }
        });
      
      extracurricularSection += `
\\resumeSubHeadingListEnd`;
    }
    
    // Format URLs for LinkedIn, GitHub, LeetCode, and Portfolio
    const formattedLinkedinUrl = linkedinUrl ? `\\href{${escapeLatex(linkedinUrl)}}{\\underline{LinkedIn}}` : 'LinkedIn';
    const formattedGithubUrl = githubUrl ? `\\href{${escapeLatex(githubUrl)}}{\\underline{GitHub}}` : 'GitHub';
    const formattedLeetcodeUrl = leetcodeUrl ? `$|$ \\href{${escapeLatex(leetcodeUrl)}}{\\underline{LeetCode}}` : '';
    const formattedPortfolioUrl = portfolioUrl ? `$|$ \\href{${escapeLatex(portfolioUrl)}}{\\underline{Portfolio}}` : '';
    
    // Introduction section with horizontal rule
    const introductionSection = introduction ?`
\\section{Introduction}
${escapeLatex(introduction)}
` : '';
    
    return `\\documentclass[letterpaper,10pt]{article}
  
  \\usepackage{latexsym}
  \\usepackage[empty]{fullpage}
  \\usepackage{titlesec}
  \\usepackage{marvosym}
  \\usepackage[usenames,dvipsnames]{color}
  \\usepackage{verbatim}
  \\usepackage{enumitem}
  \\usepackage[hidelinks]{hyperref}
  \\usepackage{fancyhdr}
  \\usepackage[english]{babel}
  \\usepackage{tabularx}
  \\input{glyphtounicode}
  
  \\pagestyle{fancy}
  \\fancyhf{} % clear all header and footer fields
  \\fancyfoot{}
  \\renewcommand{\\headrulewidth}{0pt}
  \\renewcommand{\\footrulewidth}{0pt}
  
  % Adjust margins
  \\addtolength{\\oddsidemargin}{-0.6in}
  \\addtolength{\\evensidemargin}{-0.6in}
  \\addtolength{\\textwidth}{1.2in}
  \\addtolength{\\topmargin}{-.7in}
  \\addtolength{\\textheight}{1.4in}
  
  \\urlstyle{same}
  
  \\raggedbottom
  \\raggedright
  \\setlength{\\tabcolsep}{0in}
  
  % Sections formatting
  \\titleformat{\\section}{
    \\vspace{-6pt}\\scshape\\raggedright\\small
  }{}{0em}{}[\\color{black}\\titlerule \\vspace{-8pt}]
  
  % Ensure that generate pdf is machine readable/ATS parsable
  \\pdfgentounicode=1
  
  %-------------------------
  % Custom commands
  \\newcommand{\\resumeItem}[1]{
    \\item\\small{#1}
  }
  
  \\newcommand{\\resumeSubheading}[4]{
    \\vspace{-2pt}\\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1} & #2 \\\\
        \\textit{\\small#3} & \\textit{\\small#4} \\\\
      \\end{tabular*}\\vspace{-6pt}
  }
  
  \\newcommand{\\resumeSubSubheading}[2]{
      \\item
      \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
        \\textit{\\small#1} & \\textit{\\small#2} \\\\
      \\end{tabular*}\\vspace{-6pt}
  }
  
  \\newcommand{\\resumeProjectHeading}[2]{
      \\item
      \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
        \\small#1 & \\hfill \\small#2 \\\\
      \\end{tabular*}\\vspace{-5pt}
  }
  
  \\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-3pt}}
  
  \\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
  
  \\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
  \\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
  \\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in, label={$\\bullet$}]}
  \\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-4pt}}
  
  %-------------------------------------------
  %%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%
  
  \\begin{document}
  
  %----------HEADING---------
  
  \\begin{center}
      \\textbf{\\Large \\scshape ${escapeLatex(firstName)} ${escapeLatex(lastName)}} \\\\
      \\vspace{2pt}
      ${professionalTitle ? `\\small{\\textit{${formatProfessionalTitle(professionalTitle)}}} \\\\
      \\vspace{2pt}`: ''}
      \\small{${escapeLatex(phoneNo)} $|$ \\href{mailto:${escapeLatex(email)}}{\\underline{${escapeLatex(email)}}} $|$ 
      ${formattedLinkedinUrl} $|$
      ${formattedGithubUrl}${formattedLeetcodeUrl}${formattedPortfolioUrl}} \\\\ 
  \\end{center}
  
  %-----------INTRODUCTION-----------
  ${introductionSection}
  
  %-----------EDUCATION-----------
  \\section{Education}
  \\vspace{4pt} % Adjust this value to your desired space
  \\resumeSubHeadingListStart
  \\resumeSubheading
      {${escapeLatex(graduationCollegeName)}}{${escapeLatex(graduationCollegeAddress)}}
      {${escapeLatex(graduationDegree)} in ${escapeLatex(graduationCourse)}}{${escapeLatex(graduationCollegePeriod)}}
      \\resumeItemListStart
          \\resumeItem{\\textbf{CGPA: ${escapeLatex(graduationScore)}}}
      \\resumeItemListEnd
  ${intermediateCollegeName ? `
  \\resumeSubheading
      {${escapeLatex(intermediateCollegeName)}}{${escapeLatex(intermediateCollegeAddress)}}
      {${escapeLatex(intermediateDegree)}}{${escapeLatex(intermediateCollegePeriod)}}
      \\resumeItemListStart
          \\resumeItem{\\textbf{Percentage: ${escapeLatex(intermediateScore)}}}
      \\resumeItemListEnd
  ` : ''}
  ${schoolName ? `
  \\resumeSubheading
      {${escapeLatex(schoolName)}}{${escapeLatex(schoolAddress)}}
      {${escapeLatex(schoolDegree)}}{${escapeLatex(schoolPeriod)}}
      \\resumeItemListStart
          \\resumeItem{\\textbf{CGPA: ${escapeLatex(schoolScore)}}}
      \\resumeItemListEnd
  ` : ''}
  \\resumeSubHeadingListEnd
  
  %-----------EXPERIENCE-----------
  ${experienceSection}
  
  %-----------Projects-----------
  
  \\section{Projects}
  \\resumeSubHeadingListStart
  ${projectsSection}
  \\resumeSubHeadingListEnd
  
  %-----------PROGRAMMING SKILLS-----------
  \\section{Technical Skills}
  \\vspace{4pt}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{
      \\item \\textbf{Languages:} ${escapeLatex(languages)}
      \\item \\textbf{Core Competencies:} ${escapeLatex(coreCompetencies)}
      \\item \\textbf{Technical Skills:} ${escapeLatex(technicalSkills)}
    }
  \\end{itemize}
  
  %-------------------------------------------
  ${certificationsSection}
  
  ${achievementsSection}
  
  ${extracurricularSection}
  
  \\end{document}`;
}