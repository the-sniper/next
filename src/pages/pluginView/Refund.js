import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const Refund = (props) => {
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
            src="/assets/images/plugins/refund/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Refund</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                Refund Plugin Feature will be used in the store seller. If you
                change your mind after placing an order, within the same day of
                order placed you can request a cancellation. Any refunds will be
                credited back to you using your original payment method, e.g.
                PayPal, online credit or credit card. 
              </p>
              <h3 className="mt-5 mb-3">Refund :</h3>
              <p>
                After the order is delivered, if customers want to return a
                product and intend to seek a full refund of the price they paid
                while placing an order is known as a refund. The refund plugin
                grants security and protects your customers from losing their
                money on a malfunctioned product. First of all, it makes the
                customers feel reassured when buying a product, whether it’s
                online or in the physical world. So, when you remove the fear of
                losing money in customers, they will not hesitate to purchase
                services or products from your shop.
              </p>
              <p>
                And second, the Refund Plugin can help you to massively increase
                the conversion rate of your sales. This refund plugin feature to
                help you improve the communication between you and the buyers.
              </p>
              <p>All you need to do is follow some simple steps below</p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Scenario 1: Active/ Deactive the Refund Plugin
          </h1>
          <h5>
            You can On / Off the Plugin in your website using the Refund plugin
            Feature as Shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/refund/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/refund/step2.png"
            />
          </div>
          <h5>
            After activating the Plugin ,It will be shown in the "My Plugin"
            section as shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/refund/step3.png"
            />
          </div>
          <h1 className="text-center my-5">
            Scenario 2 :Enable the Refund Plugin{" "}
          </h1>
          <h5>
            Next Click Refund Plugin. In this if you click yes on enable then it
            will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/refund/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/refund/step5.png"
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

export default Refund;
