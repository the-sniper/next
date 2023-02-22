import {
    GET_ALL_BANK_DETAILS,
    GET_BANK_DETAILS,
    RESPONSE_STATUS,
    CLEAR_RESPONSE,
} from './bankTypes'

export default (state, action) => {
    switch (action.type) {
        case RESPONSE_STATUS:
            return {
                ...state,
                responseStatus: action.payload,
            }
        case GET_ALL_BANK_DETAILS:
            return {
                ...state,
                get_all_bank_details: action.payload,
            }
        case GET_BANK_DETAILS:
            return {
                ...state,
                get_bank_details: action.payload,
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
