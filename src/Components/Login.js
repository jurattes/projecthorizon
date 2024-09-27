import React, { useState, useContext } from 'react';
import { AccountSettingsContext } from './AccountSettings';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
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


  return (
    <div>
      <div class = "text center mb-4">
        <h1 class = "h3 mb-3 font-weight-normal"> Login </h1>
        <p> Please login to your account using your e-mail and password. </p>
      </div>
      <form onSubmit={onSubmit}>
        <div class = "form-label-group">
          <input value = {email} onChange = {(event) => setEmail(event.target.value)} placeholder = "Email Address"/>
        </div>
        <div class = "form-label-group">
          <input value = {password} onChange = {(event) => setPassword(event.target.value)} placeholder = "Password"/>
        </div>
        <div class = "checkbox mb-3">
          <label>
            <input type="checkbox" value="remember-me"/> Remember me
          </label>
        </div>
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;