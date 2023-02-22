import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const Maintenance = (props) => {
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
            src="/assets/images/plugins/maintenance/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Maintenance</h2>
            </div>
            <div className="shrDsctpn">
              <p>The Maintenance On / Off will be used in the Store Seller.</p>
              <p>
                Maintenance mode Feature display the site is Maintenance or not
                to your users instead of a broken site during website
                maintenance. It also allows you to safely perform any
                maintenance task while making sure that people who need access
                to the website still have access.
              </p>
              <p>
                we will show you how to easily put your site in maintenance On /
                Off.
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the Maintenance Mode
          </h1>
          <h5>
            You can On / Off the maintenance mode in your website using the
            Maintenance plugin as Shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/maintenance/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/maintenance/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/maintenance/step3.png"
            />
          </div>
          <h1 className="text-center my-5">Enable the Maintenance Mode</h1>
          <h5>
            Next Click Maintenance In this if you click yes on enable then it
            will be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/maintenance/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/maintenance/step5.png"
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

export default Maintenance;
