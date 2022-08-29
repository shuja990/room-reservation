import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProducts } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../App";

const PoolList = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [price, setPrice] = useState(0);
  const [l, setL] = useState(false);
  const [pool, setPool] = useState("");
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo) {
      navigate("/login");
    }

    dispatch(listProducts());
  }, [dispatch, userInfo, navigate, l]);
  const submitHandler = async (e) => {
    e.preventDefault();
    setL(true);
    try {
      await setDoc(doc(db, "offers", userInfo.email + Date.now().toString()), {
        ...pool,
        priceOffered: price,
        idd: userInfo.email + Date.now().toString(),
      });
      alert("Offer sent");
      setPool(null);
      setL(false);
    } catch (error) {
      setL(false);
      alert(error.message);
    }
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Pools</h1>
        </Col>
      </Row>
      {pool && (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter monthly Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" className="mt-2" variant="primary">
            Submit Offer
          </Button>
        </Form>
      )}

      {loading || l ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>SiZE</th>
                <th>LOCATION</th>
                <th>MESSAGE</th>
                <th>ADDED BY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, idx) => (
                <tr key={product._id}>
                  <td>{idx + 1}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.size}</td>
                  <td>{product.location}</td>
                  <td>{product.message}</td>
                  <td>{product.addedBy}</td>
                  <td>
                    {userInfo.isAdmin && (
                      <Button
                        variant="light"
                        onClick={() => setPool(product)}
                        className="btn-sm"
                      >
                        Send Offer
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default PoolList;
