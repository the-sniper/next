import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import CustomInput from "../../atoms/Inputs/CustomInput";
import PrimaryButton from "../../atoms/PrimaryButton";
import {
  currencyFormat,
  handleRedirectInternal,
} from "../../../common/components";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import AuthContext from "../../../context/auth/authContext";
import BuyerContext from "../../../context/buyer/buyerContext";
import AlertContext from "../../../context/alert/alertContext";
import AuctionContext from "../../../context/auction/auctionContext";

function PreBidComponent({
  type,
  size,
  lotdetails,
  auctionId,
  user,
  is_not_approved,
}) {
  const history = useHistory();
  const [offerbtnDisable, setOfferbtnDisable] = useState(false);
  const [bidarray, setBidArray] = useState([]);
  const [finalArray, setFinalArray] = useState([]);
  const [tempState, setTempstate] = useState(false);
  const [lotId, setLotId] = useState(0);
  const auctionContext = useContext(AuctionContext);
  const alertContext = useContext(AlertContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [next_bid, setNextBid] = useState(lotdetails.next_bid || 0);

  const { bidOffer, bidLive } = auctionContext;
  const { setAlert } = alertContext;

  const validationArray = Yup.object({
    amount: Yup.number()
      .min(
        lotdetails ? lotdetails.next_bid : 0,
        `You Have Placed Highest Max Bid!, Your Next Min Bid ${
          lotdetails ? currencyFormat(lotdetails.next_bid) : currencyFormat(0)
        }`
      )
      .required("Enter bid amount"),
  });

  const formik = useFormik({
    initialValues: {
      amount: "",
      lotid: "",
      bidding_type: "",
      user_id: "",
      auction_id: "",
      hard_bid: 0,
      auction_io: 1,
      my_bid: "",
    },
    validationSchema: validationArray,
    onSubmit: async (values) => {
      setOfferbtnDisable(true);

      // console.log("is_not_approved", is_not_approved);

      if (parseInt(is_not_approved) === 1) {
        let bidValidation = finalArray.findIndex((e) => e == values.amount);
        if (bidValidation != -1) {
          // console.log("bidding live api call initiated");
          const result = await bidLive({
            wsprice: Number(values.amount),
            userid: values.user_id,
            id: values.lotid,
            lotid: values.lotid,
            bidplan: "auto",
            auctionid: values.auction_id,
          });
          if (result) {
            setOfferbtnDisable(false);
            formik.setFieldValue("amount", "");
            formik.setFieldTouched("amount", false);
            resetBidArray(Number(values.amount), null);
            //bid_update(Number(values.amount), finalArray);
            setAlert("Bid Submitted Successfully", "success");
            setTempstate(!tempState);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Invalid Bid Amount.",
            timer: 2500,
            showConfirmButton: false,
            position: "center",
          });
          setOfferbtnDisable(false);
        }
      } else if (parseInt(is_not_approved) === 0) {
        Swal.fire({
          icon: "error",
          title: "Please Register Live Auction And Participate.",
          timer: 2500,
          showConfirmButton: false,
          position: "center",
        });
        setOfferbtnDisable(false);
      }

      // console.log("values  ---- on submit bid", values);
    },
  });

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

  function resetBidArray(current_bid, select_bid, next_bid) {
    let min_end_bid = 100000;
    let dropdownCount = 100;
    let first_bid = current_bid || next_bid;

    // if (select_bid) {
    //     if (finalArray.length <= 0 || Number(select_bid) == finalArray[0]) {
    //         return false
    //     } else {
    //         let index = finalArray.indexOf(Number(select_bid)) - parseInt(dropdownCount / 2)
    //         if (index <= 0 || index >= finalArray.length) {
    //             return false
    //         } else {
    //             first_bid = finalArray[index]
    //         }
    //     }
    // }
    setFinalArray([]);
    let initialIndex = 0;
    setBidArray([]);
    lotdetails.BidIncrement.map((data, index) => {
      if (
        first_bid <= data.bprice_range_to &&
        first_bid >= data.bprice_range_from
      ) {
        initialIndex = index;
      }
    });
    let BidIncrement = lotdetails.BidIncrement;
    // console.log("BidIncrement", BidIncrement);
    if (lotdetails.BidIncrement.length !== 0) {
      let currentBid = Number(first_bid);
      let nextStart = Number(BidIncrement[initialIndex + 1]?.bprice_range_from);
      let minValue = Number(BidIncrement[initialIndex]?.bprice_range_to);
      let startValue = Number(BidIncrement[initialIndex]?.bprice_range_from);
      let incr = Number(BidIncrement[initialIndex]?.per_price);
      let nextbid;
      // console.log(
      //   "initial bid increment value",
      //   initialIndex,
      //   minValue,
      //   incr,
      //   nextStart
      // );

      if (
        current_bid &&
        lotdetails.next_bid &&
        Number(lotdetails.next_bid) > currentBid + incr
      ) {
        resetBidArray(null, null, Number(lotdetails.next_bid));
        return false;
      }
      let set_nextbid = false;

      if (
        initialIndex != 0 &&
        Number(currentBid) <= Number(minValue) &&
        (Number(currentBid) - Number(startValue)) % Number(incr) != 0
      ) {
        let times = Math.floor(
          (Number(currentBid) - Number(startValue)) / Number(incr)
        );
        currentBid = Number(startValue) + Number(incr) * times;
      }

      if (next_bid) {
        bidarray.push(currentBid);
        setNextBid(currentBid);
        set_nextbid = true;
      }

      for (let i = 0; true; i++) {
        if (Number(currentBid) <= Number(minValue)) {
          nextbid = currentBid + incr;
          if (
            Number(nextbid) > Number(minValue) &&
            initialIndex + 1 < BidIncrement.length
          ) {
            nextbid = Number(BidIncrement[initialIndex + 1]?.bprice_range_from);
          }
          currentBid = nextbid;
          bidarray.push(nextbid);
          if (!set_nextbid) {
            set_nextbid = true;
            setNextBid(nextbid);
          }

          // console.log('next bid valueeee', nextbid)
        } else {
          // console.log("next initial index", initialIndex);
          initialIndex = initialIndex + 1;
          if (initialIndex >= BidIncrement.length) {
            break;
          }
          nextStart = Number(BidIncrement[initialIndex + 1]?.bprice_range_from);
          minValue = Number(BidIncrement[initialIndex]?.bprice_range_to);
          startValue = Number(BidIncrement[initialIndex]?.bprice_range_from);
          incr = Number(BidIncrement[initialIndex]?.per_price);
          // console.log(
          //   "changing the bid increment value",
          //   initialIndex,
          //   minValue,
          //   incr,
          //   nextStart
          // );
        }
        if (i >= dropdownCount) {
          break;
        }
      }
    } else {
      let currentBid = Number(first_bid);
      let incr = Number(lotdetails.increment);
      let nextbid;

      for (let i = 0; true; i++) {
        nextbid = currentBid + incr;
        currentBid = nextbid;
        bidarray.push(nextbid);
        // console.log('next bid valueeee', nextbid)
        if (i >= dropdownCount) {
          break;
        }
      }
    }
    setFinalArray(bidarray);
    if (current_bid || next_bid) {
      formik.setFieldValue("amount", bidarray[0]);
    }
  }

  function bid_update(current_bid, bidarray) {
    // console.log("bid_index", current_bid, bidarray);
    var bid_index = bidarray.indexOf(current_bid);
    var new_bid_increment = bidarray.slice(bid_index, bidarray.length);
    setFinalArray(new_bid_increment);
    if (current_bid) {
      formik.setFieldValue("amount", new_bid_increment[0]);
    }
    // console.log("bid_index", bid_index, new_bid_increment, current_bid);
  }

  useEffect(() => {
    if (
      finalArray.length != 0 &&
      Number(lotdetails.current_bid) < finalArray[0] &&
      lotdetails.lotdetails &&
      lotId == lotdetails.lotdetails.id
    ) {
    } else {
      resetBidArray(Number(lotdetails.current_bid), null);
    }
    if (lotdetails.lotdetails) {
      setLotId(lotdetails.lotdetails.id);
    }
  }, [lotdetails.current_bid]);

  //   console.log('lot formik', formik.values);

  return (
    <>
      {lotdetails &&
      lotdetails.lotDetails &&
      lotdetails.lotDetails.market_status === "open" ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="biddingCnt">
            <div>
              <select
                className="bidSelectVal"
                name="amount"
                onChange={formik.handleChange}
                value={formik.values.amount}
              >
                {finalArray?.map((data, index) => (
                  <option value={data}>{currencyFormat(data)}</option>
                ))}
              </select>
              <p className="text-danger text-left my-2">
                {formik.errors && formik.errors.amount}
              </p>
            </div>
            {isAuthenticated ? (
              <PrimaryButton
                label={"Place Max bid"}
                type="submit"
                btnSize={size ? size : "small"}
                className="fs-16"
                disabled={offerbtnDisable}
              />
            ) : (
              <PrimaryButton
                label="Login to Bid"
                btnSize={size ? size : "small"}
                onClick={(e) => {
                  e.preventDefault();
                  handleRedirectInternal(history, "login");
                }}
              />
            )}
          </div>
        </form>
      ) : (
        ""
      )}
    </>
  );
}

export default PreBidComponent;
