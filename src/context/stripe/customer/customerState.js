import React, { useReducer } from 'react'
import axios from 'axios'
import CustomerContext from './customerContext'
import CustomerReducer from './customerReducer'
import { DirectAPICAll } from './../../../common/components'
import { apiCall } from '../../../common/api'
import { response } from '../../common'
import { GET_CUSTOMER_DETAILS, RESPONSE_STATUS, CLEAR_RESPONSE } from './customerTypes'

const StripeCustomerState = (props) => {
    const initialState = {
        customer_details: null,
        responseStatus: null,
    }
    const [state, dispatch] = useReducer(CustomerReducer, initialState)
    let resp = new response(dispatch, RESPONSE_STATUS)
    const createStripeCustomer = async (formData, noAlert) => {
        const from = 'create'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/create',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                from,
                noAlert,
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from, noAlert)
        }
    }

    const addCustomerProfile = async (formData, noAlert) => {
        const from = 'save_customer_id'
        try {
            const [res] = await Promise.all([
                apiCall('post', 'save_customer_id', formData, '', 'auctionpay'),
            ])
            resp.commonResponse(res.data, from, noAlert)
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from, noAlert)
        }
    }

    const getStripeCustomer = async (formData, noAlert) => {
        const from = 'retrieve'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/retrieve',
                formData,
            )
            if (res.data.status === 'success') {
                dispatch({
                    type: GET_CUSTOMER_DETAILS,
                    payload: res.data.data.responseData.record,
                })
            }
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }

    const updateStripeCustomer = async (formData, noAlert) => {
        const from = 'update'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/customer/update',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                from,
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }
    const createSellerCustomer = async (formData, noAlert) => {
        const from = 'sellercustomer'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/onboarding/createSellerAccount',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                from,
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }
    const CheckSellerCustomer = async (formData, noAlert) => {
        const from = 'checksellercustomer'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/onboarding/checkSellerAccount',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                from,
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }
    const Addpayoutsource = async (formData, noAlert) => {
        const from = 'add_payout_source'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_AUCTIONPAY_OTHER_URL + '/api/onboarding/addPayoutSource',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                from,
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }

    const CraeteBankCustomer = async (formData, noAlert) => {
        const from = 'add_bank_customer'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_BASE_URL + 'plugin/ach/stripe/customer/createCustomerDetails',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                from,
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }
    const BuyerAddBank = async (formData, noAlert) => {
        const from = 'add_bank_buyer'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_BASE_URL + 'plugin/ach/stripe/bank/createBankDetails',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                from,
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }
    const getBankDetails = async (formData, noAlert) => {
        const from = 'get_bank_buyer'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_BASE_URL + 'plugin/ach/stripe/bank/getBankDetails',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message.data.message
                        ? res.data.data.message.data.message
                        : '',
                    responseData: res.data.data.message.data.responseData,
                    responseType: res.data.data.message.data.responseType,
                },
                from,
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }
    const verifyBankdetails = async (formData, noAlert) => {
        const from = 'verify_bank_buyer'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_BASE_URL + 'plugin/ach/stripe/payment/verifyBankDetails',
                formData,
            )
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message,
                    responseData: res.data.data.responseData,
                    responseType: res.data.data.responseType,
                },
                from,
            )
        } catch (err) {
            console.log('errr', err)
            resp.commonErrorResponse(from)
        }
    }
    const transferamount = async (formData, noAlert) => {
        const from = 'transfer_amount_buyer'
        try {
            const res = await DirectAPICAll(
                'post',
                process.env.NEXT_PUBLIC_BASE_URL + 'plugin/ach/stripe/payment/createBankPay',
                formData,
            )
            // console.log('innnnnnnnnnnnnnnnnnnnn', res.data.data.message)
            resp.commonResponse(
                {
                    status: res.data.status,
                    message: res.data.data.message.data.message,
                    responseData: res.data.data.message.data.responseData,
                    responseType: res.data.data.message.data.responseType,
                },
                from,
            )
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
        <CustomerContext.Provider
            value={{
                responseStatus: state.responseStatus,
                customer_details: state.customer_details,
                updateStripeCustomer,
                createStripeCustomer,
                getStripeCustomer,
                addCustomerProfile,
                createSellerCustomer,
                CheckSellerCustomer,
                Addpayoutsource,
                CraeteBankCustomer,
                BuyerAddBank,
                getBankDetails,
                verifyBankdetails,
                transferamount,
                clearResponse,
            }}
        >
            {props.children}
        </CustomerContext.Provider>
    )
}

export default StripeCustomerState
