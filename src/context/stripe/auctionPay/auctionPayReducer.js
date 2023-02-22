import { RESPONSE_STATUS, CLEAR_RESPONSE } from './auctionPayTypes'

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
        default:
            return state
    }
}
