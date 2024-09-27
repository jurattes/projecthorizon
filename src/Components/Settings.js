import React, { useEffect, useContext, useState } from 'react';
import { AccountSettingsContext } from './AccountSettings';
import ChangePassword from './ChangePassword';

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
                setLoggedIn(false);
            });
    }, []);

    

    return (
        <div>
            {loggedIn && (
                <div>
                    <h1>Settings</h1>
                    <ChangePassword />
                </div>
            )}
        </div>
    );
};