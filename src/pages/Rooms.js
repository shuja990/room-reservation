import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { db } from "../App";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    listEvents();
  },[]);
  const listEvents = async () => {
    try {
      setLoading(true);
      let data = [];
      const q = query(collection(db, "rooms"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setRooms(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {rooms.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={4}>
              <Product product={product} />
            </Col>
          ))}
        </>
      )}
    </Row>
  );
};

export default Rooms;
