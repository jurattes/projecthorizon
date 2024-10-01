import React, { createContext } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from './UserPool.js';
import { useHistory } from 'react-router-dom';

const AccountSettingsContext = createContext();

const AccountSettings = (props) => {
    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession(async (err, session) => {
                    if (err) {
                        reject();
                    } else {
                        const attributes = await new Promise((resolve, reject) => {
                            user.getUserAttributes((err, attributes) => {
                                if (err) {
                                    reject(err);
                                }
                                const results = {};
                                attributes.forEach((attr) => {
                                    results[attr.getName()] = attr.getValue();
                                });
                                resolve(results);
                            });
                        })
                        resolve({ user, ...session, ...attributes });
                    }
        });
            } else {
                reject();
            }
        });
    };

    const authenticate = async (Username, Password) => {
        await new Promise((resolve, reject) => {
            const user = new CognitoUser({ Username, Pool });
            const authDetails = new AuthenticationDetails({ Username, Password });

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

    const history = useHistory();

    const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            user.signOut();
            localStorage.removeItem('userData');
            sessionStorage.removeItem('userData');
            history.push('/home');
        }
    };

    return (
        <AccountSettingsContext.Provider value = {{ authenticate, getSession, logout }}>
            {props.children}
        </AccountSettingsContext.Provider>
    );
};

export { AccountSettings, AccountSettingsContext };