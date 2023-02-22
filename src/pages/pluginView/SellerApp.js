import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const SellerApp = (props) => {
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
            src="/assets/images/plugins/sellerApp/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              {props.p_type === "android_seller_app" ? (
                <h2>Android Seller App</h2>
              ) : props.p_type === "ios_seller_app" ? (
                <h2>iOs Seller App</h2>
              ) : (
                ""
              )}
            </div>
            <div className="shrDsctpn">
              <p>
                The Android / IOS Seller App Plugin Feature will be used in the
                Store Seller. To Use this Plugin the seller can manage the
                orders with the help of the Android / IOS Seller App. This will
                save there time and enhances the interaction of customer and
                seller with the store.
              </p>
              <p>
                Using this plugin, the seller can view and edit his profile
                information. He can view his product list and search, edit or
                delete products from it. The seller can view his transactions
                and Invoices in his dashboard. He can view his order history for
                all the orders, change his password and you can sell many types
                of items (clothing, electronics, toys, memorabilia, health
                products, art, and more) to both local and international buyers.
              </p>
            </div>
            <div>
              <p>
                Some people prefer mobile apps over websites for reading. Use
                our Android / IOS Seller App plugin to get an app for your
                mobile-loving readers. Attract more traffic and increase the
                popularity of your Site.
              </p>
              <p>All you need to do is follow some simple steps below.</p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active or Deactive the Android/IOS Seller App Plugin
          </h1>
          <h5>
            You can On or Off the Android / IOS Seller app Plugin in your
            website using the Android / IOS Seller app plugin as Shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/sellerApp/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/sellerApp/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/sellerApp/step3.png"
            />
          </div>
          <h1 className="text-center my-5">
            Enable the Android / IOS Seller app Plugin
          </h1>
          <h5>
            Next Click Android / IOS Seller app. In this if you click yes on
            enable then it will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/sellerApp/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/sellerApp/step5.png"
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

export default SellerApp;
