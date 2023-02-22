import {
  COMMON_VALUES,
  US_STATE_VALUE,
  UPLOADED_IMAGE,
  BID_HISTORY_VALUE,
  CLEAR_BID_HISTORY,
  TTWBID_HISTORY_VALUE,
  CLEAR_TTWBID_HISTORY,
  LOADERS,
  CLEAR_SEARCH,
  SEARCH_VALUE,
  CURRENCY_VALUE,
  GET_STATIC_PAGE,
  GET_PREVIOUS_DATA,
  RESPONSE_STATUS,
  CLEAR_RESPONSE,
  All_COUNTRIES,
  SET_ALL_CATEGORIES,
  SET_ALL_SELLERS,
} from "./commonTypes";

export default (state, action) => {
  switch (action.type) {
    case RESPONSE_STATUS:
      return {
        ...state,
        responseStatus: action.payload,
      };
    case GET_PREVIOUS_DATA:
      return {
        ...state,
        previous_data: action.payload,
      };
    case COMMON_VALUES:
      return {
        ...state,
        allNotifications: action.payload.allNotifications,
        allLocations: action.payload.allLocations,
        allCondition: action.payload.allCondition,
        allDamageTypes: action.payload.allDamageTypes,
        allPackageTypes: action.payload.allPackageTypes,
        allBidIncrements: action.payload.allBidIncrements,
        allBuyerPremium: action.payload.allBuyerPremium,
        bidIncrementDefault: action.payload.bidIncrementDefault,
        configVariables: action.payload.configVariables,
        configFeatures: action.payload.configFeatures,
      };
    case SET_ALL_CATEGORIES:
      return {
        ...state,
        allCategory: action.payload.allCategory,
      };
    case SET_ALL_SELLERS:
      return {
        ...state,
        allSellers: action.payload.allSellers,
      };
    case TTWBID_HISTORY_VALUE:
      return {
        ...state,
        ttwBidHistoryValue: action.payload,
      };
    case CLEAR_TTWBID_HISTORY:
      return {
        ...state,
        ttwBidHistoryValue: 0,
      };
    case SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.payload,
      };
    case CURRENCY_VALUE:
      return {
        ...state,
        currencyValue: action.payload,
      };

    case BID_HISTORY_VALUE:
      return {
        ...state,
        bidHistoryValue: action.payload,
      };
    case CLEAR_BID_HISTORY:
      return {
        ...state,
        bidHistoryValue: 0,
      };
    case GET_STATIC_PAGE:
      return {
        ...state,
        static_page: action.payload,
      };
    case All_COUNTRIES:
      return {
        ...state,
        allCountries: action.payload,
      };
    case US_STATE_VALUE:
      return {
        ...state,
        USStates: action.payload,
      };
    case LOADERS:
      return {
        ...state,
        isLoading: action.payload,
      };
    case UPLOADED_IMAGE:
      return {
        ...state,
        uploadedFiles: action.payload,
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        searchValue: null,
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
