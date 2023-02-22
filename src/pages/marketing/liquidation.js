import React from "react";

const Liquidation = () => {
  return (
    <div className="liquidation-main-container">
      <div className="liquid-wrapper">
        <img
          src="/assets/images/blue-gradient.png"
          alt="live-auctions"
          className="la-img"
        />
        <div className="container">
          <img
            src="/assets/images/auctionsoftware.png"
            alt=""
            className="la-as-logo"
          />
          <h1 className="lw-head clearfix">Liquidations</h1>
          <p className="lw-content">
            Easy to use multi-purpose theme for “liquidaition marketplace”
          </p>
          <img
            src="/assets/images/liquid-img.png"
            alt="live-auctions"
            className="liq-img-center"
          />
          <button
            className="liq-blue-btn"
            onClick={() =>
              window.open("https://www.auctionsoftware.com/contact-us/")
            }
          >
            Book Your Demo
          </button>
        </div>
      </div>

      <div className="lauc-bm-like">
        <p className="la-wug-text">
          Build Your Own Live Auction Website And Marketplace Like
        </p>
        <ul className="list-inline mt-sm-5 mb-sm-5">
          <li className="list-inline-item mr-sm-4">
            <img src="/assets/images/fullbasket-logo.png" alt="" />
          </li>
          <li className="list-inline-item ml-2 ml-sm-4">
            <img src="/assets/images/slibuy.png" alt="" />
          </li>
          <li className="list-inline-item ml-2 ml-sm-4">
            <img src="/assets/images/deal-badger-logo.png" alt="" />
          </li>
          <li className="list-inline-item ml-2 ml-sm-4">
            <img src="/assets/images/na-logo.png" alt="" />
          </li>
        </ul>
        <p className="la-wug-text la-last">
          Instead of Growing Live Auctioneer Customer Base
        </p>
      </div>
      <div className="lauc-live-auctioneer">
        <div className="container">
          <div className="lau-hiw-head">How It Works</div>
          <div className="row la-etu-content">
            <div className="col-sm-4">
              <div className="lhw-img-box">
                <img src="/assets/images/hiw-img1.svg" alt="live-auctions" />
              </div>
              <div className="lhw-con-box">
                <span className="la-hiw-num">01</span>
                <h4 className="mu-media-head1">Login / Signup</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  tortor elit, rutrum viverra diam.
                </p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="lhw-img-box">
                <img src="/assets/images/hiw-img2.svg" alt="live-auctions" />
              </div>
              <div className="lhw-con-box">
                <span className="la-hiw-num">02</span>
                <h4 className="mu-media-head1">Configure Your Store</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  tortor elit, rutrum viverra diam.
                </p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="lhw-img-box">
                <img src="/assets/images/hiw-img3.svg" alt="live-auctions" />
              </div>
              <div className="lhw-con-box">
                <span className="la-hiw-num">03</span>
                <h4 className="mu-media-head1">Host Your Own Website</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  tortor elit, rutrum viverra diam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container text-center pt-2 pb-2 pt-sm-5 pb-sm-5 mt-sm-5 mb-sm-5">
        <div className="row la-etu-content">
          <div className="col-sm-4">
            <img src="/assets/images/easy-to-use1.png" alt="live-auctions" />
            <h4 className="mu-media-head1">Easy-To-Create Templates</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              tortor elit, rutrum viverra diam.
            </p>
          </div>
          <div className="col-sm-4">
            <img
              src="/assets/images/multi-currency1.png"
              alt="live-auctions"
            />
            <h4 className="mu-media-head1">Multi Currency</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              tortor elit, rutrum viverra diam.
            </p>
          </div>
          <div className="col-sm-4">
            <img src="/assets/images/great-support1.png" alt="live-auctions" />
            <h4 className="mu-media-head1">24/7 Support</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              tortor elit, rutrum viverra diam.
            </p>
          </div>
        </div>
      </div>
      <div className="la-more-income-media">
        <div className="media-body">
          <h4>INCREASE YOUR INCOME</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            tortor elit, rutrum viverra diam id, mollis iaculis nulla. Quisque
            feugiat orci malesuada vehicula te
          </p>
          <div className="row">
            <div className="col-6">
              <div className="la-revenue-text pink-text">PRODUCTS SOLD</div>
              <div className="rv-percentage">1534</div>
            </div>
            <div className="col-6">
              <div className="la-revenue-text grn-text">REVENUE</div>
              <div className="rv-percentage">$1200</div>
            </div>
          </div>
          <img
            src="/assets/images/graph-blue.png"
            alt=""
            className="img-responsive"
          />
        </div>
      </div>
      <div className="media lauc-media container">
        <div className="media-left wu-img-left">
          <img src="/assets/images/timed.png" alt="" className="w-100" />
        </div>
        <div className="media-body">
          <div className="la-ss-head">
            We have <br /> <span className="clearfix">Live Auction</span> And{" "}
            <span>Timed Auction</span> <br />
            Software
          </div>
          <div className="d-flex align-items-center demo-wrap">
            <button
              className="btn black_btn"
              onClick={() =>
                window.open("https://www.auctionsoftware.com/contact-us/")
              }
            >
              Book Your Demo
            </button>
            <a target="_blank" href="" className="la-cp-link">
              Check Our Pricing Details
            </a>
          </div>
        </div>
      </div>
      <div className="compatible-wrapper">
        <img
          src="/assets/images/compatible.png"
          alt="live-auctions"
          className="compatible-img"
        />
        <div className="container">
          <h4 className="lw-head">Compatible with multiple devices</h4>
          <p className="lw-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            tortor elit, rutrum viverra diam id, mollis iaculis nulla. Quisque
            feugiat orci malesuada vehicula tempus. Vestibulum consequat odio
            sem, a scelerisque enim sollicitudin a.
          </p>

          <p className="asft-copy-txt">
            Auctionsoftware.com © 2022. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Liquidation;
