import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
const Rooms = () => {
  const [products, setProducts] = useState([
    {
      id: 443343,
      name: "Conference Room #1",
      room:1,
      image:
        "https://www.pngkey.com/png/detail/470-4703342_generic-placeholder-image-conference-room-free-icon.png",
    },
    {
      id: 443343,
      name: "Conference Room #2",
      room:2,
      image:
        "https://www.pngkey.com/png/detail/470-4703342_generic-placeholder-image-conference-room-free-icon.png",
    },
    {
      id: 443343,
      name: "Conference Room #3",
      room:3,
      image:
        "https://www.pngkey.com/png/detail/470-4703342_generic-placeholder-image-conference-room-free-icon.png",
    },
  ]);
  return (
    <Row>
      {products.map((product) => (
        <Col key={product._id} sm={12} md={6} lg={4} xl={4}>
          <Product product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default Rooms;
