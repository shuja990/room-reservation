import React from "react";
import { Table, Button, Row, Col, Form } from "react-bootstrap";

const EventsList = ({ events, title }) => {
  console.log(events);
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>{title}</h1>
        </Col>
      </Row>

      <>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>TITLE</th>
              <th>DATE</th>
              <th>START TIME</th>
              <th>END TIME</th>
              <th>ROOM</th>
              <th>REQUESTED BY</th>
              {/* <th></th> */}
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
                {/* <td>
                    <Button
                      variant="success"
                      onClick={() => acceptOffer(product)}
                      className="btn-sm"
                    >
                      Acecpt Offer
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => rejectOffer(product)}
                      className="btn-sm"
                    >
                      Reject Offer
                    </Button>
                  </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    </>
  );
};

export default EventsList;
