import React, { useState, useRef, useEffect, useContext } from "react";
import { Button, Fade, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import CustomInput from "../../../components/atoms/Inputs/CustomInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import SecondaryButton from "../../../components/atoms/SecondaryButton";
import FavouriteCheckbox from "../../../components/atoms/FavoriteCheckbox";
// import Popup from '../../../../custom/organisms/Popup'
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
} from "../../../common/components";
import AlertContext from "../../../context/alert/alertContext";
import AuthContext from "../../../context/auth/authContext";
import AuctionContext from "../../../context/auction/auctionContext";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import BiddingItem from "../Bidding/BiddingItem";
import ArrowRightTwoToneIcon from "@material-ui/icons/ArrowRightTwoTone";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const AuctionListCard = ({ auction, auctionLotView, noTimer }) => {
  const today = new Date();

  return (
    <Fade in={true} timeout={600}>
      <div className="productCardList d-flex justify-content-between align-items-start">
        <div className="psListLt d-flex">
          <div className="card-image-area">
            <div
              className="primary-image"
              onClick={() => auctionLotView(auction)}
            >
              {auction.auction_type === 1 ? (
                <div className="live">
                  <span>
                    Live <VisibilityIcon />{" "}
                    {Math.floor(Math.random() * (50 - 20) + 20)}
                  </span>
                </div>
              ) : (
                <div className="time">
                  <span>Timed</span>
                </div>
              )}

              <LazyLoadImage
                src={getImages_url_check(auction.avatar, auction.img_flag)}
                alt={auction.title}
                onError={(e) => noImageAvailable(e)}
                effect="blur"
                placeholderSrc="assets/svg/imageLoading.svg"
                height="100%"
                width="100%"
              />
            </div>
          </div>

          <div className="listContent auctionListContent">
            <div className="product-info">
              <p
                className="product-title mb-0"
                onClick={() => auctionLotView(auction)}
              >
                {capitalize(auction.title)}
              </p>
              <p className="product-auction mb-0">{auction.auction}</p>
            </div>
            <p className="alcDesc" dangerouslySetInnerHTML={{__html:auction.description,}}></p>
            {/* <p className="alcDesc">{auction.description}</p> */}
            <div className="product-loc-bid">
              <div className="location">
                <p>
                  <span>Location:</span>
                  {capitalize(auction.city)}, {capitalize(auction.state)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bid-btn-area">
          <h6 className="alcStartTime">
            {moment.utc(auction.date_added).local() >= today ? (
              <>
                <span>Starts at</span>
                {moment.utc(auction.date_added).local().format("LL LT")}
              </>
            ) : noTimer ? (
              <span className="lvAtnStrd">
                <img src="/assets/images/live.gif" alt="live_icon" />
                Live Auction Started
              </span>
            ) : (
              <>
                <span>Ends at</span>
                {moment.utc(auction.date_closed).local().format("LL LT")}
              </>
            )}
          </h6>
          <SecondaryButton
            onClick={() => auctionLotView(auction)}
            label="View Auction"
          />
        </div>
      </div>
    </Fade>
  );
};
export default AuctionListCard;
