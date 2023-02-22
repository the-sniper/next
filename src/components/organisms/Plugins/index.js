import React, { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  mapData,
  currencyFormat,
  handleRedirectInternal,
} from "../../../common/components";
import PrimaryButton from "../../atoms/PrimaryButton";
import { Button, IconButton, Tooltip } from "@material-ui/core";
import FormDialog from "../Dialog";
import { Link, useHistory } from "react-router-dom";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ProductContext from "../../../context/product/productContext";
import CommonContext from "../../../context/common/commonContext";
import AlertContext from "../../../context/alert/alertContext";
import csc from "country-state-city";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "250px",
    width: "100%",
    margin: "auto",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Plugins() {
  const [planAmt, setPlanAmt] = useState(0);
  const [pluginAmt, setPluginAmt] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [showPricing, setShowPricing] = useState(true);
  const [triggerPopup, setPopup] = useState({
    state: false,
    value: "inventory",
    iconsrc: "/assets/svg/inventory.svg",
    title: "Inventory",
    description: "",
  });
  const [buyNowPopup, setBuyNowPopup] = useState(false);
  const [statesInLocal, setStatesinLocal] = useState([]);
  const [subscription, setSubscription] = useState([]);

  const [skipPage, setSkip] = useState(true);
  const [toggleDetail, setToggleDetails] = useState(false);
  const history = useHistory();
  const [pluginExpand, setPluginExpand] = useState(false);

  const {
    getSubscriptionList,
    availablePluginList,
    subscription_lists,
    plugin_lists,
    userPluginCharge,
    userPluginChargeSub,
    responseStatus,
  } = useContext(ProductContext);
  const { allCountries } = useContext(CommonContext);
  const { setAlert } = useContext(AlertContext);

  const validationArray = Yup.object().shape({
    total_users: Yup.string(),
    plan_id: Yup.string(),
    plugin_id: Yup.array(),
  });

  const step1Schema = Yup.object().shape({
    first_name: Yup.string()
      .trim()
      .matches(/^[0-9a-zA-Z]*$/g, "Special characters are not allowed")
      .max(20, "20 characters max")
      .required("Required"),
    last_name: Yup.string()
      .trim()
      .matches(/^[0-9a-zA-Z]*$/g, "Special characters are not allowed")
      .max(20, "20 characters max")
      .required("Required"),
    business_name: Yup.string()
      .trim()
      .matches(/^[0-9a-zA-Z]*$/g, "Special characters are not allowed")
      .max(20, "20 characters max")
      .required("Required"),
    phone: Yup.string()
      .trim()
      .matches(/^[0-9- +()]*$/g, "Only numbers are allowed")
      .min(15, "Minimum 10 digits phone number")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email format")
      .max(250, "250 characters max")
      .required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "Password Mismatch")
      .required("Required"),
    termCheck: Yup.boolean()
      .oneOf([true], "Please accept terms and condition")
      .required("Please accept terms and condition"),
    address: Yup.string().trim().required("Required"),
    country: Yup.string().trim().required("Required"),
    city: Yup.string().trim().required("Required"),
    state: Yup.string().trim().required("Required"),
    zipcode: Yup.string().trim().required("Required"),
  });

  const step2Schema = Yup.object().shape({
    extracardnumber: Yup.string()
      .min(12, "Invalid credit card number!")
      .max(18, "Invalid credit card number!")
      .required("Required!"),
    cardhname: Yup.string()
      .trim()
      .matches(
        /^[a-z A-Z]*$/g,
        "The special characters and numbers are not allowed!"
      )
      .required("Required!"),
    extradate: Yup.string().required("Required!"),
    extrayear: Yup.string().required("Required!"),
    extracvv: Yup.string()
      .required("Required!")
      .min(3, "Mininum 3 Numbers required")
      .max(4, "Maximum 3 Numbers required"),
  });

  const formik = useFormik({
    initialValues: {
      total_users: 7500,
      plan_id: 0,
      plugin_id: [],
      total_pay_amt: 0,
    },
    validationSchema: validationArray,
    onSubmit: (values) => {
      setBuyNowPopup(true);
    },
  });

  const step1Formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      business_name: "",
      password: "",
      confirm_password: "",
      termCheck: 0,
      address: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
    },
    validationSchema: step1Schema,
    onSubmit: (values) => {
      // console.log("value submitted");
      if (!skipPage) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        let { sortname: countryName } = csc.getCountryById(values["country"]);
        let { name: stateName } = csc.getStateById(values["state"]);
        const body = {
          ...formik.values,
          ...values,
        };
        body.plan_id = 1;
        body.country = "USA";
        body.state = stateName;
        body.total_pay_amt = pluginAmt + planAmt;
        // console.log("submitted valuessss--->", body);
        userPluginChargeSub(body);
      }
    },
  });

  const step2Formik = useFormik({
    initialValues: {
      extradate: "",
      extrayear: "",
      extracvv: "",
      extracardnumber: "",
      cardhname: "",
    },
    validationSchema: step2Schema,
    onSubmit: (values) => {
      let { sortname: countryName } = csc.getCountryById(values["country"]);
      let { name: stateName } = csc.getStateById(values["state"]);
      const body = {
        ...formik.values,
        ...step1Formik.values,
        ...values,
      };
      body.country = "USA";
      body.state = stateName;
      body.total_pay_amt = pluginAmt + planAmt;
      // console.log(body);
      userPluginCharge(body);
    },
  });
  useEffect(() => {
    getSubscriptionList();
    availablePluginList();
  }, []);
  useEffect(() => {
    const { id, name } = csc.getCountryById(step1Formik.values.country);
    let states = csc.getStatesOfCountry(id);
    states = states.map((ele) => {
      let o = {
        show: ele.name,
        value: ele.id,
      };
      return o;
    });
    setStatesinLocal(states);
  }, [step1Formik.values.country]);
  const users = {
    formik: formik,
    data: [
      {
        label: "Total users",
        name: "total_users",
        type: "text",
        disabled: true,
        placeholder: "Enter total users",
        class: "col-12 mt-3",
        formik: formik,
        endAdornment: "users",
      },
    ],
  };

  useEffect(() => {
    let filteredSubs = subscription_lists.filter((e) => e.month_duration === 1);
    setSubscription(filteredSubs);
  }, [subscription_lists]);

  // console.log("subscription", subscription);

  const plans = {
    formik: formik,
    data: [
      {
        title: "",
        type: "radio",
        name: "plan_id",
        int: 1,
        class: "col-12 plansRadio",
        customLabel: true,
        item: subscription.map((value) => {
          if (value.enable) {
            return {
              id: value.id,
              description: (
                <div>
                  {value.id === 3 ? (
                    <img src="/assets/svg/rocket.svg" alt="Business Gold" />
                  ) : value.id === 2 ? (
                    <img src="/assets/svg/plane.svg" alt="Business" />
                  ) : value.id === 1 ? (
                    <img src="/assets/svg/ship.svg" alt="Beginners" />
                  ) : (
                    ""
                  )}

                  <span className="radioAvatar"></span>
                  <div>
                    <h4>
                      {value.id === 4
                        ? "Enterprise "
                        : value.id === 3
                        ? "Business Gold"
                        : value.id === 2
                        ? "Business"
                        : "Beginners"}
                    </h4>

                    <h6>
                      {value.id === 4
                        ? ""
                        : value.id === 3
                        ? "One Store Two Auctions"
                        : value.id === 2
                        ? "One Store One Auction"
                        : "Post products only on Auction.io "}
                    </h6>
                    {(value.id === 4 || value.id === 3 || value.id === 2) && (
                      <>
                        {" "}
                        {value.id === 4 ? (
                          <>
                            <h6>Build your own site in 60 min</h6>
                            <h6 className="enterprisePrice">
                              <span>Starts from</span>
                              {` $${value.amount}`}
                              <span>/month</span>
                            </h6>
                          </>
                        ) : (
                          <h5>
                            {`$${value.amount}`}
                            <span>
                              /{value.month_duration === 1 ? "month" : "year"}
                            </span>
                          </h5>
                        )}
                      </>
                    )}
                    {value.id === 1 ? <h5>Free!</h5> : ""}

                    {/* <h6>Allowed Auction: {value.auction_allow}</h6> */}
                    {value.id === 4 ? (
                      <>
                        <h6 className="tmdLvtTxt">
                          *Includes Timed and Live Auction
                        </h6>
                        <p>Preferred Plan</p>
                        <Button
                          className="scheduleBtn"
                          onClick={() =>
                            window.open(
                              "https://meetings.hubspot.com/mark-walpole"
                            )
                          }
                        >
                          <span className="material-icons">call</span> Schedule
                          a demo
                        </Button>
                      </>
                    ) : null}
                  </div>
                  {formik.values.plan_id == value.id ? (
                    <Button className="subsActBtn active">Selected</Button>
                  ) : (
                    <Button className="subsActBtn">
                      Choose this plan{" "}
                      <span className="material-icons">east</span>
                    </Button>
                  )}
                </div>
              ),
            };
          }
        }),
      },
    ],
  };
  // console.log(formik.values, "formikValues");
  const plugins = {
    formik: formik,
    data: [
      {
        type: "check",
        name: "plugin_id",
        int: 1,
        class: "col-12 pluginCheck",
        customLabel: true,
        options: [
          ...plugin_lists.slice(0, showAll ? plugin_lists.length : 12),
        ].map((value) => {
          if (value.enable) {
            return {
              id: value.id,
              value: value.price,
              labelData: (
                <div>
                  <span className={`checkAvatar ${showPricing ? "" : "small"}`}>
                    <img
                      src={process.env.NEXT_PUBLIC_IMAGE_URL + value.image}
                      alt="Inventory"
                    />
                  </span>
                  <div>
                    <Tooltip title={value.menu_name}>
                      <h4>{value.menu_name}</h4>
                    </Tooltip>
                    {/* {showPricing ? ( */}
                    <h6>
                      {currencyFormat(value.price) + "/" + value.duration}
                    </h6>
                    {/* ) : (
                      ""
                    )} */}
                  </div>
                </div>
              ),
              outerProps: (
                <div
                  className="helpInfoIcon"
                  onClick={() =>
                    setPopup({
                      state: true,
                      value: value.plugin_name,
                      iconsrc: process.env.NEXT_PUBLIC_IMAGE_URL + value.image,
                      title: value.menu_name,
                      description: value.description,
                    })
                  }
                >
                  <span className="material-icons">info</span>
                </div>
              ),
            };
          }
        }),
      },
    ],
  };

  useEffect(() => {
    formik.setFieldValue("total_users", 7500);
  }, []);

  useEffect(() => {
    if (formik.values.plan_id) {
      const obj = subscription_lists.find(
        (val) => val.id == formik.values.plan_id
      );
      if (obj) {
        setPlanAmt(parseInt(obj.amount, 10));
      }
    }
  }, [formik.values.plan_id]);

  useEffect(() => {
    if (formik.values.plugin_id.length) {
      // console.log(formik.values);
      var amt = 0;
      plugin_lists.map((val) => {
        if (formik.values.plugin_id.includes(`${val.id}`)) {
          amt += parseInt(val.price, 10);
        }
      });
      setPluginAmt(amt);
    }
  }, [formik.values.plugin_id]);

  useEffect(() => {
    if (subscription_lists.length) {
      formik.setFieldValue("plan_id", 4);
    }
  }, [subscription_lists]);
  useEffect(() => {
    if (responseStatus) {
      if (responseStatus.from === "userPluginCharge") {
        setAlert(responseStatus.message, responseStatus.status);
        if (responseStatus.status === "success") {
          window.location.href =
            process.env.NEXT_PUBLIC_PAYMENTMODE === "sandbox"
              ? "https://auction_io.ecommerce.auction/login"
              : "https://app.auction.io/login";
        }
      }
    }
  }, [responseStatus]);
  const buyNow = [
    {
      label: "First name",
      name: "first_name",
      type: "text",
      placeholder: "Enter your first name",
      class: "col-sm-6 col-12",
      autoFocus: true,
      formik: step1Formik,
    },
    {
      label: "Last name",
      name: "last_name",
      type: "text",
      placeholder: "Enter your last name",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: "Phone number",
      name: "phone",
      type: "phone",
      countryCodeEditable: "us",
      placeholder: "Enter your phone number",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: "Business Name",
      name: "business_name",
      type: "text",
      placeholder: "Enter your business name",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: "Personal website (optional)",
      name: "personal_website",
      type: "text",
      placeholder: "Enter your website",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: "Email address",
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: "Confirm password",
      name: "confirm_password",
      type: "password",
      placeholder: "Re-enter your password",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: "Address",
      name: "address",
      type: "text",
      placeholder: "Enter your website",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: "Country",
      placeholder: "Select your country",
      class: "col-12 col-sm-6",
      type: "select",
      options: allCountries,
      name: "country",
      formik: step1Formik,
    },
    {
      label: "State",
      placeholder: "Select your state",
      class: "col-12 col-sm-6",
      type: "select",
      options: statesInLocal,
      name: "state",
      formik: step1Formik,
    },
    {
      label: "City",
      name: "city",
      type: "text",
      placeholder: "Enter your city",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: "Zip code",
      name: "zipcode",
      type: "text",
      placeholder: "Enter your zipcode",
      class: "col-sm-6 col-12",
      formik: step1Formik,
    },
    {
      label: [
        "I agree to accept the ",
        <Link to="/terms" className="ml-1" target="blank">
          {" "}
          {" Terms & Conditions"}
        </Link>,
        "",
      ],
      name: "termCheck",
      type: "checkbox",
      class: "col-12 mt-1 chkBoxWrpr",
      formik: step1Formik,
    },
  ];

  const cardDetails = [
    {
      label: "Card Number",
      name: "extracardnumber",
      type: "text",
      placeholder: "Enter your card number",
      class: "col-sm-12 col-12",
      autoFocus: true,
      formik: step2Formik,
    },
    {
      label: "Exp. Month",
      name: "extradate",
      type: "text",
      placeholder: "MM",
      class: "col-sm-3 col-12",
      formik: step2Formik,
    },
    {
      label: "Exp. Year",
      name: "extrayear",
      type: "text",
      placeholder: "YYYY",
      class: "col-sm-3 col-12",
      formik: step2Formik,
    },
    {
      label: "CVV",
      name: "extracvv",
      type: "number",
      countryCodeEditable: "us",
      placeholder: "Enter your phone number",
      class: "col-sm-6 col-12",
      formik: step2Formik,
    },
    {
      label: "Card Holder Name",
      name: "cardhname",
      type: "text",
      placeholder: "Enter the name on your card",
      class: "col-sm-12 col-12",
      formik: step2Formik,
    },
  ];

  // stepper states
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    if (activeStep === 0) {
      step1Formik.handleSubmit();
    }
    if (activeStep === 1) {
      step2Formik.handleSubmit();
    }
  };

  const handleBack = () => {
    setSkip(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function getSteps() {
    return ["Basic Info", "Card Details"];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <div className="row pt-4">{mapData(buyNow)}</div>;
      case 1:
        return <div className="row pt-4">{mapData(cardDetails)}</div>;
      default:
        return "Unknown step";
    }
  }

  const handleSkip = () => {
    // console.log("step 1 skipped");
    setSkip(true);
    step1Formik.handleSubmit();
  };

  const toggleDetailSwitch = () => {
    setToggleDetails(false);
    setPopup({
      state: false,
      value: "",
      iconsrc: "",
      title: "",
    });
  };

  return (
    <div className="pluginsCnt">
      <div className="pluginsTitle">
        <h2>
          Browse our awesome plugins and create your own customized store.
        </h2>
        <h3>Each plugin is valid upto 7,500 users.</h3>
        <span className="material-icons-round puzzle1">extension</span>
        <span className="material-icons-round puzzle2">extension</span>
        <Button
          className={`expndBtn ${pluginExpand ? "rotate" : ""}`}
          onClick={() => setPluginExpand(!pluginExpand)}
        >
          {pluginExpand ? (
            <span className="material-icons">expand_less</span>
          ) : (
            <span className="material-icons">expand_more</span>
          )}
        </Button>
        <p
          className="vwPlgnDtls cursorDecoy"
          onClick={() => setPluginExpand(!pluginExpand)}
        >
          {pluginExpand ? "Hide Plugin Details" : "View Plugin Details"}
        </p>
      </div>
      {pluginExpand && (
        <>
          <form onSubmit={formik.handleSubmit}>
            <div className="pluginsInner">
              <div className="pluginsLeft">
                <div className="plans row">
                  <div className="col-12">
                    <div className="pluginTop d-flex justify-content-between align-items-center">
                      <div>
                        <h3>Select a plan</h3>
                        <h4>Charity Auctions included</h4>
                      </div>
                      <Button
                        variant="outlined"
                        className="viewPlanBtn"
                        onClick={() =>
                          window.open(
                            "https://seller.auction.io/#pricingTable",
                            "_blank"
                          )
                        }
                      >
                        View plan information
                      </Button>
                    </div>
                  </div>
                  {mapData(plans)}
                </div>
                {/* {formik.values.plan_id != 1 ? ( */}
                <div className="plugins row">
                  <div className="col-12 pluginTop d-flex justify-content-between align-items-center">
                    <h3>Select a plugin</h3>
                    {/* <Button
                      variant="outlined"
                      className="viewPlanBtn"
                      onClick={() => setShowPricing(!showPricing)}
                    >
                      {showPricing ? "Hide" : "Show"} plugin pricing
                    </Button> */}
                  </div>
                  {mapData(plugins)}

                  <div className="col-12 text-center">
                    <Button
                      variant="outlined"
                      className="viewMoreBtn"
                      onClick={() => setShowAll(!showAll)}
                    >
                      View {`${showAll ? "less" : "more"}`}
                    </Button>
                  </div>
                </div>
                {/* ) : (
              ''
            )} */}
              </div>
              <div className="pluginPriceCnt">
                <div className="pluginsPrice">
                  <div className="row">{mapData(users)}</div>
                  <div class="prcngDtls">
                    <div class="inrDtls">
                      <p>
                        <span>
                          <b>{formik.values.plugin_id.length}</b>
                        </span>{" "}
                        Apps:
                      </p>
                      <p>
                        <b>{currencyFormat(pluginAmt)}</b>
                      </p>
                    </div>
                    <div class="inrDtls">
                      <p>Plan:</p>
                      <p>
                        <span>
                          <b>{currencyFormat(planAmt)}</b>
                        </span>{" "}
                      </p>
                    </div>
                    <div class="inrDtls">
                      <p>
                        <b>Total per month:</b>
                      </p>
                      <p>
                        <span class="colorPrimary">
                          <b>{currencyFormat(pluginAmt + planAmt)}</b>
                        </span>
                      </p>
                    </div>
                  </div>
                  <PrimaryButton type="submit" className="trlBtn">
                    Try Now (30 Days Free Trial)
                  </PrimaryButton>
                  <PrimaryButton type="submit" className="mt-2">
                    Buy Now
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </form>
          <FormDialog
            maxWidth={"md"}
            className="dscrptnDialog"
            title={
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="avatarCircle">
                    <img src={triggerPopup.iconsrc} />
                  </div>
                  <p className="m-0">{triggerPopup.title}</p>
                </div>
                <IconButton
                  onClick={() =>
                    setPopup({
                      state: false,
                      value: "",
                      iconsrc: "",
                      title: "",
                    })
                  }
                >
                  <span className="material-icons">clear</span>
                </IconButton>
              </div>
            }
            open={triggerPopup.state}
            function={() =>
              setPopup({
                state: false,
                value: "",
                iconsrc: "",
                title: "",
              })
            }
          >
            <div className="pt-2">
              <p className="shortDesc">{triggerPopup.description} </p>
              <p
                className="vmMoreLnk"
                onClick={() =>
                  handleRedirectInternal(
                    history,
                    `plugin`,
                    `type=${triggerPopup.value}`
                  )
                }
              >
                View More
                <span className="material-icons-outlined">open_in_new</span>
              </p>
            </div>
          </FormDialog>
          <FormDialog
            className="buyRegisterPopup"
            open={buyNowPopup}
            maxWidth={"md"}
            function={() => setBuyNowPopup(false)}
            title={
              <div className="plgnTpTtleCntnr d-flex align-items-center pt-4">
                <img
                  className="regImgCnt"
                  src="/assets/svg/register_popup.svg"
                />
                <div className="stprTopCntnr">
                  <p className="tpTxInfo mb-1">
                    {activeStep === 0
                      ? "Basic Info"
                      : activeStep === 1
                      ? "Card Details"
                      : null}{" "}
                  </p>
                  <div className={classes.root}>
                    <Stepper activeStep={activeStep}>
                      {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                          <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}></StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                  <p className="abtInfoTxt mt-3">
                    Please fill in the below details to proceed with purchase!
                  </p>

                  <IconButton
                    className="clrButton"
                    onClick={() => setBuyNowPopup(false)}
                  >
                    <span className="material-icons">clear</span>
                  </IconButton>
                </div>
              </div>
            }
          >
            <div>
              {activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={handleReset} className={classes.button}>
                    Reset
                  </Button>
                </div>
              ) : (
                <div>
                  <Typography className={classes.instructions}>
                    {getStepContent(activeStep)}
                  </Typography>
                  <div className="stprBtns d-flex align-items-center justify-content-end mt-4">
                    {/* <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button> */}
                    {/* <Button
                  disabled={activeStep === 0}
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button> */}
                    <PrimaryButton
                      onClick={() => step1Formik.handleSubmit()}
                      label={"Finish"}
                    />
                    {/* label={activeStep === steps.length - 1 ? 'Finish' : 'Next'} */}
                  </div>
                </div>
              )}
            </div>
          </FormDialog>
        </>
      )}
    </div>
  );
}

export default Plugins;
