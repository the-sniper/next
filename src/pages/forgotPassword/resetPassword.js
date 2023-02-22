import { Divider } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import { LOGO, SITE_NAME } from "src/Utils";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { mapData, handleRedirectInternal } from "@/common/components";
import AlertContext from "@/context/alert/alertContext";
import UserContext from "@/context/user/userContext";
import AuthContext from "@/context/auth/authContext";
import { useRouter } from "next/router";
import Link from "next/link";

function ResetPassword() {
  const { setAlert } = useContext(AlertContext);
  const { resetPassword } = useContext(UserContext);
  const { logOut } = useContext(AuthContext);
  const router = useRouter();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (router?.query.id) {
      setUserId(router?.query.id);
    }
  }, [router.asPath]);

  const loginValidationSchema = Yup.object().shape({
    new_password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password")], "Password Mismatch")
      .required("Required"),
  });

  let [passwordShown, setPasswordShown] = useState(false);
  let [passwordCShown, setCPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const toggleCPasswordVisiblity = () => {
    setCPasswordShown(passwordCShown ? false : true);
  };

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      let payload = {
        ...values,
        user_id: userId,
      };
      const result = await resetPassword(payload);
      if (result.status === "success") {
        setAlert("Password Reset Successful", result.status);
        handleRedirectInternal(router, "login");
        //logOut();
      } else {
        setAlert("Error Occured, Please Try Again", result.status);
        formik.resetForm();
      }
    },
  });

  const loginInfo = [
    {
      label: "New Password",
      name: "new_password",
      type: passwordShown ? "text" : "password",
      placeholder: "Enter your new password",
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
      autoFocus: true,
    },
    {
      label: "Confirm Password",
      name: "confirm_password",
      type: passwordCShown ? "text" : "password",
      placeholder: "Confirm password",
      class: "col-12",
      formik: formik,
      endAdornment: passwordCShown ? (
        <span
          className="material-icons cursorPointer"
          onClick={toggleCPasswordVisiblity}
        >
          visibility_off
        </span>
      ) : (
        <span
          className="material-icons cursorPointer"
          onClick={toggleCPasswordVisiblity}
        >
          visibility
        </span>
      ),
    },
  ];

  return (
    <div className="login">
      <Link href="/">
        <img className="brandLogo" src={LOGO} alt={SITE_NAME} />
      </Link>
      <h2>Reset Password</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">{Object.values(mapData(loginInfo))}</div>
        <div className="loginActBox">
          <PrimaryButton label="Reset" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
