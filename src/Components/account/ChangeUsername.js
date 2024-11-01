import React, { useState, useEffect } from 'react';

const ChangeUser = () => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [nextChangeDate, setNextChangeDate] = useState('');

  // Helper function to get a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Helper function to set a cookie
  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString(); // 864e5 ms in a day
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  // Helper function to check if username change is allowed
  const canChangeUsername = () => {
    const lastChangeDate = getCookie('lastUsernameChange');
    if (lastChangeDate) {
      const now = new Date();
      const lastChange = new Date(lastChangeDate);
      const diffDays = Math.ceil((now - lastChange) / (1000 * 60 * 60 * 24));
      return diffDays >= 30; // Allow change if 30 days have passed
    }
    return true; // If there is no last change date, allow change
  };

  // Calculate the next change date
  const calculateNextChangeDate = () => {
    const lastChangeDate = getCookie('lastUsernameChange');
    if (lastChangeDate) {
      const lastChange = new Date(lastChangeDate);
      const nextChange = new Date(lastChange);
      nextChange.setDate(nextChange.getDate() + 30); // Set next change date to 30 days later
      return nextChange.toLocaleDateString(); // Format the date
    }
    return 'Now'; // If never changed, they can change now
  };

  useEffect(() => {
    // Retrieve the current username from cookies when the component mounts
    const storedUsername = getCookie('username');
    if (storedUsername) {
      setCurrentUsername(storedUsername);
    }
    setNextChangeDate(calculateNextChangeDate());
  }, []);

  const handleUsernameChange = (event) => {
    event.preventDefault();

    if (!canChangeUsername()) {
      setError('You can only change your username once every month.');
      return;
    }

    if (!newUsername.trim()) {
      setError('Username cannot be empty.');
      return;
    }

    // Update username and last change date in cookies
    setCookie('username', newUsername, 30); // Set the new username cookie to expire in 30 days
    setCookie('lastUsernameChange', new Date().toISOString(), 30); // Set last change date

    setCurrentUsername(newUsername);
    setMessage('Username successfully updated!');
    setNewUsername('');
    setError(''); // Clear error message
    setNextChangeDate(calculateNextChangeDate());
  };

  return (
    <div className = "container">
            <form onSubmit= {handleUsernameChange}>
                <h1> Change Username (current user: {currentUsername}) </h1>
                <label> New Username: </label>
                <input className = "form-control" type = "text" placeholder = "Enter your new username" value={newUsername} onChange={(event) => setNewUsername(event.target.value)} />
                <button className = "btn btn-primary" type="submit" disabled={!canChangeUsername()}> Update Username </button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {message && <div style={{ color: 'green' }}>{message}</div>}
                <div>
                    {nextChangeDate && (
                    <p> Next available change date: <strong>{nextChangeDate}</strong> </p>)}
                </div>
            </form>
    </div>
  );
};

export default ChangeUser;
