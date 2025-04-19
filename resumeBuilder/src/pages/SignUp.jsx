// pages/SignUp.jsx
import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Sign Up</h2>
              <SignUp routing="path" path="/sign-up" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;