import React, { useEffect, useContext } from "react";
import { LOGO, SITE_NAME } from "src/Utils";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthContext from "@/context/auth/authContext";
import { mapData, handleRedirectInternal } from "@/common/components";
import AlertContext from "@/context/alert/alertContext";
import { useState } from "react";
import Popup from "@/components/organisms/Popup";
import Link from "next/link";
import { useRouter } from "next/router";

function Signup() {
  const { register, allRegister, responseStatus, clearResponse } =
    useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const router = useRouter();
  const [isPopupOpen, setPopupOpen] = useState(false);
  useEffect(() => {
    if (responseStatus) {
      if (responseStatus.from === "register") {
        if (responseStatus.status === "success") {
          handleRedirectInternal(router, "login");
          setAlert(responseStatus.message, "success");
          clearResponse();
        } else if (responseStatus.status === "error") {
          setAlert(responseStatus.message, "error");
          setPopupOpen(true);
          clearResponse();
        }
      }
      // else if (responseStatus.from === "checkEmail") {
      //   if (responseStatus.status !== "success") {
      //   } else {
      //   }
      // }
    }
  }, [responseStatus]);
  const registrationValidationSchema = Yup.object().shape({
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
    phonenumber: Yup.string()
      .trim()
      .matches(/^[0-9- +()]*$/g, "Only numbers are allowed")
      .min(15, "Minimum 10 digits phone number")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email format")
      .max(250, "250 characters max")
      .required("Required"),
    password: Yup.string().min(8, "Minimum 8 characters").required("Required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "Password Mismatch")
      .required("Required"),
    termCheck: Yup.boolean()
      .oneOf([true], "Please accept terms and condition")
      .required("Please accept terms and condition"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phonenumber: "",
      email: "",
      password: "",
      confirm_password: "",
      termCheck: 0,
      redirectURL:
        typeof window != "undefined" && `${window.location.origin}/login`,
      community: "auction_io",
      is_auctionio: 1,
    },
    validationSchema: registrationValidationSchema,
    onSubmit: (values) => {
      register(values);
    },
  });

  const signupInfo = [
    {
      label: "First name",
      name: "first_name",
      type: "text",
      placeholder: "Enter your first name",
      class: "col-sm-6 col-12",
      autoFocus: true,
      formik: formik,
    },
    {
      label: "Last name",
      name: "last_name",
      type: "text",
      placeholder: "Enter your last name",
      class: "col-sm-6 col-12",
      formik: formik,
    },
    {
      label: "Phone number",
      name: "phonenumber",
      type: "phone",
      countryCodeEditable: "us",
      placeholder: "Enter your phone number",
      class: "col-sm-6 col-12",
      formik: formik,
    },

    {
      label: "Email address",
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      class: "col-sm-6 col-12",
      formik: formik,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      class: "col-sm-6 col-12",
      formik: formik,
    },
    {
      label: "Confirm password",
      name: "confirm_password",
      type: "password",
      placeholder: "Re-enter your password",
      class: "col-sm-6 col-12",
      formik: formik,
    },
    {
      label: [
        "I agree to accept the ",
        <Link href="/static/terms" className="ml-1" target="blank">
          {" "}
          {" Terms & Conditions"}
        </Link>,
        "",
      ],
      name: "termCheck",
      type: "checkbox",
      class: "col-12 mt-1 chkBoxWrpr",
      formik: formik,
    },
  ];

  return (
    <div className="signup">
      <Link href="/">
        <img className="brandLogo" src={LOGO} alt={SITE_NAME} />
      </Link>
      <h2>Welcome to Auction.io</h2>
      <h4>Create a free account today!</h4>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">{Object.values(mapData(signupInfo))}</div>
        <div className="d-flex signupActBox justify-content-end align-items-center">
          <PrimaryButton label="Signup" type="submit" />
        </div>
      </form>
      <Popup
        open={isPopupOpen}
        size="lg"
        className="Existing Login mx-auto"
        handleClose={() => setPopupOpen(false)}
        modaltitle=""
      >
        <h4 className="popup-heading">
          You Have Already Registered With These Sites. Kindly Login Use Any One
          of These Credentials.
        </h4>
        <ul className="store-order">
          {allRegister
            ?.filter((e) => e.store_name != "")
            .map((val) => (
              <li className=" store-list p-2 ">{val.store_name}</li>
            ))}
        </ul>
        <Link
          href="/login"
          className="mt-2 login-here d-flex justify-content-center align-items-center position-sticky"
        >
          Login Here
        </Link>
      </Popup>
    </div>
  );
}

export default Signup;
