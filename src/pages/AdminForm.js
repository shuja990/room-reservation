import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { db } from "../App";
import { doc, getDoc, setDoc } from "firebase/firestore";
const AdminForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [date, setDate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dates, setDates] = useState([]);
  const [error, setError] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (!userInfo?.isAdmin) {
      navigate("/");
    }
    if (success) {
      setDate("");
      setSuccess("");
      setLoading(false);
      navigate("/events");
    }
    listDates();
  }, [dispatch, success, userInfo, navigate]);

  const listDates = async () => {
    try {
      setLoading(true);
      const docSnap = await getDoc(doc(db, "blocked", "5FmCJ3awBPwLzWjXzyZS"));
      setDates(docSnap.data().dates);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let newDates = dates;
    newDates.push(date);
    setDoc(doc(db, "blocked", "5FmCJ3awBPwLzWjXzyZS"), {
      dates: newDates,
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
        <h1>Block Dates</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
              Block Date
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default AdminForm;
