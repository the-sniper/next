import React, { useReducer } from "react";
import CommonContext from "./commonContext";
import CommonReducer from "./commonReducer";
import { apiCall } from "../../common/api";
import { response } from "../common";

import {
  COMMON_VALUES,
  BID_HISTORY_VALUE,
  US_STATE_VALUE,
  UPLOADED_IMAGE,
  CLEAR_SEARCH,
  GET_STATIC_PAGE,
  LOADERS,
  CLEAR_BID_HISTORY,
  TTWBID_HISTORY_VALUE,
  CLEAR_TTWBID_HISTORY,
  SEARCH_VALUE,
  CURRENCY_VALUE,
  GET_PREVIOUS_DATA,
  RESPONSE_STATUS,
  CLEAR_RESPONSE,
  All_COUNTRIES,
  SET_ALL_CATEGORIES,
  SET_ALL_SELLERS,
} from "./commonTypes";

const CommonState = (props) => {
  const initialState = {
    responseStatus: null,
    allCategory: [],
    allSellers: [],
    allLocations: [],
    allCondition: [],
    allDamageTypes: [],
    allPackageTypes: [],
    allBidIncrements: [],
    allBuyerPremium: [],
    allNotifications: [],
    searchValue: null,
    currencyValue:
      typeof window != "undefined" && localStorage.currency
        ? JSON.parse(localStorage.currency)
        : null,
    bidHistoryValue: 0,
    ttwBidHistoryValue: 0,
    configVariables: {},
    configFeatures: {},
    USStates: [],
    allCountries: [],
    uploadedFiles: [],
    static_page: {
      record: {},
    },
    previous_data: {
      records: [],
      totalRecords: 0,
    },
    isLoading: true,
  };

  const [state, dispatch] = useReducer(CommonReducer, initialState);
  let resp = new response(dispatch, RESPONSE_STATUS);

  const getAllCategories = async () => {
    const [res] = await Promise.all([
      apiCall("post", "categoryLevel", {}, "", ""),
    ]);

    if (res?.data?.status === "success") {
      dispatch({
        type: SET_ALL_CATEGORIES,
        payload: {
          allCategory: res.data.response.results,
        },
      });
    }
  };

  const getAllSellers = async () => {
    const [res] = await Promise.all([
      apiCall("post", "getsellername", {}, "", ""),
    ]);

    if (res?.data?.status === "success") {
      dispatch({
        type: SET_ALL_SELLERS,
        payload: {
          allSellers: res.data.response.results,
        },
      });
    }
  };

  const getStaticPage = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "getStaticPage", formData, "", "common"),
      ]);
      const from = "StaticPage";
      if (res.data.status === "success") {
        dispatch({
          type: GET_STATIC_PAGE,
          payload: {
            record: res.data.data.responseData.record
              ? res.data.data.responseData.record
              : {},
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

  const insertEntry = async (formData) => {
    const from = "insertEntry";
    try {
      const [res] = await Promise.all([
        apiCall("post", from, formData, "", "common"),
      ]);
      resp.commonResponse(res.data, from);
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const updateEntry = async (formData) => {
    const from = "updateEntry";
    try {
      const [res] = await Promise.all([
        apiCall("post", from, formData, "", "common"),
      ]);
      resp.commonResponse(res.data, from);
    } catch (err) {
      resp.commonErrorResponse(from);
    }
  };

  const getPreviousData = async (formData) => {
    try {
      const [res] = await Promise.all([
        apiCall("post", "getPreviousData", formData, "", "common"),
      ]);
      dispatch({
        type: GET_PREVIOUS_DATA,
        payload: {
          records: res.data.data.responseData.records.length
            ? res.data.data.responseData.records
            : [],
          totalRecords: res.data.data.responseData.totalRecords,
        },
      });
    } catch (err) {
      resp.commonErrorResponse("getPreviousData");
    }
  };

  const clearPreviousData = async () => {
    dispatch({
      type: GET_PREVIOUS_DATA,
      payload: {
        records: [],
        totalRecords: 0,
      },
    });
  };

  const setAllCountries = async (data) => {
    dispatch({
      type: All_COUNTRIES,
      payload: data,
    });
  };

  const setUSState = async (data) => {
    dispatch({
      type: US_STATE_VALUE,
      payload: data,
    });
  };

  const setSearchValue = async (data) => {
    dispatch({
      type: SEARCH_VALUE,
      payload: data,
    });
  };

  const setCurrencyValue = async (data) => {
    dispatch({
      type: CURRENCY_VALUE,
      payload: data,
    });
  };

  const setBidHistoryValue = async (data) => {
    dispatch({
      type: BID_HISTORY_VALUE,
      payload: data,
    });
  };

  const clearBidHistoryValue = () =>
    dispatch({
      type: CLEAR_BID_HISTORY,
    });

  const setTTWBidHistoryValue = async (data) => {
    dispatch({
      type: TTWBID_HISTORY_VALUE,
      payload: data,
    });
  };

  const clearTTWBidHistoryValue = () =>
    dispatch({
      type: CLEAR_TTWBID_HISTORY,
    });

  const clearSearchValue = () =>
    dispatch({
      type: CLEAR_SEARCH,
    });

  const uploadImage = async (formData, fromUpload) => {
    try {
      const from = "productchange";
      const [res] = await Promise.all([
        apiCall(
          "post",
          "muliple_img_uploader",
          formData,
          "",
          "commonFunction/image_uploader"
        ),
      ]);
      if (res.data.status === "success") {
        dispatch({
          type: UPLOADED_IMAGE,
          payload: {
            files: res.data.data.responseData.files,
            from: fromUpload,
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

  const resetDropZone = (fromUpload) => {
    dispatch({
      type: UPLOADED_IMAGE,
      payload: {
        files: [],
        from: fromUpload,
      },
    });
  };

  const loaderSet = (isLoad) => {
    dispatch({
      type: LOADERS,
      payload: isLoad,
    });
  };

  const clearResponse = () =>
    dispatch({
      type: CLEAR_RESPONSE,
    });
  return (
    <CommonContext.Provider
      value={{
        allCategory: state.allCategory,
        allSellers: state.allSellers,
        allLocations: state.allLocations,
        allCondition: state.allCondition,
        allDamageTypes: state.allDamageTypes,
        allPackageTypes: state.allPackageTypes,
        allNotifications: state.allNotifications,
        allBidIncrements: state.allBidIncrements,
        allBuyerPremium: state.allBuyerPremium,
        searchValue: state.searchValue,
        currencyValue: state.currencyValue,
        static_page: state.static_page,
        bidHistoryValue: state.bidHistoryValue,
        configVariables: state.configVariables,
        configFeatures: state.configFeatures,
        uploadedFiles: state.uploadedFiles,
        responseStatus: state.responseStatus,
        USStates: state.USStates,
        allCountries: state.allCountries,
        isLoading: state.isLoading,
        ttwBidHistoryValue: state.ttwBidHistoryValue,
        previous_data: state.previous_data,
        insertEntry,
        updateEntry,
        setTTWBidHistoryValue,
        clearTTWBidHistoryValue,
        uploadImage,
        getAllCategories,
        setSearchValue,
        setCurrencyValue,
        clearSearchValue,
        setBidHistoryValue,
        loaderSet,
        clearBidHistoryValue,
        getStaticPage,
        getPreviousData,
        clearPreviousData,
        setUSState,
        clearResponse,
        resetDropZone,
        setAllCountries,
        getAllSellers,
      }}
    >
      {props.children}
    </CommonContext.Provider>
  );
};

export default CommonState;
