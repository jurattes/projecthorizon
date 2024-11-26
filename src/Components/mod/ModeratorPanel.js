import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AccountSettingsContext } from "../settings/AccountSettings";

const ModeratorPanel = () => {
    const { getSession, isAuthenticated } = useContext(AccountSettingsContext);
    const [isMod, setIsMod] = useState(false);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const checkModeratorGroup = async () => {
            try {
                if (!isAuthenticated) {
                    console.log("User not authenticated, redirecting...");
                    history.replace("/home");
                    return;
                }

                const session = await getSession();
                console.log("Session Data:", session);

                const groups = session.idToken.payload["cognito:groups"];
                if (groups && groups.includes("mod")) {
                    setIsMod(true);
                } else {
                    console.log("User not in 'mod' group, redirecting...");
                    history.replace("/home");
                }
            } catch (error) {
                console.error("Error checking group membership:", error);
                history.replace("/home");
            } finally {
                setLoading(false);
            }
        };

        checkModeratorGroup();
    }, [getSession, isAuthenticated, history]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isMod) {
        return null;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Moderator Panel</h1>
            <div className="card mt-4">
                <div className="card-header">Admin Actions</div>
                <div className="card-body">
                    <p>Welcome to the Moderator Panel. Manage auctions and perform administrative tasks here.</p>
                </div>
            </div>
        </div>
    );
};

export default ModeratorPanel;
