import { Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import React, { useRef, useState } from 'react';

export const AddAuction = ({ setAuction }) => {
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    const usernameRef = useRef(); 
    const itemTitle = useRef();
    const itemDesc = useRef();
    const startPrice = useRef();
    const itemDuration = useRef();
    const itemImage = useRef();

    const imgTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const openForm = () => setShowForm(true);
    const closeForm = () => {
        setShowForm(false);
        setError('');
        setTags([]);
        setTagInput('');
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const addTag = (e) => {
        e.preventDefault();
        if (tags.length >= 3) {
            return setError('You can only add up to 3 tags.');
        }
        if (!tagInput.trim() || tags.includes(tagInput.trim())) {
            return setError('Tag must be unique and non-empty.');
        }
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
    };

    const removeTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setError('');

        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!itemImage.current.files.length || !imgTypes.includes(itemImage.current.files[0].type)) {
            setError('Please use a valid image');
            setIsSubmitting(false);
            return;
        }

        let currentDate = new Date();
        let dueDate = currentDate.setHours(
            currentDate.getHours() + parseInt(itemDuration.current.value, 10)
        );

        let newAuction = {
            username: getCookie('username'),
            title: itemTitle.current.value,
            desc: itemDesc.current.value,
            curPrice: parseFloat(startPrice.current.value),
            duration: dueDate,
            itemImage: itemImage.current.files[0],
            tags, // Include tags in the auction object
        };

        setAuction(newAuction);
        setIsSubmitting(false);
        closeForm();
    };

    return (
        <>
            <div className="col d-flex justify-content-center my-3">
                <div onClick={openForm} className="btn btn-primary mx-2">
                    Create Auction
                </div>
            </div>
            <Modal centered show={showForm} onHide={closeForm}>
                <form onSubmit={submitForm}>
                    <Modal.Header>
                        <Modal.Title><b>Create Auction</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Item Title</Form.Label>
                                    <Form.Control type="text" required ref={itemTitle} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Item Description</Form.Label>
                                    <Form.Control type="text" required ref={itemDesc} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Start Price</Form.Label>
                                    <Form.Control type="number" required ref={startPrice} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Item Duration in hours</Form.Label>
                                    <Form.Control type="number" required ref={itemDuration} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Item Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        label="Select Item Image"
                                        custom
                                        required
                                        ref={itemImage}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Tags (max 3)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                    />
                                    <Button className="mt-2" onClick={addTag}>
                                        Add Tag
                                    </Button>
                                    <div className="mt-2">
                                        {tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-primary me-2"
                                                onClick={() => removeTag(tag)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {tag} &times;
                                            </span>
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeForm}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};
