import { GET_CUSTOMER_DETAILS, RESPONSE_STATUS, CLEAR_RESPONSE } from './customerTypes'

export default (state, action) => {
    switch (action.type) {
        case RESPONSE_STATUS:
            return {
                ...state,
                responseStatus: action.payload,
            }
        case CLEAR_RESPONSE:
            return {
                ...state,
                responseStatus: '',
            }
        case GET_CUSTOMER_DETAILS:
            return {
                ...state,
                customer_details: action.payload,
            }
        default:
            return state
    }
}
