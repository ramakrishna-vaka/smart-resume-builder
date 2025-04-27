// src/utils/dataFormatter.js

/**
 * Formats experience description from string to array of bullet points
 * @param {string|Array} description - Experience description
 * @returns {Array} Array of bullet points
 */
export const formatExperienceDescription = (description) => {
    if (Array.isArray(description)) {
      return description.filter(item => item && item.trim());
    }
    
    if (typeof description === 'string' && description.trim()) {
      // Split by bullet points or newlines
      return description
        .split(/•|\n/)
        .map(point => point.trim())
        .filter(point => point.length > 0);
    }
    
    return [];
  };
  
  /**
   * Formats form data for API requests to ensure consistent structure
   * @param {Object} formData - Original form data
   * @returns {Object} Formatted data ready for API
   */
  export const formatFormDataForApi = (formData) => {
    const formatted = { ...formData };
    
    // Format skills consistently
    if (Array.isArray(formatted.skills)) {
      formatted.skills = formatted.skills.map(
        skill => typeof skill === 'object' ? skill.value : skill
      );
    }
    
    // Format experiences consistently
    if (Array.isArray(formatted.experiences)) {
      formatted.experiences = formatted.experiences.map(exp => ({
        company: exp.company || '',
        role: exp.role || '',
        period: exp.period || '',
        location: exp.location || '',
        techStack: exp.techStack || '',
        description: formatExperienceDescription(exp.description)
      }));
    }
    
    // Format projects consistently
    if (Array.isArray(formatted.projects)) {
      formatted.projects = formatted.projects.map(project => ({
        projectName: project.projectName || '',
        projectLink: project.projectLink || '',
        projectTechStack: project.projectTechStack || '',
        projectDescription: Array.isArray(project.projectDescription) 
          ? project.projectDescription 
          : (typeof project.projectDescription === 'string' 
              ? formatExperienceDescription(project.projectDescription)
              : [])
      }));
    }

    if (formatted.certifications) {
        formatted.formattedCertifications = formatted.certifications.map(cert => {
          return {
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
            ...(cert.link && { link: cert.link }),
            ...(cert.description && { description: cert.description })
          };
        });
      }
    
      // Handle achievements formatting if needed
      if (formatted.achievements) {
        formatted.formattedAchievements = formatted.achievements.map(achievement => {
          return {
            title: achievement.title,
            year: achievement.year,
            organization: achievement.organization,
            ...(achievement.description && { description: achievement.description })
          };
        });
      }
    
    return formatted;
  };
  