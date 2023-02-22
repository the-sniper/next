import React, { useState, useEffect, useContext } from "react";
import { Button, Drawer } from "@material-ui/core";
import DashboardLayout from "@/components/templates/DashboardLayout";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { mapData } from "@/common/components";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import AuthContext from "@/context/auth/authContext";
import UserContext from "@/context/user/userContext";
import CommonContext from "@/context/common/commonContext";
import AlertContext from "@/context/alert/alertContext";
import csc from "country-state-city";
import lookup from "country-code-lookup";

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
      {value === index && <div>{children}</div>}
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

function Profile(props) {
  const [value, setValue] = useState(0);
  const { isAuthenticated, user, loadUser } = useContext(AuthContext);
  const { getUserProfileDetails, updateProfile, changePassword } =
    useContext(UserContext);
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
      .min(15, "Minimum 10 digits phone number")
      .required("Required"),
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

  const validationPassword = Yup.object({
    old_password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Required!"),
    new_password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Required!"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password")], "Password's not match")
      .required("Required!"),
  });

  const formikChange = useFormik({
    initialValues: {
      user_id: "",
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: validationPassword,
    onSubmit: async (values) => {
      values.user_id = profileInitialValues.user_id;
      const res = await changePassword(values);
      if (res) {
        setAlert(res.response, res.status);
        formikChange.resetForm();
      }
    },
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
    // console.log(states, "thius is state");
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
      type: "number",
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

  const passwordChange = [
    {
      label: "Current Password",
      name: "old_password",
      type: "password",
      placeholder: "Enter your current password",
      class: "col-md-6 col-sm-12",
      labelType: "capsLabel",
      formik: formikChange,
    },
    {
      label: "New Password",
      name: "new_password",
      type: "password",
      placeholder: "Enter your password",
      class: "col-md-6 col-sm-12",
      labelType: "capsLabel",
      formik: formikChange,
    },
    {
      label: "Confirm New Password",
      name: "confirm_password",
      type: "password",
      placeholder: "Re-enter your password",
      class: "col-md-6 col-sm-12",
      labelType: "capsLabel",
      formik: formikChange,
    },
  ];

  return (
    <DashboardLayout title="Profile">
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Account Details" {...a11yProps(0)} />
          <Tab label="Change Password" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">{Object.values(mapData(profile))}</div>
          <div className="dashActBtn">
            <PrimaryButton label="Save" type="submit" />
          </div>
        </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <form onSubmit={formikChange.handleSubmit}>
          <div className="row">{Object.values(mapData(passwordChange))}</div>
          <div className="dashActBtn">
            <PrimaryButton label="Save" type="submit" />
          </div>
        </form>
      </TabPanel>
    </DashboardLayout>
  );
}

export default Profile;
