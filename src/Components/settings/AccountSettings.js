import React, { useState, createContext, useEffect } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { firestoreApp } from '../config/firebase';
import Pool from './UserPool.js';
import { useHistory } from 'react-router-dom';
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AccountSettingsContext = createContext();

const AccountSettings = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();  // For redirection
    const [globalMsg, setGlobalMsg] = useState("");

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
                document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";// make this dynamic with useEffect later
                localStorage.removeItem('userData');
                sessionStorage.removeItem('userData');
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

    // Auction Functions
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };
    const bidAuction = (auctionID, bidAmount) => {
        if (!isAuthenticated) {
            return setGlobalMsg('Please login to bid');
        }

        let newPrice = Math.floor((bidAmount / 100) * 110);
        const db = collection(firestoreApp, 'auctions');
        const auctionDoc = doc(db, auctionID);

        return updateDoc(auctionDoc,{
            curPrice: newPrice,
            curWinner: getCookie('username')
        })
    }

    const endAuction = (auctionID) => {
        const db = collection(firestoreApp, 'auctions');
        const auctionDoc = doc(db, auctionID);

        return deleteDoc(auctionDoc);
    }

    useEffect(() => {
        const interval = setTimeout(() => setGlobalMsg(''), 5000);
        return () => clearInterval(interval);
    }, [globalMsg]);


    return (
        <div>
            <AccountSettingsContext.Provider value={{ getSession, authenticate, logout, isAuthenticated, bidAuction, endAuction, globalMsg }}>
                {!isLoading && props.children}
            </AccountSettingsContext.Provider>
        </div>
    );
};

export { AccountSettings, AccountSettingsContext };