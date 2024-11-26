import React, { useContext, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { AccountSettingsContext } from '../settings/AccountSettings';
import { AddAuction } from './addAuction';
import { Progression } from './progression';
import { useFirestore } from '../hooks/firestore';
import { AuctionCard } from './Card';
import { useLocation } from 'react-router-dom';

export const AuctionBody = () => {
    const { isAuthenticated, globalMsg } = useContext(AccountSettingsContext);
    const [auction, setAuction] = useState(null);
    const { docs } = useFirestore('auctions');
    const location = useLocation();

    if (location.pathname !== '/home') {
        return null;
    }

    // Separate featured auctions and non-featured auctions
    const featuredAuctions = docs?.filter(doc => doc.featured === true);
    const nonFeaturedAuctions = docs?.filter(doc => doc.featured !== true);

    return (
        <div className="py-5">
            <div className="container">
                {auction && <Progression auction={auction} setAuction={setAuction} />}
                {globalMsg && <Alert variant="info">{globalMsg}</Alert>}
                {isAuthenticated && <AddAuction setAuction={setAuction} />}

                {/* Featured Auctions Section */}
                {featuredAuctions.length > 0 && (
                    <div className="mb-5">
                        <h3>Featured Auctions</h3>
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
                        <h3>Other Auctions</h3>
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
