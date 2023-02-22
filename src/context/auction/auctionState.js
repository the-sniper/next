import React, { useReducer } from "react";
import AuctionContext from "./auctionContext";
import AuctionReducer from "./auctionReducer";
import { apiCall } from "../../common/api";
import { response } from "../common";

import {
  RESPONSE_STATUS,
  CLEAR_RESPONSE,
  AUCTION_DETAILS,
  AUCTION_MSGS,
  GET_ALL_SEARCH_AUCTION,
  HOMEPAGE_CALENDAR_AUCTION,
  HOMEPAGE_FEATURED_AUCTION,
  HOMEPAGE_LIVE_AUCTION,
  HOMEPAGE_TOP_LOTS,
  HOMEPAGE_OTHER_AUCTION,
  HOMEPAGE_TIMED_AUCTION,
  AUCTION_SELLER_DETAILS,
  AUCTIONPERCENTAGE,
} from "./auctionTypes";

const AuctionState = (props) => {
  const initialState = {
    allauctionlots: [],
    auctiondetails: {},
    auctionRegistered: 0,
    totalAuctionLots: 0,
    search_allauctions: {
      records: [],
      totalRecords: 0,
      setDisp: "",
      sorts: {},
    },
    allsearch_auction: [],
    responseStatus: null,
    homePageCalendarAuction: [],
    homePageFeaturedAuction: [],
    homePageLiveAuction: [],
    homePageTimedAuction: [],
    homePageOtherAuction: [],
    homePageTopLots: null,
    allLots: [],
    auctionSellerDtls: {},
    auctionRegisteredList: [],
    auctionPercent: {},
  };

  const [state, dispatch] = useReducer(AuctionReducer, initialState);
  let resp = new response(dispatch, RESPONSE_STATUS);

  const getAllSearchAuction = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "searchAPI", formData, "", ""),
      ]);
      const from = "search";
      if (res.data.status === "success") {
        dispatch({
          type: GET_ALL_SEARCH_AUCTION,
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

  const getAuctionDetails = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "auctionLotAPI", formData, "", ""),
      ]);
      const from = "liveLot";
      if (res.data.status === "success") {
        dispatch({
          type: AUCTION_DETAILS,
          payload: res.data.response ? res.data.response : {},
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

  const getAllAuctionMessages = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "auctionmsg", formData, "", ""),
      ]);
      const from = "auction_msg";
      if (res.data.status === "success") {
        dispatch({
          type: AUCTION_MSGS,
          payload: res.data.response.allmsg.length
            ? res.data.response.allmsg
            : [],
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

  const bidOffer = async (formData) => {
    try {
      formData.is_auctionio = 1;
      const [res] = await Promise.all([
        apiCall("post", "addbidoffer", formData, "", ""),
      ]);
      // console.log(res, "this is the responce from the bid offer");
      if (res.data && res.data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };
  const bidLive = async (formData) => {
    try {
      formData.is_auctionio = 1;
      const [res] = await Promise.all([
        apiCall("post", "api_bidding/biddingAPI", formData, "", ""),
      ]);
      // console.log(res, "this is the responce from the bid live");
      if (res.data === "ok") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const registerForAuction = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "auctionreg", formData, "", ""),
      ]);
      if (res.data && res.data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getAllCalendarAuction = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "get_calendar_auction", formData, "", ""),
      ]);

      if (res.data && res.data.status === "success") {
        // console.log(
        //   res.data.data,
        //   "this is the responce from the get all calendar auction"
        // );
        dispatch({
          type: HOMEPAGE_CALENDAR_AUCTION,
          payload: res.data.data,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getAllFeatureAuction = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "get_featured_auction", formData, "", ""),
      ]);

      if (res.data && res.data.status === "success") {
        // console.log(
        //   res.data.data,
        //   "this is the responce from the get all calendar auction"
        // );
        dispatch({
          type: HOMEPAGE_FEATURED_AUCTION,
          payload: res.data.data,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getAllLiveAuction = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "get_live_auction", formData, "", ""),
      ]);

      if (res.data && res.data.status === "success") {
        // console.log(
        //   res.data.data,
        //   "this is the responce from the get all live auction"
        // );
        dispatch({
          type: HOMEPAGE_LIVE_AUCTION,
          payload: res.data.data,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getAllTopLots = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "topauctions", formData, "", ""),
      ]);

      if (res.data && res.data.status === "success") {
        // console.log(
        //   res.data.response,
        //   "this is the responce from the get all live auction"
        // );
        dispatch({
          type: HOMEPAGE_TOP_LOTS,
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

  const getAllTimedAuction = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "get_timed_auction", formData, "", ""),
      ]);

      if (res.data && res.data.status === "success") {
        // console.log(
        //   res.data.data,
        //   "this is the responce from the get all timed auction"
        // );
        dispatch({
          type: HOMEPAGE_TIMED_AUCTION,
          payload: res.data.data,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getAllOtherAuction = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "get_other_auction", formData, "", ""),
      ]);

      if (res.data && res.data.status === "success") {
        // console.log(
        //   res.data.data,
        //   "this is the responce from the get all calendar auction"
        // );
        dispatch({
          type: HOMEPAGE_OTHER_AUCTION,
          payload: res.data.data,
        });
      }
    } catch (err) {
      dispatch({
        type: RESPONSE_STATUS,
        payload: "Something went wrong!",
      });
    }
  };

  const getSellerInfo = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "getratingwithuserlist", formData, "", ""),
      ]);
      // console.log(res, "this is eller info");
      if (res.data && res.data.status === "success") {
        // console.log(
        //   res.data.data,
        //   "this is the responce from the get all calendar auction"
        // );
        dispatch({
          type: AUCTION_SELLER_DETAILS,
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

  const auctionPercentage = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "getliveauctionpercentage", formData, "", ""),
      ]);
      // console.log("auctionpercentage details------>", res);
      if (res.data && res.data.status === "success") {
        dispatch({
          type: AUCTIONPERCENTAGE,
          payload: res.data.data,
        });
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
    <AuctionContext.Provider
      value={{
        responseStatus: state.responseStatus,
        allauctionlots: state.allauctionlots,
        auctiondetails: state.auctiondetails,
        totalAuctionLots: state.totalAuctionLots,
        auctionRegistered: state.auctionRegistered,
        auctionRegisteredList: state.auctionRegisteredList,
        allmessages: state.allmessages,
        search_allauctions: state.search_allauctions,
        homePageCalendarAuction: state.homePageCalendarAuction,
        homePageOtherAuction: state.homePageOtherAuction,
        homePageFeaturedAuction: state.homePageFeaturedAuction,
        homePageTopLots: state.homePageTopLots,
        homePageLiveAuction: state.homePageLiveAuction,
        homePageTimedAuction: state.homePageTimedAuction,
        auctionSellerDtls: state.auctionSellerDtls,
        auctionPercent: state.auctionPercent,
        clearResponse,
        getAuctionDetails,
        getAllAuctionMessages,
        getAllSearchAuction,
        bidOffer,
        registerForAuction,
        getAllCalendarAuction,
        getAllFeatureAuction,
        getAllLiveAuction,
        getAllTimedAuction,
        getAllOtherAuction,
        getAllTopLots,
        getSellerInfo,
        bidLive,
        auctionPercentage,
      }}
    >
      {props.children}
    </AuctionContext.Provider>
  );
};

export default AuctionState;
