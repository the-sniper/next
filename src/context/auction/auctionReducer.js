import {
  RESPONSE_STATUS,
  CLEAR_RESPONSE,
  AUCTION_DETAILS,
  AUCTION_MSGS,
  GET_ALL_SEARCH_AUCTION,
  HOMEPAGE_CALENDAR_AUCTION,
  HOMEPAGE_FEATURED_AUCTION,
  HOMEPAGE_OTHER_AUCTION,
  HOMEPAGE_LIVE_AUCTION,
  HOMEPAGE_TIMED_AUCTION,
  HOMEPAGE_TOP_LOTS,
  ALL_LOTS,
  AUCTION_SELLER_DETAILS,
  AUCTIONPERCENTAGE,
} from "./auctionTypes";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch (action.type) {
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
    case AUCTION_DETAILS:
      return {
        ...state,
        auctiondetails: action.payload.auctionList,
        allauctionlots: action.payload.results,
        totalAuctionLots: action.payload.total_results,
        auctionRegistered: action.payload.isRegistered,
        auctionRegisteredList: action.payload.isRegistered_list,
      };
    case GET_ALL_SEARCH_AUCTION:
      return {
        ...state,
        search_allauctions: action.payload,
      };
    case AUCTION_MSGS:
      return {
        ...state,
        allmessages: action.payload,
      };
    case HOMEPAGE_CALENDAR_AUCTION:
      return {
        ...state,
        homePageCalendarAuction: action.payload,
      };
    case HOMEPAGE_FEATURED_AUCTION:
      return {
        ...state,
        homePageFeaturedAuction: action.payload,
      };
    case HOMEPAGE_LIVE_AUCTION:
      return {
        ...state,
        homePageLiveAuction: action.payload,
      };
    case HOMEPAGE_TIMED_AUCTION:
      return {
        ...state,
        homePageTimedAuction: action.payload,
      };
    case HOMEPAGE_OTHER_AUCTION:
      return {
        ...state,
        homePageOtherAuction: action.payload,
      };
    case HOMEPAGE_TOP_LOTS:
      return {
        ...state,
        homePageTopLots: action.payload,
      };
    case AUCTION_SELLER_DETAILS:
      return {
        ...state,
        auctionSellerDtls: action.payload.results[0],
      };

    case AUCTIONPERCENTAGE:
      return {
        ...state,
        auctionPercent: action.payload,
      };
    default:
      return state;
  }
};
