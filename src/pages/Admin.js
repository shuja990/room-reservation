import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../App";
import Loader from "../components/Loader";
import Message from "../components/Message";
import EventsList from "./EventsList";

const Admin = () => {
  const params = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (!userInfo?.isAdmin) {
      navigate("/");
    }
    listEvents();
  }, []);
  const listEvents = async () => {
    try {
      setLoading(true);
      let data = [];
      const q = query(collection(db, "events"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setEvents(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      {/* <Row className="align-items-center">
        <Col>
          <h1>Events Conference Room #{params.id}</h1>
        </Col>
      </Row> */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <EventsList events={events} title="All Events" />
      )}
    </>
  );
};

export default Admin;
