import React, { useState, useContext, useEffect, useRef } from "react";
import Slider from "@material-ui/core/Slider";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import { useFormik } from "formik";
import {
  mapData,
  handleRedirectInternal,
  currencyFormat,
  getImages_url_check,
} from "@/common/components";

import clsx from "clsx";
import Button from "@material-ui/core/Button";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AuctionContext from "@/context/auction/auctionContext";
import AlertContext from "@/context/alert/alertContext";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import AuthContext from "@/context/auth/authContext";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SecondaryButton from "@/components/atoms/SecondaryButton";
import CustomSelect from "@/components/atoms/Inputs/CustomSelect";
import lookup from "country-code-lookup";
import csc from "country-state-city";
import * as Yup from "yup";
import CommonContext from "@/context/common/commonContext";
import { IconButton, Tooltip } from "@material-ui/core";
import Loaders from "@/components/molecules/Loaders";
import { useRouter } from "next/router";
import Link from "next/link";
const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  table: {
    minWidth: 650,
  },
  drawer: {
    position: "relative",
    marginLeft: "auto",
    width: 200,
    "& .MuiBackdrop-root": {
      display: "none",
    },
    "& .MuiDrawer-paper": {
      // width: 200,
      position: "absolute",
      // height: (props: { height: number }) => props.height,
      transition: "none !important",
    },
  },
});

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: "0 0 10px #00000026;",
    fontSize: 11,
  },
  arrow: {
    color: "white",
  },
}))(Tooltip);

