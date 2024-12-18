import React, { useState, useEffect, useContext } from 'react';
import { AccountSettingsContext } from '../settings/AccountSettings';
import { updateDoc, doc } from 'firebase/firestore';
import { firestoreApp } from '../config/firebase';
import Countdown from 'react-countdown';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const renderer = ({ days, hours, minutes, seconds, completed, props }) => {
    if (completed) {
        return null;
    }

    const isOwner = props.isOwner;

    return (
        <div className="col-md-4">
            <div className="card shadow-sm h-100">
                <div
                    style={{
                        backgroundImage: `url(${props.item.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        aspectRatio: '16/9',
                        height: '200px'
                    }}
                    className="card-img-top"
                />

                <div
                    className="card-body"
                    style={{
                        margin: '0 auto',
                        minHeight: '300px',
                        padding: '1rem',
                        fontSize: '1rem',
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3"
                    style={{ textAlign: 'center'}}>
                        <p className="lead display-6 mb-0">{props.item.title}</p>
                        {props.item.featured && (
                            <span className="text-warning ms-2" style={{ fontSize: '1.5rem' }}>★</span> // Star indicator for featured auctions
                        )}
                    </div>

                    <div className="d-flex justify-content-center align-items-center">
                        <h5>
                            {days * 24 + hours} : {minutes} : {seconds}
                        </h5>
                    </div>
                    <p className="card-text">{props.item.desc}</p>

                    {/* Tags Section */}
                    <div className="mb-3">
                        {props.item.tags?.length > 0 && (
                            <div>
                                {props.item.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="badge bg-secondary me-2"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {tag}
                                        {isOwner && (
                                            <span
                                                className="ms-1 text-danger"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() =>
                                                    props.deleteTag(index)
                                                }
                                            >
                                                ×
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                            {!props.isAuthenticated ? (
                                <div
                                    onClick={() => props.bidAuction()}
                                    className="btn btn-sm btn-outline-secondary"
                                >
                                    Bid
                                </div>
                            ) : isOwner ? (
                                <div
                                    onClick={() =>
                                        props.endAuction(props.item.id)
                                    }
                                    className="btn btn-sm btn-outline-secondary"
                                >
                                    Cancel
                                </div>
                            ) : props.item.curWinner === getCookie('username') ? (
                                <p className="display-6"> - </p>
                            ) : (
                                <div
                                    onClick={() =>
                                        props.bidAuction(
                                            props.item.id,
                                            props.item.curPrice
                                        )
                                    }
                                    className="btn btn-sm btn-outline-secondary"
                                >
                                    Bid
                                </div>
                            )}
                        </div>
                        <p className="display-6">{props.item.curPrice}$</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AuctionCard = ({ item }) => {
    const [isOwner, setIsOwner] = useState(false);
    let expiredDate = item.duration;
    const { bidAuction, endAuction } = useContext(AccountSettingsContext);
    const { isAuthenticated } = useContext(AccountSettingsContext);

    // Define the deleteTag function to handle tag removal
    const deleteTag = async (tagIndex) => {
        try {
            const updatedTags = [...item.tags];
            updatedTags.splice(tagIndex, 1); // Remove the selected tag
            const auctionRef = doc(firestoreApp, 'auctions', item.id);
            await updateDoc(auctionRef, { tags: updatedTags });
            item.tags = updatedTags; // Optimistically update UI
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };

    useEffect(() => {
        const username = getCookie('username');
        setIsOwner(username === item.username);
    }, [item.username]);

    return (
        <Countdown
            date={expiredDate}
            item={item}
            isOwner={isOwner}
            renderer={renderer}
            bidAuction={bidAuction}
            endAuction={endAuction}
            isAuthenticated={isAuthenticated}
            deleteTag={deleteTag} // Pass deleteTag function to renderer
        />
    );
};
