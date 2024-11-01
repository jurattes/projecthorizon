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
    const [ auction, setAuction ] = useState(null);
    const { docs } = useFirestore('auctions');
    const location = useLocation();

    if (location.pathname !== '/home') {
        return null;
    }

    return (
        <div className = "py-5">
            <div className = "container">
                {auction && <Progression auction={auction} setAuction={setAuction} />}
                {globalMsg && <Alert variant = "info">{globalMsg}</Alert>}
                {isAuthenticated && <AddAuction setAuction={setAuction}/>}
                {docs && (
                    <div className = "row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {docs.map((doc) => {
                            return (
                                <AuctionCard item={doc} key={doc.id} />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}