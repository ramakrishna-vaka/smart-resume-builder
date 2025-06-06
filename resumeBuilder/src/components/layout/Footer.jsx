import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-4 bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>ResumeBuilder</h5>
            <p className="text-muted">
              Create professional resumes with our easy-to-use builder.
            </p>
          </div>
          
          <div className="col-md-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-white-50">Home</Link></li>
              <li><Link to="/templates" className="text-decoration-none text-white-50">Templates</Link></li>
              <li><Link to="/job-description/professional" className="text-decoration-none text-white-50">Job Description</Link></li>
              <li><Link to="/generate-resume/professional" className="text-decoration-none text-white-50">Resume Builder</Link></li>

            </ul>
          </div>
          
          <div className="col-md-3">
            <h5>Resources</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-white-50">Career Advice</a></li>
              <li><a href="#" className="text-decoration-none text-white-50">Resume Tips</a></li>
              <li><a href="#" className="text-decoration-none text-white-50">FAQ</a></li>
            </ul>
          </div>
          
          <div className="col-md-2">
  <h5>Connect</h5>

  {/* Social Icons */}
  <div className="d-flex gap-3 fs-5 mb-2">
    <a href="#" className="text-decoration-none text-white-50">
      <i className="bi bi-facebook"></i>
    </a>
    <a href="#" className="text-decoration-none text-white-50">
      <i className="bi bi-twitter"></i>
    </a>
    <a href="#" className="text-decoration-none text-white-50">
      <i className="bi bi-linkedin"></i>
    </a>
    <a href="#" className="text-decoration-none text-white-50">
      <i className="bi bi-instagram"></i>
    </a>
  </div>

  {/* Feedback Link */}
  <div className="mt-2">
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSf0ra2c8eWlqYObhHSjTuZKjA7TPfrw3vFvLWCk09p-qt8gTg/viewform?usp=dialog"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white-50 text-decoration-none"
    >
      <i className="bi bi-chat-left-text me-1"></i> Feedback
    </a>
  </div>
</div>
        </div>


        
        <hr className="my-3" />
        
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">© {currentYear} ResumeBuilder. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="#" className="text-white-50 text-decoration-none me-3">Privacy Policy</a>
            <a href="#" className="text-white-50 text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;