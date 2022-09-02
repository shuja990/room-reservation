import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const Product = ({ product }) => {
  const navigate = useNavigate();
  return (
    <Card className="my-3 p-3 rounded" style={{ width: "350px" }}>
      <Card.Img src={product.image} variant="top" />
      <Card.Body>
        <Card.Title as="div">
          <strong>{product.name}</strong>
        </Card.Title>
      </Card.Body>
      <Button
        type="submit"
        className="mt-2"
        variant="info "
        onClick={() => navigate(`/events/${product.number}`)}
      >
        View Reservations
      </Button>
      <Button
        type="submit"
        className="mt-2"
        variant="dark "
        onClick={() => navigate(`/book-room/${product.number}`)}
      >
        Book Now
      </Button>
    </Card>
  );
};

export default Product;
