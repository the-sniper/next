import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const Avalara = (props) => {
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
            src="/assets/images/plugins/avalara/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Avalara</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The Avalara Plugin Feature will be used in the Store Seller.
                Avalara provides transparent transactions, accurate tax
                compliance, painless administration and effortless reporting.
                Avalara offers full service sales tax management tools utilizing
                progressive technology to automate the burden of statutory
                transactional tax compliance.
              </p>
              <p>
                Avalara can help with complex tax calculation, filing returns,
                managing exemption certificates and allows businesses to
                calculate sales tax amounts on their invoices based on location.
                For instance, if you sell something in the city of Atlanta, do
                you know if you have a local sales tax or not? By classifying a
                sale in Avalara and inputting the proper address of where you
                sold your item, it automatically states the correct tax rate.
                It’s one less thing you have to keep up with for customers.
              </p>
              <p>
                Use their table that plugs in with every single invoice, and it
                tells what tax to charge.
              </p>
              <p>
                Avalara's flagship product, AvaTax has become the automated
                sales tax compliance solution for businesses all over the world.
                In fact, Avalara leads the market and integrates seamlessly into
                more financial and e-Commerce applications than any other
                product or service available.
              </p>
              <p>
                Avalara Plugin Feature enables you to quickly and easily
                calculate sales tax amounts and much more. All you need to do is
                follow some simple steps below.
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">
            Active / Deactive the Avalara Plugin
          </h1>
          <h5>
            You can On / Off the Avalara Plugin in your website using the
            Avalara plugin as Shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/avalara/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/avalara/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/avalara/step3.png"
            />
          </div>
          <h1 className="text-center my-5">Enable the Avalara Plugin</h1>
          <h5>
            Next Click Avalara In this if you click yes on enable then it will
            be enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/avalara/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/avalara/step5.png"
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

export default Avalara;
