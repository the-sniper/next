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

function BiddingItem({
  type,
  size,
  lotdetails,
  auctionId,
  listOfCards,
  setViewAddCredit,
  auctionDtl,
  liveLot,
  cancelBid,
}) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { bidConfirm } = useContext(BuyerContext);
  const { setAlert } = useContext(AlertContext);
  const history = useHistory();
  const [offerbtnDisable, setOfferbtnDisable] = useState(false);
  const { bidOffer, bidLive } = useContext(AuctionContext);

  // const validationArray = Yup.object({
  //   amount: Yup.number()
  //     .min(
  //       lotdetails ? lotdetails.next_bid : 0,
  //       `Min Bid ${
  //         lotdetails
  //           ? currencyFormat(lotdetails.current_bid + lotdetails.incrementamt)
  //           : currencyFormat(0)
  //       }`
  //     )
  //     .required('Enter bid amount'),
  // });

  // console.log(listOfCards, 'this is list of cards');
  // console.log(lotdetails, 'liveLot');
  const formik = useFormik({
    initialValues: {
      amount: "",
      lotid: "",
      bidding_type: "",
      user_id: "",
      auction_id: "",
      hard_bid: 0,
      my_bid: "",
    },
    // validationSchema: validationArray,
    onSubmit: async (values) => {
      let liveBidDtls = {
        wsprice:
          typeof liveLot !== "undefined" && !!liveLot
            ? lotdetails.current_bid + lotdetails.increment
            : values.amount,
        auctionid: auctionDtl ? auctionDtl.auction_id : "",
        id: lotdetails ? lotdetails.lotDetails.id : "",
        userid: user && user.id ? user.id : "",
        bidplan: "auto",
        lotid: lotdetails ? lotdetails.lotDetails.id : "",
      };
      // if (!Boolean(listOfCards.length)) {
      //   setViewAddCredit(true);
      // }
      // if (Boolean(listOfCards.length)) {
      setOfferbtnDisable(true);
      if (values.bidding_type === "hard") {
        values.hard_bid = 1;
      } else {
        values.hard_bid = 0;
      }
      values.amount = lotdetails ? lotdetails.next_bid : "";
      if (values.bidding_type === "hard") {
        const result = await bidConfirm(values);
        if (result) {
          setOfferbtnDisable(false);
          formik.setFieldValue("amount", "");
          formik.setFieldTouched("amount", false);
          formik.setFieldValue("my_bid", values.amount);
          setAlert("Bid Submitted Successfully", "success");
        }
      } else {
        const result1 = await bidLive(liveBidDtls);
        if (result1) {
          setOfferbtnDisable(false);
          formik.setFieldValue("amount", "");
          formik.setFieldTouched("amount", false);
          setAlert("Bid Offer Submitted Successfully", "success");
        }
      }
    },
  });
  // console.log(lotdetails, 'lotdetails========>>>>>');
  const biddingItems = async (values) => {
    let liveBidDtls = {
      wsprice:
        typeof liveLot !== "undefined" && !!liveLot
          ? lotdetails.current_bid + lotdetails.increment
          : values.amount,
      auctionid: auctionDtl ? auctionDtl.auction_id : "",
      id: lotdetails ? lotdetails.lotDetails.id : "",
      userid: user && user.id ? user.id : "",
      bidplan: "auto",
      lotid: lotdetails ? lotdetails.lotDetails.id : "",
    };
    // if (!Boolean(listOfCards.length)) {
    //   setViewAddCredit(true);
    // }
    // if (Boolean(listOfCards.length)) {
    setOfferbtnDisable(true);
    if (values.bidding_type === "hard") {
      values.hard_bid = 1;
    } else {
      values.hard_bid = 0;
    }
    values.amount = lotdetails ? lotdetails.next_bid : "";
    if (values.bidding_type === "hard") {
      const result = await bidConfirm(values);
      if (result) {
        setOfferbtnDisable(false);
        formik.setFieldValue("amount", "");
        formik.setFieldTouched("amount", false);
        formik.setFieldValue("my_bid", values.amount);
        setAlert("Bid Submitted Successfully", "success");
      }
    } else {
      const result1 = await bidLive(liveBidDtls);
      if (result1) {
        setOfferbtnDisable(false);
        formik.setFieldValue("amount", "");
        formik.setFieldTouched("amount", false);
        setAlert("Bid Offer Submitted Successfully", "success");
      }
    }
  };
  useEffect(() => {
    formik.setFieldValue("bidding_type", type);
  }, [type]);

  useEffect(() => {
    formik.setFieldValue("auction_id", auctionId);
  }, [auctionId]);

  useEffect(() => {
    if (lotdetails && lotdetails.lotDetails) {
      formik.setFieldValue("lotid", lotdetails.lotDetails.id);
    }
  }, [lotdetails]);

  useEffect(() => {
    if (user) {
      formik.setFieldValue("user_id", user.id);
    }
  }, [user]);

  const bidAmount = [
    {
      label: type === "hard" ? "Enter your bid" : "Place auto bid",
      name: "amount",
      type: "number",
      placeholder: `Min bid ${
        lotdetails && lotdetails.lotDetails
          ? currencyFormat(lotdetails.current_bid + lotdetails.incrementamt)
          : currencyFormat(0)
      }`,
      class: "",
      size: size,
      autoFocus: false,
      formik: formik,
    },
  ];

  useEffect(() => {
    if (cancelBid) {
      // console.log('cancel bid', cancelBid);
      formik.setFieldValue("my_bid", "");
    }
  }, [cancelBid]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {lotdetails &&
        lotdetails.lotDetails &&
        lotdetails.lotDetails.market_status === "open" &&
        typeof liveLot === "undefined" ? (
          <div className="biddingCnt">
            {Object.values(mapData(bidAmount))}
            {isAuthenticated ? (
              <PrimaryButton
                label={type === "hard" ? "Submit bid" : "Submit Max bid"}
                type="submit"
                btnSize={size ? size : "small"}
                className="fs-16"
                disabled={offerbtnDisable}
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

        {lotdetails &&
          lotdetails.lotDetails &&
          lotdetails.lotDetails.market_status === "open" &&
          typeof liveLot !== "undefined" &&
          !!liveLot &&
          (isAuthenticated ? (
            Number(auctionDtl.is_register_active) === 1 ? (
              <PrimaryButton
                label={"REGISTRATION PENDING"}
                type="submit"
                btnSize={size ? size : "small"}
                className="fs-16"
                disabled={true}
              />
            ) : (
              <PrimaryButton
                type="submit"
                label={
                  type === "hard"
                    ? lotdetails.highbid
                      ? "You are the highest bidder"
                      : lotdetails &&
                        formik.values.my_bid == lotdetails.next_bid
                      ? "Your " +
                        currencyFormat(formik.values.my_bid) +
                        " bid is pending"
                      : `Place Bid - ${
                          lotdetails ? currencyFormat(lotdetails.next_bid) : ""
                        }`
                    : "Place Max bid"
                }
                btnSize={size ? size : "small"}
                className="fs-16"
                disabled={
                  offerbtnDisable ||
                  lotdetails.highbid ||
                  (lotdetails && formik.values.my_bid == lotdetails.next_bid)
                }
              />
            )
          ) : (
            <PrimaryButton
              label={"Login to Bid"}
              btnSize={size ? size : "small"}
              onClick={(e) => {
                e.preventDefault();
                handleRedirectInternal(history, "login");
              }}
            />
          ))}
      </form>
    </>
  );
}

export default BiddingItem;
