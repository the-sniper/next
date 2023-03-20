import React, { useState, useEffect, useContext } from "react";
import { AddCircleRounded } from "@mui/icons-material";
import { handleRedirectInternal, mapData } from "@/common/components";
import AuthContext from "@/context/auth/authContext";
import UserContext from "@/context/user/userContext";
import AlertContext from "@/context/alert/alertContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { CircularProgress } from "@mui/material";
import "./addCreditCard.module.css"

const AddCreditCard = (props) => {
  const {
    addShippingAddress,
    removeShippingAddress,
    getStripeCard,
    addStripeCard,
    removeStripeCard,
    getCheckout,
    all_shipping_address,
    setDefaultShippingAddress,
  } = useContext(UserContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [isLoading, setIsLoading] = useState(false);
  const [cardInitialValues, setCardInitialValues] = useState({
    userid: "",
    // email: "",
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
      .test("testcvv", "Enter Valid CVV", (value) => {
        return value && (value.length === 3 || value.length === 4);
      }),
    zipcode: Yup.string()
      .trim()
      .matches(/^[0-9]*$/g, "Only positive numbers allowed")
      .min(5, "Minimum 5 Numbers")
      .max(6, "Maximum 6 Numbers")
      .required("Required!"),
  });

  const checkCVV = (value) => {
    return value && (value.length === 3 || value.length === 4);
  };

  const cardFormik = useFormik({
    initialValues: cardInitialValues,
    validationSchema: validationCard,
    onSubmit: async (values) => {
      setIsLoading(true);
      const result = await addStripeCard({
        ...values,
        userid: user.id,
        address1: user.address1,
        email: user.email,
      });
      if (result) {
        setIsLoading(false);
        setAlert(
          result.status === "error" ? result.response : result.response.message,
          result.status
        );
        props.getSavedCards();
        if (result.status === "success") {
          cardFormik.resetForm();
          props.setViewAddCredit(false);
        }
      }
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      setCardInitialValues({
        userid: user.id,
        // email: user.email,
        ...cardInitialValues,
      });
    }
  }, [user]);

  const cardDetails = [
    // {
    //   label: "Email",
    //   type: "text",
    //   placeholder: "Enter your email address",
    //   class: "col-12",
    //   name: "email",
    //   formik: cardFormik,
    // },
    {
      label: "Card Holder Name",
      type: "text",
      placeholder: "Enter card holder name",
      class: "col-12",
      name: "cardhname",
      formik: cardFormik,
    },
    // {
    //   label: "Card Address",
    //   type: "text",
    //   placeholder: "Enter your card address",
    //   class: "col-12",
    //   name: "address1",
    //   formik: cardFormik,
    // },
    {
      label: "Card No",
      type: "number",
      placeholder: "Enter your card no",
      class: "col-12",
      name: "extracardnumber",
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
    {
      label: "City",
      type: "text",
      placeholder: "Enter your city",
      class: "col-sm-6 col-12",
      name: "city",
      formik: cardFormik,
    },
    {
      label: "State",
      type: "text",
      placeholder: "Enter your state",
      class: "col-sm-6 col-12",
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
  ];

  return (
    <form onSubmit={cardFormik.handleSubmit}>
      <div className="add-credit-card">
        <div className="row">{Object.values(mapData(cardDetails))}</div>
        <PrimaryButton
          label={
            isLoading ? (
              <div>
                <CircularProgress className="saveCardLoading" />
              </div>
            ) : (
              "Save"
            )
          }
          type="submit"
          disabled={isLoading}
        />
      </div>
    </form>
  );
};
export default AddCreditCard;
