import { Divider } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthContext from "@/context/auth/authContext";
import { mapData, handleRedirectInternal } from "@/common/components";
import AlertContext from "@/context/alert/alertContext";
import Loaders from "@/components/molecules/Loaders";
import { LOGO, SITE_NAME } from "src/Utils";
import { useRouter } from "next/router";
import Link from "next/link";

function Login(props) {
  const {
    login,
    responseStatus,
    clearResponse,
    isAuthenticated,
    activateAccount,
  } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const router = useRouter();
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  const accountActivator = async () => {
    const res = await activateAccount({ id: router?.query.activationId });
    if (res) {
      setAlert("Account Activated Successfully", "success");
    } else {
      setAlert("Account Activated Failed", "error");
    }
    handleRedirectInternal(router, "login");
  };

  useEffect(() => {
    if (router?.query.activationId) {
      accountActivator();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      handleRedirectInternal(router, "auctions");
    }
  }, [isAuthenticated]);

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .max(250, "250 characters max")
      .required("Required"),
    password: Yup.string().min(8, "Minimum 8 characters").required("Required"),
  });

  let [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  useEffect(() => {
    if (responseStatus) {
      if (responseStatus.from === "login") {
        if (responseStatus.status === "success") {
          handleRedirectInternal(router, "auctions");
          setAlert("Logged In Successfully", "success");
          clearResponse();
        } else if (responseStatus.status === "error") {
          setAlert(responseStatus.message, "error");
          clearResponse();
        }
      }
    }
  }, [responseStatus]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      community: "auction_io",
      is_auctionio: 1,
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      login(values);
    },
  });

  const loginInfo = [
    {
      label: "Email address",
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      class: "col-12",
      autoFocus: true,
      formik: formik,
    },
    {
      label: "Password",
      name: "password",
      type: passwordShown ? "text" : "password",
      placeholder: "Enter your password",
      class: "col-12",
      formik: formik,
      endAdornment: passwordShown ? (
        <span
          className="material-icons cursorPointer"
          onClick={togglePasswordVisiblity}
        >
          visibility_off
        </span>
      ) : (
        <span
          className="material-icons cursorPointer"
          onClick={togglePasswordVisiblity}
        >
          visibility
        </span>
      ),
    },
  ];

  useEffect(() => {
    // console.log("login_email", login_email);
    if (
      window.location.pathname.includes("/autologin") ||
      window.location.pathname.includes("/auto-login")
    ) {
      setLoad(true);
      setLoading(true);
      let email = router?.query.login_email;
      let password = "12";
      let autologin = 1;
      let encrypt = window.location.pathname.includes("/auto-login") ? 1 : 0;
      let loginValues = {
        email: email,
        password: password,
        autologin: autologin,
        encrypt: encrypt,
        site_id: router?.query.site_id,
      };
      // console.log("loginvalues", loginValues);
      if (!isAuthenticated) {
        login(loginValues);
      }
    }
  }, []);

  return loading ? (
    <Loaders name="home" isLoading={loading} />
  ) : (
    <div className="login">
      <Link href="/">
        <img className="brandLogo" src={LOGO} alt={SITE_NAME} />
      </Link>
      <h2>Welcome to Auction.io</h2>
      <h4>Continue logging to your account</h4>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">{Object.values(mapData(loginInfo))}</div>
        <div className="loginActBox">
          <PrimaryButton label="login" type="submit" />
        </div>
      </form>
      <Divider />
      <div className="loginMiscAction d-flex justify-content-between align-items-center">
        <Link href="/forgotPassword">Forgot password ?</Link>
        <Link href="/signup">Create a new account ?</Link>
      </div>
    </div>
  );
}

export default Login;
