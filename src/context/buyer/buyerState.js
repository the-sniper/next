import React, { useReducer } from "react";
import BuyerContext from "./buyerContext";
import BuyerReducer from "./buyerReducer";
import { apiCall } from "../../common/api";
import { response } from "../common";

import {
  RESPONSE_STATUS,
  CLEAR_RESPONSE,
  LOT_PRICE,
  LOT_QTY,
  SELLERS,
  CATEGORY,
} from "./buyerTypes";

const BuyerState = (props) => {
  const initialState = {
    responseStatus: null,
    lotPrice: false,
    lotQty: false,
    category: false,
    seller: false,
  };

  const [state, dispatch] = useReducer(BuyerReducer, initialState);
  let resp = new response(dispatch, RESPONSE_STATUS);

  // Bid Confirm
  const bidConfirm = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "addbidoffer", formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("bid");
    }
  };

  // Bid Confirm
  const mobileConfirm = async (formData) => {
    try {
      formData.is_auctionio=1;
      const [res] = await Promise.all([
        apiCall("post", "mobileapi/mobileconfirmAuctionIO", formData, "", ""),
      ]);
      if (res.data == "ok") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("bid");
    }
  };

  //Add to cart single
  const addToCartSingle = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "addtocart", formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("cartSingle");
    }
  };

  const processPayment = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "stripe_checkout_payment", formData, "", ""),
      ]);
      if (res.data?.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("checkout");
    }
  };

  const processBuynowPayment = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "stripe_checkout_buynow_payment", formData, "", ""),
      ]);
      if (res.data?.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      resp.commonErrorResponse("checkout");
    }
  };

  const lotPriceChng = (formData) => {
    dispatch({
      type: LOT_PRICE,
      payload: formData,
    });
  };

  const lotQtyChng = (formData) => {
    dispatch({
      type: LOT_QTY,
      payload: formData,
    });
  };

  const categories = (formData) => {
    dispatch({
      type: CATEGORY,
      payload: formData,
    });
  };

  const sellers = (formData) => {
    dispatch({
      type: SELLERS,
      payload: formData,
    });
  };
  // Clear Response
  const clearResponse = () =>
    dispatch({
      type: CLEAR_RESPONSE,
    });

  return (
    <BuyerContext.Provider
      value={{
        responseStatus: state.responseStatus,
        lotPrice: state.lotPrice,
        lotQty: state.lotQty,
        category: state.category,
        seller: state.seller,
        clearResponse,
        bidConfirm,
        mobileConfirm,
        lotPriceChng,
        lotQtyChng,
        categories,
        processPayment,
        processBuynowPayment,
        sellers,
        addToCartSingle,
      }}
    >
      {props.children}
    </BuyerContext.Provider>
  );
};

export default BuyerState;
