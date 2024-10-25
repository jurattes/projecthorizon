import React, { useState, createContext, useEffect } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from './UserPool.js';
import { useHistory } from 'react-router-dom';

const AccountSettingsContext = createContext();

const AccountSettings = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();  // For redirection

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
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({ Username, Pool });
            const authDetails = new AuthenticationDetails({ Username, Password });

        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("onSuccess: " + data);
                resolve(data);
                setIsAuthenticated(true);
            },
            onFailure: (err) => {
                console.error("onFailure: " + err);
                reject(err);
                setIsAuthenticated(false);
            },
            newPasswordRequired: (data) => {
                console.log("newPasswordRequired: " + data);
                resolve(data);
                setIsAuthenticated(true);
            }
        });
        })
    };

    const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            user.signOut();
            localStorage.removeItem('userData');
            sessionStorage.removeItem('userData');
            alert('Logged out successfully!');
            history.push('/home');
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        getSession()
            .then((data) => {
                console.log(data);
                setIsAuthenticated(true);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsAuthenticated(false);
                setIsLoading(false);
            });
    }, []);

    return (
        <div>
            <AccountSettingsContext.Provider value={{ getSession, authenticate, logout, isAuthenticated }}>
                {!isLoading && props.children}
            </AccountSettingsContext.Provider>
        </div>
    );
};

export { AccountSettings, AccountSettingsContext };