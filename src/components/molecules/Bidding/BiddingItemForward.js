import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import CustomInput from "../../atoms/Inputs/CustomInput";
import PrimaryButton from "../../atoms/PrimaryButton";
import {
  mapData,
  currencyFormat,
  handleRedirectInternal,
} from "../../../common/components";
import AuthContext from "../../../context/auth/authContext";
import BuyerContext from "../../../context/buyer/buyerContext";
import AlertContext from "../../../context/alert/alertContext";
import AuctionContext from "../../../context/auction/auctionContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { biddercheck } from "../../../common/bidcheck";

const BiddingItemForward = ({
  type,
  size,
  lotdetails,
  auctionId,
  listOfCards,
  setViewAddCredit,
  auctionDtl,
  liveLot,
  cancelBid,
}) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { bidConfirm, mobileConfirm } = useContext(BuyerContext);
  const { setAlert } = useContext(AlertContext);
  const history = useHistory();
  const [offerbtnDisable, setOfferbtnDisable] = useState(false);
  const { bidOffer, bidLive } = useContext(AuctionContext);
  const validationArray = Yup.object({
    wsprice: Yup.number()
      .positive("Please enter a valid number!")
      .integer()
      .typeError("Please enter a valid number!")
      .min(
        lotdetails ? lotdetails?.next_bid : 0,
        `Min Bid ${
          lotdetails ? currencyFormat(lotdetails?.next_bid) : currencyFormat(0)
        }`
      )
      .required("Enter bid amount"),
  });

  //console.log("auction details",auctionDtl,lotdetails)

  const formik = useFormik({
    initialValues: {
      // wsprice: "",
      // id: 0,
      // hard_bid: "",
      // bid_increment: 0,
      // email: "",
      // first_name: "",
      // last_name: "",
      // producturl: "",
      auction_io: 1,
      bid_increment: 0,
      email: "",
      first_name: "",
      hard_bid: "",
      id: 0,
      userid: "",
      last_name: "",
      producturl: `http://${window.location.hostname}/productView/${lotdetails.lotDetails?.id}?auctionId=${auctionDtl?.id}&auctionLotId=${lotdetails.lotDetails?.id}`,
      wsprice: "",
    },
    validationSchema: validationArray,
    onSubmit: async (values) => {
      setOfferbtnDisable(true);
      if (values.bidding_type === "hard") {
        values.hard_bid = "1";
      } else {
        values.hard_bid = "0";
      }
      // if(auctionDtl != undefined){
      // if(Object.keys(auctionDtl).length !== 0 && user?.id){
      //   if(auctionDtl.state != user.state || parseInt(auctionDtl.zipcode) != parseInt(user.zip)){
      //       setOfferbtnDisable(false);
      //       setAlert("Your current location and item location has been mismatched.so you unable to bid this item.","error");
      //       return false;
      //   }
      // }}
      const bidder_check = await biddercheck(values);
      if (bidder_check) {
        const result = await mobileConfirm(values);
        if (result) {
          setOfferbtnDisable(false);
          formik.setFieldValue("wsprice", "");
          formik.setTouched({});
        }
      } else {
        setOfferbtnDisable(false);
        formik.setFieldValue("wsprice", "");
        formik.setTouched({});
        setAlert(
          "Your current location and item location has been mismatched.so you unable to bid this item.",
          "error"
        );
      }

      // else {
      //   const result1 = await bidLive(liveBidDtls);
      //   if (result1) {
      //     setOfferbtnDisable(false);
      //     formik.setFieldValue("wsprice", "");
      //     formik.setFieldTouched("wsprice", false);
      //     setAlert("Bid Offer Submitted Successfully", "success");
      //   }
      // }
    },
  });

  useEffect(() => {
    formik.setFieldValue("bidding_type", type);
  }, [type]);

  useEffect(() => {
    // console.log(lotdetails, "++++++++++++++++++++++++++++++++++++++++");
    if (lotdetails && lotdetails.lotDetails) {
      formik.setFieldValue("id", lotdetails.lotDetails?.id);

      formik.setFieldValue(
        "bid_increment",
        lotdetails.incrementamt || lotdetails.increment
      );
    } else {
      formik.setFieldValue("id", lotdetails?.id);

      formik.setFieldValue(
        "bid_increment",
        lotdetails.incrementamt || lotdetails.increment
      );
    }
  }, [lotdetails]);

  useEffect(() => {
    if (isAuthenticated) {
      if (user) {
        formik.setFieldValue("email", user.email);
        formik.setFieldValue("userid", user.id);
        formik.setFieldValue("first_name", user.first_name);
        formik.setFieldValue("last_name", user.last_name);
      }
    }
  }, [isAuthenticated, user]);

  const bidAmount = [
    {
      label: type === "hard" ? "Enter your bid" : "Place auto bid",
      name: "wsprice",
      type: "number",
      placeholder: `Min bid ${currencyFormat(lotdetails?.next_bid)}`,
      class: "",
      size: size,
      autoFocus: false,
      formik: formik,
      step: lotdetails?.incrementamt,
      min: lotdetails?.next_bid,
    },
  ];

  useEffect(() => {
    if (cancelBid) {
      // console.log("cancel bid", cancelBid);
      formik.setFieldValue("my_bid", "");
    }
  }, [cancelBid]);

  return (
    <>
      <form>
        {lotdetails &&
        (lotdetails.lotDetails?.market_status === "open" ||
          lotdetails?.market_status === "open") &&
        !liveLot ? (
          <div className="biddingCnt">
            {Object.values(mapData(bidAmount))}
            {isAuthenticated ? (
              <PrimaryButton
                label={type === "hard" ? "Submit bid" : "Submit Max bid"}
                type="button"
                btnSize={size ? size : "small"}
                className="fs-16"
                disabled={offerbtnDisable}
                onClick={formik.handleSubmit}
              />
            ) : (
              <PrimaryButton
                label={type === "hard" ? "Submit bid" : "Submit Max bid"}
                btnSize={size ? size : "small"}
                onClick={(e) => {
                  e.preventDefault();
                  handleRedirectInternal(history, "login");
                }}
              />
            )}
          </div>
        ) : (
          ""
        )}
      </form>
    </>
  );
};

export default BiddingItemForward;
