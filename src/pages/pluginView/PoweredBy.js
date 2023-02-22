import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const PoweredBy = (props) => {
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
              <h2>Powered By AuctionIO</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The Powered By AuctionIO will be used in the Store Seller. If
                you simply want to Enable or Disable the Logo, the easiest
                solution is using a Powered By AuctionIO plugin.{" "}
              </p>
              <p>
                Powered By AuctionIO plugin extend the functionality of your
                site , It’s an easy solution when you want to enable or disable
                logo. Plus, it requires no coding experience. Follow the steps
                below to enable or disable logo with a plugin.
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the Powered By AuctionIO Plugin
          </h1>
          <h5>
            You can On / Off the Plugin in your website using the Powered By
            AuctionIo plugin Feature as Shown below .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/poweredby/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/poweredby/step2.png"
            />
          </div>
          <h5>
            After Active the Plugin ,It will be Show in the My Plugin section as
            shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/poweredby/step3.png"
            />
          </div>
          <h1 className="text-center my-5">
            Enable the Powered By AuctionIO Plugin
          </h1>
          <h5>
            Next Click Powered By AuctionIO Plugin. In this if you click yes on
            enable then it will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/poweredby/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/poweredby/step5.png"
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

export default PoweredBy;
