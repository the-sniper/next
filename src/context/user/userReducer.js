import {
  GET_STATIC_PAGE,
  CLEAR_RESPONSE,
  RESPONSE_STATUS,
  CHECKOUT,
  CHECKOUT_BUYNOW,
  CHECKOUT_EMPTY,
} from "./userTypes";

export default (state, action) => {
  switch (action.type) {
    case RESPONSE_STATUS:
      return {
        ...state,
        responseStatus: action.payload,
      };
    case GET_STATIC_PAGE:
      return {
        ...state,
        static_page: action.payload,
      };
    case CHECKOUT:
      return {
        ...state,
        cart_items: action.payload.checkout,
        cart_total_info: action.payload,
        all_shipping_address: action.payload.shipping,
      };
    case CHECKOUT_BUYNOW:
      return {
        ...state,
        buynow_cart_items: action.payload,
        // buynow_cart_total_info: action.payload,
        // buynow_all_shipping_address: action.payload.shipping,
      };
    case CHECKOUT_EMPTY:
      return {
        ...state,
        ...action.payload,
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
