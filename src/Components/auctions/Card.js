import React, { useState, useEffect, useContext } from 'react';
import { AccountSettingsContext } from '../settings/AccountSettings';
import Countdown from 'react-countdown';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};



const renderer = ({days, hours, minutes, seconds, completed, props}) => {
    if (completed) {
        return null;
    }

    const isOwner = props.isOwner;

    return (
        <div className = "col-md-4">
            <div className = "card shadow-sm">
                <div
                style = {{
                    width: '100%',
                    backgroundImage: `url(${props.item.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '400px',
                    aspectRatio: '16/9'}} className = "w-100"/>

                <div className = "card-body"
                style ={{
                    width: '100%',
                    margin: '0 auto',
                    minHeight: '300px',
                    padding: '1rem',
                    fontSize: '1rem'
                }}>
                    <p className = "lead display-6">{props.item.title}</p>
                    <div className = "d-flex justify-content-between align-items-center">
                        <h5>
                            {days * 24 + hours} : {minutes} : {seconds}
                        </h5>
                    </div>
                    <p className = "card-text"> {props.item.desc} </p>
                    <div className = "d-flex justify-content-between align-items-center">
                        <div className = "btn-group">
                            {!props.isAuthenticated ? (
                                <div onClick = {() => props.bidAuction()} className = "btn btn-sm btn-outline-secondary"> Bid </div>
                            ) : isOwner ? (
                                <div onClick = {() => props.endAuction(props.item.id)} className = "btn btn-sm btn-outline-secondary"> Cancel </div>
                            ) : props.item.curWinner === getCookie('username') ? (
                                <p className = "display-6"> - </p>
                            ) : (
                                <div onClick = {() => props.bidAuction(props.item.id, props.item.curPrice)} className = "btn btn-sm btn-outline-secondary"> Bid </div>
                            )}
                        </div>
                        <p className="display-6">${props.item.curPrice}</p>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export const AuctionCard = ({ item }) => {
    const [isOwner, setIsOwner] = useState(false);
    let expiredDate = item.duration;
    const { bidAuction, endAuction } = useContext(AccountSettingsContext);
    const { isAuthenticated } = useContext(AccountSettingsContext);

    useEffect(() => {
        const username = getCookie('username');
        setIsOwner(username === item.username);
    }, [item.username]);


    return <Countdown date={expiredDate} item={item} isOwner={isOwner} renderer={renderer} bidAuction={bidAuction} endAuction={endAuction} isAuthenticated={isAuthenticated}/>;
}