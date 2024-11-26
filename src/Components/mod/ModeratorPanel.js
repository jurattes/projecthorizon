import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AccountSettingsContext } from "../settings/AccountSettings";
import { firestoreApp } from "../config/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Button, Table, Modal, Form } from "react-bootstrap";

const ModeratorPanel = () => {
    const { getSession, isAuthenticated } = useContext(AccountSettingsContext);
    const [isMod, setIsMod] = useState(false);
    const [loading, setLoading] = useState(true);
    const [auctions, setAuctions] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [globalMsg, setGlobalMsg] = useState({ text: "", type: "" }); // Global message
    const [auctionsVisible, setAuctionsVisible] = useState(false); // State to toggle visibility
    const history = useHistory();

    useEffect(() => {
        const checkModeratorGroup = async () => {
            try {
                if (!isAuthenticated) {
                    console.log("User not authenticated, redirecting...");
                    history.replace("/home");
                    return;
                }

                const session = await getSession();
                console.log("Session Data:", session); // Log the full session object

                const groups = session?.idToken?.payload["cognito:groups"];
                console.log("Groups:", groups); // Log the value of groups

                // Ensure groups is an array and check if it includes "mod"
                if (Array.isArray(groups) && groups.includes("mod")) {
                    setIsMod(true);
                } else {
                    console.log("User not in 'mod' group, redirecting...");
                    history.replace("/home");
                }
            } catch (error) {
                console.error("Error checking group membership:", error);
                history.replace("/home");
            } finally {
                setLoading(false);
            }
        };

        checkModeratorGroup();
    }, [getSession, isAuthenticated, history]);

    const fetchAuctions = async () => {
        try {
            const auctionRef = collection(firestoreApp, "auctions");
            const querySnapshot = await getDocs(auctionRef);
            const auctionList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAuctions(auctionList);
        } catch (error) {
            console.error("Error fetching auctions: ", error);
            setGlobalMsg({ text: "Error fetching auctions.", type: "error" });
        }
    };

    const deleteAuction = async (auctionId) => {
        try {
            const auctionRef = doc(firestoreApp, "auctions", auctionId);
            await deleteDoc(auctionRef);
            fetchAuctions(); // Re-fetch the auctions after deleting one
            setGlobalMsg({ text: "Auction deleted successfully.", type: "success" });
            setShowEditModal(false); // Close the modal after deletion
        } catch (error) {
            console.error("Error deleting auction: ", error);
            setGlobalMsg({ text: "Error deleting auction.", type: "error" });
        }
    };

    const handleEditModalClose = () => setShowEditModal(false);
    const handleEditModalShow = (auction) => {
        setSelectedAuction({ ...auction, tags: auction.tags || [] });
        setShowEditModal(true);
    };

    const handleUpdateAuction = async () => {
        try {
            const auctionRef = doc(firestoreApp, "auctions", selectedAuction.id);
            await updateDoc(auctionRef, {
                title: selectedAuction.title,
                desc: selectedAuction.desc,
                curPrice: selectedAuction.curPrice,
                tags: selectedAuction.tags || [],  // Ensure tags is always an array
            });
            fetchAuctions(); // Re-fetch auctions after updating
            setGlobalMsg({ text: "Auction updated successfully.", type: "success" });
            setShowEditModal(false); // Close the modal after updating
        } catch (error) {
            console.error("Error updating auction: ", error);
            setGlobalMsg({ text: "Error updating auction.", type: "error" });
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() !== "") {
            const updatedTags = [...selectedAuction.tags, newTag.trim()];
            setSelectedAuction({ ...selectedAuction, tags: updatedTags });
            setNewTag(''); // Clear the input field
            setGlobalMsg({ text: "Tag added successfully.", type: "success" });
        }
    };

    const handleDeleteTag = async (tagIndex) => {
        try {
            const updatedTags = selectedAuction.tags.filter((_, index) => index !== tagIndex);
            setSelectedAuction({ ...selectedAuction, tags: updatedTags });
            const auctionRef = doc(firestoreApp, "auctions", selectedAuction.id);
            await updateDoc(auctionRef, { tags: updatedTags });
            setGlobalMsg({ text: "Tag deleted successfully.", type: "success" });
        } catch (error) {
            console.error("Error deleting tag:", error);
            setGlobalMsg({ text: "Error deleting tag.", type: "error" });
        }
    };

    const closeGlobalMsg = () => setGlobalMsg({ text: "", type: "" }); // Close the message box

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isMod) {
        return null;
    }

    return (
        <div className="container mt-5">
            {/* Global Message Box */}
            {globalMsg.text && (
                <div className={`alert alert-${globalMsg.type} alert-dismissible fade show`} role="alert">
                    {globalMsg.text}
                    <button type="button" className="btn-close" onClick={closeGlobalMsg}></button>
                </div>
            )}

            <h1 className="text-center">Moderator Panel</h1>
            <div className="card mt-4">
                <div className="card-header">Admin Actions</div>
                <div className="card-body">
                    <Button
                        variant="primary"
                        onClick={() => {
                            setAuctionsVisible(!auctionsVisible); // Toggle the visibility
                            if (!auctionsVisible) {
                                fetchAuctions(); // Fetch auctions if being shown
                            }
                        }}
                    >
                        {auctionsVisible ? "Hide All Auctions" : "Show All Auctions"}
                    </Button>
                    {auctionsVisible && (
                        <Table striped bordered hover className="mt-4">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auctions.length > 0 ? (
                                    auctions.map((auction) => (
                                        <tr key={auction.id}>
                                            <td>{auction.title}</td>
                                            <td>{auction.desc}</td>
                                            <td>{auction.curPrice}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    onClick={() => handleEditModalShow(auction)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="ms-2"
                                                    onClick={() => deleteAuction(auction.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No auctions available. Click "Show All Auctions" to load them.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </div>
            </div>

            {/* Edit Auction Modal */}
            {selectedAuction && (
                <Modal show={showEditModal} onHide={handleEditModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Auction</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formAuctionTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedAuction.title}
                                    onChange={(e) => setSelectedAuction({ ...selectedAuction, title: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAuctionDesc">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selectedAuction.desc}
                                    onChange={(e) => setSelectedAuction({ ...selectedAuction, desc: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAuctionPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedAuction.curPrice}
                                    onChange={(e) => setSelectedAuction({ ...selectedAuction, curPrice: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAuctionTags">
                                <Form.Label>Tags</Form.Label>
                                <div className="d-flex">
                                    {selectedAuction.tags?.map((tag, index) => (
                                        <div key={index} className="badge bg-secondary me-2">
                                            {tag}
                                            <span
                                                className="ms-1 text-danger"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleDeleteTag(index)}
                                            >
                                                ×
                                            </span>
                                        </div>
                                    ))}
                                    <Form.Control
                                        type="text"
                                        placeholder="Add new tag"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        className="me-2"
                                    />
                                    <Button variant="outline-primary" onClick={handleAddTag}>
                                        Add Tag
                                    </Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleEditModalClose}>Close</Button>
                        <Button variant="primary" onClick={handleUpdateAuction}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ModeratorPanel;
