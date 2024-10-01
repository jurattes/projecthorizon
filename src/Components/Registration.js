import React, { useState } from 'react';
import UserPool from './UserPool.js';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();

    UserPool.signUp(email, password, [], null, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
    })
  };

  return (
    <div class = "container">
      <form onSubmit={onSubmit}>
          <div class = "input">
            <input value = {email} class = "form-control" placeholder = "Email Address" onChange = {(event) => setEmail(event.target.value)} />
          </div>
          <div class = "input">
            <input value = {password} class = "form-control"placeholder = "Password" onChange = {(event) => setPassword(event.target.value)} />
          </div>
        <button type="submit" class = "btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default Registration;