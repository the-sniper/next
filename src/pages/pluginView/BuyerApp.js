import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const BuyerApp = (props) => {
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
            src="/assets/images/plugins/buyerApp/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              {props.p_type === "android_buyer_app" ? (
                <h2>Android Buyer App</h2>
              ) : props.p_type === "ios_buyer_app" ? (
                <h2>iOs Buyer App</h2>
              ) : (
                ""
              )}
            </div>
            <div className="shrDsctpn">
              <p>
                The Android / IOS Buyer App Plugin Feature will be used in the
                Store Seller. Using the Android / IOS Buyer App is free. Buyer’s
                pay only when they win an Auction or Buy a Product. This App has
                location-based listing search also it can communicate better
                through Users can receive messages about upcoming deals, events
                and so on.
              </p>
              <p>
                Some people prefer mobile apps over websites for reading. This
                Feature bring in more engagement and views on your content. You
                can also be sure of higher reach and better branding.
              </p>
            </div>
            <div>
              <p>
                Use our Android / IOS Buyer App plugin to get an app for your
                mobile-loving readers. Attract more traffic and increase the
                popularity of your Site.
              </p>
              <p>All you need to do is follow some simple steps below.</p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active or Deactive the Android/IOS Buyer App Plugin
          </h1>
          <h5>
            You can On or Off the Android / IOS Buyer app Plugin in your website
            using the Android / IOS Buyer app plugin as Shown below .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/buyerApp/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/buyerApp/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/buyerApp/step3.png"
            />
          </div>
          <h1 className="text-center my-5">
            Enable the Android / IOS Buyer app Plugin
          </h1>
          <h5>
            Next Click Android / IOS Buyer app In this if you click yes on
            enable then it will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/buyerApp/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/buyerApp/step5.png"
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

export default BuyerApp;
