import {
    GET_ALL_CARD_DETAILS,
    GET_CARD_DETAILS,
    RESPONSE_STATUS,
    GET_ALL_PAYOUT_DETAILS,
    CLEAR_RESPONSE,
    GET_SKYFLOW_CARDS,
} from './cardTypes'

export default (state, action) => {
    switch (action.type) {
        case RESPONSE_STATUS:
            return {
                ...state,
                responseStatus: action.payload,
            }
        case GET_ALL_CARD_DETAILS:
            return {
                ...state,
                get_all_card_details: action.payload,
            }
        case GET_ALL_PAYOUT_DETAILS:
            return {
                ...state,
                get_all_payout_details: action.payload,
            }
        case GET_CARD_DETAILS:
            return {
                ...state,
                get_card_details: action.payload,
            }
        case GET_SKYFLOW_CARDS:
            return {
                ...state,
                get_skyflow_cards: action.payload,
            }
        case CLEAR_RESPONSE:
            return {
                ...state,
                responseStatus: '',
            }
        default:
            return state
    }
}
