import React, { useContext, useState } from 'react';
import { AccountSettingsContext } from '../settings/AccountSettings';
import { AddAuction } from './addAuction';
import { Progression } from './progression';
import { useFirestore } from '../hooks/firestore';

export const AuctionBody = () => {
    const { isAuthenticated } = useContext(AccountSettingsContext);
    const [ auction, setAuction ] = useState(null);
    const { docs } = useFirestore('auctions');
    return (
        <div className = "py-5">
            <div className = "container">
                {auction && <Progression auction={auction} setAuction={setAuction} />}
                {isAuthenticated && <AddAuction setAuction={setAuction}/>}
                {docs && <h1> Docs exist: {docs.length}</h1>}
            </div>
        </div>
    );
}