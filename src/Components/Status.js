import React, { useState, useEffect, useContext } from 'react';
import { AccountSettingsContext } from './AccountSettings';

const Status = () => {  
    const [status, setStatus] = useState(false);
    const { getSession, logout } = useContext(AccountSettingsContext);

    useEffect(() => {
        getSession()
            .then((data) => {
                console.log(data);
                setStatus(true);
            })
            .catch((err) => {
                console.error(err);
                setStatus(false);
            });
    }, []);

    return (
        <div>
            {status ? <button onClick={logout}>Logout</button> : <button>Login</button>}
        </div>
    );
};
export default Status;