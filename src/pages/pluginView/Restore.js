import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const Restore = (props) => {
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
            src="/assets/images/plugins/restore/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Restore</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The Restore Feature will be used in the Store Seller. Creating
                backups is easy, but the real useful part about backups is the
                ability to restore them with the same ease.
              </p>
              <p>
                If you have backup your data , Restore Plugin Feature makes it
                easy to restore your data with just one click from backup Plugin
                Feature.{" "}
              </p>
              <p>
                Sometimes you want to migrating your data or you need to restore
                your data after something bad happens, Restore Plugin Feature is
                one of the quickest and easiest processes as shown below.
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the Restore Plugin
          </h1>
          <h5>
            You can On / Off the Restore Plugin in your website using the
            Restore plugin as Shown below .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/restore/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/restore/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/restore/step3.png"
            />
          </div>
          <h1 className="text-center my-5">Enable the Restore Plugin</h1>
          <h5>
            Next Click Restore In this if you click yes on enable then it will
            be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/restore/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/restore/step5.png"
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

export default Restore;
