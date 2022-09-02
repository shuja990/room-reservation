import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { db } from "../App";
import Loader from "../components/Loader";

const EventsList = ({ events, title }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [loading, setLoading] = useState(false);
  const acceptRequest = (event) => {
    setLoading(true);
    const eventRef = doc(db, "events", event.id);
    updateDoc(eventRef, {
      accepted: "accepted",
    })
      .then(() => {
        setLoading(false);
        alert("Request Accepted");
        window.location.reload();
      })
      .catch((e) => {
        setLoading(false);
        alert(e.message);
      });
  };
  const deleteRequest = (id) => {
    setLoading(true);
    deleteDoc(doc(db, "events", id))
      .then((e) => {
        alert("Successfully Deleted");
        setLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>{title}</h1>
        </Col>
      </Row>

      <>
        {loading && <Loader />}
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th>DATE</th>
              <th>START TIME</th>
              <th>END TIME</th>
              <th>ROOM</th>
              <th>REQUESTED BY</th>
              {((title === "Pending Events" && userInfo?.isAdmin === true) ||
                (title === "All Events" && userInfo?.isAdmin)) && (
                <th>ACTIONS</th>
              )}
            </tr>
          </thead>
          <tbody>
            {events?.map((product, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{product.title}</td>
                <td>{product.date}</td>
                <td>{product.startTime}</td>
                <td>{product.endTime}</td>
                <td>Conference Room {product.room}</td>
                <td>{product.name}</td>
                {title === "Pending Events" && userInfo?.isAdmin === true && (
                  <td>
                    <Button
                      variant="success"
                      onClick={() => acceptRequest(product)}
                      className="btn-sm"
                    >
                      Accept Request
                    </Button>
                  </td>
                )}
                {title === "All Events" && userInfo?.isAdmin && (
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deleteRequest(product.id)}
                      className="btn-sm"
                    >
                      Delete Request
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    </>
  );
};

export default EventsList;
