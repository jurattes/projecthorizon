import './css/Header.css';
import React, { useContext } from 'react';
import Logo from './assets/logo1.png';
import { AccountSettingsContext } from './settings/AccountSettings';
import { useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Header() {
  const { isAuthenticated, logout, isMod } = useContext(AccountSettingsContext);
  const location = useLocation();

  // Hide the navbar for specific routes
  if (
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgotpassword'
  ) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-light transparent-navbar">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="/home">
          <img src={Logo} alt="Logo" width="250" />
        </a>

        {/* Right-side buttons */}
        <div className="d-flex ms-auto align-items-center">
          {/* Search Icon */}
          <a
            className="btn btn-light me-3 d-flex align-items-center justify-content-center"
            href="/search"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: '0',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
            title="Search"
          >
            <i className="bi bi-search" style={{ fontSize: '1.5rem' }}></i>
          </a>

          {/* Authenticated User Options */}
          {isAuthenticated ? (
            <>
              {/* Show Settings button only if the user is not on the /settings page */}
              {location.pathname !== '/settings' && (
                <a className="btn btn-secondary mx-2" href="/settings">
                  Settings
                </a>
              )}

              {/* Show Mod Panel button only if the user is a mod and not on the /mod page */}
              {isMod && location.pathname !== '/mod' && (
                <a className="btn btn-success mx-2" href="/mod">
                  Mod Panel
                </a>
              )}

              {/* Logout button */}
              <div
                onClick={() => logout()}
                className="btn btn-danger"
                style={{ cursor: 'pointer' }}
              >
                Logout
              </div>
            </>
          ) : (
            <>
              <a id="loginBtn" className="btn btn-primary mx-2" href="/login">
                Login
              </a>
              <a
                id="registerBtn"
                className="btn btn-warning mx-2"
                href="/register"
              >
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
