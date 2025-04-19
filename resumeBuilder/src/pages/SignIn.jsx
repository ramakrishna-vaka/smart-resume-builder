// pages/SignIn.jsx
import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Sign In</h2>
              <SignIn routing="path" path="/sign-in" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;