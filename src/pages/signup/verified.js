import React, { useState, useEffect, useContext } from "react";
import { LOGO, SITE_NAME } from "src/Utils";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthContext from "@/context/auth/authContext";
import { mapData, handleRedirectInternal } from "@/common/components";
import csc from "country-state-city";
import lookup from "country-code-lookup";
import UserContext from "@/context/user/userContext";
import CommonContext from "@/context/common/commonContext";
import AlertContext from "@/context/alert/alertContext";
import { useRouter } from "next/router";
import Link from "next/link";

function Signup() {
  const [value, setValue] = useState(0);
  const { isAuthenticated, user, loadUser } = useContext(AuthContext);
  const {
    getUserProfileDetails,
    updateProfile,
    responseStatus,
    changePassword,
  } = useContext(UserContext);

  const router = useRouter();

  const { allCountries } = useContext(CommonContext);
  const { setAlert } = useContext(AlertContext);
  const [profileInitialValues, setProfileInitialValues] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    address: "",
    zipcode: "",
    user_id: "",
  });
  const [statesInLocal, setStatesinLocal] = useState([]);
  useEffect(() => {
    if (isAuthenticated && Object.keys(user).length > 0) {
      getProfileDetails();
    }
  }, [user]);

  //   useEffect(() => {
  //     if (responseStatus) {
  //       if (responseStatus.from === "register") {
  //         if (responseStatus.status === "success") {
  //           handleRedirectInternal(history, "login");
  //         }
  //       }
  //       // else if (responseStatus.from === "checkEmail") {
  //       //   if (responseStatus.status !== "success") {
  //       //   } else {
  //       //   }
  //       // }
  //     }
  //   }, [responseStatus]);

  const getProfileDetails = async () => {
    const profile = await getUserProfileDetails({ user_id: user.id });

    if (profile && Object.keys(profile).length > 0) {
      let countryId = "";
      if (lookup.byCountry(profile.country) != null) {
        let { id } = csc.getCountryByCode(
          lookup.byCountry(profile.country).iso2
        );
        countryId = id;
      }
      let stateId = "";
      if (countryId) {
        let statesOfCountry = csc.getStatesOfCountry(countryId);
        let index = statesOfCountry.findIndex(
          (element) => element.name === profile.state
        );
        if (index) {
          stateId = statesOfCountry[index].id;
        }
      }

      setProfileInitialValues({
        user_id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        email: profile.email,
        country: countryId ? countryId : "",
        state: stateId ? stateId : "",
        city: profile.city ? profile.city : "",
        address: profile.address1 ? profile.address1 : "",
        zipcode: profile.zip ? profile.zip : "",
      });
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const validationArray = Yup.object({
    first_name: Yup.string()
      .min(2, "Mininum 2 characters")
      .max(15, "Maximum 15 characters")
      .required("Required!"),
    last_name: Yup.string()
      .min(2, "Mininum 2 characters")
      .max(15, "Maximum 15 characters")
      .required("Required!"),
    // address1: Yup.string().required('Required!'),

    phone: Yup.string()
      .trim()
      .matches(/^[0-9- +()]*$/g, "Only numbers are allowed")
      .max(20, "Maximum 20 charaters")
      .min(10, "Minimum 10 characters")
      .required("Required!"),
    country: Yup.string().trim().required("Required!"),
    city: Yup.string()
      .trim()
      .matches(/^[0-9a-zA-Z ]*$/g, "No special charaters allowed.")
      .required("Required!"),
    state: Yup.string().trim().required("Required!"),
    address: Yup.string()
      .trim()
      .matches(/^[0-9a-zA-Z- ,.#()]*$/g, "Some special characters not allowed")
      .max(250, "maximum 250 characters")
      .required("Required!"),
    zipcode: Yup.string()
      .trim()
      .matches(/^[0-9]*$/g, "Only positive numbers allowed")
      .min(5, "Minimum 5 Numbers")
      .max(6, "Maximum 6 Numbers")
      .required("Required!"),
  });

  const formik = useFormik({
    initialValues: profileInitialValues,
    validationSchema: validationArray,
    onSubmit: async (values) => {
      let { name: countryName } = csc.getCountryById(values["country"]);
      let { name: stateName } = csc.getStateById(values["state"]);
      let payload = {
        address: values.address,
        user_id: values.user_id,
        first_name: values.first_name,
        last_name: values.last_name,
        city: values.city,
        country: countryName,
        state: stateName,
        zipcode: values.zipcode,
        phone: values.phone,
      };
      const success = await updateProfile(payload);
      if (success) {
        setAlert("Profile Successfully Updated", "success");
        getProfileDetails();
        loadUser();
        handleRedirectInternal(router, "");
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const { id, name } = csc.getCountryById(formik.values.country);
    let states = csc.getStatesOfCountry(id);
    states = states.map((ele) => {
      let o = {
        show: ele.name,
        value: ele.id,
      };
      return o;
    });
    setStatesinLocal(states);
    // formik.values.state = "";
  }, [formik.values.country]);

  const profile = [
    {
      label: "First name",
      type: "text",
      placeholder: "Enter your first name",
      class: "col-md-6 col-sm-12",
      name: "first_name",
      labelType: "capsLabel",
      formik: formik,
    },
    {
      label: "Last name",
      placeholder: "Enter your last name",
      class: "col-md-6 col-sm-12",
      type: "text",
      name: "last_name",
      labelType: "capsLabel",
      formik: formik,
    },
    {
      label: "Email",
      placeholder: "Enter your email",
      class: "col-md-6 col-sm-12",
      type: "text",
      disabled: true,
      name: "email",
      labelType: "capsLabel",
      formik: formik,
    },
    {
      label: "Mobile number",
      placeholder: "Enter your mobile number",
      class: "col-md-6 col-sm-12",
      type: "phone",
      name: "phone",
      labelType: "capsLabel",
      formik: formik,
    },
    {
      label: "Country",
      placeholder: "Select your country",
      class: "col-12 col-sm-6",
      type: "select",
      options: allCountries,
      name: "country",
      formik: formik,
    },
    {
      label: "State",
      placeholder: "Select your state",
      class: "col-12 col-sm-6",
      type: "select",
      options: statesInLocal,
      name: "state",
      formik: formik,
    },
    {
      label: "City",
      name: "city",
      type: "text",
      placeholder: "Enter your city",
      class: "col-12 col-sm-6",
      formik: formik,
    },
    {
      label: "Address",
      name: "address",
      type: "text",
      placeholder: "Enter your address",
      class: "col-12 col-sm-6",
      formik: formik,
    },
    {
      label: "Zip code",
      placeholder: "Enter you zip",
      class: "col-12 col-sm-5 col-md-3",
      type: "text",
      name: "zipcode",
      formik: formik,
    },
  ];

  return (
    <div className="signup">
      <Link href="/">
        <img className="brandLogo" src={LOGO} alt={SITE_NAME} />
      </Link>
      <h2>Welcome to Auction.io</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">{Object.values(mapData(profile))}</div>
        <div className="dashActBtn">
          <PrimaryButton label="Save" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default Signup;
