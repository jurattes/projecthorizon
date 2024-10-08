import React, { useEffect, useContext, useState } from 'react';
import { AccountSettingsContext } from './AccountSettings';
import ChangePassword from '../account/ChangePassword';
import ChangeEmail from '../account/ChangeEmail';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Status from './Status';

export default () => {
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
                <Redirect to="/login" />
                setLoggedIn(false);
            });
    }, []);

    return (
        <div>
            {loggedIn && (
                <div className = "container">
                    <h1> Settings</h1>
                    <ChangePassword />
                    <ChangeEmail />
                    <Status />
                </div>
            )}
        </div>
    );
};