import React, { useReducer } from 'react'
import axios from 'axios'
import CardContext from './cardContext'
import CardReducer from './cardReducer'
import { response } from '../../common'
import { DirectAPICAll } from './../../../common/components'

import {
    GET_ALL_CARD_DETAILS,
    GET_SKYFLOW_CARDS,
    GET_CARD_DETAILS,
    RESPONSE_STATUS,
    GET_ALL_PAYOUT_DETAILS,
    CLEAR_RESPONSE,
} from './cardTypes'

const StripeCardState = (props) => {
    const initialState = {
        get_all_card_details: null,
        get_skyflow_cards: null,
        get_card_details: null,
        get_all_payout_details: null,
        responseStatus: null,
    }
    const [state, dispatch] = useReducer(CardReducer, initialState)
    let resp = new response(dispatch, RESPONSE_STATUS)
    const createStripeCard = async (formData) => {
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
                'card_source_create',
            )
        } catch (err) {
            resp.commonErrorResponse('card_source_create')
        }
    }
    const createStripeCardWithCustomer = async (formData) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/create',

                formData,
            )
            console.log(res)
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                'card_source_create_customer_card',
            )
        } catch (err) {
            resp.commonErrorResponse('card_source_create_customer_card')
        }
    }
    const getAllStripeCards = async (data) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/source/list',
                data,
            )
            console.log(res, 'res of ext')
            if (res.data.status === 'success') {
                dispatch({
                    type: GET_ALL_CARD_DETAILS,
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
                    'card_source_list',
                )
            }
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('card_source_list')
        }
    }
    const getSingleStripeCard = async (data) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/source/retrieve',

                data,
            )
            if (res.data.status === 'success') {
                dispatch({
                    type: GET_CARD_DETAILS,
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
                    'card_details_response',
                )
            }
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('card_details_response')
        }
    }
    const updateStripeCard = async (data) => {
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
                'card_source_update',
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('card_source_update')
        }
    }
    const deleteStripeCard = async (data) => {
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
                'card_source_delete',
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('card_source_delete')
        }
    }

    const chargeCustomerStripeCard = async (data) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/charge/create',
                data,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                'charge_customer',
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('charge_customer')
        }
    }

    const get_all_seller_payouts = async (data) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/retrieve/payouts',
                data,
            )
            console.log(res, 'res of ext')
            if (res.data.status === 'success') {
                dispatch({
                    type: GET_ALL_PAYOUT_DETAILS,
                    payload: {
                        records: res.data.data.responseData.records.length
                            ? res.data.data.responseData.records
                            : [],
                        has_more: res.data.data.responseData.hasMore,
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
                    'payout_source_list',
                )
            }
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse('payout_source_list')
        }
    }

    const addSkyflowCard = async (formData) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_BASE_URL + 'auctionpay/addSkyflowCard',
                formData,
            )

            if (res.data.success) {
                resp.commonResponse(
                    {
                        status: 'success',
                        message: 'Card added successfully',
                    },
                    'skyflow_add',
                )
            } else {
                resp.commonResponse(
                    {
                        status: 'error',
                        message: res.data.message,
                    },
                    'skyflow_add',
                )
            }
        } catch (err) {
            resp.commonErrorResponse('skyflow_add')
        }
    }

    const getSkyflowCards = async () => {
        try {
            const res = await DirectAPICAll(
                'get',
                process.env.NEXT_PUBLIC_BASE_URL + 'auctionpay/getSkyflowCards',
            )

            console.log('GET', res.data)
            if (res.data.success) {
                dispatch({
                    type: GET_SKYFLOW_CARDS,
                    payload: res.data.cards,
                })
            } else {
                resp.commonResponse(
                    {
                        status: 'error',
                        message: res.data.message,
                    },
                    'skyflow_get',
                )
            }
        } catch (err) {
            resp.commonErrorResponse('skyflow_get')
        }
    }

    const deleteSkyflowCard = async (formData) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_BASE_URL + 'auctionpay/deleteSkyflowCard',
                formData,
            )

            if (res.data.success) {
                resp.commonResponse(
                    {
                        status: 'success',
                        message: res.data.message,
                    },
                    'skyflow_delete',
                )
            } else {
                resp.commonResponse(
                    {
                        status: 'error',
                        message: res.data.message,
                    },
                    'skyflow_delete',
                )
            }
        } catch (err) {
            resp.commonErrorResponse('skyflow_delete')
        }
    }

    const updateSkyflowCard = async (formData) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_BASE_URL + 'auctionpay/updateSkyflowCard',
                formData,
            )

            if (res.data.success) {
                resp.commonResponse(
                    {
                        status: 'success',
                        message: res.data.message,
                    },
                    'skyflow_update',
                )
            } else {
                resp.commonResponse(
                    {
                        status: 'error',
                        message: res.data.message,
                    },
                    'skyflow_update',
                )
            }
        } catch (err) {
            resp.commonErrorResponse('skyflow_update')
        }
    }

    const setDefaultSkyflowCard = async (formData) => {
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_BASE_URL + 'auctionpay/setDefaultSkyflowCard',
                formData,
            )

            if (res.data.success) {
                resp.commonResponse(
                    {
                        status: 'success',
                        message: res.data.message,
                    },
                    'skyflow_default',
                )
            } else {
                resp.commonResponse(
                    {
                        status: 'error',
                        message: res.data.message,
                    },
                    'skyflow_default',
                )
            }
        } catch (err) {
            resp.commonErrorResponse('skyflow_default')
        }
    }

    const clearResponse = () =>
        dispatch({
            type: CLEAR_RESPONSE,
        })

    return (
        <CardContext.Provider
            value={{
                responseStatus: state.responseStatus,
                get_all_card_details: state.get_all_card_details,
                get_card_details: state.get_card_details,
                get_all_payout_details: state.get_all_payout_details,
                get_skyflow_cards: state.get_skyflow_cards,
                createStripeCard,
                createStripeCardWithCustomer,
                getAllStripeCards,
                getSingleStripeCard,
                updateStripeCard,
                deleteStripeCard,
                addSkyflowCard,
                getSkyflowCards,
                deleteSkyflowCard,
                updateSkyflowCard,
                setDefaultSkyflowCard,
                clearResponse,
                chargeCustomerStripeCard,
                get_all_seller_payouts,
            }}
        >
            {props.children}
        </CardContext.Provider>
    )
}

export default StripeCardState
