import React, { useState, useEffect } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../settings/UserPool';
import { useHistory } from 'react-router-dom';  // Import useHistory

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [phase, setPhase] = useState(1);
  
  const history = useHistory();  // Use useHistory to redirect

  useEffect(() => {
    // Check if the user is logged in and redirect
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (storedUserData) {
      history.push('/home');  // Redirect to home if user is logged in
    }
  }, [history]);  // Run only once when the component mounts

  const handleForgotPassword = (event) => {
    event.preventDefault();

    if (!email) {
      alert('Please enter your email');
      return;
    }

    const userData = {
      Username: email,
      Pool: UserPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: (data) => {
        console.log(data);
        setPhase(2);  // Move to phase 2 (entering code and new password)
      },
      onFailure: (err) => {
        console.log('Error sending code: ', err);
      },
      inputVerificationCode: () => {
        setPhase(2);
      },
    });
  };

  const handleConfirmForgotPassword = (event) => {
    event.preventDefault();

    if (!code || !password) {
      alert('Please enter code and password');
      return;
    }

    const userData = {
      Username: email,
      Pool: UserPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmPassword(code, password, {
      onSuccess: (data) => {
        console.log(data);
        alert('Password reset successful. Please login with your new password.');
        history.push('/home');
      },
      onFailure: (err) => {
        console.log(err);
        alert('Error resetting password. Please try again.');
      },
    });
  };

  return (
    <div className="container">
      {phase === 1 ? (
        <form onSubmit={handleForgotPassword}>
          <div>
            <h1> Forgot Password </h1>
            <p> Enter your email and we will send you a code to reset your password. </p>
            <input
              className="form-control"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">Send Reset Code</button>
          </div>
        </form>
      ) : (
        <div>
          <form onSubmit={handleConfirmForgotPassword}>
            <div>
              <h1> Reset Password </h1>
              <p> Enter your code and new password. </p>
              <input
                className="form-control"
                name="code"
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
              />
              <input
                className="form-control"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button type="submit" className="btn btn-primary">Reset Password</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;