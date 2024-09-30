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
  const { authenticate } = useContext(AccountSettingsContext);

  const onSubmit = (event) => {
    event.preventDefault();

    authenticate(email, password)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
    };

    // Password Toggle
    /**const pwrd = document.getElementById('pw');
    const toggleVisibility = document.getElementById('ToggleVisibility');

    toggleVisibility.addEventListener('change', function () {
      if (this.checked) {
        pwrd.type = "text";
      } else {
        pwrd.type = "password";
      }
    }); */
    useEffect(() => {
      const pwrd = document.getElementById('pw');
      const toggleVisibility = document.getElementById('ToggleVisibility');
      const img = document.getElementById('img1');

      toggleVisibility.addEventListener('change', function () {
        if (this.checked) {
          pwrd.type = "text";
          img.setAttribute('src', show);
        } else {
          pwrd.type = "password";
          img.setAttribute('src', hide);
        }
      });
    })





  return (
    <div class = "container">
      <form onSubmit={onSubmit}>
      <div class = "text center mb-4">
        <img src = {logo} alt = "logo"/>
        <h1 class = "h2 mb-3 font-weight-normal"> Login </h1>
        <p> Please login to your account using your e-mail and password. </p>
      </div>
        <div class = "input">
          <input value = {email} class = "form-control" onChange = {(event) => setEmail(event.target.value)} placeholder = "Email Address" required/>
        </div>
        <div class = "input">
          <input id = "pw" type = "password" value = {password} class = "form-control" onChange = {(event) => setPassword(event.target.value)} placeholder = "Password" required/>
          <label class = "togglePassword">
            <input type = "checkbox" id = "ToggleVisibility"/>
            <img id = "img1" src = {hide} alt = "Show Password"/>
          </label>
        </div>
        <div class = "checkbox mb-3">
          <label>
            <p><a href = "/forgotpassword">Forgot Password?</a> / <a href = "#">Forgot Email?</a></p>
            <input type="checkbox" value="remember-me"/> Remember me
          </label>
        </div>
        <button type="submit" class = "btn">Login</button>
      </form>
    </div>
  );
};

export default Login;