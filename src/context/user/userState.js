import React, { useReducer } from "react";
import UserContext from "./userContext";
import UserReducer from "./userReducer";
import { apiCall } from "../../common/api";
import { response } from "../common";

import {
  GET_STATIC_PAGE,
  CLEAR_RESPONSE,
  RESPONSE_STATUS,
  CHECKOUT,
  CHECKOUT_BUYNOW,
  CHECKOUT_EMPTY,
} from "./userTypes";

const UserState = (props) => {
  const initialState = {
    responseStatus: null,
    cart_items: [],
    all_shipping_address: [],
    static_page: {},
    cart_total_info: {},
    buynow_cart_items: [],
    buynow_all_shipping_address: [],
    buynow_cart_total_info: {},
  };

  const [state, dispatch] = useReducer(UserReducer, initialState);
  let resp = new response(dispatch, RESPONSE_STATUS);

  const getUserProfileDetails = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "myprofile", formData, "", ""),
      ]);
      if (
        res.data.status === "success" &&
        res.data.response.results &&
        res.data.response.results.length > 0
      ) {
        return res.data.response.results[0];
      }
    } catch (err) {
      resp.commonErrorResponse("getProfile");
    }
  };

  const updateProfile = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "editprofile", formData, "", ""),
      ]);
      if (res.data.status === "success" && res.data.response.results) {
        return true;
      }
    } catch (err) {
      resp.commonErrorResponse("updateProfile");
    }
  };

  const getPreference = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "getnotification", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return res.data.response;
      }
    } catch (err) {
      resp.commonErrorResponse("getPreference");
    }
  };

  const setPreference = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "save_notification", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return res.data.response;
      }
    } catch (err) {
      resp.commonErrorResponse("updatePreference");
    }
  };

  const getWatchList = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "my_watchlist", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return res.data.response;
      }
    } catch (err) {
      resp.commonErrorResponse("getWatchlist");
    }
  };

  const getOrders = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "myorderlist", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return res.data.response;
      }
    } catch (err) {
      resp.commonErrorResponse("getOrders");
    }
  };

  const forgotPassword = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "forgotPassword", formData, "", "user"),
      ]);
      resp.commonResponse(res.data, "forgotPassword");
    } catch (err) {
      resp.commonErrorResponse("forgotPassword");
    }
  };

  const sendPhoneVerifyCode = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "sendPhoneVerifyCode", formData, "", "user"),
      ]);
      resp.commonResponse(res.data, "sendPhoneVerifyCode");
    } catch (err) {
      resp.commonErrorResponse("sendPhoneVerifyCode");
    }
  };

  const verifyPhoneVerifyCode = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "verifyPhoneVerifyCode", formData, "", "user"),
      ]);
      resp.commonResponse(res.data, "verifyPhoneVerifyCode");
    } catch (err) {
      resp.commonErrorResponse("verifyPhoneVerifyCode");
    }
  };

  const resetPassword = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "resetpassword", formData, "", ""),
      ]);
      if (res.data) {
        return res.data;
      }
    } catch (err) {
      resp.commonErrorResponse("resetPassword");
    }
  };

  const changePassword = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "changepassword", formData, "", ""),
      ]);
      if (res.data) {
        return res.data;
      }
    } catch (err) {
      resp.commonErrorResponse("changePassword");
    }
  };

  const sendEmailVerifyLink = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "forgot_password", formData, "", ""),
      ]);
      resp.commonResponse(res.data, "sendEmailVerifyLink");
      if (res.data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("sendEmailVerifyLink");
    }
  };

  const verifyEmail = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "checkemail", formData, "", ""),
      ]);
      resp.commonResponse(res.data, "checkemail");
      if (res.data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("checkemail");
    }
  };
  const verifyAddress = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "isValidAddress", formData, "", "tax/avalara"),
      ]);
      resp.commonResponse(res.data, "isValidAddress");
    } catch (err) {
      resp.commonErrorResponse("isValidAddress");
    }
  };
  const getStaticPage = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "show_static_content", formData),
      ]);
      if (res.data.status === "true") {
        dispatch({
          type: GET_STATIC_PAGE,
          payload: res.data.data[0],
        });
      } else {
        dispatch({
          type: RESPONSE_STATUS,
          payload: res.data.message,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const submitContactUs = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "submitContactUs", formData, "", "user"),
      ]);
      resp.commonResponse(res.data, "submitContactUs");
    } catch (err) {
      resp.commonErrorResponse("submitContactUs");
    }
  };

  const userAddress = async (formData) => {
    const from = "userAddress";
    try {
      const [res] = await Promise.all([
        apiCall("post", from, formData, "", "user"),
      ]);
      resp.commonResponse(res.data, from);
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const addShippingAddress = async (formData) => {
    const from = "checkout";
    try {
      const [res] = await Promise.all([
        apiCall("post", "addshipping", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return res.data.response;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const removeShippingAddress = async (formData) => {
    const from = "checkout";
    try {
      const [res] = await Promise.all([
        apiCall("post", "deleteshippingaddr", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return true;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const removeFromCart = async (formData) => {
    const from = "removeFromCart";
    try {
      const [res] = await Promise.all([
        apiCall("get", "removefromcart", formData),
      ]);
      if (res.data.success) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const setDefaultShippingAddress = async (formData) => {
    const from = "checkout";
    try {
      const [res] = await Promise.all([
        apiCall("post", "checkdefalutshipping", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return res.data.response;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const getStripeCard = async (formData) => {
    const from = "checkout";
    try {
      const [res] = await Promise.all([
        apiCall("post", "stripegetcard", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return res.data.response;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const addStripeCard = async (formData) => {
    const from = "checkout";
    try {
      const [res] = await Promise.all([
        apiCall("post", "stripeaddcard", formData, "", ""),
      ]);
      if (res.data) {
        return res.data;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const removeStripeCard = async (formData) => {
    const from = "checkout";
    try {
      const [res] = await Promise.all([
        apiCall("post", "stripedeletecard", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return true;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  // const getBuynowCheckout = async (formData) => {
  //   const from = "mycart";
  //   try {
  //     const [res] = await Promise.all([
  //       apiCall("post", "mycart", formData, "", ""),
  //     ]);
  //     if (res.data.status === "success") {
  //       // console.log(res.data, "this is the responce from chcek out");
  //       dispatch({
  //         type: CHECKOUT_BUYNOW,
  //         payload: res.data.response,
  //       });
  //     } else {
  //       dispatch({
  //         type: CHECKOUT_EMPTY,
  //         payload: {
  //           buynow_cart_items: [],
  //           buynow_all_shipping_address: [],
  //           buynow_cart_total_info: {},
  //         },
  //       });
  //     }
  //   } catch (err) {
  //     resp.commonErrorResponse(from);
  //   }
  // };
  const getBuynowCheckout = async (formData) => {
    const from = "mycart";
    try {
      const [res] = await Promise.all([
        apiCall("get", "getUserCart", formData, "", ""),
      ]);
      if (res.data.success) {
        // console.log(res.data, "this is the responce from chcek out");
        dispatch({
          type: CHECKOUT_BUYNOW,
          payload: res.data.data.length ? res.data.data : [],
        });
      } else {
        dispatch({
          type: CHECKOUT_EMPTY,
          payload: {
            buynow_cart_items: [],
            buynow_all_shipping_address: [],
            buynow_cart_total_info: {},
          },
        });
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };
  const getCheckout = async (formData) => {
    const from = "cart";
    try {
      const [res] = await Promise.all([
        apiCall("post", "getcheckout", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        // console.log(res.data, "this is the responce from chcek out");
        dispatch({
          type: CHECKOUT,
          payload: res.data.response,
        });
      } else {
        dispatch({
          type: CHECKOUT_EMPTY,
          payload: {
            cart_items: [],
            all_shipping_address: [],
            cart_total_info: {},
          },
        });
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const getSavedSearch = async (formData) => {
    const from = "dashboard";
    try {
      const [res] = await Promise.all([
        apiCall("post", "getallsavedsearch", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return res.data.response.results;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const addSavedSearch = async (formData) => {
    const from = "dashboard";
    try {
      const [res] = await Promise.all([
        apiCall("post", "addsavedsearch", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return true;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const removeSavedSearch = async (formData) => {
    const from = "dashboard";
    try {
      const [res] = await Promise.all([
        apiCall("post", "deletesavedsearch", formData, "", ""),
      ]);
      if (res.data.status === "success") {
        return true;
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const clearResponse = () =>
    dispatch({
      type: CLEAR_RESPONSE,
    });
  return (
    <UserContext.Provider
      value={{
        responseStatus: state.responseStatus,
        static_page: state.static_page,
        cart_items: state.cart_items,
        all_shipping_address: state.all_shipping_address,
        cart_total_info: state.cart_total_info,
        buynow_cart_items: state.buynow_cart_items,
        buynow_all_shipping_address: state.buynow_all_shipping_address,
        buynow_cart_total_info: state.buynow_cart_total_info,
        clearResponse,
        sendPhoneVerifyCode,
        verifyPhoneVerifyCode,
        updateProfile,
        setPreference,
        forgotPassword,
        resetPassword,
        sendEmailVerifyLink,
        verifyEmail,
        verifyAddress,
        getStaticPage,
        submitContactUs,
        getBuynowCheckout,
        userAddress,
        getPreference,
        addShippingAddress,
        removeShippingAddress,
        getStripeCard,
        addStripeCard,
        removeStripeCard,
        getCheckout,
        getWatchList,
        getOrders,
        setDefaultShippingAddress,
        getUserProfileDetails,
        changePassword,
        getSavedSearch,
        addSavedSearch,
        removeSavedSearch,
        removeFromCart,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
