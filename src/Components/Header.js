import './css/Header.css';
import React, { useEffect, useContext, useState } from 'react';
import Logo from './assets/logo1.png';
import { AccountSettingsContext } from './settings/AccountSettings';
import { useLocation } from 'react-router-dom';

function Header() {
  const { isAuthenticated, logout, isMod } = useContext(AccountSettingsContext);
  const location = useLocation();


    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgotpassword') {
        return null;
    }

    if (location.pathname === '/settings') {
        return (
          <nav className="navbar navbar-expand-lg sticky-top navbar-light transparent-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href = "/home">
          <img src={Logo} alt="Logo" width="250" />
        </a>
        <div className="d-flex ms-auto">
          <div className="col">
            {isAuthenticated ? (
              <>
                <div onClick={() => logout()} className="btn btn-danger">
                  Logout
                </div>
              </>
            ) : (
              <>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
        ); 
    }

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-light transparent-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href = "/home">
          <img src={Logo} alt="Logo" width="250" />
        </a>
        <div className="d-flex ms-auto">
        <div className="col">
                        {isAuthenticated ? (
                            <>
                                <a className="btn btn-secondary mx-2" href="/settings">
                                    Settings
                                </a>
                                {isMod && ( // Show this button only if the user is in the 'mod' group
                                    <a className="btn btn-success mx-2" href="/mod">
                                        Mod Panel
                                    </a>
                                )}
                                <div onClick={() => logout()} className="btn btn-danger">
                                    Logout
                                </div>
                            </>
                        ) : (
                            <>
                                <a id="loginBtn" className="btn btn-primary mx-2" href="/login">
                                    Login
                                </a>
                                <a id="registerBtn" className="btn btn-warning mx-2" href="/register">
                                    Register
                                </a>
                            </>
                        )}
                    </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
