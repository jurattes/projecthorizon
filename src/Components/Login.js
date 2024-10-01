import React, { useState, useContext, useEffect } from 'react';
import { AccountSettingsContext } from './AccountSettings';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './css/login.css';
import hide from './assets/eye-slash.svg';
import show from './assets/eye.svg';
import logo from './assets/logo.png';
import Status from './Status';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0); // Track failed attempts
  const [isLocked, setIsLocked] = useState(false);        // Lock the form after 3 attempts
  const [timeoutMessage, setTimeoutMessage] = useState(''); // Message shown during timeout
  const [timeLeft, setTimeLeft] = useState(0); // Track the remaining lockout time

  const { authenticate } = useContext(AccountSettingsContext);
  const lockTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  const onSubmit = (event) => {
    event.preventDefault();

    if (isLocked) {
      return; // Prevent submission if the form is locked
    }

    authenticate(email, password)
      .then((data) => {
        console.log(data);
        setFailedAttempts(0);
        setTimeoutMessage('');
        localStorage.removeItem('lockoutTime'); // Clear lockout time on success
      })
      .catch((err) => {
        console.error(err);
        setFailedAttempts((prevAttempts) => prevAttempts + 1);
      });
  };

  // Lock the form and store lockout timestamp in localStorage
  const lockForm = () => {
    const lockoutEnd = Date.now() + lockTime;
    localStorage.setItem('lockoutTime', lockoutEnd.toString());
    setIsLocked(true);
    setTimeLeft(lockTime);
    setTimeoutMessage('Too many failed attempts. Please try again after 5 minutes.');

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingTime = lockoutEnd - now;

      if (remainingTime <= 0) {
        clearInterval(interval);
        localStorage.removeItem('lockoutTime');
        setFailedAttempts(0);
        setIsLocked(false);
        setTimeoutMessage('');
      } else {
        setTimeLeft(remainingTime);
      }
    }, 1000);
  };

  // Check localStorage for an active lockout on page load
  useEffect(() => {
    const lockoutTime = localStorage.getItem('lockoutTime');
    if (lockoutTime) {
      const remainingTime = parseInt(lockoutTime) - Date.now();

      if (remainingTime > 0) {
        setIsLocked(true);
        setTimeoutMessage('Too many failed attempts. Please try again after 5 minutes.');
        setTimeLeft(remainingTime);

        const interval = setInterval(() => {
          const now = Date.now();
          const updatedRemainingTime = parseInt(lockoutTime) - now;

          if (updatedRemainingTime <= 0) {
            clearInterval(interval);
            localStorage.removeItem('lockoutTime');
            setIsLocked(false);
            setTimeoutMessage('');
            setTimeLeft(0);
          } else {
            setTimeLeft(updatedRemainingTime);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, []);

  // Lock the form after 3 failed attempts
  useEffect(() => {
    if (failedAttempts >= 3) {
      lockForm();
    }
  }, [failedAttempts]);

  // Password visibility toggle
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

  // Display remaining time in minutes and seconds
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div className="text center mb-4">
          <a href="/">
            <img src={logo} alt="" />
          </a>
          <h1 className="h2 mb-3 font-weight-normal">Login</h1>
          <p>Please login to your account using your e-mail and password.</p>
        </div>
        <div className="input">
          <input
            value={email}
            className="form-control"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email Address"
            required
            disabled={isLocked} // Disable input if locked
          />
        </div>
        <div className="input">
          <input
            id="pw"
            type="password"
            value={password}
            className="form-control"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            disabled={isLocked} // Disable input if locked
          />
          <label className="togglePassword">
            <input type="checkbox" id="ToggleVisibility" />
            <img id="img1" src={hide} alt="Show Password" />
          </label>
        </div>
        <div className="checkbox mb-3">
          <label>
            <p>
              <a href="/register">Not a Member?</a>
            </p>
            <p>
              <a href="/forgotpassword">Forgot Password?</a>
            </p>
            <input type="checkbox" value="remember-me" /> Remember me
          </label>
        </div>
        <button type="submit" className="btn" disabled={isLocked}>
          Login
        </button>
        {timeoutMessage && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            {timeoutMessage} {isLocked && timeLeft > 0 ? ` Time remaining: ${formatTime(timeLeft)}` : ''}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
