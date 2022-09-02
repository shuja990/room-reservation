import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { db } from "../App";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
const BookRoom = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [blocked, setBlocked] = useState([]);
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
      setEndTime("");
      setError("");
      setStartTime("");
      setSuccess("");
      setLoading(false);
      navigate("/events");
    }
    listBlocked();
  }, [dispatch, success, userInfo, navigate]);
  const listDateEvents = async (date) => {
    try {
      setLoading(true);
      let data = [];
      const q = query(
        collection(db, "events"),
        where("room", "==", params.id),
        where("date", "==", date)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      console.log(data);
      setEvents(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };
  const listBlocked = async () => {
    try {
      setLoading(true);
      const docSnap = await getDoc(doc(db, "blocked", "5FmCJ3awBPwLzWjXzyZS"));
      setBlocked(docSnap.data().dates);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    if (blocked.findIndex((e) => e === date)) {
      setLoading(false);
      return alert("This date has been blocked");
    }
    let mStartTime = moment(startTime, "hh:mm").format("HH:mm");
    let mEndTime = moment(endTime, "hh:mm").format("HH:mm");
    for (let i = 0; i < events.length; i++) {
      if (
        moment(mStartTime, "HH:mm").isBetween(
          moment(events[i].startTime, "HH:mm"),
          moment(events[i].endTime, "HH:mm")
        )
      ) {
        setLoading(false);
        return alert(
          "This time slot is already booked, please change your start time"
        );
      } else if (
        moment(mEndTime, "HH:mm").isBetween(
          moment(events[i].startTime, "HH:mm"),
          moment(events[i].endTime, "HH:mm")
        )
      ) {
        setLoading(false);
        return alert(
          "This time slot is already booked, please change your end time"
        );
      } else {
        continue;
      }
    }

    let id = userInfo.email + Date.now();
    setDoc(doc(db, "events", id), {
      id: id,
      title: name,
      date,
      startTime: moment(startTime, "hh:mm").format("HH:mm"),
      endTime: moment(endTime, "hh:mm").format("HH:mm"),
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
                onChange={(e) => {
                  setDate(e.target.value);
                  listDateEvents(e.target.value);
                }}
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
                min={startTime}
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
