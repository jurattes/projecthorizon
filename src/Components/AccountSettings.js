import React, { createContext } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import userPool from './UserPool.js';

const AccountSettingsContext = createContext();

const AccountSettings = (props) => {
    const authenticate = async (Username, Password) => {
        await new Promise((resolve, reject) => {
            const user = new CognitoUser({ 
            Username, 
            Pool: userPool
        })
            const authDetails = new AuthenticationDetails({
                Username,
                Password
            })

        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("onSuccess: " + data);
                resolve(data);
            },
            onFailure: (err) => {
                console.error("onFailure: " + err);
                reject(err);
            },
            newPasswordRequired: (data) => {
                console.log("newPasswordRequired: " + data);
                resolve(data);
            }
        });
        })
    };

    return (
        <AccountSettingsContext.Provider value = {{ authenticate }}>
            {props.children}
        </AccountSettingsContext.Provider>
    );
};

export { AccountSettings, AccountSettingsContext };