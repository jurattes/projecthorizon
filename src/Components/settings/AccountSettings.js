import React, { useState, createContext, useEffect, useRef } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { firestoreApp } from "../config/firebase";
import Pool from "./UserPool.js";
import { useHistory } from "react-router-dom";
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";

const AccountSettingsContext = createContext();

const AccountSettings = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMod, setIsMod] = useState(false);
    const [isRestricted, setIsRestricted] = useState(false);
    const history = useHistory(); // For redirection
    const [globalMsg, setGlobalMsg] = useState("");

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession(async (err, session) => {
                    if (err) {
                        console.error("Failed to retrieve user session.", err);
                        reject(err);
                    } else {
                        try {
                            const idToken = session.getIdToken();
                            const payload = idToken.decodePayload();

                            console.log("Decoded ID Token Payload:", payload);

                            // Check if user is in mod group
                            const groups = payload['cognito:groups'] || [];
                            setIsMod(groups.includes('mod'));
                            setIsRestricted(groups.includes('restricted'));

                            resolve({
                                user,
                                ...session,
                                idToken: {
                                    jwtToken: idToken.getJwtToken(),
                                    payload,
                                },
                            });
                        } catch (attributesError) {
                            console.error("Failed to decode ID Token.", attributesError);
                            reject(attributesError);
                        }
                    }
                });
            } else {
                console.warn("No current user session was found.");
                setIsMod(false);
                setIsRestricted(false);
                // Clear cookies and storage if no session
                document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                localStorage.removeItem("userData");
                sessionStorage.removeItem("userData");
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
                    console.log("onSuccess:", data);
                    setIsAuthenticated(true);
                    resolve(data);
                    try {
                        const idToken = data.getIdToken();
                        const payload = idToken.decodePayload();
                        console.log("Decoded ID Token Payload:", payload);
    
                        // Check if the user is in the 'mod' group
                        const groups = payload["cognito:groups"] || [];
                        const isUserMod = groups.includes("mod");
    
                        setIsMod(isUserMod); // Update isMod state
                        console.log(`User mod status (in authenticate): ${isUserMod}`);

                        // Check if the user is in the 'restricted' group
                        const isUserRestricted = groups.includes("restricted");
                        setIsRestricted(isUserRestricted);
                        console.log(`User restricted status: ${isUserRestricted}`);
                    } catch (err) {
                        console.error("Error decoding ID token or setting mod status:", err);
                        setIsMod(false); // Reset to false if something goes wrong
                        setIsRestricted(false);
                    }
                },
                onFailure: (err) => {
                    console.error("onFailure:", err);
                    setIsAuthenticated(false);
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    console.log("newPasswordRequired:", data);
                    setIsAuthenticated(true);
                    resolve(data);
                },
            });
        });
    };

    const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            user.signOut();
            setIsAuthenticated(false);
            setIsRestricted(false);
            history.replace("/home");
        }
    };

    const hasRun = useRef(false);
    useEffect(() => {
        const checkSession = async () => {
            if (hasRun.current) return;
            hasRun.current = true;

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
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const bidAuction = (auctionID, bidAmount) => {
        if (!isAuthenticated) {
            return setGlobalMsg("Please login to bid");
        }

        if (isRestricted) {
            return setGlobalMsg("Your account has been restricted. You are not allowed to bid or create auctions.");
        }

        // Calculate the new bid price (add 10% to the bid amount)
        const newPrice = Math.floor(bidAmount * 1.10); // Use direct multiplication for clarity

        // Get the auction document reference
        const db = collection(firestoreApp, "auctions");
        const auctionDoc = doc(db, auctionID);

        // Update the auction document with the new price and winner
        return updateDoc(auctionDoc, {
            curPrice: newPrice,
            curWinner: getCookie("username"), // Assuming the username is stored in cookies
        })
        .then(() => {
            setGlobalMsg("Bid placed successfully!");
        })
        .catch((error) => {
            console.error("Error placing bid: ", error);
            setGlobalMsg("Failed to place the bid.");
        });
    };

    const endAuction = (auctionID) => {
        const db = collection(firestoreApp, "auctions");
        const auctionDoc = doc(db, auctionID);

        return deleteDoc(auctionDoc);
    };


    useEffect(() => {
        const interval = setTimeout(() => setGlobalMsg(""), 5000);
        return () => clearInterval(interval);
    }, [globalMsg]);

    return (
        <div>
            <AccountSettingsContext.Provider
                value={{
                    getSession,
                    authenticate,
                    logout,
                    isAuthenticated,
                    bidAuction,
                    endAuction,
                    globalMsg,
                    isMod,
                    isRestricted
                }}
            >
                {!isLoading && props.children}
            </AccountSettingsContext.Provider>
        </div>
    );
};

export { AccountSettings, AccountSettingsContext };
