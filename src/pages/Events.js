import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../App";
import Loader from "../components/Loader";
import Message from "../components/Message";
import EventsList from "./EventsList";

const Events = () => {
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    listEvents();
  }, []);
  const listEvents = async () => {
    try {
      setLoading(true);
      let data = [];
      const q = query(
        collection(db, "events"),
        where("email", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      let past = data.filter((e) => new Date(e.date) < new Date());
      let pending = data.filter((e) => e.status === "pending");
      let accepted = data.filter((e) => e.status === "accepted");
      setPending(pending);
      setPast(past);
      setUpcoming(accepted);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Tabs
          defaultActiveKey="upcoming"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="upcoming" title="Upcoming Events">
            <EventsList events={upcoming} title="Upcoming Events" />
          </Tab>
          <Tab eventKey="pending" title="Pending Events">
            <EventsList events={pending} title="Pending Events" />
          </Tab>
          <Tab eventKey="past" title="Past Events">
            <EventsList events={past} title="Past Events" />
          </Tab>
        </Tabs>
      )}
    </>
  );
};

export default Events;
