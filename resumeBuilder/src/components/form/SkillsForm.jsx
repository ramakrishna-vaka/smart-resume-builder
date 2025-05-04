// src/components/form/SkillsForm.jsx
import React from 'react';
import Select from 'react-select';

const SkillsForm = ({ skills, handleSkillsChange }) => {
  // Sample skill options - in a real app, this might come from an API or larger predefined list
  const skillOptions = [
    // Programming Languages
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'php', label: 'PHP' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'rust', label: 'Rust' },
    {value:'r', label: 'R'},
    {value:'dart', label: 'Dart'},
    
    // Frontend
    { value: 'react', label: 'React' },
    { value: 'angular', label: 'Angular' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'redux', label: 'Redux' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sass', label: 'Sass/SCSS' },
    { value: 'tailwind', label: 'Tailwind CSS' },
    { value: 'bootstrap', label: 'Bootstrap' },
    { value: 'materialui', label: 'Material UI' },
    
    // Backend
    { value: 'nodejs', label: 'Node.js' },
    { value: 'express', label: 'Express.js' },
    { value: 'django', label: 'Django' },
    { value: 'flask', label: 'Flask' },
    { value: 'fastapi', label: 'FastAPI' },
    { value: 'spring', label: 'Spring Boot' },
    { value: 'laravel', label: 'Laravel' },
    { value: 'rails', label: 'Ruby on Rails' },
    { value: 'dotnet', label: '.NET Core' },
    
    // Databases
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'oracle', label: 'Oracle' },
    { value: 'redis', label: 'Redis' },
    { value: 'firebase', label: 'Firebase' },
    
    // Cloud & DevOps
    { value: 'aws', label: 'AWS' },
    { value: 'azure', label: 'Azure' },
    { value: 'gcp', label: 'Google Cloud' },
    { value: 'docker', label: 'Docker' },
    { value: 'kubernetes', label: 'Kubernetes' },
    { value: 'terraform', label: 'Terraform' },
    { value: 'jenkins', label: 'Jenkins' },
    { value: 'github-actions', label: 'GitHub Actions' },
    { value: 'gitlab-ci', label: 'GitLab CI' },
    {value:'bitbucket', label: 'Bitbucket'},
    
    // Mobile
    { value: 'react-native', label: 'React Native' },
    { value: 'flutter', label: 'Flutter' },
    { value: 'ios', label: 'iOS Development' },
    { value: 'android', label: 'Android Development' },
    
    // Testing
    { value: 'jest', label: 'Jest' },
    { value: 'cypress', label: 'Cypress' },
    { value: 'selenium', label: 'Selenium' },
    { value: 'pytest', label: 'pytest' },
    { value: 'junit', label: 'JUnit' },
    
    // Other
    { value: 'git', label: 'Git' },
    { value: 'graphql', label: 'GraphQL' },
    { value: 'rest', label: 'RESTful APIs' },
    { value: 'websockets', label: 'WebSockets' },
    { value: 'ai', label: 'AI/Machine Learning' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'agile', label: 'Agile/Scrum' },
    { value: 'linux', label: 'Linux' },

    //Core competencies
    {value: 'computer networking', label: 'Computer Networking'},
    {value: 'cloud computing', label: 'Cloud Computing'},
    {value: 'data structures', label: 'Data Structures'},
    {value:'oops', label: 'Object Oriented Programming'},
    {value: 'operating systems', label: 'Operating Systems'},
    {value: 'dbms', label: 'Database Management Systems'},
    {value: 'software engineering', label: 'Software Engineering'},
    {value: 'web development', label: 'Web Development'},
    {value:'penetration testing', label: 'Penetration Testing'},
    {value: 'cyber security', label: 'Cyber Security'},

  ];

  return (
    <div>
      <label htmlFor="skills" className="form-label">Technical Skills</label>
      <Select
        id="skills"
        isMulti
        options={skillOptions}
        value={skills}
        onChange={handleSkillsChange}
        placeholder="Search and select your technical skills..."
        classNamePrefix="select"
      />
    </div>
  );
};

export default SkillsForm;