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
                        console.error('Failed to retrieve user session.', err);
                        reject();
                    } else {
                        try {
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
                        });
                        resolve({ user, ...session, ...attributes });
                    } catch (attributesError) {
                        console.error('Failed to retrieve user attributes.', attributesError);
                        reject(attributesError);
                    }
            }
                    
        });
            } else {
                console.warn('No current user session was found.')
                reject(new Error("No user session"));
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
                console.log(data);
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
            setIsAuthenticated(false);
            history.replace('/home');
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            // Run logout cleanup tasks when isAuthenticated changes to false
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem('userData');
            sessionStorage.removeItem('userData');
        }
    }, [isAuthenticated, history]); // Depend on isAuthenticated to re-run on logout

    /* useEffect(() => {
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
    }, []); */

    useEffect(() => {
        const checkSession = async () => {
            try {
                const data = await getSession();
                console.log("Session data:", data);
                setIsAuthenticated(true);
            } catch (err) {
                console.error("Error during session retrieval:", err);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
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