import React, { useState, useEffect, useContext } from "react";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { Button } from "@material-ui/core";
import AddressCard from "@/components/molecules/AddressCard";
import { handleRedirectInternal, mapData } from "@/common/components";
import { useFormik } from "formik";
import * as Yup from "yup";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import SavedCard from "@/components/molecules/SavedCard";
import Popup from "@/components/organisms/Popup";
import AuthContext from "@/context/auth/authContext";
import UserContext from "@/context/user/userContext";
import AlertContext from "@/context/alert/alertContext";
import BuyerContext from "@/context/buyer/buyerContext";
import CommonContext from "@/context/common/commonContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import csc from "country-state-city";
import lookup from "country-code-lookup";
import { useRouter } from "next/router";

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
      {value === index && <div className="cardTab">{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Checkout(props) {
  const [selectedAddress, setSelectedAddress] = useState({});
  const [selectedCard, setSelectedCard] = useState({});
  const [value, setValue] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [statesInLocal, setStatesinLocal] = useState([]);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [addressInitialValues, setAddressInitialValues] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    address: "",
    id: "",
  });
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

  const router = useRouter();
  const search = router.query.search;

  const { user, isAuthenticated } = useContext(AuthContext);
  const {
    addShippingAddress,
    removeShippingAddress,
    getStripeCard,
    addStripeCard,
    removeStripeCard,
    getBuynowCheckout,
    buynow_all_shipping_address,
    setDefaultShippingAddress,
  } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  const { processBuynowPayment } = useContext(BuyerContext);
  const { allCountries } = useContext(CommonContext);

  useEffect(() => {
    if (isAuthenticated) {
      getAllSavedCards();
      setAddressInitialValues({
        user_id: user.id,
        ...addressInitialValues,
      });
      setCardInitialValues({
        userid: user.id,
        email: user.email,
        ...cardInitialValues,
      });
    }
  }, [user]);

  useEffect(() => {
    if (buynow_all_shipping_address.length > 0) {
      setAddresses(buynow_all_shipping_address);
      let dafualtAddress = "";
      buynow_all_shipping_address.map((address) =>
        address.is_default === 1 ? (dafualtAddress = address) : ""
      );
      dafualtAddress
        ? setSelectedAddress(dafualtAddress)
        : setSelectedAddress(buynow_all_shipping_address[0]);
    }
  }, [buynow_all_shipping_address]);

  const getAllSavedCards = async () => {
    const result = await getStripeCard({ userid: user.id });
    if (
      result &&
      result.result_stripe &&
      result.result_stripe.status === "success"
    ) {
      setSavedCards(result.result_stripe.data.responseData.data);
      setSelectedCard(result.result_stripe.data.responseData.data[0]);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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

  const validateAddress = Yup.object({
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
    phone: Yup.string()
      .trim()
      .matches(/^[0-9- +()]*$/g, "Only numbers are allowed")
      .min(12, "Minimum 10 digits phone number")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email format")
      .max(250, "250 characters max")
      .required("Required"),
    country: Yup.string().trim().required("Required!"),
    city: Yup.string()
      .trim()
      .matches(/^[0-9a-zA-Z ]*$/g, "No special charaters allowed.")
      .required("Required!"),
    state: Yup.string().trim().required("Required!"),
    zipcode: Yup.string()
      .trim()
      .matches(/^[0-9]*$/g, "Only positive numbers allowed")
      .min(5, "Minimum 5 Numbers")
      .max(6, "Maximum 6 Numbers")
      .required("Required!"),
    address: Yup.string().trim().required("Required!"),
  });

  const addressFormik = useFormik({
    initialValues: addressInitialValues,
    validationSchema: validateAddress,
    onSubmit: async (values) => {
      let { name: countryName } = csc.getCountryById(values["country"]);
      let { name: stateName } = csc.getStateById(values["state"]);

      const response = await addShippingAddress({
        ...values,
        user_id: user.id,
        country: countryName,
        state: stateName,
      });
      if (response) {
        setAlert(response, "success");
        getBuynowCheckout({ user_id: user.id });
        setIsPopupOpen(false);
        addressFormik.resetForm();
      }
    },
    enableReinitialize: true,
  });

  const cardFormik = useFormik({
    initialValues: cardInitialValues,
    validationSchema: value === 0 ? validationCard : "",
    onSubmit: async (values) => {
      if (value === 0) {
        const result = await addStripeCard({
          ...values,
          userid: user.id,
          email: user.email,
        });
        if (result) {
          if (result.status === "success") {
            setAlert(result.response.message, result.status);
            getAllSavedCards();
            cardFormik.resetForm();
          } else {
            setAlert(result.response, result.status);
          }
        }
      } else {
        // console.log("Make Payment Submit");
        if (
          Object.keys(selectedAddress).length > 0 &&
          Object.keys(selectedCard).length > 0
        ) {
          let payload = {
            user_id: user.id,
            shipping_id: selectedAddress.id,
            last4: selectedCard.last4,
            charge_id: selectedCard.id,
          };
          setIsPaymentInProgress(true);
          const result = await processBuynowPayment(payload);
          if (result) {
            getBuynowCheckout({ user_id: user.id });
            setAlert("Payment Processed Successfully", "success");
            handleRedirectInternal(router, "myOrders");
            setIsPaymentInProgress(false);
          } else {
            setAlert("Payment Error Occured", "error");
            setIsPaymentInProgress(false);
          }
        } else {
          setAlert(
            "A Card and Address must be selected to process Payment",
            "warning"
          );
          setIsPaymentInProgress(false);
        }
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const { id, name } = csc.getCountryById(addressFormik.values.country);
    let states = csc.getStatesOfCountry(id);
    states = states.map((ele) => {
      let o = {
        show: ele.name,
        value: ele.id,
      };
      return o;
    });
    setStatesinLocal(states);
    //addressFormik.values.state = "";
  }, [addressFormik.values.country]);

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

  const addressDetails = [
    {
      label: "First Name",
      type: "text",
      placeholder: "Enter First Name",
      class: "col-sm-6 col-12",
      name: "first_name",
      formik: addressFormik,
    },
    {
      label: "Last Name",
      type: "text",
      placeholder: "Enter Last Name",
      class: "col-sm-6 col-12",
      name: "last_name",
      formik: addressFormik,
    },
    {
      label: "Email",
      type: "email",
      placeholder: "Enter Email",
      class: "col-sm-6 col-12",
      name: "email",
      formik: addressFormik,
    },
    {
      label: "Phone Number",
      type: "phone",
      placeholder: "Enter Phone Number",
      class: "col-sm-6 col-12",
      name: "phone",
      formik: addressFormik,
    },
    {
      label: "Country",
      placeholder: "Select your country",
      class: "col-12 col-sm-6",
      type: "select",
      options: allCountries,
      name: "country",
      formik: addressFormik,
    },
    {
      label: "Address",
      placeholder: "Enter your Address",
      class: "col-12 col-sm-6",
      type: "text",
      name: "address",
      formik: addressFormik,
    },
    {
      label: "State",
      placeholder: "Select your state",
      class: "col-12 col-sm-6",
      type: "select",
      options: statesInLocal,
      name: "state",
      formik: addressFormik,
    },
    {
      label: "City",
      type: "text",
      placeholder: "Enter City",
      class: "col-sm-6 col-12",
      name: "city",
      formik: addressFormik,
    },
    {
      label: "Zip",
      type: "number",
      placeholder: "Enter Zip",
      class: "col-sm-6 col-12",
      name: "zipcode",
      formik: addressFormik,
    },
  ];

  const cardDetails = [
    {
      label: "Card Holder Name",
      type: "text",
      placeholder: "Enter card holder name",
      class: "col-12",
      name: "cardhname",
      formik: cardFormik,
    },
    {
      label: "Card No",
      type: "number",
      placeholder: "Enter your card no",
      class: "col-12",
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
      class: "col-12",
      name: "city",
      formik: cardFormik,
    },
    {
      label: "State",
      type: "text",
      placeholder: "Enter your state",
      class: "col-12",
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

  const handleEditAddress = (data) => {
    let countryId = "";
    if (lookup.byCountry(data.country) != null) {
      let { id } = csc.getCountryByCode(lookup.byCountry(data.country).iso2);
      countryId = id;
    }

    let stateId = "";
    if (countryId) {
      let statesOfCountry = csc.getStatesOfCountry(countryId);
      let index = statesOfCountry.findIndex(
        (element) => element.name === data.state
      );
      if (index) {
        stateId = statesOfCountry[index].id;
      }
    }

    setAddressInitialValues({
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      state: stateId ? stateId : "",
      country: countryId ? countryId : "",
      zipcode: data.zipcode,
      id: data.id,
      address: data.address,
    });
    //addressFormik.resetForm();
    setIsEdit(true);
    setIsPopupOpen(true);
  };

  const handleSetDefaultAddress = async (data) => {
    const res = await setDefaultShippingAddress({
      id: data.id,
      user_id: user.id,
    });
    if (res) {
      setAlert("Default Address Changed", "success");
      getBuynowCheckout({ user_id: user.id });
    }
  };

  const handleShippingAddressRemoval = async (index) => {
    let addressToBeRemove = addresses[index];
    const result = await removeShippingAddress({
      user_id: user.id,
      shipping_id: addressToBeRemove.id,
    });
    if (result) {
      setAlert("Address Deleted Successfully", "success");
      getBuynowCheckout({ user_id: user.id });
    }
  };

  const handleCardRemoval = async (index) => {
    let cardToBeRemove = savedCards[index];
    const result = await removeStripeCard({
      userid: user.id,
      source_id: cardToBeRemove.id,
    });
    if (result) {
      setAlert("Card Deleted Successfully", "success");
      getAllSavedCards();
    }
  };

  return (
    <div className="checkout customContainer">
      <div className="checkoutLt">
        <h2 className="checkoutTitle">Choose a shipping address</h2>
        <div className="addressCnt">
          <AddressCard
            type="new"
            onClick={() => {
              setAddressInitialValues({
                user_id: "",
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                city: "",
                state: "",
                country: "",
                zipcode: "",
                address: "",
                id: "",
              });
              setIsPopupOpen(true);
            }}
          />
          {addresses.map((data, index) => (
            <AddressCard
              key={index}
              isDefault={data.is_default}
              isSelected={data.id === selectedAddress.id}
              name={`${data.first_name} ${data.last_name}`}
              addressLine1={data.address}
              addressLine2={data.address1}
              city={data.city}
              phone={data.phone}
              state={data.state}
              country={data.country}
              zipcode={data.zipcode}
              onClick={() => {
                setSelectedAddress(data);
              }}
              handleShippingAddressRemoval={() =>
                handleShippingAddressRemoval(index)
              }
              handleEditAddress={() => handleEditAddress(data)}
              handleSetDefaultAddress={() => handleSetDefaultAddress(data)}
            />
          ))}
        </div>
      </div>
      <form onSubmit={cardFormik.handleSubmit}>
        <div className="checkoutRt">
          <h3 className="checkoutSummaryTitle">Payment Information</h3>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              variant="fullWidth"
            >
              <Tab label="New Card" {...a11yProps(0)} />
              <Tab label="Existing Card" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <div className="row">{Object.values(mapData(cardDetails))}</div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="cards">
              {savedCards.length > 0 &&
                savedCards.map((data, index) => (
                  <SavedCard
                    name={data.brand}
                    isSelected={data.id === selectedCard.id}
                    lastFourDigits={data.last4}
                    expiry={`${data.exp_month}/${data.exp_year}`}
                    onClick={() => {
                      setSelectedCard(data);
                    }}
                    handleCardRemoval={() => handleCardRemoval(index)}
                  />
                ))}
            </div>
          </TabPanel>
          <PrimaryButton
            label={value === 0 ? "Add Card" : "Make Payment"}
            type="submit"
          >
            {isPaymentInProgress ? (
              <CircularProgress
                style={{ color: "white", marginLeft: "10px" }}
              />
            ) : (
              ""
            )}
          </PrimaryButton>
        </div>
      </form>
      <Popup
        open={isPopupOpen}
        size="md"
        handleClose={() => {
          setIsPopupOpen(false);
          setIsEdit(false);
        }}
        modaltitle={
          isEdit ? "Edit Shipping Address" : "Add New Shipping Address"
        }
      >
        <form onSubmit={addressFormik.handleSubmit}>
          <div className="row">{Object.values(mapData(addressDetails))}</div>
          <PrimaryButton label="Save" type="submit" />
        </form>
      </Popup>
    </div>
  );
}

export default Checkout;
