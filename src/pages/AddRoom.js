import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { db } from "../App";
import {
  addDoc,
  collection,
} from "firebase/firestore";
const AddRoom = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (success) {
      setName("");
      setError("");
      setSuccess("");
      setLoading(false);
      navigate("/");
    }
  }, [dispatch, success, userInfo, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    addDoc(collection(db, "rooms"), {
      name,
      number,
      image,
    })
      .then((e) => {
        setLoading(false);
        setSuccess(true);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <>
      <FormContainer>
        <h1>Add new room</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Room Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={number}
                onChange={(e) => {
                  setNumber(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Image Link</Form.Label>
              <Form.Control
                type="text"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
              Add Room{" "}
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default AddRoom;
