import React, { useReducer } from "react";
import AuthContext from "./authContext";
import AuthReducer from "./authReducer";
import { apiCall, setAuthToken } from "../../common/api";
import { response } from "../common";
import {
  USER_LOADED,
  LOGOUT,
  RESPONSE_STATUS,
  CLEAR_RESPONSE,
  LOAD_ALL_LOGIN,
  LOAD_ALL_REGISTER,
} from "./authTypes";

const AuthState = (props) => {
  const initialState = {
    token:
      typeof window != "undefined" &&
      (sessionStorage.getItem("token") || localStorage.getItem("token")),
    isAuthenticated: null,
    isAdmin: null,
    loading: true,
    user: null,

    allLogin:
      typeof window != "undefined" &&
      (localStorage.getItem("allLogin")
        ? JSON.parse(localStorage.getItem("allLogin"))
        : []),
    allRegister: [],
    responseStatus: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);
  let resp = new response(dispatch, RESPONSE_STATUS);

  const register = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "registration", formData, "", ""),
      ]);
      dispatch({
        type: LOAD_ALL_REGISTER,
        payload: {
          data: res.data.existing_stores,
        },
      });
      resp.commonResponse(res.data, "register");
    } catch (err) {
      resp.commonErrorResponse("register");
    }
  };

  const checkEmail = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "checkemail", formData, "", ""),
      ]);
      resp.commonResponse(res.data, "checkEmail");
      if (res.data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("checkEmail");
    }
  };

  const login = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "login", formData, "", ""),
      ]);
      resp.commonResponse(res.data, "login");
      if (res.data.status === "success") {
        dispatch({
          type: LOAD_ALL_LOGIN,
          payload: {
            data: res.data.response.other_login,
          },
        });
        localStorage.setItem(
          "allLogin",
          JSON.stringify(res.data.response.other_login)
        );
        console.log(JSON.stringify(res), "resCheck");
        if (global.session) {
          sessionStorage.setItem("token", res.data.response.token);
        } else {
          localStorage.setItem("token", res.data.response.token);
        }
        loadUser(res);
      }
    } catch (err) {
      resp.commonErrorResponse("login");
    }
  };

  const activateAccount = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "activate", formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        return true;
      }
    } catch (err) {
      resp.commonErrorResponse("activateAccount");
      return false;
    }
  };

  const loadUser = async () => {
    if (localStorage.token && !global.session) {
      setAuthToken(localStorage.token);
    } else if (sessionStorage.token) {
      setAuthToken(sessionStorage.token);
    }

    const [res] = await Promise.all([
      apiCall("post", "tokenverify", {}, "", ""),
    ]);
    if (res.data && res.data.status === "success") {
      await dispatch({
        type: USER_LOADED,
        payload: {
          data: res.data.response,
        },
      });
    } else if (res.data && res.data.status === "error") {
      await dispatch({
        type: LOGOUT,
      });
    } else {
      await dispatch({
        type: LOGOUT,
      });
    }
  };

  const saveMarketingSource = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "marketingSource", formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("marketingSource");
      return false;
    }
  };

  const sendContactUs = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "contactus", formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("sendContactUs");
      return false;
    }
  };

  const donar_registration = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/charity/donation/donor/add_new_donar",
          formData,
          "",
          ""
        ),
      ]);

      if (res.data.status === "success") {
        res.data.msg = res.data.data.message;
        resp.commonResponse(res.data, "donar_register");
      } else if (res.data.status === "error") {
        res.data.response = res.data.data.message;
        resp.commonResponse(res.data, "donar_register");
      }
    } catch (err) {
      resp.commonErrorResponse("donar_register");
    }
  };

  const book_tickets = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/ticketing/seat/order/createTicket",
          formData,
          "",
          ""
        ),
      ]);

      if (res.data.status === "success") {
        res.data.msg = res.data.data.message;
        resp.commonResponse(res.data, "book_ticket");
      } else if (res.data.status === "error") {
        res.data.response = res.data.data.message;
        resp.commonResponse(res.data, "booke_ticket");
      }
    } catch (err) {
      resp.commonErrorResponse("book_ticket");
    }
  };

  const get_Stage = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/ticketing/seat/order/getstage",
          formData,
          "",
          ""
        ),
      ]);

      if (res.data.status === "success") {
        res.data.msg = res.data.data.message;
        resp.commonResponse(res.data, "Ticket_System");
      } else if (res.data.status === "error") {
        res.data.response = res.data.data.message;
        resp.commonResponse(res.data, "Ticket_System");
      }
    } catch (err) {
      resp.commonErrorResponse("Ticket_System");
    }
  };

  const getdonarexistingcard = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/charity/donation/donor/getusercard",
          formData,
          "",
          ""
        ),
      ]);
      const from = "donorcarddetails_bidderdetails_page";
      // console.log("response from bidderdetails", res);
      if (res.data.status === "success") {
        res.data.msg = res.data.data.message;
        resp.commonResponse(res.data, from);
      } else if (res.data.status === "error") {
        res.data.response = res.data.data.message;
        resp.commonResponse(res.data, from);
      } else {
        resp.commonErrorResponse(from);
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };
  const getdonarlist = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/charity/donation/donor/view_donar",
          formData,
          "",
          ""
        ),
      ]);
      const from = formData?.from
        ? formData.from
        : "donorlist_bidderdetails_page";
      // console.log("response from bidderdetails", res);
      if (res.data.status === "success") {
        res.data.msg = res.data.data.message;
        resp.commonResponse(res.data, from);
      } else if (res.data.status === "error") {
        res.data.response = res.data.data.message;
        resp.commonResponse(res.data, from);
      } else {
        resp.commonErrorResponse(from);
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };
  const check_ticket_avialable = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/ticketing/seat/order/availableSeat",
          formData,
          "",
          ""
        ),
      ]);
      const from = formData.from ? formData.from : "check_ticket_status";

      if (res.data.status === "success") {
        res.data.msg = res.data.data.message;
        resp.commonResponse(res.data, from);
      } else if (res.data.status === "error") {
        res.data.response = res.data.data.message;
        resp.commonResponse(res.data, from);
      } else {
        resp.commonErrorResponse(from);
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const get_booked_tickets = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "/plugin/ticketing/seat/order/myTickets",
          formData,
          "",
          ""
        ),
      ]);
      const from = formData.from ? formData.from : "booked_ticket_status";

      if (res.data.status === "success") {
        res.data.msg = res.data.data.message;
        resp.commonResponse(res.data, from);
      } else if (res.data.status === "error") {
        res.data.response = res.data.data.message;
        resp.commonResponse(res.data, from);
      } else {
        resp.commonErrorResponse(from);
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const logout = () =>
    dispatch({
      type: LOGOUT,
    });

  // Clear Response
  const clearResponse = () =>
    dispatch({
      type: CLEAR_RESPONSE,
    });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        responseStatus: state.responseStatus,
        allLogin: state.allLogin,
        allRegister: state.allRegister,
        register,
        login,
        logout,
        clearResponse,
        loadUser,
        checkEmail,
        sendContactUs,
        activateAccount,
        saveMarketingSource,
        donar_registration,
        getdonarexistingcard,
        getdonarlist,
        get_Stage,
        check_ticket_avialable,
        book_tickets,
        get_booked_tickets,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
