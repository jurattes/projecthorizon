import React, { useState, useContext } from 'react';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AccountSettingsContext } from '../settings/AccountSettings';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default () => {
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const { getSession, authenticate } = useContext(AccountSettingsContext);
    const history = useHistory();

    const onSubmit = (event) => {
        event.preventDefault();

        getSession().then(({user, email}) => {
                authenticate(email, password).then(() => {
                    const attributes = [new CognitoUserAttribute({ Name: 'email', Value: newEmail })];
                    user.updateAttributes(attributes, (err, results) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(results);
                            history.push('/home');
                        }
                });
            });
        });
    };
    return (
        <div className = "container">
            <form onSubmit={onSubmit}>
                <h1> Change Email </h1>
                <label> New Email: </label>
                <input className = "form-control" type = "email" placeholder = "Enter your new email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
                <label> Password: </label>
                <input className = "form-control" type = "password" placeholder = "Enter your current password" value = {password} onChange={(event) => setPassword(event.target.value)} />
                <button className = "btn btn-primary" type="submit"> Change Email </button>
            </form>
        </div>
    );
}
