// components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserButton,SignOutButton } from '@clerk/clerk-react';
import resumeBuilderLogo from '../../assets/my_logo.png';

const Header = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleHomeClick = (e) => {
    if (!isSignedIn) {
      e.preventDefault();
      navigate('/sign-in');
    }
  };
  
  return (
    <header className="bg-white shadow-sm sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={resumeBuilderLogo} alt="Resume Builder" width="40" height="40" className="me-2" />
            <span className="fw-bold">Smart Resume</span>
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {isSignedIn ? (
                <>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link ${location.pathname === '/' ? 'bg-primary text-white rounded px-3' : ''}`} 
                      to="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link ${location.pathname === '/templates' ? 'bg-primary text-white rounded px-3' : ''}`} 
                      to="/templates"
                    >
                      Templates
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/sign-in" 
                    onClick={handleHomeClick}
                  >
                    Home
                  </Link>
                </li>
              )}
            </ul>
            
            {isSignedIn ? (
              <div className="d-flex align-items-center">
                <UserButton />
                <SignOutButton redirectUrl="/">
                  <button className="btn btn-outline-danger ms-3">
                    Sign Out
                  </button>
                </SignOutButton>
                  </div>
            ) : (
              <div className="d-flex">
                <Link to="/sign-in" className="btn btn-outline-primary me-2">Sign In</Link>
                <Link to="/sign-up" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;