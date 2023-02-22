import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const PaymentGateway = (props) => {
  const history = useHistory();
  return (
    <div>
      <div className="dscrptnContainer customContainer">
        <div className="tpMnCntnr d-flex pt-5">
          <Button
            className="bkButton mt-3 ml-4"
            onClick={() => history.goBack()}
          >
            <span class="material-icons-outlined mr-2">keyboard_backspace</span>
            Back
          </Button>
          <img
            className="mnPlgnImg"
            src="/assets/images/plugins/paymentGateway/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Payment Gateway</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The Payment gateway Plugin Feature will be used in the Store
                Seller. Paymentgateway is an online payment platform powered by
                stripe. It provides a simple and powerful way to send and
                receive the payments. Payment gateway simplified the payment
                process, accepting a wide variety of debit and credit payment
                methods, ACH, Wire, Contactless Payments.
              </p>
              <p>
                In simple terms, payment gateway is a network through which your
                customers transfer funds to you. When using a payment gateway,
                customers and businesses need to work together to make a
                transaction.
              </p>
              <p>
                Once your customer has placed an order, the payment gateway
                verifies the customer’s card details and checks if they have
                enough funds in their account to pay you.
              </p>
              <div className="mrDscrptnCntnr py-2">
                <h1>Why we Use Payment Gateway Plugin:</h1>
                <p>
                  Using a payment gateway is not just for transferring money, it
                  has other benefits as well. The most significant advantage of
                  a payment gateway is the fact that it allows millions of users
                  to use it at the same time, making it possible for you to
                  purchase or sell goods and services whenever you want.
                </p>
                <p>
                  White-Label Software: Some payment gateways allow you to make
                  digital transactions through mobile apps.This is the current
                  trend, as it enables the user to make all his/her transactions
                  by just sitting at one place.You can bring in your money from
                  the account balance to the mobile app and then further use it
                  to make payments on other apps or websites
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the Payment Gateway Plugin
          </h1>
          <h5>
            You can On / Off the Payment Gateway Plugin in your website using
            the Payment Gateway plugin as Shown below .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/paymentGateway/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/paymentGateway/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/paymentGateway/step3.png"
            />
          </div>
          <h1 className="text-center my-5">
            Enable the Payment Gateway Plugin
          </h1>
          <h5>
            Next Click Payment Gateway In this if you click yes on enable then
            it will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/paymentGateway/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/paymentGateway/step5.png"
            />
          </div>
        </div>
      </div>
      <div className="pyCntnr">
        <div className="customContainer d-flex align-items-center justify-content-between">
          <div className="lftInfo">
            <div className="lgCntnr">
              <img
                src={process.env.NEXT_PUBLIC_IMAGE_URL + props.pluginData?.image}
              />
            </div>
            <div className="prcCntr">
              <p>Price</p>
              <h2>
                <>
                  {currencyFormat(props.pluginData?.price)}/
                  {props.pluginData?.duration}
                </>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
