import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/firestore';

export const SearchAuctions = () => {
    const { docs } = useFirestore('auctions');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAuctions, setFilteredAuctions] = useState([]);

    // Utility function to remove duplicates based on title and description
    const removeDuplicates = (auctions) => {
        const uniqueAuctions = [];
        const seen = new Set();

        auctions.forEach((auction) => {
            const uniqueKey = `${auction.title.toLowerCase()}-${auction.desc.toLowerCase()}`;
            if (!seen.has(uniqueKey)) {
                seen.add(uniqueKey);
                uniqueAuctions.push(auction);
            }
        });

        return uniqueAuctions;
    };

    useEffect(() => {
        const lowerSearchTerm = searchTerm.trim().toLowerCase();
        const filtered = docs.filter(
            (doc) =>
                doc.title.toLowerCase().includes(lowerSearchTerm) ||
                doc.desc.toLowerCase().includes(lowerSearchTerm) ||
                (doc.tags && doc.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm)))
        );

        // Remove duplicates after filtering
        setFilteredAuctions(removeDuplicates(filtered));
    }, [searchTerm, docs]);

    return (
        <div className="container py-5">
            <div className="row mb-4">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search auctions by name, description, or tags"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {filteredAuctions.map((item) => (
                    <div className="col" key={item.id}>
                        <div className="card shadow-sm h-100">
                            <div
                                style={{
                                    backgroundImage: `url(${item.url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    height: '200px',
                                    aspectRatio: '16/9',
                                }}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3" style={{ textAlign: 'center' }}>
                                    <p className="lead display-6 mb-0">{item.title}</p>
                                    {item.featured && (
                                        <span className="text-warning ms-2" style={{ fontSize: '1.5rem' }}>★</span>
                                    )}
                                </div>
                                <p className="card-text">{item.desc}</p>
                                <div className="mb-3">
                                    {item.tags?.length > 0 && (
                                        <div>
                                            {item.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="badge bg-secondary me-2"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="display-6">{item.curPrice}$</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredAuctions.length === 0 && (
                    <div className="col">
                        <p className="text-center">No auctions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
