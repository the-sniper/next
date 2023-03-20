import React from "react";
import { Button } from "@mui/material";
import { currencyFormat } from "@/common/components";
import { useRouter } from "next/router";

const Ach = (props) => {
  const router = useRouter();
  return (
    <div>
      <div className="dscrptnContainer customContainer">
        <div className="tpMnCntnr d-flex pt-5">
          <Button
            className="bkButton mt-3 ml-4"
            onClick={() => router.goBack()}
          >
            <span class="material-icons-outlined mr-2">keyboard_backspace</span>
            Back
          </Button>
          <img
            className="mnPlgnImg"
            src="/assets/images/plugins/ach/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>ACH</h2>
            </div>
            <div className="shrDsctpn">
              <p>
                The ACH Plugin Feature will be used in the Store Seller. ACH
                stands for Automated Clearing House, ACH is an electronic funds
                transfer sent from one bank account to another and can either be
                a Bank or Credit Union. In simple terms, ACH payment
                transaction, you have one person or entity who’s sending a
                payment and another receiving it. This payment is processed
                through the ACH Network.{" "}
              </p>
              <p>
                In general, ACH payments are convenient and simple to process.
                An ACH direct deposit is any kind of deposit payment made from a
                business to a consumer. This includes paychecks, tax and other
                refunds and interest payments.
              </p>
            </div>
            <div>
              <p>
                When you make a transfer, you will need to provide some
                Information
              </p>
              <ul>
                <li>your name</li>
                <li>routing/ABA number</li>
                <li>account number</li>
                <li>account type</li>
                <li>transaction amount. </li>
              </ul>
              <p>
                Once the ACH verifies the customer’s has writing privileges, you
                should be able to locate the account and routing numbers at the
                bottom of a check. ACH payments are a safe, easy and fast
                option.
              </p>
              <p>
                ACH Plugin Feature is one of the best solutions for users who
                want to generate ACH debits for any bank or Direct Payment. This
                Plugin allows user to send outgoing credits to their customers
                or employees.
              </p>
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">How To Activate</h1>
          <h5>
            You can On / Off the ACH Plugin in your website using the ACH plugin
            as Shown below .
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/ach/step1.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/ach/step2.png"
            />
          </div>
          <h5>It will be Show in the active plugin section as shown below.</h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/ach/step3.png"
            />
          </div>
          <h1 className="text-center my-5">Enable ACH Plugin</h1>
          <h5>
            Next Click ACH In this if you click yes on enable then it will be
            enabled.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/ach/step4.png"
            />
          </div>
          <h5>
            Once you are Completed with your changes, click on the ‘Submit’
            button.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/ach/step5.png"
            />
          </div>
        </div>
      </div>
      <div className="pyCntnr">
        <div className="customContainer d-flex align-items-center justify-content-between">
          <div className="lftInfo">
            <div className="lgCntnr">
              <img
                src={
                  process.env.NEXT_PUBLIC_IMAGE_URL + props.pluginData?.image
                }
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

export default Ach;
