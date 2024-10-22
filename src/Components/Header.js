import './css/Header.css';
import settings from './assets/settings.svg';
import React, { useEffect, useContext, useState } from 'react';
import { AccountSettingsContext } from './settings/AccountSettings';
import { useLocation } from 'react-router-dom';

function Header() {
  const { isAuthenticated, logout } = useContext(AccountSettingsContext);
  const location = useLocation();


    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgotpassword') {
        return null;
    }

  return (
    <nav className="container navbar sticky-top navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-brand">
          ye this my logo
        </div>
        <div className="d-flex">
          <div className="col">
            {isAuthenticated ? (
              <>
                <div className="btn btn-outline-secondary mx-2 disabled">
                  Settings
                </div>
                <div
                  onClick={() => logout()}
                  className="btn btn-outline-secondary mx-2"
                >
                  Logout
                </div>
              </>
            ) : (
              <>
                <div className="btn btn-outline-secondary mx-2" onClick = {() => window.location.href = '/login'}>
                  Login
                </div>
                <div className="btn btn-outline-secondary mx-2" onClick = {() => window.location.href = '/register'}>
                  Register
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
