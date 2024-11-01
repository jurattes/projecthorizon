import React, { useState, useEffect } from 'react';
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
        <div className = "col">
            <div className = "card shadow-sm">
                <div
                style = {{ height: '320px',
                    width: '320px',
                    backgroundImage: `url(${props.item.url})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat' }} className = "w-100"/>

                <div className = "card-body">
                    <p className = "lead display-6">{props.item.title}</p>
                    <div className = "d-flex justify-content-between align-items-center">
                        <h5>
                            {days * 24 + hours} : {minutes} : {seconds}
                        </h5>
                    </div>
                    <p className = "card-text"> {props.item.desc} </p>
                    <div className = "d-flex justify-content-between align-items-center">
                        <div className = "btn-group">
                            {!props.item.username ? (
                                <div className = "btn btn-sm btn-outline-secondary"> Bid </div>
                            ) : isOwner ? (
                                <div className = "btn btn-sm btn-outline-secondary"> Cancel </div>
                            ): (
                                <div className = "btn btn-sm btn-outline-secondary"> Bid </div>
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

    useEffect(() => {
        const username = getCookie('username');
        setIsOwner(username === item.username);
    }, [item.username]);

    let expiredDate = item.duration;

    return <Countdown date={expiredDate} item={item} isOwner={isOwner} renderer={renderer} />;
}