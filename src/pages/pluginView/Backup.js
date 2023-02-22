import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const Backup = (props) => {
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
            src="/assets/images/plugins/backup/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Backup</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The Backup Feature will be used in the Store Seller. Backup
                Feature act like a safety net for your website. Whenever your
                website crashes for any reason, you can quickly restore your
                site. This is why you should always use a backup plugin. But you
                need to make sure your backup has the latest changes or you
                could lose important data.
              </p>
              <p>
                Below are the best backup plugins that’s give you peace of mind
                knowing that your website is always safe.
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">Why we Use Backup Plugin:</h1>
          <p>
            Backups is the best thing you can do for your website security.{" "}
          </p>
          <p>
            Backups give you peace of mind and can save you in catastrophic
            situations such as when your site gets crashed.
          </p>
          <p>
            This plugin provides you with complete data like users,bids ,
            projects , Invoices etc .you can download it any number of times and
            anytime.
          </p>
          <h1 className="text-center my-5">
            Active / Deactive the Backup Plugin
          </h1>
          <h5>
            You can On / Off the Backup Plugin in your website using the Backup
            plugin as Shown below .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/backup/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/backup/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/backup/step3.png"
            />
          </div>
          <h1 className="text-center my-5">Enable the Backup Plugin</h1>
          <h5>
            Next Click Backup In this if you click yes on enable then it will be
            enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/backup/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/backup/step5.png"
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

export default Backup;
