import React, { useReducer } from 'react'
import AuctionPayContext from './auctionPayContext'
import AuctionPayReducer from './auctionPayReducer'
import { apiCall } from '../../../common/api'
import { response } from '../../common'
import { RESPONSE_STATUS, CLEAR_RESPONSE } from './auctionPayTypes'

const AuctionPayState = (props) => {
    const initialState = {
        responseStatus: null,
    }
    const [state, dispatch] = useReducer(AuctionPayReducer, initialState)
    let resp = new response(dispatch, RESPONSE_STATUS)

    const sellerOnboard = async (formData) => {
        formData.store_user_id = global.storeDetails.user_id
        const from = 'seller_onboard'
        try {
            const [res] = await Promise.all([
                apiCall('post', 'seller_onboard', formData, '', 'auctionpay'),
            ])
            if (res.data.success) {
                resp.commonResponse({ status: 'success', message: res.data.message }, from)
            } else {
                if (res.data.message) {
                    resp.commonResponse({ status: 'error', message: res.data.message }, from)
                } else {
                    resp.commonErrorResponse(from)
                }
            }
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }

    const clearResponse = () =>
        dispatch({
            type: CLEAR_RESPONSE,
        })

    return (
        <AuctionPayContext.Provider
            value={{
                responseStatus: state.responseStatus,
                sellerOnboard,
                clearResponse,
            }}
        >
            {props.children}
        </AuctionPayContext.Provider>
    )
}

export default AuctionPayState
