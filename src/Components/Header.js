import './Header.css';
import settings from './assets/settings.svg';
import React, { useEffect, useContext, useState } from 'react';
import { AccountSettingsContext } from './AccountSettings';
import { useLocation } from 'react-router-dom';

function Header() {
  const { getSession } = useContext(AccountSettingsContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();

    useEffect(() => {
        getSession()
            .then((data) => {
                console.log(data);
                setLoggedIn(true);
            })
            .catch((err) => {
                console.error(err);
                setLoggedIn(false);
            });
    }, []);

    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgotpassword') {
        return null;
    }

  return (
    <header>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          {loggedIn ? (
            <>
            <li><a href="/settings"><img src={settings} alt="Settings" /></a></li>
            </>
              ) : (
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </>
)}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
