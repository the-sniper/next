import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { capitalize, noImageAvailable } from "../../../common/components";
import PrimaryButton from "../../atoms/PrimaryButton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
function AuctionCard({ data, featuredAuctionRedirect, noTimer }) {
  const today = new Date();

  return (
    <div className="auctionCardBox">
      <div
        onClick={() => featuredAuctionRedirect(data)}
        className="auctionCard"
      >
        <div className="acImgCnt">
          <LazyLoadImage
            src={`${global.images_url}${data.avatar}`}
            className="acImgLt"
            alt={data.title}
            onError={(e) => noImageAvailable(e)}
            effect="blur"
            placeholderSrc="assets/svg/imageLoading.svg"
            height="100%"
            width="100%"
          />
          {/* <div className="acImgRt">
          <img
            src={"/assets/images/fa2.jpg"}
            className="acImgLt"
            alt={data.title}
          />
          <img
            src={"/assets/images/fa3.jpg"}
            className="acImgLt"
            alt={data.title}
          />
        </div> */}
        </div>
        <div className="auctionInfo">
          <h3>{capitalize(data.title)}</h3>
          <h4>
            {moment.utc(data.date_added).local() >= today ? (
              <>
                {" "}
                Starts at &nbsp;{" "}
                {moment.utc(data.date_added).local().format("LL LT")}
              </>
            ) : noTimer ? (
              <span className="lvAtnStrd">
                <img src="/assets/images/live.gif" alt="live_icon" />
                Live Auction Started
              </span>
            ) : (
              <>
                Ends at &nbsp;
                {moment.utc(data.date_closed).local().format("LL LT")}
              </>
            )}
          </h4>
          <h5>
            {capitalize(data.city)}, {capitalize(data.state)}
          </h5>
          <PrimaryButton label="View Auction" btnSize="small" />
        </div>
      </div>
    </div>
  );
}

export default AuctionCard;
