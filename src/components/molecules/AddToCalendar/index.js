import React, { useState } from "react";
import { google, outlook, office365, yahoo, ics } from "calendar-link";
import { Button } from "@material-ui/core";
import CustomDialog from "../../organisms/Dialog";

function AddToCalendar(props) {
  const [openModal, setModal] = useState(false);
  const changeDialogStatus = () => {
    setModal(!openModal);
  };

  const calendarActions = [
    {
      icon: <img src="/assets/svg/googleCal.svg" alt="Google" />,
      name: "Google Calendar",
      type: "google",
    },
    {
      icon: <img src="/assets/svg/yahooCal.svg" alt="Yahoo" />,
      name: "Yahoo Calendar",
      type: "yahoo",
    },
    {
      icon: <img src="/assets/svg/outlookCal.svg" alt="Outlook" />,
      name: "Outlook Calendar",
      type: "outlook",
    },
    // {
    //     icon: <img src="/assets/svg/outlookCal.svg" alt="iCal" />,
    //     name: 'iCal',
    //     type: 'ical',
    // },
  ];

  const calendarRedirect = (type) => {
    const event = {
      title: props.data.title,
      description: props.data.description,
      start: props.data.date_added,
      end: props.data.date_closed,
      location: props.data.city,
    };
    if (typeof window !== "undefined") {
      if (type === "ical") {
        // FileSaver.saveAs(ics(event), 'calendar_event.ics')
      } else if (type === "yahoo") {
        const RedirectURL = new URL(yahoo(event));
        window.open(RedirectURL, "_blank");
      } else if (type === "outlook") {
        const RedirectURL = new URL(outlook(event));
        window.open(RedirectURL, "_blank");
      } else {
        const RedirectURL = new URL(google(event));
        window.open(RedirectURL, "_blank");
      }
    }
  };
  return (
    <>
      <Button onClick={changeDialogStatus} className="calBtn">
        {props.icon ? <i className="material-icons">calendar_today</i> : ""}
        Add to calendar
      </Button>
      <CustomDialog
        title="Add to your calendar"
        open={openModal}
        function={changeDialogStatus}
      >
        <div className="addToCalendar">
          {calendarActions.map((action, index) => (
            <Button
              key={index}
              onClick={(e) => {
                calendarRedirect(action.type);
              }}
            >
              {action.icon}
              {action.name}
            </Button>
          ))}
        </div>
      </CustomDialog>
    </>
  );
}

export default AddToCalendar;
