import React, { useContext, useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { AccountSettingsContext } from '../settings/AccountSettings';
import { AddAuction } from './addAuction';
import { Progression } from './progression';
import { useFirestore } from '../hooks/firestore';
import { AuctionCard } from './Card';
import { useLocation } from 'react-router-dom';

export const AuctionBody = () => {
    const { isAuthenticated, globalMsg, isRestricted } = useContext(AccountSettingsContext);
    const [auction, setAuction] = useState(null);
    const { docs } = useFirestore('auctions');
    const location = useLocation();

    if (location.pathname !== '/home') {
        return null;
    }

    // Function to remove duplicates based on title and description
    const removeDuplicates = (auctions) => {
        const seen = new Set();
        return auctions.filter((auction) => {
            const identifier = `${auction.title}-${auction.desc}`; // Create a unique identifier for each auction
            if (seen.has(identifier)) {
                return false; // Exclude duplicate
            }
            seen.add(identifier);
            return true; // Include unique auction
        });
    };

    // Separate and remove duplicates from featured and non-featured auctions
    const filteredDocs = removeDuplicates(docs || []);
    const featuredAuctions = filteredDocs.filter((doc) => doc.featured === true);
    const nonFeaturedAuctions = filteredDocs.filter((doc) => doc.featured !== true);

    return (
        <div className="py-5">
            <div className="container">
                {auction && <Progression auction={auction} setAuction={setAuction} />}
                {globalMsg && <Alert variant="info">{globalMsg}</Alert>}

                {/* Conditionally render AddAuction button for restricted users */}
                {isAuthenticated && !isRestricted && <AddAuction setAuction={setAuction} />}
                {isRestricted && (
                    <Alert variant="warning">Your account is restricted.</Alert>
                )}

                {/* Featured Auctions Section */}
                {featuredAuctions.length > 0 && (
                    <div className="mb-5">
                        <div className="text-center mb-4">
                            <span className="border rounded px-3 py-1 bg-light text-dark">
                                Featured Auctions
                            </span>
                        </div>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                            {featuredAuctions.map((doc) => (
                                <AuctionCard item={doc} key={doc.id} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Non-Featured Auctions Section */}
                {nonFeaturedAuctions.length > 0 && (
                    <div>
                        <div className="text-center mb-4">
                            <span className="border rounded px-3 py-1 bg-light text-dark">
                                Other Auctions
                            </span>
                        </div>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                            {nonFeaturedAuctions.map((doc) => (
                                <AuctionCard item={doc} key={doc.id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

