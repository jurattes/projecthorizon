import React, { useState, useContext, useEffect } from 'react';
import { AccountSettingsContext } from '../settings/AccountSettings';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../css/login.css';
import { useHistory } from 'react-router-dom';
import '../css/fade.css';
import hide from '../assets/eye-slash.svg';
import show from '../assets/eye.svg';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeoutMessage, setTimeoutMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [fadeOut, setFadeOut] = useState(false); 
  const [emailError, setEmailError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const history = useHistory();

  const { authenticate } = useContext(AccountSettingsContext);
  const lockTime = 5 * 60 * 1000;

  // Regex for password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;


  // Redirect to /HOME after fade-out animation
  useEffect(() => {
    if (fadeOut) {
      setTimeout(() => {
        history.push('/HOME');
      }, 1000); 
    }
  }, [fadeOut, history]);


  // Authenticate user
  const onSubmit = (event) => {
    event.preventDefault();

    if (isLocked) {
      return;
    }

    // Clear previous error messages
    setEmailError('');
    setConfirmError('');

    authenticate(email, password)
      .then((data) => {
        console.log(data);
        setFadeOut(true);
        setFailedAttempts(0);
        setTimeoutMessage('');
        localStorage.removeItem('lockoutTime');
        alert('Logged in succesfully!');

        if (rememberMe) {
          localStorage.setItem('userData', JSON.stringify(data));
        } else {
          sessionStorage.setItem('userData', JSON.stringify(data));
        }
      })
      
      .catch((err) => {
        console.error(err);
        setConfirmError(err.message);
        setFailedAttempts((prevAttempts) => prevAttempts + 1);
        return;
      });
  };

  

  // Lock form when locked out
  const lockForm = () => {
    const lockoutEnd = Date.now() + lockTime;
    localStorage.setItem('lockoutTime', lockoutEnd.toString());
    setIsLocked(true);
    setTimeLeft(lockTime);
    setTimeoutMessage('Too many failed attempts. Please try again after 5 minutes.');
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  // Lockout timer (5 mins)
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

    // Sends user to home page if already logged in
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (storedUserData) {
      history.push('/home');
    }

  useEffect(() => {
    if (failedAttempts >= 3) {
      lockForm();
    }
  }, [failedAttempts]);

  // Toggle password visibility
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

  // Format time
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`container ${fadeOut ? 'fade-out' : ''}`}>
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
            disabled={isLocked}
          />
          {emailError && <div style={{ color: 'red', fontSize: '12px', float: 'left', marginTop: '-20px', paddingBottom: '25px' }}>{emailError}</div>}
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
            disabled={isLocked}
          />
          <label className="togglePassword">
            <input type="checkbox" id="ToggleVisibility" />
            <img id="img1" src={hide} alt="Show Password" />
          </label>
          {confirmError && <div style={{ color: 'red', fontSize: '12px', float: 'left', marginTop: '-20px', paddingBottom: '25px' }}>{confirmError}</div>}
        </div>
        <div className="checkbox mb-3">
          <label>
            <p>
              <a href="/register">Not a Member?</a>
            </p>
            <p>
              <a href="/forgotpassword">Forgot Password?</a>
            </p>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            /> Remember me
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
