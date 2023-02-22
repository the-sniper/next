import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import CarsFooter from "./cars-footer";
import useScrollPosition from "../../../Utils/useScrollPosition";
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  variableWidth: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
        variableWidth: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
      },
    },
  ],
};

const Cars = () => {
  const [sticky, setSticky] = useState(false);
  let d;
  if (typeof window != "undefined") {
    d = document.documentElement;
  }
  let height = d?.offsetHeight;
  // console.log("height = " + height);
  const scroll = useScrollPosition();
  useEffect(() => {
    scroll > 150 && scroll < height - 1200 ? setSticky(true) : setSticky(false);
  }, [scroll]);

  // console.log(sticky);

  return (
    <div className="cars-wrapper">
      <div className="cars-top-wrapper">
        <div className="container">
          <img src="/assets/images/auctionsoftware.png" alt="" />
          <h1 className="ca-head">Car Auctions</h1>
          <a
            href="https://www.auctionsoftware.com/contact-us/"
            target="_blank"
            className={`btn btn-blue ${sticky ? "btn-sticky" : ""}`}
            rel="noreferrer"
          >
            SCHEDULE YOUR DEMO
          </a>
          <img src="/assets/images/car.png" alt="" className="car-img mw-100" />
          <h2 className="ca-sub-head">No.1 Car auction WEBsite VENDOR</h2>
          <div className="comp-logos-wrap">
            <div className="cl-text">
              BUILD YOUR OWN WEBSITE AND MARKETPLACE LIKE
            </div>

            <Slider {...settings}>
              <div className="by-slider-wrap">
                <img src="/assets/images/bbt.png" alt="" />
              </div>
              <div className="by-slider-wrap">
                <img src="/assets/images/GM-Financial.png" alt="" />
              </div>
              <div className="by-slider-wrap">
                <img src="/assets/images/ecx.png" alt="" />
              </div>
              <div className="by-slider-wrap">
                <img src="/assets/images/TradeBid_logo.png" alt="" />
              </div>
              <div className="by-slider-wrap">
                <img src="/assets/images/coach.png" alt="" />
              </div>
            </Slider>
            <div className="cl-text">
              INSTEAD OF GROWING ebay, copart or hibid CUSTOMER BASE
            </div>
          </div>
        </div>
      </div>
      <div className="back-layer">
        <h2 className="auction-benficial clearfix">
          Why are online Auctions beneficial?
        </h2>
        <div className="container">
          <div className="media col-reverse">
            <div className="media-body">
              <div className="aben-head">
                Access to A Bigger & Better Pool of Buyers
              </div>
              <ul className="ab-list">
                <li>
                  <img
                    src="/assets/images/+.png"
                    alt=""
                    className="plus-icon"
                  />
                  Large geographical audience and the bidding for each lot
                  closes when the competition ends.
                </li>
                <li>
                  <img
                    src="/assets/images/+.png"
                    alt=""
                    className="plus-icon"
                  />
                  Buyers are pre-qualified by the site and other sellers based
                  on past transactions.
                </li>
                <li>
                  <img
                    src="/assets/images/+.png"
                    alt=""
                    className="plus-icon"
                  />
                  You can see who has paid promptly, who was easy to work with
                  and who picked up their items on time.
                </li>
              </ul>
            </div>
            <div className="media-right">
              <img src="/assets/images/ab-img.png" alt="" />
            </div>
          </div>
          <div className="media">
            <div className="media-left">
              <img src="/assets/images/ab-img-2.png" alt="" />
            </div>
            <div className="media-body">
              <div className="aben-head">
                Why sell in ebay, copart or hibid and pay 30% ? Create your own
                marketplace and save 29%
              </div>
              <ul className="ab-list">
                <li>
                  <img
                    src="/assets/images/+.png"
                    alt=""
                    className="plus-icon"
                  />
                  Control Who Can Bid in Your Auction{" "}
                </li>
                <li>
                  <img
                    src="/assets/images/+.png"
                    alt=""
                    className="plus-icon"
                  />
                  Decide When the Sale Will Happen{" "}
                </li>
                <li>
                  <img
                    src="/assets/images/+.png"
                    alt=""
                    className="plus-icon"
                  />
                  Better Reserve Process
                </li>
              </ul>
            </div>
          </div>
          <div className="media col-reverse">
            <div className="media-body">
              <div className="aben-head">It’s Great for Small Businesses</div>
              <ul className="ab-list">
                <li>
                  <img
                    src="/assets/images/+.png"
                    alt=""
                    className="plus-icon"
                  />
                  Regardless of the number of items being posted, lots are
                  presented in front of a global audience they would not have
                  access to otherwise.
                </li>
                <li>
                  <img
                    src="/assets/images/+.png"
                    alt=""
                    className="plus-icon"
                  />
                  The best auction and liquidation marketplaces don’t
                  differentiate between big companies selling thousands of items
                  and small Businesses posting five or six items
                </li>
              </ul>
            </div>
            <div className="media-right">
              <img src="/assets/images/ab-img3.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="fast-access">
        <div className="clearfix fac-head">FAST ACCELERATION</div>
        <p className="ols-note">
          Online Sales (as a share of total UC retails sales) are expectedly to
          grow rapidly in Europe and the US
        </p>
        <div className="row">
          <div className="col-sm-4">
            <div className="cc-dhead pink-text">TOTAL CARS SOLD</div>
            <div className="chart-con">250</div>
          </div>
          <div className="col-sm-4">
            <div className="cc-dhead drk-blue-text">TOTAL BIDS</div>
            <div className="chart-con">1550</div>
          </div>
          <div className="col-sm-4">
            <div className="cc-dhead grn-text">TOTAL REVENUE</div>
            <div className="chart-con">$2230</div>
          </div>
        </div>
        <img src="/assets/images/chart.png" alt="" className="mw-100" />
      </div>
      <div className="start-tips">Some Tips to Help You Get Started</div>
      <div className="chrome-car-wrap">
        <div>
          <img
            src="/assets/images/chrome-car.png"
            alt=""
            className="w-100 h-100"
          />
        </div>
        <div className="cc-right">
          <ul>
            <li>
              <img src="/assets/images/pricetag.png" alt="" className="" />
              <div>Be Realistic with Your Pricing</div>
            </li>
            <li>
              <img src="/assets/images/noun-timer.png" alt="" className="" />
              <div>Take the Time to Prep Equipment for Sale</div>
            </li>
            <li>
              <img src="/assets/images/tittle-right.png" alt="" className="" />
              <div>Title it Right</div>
            </li>
            <li>
              <img src="/assets/images/post-img.png" alt="" className="" />
              <div>Post a Lot of Visuals</div>
            </li>
            <li>
              <img src="/assets/images/settings-svg.png" alt="" className="" />
              <div>Integrate with Salesforce & NetSuite</div>
            </li>
          </ul>
        </div>
      </div>
      <div className="container wrapping-up ss-main-wrap pdnBtm150">
        <div className="media">
          <div className="media-body">
            <div className="wrapping-up-head  stable-software">
              We have stable <br />
              <span className="clearfix">Live Auction</span> and{" "}
              <span>Timed Auction</span> <br />
              Software
            </div>
            <button
              className="btn btn-blue by-demo-btn"
              onClick={() =>
                window.open("https://www.auctionsoftware.com/contact-us/")
              }
            >
              BOOK YOUR DEMO TODAY!
            </button>
          </div>
          <div className="media-right">
            <img src="/assets/images/timed.png" alt="" className="w-100" />
          </div>
        </div>
      </div>
      <div className="cars-middle-wrapper">
        <div className="container">
          <div className="cv-note-head ">
            “The used car boom is one of the hottest, and trickiest, coronavirus
            markets for consumers”
          </div>
          <p className="cn-text">
            Covid-19 has led to an increase in used car sales as people avoid
            mass transportation and are more sensitive to auto cost in the
            recession. The auto industry is facing pressure to adapt digitally
            more than ever as COVID-19 has brought new challenges and
            intensified the need to shift toward digital solutions.
          </p>
          <img src="/assets/images/car-black.png" alt="" className="mw-100" />
        </div>
      </div>
      <div className="container wrapping-up">
        <div className="media">
          <div className="media-body">
            <div className="wrapping-up-head clearfix">Wrapping up…</div>
            <p className="wu-text">
              It’s no secret that mobile technology is transforming the globe at
              a rapid rate, and entrepreneurs are now adopting Automotive Mobile
              App Development as a new standard for conducting business
              digitally. Before this customer- and business-friendly technical
              innovation, purchasing and selling a car was never so easy.
            </p>
            <p className="wu-text">
              The Automotive Mobile App Development concept may be the next big
              thing in mobile technology
            </p>
          </div>
          <div className="media-right">
            <img src="/assets/images/phone.png" alt="" className="w-100" />
          </div>
        </div>
      </div>
      <CarsFooter />
    </div>
  );
};

export default Cars;
