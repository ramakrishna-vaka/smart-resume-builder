export function generateLaTeX(formData) {
    // Basic user info with safe defaults
    const firstName = formData.firstName || 'John';
    const lastName = formData.lastName || 'Doe';
    const email = formData.email || 'email@example.com';
    const phoneNo = formData.phoneNo || '123-456-7890';
    const linkedinUrl = formData.linkedinUrl || '';
    const githubUrl = formData.githubUrl || '';
    const leetcodeUrl = formData.leetcodeUrl || '';
    const professionalTitles = formData.professionalTitles || 'Aspiring Java Developer | Full Stack Developer | Data Scientist';
    
    // Get education info
    const graduationCollegeName = formData.graduationCollegeName || 'University';
    const graduationDegree = formData.graduationDegree || 'Bachelor';
    const graduationCourse = formData.graduationCourse || 'Computer Science';
    const graduationCollegePeriod = formData.graduationCollegePeriod || '2020-2024';
    const graduationScore = formData.graduationScore || '3.5';
    const graduationCollegeAddress = formData.graduationCollegeAddress || 'City, State';
    
    // Escape special LaTeX characters
    const escapeLatex = (text) => {
      if (!text) return '';
      return text
        .replace(/&/g, '\\&')
        .replace(/_/g, '\\_')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}')
        // Don't escape backslashes in LaTeX commands
        .replace(/([^\\])\\/g, '$1\\textbackslash{}')
        .replace(/[<>]/g, '');
    };
    
    // Generate link with icon
    const generateLink = (url, iconType) => {
      if (!url) return '';
      
      let icon = '';
      switch (iconType) {
        case 'linkedin':
          icon = '\\faLinkedin';
          break;
        case 'github':
          icon = '\\faGithub';
          break;
        case 'leetcode':
          icon = '\\faCode';
          break;
        default:
          icon = '\\faLink';
      }
      
      return `\\href{${escapeLatex(url)}}{${icon}~\\underline{${iconType}}}`;
    };
    
    // Generate social links section
    const socialLinks = [];
    if (linkedinUrl) socialLinks.push(generateLink(linkedinUrl, 'linkedin'));
    if (githubUrl) socialLinks.push(generateLink(githubUrl, 'github'));
    if (leetcodeUrl) socialLinks.push(generateLink(leetcodeUrl, 'leetcode'));
    
    const socialLinksSection = socialLinks.length > 0 ? socialLinks.join(' $\\bullet$ ') : '';
    
    let projectsSection = '';
    if (Array.isArray(formData.projects)) {
      projectsSection = formData.projects.map(project => {
        if (!project.projectName) return '';
        const bulletPoint = project.projectDescription
          ? `\\item ${escapeLatex(project.projectDescription)}`
          : '';
        return `
  \\subsection{\\href{${escapeLatex(project.projectLink)}}{\\textbf{${escapeLatex(project.projectName)}}} \\hfill \\textit{\\small ${escapeLatex(project.projectTechStack || '')}}
  \\begin{itemize}[leftmargin=0.15in, label={}, itemsep=-2pt]
  ${bulletPoint}
  \\end{itemize}
  \\vspace{-6pt}
  `;
      }).join('');
    }
    
    // Generate experience section
    let experienceSection = '';
    if (formData.isThereExperience) {
      experienceSection = `
  \\section{Experience}
  \\subsection{${escapeLatex(formData.experienceRole || 'Role')} | ${escapeLatex(formData.experienceCompany || 'Company')}}
  \\vspace{4pt}
  ${escapeLatex(formData.experiencePeriod || '2023-Present')} \\hfill ${escapeLatex(formData.experienceTechStack || 'Technology')}
  \\begin{itemize}[leftmargin=0.15in, label={\\$\\bullet\\$}, itemsep=2pt]
      \\item ${escapeLatex(formData.experienceDescription || 'Description of responsibilities and achievements.')}
  \\end{itemize}
  \\vspace{2pt}
  `;
    }
    
    // Generate skills section
    const allSkills = Array.isArray(formData.skills)
      ? formData.skills.map(skill => typeof skill === 'object' ? skill.value : skill)
      : [];
    const skillsCategories = {
      languages: allSkills,
      core: allSkills,
      technical: allSkills
    };
    
    // Generate achievements section
    const achievementsContent = formData.achievements || '';
    const achievementsSection = achievementsContent ? `
  \\section{Achievements}
  \\begin{itemize}[leftmargin=0.15in, label={\\$\\bullet\\$}, itemsep=2pt]
      \\item ${escapeLatex(achievementsContent)}
  \\end{itemize}
  \\vspace{2pt}
  ` : '';
    
    // Generate certifications section
    const certificationsContent = formData.certifications || '';
    const certificationsSection = certificationsContent ? `
  \\section{Certifications}
  \\begin{itemize}[leftmargin=0.15in, label={\\$\\bullet\\$}, itemsep=2pt]
      \\item ${escapeLatex(certificationsContent)}
  \\end{itemize}
  \\vspace{2pt}
  ` : '';
    
    return `\\documentclass[letterpaper,11pt]{article}
  
  \\usepackage{latexsym}
  \\usepackage[empty]{fullpage}
  \\usepackage{titlesec}
  \\usepackage{marvosym}
  \\usepackage[table,xcdraw,HTML,usenames,dvipsnames]{xcolor}
  \\usepackage{verbatim}
  \\usepackage{enumitem}
  \\usepackage[hidelinks]{hyperref}
  \\usepackage{fancyhdr}
  \\usepackage[english]{babel}
  \\usepackage{tabularx}
  \\usepackage{fontawesome5}
  \\usepackage{multicol}
  \\usepackage[defaultsans]{opensans} % Use Open Sans as default sans font
  \\usepackage{geometry}
  
  % Better spacing settings
  \\setlength{\\multicolsep}{6pt}
  \\setlength{\\columnsep}{10pt}
  \\setlength{\\parindent}{0pt}
  \\setlength{\\parskip}{6pt}
  \\input{glyphtounicode}
  
  % Set page geometry
  \\geometry{
    letterpaper,
    top=0.75in,
    bottom=0.75in,
    left=0.75in,
    right=0.75in
  }
  
  % Better spacing for lists
  \\setlist{itemsep=1pt, parsep=1pt}
  
  \\pagestyle{fancy}
  \\fancyhf{} % clear all header and footer fields
  \\fancyfoot{}
  \\renewcommand{\\headrulewidth}{0pt}
  \\renewcommand{\\footrulewidth}{0pt}
  
  % Adjust spacing
  \\titlespacing*{\\section}{0pt}{10pt}{3pt}
  \\titlespacing*{\\subsection}{0pt}{6pt}{2pt}
  \\titlespacing*{\\subsubsection}{0pt}{3pt}{1pt}
  
  % Define colors
  \\definecolor{primary}{HTML}{2b2b2b}
  \\definecolor{headings}{HTML}{4a4a4a}
  \\definecolor{subheadings}{HTML}{333333}
  \\definecolor{linkcolor}{HTML}{0366d6}
  
  % Set main font
  \\renewcommand{\\normalsize}{\\fontsize{10pt}{14pt}\\selectfont}
  
  % Section formatting with better spacing
  \\titleformat{\\section}{
  \\vspace{-6pt}\\raggedright\\small\\bfseries
  }{}{0em}{}[\\color{black}\\titlerule \\vspace{-8pt}]
  
  % Subsection formatting with better spacing
  \\titleformat{\\subsection}{
    \\color{subheadings}\\raggedright\\bfseries
  }{}{0em}{}
  
  % Link styling
  \\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=black
  }
  
  % Ensure that pdfTeX generates CID fonts instead of Type 3 fonts
  \\pdfgentounicode=1
  
  \\begin{document}
  
  % Name and contact section
  \\begin{center}
    \\textbf{\\Large \\scshape ${escapeLatex(firstName)} ${escapeLatex(lastName)}} \\\\\
    \\vspace{2pt}
    \\fontsize{9}{11}\\selectfont{\\small 
    ${escapeLatex(phoneNo)} $|$ 
    \\href{mailto:${escapeLatex(email)}}{\\underline{${escapeLatex(email)}}}
    ${linkedinUrl ? ` $|$ \\href{${escapeLatex(linkedinUrl)}}{\\underline{LinkedIn}}` : ''}
    ${githubUrl ? ` $|$ \\href{${escapeLatex(githubUrl)}}{\\underline{GitHub}}` : ''}
    }\\\\
    \\vspace{2pt}
  \\end{center}
  
  % Education Section
  \\section{Education}
  \\subsection{${graduationCollegeName}}
  \\vspace{4pt}
  ${graduationDegree} in ${graduationCourse} \\hfill ${graduationCollegePeriod} \\\\\
  GPA: ${graduationScore} \\hfill ${graduationCollegeAddress}
  \\vspace{6pt}
  
  % Skills section
  \\section{Technical Skills}
  \\begin{itemize}[leftmargin=0.15in, label={}]
  \\small
    ${skillsCategories.languages.length ? `\\item \\textbf{Languages:} ${skillsCategories.languages.join(', ')}` : ''}
    ${skillsCategories.core.length ? `\\item \\textbf{Core Competencies:} ${skillsCategories.core.join(', ')}` : ''}
    ${skillsCategories.technical.length ? `\\item \\textbf{Technical Skills:} ${skillsCategories.technical.join(', ')}` : ''}
  \\end{itemize}
  \\vspace{2pt}
  
  % Experience Section
  ${experienceSection}
  
  % Projects Section
  \\section{Projects}
  ${projectsSection}
  
  % Achievements Section
  ${achievementsSection}
  
  % Certifications Section
  ${certificationsSection}
  
  \\end{document}`;
  }
  