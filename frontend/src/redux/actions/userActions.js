import api from "../../utils/api";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateRequest,
  updateSuccess,
  updateFail,
  updateReset,
  clearErrors,
} from "../slices/userSlice";
import { fetchCartItems } from "./cartActions";
import { clearCart } from "../slices/cartSlice";

// LOGIN

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await api.post("/v1/users/login", {
      email,
      password,
    });
    dispatch(loginSuccess(data.data.user));
    dispatch(fetchCartItems());
  } catch (error) {
    dispatch(loginFail("login Failed "));
  }
};

//Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await api.post("/v1/users/signup", userData, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(loginSuccess(data.data.user));
    dispatch(fetchCartItems());
  } catch (error) {
    const errMsg = error.response?.data?.message || error.response?.data?.errMessage || "An error occurred during registration";
    dispatch(loginFail(errMsg));
  }
};


//load user
export const loadUser = () => async (dispatch) => {
  // try{
  //     dispatch(loginRequest())

  //     const {data} = await api.get("/v1/users/me")

  //     dispatch(loginSuccess(data.user))

  // }catch(error){
  //     dispatch(loadUserFail(error.response?.data?.message))
  // }

  try {
    dispatch(loginRequest());

    const { data } = await api.get("/v1/users/me");

    console.log("loadUser response:", data);

    dispatch(loginSuccess(data.user));
  } catch (error) {
    console.log("loadUser error:", error.response);

    const errMsg = error.response?.data?.message || error.response?.data?.errMessage || "Failed to load user";
    dispatch(loadUserFail(errMsg));
  }
};

//update profile

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());

    const { data } = await api.put("/v1/users/me/update", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateSuccess(data.success));
  } catch (error) {
    const errMsg = error.response?.data?.message || error.response?.data?.errMessage || "Failed to update profile";
    dispatch(updateFail(errMsg));
  }
};

//logout
export const logout = () => async (dispatch) => {
  try {
    await api.get("v1/users/logout");
    dispatch(logoutSuccess());
    dispatch(clearCart());
  } catch (error) {
    const errMsg = error.response?.data?.message || error.response?.data?.errMessage || "Failed to log out";
    dispatch(logoutFail(errMsg));
  }
};

