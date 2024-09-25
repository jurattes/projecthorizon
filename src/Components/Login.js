import React, { useState } from 'react';
import UserPool from './UserPool.js';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();

  // Creating new user
  const user = new CognitoUser({
      Username: email,
      Pool: UserPool
  });

  const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
  });

  user.authenticateUser(authDetails, {
      onSuccess: (data) => {
          console.log("onSuccess: " + data);
      },
      onFailure: (err) => {
          console.error("onFailure: " + err);
      },
      newPasswordRequired: (data) => {
          console.log("newPasswordRequired: " + data);
      }
  });
};


  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor = "email"> Email </label>
          <input value = {email} onChange = {(event) => setEmail(event.target.value)} />
        <label htmlFor = "password"> Password </label>
          <input value = {password} onChange = {(event) => setPassword(event.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;