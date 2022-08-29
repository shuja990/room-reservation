import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import ".//bootstrap.min.css";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import RegisterScreen from "./pages/RegisterScreen";
import LoginScreen from "./pages/LoginScreen";
import BookRoom from "./pages/BookRoom";
import PoolList from "./pages/PoolsList";
import OfferList from "./pages/EventsList";
import OrderListScreen from "./pages/PoolOrders";
import OrderScreen from "./pages/PoolOrder";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./actions/userActions";
import Users from "./pages/Users";
import Rooms from "./pages/Rooms";
import Events from "./pages/Events";
import EventsList from "./pages/EventsList";
const firebaseConfig = {
  apiKey: "AIzaSyATpmp5ux3Qw6fY1txwlJdqcCgfbHCkP3o",
  authDomain: "room-reservation-961d0.firebaseapp.com",
  projectId: "room-reservation-961d0",
  storageBucket: "room-reservation-961d0.appspot.com",
  messagingSenderId: "338789480150",
  appId: "1:338789480150:web:9a209f03c3f29332d5bb77",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

const App = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();
  useEffect(() => {
    if (userInfo) {
      if (userInfo.approved == false) {
        alert("Account not approved yet");
        dispatch(logout());
      }
    }
  });
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route exact path="/*" element={<Rooms />} />
            <Route exact path="/signup" element={<RegisterScreen />} />
            <Route exact path="/login" element={<LoginScreen />} />
            <Route exact path="/book-room/:id" element={<BookRoom />} />
            <Route exact path="/events" element={<Events />} />
            <Route exact path="/events-list" element={<EventsList />} />
          </Routes>
        </Container>
      </main>
    </Router>
  );
};

export default App;
