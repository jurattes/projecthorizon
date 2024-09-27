import React, { useState, useContext } from 'react';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AccountSettingsContext } from './AccountSettings';

export default () => {
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const { getSession, authenticate } = useContext(AccountSettingsContext);
    const onSubmit = (event) => {
        event.preventDefault();


        getSession().then(({user, email}) => {
                authenticate(email, password).then(() => {
                    const attributes = [new CognitoUserAttribute({ Name: "email", Value: newEmail })];
                    user.updateAttributes(attributes, (err, data) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(data);
                        }
                });
            });
        });
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <label> New Email </label>
                <input value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
                <label> Password </label>
                <input value = {password} onChange={(event) => setPassword(event.target.value)} />
                <button type="submit"> Change Email </button>
            </form>
        </div>
    );
}
