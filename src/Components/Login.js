import React, { useState, useContext } from 'react';
import { AccountSettingsContext } from './AccountSettings';
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
      <Status />
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