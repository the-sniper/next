import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const AuctionioLogo = (props) => {
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
            src="/assets/images/plugins/auctionio/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Auction.io On / Off</h2>
            </div>
            <div className="shrDsctpn">
              <p>The Auction.io On / Off will be used in the Store Seller.</p>
              <p>
                If you simply want to enable or Disable the Logo in Email , the
                easiest solution is using a Auction.io On / Off plugin.
              </p>
              <p>
                Auction.io On / Off plugin extend the functionality of your site
                , It’s an easy solution when you want to enable or disable logo
                on Email. Plus,it requires no coding experience. Follow the
                steps below to enable or disable logo on Email with a plugin.
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the Auction.io On/Off Plugin
          </h1>
          <h5>
            You can On / Off the Plugin in your website using the Auction.io
            plugin Feature as Shown below .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/auctionio/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/auctionio/step2.png"
            />
          </div>
          <h5>
            After Active the Plugin ,It will be Show in the active plugin
            section as shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/auctionio/step3.png"
            />
          </div>
          <h1 className="text-center my-5">
            Enable the Auction.io On/Off Plugin
          </h1>
          <h5>
            Next Click Auction.io Plugin. In this if you click yes on enable
            then it will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/auctionio/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/auctionio/step5.png"
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

export default AuctionioLogo;
