import axios from "axios";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../App";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
} from "../constants/productConstants";
import { logout } from "./userActions";

export const listProducts = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    let data = []
    const {
      userLogin: { userInfo },
    } = getState();
    if (userInfo?.isAdmin) {
      console.log("here admin");
      const querySnapshot = await getDocs(collection(db, "pools"));
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
    } else {
      console.log("here customer");

      const q = query(
        collection(db, "pools"),
        where("addedBy", "==", getState().userLogin.userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listOffers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    let data = [];
    if (getState()?.userInfo?.isAdmin === true) {
      const querySnapshot = await getDocs(collection(db, "offers"));
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
    } else {
      const q = query(
        collection(db, "offers"),
        where("addedBy", "==", getState().userLogin.userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProduct = (data) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });

    let s = await setDoc(doc(db, "pools", data.id), data);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: message,
    });
  }
};
