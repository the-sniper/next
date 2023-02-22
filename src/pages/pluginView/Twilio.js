import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const Twilio = (props) => {
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
            src="/assets/images/plugins/twilio/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Twilio</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The TWILIO Plugin Feature will be used in the Store Seller.
                Twilio is a Modern communication API tool for making and
                receiving phone calls. Twilio offers complete solutions to
                building communication with text messages and files inside an
                app, make voice and video calls, WhatsApp ,Email , send or
                receive verification codes and Even IOT. Twilio helps its
                clients focus on their current goals, like communication with
                partners, customers, and employees instead of spending a huge
                amount of time negotiating with mobile operators to solve
                communication problems.
              </p>
              <p>
                Also to perform other communication functions using its web
                service APIs. This API helps build and monitor calling systems,
                in addition to supporting the routing of calls to a browser,
                app, phone, or anywhere else you can receive a call. All you
                need to do is integrate its API with your software.
              </p>
              <p>
                Twilio Plugin Feature are the Easiest solutions for your Website
                Communication. All you need to do is follow some simple steps
                below.
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the TWILIO Plugin
          </h1>
          <h5>
            You can On / Off the TWILIO Plugin in your website using the TWILIO
            plugin as Shown below .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/twilio/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/twilio/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/twilio/step3.png"
            />
          </div>
          <h1 className="text-center my-5">Enable the TWILIO Plugin</h1>
          <h5>
            Next Click TWILIO In this if you click yes on enable then it will be
            enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/twilio/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/twilio/step5.png"
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

export default Twilio;
