// pages/HeroPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import resumeBuilderHero from '../assets/Resume Builder.png';


const HeroPage = () => {
  const { isSignedIn } = useAuth();
  
  return (
    <div className="hero-container">
      <div className="hero-content container">
        <div className="row align-items-start pt-5 pb-5">
          <div className="col-lg-5">
            <h1 className="display-3 fw-bold mb-4">Build Smart Resumes That Get You Hired</h1>
            <p className="lead mb-4">
              Our AI-powered resume builder tailors your resume to match job descriptions, 
              increasing your chances of getting past ATS systems and landing interviews.
            </p>
            <div className="hero-cta">
              {isSignedIn ? (
                <Link to="/templates" className="btn btn-primary btn-lg me-3">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/sign-up" className="btn btn-primary btn-lg me-3">
                    Get Started
                  </Link>
                  <Link to="/sign-in" className="btn btn-outline-primary btn-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <div className="mt-5">
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <span className="display-6 fw-bold text-primary">94%</span>
                  <p className="text-muted mb-0">ATS Success Rate</p>
                </div>
                <div className="me-4">
                  <span className="display-6 fw-bold text-primary">3x</span>
                  <p className="text-muted mb-0">More Interviews</p>
                </div>
                <div>
                  <span className="display-6 fw-bold text-primary">1000+</span>
                  <p className="text-muted mb-0">Jobs Landed</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="ratio ratio-16x9">
  <iframe 
    src="https://www.youtube.com/embed/SNgzvq2DwpU?si=OXcGhysbRAGCI2TQ" 
    title="Resume Builder Demo" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowFullScreen 
  ></iframe>
</div>

          </div>
        </div>
      </div>
      
      <div className="container py-5 pb-5">
        <h2 className="text-center mb-5">How It Works</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                  <i className="bi bi-1-circle-fill fs-2 text-primary"></i>
                </div>
                <h4>Select a Template</h4>
                <p className="text-muted">
                  Choose from our collection of ATS-friendly resume templates
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                  <i className="bi bi-2-circle-fill fs-2 text-primary"></i>
                </div>
                <h4>Fill Your Details</h4>
                <p className="text-muted">
                  Enter your information only for the first use, next time it will be auto-filled
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                  <i className="bi bi-3-circle-fill fs-2 text-primary"></i>
                </div>
                <h4>Enhance & Download</h4>
                <p className="text-muted">
                  Our AI tailors your resume to job descriptions for higher success rates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;