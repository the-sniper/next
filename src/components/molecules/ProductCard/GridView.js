import { Button, Fade, Tooltip } from "@mui/material";
import React, { useState, useRef, useEffect, useContext } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CustomInput from "../../../components/atoms/Inputs/CustomInput";
import FavouriteCheckbox from "../../../components/atoms/FavoriteCheckbox";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import SecondaryButton from "../../../components/atoms/SecondaryButton";
import Timer from "../../../common/timer";
import {
  capitalize,
  dateFormatFront,
  noImageAvailable,
  getImages_url_check,
} from "../../../common/components";
import {
  handleRedirectInternal,
  currencyFormat,
  mapData,
  searchQueryParam,
} from "../../../common/components";
import Bidding from "../Bidding/BiddingItem";
import AlertContext from "../../../context/alert/alertContext";
import AuthContext from "../../../context/auth/authContext";
import AuctionContext from "../../../context/auction/auctionContext";
import BuyerContext from "../../../context/buyer/buyerContext";
import UserContext from "../../../context/user/userContext";
import CommonContext from "../../../context/common/commonContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { biddercheck } from "../../../common/bidcheck";
import BiddingItemForward from "../Bidding/BiddingItemForward";
import { useRouter } from "next/router";

const Grid = (props) => {
  const today = new Date();
  const [product, setProduct] = useState();
  const [auctionDtls, setAuctionDtls] = useState();
  const [offerbtnDisable, setOfferbtnDisable] = useState(false);
  const [buynowbtnDisable, setBuynowbtnDisable] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const { bidOffer, bidLive } = useContext(AuctionContext);
  const { addToCartSingle, mobileConfirm } = useContext(BuyerContext);
  const { getCheckout } = useContext(UserContext);

  const { setBidHistoryValue } = useContext(CommonContext);

  useEffect(() => {
    setProduct(props.data);
  }, [props.data]);

  useEffect(() => {
    setAuctionDtls(props.auctionDetails);
  }, [props.auctionDetails]);

  const validationArray = Yup.object({
    amount: Yup.number()
      .min(
        product ? product.wprice : 0,
        `Min Bid ${
          product ? currencyFormat(product.next_bid) : currencyFormat(0)
        }`
      )
      .test("is-decimal", "Cannot be decimal", (value) =>
        value ? typeof value === "number" && value % 1 === 0 : true
      )
      .required("Enter bid amount"),
  });

  useEffect(() => {
    if (product) {
      formik.setFieldValue("lotid", product.id);
    }
  }, [product]);

  useEffect(() => {
    if (auctionDtls) {
      formik.setFieldValue("auction_id", auctionDtls.id);
    }
  }, [auctionDtls]);

  useEffect(() => {
    if (
      (router.pathname === "/" && product) ||
      (router.pathname === "/search" && product) ||
      (router.pathname === "/myBids" && product) ||
      (router.pathname.includes("/auctionView") && product)
    ) {
      formik.setFieldValue(
        "auction_id",
        router.pathname === "/search" ||
          router.pathname.includes("/auctionView")
          ? product.lotof
          : product.auction_id
      );
    }
  }, [router.pathname, product]);

  const formik = useFormik({
    initialValues: {
      amount: "",
      lotid: "",
      user_id: user && user.id ? user.id : "",
      auction_id: "",
    },
    validationSchema: validationArray,
    onSubmit: async (values) => {
      // if(user?.id && auctionDtls?.state){
      //   if(auctionDtls.state != user.state || parseInt(auctionDtls.zipcode) != parseInt(user.zip)){
      //       setAlert("Your current location and item location has been mismatched.so you unable to bid this item.","error");
      //       return false;
      //   }
      // }
      let liveBidDtls = {
        wsprice: values.amount,
        auctionid: product ? product.auction_id : "",
        id: product ? product.id : "",
        userid: user && user.id ? user.id : "",
        bidplan: "auto",
        lotid: product ? product.id : "",
      };

      let forwardBid = {
        auction_io: 1,
        bid_increment: "",
        email: user && user.email ? user.email : "",
        first_name: user && user.first_name ? user.first_name : "",
        hard_bid: "1",
        id: product ? product.id : "",
        userid: user && user.id ? user.id : "",
        last_name: user && user.last_name ? user.last_name : "",
        producturl: `${window.location.origin}/productView/${product.id}?auctionId=${product.auction_id}&auctionLotId=${product.id}`,
        wsprice: values.amount,
      };
      // if (!Boolean(props.listOfCards.length)) {
      //   props.setViewAddCredit(true);
      // }
      // if (Boolean(props.listOfCards.length)) {
      setOfferbtnDisable(true);
      const bidder_check = await biddercheck(forwardBid);
      if (bidder_check) {
        if (auctionDtls?.auction_type === 1) {
          const result1 = await bidLive(liveBidDtls);
          // console.log(result1, "this is then");
          if (result1) {
            setOfferbtnDisable(false);
            formik.setFieldValue("amount", "");
            formik.setFieldTouched("amount", false);
            setAlert("Bid Offer Submitted Successfully", "success");
          }
        } else {
          const result = await mobileConfirm(forwardBid);
          if (result) {
            setOfferbtnDisable(false);
            formik.setFieldValue("amount", "");
            formik.setFieldTouched("amount", false);
          }
        }
      } else {
        setOfferbtnDisable(false);
        formik.setFieldValue("amount", "");
        formik.setFieldTouched("amount", false);
        setAlert(
          "Your current location and item location has been mismatched.so you unable to bid this item.",
          "error"
        );
      }
      // }
    },
  });

  const bidAmount = [
    {
      label: props.auctionType === "live" ? "Enter offer" : "Enter Bid",
      name: "amount",
      type: "number",
      placeholder: `Bid ${
        product && product.next_bid
          ? currencyFormat(product.next_bid)
          : product && product.wprice
          ? currencyFormat(product.wprice + product?.incrementamt)
          : currencyFormat(0)
      }`,
      class: "",
      size: "small",
      autoFocus: false,
      formik: formik,
    },
  ];

  const handleBuyNowClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let data = [];
    data.push({ id: product.id, user_id: user.id, qty: 1 });
    setBuynowbtnDisable(true);
    const result = await addToCartSingle({ cart_data: data });
    if (result) {
      setAlert("Item Added to your cart", "success");
      getCheckout({ user_id: user.id });
      props.updateData();
    } else {
      setAlert("An Error Occured", "error");
    }
    setBuynowbtnDisable(false);
  };
  // console.log(product, "this is the prodict");

  return (
    <Fade in={true} timeout={600}>
      <div className="productCardGrid">
        {product ? (
          <>
            <div className="pcgImg">
              <FavouriteCheckbox
                watchlisted={product.wat_list}
                project_id={product.id}
                updateData={props.updateData}
              />
              {/* <img
                // src={`${global.site_url}/uploads/product/${product.avatar}`}
                src={`${global.images_url}${product.avatar}`}
                alt={product.title}
                onClick={props.drawerHandler}
                className="cursorDecoy"
                onError={(e) => noImageAvailable(e)}
              /> */}
              {props.auctionType === "live" ? (
                <>
                  <LazyLoadImage
                    src={getImages_url_check(
                      product.avatar,
                      product.content_head1
                    )}
                    alt={product.title}
                    onClick={() =>
                      handleRedirectInternal(
                        router,
                        `lotView/${
                          router?.query.auctionId || product.auction_id
                        }/${product.id}/${user.id ? user.id : 0}`
                      )
                    }
                    className="cursorDecoy"
                    onError={(e) => noImageAvailable(e)}
                    effect="blur"
                    placeholderSrc="assets/svg/imageLoading.svg"
                    height="100%"
                    width="100%"
                  />
                </>
              ) : (
                <LazyLoadImage
                  src={getImages_url_check(
                    product.avatar,
                    product.content_head1
                  )}
                  alt={product.title}
                  onClick={props.drawerHandler}
                  className="cursorDecoy"
                  onError={(e) => noImageAvailable(e)}
                  effect="blur"
                  placeholderSrc="assets/svg/imageLoading.svg"
                  height="100%"
                  width="100%"
                />
              )}
              {/* <Tooltip title="Some info">
                <span className="sponsoredTag">
                  Sponsored
                  <span className="material-icons-outlined">info</span>
                </span>
              </Tooltip> */}

              {
                <>
                  {/* {product.bidtopstatus === "outbid" && (
                    <h4 className="productWinningStatus outbid">Outbid</h4>
                  )}
                  {product.bidtopstatus === "winner" && (
                    <h4 className="productWinningStatus winning">Winning</h4>
                  )}
                  {product.bidtopstatus === "won" && (
                    <h4 className="productWinningStatus won">Won</h4>
                  )}
                  {product.bidtopstatus === "lost" && (
                    <h4 className="productWinningStatus lost">Lost</h4>
                  )} */}
                </>
              }
              {product.market_status === "open" ? (
                <div className="gridTimer absolTimer">
                  {props.noTimer ||
                  (product.buynow === 1 && product.auction === 0) ? (
                    <p className="noTimerWrpr"></p>
                  ) : (
                    <p>
                      {product.date_closed ? (
                        <Timer
                          date_added={product.date_added}
                          date_closed={product.date_closed}
                          withText={1}
                          endText={"Time left" + ":"}
                          startText={"Starts in" + ":"}
                        ></Timer>
                      ) : null}
                    </p>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <p className="lot-id">
              <span>Lot ID:</span>
              <span className="lot-no">
                {product.sku
                  ? product.sku
                  : product.deed_document
                  ? product.deed_document
                  : product.lot_number
                  ? product.lot_number
                  : product.id}
              </span>
            </p>
            {props.auctionType === "live" ? (
              <h2
                className="gridProdTitle"
                onClick={() =>
                  handleRedirectInternal(
                    router,
                    `lotView/${router?.query.auctionId || product.auction_id}/${
                      product.id
                    }/${user.id ? user.id : 0}`
                  )
                }
              >
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: product.title,
                  }}
                />
              </h2>
            ) : (
              <h2 className="gridProdTitle" onClick={props.drawerHandler}>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: product.title,
                  }}
                />
              </h2>
            )}

            {/* <p className="lot-id">
              <span>Est:</span>
              <span className="lot-no">
                ${product.lowest || 100} - ${product.highest || 1000}
              </span>
            </p> */}
            <p className="locationInfo">
              <span>Location:</span>
              {props.location ? (
                <span>{props.location}</span>
              ) : (
                product.city &&
                product.state &&
                product.country && (
                  <span>{`${product.city.trim()}, ${product.state}, ${
                    product.country
                  }`}</span>
                )
              )}
            </p>
            {product.market_status === "open" ? (
              <>
                <div
                  className="cursorDecoy gridBidInfo d-flex justify-content-between align-items-center"
                  onClick={() => setBidHistoryValue(product.id)}
                >
                  {product.auction == 1 ? (
                    <>
                      <div className="prcCntnr d-flex flex-column">
                        <label>
                          {product.bid_cnt != 0
                            ? "Current Price"
                            : "Start Price"}
                        </label>
                        <span>{currencyFormat(product.wprice)}</span>
                      </div>
                      {product.buynow == 1 ? (
                        <>
                          <div className="prcCntnr d-flex flex-column">
                            <label>Buy Now Price</label>
                            <span>{currencyFormat(product.bprice)}</span>
                          </div>
                        </>
                      ) : (
                        <span>
                          {product.bid_count
                            ? product.bid_count
                            : typeof product.bid_cnt != undefined
                            ? product.bid_cnt
                            : typeof product.bidcnt != undefined
                            ? product.bidcnt
                            : 0}{" "}
                          bids
                        </span>
                      )}
                    </>
                  ) : product.auction == 0 && product.buynow == 1 ? (
                    <>
                      <div className="prcCntnr d-flex flex-column">
                        <label>Buy Now Price</label>
                        <span>{currencyFormat(product.bprice)}</span>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                {/* <div className="gridBidInfo d-flex justify-content-between align-items-center">
                  {(product.buynow &&
                    product.auction &&
                    product.bprice >= product.wprice) ||
                  (product.buynow && !product.auction) ? (
                    <>
                      {currencyFormat(product.bprice)}
                      <span>Buy Now Price</span>
                    </>
                  ) : (
                    ""
                  )}
                </div> */}
              </>
            ) : (
              <>
                <div className="gridBidInfo d-flex justify-content-between align-items-center">
                  <h6>
                    {props.action === "sold" || props.action === "order"
                      ? "Sold Price"
                      : "Current Price"}
                  </h6>
                  <p className="d-flex justify-content-between align-items-center">
                    <span>
                      {(product.market_status === "sold" && product.amount) ||
                      (props.action === "order" && product.amount)
                        ? currencyFormat(product.amount)
                        : currencyFormat(product.wprice)}
                    </span>
                    <span className="gridDivider">|</span>
                    <span
                      className="cursorDecoy"
                      onClick={() => setBidHistoryValue(product.id)}
                    >
                      {product.bidcnt
                        ? product.bidcnt
                        : typeof product.bid_cnt != undefined
                        ? product.bid_cnt
                        : 0}{" "}
                      bids{" "}
                    </span>
                  </p>
                </div>
                <div className="gridBidInfo d-flex justify-content-between align-items-center"></div>
              </>
            )}

            {product.market_status === "open" ? (
              <>
                {props.from !== "home" && props.auctionType != "live" && (
                  <>
                    {product.auction == 1 ? (
                      <>
                        <form onSubmit={formik.handleSubmit}>
                          <div className="biddingCnt bid-offer d-flex justify-content-between align-items-start">
                            {moment.utc(product.date_closed).local() >= today &&
                            product.auction ? (
                              <BiddingItemForward
                                lotdetails={product}
                                // auctionDtl={auctionDtls}
                                type={
                                  product?.store_config?.hard_bid == 1
                                    ? "hard"
                                    : "proxy"
                                }
                                size="medium"
                                className="fs-16"
                              />
                            ) : null}
                          </div>
                        </form>
                      </>
                    ) : (
                      <>
                        {product.buynow == 1 && product.auction == 0 ? (
                          <>
                            <div className="two-buttons">
                              {isAuthenticated ? (
                                <PrimaryButton
                                  label={"Buy Now"}
                                  btnSize={"small"}
                                  onClick={props.drawerHandler}
                                />
                              ) : (
                                <PrimaryButton
                                  label={"Buy Now"}
                                  btnSize={"small"}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRedirectInternal(router, "login");
                                  }}
                                />
                              )}
                              {/* {isAuthenticated ? (
                              <SecondaryButton
                                btnSize={"small"}
                                onClick={props.drawerHandler}>
                              <ShoppingCartIcon className="nav-icons" />
                              
                                  </SecondaryButton>
                            ) : (
                              <SecondaryButton
                                btnSize={"small"}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRedirectInternal(router, "login");
                                }}>
                                  <ShoppingCartIcon className="nav-icons" />
                                  </SecondaryButton>
                              
                            )} */}
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            ) : product.paid === 1 ? (
              <div className="gridTimerBlock ">
                <h6 className="d-flex align-items-center">
                  <span>Sold on: </span>
                  {dateFormatFront(product.paid_date)}
                </h6>
              </div>
            ) : (
              <div className="gridTimerBlock ">
                <h6 className="d-flex align-items-center">
                  <span>Closed on: </span>
                  {dateFormatFront(product.date_closed)}
                </h6>
              </div>
            )}

            {props.from === "dashboard" && props.action === "won" && (
              <div className="gridBidBox">
                <PrimaryButton
                  label={
                    props.invoice?.find(
                      (val) => val.common_invoice === product.common_invoice
                    )
                      ? "Remove"
                      : "Add To Checkout"
                  }
                  btnSize="small"
                  onClick={props.addToCheckout}
                />
              </div>
            )}
            {props.from === "dashboard" &&
              props.action === "order" &&
              (product.paid ? (
                <div className="gridBidBox">
                  <PrimaryButton
                    label="View Invoice"
                    btnSize="small"
                    onClick={() =>
                      handleRedirectInternal(
                        router,
                        `invoice/${product.common_invoice}`
                      )
                    }
                  />
                </div>
              ) : (
                <div className="gridBidBox">
                  <PrimaryButton
                    label={
                      props.invoice?.find(
                        (val) => val.common_invoice === product.common_invoice
                      )
                        ? "Remove"
                        : "Add To Checkout"
                    }
                    btnSize="small"
                    onClick={props.addToCheckout}
                  />
                </div>
              ))}
            {props.from !== "home" && (
              <div className="moreInfo text-center mt-2">
                {props.auctionType === "live" ? (
                  <Button
                    onClick={() =>
                      handleRedirectInternal(
                        router,
                        `lotView/${
                          router?.query.auctionId || product.auction_id
                        }/${product.id}/${user?.id ? user.id : 0}`
                      )
                    }
                  >
                    View more info
                    <span
                      className={`material-icons ${
                        document.body.dir === "rtl" && "rtl"
                      }`}
                    >
                      arrow_right_alt
                    </span>
                  </Button>
                ) : (
                  <Button onClick={props.drawerHandler}>
                    View more info
                    <span
                      className={`material-icons ${
                        document.body.dir === "rtl" && "rtl"
                      }`}
                    >
                      arrow_right_alt
                    </span>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </Fade>
  );
};

export default Grid;
