import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { db } from "../App";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
const BookRoom = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [name, setName] = useState("");
  const [date, setDate] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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
      setDate("");
      setEndTime("");
      setError("");
      setStartTime("");
      setSuccess("");
      setLoading(false);
      navigate("/events");
    }
  }, [dispatch, success, userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let id = userInfo.email + Date.now();
    setDoc(doc(db, "events", id), {
      id: id,
      title: name,
      date,
      startTime,
      endTime,
      room: params.id,
      accepted: "pending",
      email: userInfo.email,
      name: userInfo.name,
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
        <h1>Book Conference Room #{params.id}</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Event Title"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="starttime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="endtime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                placeholder="Enter End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Create Event
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default BookRoom;
