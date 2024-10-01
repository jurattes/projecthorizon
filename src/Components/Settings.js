import React, { useEffect, useContext, useState } from 'react';
import { AccountSettingsContext } from './AccountSettings';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

export default () => {
    const { getSession, logout } = useContext(AccountSettingsContext);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        getSession()
            .then((data) => {
                console.log(data);
                setLoggedIn(true);
            })
            .catch((err) => {
                console.error(err);
                <Redirect to="/login" />
                setLoggedIn(false);
            });
    }, []);

    return (
        <div>
            {loggedIn && (
                <div>
                    <h1>Settings</h1>
                    <ChangePassword />
                    <ChangeEmail />
                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </div>
    );
};