// src/utils/stickyPreviewHandler.js

/**
 * Creates a handler to manage the sticky behavior of the preview container
 * Prevents the preview container from scrolling over the header when reaching the end of the page
 */
export const initStickyPreviewHandler = () => {
    // This function will be called by a React useEffect hook
    const previewContainer = document.querySelector('.preview-container');
    
    if (!previewContainer) {
      console.warn('Preview container not found in the DOM');
      return () => {}; // Return empty cleanup function
    }
  
    // Function to update the sticky behavior
    const updateStickyState = () => {
      // Get references to important elements
      const mainHeader = document.querySelector('header.sticky-top');
      const resumeNavHeader = document.querySelector('.resume-nav-header');
      const footer = document.querySelector('footer') || document.body;
      
      // Calculate heights and positions
      const headerHeight = (mainHeader?.offsetHeight || 0) + (resumeNavHeader?.offsetHeight || 0);
      const containerRect = previewContainer.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;
      const bottomPosition = documentHeight - (scrollY + windowHeight);
      
      // Check if we're near the bottom of the page
      if (bottomPosition < containerHeight - (windowHeight - headerHeight - 20)) {
        // Switch to absolute positioning when near the bottom
        previewContainer.style.position = 'absolute';
        previewContainer.style.top = `${documentHeight - containerHeight - footer.offsetHeight - 20}px`;
      } else {
        // Restore to sticky positioning
        previewContainer.style.position = 'sticky';
        previewContainer.style.top = '110px';
      }
    };
  
    // Attach event listeners
    window.addEventListener('scroll', updateStickyState);
    window.addEventListener('resize', updateStickyState);
    
    // Run once on initialization
    updateStickyState();
    
    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', updateStickyState);
      window.removeEventListener('resize', updateStickyState);
    };
  };