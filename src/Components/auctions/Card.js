import React from 'react';
import Countdown from 'react-countdown';

const renderer = ({days, hours, minutes, seconds, completed, props}) => {
    if (completed) {
        return null;
    }

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
                        <div className = "btn btn-outline-secondary"> Bid </div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export const AuctionCard = ({ item }) => {
    let expiredDate = item.duration;

    return <Countdown date={expiredDate} item={item} renderer={renderer} />;
}