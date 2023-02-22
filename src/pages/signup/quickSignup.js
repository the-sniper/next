import React, { useState, useEffect, useContext } from "react";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthContext from "@/context/auth/authContext";
import { mapData, handleRedirectInternal } from "@/common/components";
import AlertContext from "@/context/alert/alertContext";
import Link from "next/link";
import { useRouter } from "next/router";

function QuickSignup(props) {
  const { register, responseStatus, clearResponse } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const registrationValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .max(250, "250 characters max")
      .required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    termCheck: Yup.boolean()
      .oneOf([true], "Please accept terms and condition")
      .required("Please accept terms and condition"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      termCheck: 0,
      redirectURL: `${
        typeof window != "undefined" && window.location.origin
      }/login`,
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
      label: "Email address",
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      class: "col-12",
      formik: formik,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      class: `col-12 ${!showPassword && "d-none"}`,
      formik: formik,
    },
    {
      label: [
        "I agree to accept the ",
        <Link href="/terms_of_use" className="ml-1" target="blank">
          {" "}
          {" Terms & Conditions"}
        </Link>,
        "",
      ],
      name: "termCheck",
      type: "checkbox",
      class: `col-12 ${!showPassword && "d-none"}`,
      formik: formik,
    },
  ];
  useEffect(() => {
    setShowPassword(false);
    formik.resetForm();
  }, []);

  useEffect(() => {
    if (responseStatus) {
      if (responseStatus.from === "register") {
        if (responseStatus.status === "success") {
          handleRedirectInternal(router, "login");
          setAlert(responseStatus.message, "success");
          formik.resetForm();
          clearResponse();
          setShowPassword(false);
          props.setPopupOpen(false);
        } else if (responseStatus.status === "error") {
          setAlert(responseStatus.message, "error");
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

  return (
    <div className="quickSignup">
      {/* <Link className="brandLogo" href="/">
        <img src={LOGO} alt={SITE_NAME} />
      </Link> */}

      <form>
        <div className="row">
          <div className="col-12 col-sm-8">
            <h2>Welcome to Auction.io</h2>
            <h4>Create a free account today!</h4>
            <div className="row">{Object.values(mapData(signupInfo))}</div>
            <div className="d-flex signupActBox justify-content-end align-items-center">
              {!showPassword ? (
                <PrimaryButton
                  type="button"
                  label="Continue"
                  disabled={
                    formik.errors.email || !formik.values.email ? true : false
                  }
                  onClick={() => setShowPassword(true)}
                />
              ) : (
                <PrimaryButton
                  label="Signup"
                  onClick={() => formik.handleSubmit()}
                  type="button"
                />
              )}
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <img
              src="/assets/svg/shipping.svg"
              alt="signup"
              className="qsImg"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default QuickSignup;
