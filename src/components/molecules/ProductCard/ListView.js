import React, { useState, useRef, useEffect, useContext } from "react";
import { Button, Fade, Tooltip } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import CustomInput from "@/components/atoms/Inputs/CustomInput";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SecondaryButton from "@/components/atoms/SecondaryButton";
import FavouriteCheckbox from "@/components/atoms/FavoriteCheckbox";
// import Popup from '@/../custom/organisms/Popup'
import Timer from "@/common/timer";
import {
  capitalize,
  dateFormatFront,
  noImageAvailable,
  searchQueryParam,
  getImages_url_check,
} from "@/common/components";
import {
  handleRedirectInternal,
  currencyFormat,
  mapData,
} from "@/common/components";
import AlertContext from "@/context/alert/alertContext";
import AuthContext from "@/context/auth/authContext";
import AuctionContext from "@/context/auction/auctionContext";
import BuyerContext from "@/context/buyer/buyerContext";
import UserContext from "@/context/user/userContext";
import CommonContext from "@/context/common/commonContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import BiddingItem from "../Bidding/BiddingItem";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import BiddingItemForward from "../Bidding/BiddingItemForward";
import { biddercheck } from "@/common/bidcheck";
import { useRouter } from "next/router";

const ListView = (props) => {
  const today = new Date();
  const [addCard, setAddCard] = React.useState(false);
  const [offerbtnDisable, setOfferbtnDisable] = useState(false);
  const [buynowbtnDisable, setBuynowbtnDisable] = useState(false);
  const product = props.data;
  const router = useRouter();
  const [auctionDtls, setAuctionDtls] = useState();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const { bidOffer, bidLive } = useContext(AuctionContext);
  const { addToCartSingle, mobileConfirm } = useContext(BuyerContext);
  const { getCheckout } = useContext(UserContext);

  const { setBidHistoryValue } = useContext(CommonContext);

  const toggleModal = (state, action) => {
    setAddCard(!addCard);
  };

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

  const formik = useFormik({
    initialValues: {
      amount: "",
      lotid: "",
      user_id: user && user.id ? user.id : "",
      auction_id: "",
    },
    validationSchema: validationArray,
    onSubmit: async (values) => {
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
        producturl: `${window.location.hostname}/productView/${product.id}?auctionId=${product.auction_id}&auctionLotId=${product.id}`,
        wsprice: values.amount,
      };
      // if (!Boolean(props.listOfCards.length)) {
      //   props.setViewAddCredit(true);
      // }
      // if (Boolean(props.listOfCards.length)) {
      setOfferbtnDisable(true);
      const bidder_check = await biddercheck(forwardBid);
      if (bidder_check) {
        if (auctionDtls.auction_type === 1) {
          const result1 = await bidLive(liveBidDtls);
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
            setAlert("Bid Placed Successfully", "success");
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
      label: props.auctionType === "live" ? "Enter your offer" : "Enter Bid",
      name: "amount",
      type: "number",
      placeholder: `Min-bid ${
        product && product.next_bid
          ? currencyFormat(product.next_bid)
          : currencyFormat(0)
      }`,
      class: "",
      size: "medium",
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

  return (
    <Fade in={true} timeout={600}>
      <div className="productCardList d-flex justify-content-between align-items-start">
        <div className="psListLt d-flex">
          <div className="pclImg">
            <LazyLoadImage
              src={getImages_url_check(product.avatar, product.content_head1)}
              alt={product.title}
              onError={(e) => noImageAvailable(e)}
              effect="blur"
              placeholderSrc="assets/svg/imageLoading.svg"
              height="100%"
              width="200px"
            />
            <FavouriteCheckbox
              watchlisted={product.wat_list}
              project_id={product.id}
              updateData={props.updateData}
            />
            {/* <Tooltip title="Some info">
              <span className="sponsoredTag">
                Sponsored
                <span className="material-icons-outlined">info</span>
              </span>
            </Tooltip> */}
            <div className="listBidStatus">
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
                  {/* {(product.bidtopstatus === 'outbid' ||
                                        product.bidtopstatus === 'winner') &&
                                        product.wprice <= product.rprice && (
                                            <>
                                                <Tooltip title="Reserve price not met">
                                                    <span className="material-icons reserveNotMet">
                                                        lock_open
                                                    </span>
                                                </Tooltip>
                                            </>
                                        )} */}
                </>
              }
            </div>
          </div>
          {console.log(props.auctionType, "viewRoute")}
          <div className="listContent">
            {props.auctionType === "live" ? (
              <h2
                onClick={() =>
                  handleRedirectInternal(
                    router,
                    `lotView/${router.query.auctionId}/${product.id}/${
                      user.id ? user.id : 0
                    }`
                  )
                }
                className="listProdTitle"
              >
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: product.title,
                  }}
                />
              </h2>
            ) : (
              <h2 onClick={props.drawerHandler} className="listProdTitle">
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: product.title,
                  }}
                />
              </h2>
            )}
            <div
              className="listLotDetails"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>

            {/* <div className="listBidInfo d-flex justify-content-start align-items-center">
                            <h6>{t('auction')} id:</h6>
                            <p className="d-flex justify-content-between align-items-center">
                                <span>{`#${product.auctionid}`}</span>
                            </p>
                        </div> */}

            {product.market_status === "open" ? (
              <>
                {product.auction ? (
                  <div className="listBidInfo d-flex justify-content-start align-items-center">
                    {/* <h6>
                      {product?.bidcnt != 0 ? "Current Price:" : "Start Price:"}
                    </h6> */}
                    <p className="d-flex justify-content-between align-items-center">
                      <span>{currencyFormat(product.wprice)}</span>
                      <span className="listDivider">|</span>
                      <span
                        className="cursorDecoy"
                        onClick={() => setBidHistoryValue(product.id)}
                      >
                        {product.bid_count &&
                        typeof product.bid_cnt != undefined
                          ? product.bid_count
                          : product.bidcnt && typeof product.bidcnt != undefined
                          ? product.bidcnt
                          : 0}{" "}
                        bids
                      </span>
                    </p>

                    {/* <p className="d-flex justify-content-between align-items-center">
                      <span>Lot Id:</span>
                      <span className="cursorDecoy">{product.id}</span>
                    </p> */}
                  </div>
                ) : (
                  ""
                )}
                {/* {(product.buynow &&
                  product.auction &&
                  product.bprice >= product.wprice) ||
                (product.buynow && !product.auction) ? (
                  <div className="listBidInfo d-flex justify-content-start align-items-center">
                    <h6>Buy now price:</h6>
                    <p className="d-flex justify-content-between align-items-center">
                      <span>{currencyFormat(product.bprice)} </span>
                    </p>
                  </div>
                ) : (
                  ""
                )} */}
              </>
            ) : (
              <div className="listBidInfo d-flex justify-content-start align-items-center">
                {props.action === "won" || props.action === "order" ? (
                  <span>Sold Price: </span>
                ) : (
                  ""
                )}

                <p className="d-flex justify-content-between align-items-center">
                  <span>
                    {product.market_status === "sold" ||
                    props.action === "order"
                      ? currencyFormat(product.amount)
                      : currencyFormat(product.wprice)}
                  </span>
                  <span className="listDivider">|</span>
                  <span
                    className="cursorDecoy"
                    onClick={() => setBidHistoryValue(product.id)}
                  >
                    {product.bid_count
                      ? product.bid_count
                      : product.bidcnt
                      ? product.bidcnt
                      : typeof product.bid_cnt != undefined
                      ? product.bid_cnt
                      : 0}{" "}
                    bids{" "}
                  </span>
                </p>
                {/* <p className="d-flex justify-content-between align-items-center">
                  <span>Lot Id:</span>
                  <span className="cursorDecoy">{product.id}</span>
                </p> */}
              </div>
            )}
            {/* <div className="featuredOn">
              <h6>Featured on:</h6>
              <img src="/assets/images/slibuy.png" alt="Slibuy Logo" />
            </div> */}
            <div>
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

              <p className="lot-id">
                <span>Location: </span>
                {props.location ? (
                  <span>{props.location}</span>
                ) : (
                  product.city &&
                  product.state &&
                  product.country && (
                    <span className="lot-no">{`${product.city.trim()}, ${
                      product.state
                    }, ${product.country}`}</span>
                  )
                )}
              </p>
              <p className="lot-id">
                <span>Est:</span>
                <span className="lot-no">
                  ${product.lowest || 100} - ${product.highest || 1000}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="listActBtn d-flex justify-content-center align-items-center flex-wrap text-center">
          {product.market_status === "open" ? (
            <>
              <div className="listTimer w-100 d-flex justify-content-center align-items-center flex-wrap ">
                {!props.noTimer ? (
                  <p className="d-flex align-items-center ">
                    <span className="material-icons">timer</span>
                    {product.date_closed ? (
                      <Timer
                        date_added={product.date_added}
                        date_closed={product.date_closed}
                        withText={1}
                        endText={"Time left:"}
                        startText={"Starts in:"}
                      ></Timer>
                    ) : null}
                  </p>
                ) : (
                  <p className="noTimerWrpr"></p>
                )}
                {isAuthenticated &&
                props.auctionType != "live" &&
                product.auction == 1 ? (
                  <BiddingItemForward
                    lotdetails={product}
                    // auctionDtl={auctionDtls}
                    type={
                      product?.store_config?.hard_bid == 1 ? "hard" : "proxy"
                    }
                    size="medium"
                    className="fs-16"
                  />
                ) : null}
                {/* {props.auctionType != "live" ? (
                  <>
                    {product.auction == 1 ? (
                      <form onSubmit={formik.handleSubmit}>
                        <div className="biddingCnt bid-offer d-flex justify-content-between align-items-start">
                          {product.auction
                            ? Object.values(mapData(bidAmount))
                            : ""}
                          {isAuthenticated ? (
                            <>
                              {product.auction ? (
                                <div className="btnWrprGrd">
                                  <PrimaryButton
                                    label={
                                      props.auctionType === "live"
                                        ? "Submit Offer"
                                        : "Place Bid"
                                    }
                                    disabled={offerbtnDisable}
                                    type="submit"
                                    btnSize={"medium"}
                                  />
                                  {product.buynow != 0 && (
                                    <SecondaryButton
                                      btnSize={"addCartBtn"}
                                      label={
                                        <>
                                          <span className="material-icons">
                                            add_shopping_cart
                                          </span>
                                        </>
                                      }
                                    />
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                              {/* {(product.buynow &&
                        product.auction &&
                        product.bprice >= product.wprice) ||
                      (product.buynow && !product.auction) ? (
                        <PrimaryButton
                          label={"Buy Now"}
                          disabled={buynowbtnDisable}
                          btnSize={"small"}
                          onClick={handleBuyNowClick}
                        />
                      ) : (
                        ""
                      )} 
                            </>
                          ) : !isAuthenticated &&
                            moment.utc(product.date_closed).local() >= today ? (
                            <div className="btnWrprGrd">
                              {product.auction == 1 ? (
                                <>
                                  <PrimaryButton
                                    label={
                                      props.auctionType === "live"
                                        ? "Submit Offer"
                                        : "Place Bid"
                                    }
                                    btnSize={"small"}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleRedirectInternal(history, "login");
                                    }}
                                  />
                                  {product.buynow != 0 && (
                                    <SecondaryButton
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleRedirectInternal(
                                          history,
                                          "login"
                                        );
                                      }}
                                      btnSize={"addCartBtn"}
                                      label={
                                        <>
                                          <span className="material-icons">
                                            add_shopping_cart
                                          </span>
                                        </>
                                      }
                                    />
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </form>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <>
                    {product.buynow == 1 && product.auction == 0 ? (
                      <>
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
                              handleRedirectInternal(history, "login");
                            }}
                          />
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )} */}
              </div>
            </>
          ) : product.paid === 1 ? (
            <>
              <div className="listTimer w-100 d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="w-100">
                  <b>Sold on:</b>
                </h6>
                <p className="d-flex justify-content-center align-items-center w-100">
                  {moment.utc(product.paid_date).local().format("LL LT")}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="listTimer w-100 d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="w-100">
                  <b>Closed on:</b>
                </h6>
                <p className="d-flex justify-content-center align-items-center w-100">
                  {moment.utc(product.date_closed).local().format("LL LT")}
                </p>
              </div>
            </>
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
          <div className="moreInfo w-100">
            {props.auctionType === "live" ? (
              <Button
                onClick={() =>
                  handleRedirectInternal(
                    router,
                    `lotView/${
                      searchQueryParam(location.search, "auctionId") ||
                      product.auction_id
                    }/${product.id}/${user?.id ? user.id : 0}`
                  )
                }
              >
                View more info
                <span className="material-icons">arrow_right_alt</span>
              </Button>
            ) : (
              <Button onClick={props.drawerHandler}>
                View more info
                <span className="material-icons">arrow_right_alt</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Fade>
  );
};
export default ListView;
