import React, { useState, useEffect, useContext } from "react";
import { Button } from "@material-ui/core";
import DashboardLayout from "@/components/templates/DashboardLayout";
import CheckBox from "@/components/atoms/CheckBox";
import { useFormik } from "formik";
import UserContext from "@/context/user/userContext";
import AuthContext from "@/context/auth/authContext";
import AlertContext from "@/context/alert/alertContext";
import PrimaryButton from "@/components/atoms/PrimaryButton";

function Notifications() {
  const { getPreference, setPreference } = useContext(UserContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [userPreferences, setUserPreferences] = useState({});

  useEffect(() => {
    getUserPreferences();
  }, [user]);

  const getUserPreferences = async () => {
    if (user) {
      let preferences = await getPreference({ user_id: user.id });
      setUserPreferences(preferences);
    }
  };

  useEffect(() => {
    if (Object.keys(userPreferences).length > 0) {
      let email_prefer =
        userPreferences.email_items && userPreferences.email_items.length > 0
          ? userPreferences.email_items
          : [];
      let sms_prefer =
        userPreferences.sms_items && userPreferences.sms_items.length > 0
          ? userPreferences.sms_items
          : [];

      formikPreference.setFieldValue("email_prefer", email_prefer.map(String));
      formikPreference.setFieldValue("sms_prefer", sms_prefer.map(String));
    }
  }, [userPreferences]);

  const formikPreference = useFormik({
    initialValues: {
      email_prefer: [],
      sms_prefer: [],
    },
    onSubmit: async (values) => {
      let payload = {
        user_id: user.id,
        email_settings: values.email_prefer.join(),
        sms_settings: values.sms_prefer.join(),
      };
      const response = await setPreference(payload);
      if (response.notify_status) {
        setAlert(response.notify_status, "success");
      }
    },
  });

  const allNotifications = [
    { id: 1, description: "Bidding", email: 1, sms: 1 },
    { id: 2, description: "Outbid", email: 1, sms: 1 },
    { id: 3, description: "Watchlist", email: 1, sms: 1 },
    { id: 4, description: "Saved Search", email: 1, sms: 1 },
    { id: 5, description: "Auction Invite", email: 1, sms: 1 },
    { id: 6, description: "Won Item", email: 1, sms: 1 },
    { id: 7, description: "Lost Item", email: 1, sms: 1 },
    { id: 8, description: "Paid Invoice", email: 1, sms: 1 },
    { id: 9, description: "Payment Notify", email: 1, sms: 1 },
  ];
  return (
    <DashboardLayout title="Notifications">
      <div className="myNotifications">
        <h5 className="dashSubtitle">
          Auction.io will send emails based on a wide variety of events that may
          occur as seen below. Some notifications such as Payment information
          will be sent regardless of your email preference settings.
        </h5>
        <div className="table-responsive aiTable">
          <form onSubmit={formikPreference.handleSubmit} autoComplete="nofill">
            <table className="table text-left">
              <thead>
                <tr>
                  <th scope="col">S no</th>
                  <th scope="col">Notification</th>
                  <th scope="col">Email</th>
                  <th scope="col">SMS</th>
                </tr>
              </thead>
              <tbody>
                {allNotifications.map((data, index) => (
                  <>
                    <tr key={data.id}>
                      <td>{index + 1}</td>
                      <td>{data.description}</td>
                      <td>
                        <CheckBox
                          name={"email_prefer"}
                          label={""}
                          checked={
                            formikPreference.values["email_prefer"].indexOf(
                              data.id.toString()
                            ) !== -1
                              ? true
                              : false
                          }
                          value={data.id.toString()}
                          onChange={formikPreference.handleChange}
                        />
                      </td>
                      <td>
                        <CheckBox
                          name={"sms_prefer"}
                          label={""}
                          checked={
                            formikPreference.values["sms_prefer"].indexOf(
                              data.id.toString()
                            ) !== -1
                              ? true
                              : false
                          }
                          value={data.id.toString()}
                          onChange={formikPreference.handleChange}
                        />
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <div className="dashActBtn">
              <PrimaryButton type="submit" btnSize="m-auto" label="Save" />
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
