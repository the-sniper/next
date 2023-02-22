import {
  RESPONSE_STATUS,
  CLEAR_RESPONSE,
  LOT_PRICE,
  LOT_QTY,
  CATEGORY,
  SELLERS,
} from "./buyerTypes";

export default (state, action) => {
  switch (action.type) {
    case RESPONSE_STATUS:
      return {
        ...state,
        responseStatus: action.payload,
      };
    case LOT_PRICE:
      return {
        ...state,
        lotPrice: action.payload,
      };
    case LOT_QTY:
      return {
        ...state,
        lotQty: action.payload,
      };
    case CLEAR_RESPONSE:
      return {
        ...state,
        responseStatus: "",
      };
    case CATEGORY:
      return {
        ...state,
        category: action.payload,
      };
    case SELLERS:
      return {
        ...state,
        seller: action.payload,
      };
    default:
      return state;
  }
};
