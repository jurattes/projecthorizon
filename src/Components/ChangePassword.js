import React, { useState, useContext } from 'react';
import { AccountSettingsContext } from './AccountSettings';

export default () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { getSession } = useContext(AccountSettingsContext);

    const onSubmit = (event) => {
        event.preventDefault();

        getSession().then(({user}) => {
            user.changePassword(password, newPassword, (err, data) => {
                if (err) {
                    console.error(err);
                }
                console.log(data);
            })
        });
    };

    return (
        <div>
            <form onSubmit = {onSubmit}>
                <label> Current Password </label>
                <input value = {password} onChange = {(event) => setPassword(event.target.value)} />
                <label> New Password </label>
                <input value = {newPassword} onChange = {(event) => setNewPassword(event.target.value)} />
                <button type = "submit"> Change Password </button>
            </form>
        </div>
    );
};