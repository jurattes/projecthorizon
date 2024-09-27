import './Header.css';
import settings from './assets/settings.svg';
import React, { useEffect, useContext, useState } from 'react';
import { AccountSettingsContext } from './AccountSettings';

function Header() {
  const { getSession } = useContext(AccountSettingsContext);
  const [loggedIn, setLoggedIn] = useState(false);

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

  return (
    <header>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          {!loggedIn && (
                <><li><a href="/login">Login</a></li><li><a href="/register">Register</a></li></>
            )} {loggedIn && (
              <li><a href="/settings"><img src={settings} alt="Settings" /></a></li>
            )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
