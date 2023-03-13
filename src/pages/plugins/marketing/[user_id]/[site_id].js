import { useState, useEffect, useContext, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { mapData, currencyFormat } from "@/common/components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { template1 } from "@/components/organisms/marketing/defaultEmail/template1";
import { template2 } from "@/components/organisms/marketing/defaultEmail/template2";
import { template3 } from "@/components/organisms/marketing/defaultEmail/template3";
import "animate.css";
import Chart from "../chart";
import AuthContext from "@/context/auth/authContext";
import ProductContext from "@/context/product/productContext";
import Geocode from "react-geocode";
import CustomSelect from "@/components/atoms/Inputs/CustomSelect";
import AlertContext from "@/context/alert/alertContext";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import csc from "country-state-city";
import Loaders from "@/components/molecules/Loaders";
import Dialog from "@material-ui/core/Dialog";
import TemplateBuilder from "../TemplateBuilder";
import moment from "moment";
import Maps from "../maps";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: "inline-block",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Select a location", "Create a template", "Make payment"];
}

export default function HorizontalNonLinearStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [selected_card, setSelectedCard] = useState("");
  const steps = getSteps();
  const [bidder_details, setBidderDetails] = useState({});
  const [carddetails, setCardDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, loadUser } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [mapdisplaydata, setMapData] = useState([]);
  const router = useRouter();
  const {
    getbidderlocationdetails,
    getbiddercountdetails,
    sellerMakePayment,
    getsellerexistingcard,
    getStoreProducts,
    store_products,
    store_details,
    responseStatus,
    clearResponse,
  } = useContext(ProductContext);
  const [site_id, setSiteid] = useState("");
  const [is_seller, setSeller] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState("template1");
  const [localTemplate, setLocaltemplate] = useState({
    template1: "",
    template2: "",
    template3: "",
    preview: "",
  });
  const [statesInLocal, setStatesinLocal] = useState([]);
  const [loader, setLoaders] = useState(true);
  const [location_details, setLocation] = useState(null);
  const [selected_location_details, setSelecedLoc] = useState([]);
  const [select_partial, setPartial] = useState(null);
  const [mailProducts, setMailProducts] = useState([]);
  const templateRef = useRef(null);
  const [newRef, setNewRef] = useState("");
  //Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY)
  // Geocode.setApiKey("ALIzaSyALrSTy6NpqdhIOUs3IQMfvjh71td2suzY")
  // Geocode.setLanguage("en")
  // const getLocationdetails=(location)=>{
  //   console.log("llllllllllllllllllllll","Austin")
  //   Geocode.fromAddress(location).then((res)=>{
  //     console.log("llllllllllllllllllllll",res)
  //     const {lat,lng}=res.results[0].geometry.location;
  //     console.log("llllllllllllllllllllll",lat,lng)
  //     //return {lat,lng}
  //   })
  // }

  useEffect(() => {
    setMailProducts(store_products);
  }, [store_products]);
  useEffect(() => {
    if (mailProducts.length) {
      var temp1 = "";
      var temp2 = "";
      var temp3_section_one = "";
      var temp3_section_two = "";
      var logo =
        process.env.NEXT_PUBLIC_SELLER_DOMAIN +
        "/uploads/store/" +
        store_details?.logo;
      var viewAllUrl = window.location.origin + "/search";
      mailProducts?.map((val, index) => {
        var multiples = index % 3;
        var basepro_link =
          window.location.origin +
          "/productView/" +
          val.id +
          "?auctionId=" +
          val.lotof +
          "&auctionLotId=" +
          val.id;
        var pro_img = val.avatar
          ? val.content_head1 == 0
            ? process.env.NEXT_PUBLIC_API_DOMAIN +
              "/uploads/product/" +
              val.avatar
            : process.env.NEXT_PUBLIC_IMAGE_URL + val.avatar
          : logo;
        temp1 +=
          '<table style="padding:0 10px 25px 0;" width="260" border="0" cellspacing="0" cellpadding="0" align="left" style="border-collapse:collapse"> <tbody> <tr> <td align="center" valign="top" style="padding:0px 0px 0px 0px" width="110"> <table width="110" border="0" cellspacing="0" cellpadding="0" align="center" style="border:solid 1px #e6e6e6;border-collapse:collapse"> <tbody> <tr> <td height="100" bgcolor="#ffffff" align="center" valign="center" style="font-size:0;line-height:0;padding:5px 5px 5px 5px"> <a href="' +
          basepro_link +
          '" target="_blank"> <img src="' +
          pro_img +
          '" alt="" style="width: 100px; height: 130px; margin: 0; padding: 0; border: 0; display: block; object-fit: contain;"> </a> </td> </tr> </tbody> </table> </td> <td align="left" valign="top" style="padding:0px 0px 0px 15px" width="210"> <font style="font-family:arial,helvetica,sans-serif;color:#211614;line-height:20px;font-size:14px;     overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"> <a href="' +
          basepro_link +
          '" style="color:#211614;font-weight:normal;text-decoration:none; line-height:20px;font-size:14px;overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; height: 40px;" target="_blank">' +
          val.title +
          '</a> </font> <br> <font style="font-family:arial,helvetica,sans-serif;color:#a2a3a5;line-height:20px;font-size:13px"> ' +
          moment(val.date_closed).format("MMM Do YYYY, h:mm:ss a") +
          '</font> <img src="https://ci4.googleusercontent.com/proxy/YIpzfh8K1o528YJpbcWX4NQ0n2FBYC7IGfC6n7T8LaOBcwcVJVyUO1eEp1bZgV6fXnrw5BBbk-qmIGFonDQRQB_Iej-POeXZnYITIPSfaABbPwm5soHjHXfCZeISzezvkh7p8PRrYA=s0-d-e1-ft#http://images.liveauctioneers.com/static/mail/images/auctions-ending-soon_spacer.gif" alt="" width="1" height="10" border="0" style="margin:0;padding:0;display:block"> <a href="' +
          basepro_link +
          '" target="_blank" style="cursor: pointer;"> <button style="cursor: pointer;border: 1px solid #70a340;background: #fff;padding: 8px 16px;color: #70a340;">BID NOW</button> </a> </td> </tr> </tbody> </table>';
        if (multiples === 0) {
          temp2 += "<tr class='cstmTable'>";
          temp3_section_two += "<tr>";
        }
        temp2 +=
          "<td align='center'> <table cellpadding='0' cellspacing='0' style='text - align: center'> <tbody> <tr> <td> <a href='" +
          basepro_link +
          "' target='_blank' data-saferedirecturl='" +
          basepro_link +
          "' ><img src='" +
          pro_img +
          "' width='214' height='214' style='display: block' alt='" +
          val.title +
          "' title='" +
          val.title +
          "' class='CToWUd'/></a > </td></tr><tr> <td> <div> <p style=' margin-top: 5px; margin-bottom: 10px; text-align: center; color: #363f4c; font-size: 11px; font-family: Gotham, Montserrat, Helvetica, sans-serif; ' > " +
          val.title +
          " <br/> AFGHAN COAT </p></div></td></tr><tr> <td height='30' valign='top'> <a style='text-decoration: none; color: #fff' href='" +
          basepro_link +
          "' target='_blank' data-saferedirecturl='" +
          basepro_link +
          "' ><div style=' border: 1px solid #59862f; padding: 5px; width: fit-content; font-size: 13px; background: #59862f; margin: auto; color: white; text-decoration: none; color: #fff; font-weight: 700; ' > Bid Now </div></a > </td></tr></tbody> </table> </td>";
        if (index === 0 || index === 1 || index === 2) {
          temp3_section_one +=
            '<tr><td align="left" style="padding: 35px 0px 0px 0px" valign="top"> <table align="left" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" width="285" > <tbody> <tr> <td align="left" bgcolor="#f1f1f1" style="font-size: 0; line-height: 0; padding: 0" valign="top" > <a data-saferedirecturl="" href="' +
            basepro_link +
            '" style="outline: none" target="_blank" title="" ><img alt="" border="0" class="CToWUd" height="285" hspace="0" src="' +
            pro_img +
            '" style="margin: 0; padding: 0; display: block" vspace="0" width="285" /> </a> </td> </tr> </tbody> </table><table align="right" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" width="252" > <tbody> <tr> <td align="left" style="line-height: 27px; font-size: 21px; padding: 0" valign="top" > <font size="4" style=" font-family: arial, helvetica, sans-serif; color: #211614; line-height: 27px; font-size: 21px; font-style: normal; " ><a data-saferedirecturl="" href="" style=" color: #211614; font-weight: normal; text-decoration: none; color: black; outline: none; " target="_blank" title="" ><strong>' +
            val.title +
            '</strong></a > </font> </td> </tr> <tr> <td align="left" style=" line-height: 19px; font-size: 14px; padding: 25px 0px 0px 0px; " valign="top" > <a data-saferedirecturl="' +
            basepro_link +
            '" href="' +
            basepro_link +
            '" style=" outline: none; background-color: #b12a77; color: #ffffff; border: 1px solid #b12a77; font-size: 18px; padding: 10px 40px; text-align: center; text-decoration: none; color: #fff; color: #fff; " target="_blank" title="Bid Now" >Bid Now </a> </td> </tr> </tbody> </table> </td></tr>';
        } else {
          temp3_section_two +=
            '<td align="" style="padding: 0" valign="top"><table align="" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" width="180"><tbody><tr><td align="center" bgcolor="#e6e6e6" style="font-size: 0; line-height: 0; padding: 0" valign="top"><a data-saferedirecturl="" href="' +
            basepro_link +
            '" style="outline: none" target="_blank" title=""><img alt="' +
            val.title +
            '" border="0" class="CToWUd" height="168" hspace="0" src="' +
            pro_img +
            '" style="margin: 0;padding: 0;border: solid 1px #e6e6e6;display: block;" vspace="0" width="168" /></a></td></tr><tr><td align="center" style="line-height: 19px;font-size: 14px;padding: 16px 0px 0px 0px;" valign="top"><font size="2" style="font-family: arial, helvetica, sans-serif;color: #211614;line-height: 19px;font-size: 14px;font-style: normal;"><a data-saferedirecturl="" href="' +
            basepro_link +
            '" style="color: #211614;font-weight: normal;text-decoration: none;color: black;outline: none;" target="_blank" title="">' +
            val.title +
            '</a></font></td></tr><tr><td align="center" style="font-size: 0; line-height: 0; padding: 15px 0px 35px 0px" valign="top"><div data-saferedirecturl="' +
            basepro_link +
            '" href="' +
            basepro_link +
            '" style="outline: none;background-color: #b12a77;color: #ffffff;border: 1px solid #b12a77;font-size: 18px;padding: 20px 40px;text-align: center;text-decoration: none;color: #fff;color: #fff;" target="_blank" title="Bid Now"><a data-saferedirecturl="' +
            basepro_link +
            '" href="' +
            basepro_link +
            '" style="outline: none;text-decoration: none;color: #fff;color: #fff;" target="_blank" title="">Bid Now</a></div></td></tr></tbody></table></td>';
        }

        if (multiples === 2) {
          temp2 += "</tr>";
          temp3_section_two += "</tr>";
        }
      });
      var temp_template1 = template1.replace("{{event.products}}", temp1);
      temp_template1 = temp_template1.replace("{{event.store_logo}}", logo);
      temp_template1 = temp_template1.replace("{{event.store_logo}}", logo);
      temp_template1 = temp_template1.replace(
        "{{event.view_all_url}}",
        viewAllUrl
      );
      var temp_template2 = template2.replace("{{event.products}}", temp2);
      temp_template2 = temp_template2.replace("{{event.store_logo}}", logo);
      temp_template2 = temp_template2.replace(
        "{{event.view_all_url}}",
        viewAllUrl
      );
      var temp_template3 = template3.replace(
        "{{event.section_one}}",
        temp3_section_one
      );
      temp_template3 = temp_template3.replace(
        "{{event.section_two}}",
        temp3_section_two
      );
      temp_template3 = temp_template3.replace("{{event.store_logo}}", logo);
      temp_template3 = temp_template3.replace("{{event.store_logo}}", logo);
      temp_template3 = temp_template3.replace("{{event.store_logo}}", logo);
      temp_template3 = temp_template3.replace(
        "{{event.view_all_url}}",
        viewAllUrl
      );
      setLocaltemplate({
        ...localTemplate,
        template1: temp_template1,
        template2: temp_template2,
        template3: temp_template3,
      });
    }
  }, [mailProducts]);
  console.log(router?.query, "routeruser_id");
  useEffect(() => {
    //console.log("respoccccccccccccccccccccccccccccccc",getLocationdetails("Austin"))
    if (router?.query?.user_id) {
      getbidderlocationdetails({
        user_id: router?.query?.user_id,
        is_seller: is_seller ? 0 : 1,
      });
      getStoreProducts({
        site_id: router?.query?.site_id,
        user_id: router?.query?.user_id,
      });
    }
  }, [router?.query?.user_id]);

  // useEffect(()=>{
  //   getbidderlocationdetails({user_id:router?.query?.user_id,is_seller:is_seller?0:1})
  //   location_formik.values.location=[]
  // },[is_seller])

  useEffect(() => {
    if (responseStatus) {
      if (responseStatus.from == "bidderlocationdetails") {
        if (responseStatus.status == "success") {
          setBidderDetails(
            responseStatus.message ? responseStatus.message : {}
          );
        } else {
          setAlert(responseStatus.message, "error");
          clearResponse();
          // handleRedirectInternal(history,'')
          if (window.location.href.includes("auction.io")) {
            setTimeout(() => {
              window.location.href = "https://app.auction.io/login";
            }, 1500);
          } else {
            setTimeout(() => {
              window.location.href =
                "https://auction-io.ecommerce.auction/login";
            }, 1500);
          }
        }
      }
      if (responseStatus.from == "sellercarddetails_bidderdetails_page") {
        // console.log("ppppppppppppppppppppppppp",responseStatus.message.cardlist)
        setCardDetails(
          responseStatus.message?.cardlist
            ? responseStatus.message.cardlist
            : []
        );
        setSiteid(
          responseStatus.message?.userlist
            ? responseStatus.message.userlist[0].site_id
            : ""
        );
        var total_ams =
          parseFloat(location_details.totalBidders) *
          parseFloat(
            responseStatus.message?.marketing_price?.length > 0
              ? responseStatus.message.marketing_price[0].value
              : 1
          );
        setTotalamount(parseInt(total_ams) > 0 ? total_ams : 1);
        setLoaders(false);
      }
      if (responseStatus.from == "makepayment_bidderdetails_page") {
        setLoading(false);
        if (responseStatus.status == "success") {
          setAlert(responseStatus.message, "success");
          setLocation(null);
          location_formik.values.location = [];
          setActiveStep(0);
        } else {
          setAlert(responseStatus.message, "error");
        }
      }
      clearResponse();
    }
  }, [responseStatus]);

  useEffect(() => {
    var display_data = [],
      location_data = [];
    if (bidder_details) {
      if (bidder_details.country) {
        if (bidder_details.country.length > 0) {
          bidder_details.country.map((data) => {
            display_data.push({
              totalBidders: data.cityCnt,
              // blue: data.no_card_user,
              // yellow: data.card_user,

              // green: data.paid_card_user,
              orange: data.thirdpartycnt,
              location: `${data.city}, ${data.state}`,
              location_with_count: `${data.city} (${data.cityCnt}), ${data.state}`,
              lat: data.location.lat,
              lng: data.location.lng,
              city: data.city,
              state: data.state,
              country: data.country,
            });
            //location_data.push({location:`${data.city}, ${data.state}`})
          });
          setSiteid(bidder_details?.site_id ? bidder_details.site_id : "");
        }
        setMapData(display_data);
        setLoaders(false);
        if (activeStep == 0) {
          setOpen(true);
        }
      }
    }
  }, [bidder_details]);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    if (activeStep == 1) {
      if (activeTemplate === "template4") {
        setActiveTemplate("preview");
        formik.setFieldValue("template", templateRef?.current?.innerHTML);
        // history.push({
        //   pathname: "/template_preview",
        //   state: templateRef?.current?.innerHTML,
        // });
      } else {
        formik.handleSubmit();
      }
    } else if (activeStep == 0) {
      if (location_formik.values.location.length > 0) {
        setActiveStep(newActiveStep);
      } else {
        setAlert("Please Select Location", "error");
      }
    } else {
      setActiveStep(newActiveStep);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const validationArray = Yup.object({
    template: Yup.string().required("Required!"),
    subject: Yup.string().required("Required!"),
    email: Yup.string().email("Invalid email format").required("Required!"),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      subject: "",
      template: "",
      email: "",
    },
    validateOnBlur: false,
    validationSchema: validationArray,
    onSubmit: (values) => {
      setLoaders(true);
      getsellerexistingcard({ user_id: router?.query?.user_id });
      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1;
      setActiveStep(newActiveStep);
    },
  });

  const location_formik = useFormik({
    initialValues: { location: [] },
  });

  const loc_details = [
    {
      type: "check",
      class: "col-12 locationCheck",
      options: mapdisplaydata.map((data) => {
        let conditionChanged = {};
        conditionChanged.id = data.location;
        conditionChanged.description = data.location_with_count;
        return conditionChanged;
      }),
      name: "location",
      formik: location_formik,
    },
  ];

  const emailTemplate = [
    {
      label: "From email address",
      placeholder:
        "Enter the email adress from which you want the emails to be sent",
      class: "col-6",
      type: "text",
      shrink: true,
      name: "email",
      formik: formik,
    },
    {
      label: "Subject",
      placeholder:
        "Enter the subject you'd like to see on the emails to be sent",
      class: "col-6",
      type: "text",
      shrink: true,
      name: "subject",
      formik: formik,
    },
    {
      class: "col-12",
      name: "template",
      type: "ckeditor",
      formik: formik,
    },
  ];

  useEffect(() => {
    if (activeTemplate === "template1") {
      formik.setFieldValue("template", localTemplate.template1);
    }
  }, [localTemplate]);

  const [cardInitialValues, setCardInitialValues] = useState({
    userid: "",
    email: "",
    extracardnumber: "",
    cardhname: "",
    address1: "",
    city: "",
    zipcode: "",
    state: "",
    extradate: "",
    extrayear: "",
    extracvv: "",
  });

  const validationCard = Yup.object({
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
    address1: Yup.string().required("Required!"),
    city: Yup.string().required("Required!"),
    state: Yup.string().required("Required!"),
    extradate: Yup.string().required("Required!"),
    extrayear: Yup.string().required("Required!"),
    extracvv: Yup.string()
      .required("Required!")
      .min(3, "Mininum 3 Numbers required")
      .max(4, "Maximum 3 Numbers required"),
    zipcode: Yup.string()
      .trim()
      .matches(/^[0-9]*$/g, "Only positive numbers allowed")
      .min(5, "Minimum 5 Numbers")
      .max(6, "Maximum 6 Numbers")
      .required("Required!"),
  });

  const cardFormik = useFormik({
    initialValues: cardInitialValues,
    validationSchema: validationCard,
    onSubmit: async (values) => {
      //console.log(values);
      makepayment();
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

  const cardDetails = [
    {
      label: "Card Holder Name",
      type: "text",
      placeholder: "Enter card holder name",
      class: "col-6",
      name: "cardhname",
      formik: cardFormik,
    },
    {
      label: "Card No",
      type: "number",
      placeholder: "Enter your card no",
      class: "col-6",
      name: "extracardnumber",
      formik: cardFormik,
    },
    {
      label: "Card Address",
      type: "text",
      placeholder: "Enter your card address",
      class: "col-12",
      name: "address1",
      formik: cardFormik,
    },
    {
      label: "City",
      type: "text",
      placeholder: "Enter your city",
      class: "col-6",
      name: "city",
      formik: cardFormik,
    },
    {
      label: "State",
      placeholder: "Select your state",
      class: "col-12 col-sm-6",
      type: "select",
      options: statesInLocal,
      name: "state",
      formik: cardFormik,
    },
    {
      label: "Zip Code",
      type: "number",
      placeholder: "Enter your zip code",
      class: "col-sm-6 col-12",
      name: "zipcode",
      formik: cardFormik,
    },
    {
      label: "Expiry Month",
      placeholder: "MM",
      class: "col-sm-6 col-12",
      type: "select",
      name: "extradate",
      options: creditCardMonthOptions,
      formik: cardFormik,
    },
    {
      label: "Expiry Year",
      placeholder: "YYYY",
      class: "col-sm-6 col-12",
      type: "select",
      name: "extrayear",
      options: creditCardYearOptions,
      formik: cardFormik,
    },
    {
      label: "Cvv",
      type: "number",
      placeholder: "Enter your Cvv",
      class: "col-sm-6 col-12",
      name: "extracvv",
      formik: cardFormik,
    },
  ];

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const [currLocation, setCurrLocation] = useState([]);
  const [showUpdateAnim, setUpdateAnim] = useState(false);
  const [total_amount, setTotalamount] = useState(0);
  const getData = (d) => {
    var l_d = location_formik.values.location;
    if (l_d.includes(d.location)) {
      l_d = l_d.filter((val) => val != d.location);
    } else {
      l_d.push(d.location);
    }
    location_formik.setFieldValue("location", l_d);
    //setCurrLocation(l_d);

    if (l_d.length > 0) {
      var total_data = "",
        tot_totalBidders = 0,
        tot_blue = 0,
        tot_yellow = 0,
        tot_green = 0,
        tot_orange = 0,
        selected_location = [];
      l_d.map((data) => {
        total_data = mapdisplaydata.filter((val) => val.location == data)[0];
        tot_totalBidders = tot_totalBidders + total_data.totalBidders;
        // tot_green = tot_green + total_data.green;
        // tot_yellow = tot_yellow + total_data.yellow;
        // tot_blue = tot_blue + total_data.blue;
        tot_orange = tot_orange + total_data.orange;
        selected_location.push({
          city: total_data.city,
          state: total_data.state,
          country: total_data.country,
        });
      });
      setPartial({
        totalBidders: tot_totalBidders,
        yellow: tot_orange,
      });
      setSelecedLoc(selected_location);
      getbiddercountdetails({
        site_id: !is_seller ? total_data.site_id : "",
        all_city: selected_location,
      });
    } else {
      setLocation(null);
    }
  };

  useEffect(() => {
    setUpdateAnim(true);
    setTimeout(() => {
      setUpdateAnim(false);
    }, 500);
  }, [currLocation]);

  //   useEffect(()=>{
  //     caches.keys().then((names) =>
  //        names.forEach((name)=>{
  //             caches.delete(name)
  //        })
  //     )
  // },[])

  const makepayment = () => {
    setLoading(true);
    // var selected_data=mapdisplaydata.filter(
    //   (d) => d.location == currLocation?.location
    // )[0]
    // console.log("pppppppppppppppppppppppp",selected_data)
    var req_data = {
      user_id: router?.query?.user_id,
      amount: total_amount,
      //  city:selected_data.city,
      //  state:selected_data.state,
      //  country:selected_data.country,
      location: selected_location_details,
      site_id: !is_seller ? site_id : "",
      from_email: formik.values.email,
      subject: formik.values.subject,
      template: formik.values.template,
      is_seller: is_seller ? 0 : 1,
    };
    if (selected_card) {
      req_data.sourceID = selected_card;
      req_data.cardhname = "";
      req_data.address = "";
      req_data.cardcity = "";
      req_data.cardstate = "";
      req_data.zipcode = "";
      req_data.extracardnumber = "";
      req_data.extradate = "";
      req_data.extrayear = "";
      req_data.extracvv = "";
    } else {
      req_data.sourceID = "";
      req_data.cardhname = cardFormik.values.cardhname;
      req_data.address = cardFormik.values.address1;
      req_data.cardcity = cardFormik.values.city;
      req_data.cardstate = cardFormik.values.state;
      req_data.zipcode = cardFormik.values.zipcode;
      req_data.extracardnumber = cardFormik.values.extracardnumber;
      req_data.extradate = cardFormik.values.extradate;
      req_data.extrayear = cardFormik.values.extrayear;
      req_data.extracvv = cardFormik.values.extracvv;
    }
    sellerMakePayment(req_data);
  };

  useEffect(() => {
    // const { id, name } = csc.getCountryById("United State");
    let states = csc.getStatesOfCountry("231");
    states = states.map((ele) => {
      let o = {
        show: ele.name,
        value: ele.name,
      };
      return o;
    });
    setStatesinLocal(states);
  }, []);

  useEffect(() => {
    if (location_formik.values.location.length > 0) {
      var total_data = "",
        tot_totalBidders = 0,
        tot_blue = 0,
        tot_yellow = 0,
        tot_green = 0,
        tot_orange = 0,
        selected_location = [];

      location_formik.values.location.map((data) => {
        total_data = mapdisplaydata.filter((val) => val.location == data)[0];
        tot_totalBidders = tot_totalBidders + total_data.totalBidders;
        // tot_green = tot_green + total_data.green;
        // tot_yellow = tot_yellow + total_data.yellow;
        // tot_blue = tot_blue + total_data.blue;
        tot_orange = tot_orange + total_data.orange;
        selected_location.push({
          city: total_data.city,
          state: total_data.state,
          country: total_data.country,
        });
      });
      setPartial({
        totalBidders: tot_totalBidders,
        yellow: tot_orange,
      });
      setSelecedLoc(selected_location);
      getbiddercountdetails({
        site_id: !is_seller ? site_id : "",
        all_city: selected_location,
      });
    } else {
      setLocation(null);
    }
  }, [location_formik.values.location]);

  useEffect(() => {
    if (responseStatus) {
      if (responseStatus.from == "bidderlocationcountdetails") {
        setLocation({
          ...select_partial,
          blue: responseStatus.message?.no_card_user
            ? responseStatus.message.no_card_user
            : 0,
          orange: responseStatus.message?.card_user
            ? responseStatus.message.card_user
            : 0,
          //  orange: responseStatus.message?.third
          //    ? responseStatus.message.no_card_user
          //    : 0,
          green: responseStatus.message?.paid_card_user
            ? responseStatus.message.paid_card_user
            : 0,
        });
      }
    }
  }, [responseStatus]);

  const handleModal = () => {
    setOpen(!open);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  function handleCheckAll() {
    if (checkAll == true) {
      let updatedLocation = [];
      mapdisplaydata.map((data) => {
        updatedLocation.push(data.location);
      });
      location_formik.setFieldValue("location", updatedLocation);
    } else location_formik.setFieldValue("location", []);
  }

  return (
    <>
      {loader ? (
        <div className="marketingLoaderCnt customContainer">
          <Loaders name="marketing" isLoading={loader} loop={1} />
        </div>
      ) : (
        <div className="marketingPlugin customContainer">
          <h3 className="mpTitle">Create an email campaign</h3>
          <p className="mpInfo">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.{" "}
          </p>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton
                  // onClick={handleStep(index)}
                  completed={completed[index]}
                >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            {allStepsCompleted() ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed.
                </Typography>
                <Button onClick={handleReset}>Reset</Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>
                  {/* {getStepContent(activeStep)} */}
                  {activeStep === 0 ? (
                    <>
                      <div className="marketingMap">
                        <Maps
                          data={mapdisplaydata}
                          loc_det={location_formik.values.location}
                          getData={getData}
                        />
                        <div>
                          <div className="allBiddersToggle">
                            <FormGroup row className="partialPaymentToggle">
                              <FormControlLabel
                                label="Switch to view all bidders on the map"
                                control={
                                  <Switch
                                    checked={is_seller}
                                    onChange={(e) => {
                                      setLoaders(true);
                                      setSeller(!is_seller);
                                      getbidderlocationdetails({
                                        user_id: router?.query?.user_id,
                                        is_seller: !is_seller ? 0 : 1,
                                      });
                                      location_formik.values.location = [];
                                    }}
                                    color={"green"}
                                  />
                                }
                              />
                            </FormGroup>
                          </div>

                          <>
                            <div
                              className={`marketingLocation animate__animated ${
                                showUpdateAnim ? "animate__flipInX" : ""
                              }`}
                            >
                              <div className="activeInfo">
                                <span className="material-icons">groups</span>
                                <h5>
                                  Available bidders:
                                  <span>
                                    {select_partial?.totalBidders
                                      ? select_partial.totalBidders
                                      : "-"}
                                  </span>
                                </h5>
                              </div>
                              <div className="activeInfo">
                                <span className="material-icons">fmd_good</span>
                                <h5>
                                  Location
                                  <Button onClick={handleModal}>
                                    Click here to update location
                                  </Button>
                                </h5>
                              </div>
                            </div>
                          </>

                          <Chart data={location_details} />
                        </div>
                      </div>
                    </>
                  ) : activeStep === 1 ? (
                    <div className="marketingTemplate">
                      <div className="row">
                        <div className="col-12 chooseTemp">
                          <h6>Choose from a base template</h6>
                          <div>
                            <Button
                              className={`templateViewBtn ${
                                activeTemplate === "template1" ? "active" : ""
                              }`}
                              variant="outlined"
                              onClick={() => {
                                setActiveTemplate("template1");
                                formik.setFieldValue(
                                  "template",
                                  localTemplate.template1
                                );
                              }}
                            >
                              Template 1
                            </Button>
                            <Button
                              className={`templateViewBtn ${
                                activeTemplate === "template2" ? "active" : ""
                              }`}
                              variant="outlined"
                              onClick={() => {
                                setActiveTemplate("template2");
                                formik.setFieldValue(
                                  "template",
                                  localTemplate.template2
                                );
                              }}
                            >
                              Template 2
                            </Button>{" "}
                            <Button
                              className={`templateViewBtn ${
                                activeTemplate === "template3" ? "active" : ""
                              }`}
                              variant="outlined"
                              onClick={() => {
                                setActiveTemplate("template3");
                                formik.setFieldValue(
                                  "template",
                                  localTemplate.template3
                                );
                              }}
                            >
                              Template 3
                            </Button>
                            <Button
                              className={`templateViewBtn`}
                              variant="outlined"
                              onClick={() => {
                                setActiveTemplate("template4");
                              }}
                            >
                              Custom Template
                            </Button>
                          </div>
                        </div>
                        <TemplateBuilder
                          templateRef={templateRef}
                          preview={activeTemplate === "preview" ? 1 : 0}
                        />
                        {activeTemplate === "template4"
                          ? ""
                          : Object.values(mapData(emailTemplate))}
                      </div>
                    </div>
                  ) : activeStep === 2 ? (
                    <div className="marketingPayment">
                      <div className="row">
                        <div className="col-12">
                          <h4 className="amtToBePaid">
                            Amount to be paid: {currencyFormat(total_amount)}
                          </h4>
                        </div>
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
                                <option value="">{"Select Card"}</option>
                                {carddetails.map((val) => (
                                  <option value={val.id}>
                                    {"XXXX XXXX XXXX XXXX " + val.last4}
                                  </option>
                                ))}
                              </CustomSelect>
                            </div>
                            <p>OR</p>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="row">
                          {Object.values(mapData(cardDetails))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    "Completed"
                  )}
                </Typography>
                <div className="marketingAct">
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  {activeStep == 2 ? (
                    <PrimaryButton
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      disabled={Loading}
                      onClick={
                        selected_card ? makepayment : cardFormik.handleSubmit
                      }
                    >
                      Make Payment
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      Next
                    </PrimaryButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Dialog
        className="locationPopup"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="locationPopupInner">
          <Button className="closePopup" onClick={() => setOpen(false)}>
            <span className="material-icons">close</span>
          </Button>
          <h3>Select a location to view bidders</h3>
          <Button
            className="checkAll"
            onClick={() => {
              setCheckAll(!checkAll);
              handleCheckAll();
            }}
          >
            <span className="material-icons">
              {checkAll ? "check_box_outline_blank" : "check_box"}
            </span>
            Select All
          </Button>
          <div className="row">{Object.values(mapData(loc_details))}</div>
        </div>
      </Dialog>
    </>
  );
}
