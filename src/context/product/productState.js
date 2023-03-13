import React, { useReducer } from "react";
import ProductContext from "./productContext";
import ProductReducer from "./productReducer";
import { apiCall } from "../../common/api";
import { response } from "../common";

import {
  GET_ALL_BID_HISTORY,
  RESPONSE_STATUS,
  CLEAR_RESPONSE,
  GET_SAVED_SEARCHES,
  GET_SINGLE_INVOICE_DETAIL,
  LOT_PRODUCT_DTLS,
  ALL_LOTS,
  DASHBOARD_MYBIDS,
  GET_ALL_SEARCH,
  GET_ALL_SELLERS,
  GET_ALL_LOTS,
  GET_SUBSCRIPTION_LIST,
  AVAILABLE_PLUGIN_LIST,
  GET_STORE_PRODUCTS,
  GET_MARKETING_LOTS,
  GET_LOT_IMAGES,
  GET_TEMPLATES,
  SUCCESS,
  GET_AUCTION_CHECKOUT,
  GET_STATIC_PAGE,
} from "./productTypes";

const ProductState = (props) => {
  const initialState = {
    dashboard: {
      records: [],
      totalRecords: 0,
      setDisp: "",
      sorts: {},
    },
    search_allbidhistory: {
      records: [],
      totalRecords: 0,
      setDisp: "",
      sorts: {},
    },
    saved_searches: {
      records: [],
      totalRecords: 0,
      setDisp: "",
    },
    search_allinvoiceproducts: {
      record: [],
      shipping_address: 0,
    },
    responseStatus: null,
    lot_details: {},
    allLots: {},
    dashboardMyBids: {},
    getAllSeller: [],
    subscription_lists: [],
    plugin_lists: [],
    store_products: [],
    store_details: {},
    marketing_lots: [],
    lot_images: [],
    saved_templates: [],
    invoice_details: [],
    invoice_store_config: {},
    invoice_plugin_config: {},
    static_page: {
      content: "",
    },
    success: "",
  };

  const [state, dispatch] = useReducer(ProductReducer, initialState);
  let resp = new response(dispatch, RESPONSE_STATUS);
  const addSavedSearch = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "addSavedSearch", formData, "", "user"),
      ]);
      resp.commonResponse(res.data, "saved_search_msg");
    } catch (err) {
      resp.commonErrorResponse("saved_search_msg");
    }
  };

  const getSavedSearch = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "getSavedSearch", formData, "", "user"),
      ]);
      dispatch({
        type: GET_SAVED_SEARCHES,
        payload: {
          records: res.data.data.responseData.records.length
            ? res.data.data.responseData.records
            : [],
          totalRecords: res.data.data.responseData.totalRecords,
          setDisp: res.data.data.responseData.setDisp,
        },
      });
    } catch (err) {
      resp.commonErrorResponse("savedSearch");
    }
  };

  const removeSavedSearch = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "removeSavedSearch", formData, "", "user"),
      ]);
      resp.commonResponse(res.data, "saved_search_msg");
    } catch (err) {
      resp.commonErrorResponse("saved_search_msg");
    }
  };

  const getAllSearchProducts = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "searchAPI", formData, "", ""),
      ]);
      const from = "search";
      if (res.data.status === "success") {
        dispatch({
          type: GET_ALL_SEARCH,
          payload: {
            records: res.data.response.results.length
              ? res.data.response.results
              : [],
            totalRecords: res.data.response.total_results,
          },
        });
      } else if (res.data.status === "error") {
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

  const getIndividualProductLotDetails = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "lotDetails", formData, "", ""),
      ]);

      if (res.data.status === "success") {
        if (res.data.response.bidtopwinner) {
          if (
            !res.data.response.bidtopstatus.includes("!") &&
            !res.data.response.bidtopstatus.includes("unfortunately,")
          ) {
            res.data.response.lotDetails.rprice =
              res.data.response.lotDetails.rprice || 0;
            let reserveCheck = res.data.response.bidtopstatus.split(". ");
            if (reserveCheck.length > 1) {
              var autobid = res.data.response.bidtopstatus
                .split(". ")[0]
                .replace(/[^\d.]/g, "");
              var autobid1 = res.data.response.bidtopstatus
                .split(". ")[1]
                .replace(/[^\d.]/g, "");
              if (
                parseInt(autobid) <
                parseInt(res.data.response.lotDetails.rprice)
              ) {
                if (parseInt(autobid) === parseInt(autobid1)) {
                  res.data.response.bidtopstatus = `Your bid of $${parseInt(
                    autobid1
                  ).toUSFormat()} on this item placed, but reserve price not yet met.`;
                } else {
                  res.data.response.bidtopstatus = `Your bid of $${parseInt(
                    autobid
                  ).toUSFormat()} and auto bid of $${parseInt(
                    autobid1
                  ).toUSFormat()} on this item placed, but reserve price not yet met.`;
                }
              } else {
                if (parseInt(autobid) === parseInt(autobid1)) {
                  res.data.response.bidtopstatus = `You are winning this item at $${parseInt(
                    autobid1
                  ).toUSFormat()}.`;
                } else {
                  res.data.response.bidtopstatus = `You are winning this item at $${parseInt(
                    autobid
                  ).toUSFormat()}. Your autoBid of $${parseInt(
                    autobid1
                  ).toUSFormat()} has been placed successfully.`;
                }
              }
            }
          } else {
            if (res.data.response.bidtopstatus.includes("losing")) {
              res.data.response.bidtopstatus = `You've been outbid on this item. Current leading bid is $${parseInt(
                res.data.response.lotDetails.wprice
              ).toUSFormat()}`;
            } else if (
              res.data.response.bidtopstatus.includes("unfortunately,")
            ) {
              res.data.response.bidtopstatus = `unfortunately you lost this item`;
            } else if (res.data.response.bidtopstatus.includes("!")) {
              res.data.response.bidtopstatus = `Congratulations, you have bought this item for $${parseInt(
                res.data.response.lotDetails.wprice
              ).toUSFormat()}`;
            }
          }
        } else {
          if (res.data.response.bidtopstatus.includes("losing")) {
            res.data.response.bidtopstatus = `You've been outbid on this item. Current leading bid is $${parseInt(
              res.data.response.lotDetails.wprice
            ).toUSFormat()}`;
          }
        }
        dispatch({
          type: LOT_PRODUCT_DTLS,
          payload: res.data.response,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getAllBidHistory = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "consolebid", formData, "", ""),
      ]);
      const from = "liveLot";
      if (res.data.status === "success") {
        dispatch({
          type: GET_ALL_BID_HISTORY,
          payload: {
            records: res.data.response.bids.length
              ? res.data.response.bids
              : [],
            totalRecords: res.data.response.bids.length,
          },
        });
      } else if (res.data.status === "error") {
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

  const searchAllLots = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "searchLotAPI", formData, "", ""),
      ]);

      if (res.data && res.data.status === "success") {
        dispatch({
          type: ALL_LOTS,
          payload: res.data.response,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getAllLots = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "lotSearch", formData, "", ""),
      ]);

      if (res.data && res.data.status === "success") {
        dispatch({
          type: GET_ALL_LOTS,
          payload: res.data.response,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getDashboardMybids = async (formData, bidtype) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", bidtype, formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        dispatch({
          type: DASHBOARD_MYBIDS,
          payload: res.data.response,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const addWatchlist = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "watchlist", formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        return true;
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const removeWatchlist = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "removewatchlist", formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        return true;
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getSellerList = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "getsellername", formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        // console.log(res, "this is the responce from the get seller list");
        dispatch({
          type: GET_ALL_SELLERS,
          payload: res.data.response.results,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getAllInvoiceProducts = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "invoice", formData, "", ""),
      ]);
      const from = "search";
      if (res.data.status === "success") {
        dispatch({
          type: GET_SINGLE_INVOICE_DETAIL,
          payload: {
            record: res.data.response.results.length
              ? res.data.response.results
              : [],
            shipping_address: res.data.response.shipping_address,
          },
        });
      } else if (res.data.status === "error") {
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

  const getCheckoutAuction = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "getCheckoutAuction", formData, "", ""),
      ]);
      const from = "search";
      if (res.data.success) {
        dispatch({
          type: GET_AUCTION_CHECKOUT,
          payload: res.data.details,
        });
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

  const getSubscriptionList = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "/plugin/common/site/api/get-subscription-list",
          formData,
          "",
          ""
        ),
      ]);
      const from = "getSubscriptionList";
      if (res.data.status === "success") {
        dispatch({
          type: GET_SUBSCRIPTION_LIST,
          payload: res.data.data.message.available_subscription,
        });
      } else if (res.data.status === "error") {
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

  const availablePluginList = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "/plugin/common/site/api/available-plugin-list",
          formData,
          "",
          ""
        ),
      ]);
      const from = "availablePluginList";
      if (res.data.status === "success") {
        dispatch({
          type: AVAILABLE_PLUGIN_LIST,
          payload: res.data.data.message.available_plugin,
        });
      } else if (res.data.status === "error") {
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

  const userPluginCharge = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/common/site/api/create-user-plugin-charge",
          formData,
          "",
          ""
        ),
      ]);
      const from = "userPluginCharge";
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

  const userPluginChargeSub = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/common/site/api/create-user-plugin",
          formData,
          "",
          ""
        ),
      ]);
      const from = "userPluginCharge";
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

  const getbidderlocationdetails = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/getCityCnt",
          formData,
          "",
          ""
        ),
      ]);
      const from = "bidderlocationdetails";
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

  const getbiddercountdetails = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/getCardcnt",
          formData,
          "",
          ""
        ),
      ]);
      const from = "bidderlocationcountdetails";
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

  const getsellerexistingcard = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/getusercard",
          formData,
          "",
          ""
        ),
      ]);
      const from = "sellercarddetails_bidderdetails_page";
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

  const sellerMakePayment = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/campaignTrigger",
          formData,
          "",
          ""
        ),
      ]);
      const from = "makepayment_bidderdetails_page";
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
  const sellerMakePayment_new = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/campaignTriggerNew",
          formData,
          "",
          ""
        ),
      ]);
      const from = "makepayment_bidderdetails_page";
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
  const getStoreProducts = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/getStoreProducts",
          formData,
          "",
          ""
        ),
      ]);
      const from = "getStoreProducts";
      if (res.data.status === "success") {
        dispatch({
          type: GET_STORE_PRODUCTS,
          payload: res.data.data,
        });
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

  const getLots = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/getLots",
          formData,
          "",
          ""
        ),
      ]);
      const from = "getLots";
      if (res.data.status === "success") {
        dispatch({
          type: GET_MARKETING_LOTS,
          payload: res.data.data,
        });
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

  const getLotImages = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/getLotImages",
          formData,
          "",
          ""
        ),
      ]);
      const from = "getLotImages";
      if (res.data.status === "success") {
        dispatch({
          type: GET_LOT_IMAGES,
          payload: res.data.data,
        });
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

  const saveTemplate = async (formData) => {
    try {
      const from = "saveTemplate";
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/saveTemplate",
          formData,
          "",
          ""
        ),
      ]);
      if (typeof window !== "undefined") {
        if (res.data.status === "success") {
          localStorage.setItem("success", "true");
        } else {
          resp.commonErrorResponse(from);
        }
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getTemplates = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "plugin/marketing/campaign/email/getTemplates",
          formData,
          "",
          ""
        ),
      ]);
      const from = "getTemplates";
      if (res.data.status === "success") {
        dispatch({
          type: GET_TEMPLATES,
          payload: res.data.data,
        });
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

  const requestShipping = async (formData) => {
    const from = "requestShipping";
    try {
      const [res] = await Promise.all([
        apiCall(
          "post",
          "request-price",
          formData,
          "",
          "plugin/messages/communication/connect"
        ),
      ]);
      if (res.data.status === "success") {
        resp.commonResponse(
          {
            status: "success",
            message: "Shipping Fee Requested Successfully!",
          },
          from
        );
      } else {
        resp.commonResponse(
          { status: "error", message: res.data.message },
          from
        );
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const successAfterPayAuction = async (formData) => {
    const from = "successAfterPayAuction";
    try {
      formData["mode"] = process.env.NEXT_PUBLIC_PAYMENTMODE;
      formData["auction_io"] = 1;
      formData["city_sales_tax_enable"] = 0;
      const [res] = await Promise.all([
        apiCall("post", "successAfterPayAuction", formData, "", ""),
      ]);
      if (res.data.status === "yes") {
        resp.commonResponse(
          { status: "success", response: "Payment successful!" },
          from
        );
      } else {
        if (res.data.data?.error?.data?.message) {
          resp.commonResponse(
            { status: "error", response: res.data.data?.error?.data?.message },
            from
          );
        } else {
          resp.commonErrorResponse(from);
        }
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const successAfterPay = async (formData) => {
    const from = "successAfterPay";
    try {
      formData["mode"] = process.env.NEXT_PUBLIC_PAYMENTMODE;
      formData["auction_io"] = 1;
      // if (global.pluginConfiguration?.salestaxcity?.enable) {
      //   formData["city_sales_tax_enable"] = 1;
      // } else {
      //   formData["city_sales_tax_enable"] = 0;
      // }
      const [res] = await Promise.all([
        apiCall("post", "successAfterPay", formData, "", ""),
      ]);
      if (res.data.status === "yes") {
        resp.commonResponse(
          { status: "success", response: "Payment successful!" },
          from
        );
      } else {
        if (res.data.message) {
          resp.commonResponse(
            { status: "error", response: res.data.message },
            from
          );
        } else if (res.data.status == "no_records") {
          resp.commonResponse(
            {
              status: "error",
              response:
                "Buynow option has been disabled for this product by seller.",
            },
            from
          );
        } else {
          resp.commonErrorResponse(from);
        }
      }
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };
  const getStaticPage = async (formData, hide_else_msg = 0) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "show_static_content", formData),
      ]);
      if (res.data.status === "true") {
        dispatch({
          type: GET_STATIC_PAGE,
          payload: res.data.data[0],
          // payload: res.data.data.result
        });
      } else {
        if (!hide_else_msg) {
          dispatch({
            type: RESPONSE_STATUS,
            payload: res.data.message,
          });
        }
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };
  const clearResponse = () =>
    dispatch({
      type: CLEAR_RESPONSE,
    });
  return (
    <ProductContext.Provider
      value={{
        search_allbidhistory: state.search_allbidhistory,
        responseStatus: state.responseStatus,
        saved_searches: state.saved_searches,
        lot_details: state.lot_details,
        allLots: state.allLots,
        dashboardMyBids: state.dashboardMyBids,
        getAllSeller: state.getAllSeller,
        search_allinvoiceproducts: state.search_allinvoiceproducts,
        allLotsData: state.allLotsData,
        subscription_lists: state.subscription_lists,
        plugin_lists: state.plugin_lists,
        store_products: state.store_products,
        store_details: state.store_details,
        marketing_lots: state.marketing_lots,
        lot_images: state.lot_images,
        saved_templates: state.saved_templates,
        invoice_details: state.invoice_details,
        invoice_store_config: state.invoice_store_config,
        invoice_plugin_config: state.invoice_plugin_config,
        static_page: state.static_page,
        success: state.success,
        clearResponse,
        getStaticPage,
        successAfterPay,
        successAfterPayAuction,
        requestShipping,
        getAllBidHistory,
        addSavedSearch,
        getSavedSearch,
        removeSavedSearch,
        getIndividualProductLotDetails,
        searchAllLots,
        getDashboardMybids,
        addWatchlist,
        removeWatchlist,
        getSellerList,
        getAllInvoiceProducts,
        getAllLots,
        getSubscriptionList,
        availablePluginList,
        userPluginCharge,
        userPluginChargeSub,
        getbidderlocationdetails,
        getbiddercountdetails,
        getsellerexistingcard,
        sellerMakePayment,
        sellerMakePayment_new,
        getStoreProducts,
        getLots,
        getLotImages,
        saveTemplate,
        getTemplates,
        getCheckoutAuction,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductState;
