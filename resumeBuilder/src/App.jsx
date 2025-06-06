import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { BrowserRouter, Routes, Route, Navigate } = ReactRouterDOM;
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroPage from './pages/HeroPage';
import TemplateSelection from './pages/TemplateSelection';
import JobDescriptionPage from './pages/JobDescriptionPage';
import ResumeBuilder from './components/layout/ResumeBuilder';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';

const clerkPubKey = "pk_test_bWFzdGVyLWRvbmtleS03MS5jbGVyay5hY2NvdW50cy5kZXYk";

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HeroPage />} />
              <Route 
                path="/templates" 
                element={
                  <>
                    <SignedIn>
                      <TemplateSelection />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/" replace />
                    </SignedOut>
                  </>
                } 
              />
              <Route 
                path="/job-description/:templateId" 
                element={
                  <>
                    <SignedIn>
                      <JobDescriptionPage />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/" replace />
                    </SignedOut>
                  </>
                } 
              />
              <Route 
                path="/generate-resume/:templateId" 
                element={
                  <>
                    <SignedIn>
                      <ResumeBuilder />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/" replace />
                    </SignedOut>
                  </>
                } 
              />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="*" element={<p>Page not found</p>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
