import React from "react";
import LocationOnTwoToneIcon from "@material-ui/icons/LocationOnTwoTone";
import { Button, LinearProgress } from "@material-ui/core";
import ArrowRightTwoToneIcon from "@material-ui/icons/ArrowRightTwoTone";
import VisibilityIcon from "@material-ui/icons/Visibility";
import moment from "moment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  capitalize,
  noImageAvailable,
  getImages_url_check,
  currencyFormat,
} from "../../../common/components";
const ProductCard = ({ auction, auctionLotView, noTimer, type }) => {
  const today = new Date();

  return (
    <div className={`product ${type == "event" ? "evntCard" : ""}`}>
      <div className="card-image-area">
        <div
          className="primary-image position-relative"
          onClick={() => auctionLotView(auction)}
        >
          <div
            className={`cardTags ${
              type == "event"
                ? "evtTg d-flex align-items-center justify-content-between"
                : ""
            }`}
          >
            {auction.auction_type === 1 ? (
              <div className="live">
                Live <span className="material-icons">visibility</span>{" "}
                {Math.floor(Math.random() * (50 - 20) + 20)}
              </div>
            ) : (
              <>
                {type == "event" ? (
                  <div className="event d-flex align-items-center">
                    <span className="material-icons mr-1">local_activity</span>
                    Event
                  </div>
                ) : (
                  <div className="time">
                    <span>Timed</span>
                  </div>
                )}
              </>
            )}
          </div>
          <LazyLoadImage
            src={getImages_url_check(auction.avatar, auction.img_flag)}
            onError={(e) => noImageAvailable(e)}
            effect="blur"
            placeholderSrc="assets/svg/imageLoading.svg"
            height="100%"
            width="100%"
          />
          {type == "event" ? (
            <div className="eventProgress">
              <div className="epLabel">
                <p>
                  <span>{currencyFormat(auction.donationamt)}</span> raised
                </p>
                <p>{auction.donation_per}%</p>
              </div>
              <LinearProgress
                variant="determinate"
                value={auction.donation_per}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="product-dtls">
        <div className="product-info">
          <p
            className="product-title mb-0"
            onClick={() => auctionLotView(auction)}
          >
            {capitalize(auction.title)}
          </p>
          <p className="product-auction mb-0">{auction.auction}</p>
          <p className="start-date mb-0">
            {moment.utc(auction.date_added).local() >= today ? (
              <>
                {type === "event" && (
                  <span className="material-icons iconsWrp">today</span>
                )}
                Starts at{" "}
                {moment.utc(auction.date_added).local().format("LL LT")}
              </>
            ) : noTimer ? (
              <span className="lvAtnStrd">
                <img src="/assets/images/live.gif" alt="live_icon" />
                Live Auction Started
              </span>
            ) : (
              <>
                {type === "event" && (
                  <span className="material-icons iconsWrp">today</span>
                )}
                Ends at &nbsp;
                {moment.utc(auction.date_closed).local().format("LL LT")}
              </>
            )}
          </p>
        </div>
        <div className="product-loc-bid">
          <div className="location">
            {type === "event" ? (
              <p>
                <span className="material-icons iconsWrp">location_on</span>
                {capitalize(auction.city)}, {capitalize(auction.state)}
              </p>
            ) : (
              <p>
                {capitalize(auction.city)}, {capitalize(auction.state)}
              </p>
            )}
          </div>
          <div className="bid-btn-area">
            <Button
              variant="contained"
              className="bid-btn"
              color="primary"
              onClick={() => auctionLotView(auction)}
              component="span"
            >
              {type === "event" ? "View Event" : "View Auction"}{" "}
              <ArrowRightTwoToneIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
