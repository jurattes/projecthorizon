import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/firestore';

export const SearchAuctions = () => {
    const { docs } = useFirestore('auctions');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAuctions, setFilteredAuctions] = useState([]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredAuctions(docs);
        } else {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const filtered = docs.filter(
                (doc) =>
                    doc.title.toLowerCase().includes(lowerSearchTerm) ||
                    doc.desc.toLowerCase().includes(lowerSearchTerm) ||
                    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
            );
            setFilteredAuctions(filtered);
        }
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
                        <div className="card shadow-sm">
                            <div
                                style={{
                                    width: '100%',
                                    backgroundImage: `url(${item.url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    height: '400px',
                                    aspectRatio: '16/9',
                                }}
                                className="w-100"
                            />
                            <div
                                className="card-body"
                                style={{
                                    width: '100%',
                                    margin: '0 auto',
                                    minHeight: '300px',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                }}
                            >
                                <p className="lead display-6">{item.title}</p>
                                <p className="card-text">{item.desc}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        {item.tags &&
                                            item.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="badge bg-primary me-2"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                    <p className="display-6 text-center">${item.curPrice}</p>
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
