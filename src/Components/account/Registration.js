import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserPool from '../settings/UserPool.js';
import logo from '../assets/logo.png';
import '../css/fade.css';
import hide from '../assets/eye-slash.svg';
import show from '../assets/eye.svg';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [fadeOut, setFadeOut] = useState(false);  // For fade-out effect
  const history = useHistory();  // For redirection

  // Sends user to home page if already logged in
  const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (storedUserData) {
      history.push('/home');
    }
  

  // Regex for password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  useEffect(() => {
    if (fadeOut) {
      setTimeout(() => {
        history.push('/HOME');  // Redirect to /HOME after fade-out
      }, 1000);  // Adjust time for fade-out duration
    }
  }, [fadeOut, history]);
  
  // Password visibility (password)
  useEffect(() => {
    const pwrd = document.getElementById('pw');
    const toggleVisibility = document.getElementById('ToggleVisibility');
    const img = document.getElementById('img1');

    toggleVisibility.addEventListener('change', function () {
      if (this.checked) {
        pwrd.type = 'text';
        img.setAttribute('src', show);
      } else {
        pwrd.type = 'password';
        img.setAttribute('src', hide);
      }
    });
  }, []);

  // Password visibility (confirm password)
  useEffect(() => {
    const confirmPwrd = document.getElementById('confirmPw');
    const toggleVisibility1 = document.getElementById('ToggleVisibility1');
    const img2 = document.getElementById('img2');

    toggleVisibility1.addEventListener('change', function () {
      if (this.checked) {
        confirmPwrd.type = 'text';
        img2.setAttribute('src', show);
      } else {
        confirmPwrd.type = 'password';
        img2.setAttribute('src', hide);
      }
    });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();

    // Clear previous error messages
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setConfirmError('');

    // Email validation
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Check if passwords meet password requirements
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    UserPool.signUp(email, password, [], null, (err, data) => {
      if (err) {
        console.log(err);
        setConfirmError(err.message || 'Sign up failed');
        return;
      }
      console.log(data);
      setFadeOut(true);  // Trigger fade-out effect
    });
  };

  return (
    <div className={`container ${fadeOut ? 'fade-out' : ''}`}>
      <form onSubmit={onSubmit}>
        <div className="text center mb-4">
          <a href="/">
            <img src={logo} alt="" />
          </a>
          <h1 className="h2 mb-3 font-weight-normal">CREATE AN ACCOUNT</h1>
          <p>Ready to be a part of the club? Fill out the registration form below to get started!</p>
        </div>
        <div className="input">
          <input
            value={email}
            className="form-control"
            placeholder="Your Email Address"
            onChange={(event) => setEmail(event.target.value)}
          />
          {emailError && <div style={{ color: 'red', fontSize: '12px', float: 'left', marginTop: '-20px', paddingBottom: '25px' }}>{emailError}</div>}
        </div>
        <div className="input">
          <input
            id = "pw"
            type="password"
            value={password}
            className="form-control"
            placeholder="Your Password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <label className="togglePassword">
            <input type="checkbox" id="ToggleVisibility" />
            <img id="img1" src={hide} alt="Show Password" />
          </label>
          {passwordError && <div style={{ color: 'red', fontSize: '12px', float: 'left', marginTop: '-20px', paddingBottom: '25px' }}>{passwordError}</div>}
        </div>
        <div className="input">
          <input
            id = "confirmPw"
            type="password"
            value={confirmPassword}
            className="form-control"
            placeholder="Confirm Password"
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <label className="togglePassword">
            <input type="checkbox" id="ToggleVisibility1" />
            <img id="img2" src={hide} alt="Show Password" />
          </label>
          {confirmPasswordError && <div style={{ color: 'red', fontSize: '12px', float: 'left', marginTop: '-20px', paddingBottom: '25px' }}>{confirmPasswordError}</div>}
          {confirmError && <div style={{ color: 'red', fontSize: '12px', float: 'left', marginTop: '-20px', paddingBottom: '25px' }}>{confirmError}</div>}
        </div>
        <button style = {{marginBottom: '10px'}} type="submit" className="btn btn-primary">Sign Up</button>
        <a href="/login">Already have an account? Login</a>
      </form>
    </div>
  );
};

export default Registration;