function Ticketing(props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openmenu, setOpenmenu] = useState(false);
  const containerRef = useRef();
  const [height, setHeight] = useState(0);
  const classes = useStyles({ height: height });
  const [ticket_struture, setStruture] = useState([]);
  const [selected_ticket_details, setSelectedTicketDetais] = useState([]);
  const [total_ticket_price, setTotalTicketPrice] = useState(0);
  const [selected_ticket_id, setSelectedTicketid] = useState([]);
  const [ticket_steps, setTicketSteps] = useState(0);
  const [user_details, setUserDetails] = useState({});
  const [carddetails, setCardDetails] = useState([]);
  const [selected_card, setSelectedCard] = useState("");
  const [donar_loading, setDonarLoading] = useState(false);
  const [booked_seat, setBookedSeat] = useState([]);
  const { allCountries } = useContext(CommonContext);
  const [addressInitialValues, setAddressInitialValues] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    address: "",
    id: "",
    payment: "Card",
    web_address: "",
    notes: "",
    amount: "",
    business_name: "",
    auction_id: "",
    extracardnumber: "",
    extradate: "",
    extrayear: "",
    extracvv: "",
    sourceID: "",
  });
  const {
    getAuctionDetails,
    auctiondetails,
    responseStatus: auctionResponse,
  } = useContext(AuctionContext);
  const { setAlert } = useContext(AlertContext);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const [auctionDetails, setAuctionDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handlemenuClickOpen = () => {
    setOpenmenu(true);
  };

  const handlemenuClose = () => {
    setOpenmenu(false);
  };

  useEffect((anchor) => {
    if (anchor) {
      setHeight(containerRef.current.clientHeight - 64);
    } else {
      setHeight(0);
    }
  }, []);

  const {
    get_Stage,
    responseStatus: ticket_response,
    user,
    book_tickets,
    getdonarexistingcard,
    check_ticket_avialable,
  } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phonenumber: "",
      email: "",
      password: "",
      confirm_password: "",
      termCheck: 0,
      // redirectURL: `${window.location.origin}/ticktes`,
    },
    // validationSchema: registrationValidationSchema,
    onSubmit: (values) => {
      // donar_registration(data_send);
    },
  });

  useEffect(() => {
    if (user) {
      if (user.email) {
        setUserDetails(user);
        let countryId = "";
        if (lookup.byCountry(user.country) != null) {
          let { id } = csc.getCountryByCode(
            lookup.byCountry(user.country).iso2
          );
          countryId = id;
        }
        let stateId = "";
        if (countryId) {
          let statesOfCountry = csc.getStatesOfCountry(countryId);
          let index = statesOfCountry.findIndex(
            (element) => element.name === user.state
          );
          if (index) {
            stateId = statesOfCountry[index].id;
          }
        }

        let auctionId = router?.query.aid ? router?.query.aid : "0";
        setAddressInitialValues({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          stage_id: router?.query.sid ? router?.query.sid : "0",
          state: user.state ? user.state : "",
          seat_id: "",
          stag_obj: [],
          country: user.country ? user.country : "",
          zip: user.zip,
          address: user.address1,
          eventid: 0,
          payment: "",
          web_address: "",
          notes: "",
          amount: "",
          business_name: "",
          auction_id: auctionId,
          user_id: user.id,
          extracardnumber: "",
          extradate: "",
          extrayear: "",
          extracvv: "",
          sourceID: "",
          cardhname: "",
          toemail: user.email,
        });
      }
    }
  }, [user]);

  useEffect(() => {
    get_Stage({
      stage_id: router?.query.sid ? router?.query.sid : "1",
      auction_id: router?.query.aid ? router?.query.aid : "0",
    });
    let customPage = {
      title: "",
      auctionId: router?.query.aid ? router?.query.aid : "0",
      orderby: 1,
      is_auctionio: 1,
    };
    getAuctionDetails(customPage);
  }, []);

  useEffect(() => {
    if (Object.keys(auctiondetails).length > 0) {
      setAuctionDetails(auctiondetails);
    }
  }, [auctiondetails]);

  useEffect(() => {
    if (ticket_response) {
      if (ticket_response.from == "Ticket_System") {
        if (ticket_response.message) {
          if (ticket_response.message.seatlist?.length > 0) {
            setBookedSeat(
              ticket_response.message.seatlist[0].seat_number.split(",")
            );
          }
        }
        setStruture(ticket_response.message);
      }
      if (ticket_response.from == "book_ticket") {
        if (ticket_response.status == "success") {
          addressFormik.resetForm();
          setSelectedCard("");
          setAddressInitialValues({ ...addressInitialValues, seat_id: "" });
          setSelectedTicketDetais([]);
          setSelectedTicketid([]);
          get_Stage({
            stage_id: router?.query.sid ? router?.query.sid : "1",
            auction_id: router?.query.aid ? router?.query.aid : "0",
          });
          setAlert(ticket_response.message, "success");
        } else {
          setAlert(ticket_response.message, "error");
        }
        setDonarLoading(false);
        setLoading(false);
        setTicketSteps(0);
      }
      if (ticket_response.from == "donorcarddetails_bidderdetails_page") {
        setCardDetails(
          ticket_response.message?.cardlist
            ? ticket_response.message.cardlist
            : []
        );
      }
      if (
        ticket_response.from == "check_ticket_status" ||
        ticket_response.from == "before_payment_check_available_seat"
      ) {
        if (
          Array.isArray(ticket_response.message) &&
          ticket_response.message.length > 0
        ) {
          var tic_steps = ticket_steps;
          ticket_response.message.map((data) => {
            if (parseInt(data.isavailable) == 0) {
              var tic_details = selected_ticket_details.filter(
                (val) => val.seat_id == data.seat_id
              )[0];
              removeTicket(tic_details);
              setAlert(
                "Seat Name(" + tic_details.seat_name + ") is not available now",
                "error"
              );
              get_Stage({
                stage_id: router?.query.sid ? router?.query.sid : "1",
                auction_id: router?.query.aid ? router?.query.aid : "0",
              });
              tic_steps = 0;
              setTicketSteps(0);
            }
          });
          if (
            ticket_response.from == "before_payment_check_available_seat" &&
            tic_steps == 1
          ) {
            setLoading(true);
            addressFormik.handleSubmit();
          }
        }
      }
    }
  }, [ticket_response]);

  const ticketInfo = [
    {
      label: "Tickets",
      name: "tickets",
      type: "select",
      placeholder: "select tickets",
      class: "",
      autoFocus: true,
      formik: formik,
    },
  ];

  const validateAddress = Yup.object({
    first_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z]*$/g, "Special characters and numbers are not allowed")
      .max(20, "20 characters max")
      .required("Required"),
    last_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z]*$/g, "Special characters and numbers are not allowed")
      .max(20, "20 characters max")
      .required("Required"),
    phone: Yup.string()
      .trim()
      .matches(/^[0-9- +()]*$/g, "Only numbers are allowed")
      .min(12, "Minimum 10 digits phone number")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email format")
      .max(250, "250 characters max")
      .required("Required"),
    //country: Yup.string().trim().required("Required!"),
    city: Yup.string()
      .trim()
      .matches(/^[0-9a-zA-Z ]*$/g, "No special charaters allowed.")
      .required("Required!"),
    //state: Yup.string().trim().required("Required!"),
    zip: Yup.string()
      .trim()
      .matches(/^[0-9]*$/g, "Only positive numbers allowed")
      .min(5, "Minimum 5 Numbers")
      .max(6, "Maximum 6 Numbers")
      .required("Required!"),
    address: Yup.string().trim().required("Required!"),
    extradate: !selected_card ? Yup.string().required("Required!") : "",
    extrayear: !selected_card ? Yup.string().required("Required!") : "",
    extracvv: !selected_card
      ? Yup.string()
          .required("Required!")
          .min(3, "Mininum 3 Numbers required")
          .max(4, "Maximum 3 Numbers required")
      : "",
    cardhname: !selected_card
      ? Yup.string()
          .trim()
          .matches(
            /^[a-z A-Z]*$/g,
            "The special characters and numbers are not allowed!"
          )
          .required("Required!")
      : "",
    extracardnumber: !selected_card
      ? Yup.string()
          .min(12, "Invalid credit card number!")
          .max(18, "Invalid credit card number!")
          .required("Required!")
      : "",
  });

  const addressFormik = useFormik({
    initialValues: addressInitialValues,
    validationSchema: validateAddress,
    onSubmit: async (values) => {
      setDonarLoading(true);
      // var orinal_country = values["country"];
      // var original_state = values["state"];
      // let { name: countryName } = csc.getCountryById(values["country"]);
      // let { name: stateName } = csc.getStateById(values["state"]);
      var data_send = addressFormik.values;
      // data_send.country = countryName;
      // addressFormik.values.country = orinal_country;
      //data_send.state = original_state;
      data_send.cardcity = values.city;
      data_send.cardstate = values.state;
      data_send.zipcode = values.zip;
      selected_ticket_details.map((data, index) => {
        if (index == parseInt(selected_ticket_details.length - 1)) {
          data_send.seat_id += data.seat_id.toString();
        } else {
          data_send.seat_id += data.seat_id.toString() + ",";
        }
      });
      data_send.seat_obj = selected_ticket_details;
      data_send.amount = total_ticket_price;
      if (selected_card) {
        data_send.sourceID = selected_card;
      }
      book_tickets(data_send);
    },
    enableReinitialize: true,
  });

  const creditCardYearOptions = [];
  let date = new Date();
  let currentYear = date.getFullYear();
  let upToYear = parseInt(currentYear) + 25;
  for (let year = parseInt(currentYear); year < parseInt(upToYear); year++) {
    creditCardYearOptions.push({
      value: year,
      show: year,
    });
  }

  const creditCardMonthOptions = [];
  for (let month = parseInt(1); month <= parseInt(12); month++) {
    let monthValue = ("0" + month).slice(-2);
    creditCardMonthOptions.push({
      value: monthValue,
      show: monthValue,
    });
  }

  const paymentdetails = [
    {
      label: "Card Holder Name",
      type: "text",
      placeholder: "Enter card holder name",
      class: "col-6",
      name: "cardhname",
      formik: addressFormik,
    },
    {
      label: "Card No",
      type: "number",
      placeholder: "Enter your card no",
      class: "col-6",
      name: "extracardnumber",
      formik: addressFormik,
    },
    {
      label: "Expiry Month",
      placeholder: "MM",
      class: "col-sm-6 col-12",
      type: "select",
      name: "extradate",
      options: creditCardMonthOptions,
      formik: addressFormik,
    },
    {
      label: "Expiry Year",
      placeholder: "YYYY",
      class: "col-sm-6 col-12",
      type: "select",
      name: "extrayear",
      options: creditCardYearOptions,
      formik: addressFormik,
    },
    {
      label: "Cvv",
      type: "number",
      placeholder: "Enter your Cvv",
      class: "col-sm-6 col-12",
      name: "extracvv",
      formik: addressFormik,
    },
    // {
    //   label: "Country",
    //   placeholder: "Select your country",
    //   class: "col-12 col-sm-6",
    //   type: "select",
    //   options: allCountries,
    //   name: "country",
    //   formik: addressFormik,
    // },
    // {
    //   label: "State",
    //   placeholder: "Select your state",
    //   class: "col-12 col-sm-6",
    //   type: "select",
    //   options: statesInLocal,
    //   name: "state",
    //   formik: addressFormik,
    // },
  ];

  // const AirbnbSlider = withStyles({
  //   root: {
  //     color: "#70a340",
  //     height: 3,
  //     padding: "13px 0",
  //   },
  //   thumb: {
  //     height: 27,
  //     width: 27,
  //     backgroundColor: "#fff",
  //     border: "1px solid currentColor",
  //     marginTop: -12,
  //     marginLeft: -13,
  //     boxShadow: "#ebebeb 0 2px 2px",
  //     "&:focus, &:hover, &$active": {
  //       boxShadow: "#ccc 0 2px 3px 1px",
  //     },
  //     "& .bar": {
  //       // display: inline-block !important;
  //       height: 9,
  //       width: 1,
  //       backgroundColor: "currentColor",
  //       marginLeft: 1,
  //       marginRight: 1,
  //     },
  //   },
  //   active: {},
  //   track: {
  //     height: 3,
  //   },
  //   rail: {
  //     color: "#ccc",
  //     opacity: 1,
  //     height: 3,
  //   },
  // })(Slider);

  // drawer

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="filterTit">
        <h4>More Filters</h4>
        <span
          className="material-icons-outlined"
          onClick={toggleDrawer(anchor, false)}
        >
          close
        </span>
      </div>
    </div>
  );

  // drawer end

  // tabs

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    var ticket_details = JSON.parse(event.target.value);
    var selected_ticket_details1 = selected_ticket_details,
      selected_ticket_id1 = selected_ticket_id,
      total_price = total_ticket_price;
    if (event.target.checked) {
      selected_ticket_details1.push(ticket_details);
      setSelectedTicketDetais((pre) => selected_ticket_details1);
      selected_ticket_id1.push(ticket_details.seat_id);
      setSelectedTicketid([...selected_ticket_id1]);
      total_price = parseInt(total_price) + parseInt(ticket_details.price);
      setTotalTicketPrice(total_price);
    } else {
      selected_ticket_details1 = selected_ticket_details1.filter(
        (val) => val.seat_id != ticket_details.seat_id
      );
      setSelectedTicketDetais((pre) => selected_ticket_details1);
      selected_ticket_id1 = selected_ticket_id1.filter(
        (val) => val != ticket_details.seat_id
      );
      setSelectedTicketid([...selected_ticket_id1]);
      total_price = parseInt(total_price) - parseInt(ticket_details.price);
      setTotalTicketPrice(total_price);
    }
    setTicketSteps(0);
  };

  const removeTicket = (data) => {
    var ticket_details = data;
    var selected_ticket_details1 = selected_ticket_details,
      selected_ticket_id1 = selected_ticket_id,
      total_price = total_ticket_price;
    selected_ticket_details1 = selected_ticket_details1.filter(
      (val) => val.seat_id != ticket_details.seat_id
    );
    setSelectedTicketDetais((pre) => selected_ticket_details1);
    selected_ticket_id1 = selected_ticket_id1.filter(
      (val) => val != ticket_details.seat_id
    );
    setSelectedTicketid([...selected_ticket_id1]);
    total_price = parseInt(total_price) - parseInt(ticket_details.price);
    setTotalTicketPrice(total_price);
  };

  const nextstep = (type) => {
    if (type == "next") {
      var seat_id = "";
      selected_ticket_details.map((data, index) => {
        if (index == parseInt(selected_ticket_details.length - 1)) {
          seat_id += data.seat_id.toString();
        } else {
          seat_id += data.seat_id.toString() + ",";
        }
      });
      check_ticket_avialable({
        seat_id: seat_id,
        stage_id: router?.query.sid ? router?.query.sid : "0",
        auction_id: router?.query.aid ? router?.query.aid : "0",
      });
      setTicketSteps(parseInt(ticket_steps) + 1);
    } else {
      setTicketSteps(parseInt(ticket_steps) - 1);
    }
    if (parseInt(ticket_steps) + 1 == 1) {
      getdonarexistingcard({ user_id: user?.id ? user.id : "" });
    }
  };

  const handleSubmit = () => {
    var seat_id = "";
    selected_ticket_details.map((data, index) => {
      if (index == parseInt(selected_ticket_details.length - 1)) {
        seat_id += data.seat_id.toString();
      } else {
        seat_id += data.seat_id.toString() + ",";
      }
    });
    check_ticket_avialable({
      seat_id: seat_id,
      stage_id: router?.query.sid ? router?.query.sid : "0",
      auction_id: router?.query.aid ? router?.query.aid : "0",
      from: "before_payment_check_available_seat",
    });
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <div className="quickPicks">{children}</div>}
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loaders name="home" isLoading={loading} />
      ) : (
        <>
          {ticket_struture?.stagelist?.length > 0 ? (
            <>
              <div className="ticHdrBg">
                <div className="customContainer">
                  <div className="ticHdr">
                    <div className="ticPic">
                      <figure className="ticFig">
                        <img
                          src={getImages_url_check(auctionDetails.avatar, "")}
                          alt="/assets/images/as.png"
                        />
                      </figure>
                      <div className="ticDets">
                        <h4 className="ticTit">
                          {ticket_struture.stagelist[0].stage_name}{" "}
                          <small onClick={handleClickOpen}>More Info</small>
                        </h4>
                        {auctionDetails?.date_added ? (
                          <span className="ticTim">
                            {moment(auctionDetails.date_added).format("dddd")} •{" "}
                            {moment(auctionDetails.date_added).format("MMMM")}
                            {""}
                            {moment(auctionDetails.date_added).format(
                              "D"
                            )} •{" "}
                            {moment(auctionDetails.date_added).format(
                              "hh:mm A"
                            )}
                          </span>
                        ) : (
                          ""
                        )}
                        <Link href="#" className="ticLoc">
                          {auctionDetails?.state ? auctionDetails.state : ""} ,
                          {auctionDetails?.city ? auctionDetails.city : ""}
                        </Link>
                      </div>
                    </div>
                    {/* <div className="ticInfo">
                  <span className="ticInfospan">
                    Important Event Info: Fouille obligatoire / caméras
                    interdites <small onClick={handlemenuClickOpen}>more</small>
                  </span>
                </div> */}
                  </div>
                </div>
              </div>
              <div className="ticBdy">
                <div className="ticbench">
                  <div className="stadiumWrapper">
                    <div className="stageWrapper">
                      <p className="m-0">STAGE</p>
                    </div>
                    <form id="postform2">
                      {/* <div className="row">
                <div className="col-md-12">
                  <TextField
                    id="outlined-basic"
                    label="Stage Name"
                    variant="outlined"
                  />
                </div>
              </div> */}
                      <hr />
                      {ticket_struture.stagelist[0].stage_obj.map((data) => (
                        <>
                          <div className="row flrPrcInfo">
                            <div className="col-md-6">
                              <p>
                                Floor Name: <b>{data.floor_name}</b>
                              </p>
                            </div>
                            <div className="col-md-6 text-right">
                              <p>
                                Price: <b>{currencyFormat(data.floor_price)}</b>
                              </p>
                            </div>
                          </div>
                          <>
                            {data.floor_type == "seat" &&
                              data[data.array_name].map((val) => (
                                <>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="generalRowWrapper rm_floor_1_floor floor_1_seatadd">
                                        <div className="chairGrid">
                                          {val[val.array_name].map((val1) => (
                                            <>
                                              <LightTooltip
                                                arrow
                                                placement="top"
                                                title={
                                                  <>
                                                    <div className="TicketTooltip">
                                                      <div className="d-flex align-items-center justify-content-between">
                                                        <div className="stIfoTxt">
                                                          <label>Seat No</label>
                                                          <p>
                                                            {val1.seat_name}
                                                          </p>
                                                        </div>
                                                        <div className="stIfoTxt text-right priceCont">
                                                          <label>Price</label>
                                                          <p>
                                                            {currencyFormat(
                                                              data.floor_price
                                                            )}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </>
                                                }
                                              >
                                                <label
                                                  style={
                                                    selected_ticket_id.includes(
                                                      val1.seat_id
                                                    )
                                                      ? { background: "orange" }
                                                      : booked_seat.includes(
                                                          val1.seat_id
                                                        )
                                                      ? {
                                                          background: "#ff9898",
                                                        }
                                                      : {}
                                                  }
                                                  className={`chairContainer ${
                                                    booked_seat.includes(
                                                      val1.seat_id
                                                    )
                                                      ? "booked"
                                                      : ""
                                                  }`}
                                                  htmlFor={val1.seat_id}
                                                >
                                                  <span
                                                    className="chk-span"
                                                    tabindex="3"
                                                  ></span>
                                                  {val1.seat_name}
                                                  <input
                                                    type="checkbox"
                                                    className="floor_1 floor_1_A"
                                                    value={JSON.stringify({
                                                      ...val1,
                                                      ...{
                                                        price: data.floor_price,
                                                        type: data.floor_type,
                                                      },
                                                    })}
                                                    id={val1.seat_id}
                                                    data-level="A"
                                                    data-name=""
                                                    data-type="seat"
                                                    data-view="enable"
                                                    disabled={
                                                      booked_seat.includes(
                                                        val1.seat_id
                                                      )
                                                        ? true
                                                        : false
                                                    }
                                                    checked={
                                                      selected_ticket_id.includes(
                                                        val1.seat_id
                                                      )
                                                        ? true
                                                        : false
                                                    }
                                                    onClick={handleClick}
                                                    data-parsley-multiple="A1"
                                                  />
                                                  <div className="chkWrpr">
                                                    <span className="material-icons">
                                                      check
                                                    </span>
                                                  </div>
                                                </label>
                                              </LightTooltip>
                                            </>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            {data.floor_type == "table" && (
                              <>
                                <div className="ticketTableGrid rm_floor_2_floor floor_2_tableadd">
                                  {data[data.array_name].map((val) => (
                                    <div>
                                      <div className="tableWrapper">
                                        {val[val.array_name].map(
                                          (val1, index) => (
                                            <div
                                              className={`chair chair_${
                                                index + 1
                                              }`}
                                            >
                                              <LightTooltip
                                                arrow
                                                placement="top"
                                                title={
                                                  <>
                                                    <div className="TicketTooltip">
                                                      <div className="d-flex align-items-center justify-content-between">
                                                        <div className="stIfoTxt">
                                                          <label>Seat No</label>
                                                          <p>
                                                            {val1.seat_name}
                                                          </p>
                                                        </div>
                                                        <div className="stIfoTxt text-right priceCont">
                                                          <label>Price</label>
                                                          <p>
                                                            {currencyFormat(
                                                              data.floor_price
                                                            )}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </>
                                                }
                                              >
                                                <label
                                                  style={
                                                    selected_ticket_id.includes(
                                                      val1.seat_id
                                                    )
                                                      ? { background: "orange" }
                                                      : booked_seat.includes(
                                                          val1.seat_id
                                                        )
                                                      ? {
                                                          background: "#ff9898",
                                                        }
                                                      : {}
                                                  }
                                                  className={`chairContainer ${
                                                    booked_seat.includes(
                                                      val1.seat_id
                                                    )
                                                      ? "booked"
                                                      : ""
                                                  }`}
                                                >
                                                  {index + 1}
                                                  <input
                                                    type="checkbox"
                                                    className="floor_2 floor_2_t1_1"
                                                    id={val1.seat_id}
                                                    // value="t1-1"
                                                    data-level="F2_t1"
                                                    data-name="F2-T1-1"
                                                    data-type="table"
                                                    data-view="enable"
                                                    value={JSON.stringify({
                                                      ...val1,
                                                      ...{
                                                        price: data.floor_price,
                                                        type: data.floor_type,
                                                      },
                                                    })}
                                                    checked={
                                                      selected_ticket_id.includes(
                                                        val1.seat_id
                                                      )
                                                        ? true
                                                        : false
                                                    }
                                                    onClick={handleClick}
                                                    disabled={
                                                      booked_seat.includes(
                                                        val1.seat_id
                                                      )
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                  <div className="chkWrpr">
                                                    <span className="material-icons">
                                                      check
                                                    </span>
                                                  </div>
                                                </label>
                                              </LightTooltip>
                                            </div>
                                          )
                                        )}
                                        <div className="tableShp">
                                          {val.array_name.toUpperCase()}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                          <hr />
                        </>
                      ))}

                      {/* <div>
                    <div className="ticketTableGrid rm_floor_2_floor floor_2_tableadd">
                      <div className="tableWrapper">
                        <div className="chair chair_1">
                          <label className="chairContainer">
                            1
                            <input
                              type="checkbox"
                              className="floor_2 floor_2_t1_1"
                              id="2t1-1"
                              value="t1-1"
                              data-level="F2_t1"
                              data-name="F2-T1-1"
                              data-type="table"
                              data-view="enable"
                            />
                            <div className="chkWrpr">
                              <span className="material-icons">check</span>
                            </div>
                          </label>
                        </div>
                        <div className="chair chair_2">
                          <label className="chairContainer">
                            2
                            <input
                              type="checkbox"
                              className="floor_2 floor_2_t1_1"
                              id="2t1-1"
                              value="t1-1"
                              data-level="F2_t1"
                              data-name="F2-T1-1"
                              data-type="table"
                              data-view="enable"
                            />
                            <div className="chkWrpr">
                              <span className="material-icons">check</span>
                            </div>
                          </label>
                        </div>
                        <div className="chair chair_3">
                          <label className="chairContainer">
                            3
                            <input
                              type="checkbox"
                              className="floor_2 floor_2_t1_1"
                              id="2t1-1"
                              value="t1-1"
                              data-level="F2_t1"
                              data-name="F2-T1-1"
                              data-type="table"
                              data-view="enable"
                            />
                            <div className="chkWrpr">
                              <span className="material-icons">check</span>
                            </div>
                          </label>
                        </div>
                        <div className="chair chair_4">
                          <label className="chairContainer">
                            4
                            <input
                              type="checkbox"
                              className="floor_2 floor_2_t1_1"
                              id="2t1-1"
                              value="t1-1"
                              data-level="F2_t1"
                              data-name="F2-T1-1"
                              data-type="table"
                              data-view="enable"
                            />
                            <div className="chkWrpr">
                              <span className="material-icons">check</span>
                            </div>
                          </label>
                        </div>
                        <div className="chair chair_5">
                          <label className="chairContainer">
                            5
                            <input
                              type="checkbox"
                              className="floor_2 floor_2_t1_1"
                              id="2t1-1"
                              value="t1-1"
                              data-level="F2_t1"
                              data-name="F2-T1-1"
                              data-type="table"
                              data-view="enable"
                            />
                            <div className="chkWrpr">
                              <span className="material-icons">check</span>
                            </div>
                          </label>
                        </div>
                        <div className="chair chair_6">
                          <label className="chairContainer">
                            6
                            <input
                              type="checkbox"
                              className="floor_2 floor_2_t1_1"
                              id="2t1-1"
                              value="t1-1"
                              data-level="F2_t1"
                              data-name="F2-T1-1"
                              data-type="table"
                              data-view="enable"
                            />
                            <div className="chkWrpr">
                              <span className="material-icons">check</span>
                            </div>
                          </label>
                        </div>
                        <div className="chair chair_7">
                          <label className="chairContainer">
                            7
                            <input
                              type="checkbox"
                              className="floor_2 floor_2_t1_1"
                              id="2t1-1"
                              value="t1-1"
                              data-level="F2_t1"
                              data-name="F2-T1-1"
                              data-type="table"
                              data-view="enable"
                            />
                            <div className="chkWrpr">
                              <span className="material-icons">check</span>
                            </div>
                          </label>
                        </div>
                        <div className="chair chair_8">
                          <label className="chairContainer">
                            8
                            <input
                              type="checkbox"
                              className="floor_2 floor_2_t1_1"
                              id="2t1-1"
                              value="t1-1"
                              data-level="F2_t1"
                              data-name="F2-T1-1"
                              data-type="table"
                              data-view="enable"
                            />
                            <div className="chkWrpr">
                              <span className="material-icons">check</span>
                            </div>
                          </label>
                        </div>
                        <div className="tableShp">F2-T1</div>
                      </div>
                    </div>
                  </div> */}
                    </form>
                  </div>
                </div>
                <div className="ticFullInfo">
                  {/* <div className="hdrPadd">
                <div className="ticselectcard">
                  <div className="ticCnt">
                    {Object.values(mapData(ticketInfo))}
                  </div>
                  <div className="ticftr">
                    {["right"].map((anchor) => (
                      <React.Fragment key={anchor}>
                        <Button onClick={toggleDrawer(anchor, true)}>
                          <span className="material-icons-outlined">tune</span>{" "}
                          Filter
                        </Button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="ticRange">
                  <div className="ticstartrange">
                    <TextField
                      id="outlined-basic"
                      label=""
                      variant="outlined"
                    />
                  </div>
                  <div className="ticprogress">
                    <AirbnbSlider
                      getAriaLabel={(index) =>
                        index === 0 ? "Minimum price" : "Maximum price"
                      }
                      defaultValue={[20, 40]}
                    />
                  </div>
                  <div className="ticendrange">
                    <TextField
                      id="outlined-basic"
                      label=""
                      variant="outlined"
                    />
                  </div>
                </div>
              </div> */}
                  <div className="ticTabvarient" ref={containerRef}>
                    {/* {["right"].map((anchor) => (
                  <SwipeableDrawer
                    anchor={anchor}
                    open={state[anchor]}
                    className={classes.drawer}
                    onClose={toggleDrawer(anchor, false)}
                    onOpen={toggleDrawer(anchor, true)}
                  >
                    {list(anchor)}
                  </SwipeableDrawer>
                ))} */}
                    <div>
                      {/* <AppBar position="static" color="default">
                    <Tabs
                      value={value}
                      indicatorColor="primary"
                      textColor="primary"
                      onChange={handleChange}
                      aria-label="disabled tabs example"
                    >
                      <Tab label="Lowest Price" {...a11yProps(0)} />
                      <Tab label="Best Seats" {...a11yProps(1)} />
                    </Tabs>
                  </AppBar> */}
                      {parseInt(ticket_steps) == 0 ? (
                        <div className="tabPanelminH">
                          <TabPanel value={value} index={0}>
                            {selected_ticket_details.length > 0 ? (
                              <>
                                <h4 className="stsHdr">Your Tickets</h4>
                                {selected_ticket_details.map((data) => (
                                  <div className="ticketInfo">
                                    <IconButton
                                      className="cancelBtn"
                                      onClick={() => removeTicket(data)}
                                    >
                                      <span className="material-icons">
                                        cancel
                                      </span>
                                    </IconButton>
                                    <div className="seatsInfo">
                                      <div className="stLtr">
                                        <label>Seat Name</label>
                                        <p>{data.seat_name.toUpperCase()}</p>
                                      </div>
                                      <div className="stLtr">
                                        <label>
                                          {data.type == "seat"
                                            ? "Seat Row"
                                            : "Table Name"}
                                        </label>
                                        <p>{data.seat_row.toUpperCase()}</p>
                                      </div>
                                      <div className="stLtr stPrcng">
                                        <label>Price</label>
                                        <p>{currencyFormat(data.price)}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <div className="ttlPriceCntnr">
                                  <p>
                                    Total Ticket Price (
                                    {selected_ticket_details.length}{" "}
                                    {selected_ticket_details.length > 1
                                      ? "Tickets"
                                      : "Ticket"}
                                    )
                                  </p>
                                  <h5 className="totlPcVl">
                                    {currencyFormat(total_ticket_price)}
                                  </h5>
                                </div>
                                <div className="tcktNxtBtn d-flex align-items-center justify-content-end">
                                  <SecondaryButton
                                    btnSize="small"
                                    label="Next"
                                    onClick={(e) => nextstep("next")}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <h4 className="stsHdr">Stage Details</h4>
                                {ticket_struture.stagelist[0].stage_obj.map(
                                  (data) => (
                                    <div className="split-content">
                                      <div className="split-content__primary">
                                        <h5 className="quick-picks__item-desc">
                                          Floor Name: {data.floor_name}
                                        </h5>
                                        <h5 className="quick-picks__item-desc">
                                          Price:
                                          {currencyFormat(data.floor_price)}
                                        </h5>
                                      </div>
                                      {data.floor_type == "seat" ? (
                                        <div className="split-content__secondary">
                                          <h5 className="quick-picks__button">
                                            Total Row
                                            {data[data.array_name].length > 1
                                              ? "s: "
                                              : ": "}
                                            {data[data.array_name].length}
                                          </h5>
                                          <h5 className="quick-picks__button">
                                            Total Seats:
                                            {data[data.array_name].length * 10}
                                          </h5>
                                        </div>
                                      ) : (
                                        <div className="split-content__secondary">
                                          <h5 className="quick-picks__button">
                                            Total Table
                                            {data[data.array_name].length > 1
                                              ? "s: "
                                              : ": "}
                                            {data[data.array_name].length}
                                          </h5>
                                          <h5 className="quick-picks__button">
                                            Total Seats:
                                            {data[data.array_name].length * 8}
                                          </h5>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                                <br></br>
                              </>
                            )}
                          </TabPanel>
                        </div>
                      ) : parseInt(ticket_steps) == 1 ? (
                        <div className="tabPanelminH">
                          {/* <TabPanel value={value} index={0}> */}
                          {selected_ticket_details.length > 0 ? (
                            <>
                              <h4 className="stsHdr">
                                Confirmed Ticket Details
                              </h4>
                              {selected_ticket_details.map((data) => (
                                <>
                                  <div className="ticketInfo">
                                    <div className="seatsInfo">
                                      <div className="stLtr">
                                        <label>Seat Name</label>
                                        <p>{data.seat_name.toUpperCase()}</p>
                                      </div>
                                      <div className="stLtr">
                                        <label>
                                          {data.type == "seat"
                                            ? "Seat Row"
                                            : "Table Name"}
                                        </label>
                                        <p>{data.seat_row.toUpperCase()}</p>
                                      </div>
                                      <div className="stLtr stPrcng">
                                        <label>Price</label>
                                        <p>{currencyFormat(data.price)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                              <div className="ttlPriceCntnr">
                                <p>
                                  Total Ticket Price (
                                  {selected_ticket_details.length}{" "}
                                  {selected_ticket_details.length > 1
                                    ? "Tickets"
                                    : "Ticket"}
                                  )
                                </p>
                                <h5 className="totlPcVl">
                                  {currencyFormat(total_ticket_price)}
                                </h5>
                              </div>
                              <h4 className="stsHdr mt-4">Your Details</h4>
                              {user_details.first_name != "" &&
                                user_details.last_name != "" &&
                                user_details.email != "" &&
                                user_details.phone != "" && (
                                  <div className="fnlDntnInfo">
                                    <h4 className="usrNameVale">
                                      {user_details.first_name +
                                        " " +
                                        user_details.last_name}
                                    </h4>
                                    <div className="usrCntctInfo d-flex align-items-center justify-content-start mt-4">
                                      <p className="mr-4">
                                        <span className="material-icons">
                                          mail
                                        </span>
                                        <span className="usrEmail">
                                          {user_details.email}
                                        </span>
                                      </p>

                                      <p>
                                        <span className="material-icons">
                                          phone
                                        </span>
                                        {user_details.phone}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              {/* <div className="tcktNxtBtn d-flex align-items-center justify-content-between">
                              <SecondaryButton
                                btnSize="small"
                                label="Back"
                                onClick={(e) => nextstep("pre")}
                              />
                              <SecondaryButton
                                btnSize="small"
                                label="Next"
                                onClick={(e) => nextstep("next")}
                              />
                            </div> */}
                              <h4 className="stsHdr mt-4">Payment Details</h4>
                              <div className="tabPanelminH">
                                <div className="paymWrpr p-2">
                                  {carddetails.length > 0 ? (
                                    <div className="row">
                                      <div className="col-4">
                                        Use Existing Card details
                                      </div>
                                      <div className="col-8">
                                        <CustomSelect
                                          label={"Card Details"}
                                          value={selected_card}
                                          onChange={(e) =>
                                            setSelectedCard(e.target.value)
                                          }
                                        >
                                          <option value="">
                                            {"Select Card"}
                                          </option>
                                          {carddetails.map((val) => (
                                            <option value={val.id}>
                                              {"XXXX XXXX XXXX XXXX " +
                                                val.last4}
                                            </option>
                                          ))}
                                        </CustomSelect>
                                      </div>
                                      {selected_card == "" ? (
                                        <p className="text-center w-100">OR</p>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {selected_card == "" ? (
                                    <div className="row">
                                      {Object.values(mapData(paymentdetails))}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="tcktNxtBtn d-flex align-items-center justify-content-between">
                                  <SecondaryButton
                                    label="Back"
                                    onClick={(e) => nextstep("pre")}
                                  />
                                  <PrimaryButton
                                    disabled={donar_loading ? true : false}
                                    label="Make Payment"
                                    type="submit"
                                    onClick={(e) => handleSubmit()}
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <p>Please Select Ticket Details</p>
                          )}
                          {/* </TabPanel> */}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="tckStatusWrpr">
                  {/* <h4 className="">Ticket Status</h4> */}
                  <div className="tcktStsGrid">
                    <div className="stWrp">
                      <div className="seatDiv avlblSeat"></div>
                      <p className="m-0 ml-2">Available Seat</p>
                    </div>
                    <div className="stWrp">
                      <div className="seatDiv sltdSeat"></div>
                      <p className="m-0 ml-2">Selected Seat</p>
                    </div>
                    <div className="stWrp">
                      <div className="seatDiv bkdSeat"></div>
                      <p className="m-0 ml-2">Booked Seat</p>
                    </div>
                  </div>
                </div>
              </div>

              <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth={true}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title" className="diaglogTitle">
                  More Info
                  <span
                    className="material-icons-outlined"
                    onClick={handleClose}
                  >
                    close
                  </span>
                </DialogTitle>

                <DialogContent dividers={"paper"}>
                  <h3 className="mb-3">{auctionDetails.title}</h3>
                  {/* <h5>
                <b>Important Event Info: </b> Fouille obligatoire / caméras
                interdites
              </h5> */}
                  <hr />
                  <ul className="list-unstyled">
                    <li>
                      <b>Date</b> :{" "}
                      {moment(auctionDetails.date_added).format("dddd")} •{" "}
                      {moment(auctionDetails.date_added).format("MMMM")}
                      {""}
                      {moment(auctionDetails.date_added).format("D")} •{" "}
                      {moment(auctionDetails.date_added).format("hh:mm A")}
                    </li>
                    <li>
                      <b>Venue</b> :{" "}
                      {auctionDetails?.state ? auctionDetails.state : ""} ,
                      {auctionDetails?.city ? auctionDetails.city : ""}
                    </li>
                  </ul>
                  <hr />

                  <h5>
                    <b>Additional Info</b>
                  </h5>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: auctionDetails.description,
                    }}
                  ></p>
                  {/* <h5>
                <b>Ticket Limits</b>
              </h5> */}
                  {/* <p>
                Il y a une limite de 8 billets pour cet événement. There is an
                overall 8 ticket limit for this event.
              </p> */}
                </DialogContent>
              </Dialog>

              <Dialog
                open={openmenu}
                onClose={handlemenuClose}
                maxWidth="sm"
                fullWidth={true}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title" className="diaglogTitle">
                  Important Event Info
                  <span
                    className="material-icons-outlined"
                    onClick={handlemenuClose}
                  >
                    close
                  </span>
                </DialogTitle>

                <DialogContent dividers={"paper"}>
                  <h3 className="mb-3">
                    Fouille obligatoire / caméras interdites
                  </h3>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
}

export default Ticketing;
