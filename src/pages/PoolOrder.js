import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Card, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails } from "../actions/orderActions";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../App";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const OrderScreen = () => {
  const params = useParams();
  const navigate = useNavigate();
  const orderId = params.id;
  const [technician, setTechnician] = useState("");
  const [tLoading, setTloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [acidUsed, setAcidUsed] = useState("");
  const [technicianNotes, setTechnicianNotes] = useState("");
  const [gallonsUser, setGallonsUser] = useState("");
  const [tabsUser, setTabsUser] = useState("");
  const [poolChemistry, setPoolChemistry] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    getTechnicians();
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId, navigate, userInfo, tLoading]);
  const getTechnicians = async () => {
    let data = [];
    const q = query(
      collection(db, "users"),
      where("userType", "==", "technician")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    setTechnicians(data);
  };

  const assignTechnician = async (e) => {
    e.preventDefault();
    setTloading(true);
    try {
      const washingtonRef = doc(db, "orders", orderId);

      await updateDoc(washingtonRef, {
        technician: technician,
        dateAssignedOn: new Date().toDateString(),
      });
      alert("Technician Assigned");
      setTloading(true);
    } catch (error) {
      setTloading(false);
      alert(error.message);
    }
  };

  const uploadFileHandler = async (e) => {
    setUploading(true);
    try {
      const file = e.target.files[0];
      const metadata = {
        contentType: "image/any",
      };

      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          alert(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
            setUploading(false);
          });
        }
      );
      setUploading(false);
    } catch (error) {
      alert(error);
      setUploading(false);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setTloading(true);
    try {
      const washingtonRef = doc(db, "orders", orderId);
      let images = order.technicianImage;
      if (images.length > 10) {
        images = [image];
      } else {
        images.push(image);
      }
      await updateDoc(washingtonRef, {
        technician: "",
        lastServiced: new Date().toDateString(),
        acidUsed,
        technicianNotes,
        gallonsUser,
        tabsUser,
        technicianImage: images,
        poolChemistry,
      });
      alert("Details Updated");
      setTloading(false);
    } catch (error) {
      setTloading(false);
      alert(error.message);
    }
  };
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>Order Details</h3>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.customer}`}>{order.customer}</a>
              </p>
              <p>
                <strong>Location:</strong>
                {order.location}{" "}
              </p>
              <p>
                <strong>Message:</strong>
                {order.message}{" "}
              </p>
              <p>
                <strong>Size:</strong>
                {order.size}{" "}
              </p>
              {order.lastServiced ? (
                <Message variant="success">
                  Last Serviced on {order.lastServiced}
                </Message>
              ) : (
                <Message variant="danger">Not Serviced</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Technician Details</h2>
              <p>
                <strong>Acid Used: </strong>
                {order.acidUsed}
              </p>
              <p>
                <strong>Gallons Used: </strong>
                {order.gallonsUser}
              </p>
              <p>
                <strong>Image by Client:</strong>
                <br />
                <img src={order.image} alt={order.email} width="500px"></img>
              </p>
              <p>
                <strong>Tabs: </strong>
                {order.tabsUser}
              </p>

              <p>
                <strong>Technician Notes: </strong>
                {order.technicianNotes}
              </p>
              <p>
                <strong>Pool Chemistry: </strong>
                {order.poolChemistry}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              {userInfo.userType === "technician" ? (
                <>
                  <h2>Technician Form</h2>
                  {tLoading ? (
                    <Loader />
                  ) : (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="name">
                        <Form.Label>Acid Used</Form.Label>
                        <Form.Control
                          type="name"
                          placeholder="Enter Acid Used"
                          value={acidUsed}
                          onChange={(e) => setAcidUsed(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group controlId="name">
                        <Form.Label>Gallons Used</Form.Label>
                        <Form.Control
                          type="name"
                          placeholder="Enter Gallons Used"
                          value={gallonsUser}
                          onChange={(e) => setGallonsUser(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group controlId="price">
                        <Form.Label>Tabs Used</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter Tab Used"
                          value={tabsUser}
                          onChange={(e) => setTabsUser(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group controlId="image">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter image url"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                        ></Form.Control>
                        <Form.Control
                          type="file"
                          id="image-file"
                          label="Choose File"
                          custom
                          onChange={uploadFileHandler}
                        ></Form.Control>
                        {uploading && <Loader />}
                      </Form.Group>

                      <Form.Group controlId="description">
                        <Form.Label>Technician Notes</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Technician Notes"
                          value={technicianNotes}
                          onChange={(e) => setTechnicianNotes(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group controlId="description">
                        <Form.Label>Pool Chemistry</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Pool Chemistry"
                          value={poolChemistry}
                          onChange={(e) => setPoolChemistry(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Button type="submit" variant="primary">
                        Update Details
                      </Button>
                    </Form>
                  )}
                </>
              ) : userInfo.isAdmin ? (
                <Form onSubmit={assignTechnician}>
                  <Form.Group controlId="name">
                    <Form.Label>Assign Technician</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      onChange={(e) => setTechnician(e.target.value)}
                    >
                      <option disabled>Select Technician</option>
                      {technicians.map((e) => (
                        <option value={e.email}>{e.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Assign Technician
                  </Button>
                </Form>
              ) : (
                <div />
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Price</Col>
                  <Col>${order.price}</Col>
                </Row>
              </ListGroup.Item>
              {/* {<Loader />} */}
              {userInfo && userInfo.userType === "technician" && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    //   onClick={deliverHandler}
                  >
                    Mark As Complete
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row>
        <p>
          <strong>Technician Images: </strong>
          <br />
          {order?.technicianImage?.map((e, idx) => (
            <img key={idx} src={e} alt={order.email} width="500px" />
          ))}
        </p>
      </Row>
    </>
  );
};

export default OrderScreen;
