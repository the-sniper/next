import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const ReverseAuction = (props) => {
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
            src="/assets/images/plugins/reverse/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Reverse Auction</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The Reverse Auction Feature will be used in the Store Seller. A
                reverse auction is defined as an auction where the traditional
                roles of both the seller and buyer have reversed. In a regular
                auction, you will find the highest bidder as the winner, but in
                a reverse auction, it is the bidder with the lowest price that
                usually wins the Auction.
              </p>
              <h3 className="mt-4 mb-2">Reverse Auction</h3>
              <p>
                In Reverse Auction, there is one buyer with many potential
                sellers. There are a lot of organizations and industries that
                already benefit from Reverse auctions. In a regular auction,
                When a seller places an item for auction, interested buyers
                place bids until the auction ends. The highest bidder is awarded
                the item. But reverse auction is where the buyer puts up a
                request for a required good or service. Sellers then place bids
                for the amount they are willing to be paid for the good or
                service, Buyer then selects the lowest bid price and procures
                the good or service from that seller.
              </p>
              <p>
                In this Plugin, you can enable the Reverse auctions on your
                store. You can follow these simple steps to enable the Plugin
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the Reverse Auction Plugin
          </h1>
          <h5>
            You can On / Off the Plugin in your website using the Reverse
            Auction plugin Feature as Shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/reverse/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/reverse/step2.png"
            />
          </div>
          <h5>
            After Active the Plugin ,It will be Show in the My Plugin section as
            shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/reverse/step3.png"
            />
          </div>
          <h1 className="text-center my-5">
            Enable the Reverse Auction Plugin
          </h1>
          <h5>
            Next Click Reverse Auction Plugin. In this if you click yes on
            enable then it will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/reverse/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/reverse/step5.png"
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

export default ReverseAuction;
