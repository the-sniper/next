import React, { useReducer } from 'react'
import axios from 'axios'
import bankContext from './bankContext'
import BankReducer from './bankReducer'
import { response } from '../../common'
import { DirectAPICAll } from './../../../common/components'

import {
    GET_ALL_BANK_DETAILS,
    GET_BANK_DETAILS,
    RESPONSE_STATUS,
    CLEAR_RESPONSE,
} from './bankTypes'

const StripeBankState = (props) => {
    const initialState = {
        get_all_bank_details: null,
        get_bank_details: null,
        responseStatus: null,
    }
    const [state, dispatch] = useReducer(BankReducer, initialState)
    let resp = new response(dispatch, RESPONSE_STATUS)
    const createStripeBank = async (formData) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/source/create',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                'bank_source_create',
            )
        } catch (err) {
            console.log('errr bank_details_response', err)
            resp.commonErrorResponse('bank_source_create')
        }
    }
    const getAllStripeBanks = async (data) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/source/list',
                data,
            )
            if (res.data.status === 'success') {
                dispatch({
                    type: GET_ALL_BANK_DETAILS,
                    payload: {
                        records: res.data.data.responseData.data.length
                            ? res.data.data.responseData.data
                            : [],
                        has_more: res.data.data.responseData.has_more,
                    },
                })
            } else {
                resp.commonResponse(
                    {
                        status: res.data.status,
                        message: res.data.data.message,
                        responseData: res.data.data.responseData,
                        responseType: res.data.data.responseType,
                    },
                    'bank_source_list',
                )
            }
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('bank_source_list')
        }
    }

    const getSingleStripeBank = async (data) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/source/retrieve',
                data,
            )
            if (res.data.status === 'success') {
                dispatch({
                    type: GET_BANK_DETAILS,
                    payload: {
                        record: res.data.data.responseData,
                    },
                })
            } else {
                resp.commonResponse(
                    {
                        status: res.data.status,
                        message: res.data.data.message,
                        responseData: res.data.data.responseData,
                        responseType: res.data.data.responseType,
                    },
                    'bank_details_response',
                )
            }
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('bank_details_response')
        }
    }
    const updateStripeBank = async (data) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/source/update',
                data,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                'bank_source_update',
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('bank_source_update')
        }
    }

    const verifyStripeBank = async (data) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/source/verify',
                data,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                'bank_source_update',
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('bank_source_update')
        }
    }

    const deleteStripeBank = async (data) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/source/delete',
                data,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                'bank_source_delete',
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('bank_source_delete')
        }
    }

    const clearResponse = () =>
        dispatch({
            type: CLEAR_RESPONSE,
        })

    return (
        <bankContext.Provider
            value={{
                responseStatus: state.responseStatus,
                get_all_bank_details: state.get_all_bank_details,
                get_bank_details: state.get_bank_details,
                createStripeBank,
                getAllStripeBanks,
                getSingleStripeBank,
                updateStripeBank,
                deleteStripeBank,
                verifyStripeBank,
                clearResponse,
            }}
        >
            {props.children}
        </bankContext.Provider>
    )
}

export default StripeBankState
