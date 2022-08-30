import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../App";

const Users = () => {
  const navigate = useNavigate();
  const [l, setL] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      getData();
    }
  }, [userInfo, navigate, l]);
  const disableAccount = async (e) => {
    setL(true);
    try {
      const washingtonRef = doc(db, "users", e.email);

      await updateDoc(washingtonRef, {
        approved: false,
      });
      alert("Account Disabled");
      setL(false);
    } catch (error) {
      setL(false);
      alert(error.message);
    }
  };
  const getData = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("userType", "==", "technician")
      );
      let data = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  const submitHandler = async (e) => {
    setL(true);
    try {
      const washingtonRef = doc(db, "users", e.email);

      await updateDoc(washingtonRef, {
        approved: true,
      });
      alert("Account Approved");
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
          <h1>Users</h1>
        </Col>
      </Row>

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
                <th>EMAIL</th>
                <th>APPROVED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users?.map((product, idx) => (
                <tr key={product._id}>
                  <td>{idx + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.email}</td>
                  <td>{product.approved ? "Approved" : "Not Approved"}</td>
                  <td>
                    {userInfo.isAdmin && (
                      <>
                        <Button
                          variant="light"
                          onClick={() => submitHandler(product)}
                          className="btn-sm"
                          disabled={product.approved}
                        >
                          Approve account{" "}
                        </Button>
                        <Button
                          onClick={() => disableAccount(product)}
                          className="btn-sm btn-danger"
                          disabled={!product.approved}
                        >
                          Disable account{" "}
                        </Button>
                      </>
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

export default Users;
