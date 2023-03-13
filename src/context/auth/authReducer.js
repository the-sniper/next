import {
  USER_LOADED,
  LOGOUT,
  RESPONSE_STATUS,
  CLEAR_RESPONSE,
  LOAD_ALL_LOGIN,
  LOAD_ALL_REGISTER,
} from "./authTypes";

export default (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.data,
      };
    case LOAD_ALL_LOGIN:
      return {
        ...state,
        allLogin: action.payload.data,
      };
    case LOAD_ALL_REGISTER:
      return {
        ...state,
        allRegister: action.payload.data,
      };
    case LOGOUT:
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAdmin: false,
        isAuthenticated: false,
        loading: false,
        user: {},
      };
    case RESPONSE_STATUS:
      return {
        ...state,
        responseStatus: action.payload,
      };
    case CLEAR_RESPONSE:
      return {
        ...state,
        responseStatus: "",
      };
    default:
      return state;
  }
};
