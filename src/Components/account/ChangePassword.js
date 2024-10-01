import React, { useState, useContext } from 'react';
import { AccountSettingsContext } from '../settings/AccountSettings';
import { useHistory } from 'react-router-dom';

export default () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { getSession } = useContext(AccountSettingsContext);
    const history = useHistory();

    const onSubmit = (event) => {
        event.preventDefault();

        getSession().then(({user}) => {
            user.changePassword(password, newPassword, (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(data);
                history.push('/settings');
            })
        });
    };

    return (
        <div className = "container">
            <form onSubmit = {onSubmit}>
                <h1> Change Password </h1>
                <label> Current Password: </label>
                <input className = "form-control" type = "password" placeholder = "Enter your current password" value = {password} onChange = {(event) => setPassword(event.target.value)} />
                <label> New Password: </label>
                <input className = "form-control" type = "password" placeholder = "Enter your new password" value = {newPassword} onChange = {(event) => setNewPassword(event.target.value)} />
                <button className = "btn btn-primary" type = "submit"> Change Password </button>
            </form>
        </div>
    );
};