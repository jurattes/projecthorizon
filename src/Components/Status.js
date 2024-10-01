import React, { useState, useEffect, useContext } from 'react';
import { AccountSettingsContext } from './AccountSettings';
import Button from 'react-bootstrap/Button';

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
        <div class = "container">
        <>
            {status ? <Button variant = "danger" onClick={logout}>Logout</Button> : <button>Login</button>}
        </>
        </div>
    );
};
export default Status;