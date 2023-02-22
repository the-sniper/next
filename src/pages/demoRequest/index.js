import React, { useState, useContext, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { mapData, handleRedirectInternal } from "@/common/components";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { Button } from "@material-ui/core";
import AlertContext from "@/context/alert/alertContext";
import AuthContext from "@/context/auth/authContext";
import HubspotContactForm from "@/components/organisms/HubSpotForm";
import { LOGO } from "src/Utils";

const DemoRequest = () => {
  const { setAlert } = useContext(AlertContext);
  const { sendContactUs } = useContext(AuthContext);
  const registrationValidationSchema = Yup.object({
    first_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z ]*$/g, "Special characters not allowed")
      .max(15, "Maximum 15 characters only")
      .required("Required"),
    last_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z ]*$/g, "Special characters not allowed")
      .max(15, "Maximum 15 characters only")
      .required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    location: Yup.string().required("Required"),
    phone: Yup.string()
      .trim()
      .matches(/^[0-9- +()]*$/g, "Only numbers are allowed")
      .max(20, "Maximum 20 charaters")
      .min(10, "Minimum 10 characters")
      .required("Required!"),
    message: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      business_name: "",
      email: "",
      location: "",
      phone: "",
      message: "",
    },
    validationSchema: registrationValidationSchema,
    onSubmit: async (values) => {
      // console.log("async api call", values);
      const res = await sendContactUs(values);
      if (res) {
        setAlert("Form submitted successfuly!", "success");
        formik.resetForm();
      } else {
        setAlert("Cannot able to submit", "error");
      }
    },
  });

  // console.log("async api call formik", formik.values, formik.errors);

  const signupInfo = [
    {
      label: "First name",
      name: "first_name",
      type: "text",
      placeholder: "Enter your first name",
      class: "col-sm-6 col-12",
      autoFocus: true,
      formik: formik,
      upperLabel: true,
      size: "small",
    },
    {
      label: "Last name",
      name: "last_name",
      type: "text",
      placeholder: "Enter your last name",
      class: "col-sm-6 col-12",
      formik: formik,
      upperLabel: true,
      size: "small",
    },
    {
      label: "Business name",
      name: "business_name",
      type: "text",
      placeholder: "Enter your last name",
      class: "col-sm-6 col-12",
      formik: formik,
      upperLabel: true,
      size: "small",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      class: "col-sm-6 col-12",
      formik: formik,
      upperLabel: true,
      size: "small",
    },
    {
      label: "Phone number",
      name: "phone",
      type: "phone",
      countryCodeEditable: "us",
      placeholder: "Enter your phone number",
      class: "col-sm-6 col-12",
      formik: formik,
      upperLabel: true,
      size: "small",
    },
    {
      label: "Zip code",
      name: "location",
      type: "text",
      placeholder: "Enter your zip code",
      class: "col-sm-6 col-12",
      formik: formik,
      upperLabel: true,
      size: "small",
    },
    {
      label: "Message",
      name: "message",
      type: "textarea",
      placeholder: "How can we help?",
      class: "col-12",
      formik: formik,
      upperLabel: true,
      size: "small",
      rows: 4,
    },
  ];

  return (
    <div className="dmoWrpr">
      <div className="dmoTopWrpr">
        <div className="dmoContainer d-flex align-items-start justify-content-between">
          <h4>
            Everything You Need to Run <br /> Your Next Auction
          </h4>
        </div>
      </div>
      <div className="dmoBtmWrpr">
        <div className="dmoContainer d-flex align-items-start justify-content-between">
          <div className="textContainer">
            <p>
              Say Bye, Bye to clunky Wordpress plug-ins for self hosted auctions
              and say hello to Auction.io. You will get engaging auction tools
              that help you manage your event and bidders with ease! With
              Auction.io, these features are standard for your auction.
            </p>
            <ul className="mt-5">
              <li>Upload Inventory</li>
              <li>Qualified Bidders</li>
              <li>Invite Your Bidders</li>
              <li>Place bids from any device, by app or web</li>
              <li>Crazy Commissions are no more</li>
              <li>Create an Auction Lot with hundreds of items</li>
              <li>Timed Auctions</li>
            </ul>
            <p className="mt-5">All while your team can:</p>
            <ul>
              <li>Track bidding</li>
              <li>Streamline checkout processes</li>
              <li>
                Save time reconciling your event with purchase details all in
                one place
              </li>
              <li>Engage with bidders from all over the country!</li>
            </ul>
            <p className="mt-5">
              These are just a few of the features to help you sell more at your
              auction event, and there’s so much more to see! Go ahead—fill out
              the form to request a demo. We’d love to show you how Auction.io
              can make your next auction simpler for you!
            </p>
          </div>
          <div className="brwsrCntnr">
            <img src="/assets/images/browsertop.png" className="brTop" />
            <div className="frmContainer text-center">
              <img src={LOGO} className="stLogo" />
              <div className="mt-5">
                <HubspotContactForm />
              </div>

              {/* <form onSubmit={formik.handleSubmit} className="mt-5 text-left">
                <div className="row">{Object.values(mapData(signupInfo))}</div>
                <div className="d-flex signupActBox justify-content-center align-items-center">
                  <Button type="submit" className="gtStrBtn">
                    Request Demo
                  </Button>
                </div>
              </form> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoRequest;
