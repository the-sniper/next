import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const IocScanner = (props) => {
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
            src="/assets/images/plugins/iocScanner/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>IOC Security Scanner</h2>
            </div>
            <div className="shrDsctpn">
              <p>The IOC Security Scanner will be used in the Store Seller.</p>
              <p>
                Indicators of compromise (IOC) are systems artifacts that could
                be the result of a security breach of a system. Examples of such
                indicators are the presence of particular files, processes, or
                users. Typically these indicators have names that are similar to
                system components with the goal to decrease the chance of
                discovery.
              </p>
              <p>
                It is{" "}
                <b>
                  a set of data about an object or activity that indicates
                  unauthorized access to the computer (compromise of data)
                </b>
              </p>
              <p>
                IOC scanners are typically used for intrusion detection and
                system compromise detection.
              </p>
            </div>
            <div className="mrDscrptnCntnr">
              <img
                className="stpImg"
                src="/assets/images/plugins/iocScanner/step1.png"
              />
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">Store Admin Page</h1>
          <h5>
            The admin or seller can go to the Plugin and Switch on the IOC
            Security Scanner to as shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/iocScanner/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/iocScanner/step3.png"
            />
          </div>
          <h5>
            Next Click IOC Security Scanner In this if you click yes on enable
            then it will be enabled
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/iocScanner/step4.png"
            />
          </div>
          <h5>
            And then there are some criteria in this. You can select some
            criteria that you want and Select Condition as AND or OR condition
            from the dropdown .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/iocScanner/step5.png"
            />
          </div>
          <h5>
            Then type the rule name and click action type that you want and
            Select event performance .If you select login then the event will be
            performed when user login.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/iocScanner/step6.png"
            />
          </div>
          <h5>
            Finally Click Add button. <br />
            The condition that you added will displayed like this.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/iocScanner/step7.png"
            />
          </div>
          <h5>
            If you want to edit the condition then you can click the edit button
            from Action Column as shown below
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/iocScanner/step8.png"
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

export default IocScanner;
