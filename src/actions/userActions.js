import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_DETAILS_RESET,
  USER_LIST_FAIL,
  USER_LIST_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
} from "../constants/userConstants";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../App";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

export const login = (email, password, navigate) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const data = await signInWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, "users", data.user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      localStorage.setItem("userInfo", JSON.stringify(docSnap.data()));
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: docSnap.data(),
      });
      navigate("/");
    } else {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: "User Not found",
      });
    }
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem("userInfo");
  await auth.signOut();
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: USER_LIST_RESET });
  document.location.href = "/login";
};

export const register =
  (name, email, password, navigate) => async (dispatch) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });

      const data = await createUserWithEmailAndPassword(auth, email, password);

      let s = await setDoc(doc(db, "users", email), {
        email: email,
        isAdmin: false,
        name,
      });
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      if (docSnap.exists()) {
        localStorage.setItem("userInfo", JSON.stringify(docSnap.data()));
        dispatch({
          type: USER_LOGIN_SUCCESS,
          payload: docSnap.data(),
        });
        dispatch({
          type: USER_REGISTER_SUCCESS,
          payload: docSnap.data(),
        });
        navigate("/");
        window.location.reload();
      } else {
        dispatch({
          type: USER_REGISTER_FAIL,
          payload: "User Not found",
        });
      }

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// export const updateUserProfile = (user) => async (dispatch, getState) => {
//   try {
//     dispatch({
//       type: USER_UPDATE_PROFILE_REQUEST,
//     });

//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };

//     const { data } = await axios.put(`/api/users/profile`, user, config);

//     dispatch({
//       type: USER_UPDATE_PROFILE_SUCCESS,
//       payload: data,
//     });
//     dispatch({
//       type: USER_LOGIN_SUCCESS,
//       payload: data,
//     });
//     localStorage.setItem("userInfo", JSON.stringify(data));
//   } catch (error) {
//     const message =
//       error.response && error.response.data.message
//         ? error.response.data.message
//         : error.message;
//     if (message === "Not authorized, token failed") {
//       dispatch(logout());
//     }
//     dispatch({
//       type: USER_UPDATE_PROFILE_FAIL,
//       payload: message,
//     });
//   }
// };

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });
    let data = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    dispatch({
      type: USER_LIST_SUCCESS,
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
      type: USER_LIST_FAIL,
      payload: message,
    });
  }
};
