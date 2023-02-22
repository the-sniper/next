import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const QuickBook = (props) => {
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
            src="/assets/images/plugins/quickBook/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Quickbooks</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The Quickbooks Plugin Feature will be used in the Store Seller.
                QuickBooks is a accounting software to maintain your books
                efficiently. Adding your customer details to QuickBooks allows
                you to easily create and send a custom invoice to your
                customers. QuickBooks Plugin Feature allows you to generate
                reports and analyze their business payments and Bills.
              </p>
              <div className="mrDscrptnCntnr py-2">
                <h1>Why we Use Quickbooks Plugin:</h1>
                <p>
                  In Your Website place hundreds and thousands of transactions,
                  orders while managing Payments, Bills, refunds, cancelations,
                  taxes, etc. Managing all the Accounting of the website is a
                  challenging task. QuickBooks Plugin are Easiest solutions for
                  your Website.
                </p>
                <p>
                  Quickbooks Plugin enables you to quickly and easily set up an
                  store to sell all kinds of products and services, while
                  QuickBooks can help you keep track of your finances and stay
                  on top of your growth.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the Quickbooks Plugin
          </h1>
          <h5>
            You can On / Off the Quickbooks Plugin in your website using the
            Quickbooks plugin as Shown below .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/quickBook/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/quickBook/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/quickBook/step3.png"
            />
          </div>
          <h1 className="text-center my-5">Enable the Quickbooks Plugin</h1>
          <h5>
            Next Click Quickbooks In this if you click yes on enable then it
            will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/quickBook/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/quickBook/step5.png"
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

export default QuickBook;
