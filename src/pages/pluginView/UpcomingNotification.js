import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const UpcomingNotification = (props) => {
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
            src="/assets/images/plugins/upcoming/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Upcoming Auctions Notification</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The Upcoming Auction Feature will be used in the Store Seller.
                Upcoming Auction is an amazing feature of your website. While
                adding an auction to a product, if you don’t want the auction to
                get started in the run time then, you can set a future date on
                the auction product. Now, the auction will be started running
                automatically on the future date.In case you are setting up a
                future date on your auction product then, the products will be
                listed in the “upcoming auctions” on your store.
              </p>
              <h3 className="mt-5 mb-3">Upcoming Auction :</h3>
              <p>
                Add upcoming auctions to your store and let the buyers make up
                their mind to bid on the items. Buyers will have the time to
                examine the price on which he/she wants to buy the auction
                product.
              </p>
              <p>
                Allow your buyers to analyze the competitive environment before
                the bidding starts.
              </p>
              <p>
                Share the upcoming auction listing page of your store on Email
                to notify the visitors if the bidding on the items is about to
                start.
              </p>
              <p>
                In this Plugin, you can enable the upcoming auctions on your
                store. You can follow these simple steps to enable the Plugin
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the Upcoming Auction Plugin
          </h1>
          <h5>
            You can On / Off the Plugin in your website using the Upcoming
            Auction plugin Feature as Shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/upcoming/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/upcoming/step2.png"
            />
          </div>
          <h5>
            After Active the Plugin ,It will be Show in the My Plugin section as
            shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/upcoming/step3.png"
            />
          </div>
          <h1 className="text-center my-5">
            Enable the Upcoming Auction Plugin
          </h1>
          <h5>
            Next Click Upcoming Auction Plugin. In this if you click yes on
            enable then it will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/upcoming/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/upcoming/step5.png"
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

export default UpcomingNotification;
