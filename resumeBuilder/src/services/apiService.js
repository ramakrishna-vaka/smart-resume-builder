// src/services/apiService.js
// apiService.js - Unified approach that supports both authentication methods
import { useAuth } from '@clerk/clerk-react'; // Only needed if using Clerk

const useApiService = () => {
  // Try to use Clerk auth if available, otherwise proceed without it
  const auth = typeof useAuth === 'function' ? useAuth() : null;
  const isUsingClerk = !!auth;
  
  // Base API URL
  const API_BASE_URL = 'https://smart-resume-builder-backend.onrender.com';

  // Helper for API requests that need authentication
  const authenticatedRequest = async (endpoint, options = {}) => {
    try {
      let headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      // Add authentication based on available method
      if (isUsingClerk) {
        const { getToken, isSignedIn } = auth;
        if (!isSignedIn) {
          throw new Error('User is not signed in');
        }
        
        const token = await getToken();
        if (!token) {
          throw new Error('Failed to get authentication token');
        }
        
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Make the API call
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include' // Keep this for backward compatibility
      });

      // Process response
      if (!response.ok) {
        const errorData = await tryParseJson(response);
        throw new Error(errorData?.error || errorData?.message || `API request failed with status ${response.status}`);
      }

      return await tryParseJson(response);
      
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  // Helper for public API requests (no auth required)
  const publicRequest = async (endpoint, options = {}) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include' // Keep for backward compatibility
      });

      if (!response.ok) {
        const errorData = await tryParseJson(response);
        throw new Error(errorData?.error || errorData?.message || `API request failed with status ${response.status}`);
      }

      return await tryParseJson(response);
      
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  // Helper to safely parse JSON or return the text response
  const tryParseJson = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType && contentType.includes('application/pdf')) {
      return { blob: await response.blob(), contentType };
    } else {
      const text = await response.text();
      try {
        // Try to parse it anyway in case the Content-Type header is wrong
        return JSON.parse(text);
      } catch (e) {
        // If it's not JSON, return the text
        return { text, contentType };
      }
    }
  };

  // API methods
  return {
    // Resume data operations
    saveResumeData: (resumeData) => authenticatedRequest('/api/resume-data/save', {
      method: 'POST',
      body: JSON.stringify({ resumeData })
    }),
    
    fetchResumeData: () => authenticatedRequest('/api/resume-data/fetch'),
    
    generateResume: (formData) => authenticatedRequest('/generate-resume', {
      method: 'POST',
      body: JSON.stringify({ originalData: formData })
    }),
    
    // Enhancement operations
    enhanceResume: (formData, jobDescription) => authenticatedRequest('/enhance/resume', {
      method: 'POST',
      body: JSON.stringify({ formData, jobDescription })
    }),
    
    enhanceSkills: (skills, jobDescription) => authenticatedRequest('/enhance/skills', {
      method: 'POST',
      body: JSON.stringify({ skills, jobDescription })
    }),
    
    // Utility operations
    checkHealth: () => publicRequest('/health'),
    testApi: () => publicRequest('/api/test')
  };
};

export default useApiService;