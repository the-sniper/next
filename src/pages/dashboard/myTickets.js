import React, { useState, useEffect, useContext } from "react";
import { Button } from "@material-ui/core";
import DashboardLayout from "../../components/templates/DashboardLayout";
import CheckBox from "../../components/atoms/CheckBox";
import { useFormik } from "formik";
import UserContext from "../../context/user/userContext";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import {
  currencyFormat,
  handleRedirectInternal,
  dateFormatFront,
} from "../../common/components";
import { useHistory, Link } from "react-router-dom";
import { Pagination } from "@material-ui/lab";
function MyTickets() {
  const { getPreference, setPreference } = useContext(UserContext);
  const {
    isAuthenticated,
    user,
    get_booked_tickets,
    responseStatus: book_ticket_status,
    clearResponse,
  } = useContext(AuthContext);
  const [Loading, setLoading] = useState(true);
  const { setAlert } = useContext(AlertContext);
  const [ticket_details, setBookedDetails] = useState([]);
  const [total_result, setTotalResult] = useState(0);
  const [page, setPage] = useState(1);
  const history = useHistory();
  useEffect(() => {
    if (user) {
      get_booked_tickets({ user_id: user.id, perpage: 10, page: 1 });
    }
  }, [user]);

  useEffect(() => {
    if (book_ticket_status) {
      if (book_ticket_status.from === "booked_ticket_status") {
        setBookedDetails(
          book_ticket_status.message?.seatList
            ? book_ticket_status.message.seatList
            : []
        );
        setTotalResult(
          book_ticket_status.message?.total_results
            ? book_ticket_status.message.total_results
            : 0
        );
        setLoading(false);
      }
    }
  }, [book_ticket_status]);

  const onHandlePage = (event, value) => {
    setPage(value);
    get_booked_tickets({ user_id: user.id, perpage: 10, page: value });
  };

  //   const formikPreference = useFormik({
  //     initialValues: {
  //       email_prefer: [],
  //       sms_prefer: [],
  //     },
  //     onSubmit: async (values) => {
  //       let payload = {
  //         user_id: user.id,
  //         email_settings: values.email_prefer.join(),
  //         sms_settings: values.sms_prefer.join(),
  //       };
  //       const response = await setPreference(payload);
  //       if (response.notify_status) {
  //         setAlert(response.notify_status, "success");
  //       }
  //     },
  //   });

  //   const allNotifications = [
  //     { id: 1, description: "Bidding", email: 1, sms: 1 },
  //     { id: 2, description: "Outbid", email: 1, sms: 1 },
  //     { id: 3, description: "Watchlist", email: 1, sms: 1 },
  //     { id: 4, description: "Saved Search", email: 1, sms: 1 },
  //     { id: 5, description: "Auction Invite", email: 1, sms: 1 },
  //     { id: 6, description: "Won Item", email: 1, sms: 1 },
  //     { id: 7, description: "Lost Item", email: 1, sms: 1 },
  //     { id: 8, description: "Paid Invoice", email: 1, sms: 1 },
  //     { id: 9, description: "Payment Notify", email: 1, sms: 1 },
  //   ];

  return (
    <DashboardLayout title="My Tickets">
      <div className="myNotifications">
        {/* <h5 className="dashSubtitle">
          Auction.io will send emails based on a wide variety of events that may
          occur as seen below. Some notifications such as Payment information
          will be sent regardless of your email preference settings.
        </h5> */}
        {Loading ? (
          ""
        ) : (
          <div className="table-responsive aiTable">
            {ticket_details.length > 0 ? (
              <>
                <div className="tcktWrpr">
                  {ticket_details.map((data, index) => (
                    <div
                      className="tcktVw cursorDecoy"
                      onClick={() =>
                        history.push(
                          `/auctionView?auctionId=${data.auction_id}`
                        )
                      }
                    >
                      <div className="tcktDtls">
                        <div className="topVw">
                          <h2>{data.event_title}</h2>
                          <span>
                            {data.seat_obj
                              ? JSON.parse(data.seat_obj).length
                              : 0}{" "}
                            {data.seat_obj
                              ? JSON.parse(data.seat_obj).length > 1
                                ? "Tickets"
                                : "Ticket"
                              : ""}
                          </span>
                        </div>
                        <div className="tcktInfo">
                          <div className="stTmInfo">
                            <div className="stInfo">
                              <label>Seat No</label>
                              <p>{data.seat_number}</p>
                            </div>
                            <div className="stInfo">
                              <label>Date & Time</label>
                              <p>{dateFormatFront(data.date_added)}</p>
                            </div>
                            <div className="stInfo">
                              <label>Location</label>
                              <p>
                                {data.stage_name}, <br />
                                <small>{data.city}</small>
                              </p>
                            </div>
                            <div className="stInfo">
                              <label>Price</label>
                              <p>{currencyFormat(data.amount)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tcktStatus">
                        <div className="qrContianer">
                          <img
                            src={`${process.env.NEXT_PUBLIC_FORWARD_DOMAIN}/images/qr/${data.qr_code}`}
                          />
                        </div>
                        <p>BOOKED</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="np-pro-box">{"No tickets found"}</div>
            )}
          </div>
        )}
        {ticket_details.length > 0 ? (
          <div>
            <Pagination
              count={Math.ceil(total_result / 10)}
              page={page}
              onChange={onHandlePage}
              siblingCount={3}
              showFirstButton
              showLastButton
              boundaryCount={2}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyTickets;
