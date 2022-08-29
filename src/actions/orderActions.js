import axios from "axios";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../App";
import { CART_CLEAR_ITEMS } from "../constants/cartConstants";
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_LIST_FAIL,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_REQUEST,
} from "../constants/orderConstants";
import { logout } from "./userActions";
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });

    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    let data = docSnap.data();
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: message,
    });
  }
};

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();
    let data = [];
    if (userInfo.isAdmin === true) {
      const querySnapshot = await getDocs(collection(db, "orders"));
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      dispatch({
        type: ORDER_LIST_SUCCESS,
        payload: data,
      });
    } else if (userInfo.userType === "customer" && userInfo.isAdmin===false) {
      const q = query(
        collection(db, "orders"),
        where("customer", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      dispatch({
        type: ORDER_LIST_SUCCESS,
        payload: data,
      });
    } else {
      console.log("here");
      const q = query(
        collection(db, "orders"),
        where("technician", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      dispatch({
        type: ORDER_LIST_SUCCESS,
        payload: data,
      });
    }
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: message,
    });
  }
};
