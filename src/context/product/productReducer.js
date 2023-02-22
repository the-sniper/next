import {
  RESPONSE_STATUS,
  GET_ALL_BID_HISTORY,
  CLEAR_RESPONSE,
  GET_SAVED_SEARCHES,
  LOT_PRODUCT_DTLS,
  ALL_LOTS,
  GET_ALL_SELLERS,
  DASHBOARD_MYBIDS,
  GET_SINGLE_INVOICE_DETAIL,
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

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch (action.type) {
    case RESPONSE_STATUS:
      return {
        ...state,
        responseStatus: action.payload,
      };
    case GET_ALL_BID_HISTORY:
      return {
        ...state,
        search_allbidhistory: action.payload,
      };
    case CLEAR_RESPONSE:
      return {
        ...state,
        responseStatus: "",
      };
    case GET_SAVED_SEARCHES:
      return {
        ...state,
        saved_searches: action.payload,
      };
    case LOT_PRODUCT_DTLS: {
      return {
        ...state,
        lot_details: action.payload,
      };
    }
    case ALL_LOTS:
      return {
        ...state,
        allLots: action.payload,
      };
    case DASHBOARD_MYBIDS:
      return {
        ...state,
        dashboardMyBids: action.payload,
      };
    case GET_SINGLE_INVOICE_DETAIL:
      return {
        ...state,
        search_allinvoiceproducts: action.payload,
      };
    case GET_ALL_SELLERS:
      return {
        ...state,
        getAllSeller: action.payload,
      };
    case GET_ALL_LOTS:
      return {
        ...state,
        allLotsData: action.payload,
      };
    case GET_SUBSCRIPTION_LIST:
      return {
        ...state,
        subscription_lists: action.payload,
      };
    case AVAILABLE_PLUGIN_LIST:
      return {
        ...state,
        plugin_lists: action.payload,
      };
    case GET_STORE_PRODUCTS:
      return {
        ...state,
        store_products: action.payload.result,
        store_details: action.payload.store,
      };
    case GET_MARKETING_LOTS:
      return {
        ...state,
        marketing_lots: action.payload.result,
      };
    case GET_LOT_IMAGES:
      return {
        ...state,
        lot_images: action.payload.result,
      };
    case GET_TEMPLATES:
      return {
        ...state,
        saved_templates: action.payload.result,
      };
    case GET_AUCTION_CHECKOUT:
      return {
        ...state,
        invoice_details: action.payload.data,
        invoice_store_config: action.payload.store_config,
        invoice_plugin_config: action.payload.plugin_config,
      };
    case GET_STATIC_PAGE:
      return {
        ...state,
        static_page: action.payload,
      };
    case SUCCESS:
      return {
        ...state,
        success: action.payload,
      };
    default:
      return state;
  }
};
