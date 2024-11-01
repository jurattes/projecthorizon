import React, { useContext, useState } from 'react';
import { AccountSettingsContext } from '../settings/AccountSettings';
import { AddAuction } from './addAuction';
import { Progression } from './progression';

export const AuctionBody = () => {
    const { isAuthenticated } = useContext(AccountSettingsContext);
    const [ auction, setAuction ] = useState(null);
    return (
        <div className = "py-5">
            <div className = "container">
                {auction && <Progression auction={auction} setAuction={setAuction} />}
                {isAuthenticated && <AddAuction />}
            </div>
        </div>
    );
}