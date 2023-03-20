import React, { useState, useContext, useEffect } from "react";
import AuctionContext from "@/context/auction/auctionContext";
import Pagination from '@mui/material/Pagination';
import Slider from "react-slick";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import Popover from "@mui/material/Popover";
import makeStyles from '@mui/styles/makeStyles';
import Typography from "@mui/material/Typography";
import FavouriteCheckbox from "@/components/atoms/FavoriteCheckbox";
import { Divider } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: "5px 16px",
    paddingBottom: "15px",
  },
  span: {
    padding: "5px 16px",
    display: "block",
  },
}));

export default function Reviews(props) {
  const classes = useStyles();
  const [product, setProduct] = useState();
  const [modalopen, setmodalopen] = useState(false);
  useEffect(() => {
    setProduct(props.data);
    // console.log(props.data);
  }, [props.data]);

  const handleClickOpen = () => {
    setmodalopen(true);
  };
  const handleClose = () => {
    setmodalopen(false);
  };
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    loop: false,
    autoplay: true,
    autoplaySpeed: 2500,
    lazyLoad: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };
  // popover modal
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const pophandleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  // modal open
  const { homePageFeaturedAuction } = useContext(AuctionContext);
  return (
    <>
      <div className="Dalshireinter customContainer">
        <div className="sellerCard">
          <div className="sellerInfowrap">
            {/* {homePageFeaturedAuction.map((data, index) => ( */}
            <div className="userBox">
              <figure className="m-0">
                <img
                  src="/assets/images/dalshire_large.jpg"
                  // src={`${global.images_url}${data.avatar}`}
                  alt="dalshire"
                  className="img-responsive"
                />
              </figure>
              <div className="sellerTopTextInfo">
                <div className="sellerTitle">
                  <h4>Dalshire International</h4>

                  <button
                    onClick={handleClick}
                    type="button"
                    id="toprated"
                    className="btn btn-default"
                    data-container="body"
                    data-toggle="popover"
                    data-placement="bottom"
                    data-title="Top Rated Auctioneer"
                    data-content="This auctioneer consistently excels in accuracy, communication, ease of payment, and shipping quality."
                    data-original-title=""
                    title=""
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/assets/svg/badge.svg"}
                    />
                    TOP RATED
                  </button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={pophandleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <span className={classes.span}>Top Rated Auctioneer</span>
                    <Divider />
                    <Typography className={`popovercls ${classes.typography}`}>
                      This auctioneer consistently excels in accuracy,
                      communication, ease of payment, and shipping quality.
                    </Typography>
                  </Popover>
                </div>
                <div className="rating">
                  <ul>
                    <li>
                      <span className="material-icons-round">star</span>
                    </li>
                    <li>
                      <span className="material-icons-round">star</span>
                    </li>
                    <li>
                      <span className="material-icons-round">star</span>
                    </li>
                    <li>
                      <span className="material-icons-round">star</span>
                    </li>
                    <li>
                      <span className="material-icons-round">star_half</span>
                    </li>
                  </ul>
                  <a className="">
                    1,717 Reviews
                    <span className="material-icons-round">arrow_right</span>
                  </a>
                </div>
                <div className="followers">
                  <button>Follow</button>
                  <h4>4,236 Followers</h4>
                </div>
              </div>
            </div>
            {/* ))} */}
          </div>
          <div className="mapblock">
            <a className="map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.256352236032!2d80.14279941430425!3d12.95544131873927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525e4cfb340bbb%3A0x6c0981da2a6538f3!2sDevelop%20Scripts%2C%20LLC!5e0!3m2!1sen!2sin!4v1628750191716!5m2!1sen!2sin"
                width="250"
                height="180"
                allowfullscreen=""
                loading="lazy"
                className="b-0"
              ></iframe>
            </a>
            <div className="mapbeside">
              <address>
                2452 Lacy Lane #116
                <br />
                Carrollton, TX 75006
                <br />
                USA
              </address>
              <span className="phone">(972) 837-0404</span>
              <div className="follwuppop">
                <a
                  data-toggle="modal"
                  data-target="#myModal"
                  onClick={handleClickOpen}
                >
                  Send Message
                </a>
                <a>Consign Item</a>
              </div>
            </div>
          </div>
        </div>
        {/* upcoming auction */}
        <div className="Dalshireinter-tablinks">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <a
                className="nav-link active"
                data-toggle="smooth-scroll"
                href="#tab1"
              >
                Upcoming Auctions
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="smooth-scroll" href="#tab2">
                News
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="smooth-scroll" href="#tab3">
                Reviews
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="smooth-scroll" href="#tab4">
                Past Auctions
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="smooth-scroll" href="#tab5">
                Record Results
              </a>
            </li>
          </ul>
          <div className="tabpillssection">
            <div className="tabz" id="tab1">
              <h3 className="largetext">
                Upcoming Auctions from Dalshire International
              </h3>
              <div className="catalog-grid">
                <div className="horizontal-catalog-card">
                  <div className="leftblock">
                    <div className="one-and-two-wrapper">
                      <a className="first-img-container">
                        <img src="/assets/images/product1.jpg" />
                      </a>
                      <div className="secondary-img-container">
                        <a>
                          <img src="/assets/images/product2.jpg" />
                        </a>
                        <a>
                          <img src="/assets/images/product3.jpg" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="info-box">
                    <div className="middle-box">
                      <a className="tit">
                        Jewelry, Watch &amp; Memorabilia ---- No Reserve
                      </a>
                      <a
                        className="des"
                        title="89 Jewelry, Watch &amp; Memorabilia items. Fantastic quality and rapid
                                shipping. Swiss
                                Movement Watches from Balmer, Jules Breting, Tschuy-Vogt…"
                      >
                        89 Jewelry, Watch &amp; Memorabilia items. Fantastic
                        quality and rapid shipping. Swiss Movement Watches from
                        Balmer, Jules Breting, Tschuy-Vogt…
                      </a>
                    </div>
                    <div className="right-box">
                      <p>Starts Aug 13, 2021 6:30 AM GMT+5:30</p>
                      <address>Carrollton, TX, USA</address>
                      <strong>17 Hrs Left</strong>
                      <button>EXPLORE</button>
                      <a>Register for Auction</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="loadbtndiv">
                <button className="load-btn">Search upcoming items</button>
              </div>
            </div>
            <div className="tabz" id="tab2">
              <h3 className="largetext">
                Bidder Reviews for Dalshire International <a>(1,717)</a>
              </h3>
              <div className="graphjs pfmAuct">
                <div className="salesbox charts">
                  <div className="OverallExperienceStar">
                    <button
                      type="button"
                      id="toprated"
                      className="btn btn-default"
                      data-container="body"
                      data-toggle="popover"
                      data-placement="bottom"
                      data-title="Top Rated Auctioneer"
                      data-content="This auctioneer consistently excels in accuracy, communication, ease of payment, and shipping quality."
                      data-original-title=""
                      title=""
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/assets/svg/badge.svg"}
                        style={{ marginRight: "5px" }}
                      />
                      TOP RATED
                    </button>
                    <br />
                    <ul>
                      <li>
                        <span className="material-icons-round md-48">star</span>
                      </li>
                      <li>
                        <span className="material-icons-round md-48">star</span>
                      </li>
                      <li>
                        <span className="material-icons-round md-48">star</span>
                      </li>
                      <li>
                        <span className="material-icons-round md-48">star</span>
                      </li>
                      <li>
                        <span className="material-icons-round md-48">
                          star_half
                        </span>
                      </li>
                    </ul>
                    <legend>
                      4.28 out of 5 Stars{" "}
                      <i
                        style={{ fontSize: "16px", cursor: "pointer" }}
                        id="popoverData"
                        className="material-icons"
                        data-container="body"
                        data-toggle="popover"
                        data-placement="right"
                        data-trigger="hover"
                        data-content="LiveAuctioneers calculates your overall star rating based on ratings given, number of reviews, age of reviews, and only accepts reviews from winning bidders in your auction."
                        data-original-title=""
                        title=""
                      >
                        info
                      </i>
                    </legend>
                  </div>
                </div>
                <div className="salesbox lastprogres">
                  <div className="charts">
                    <div className="overallExperience">
                      <div className="OverallExperienceProgress">
                        <div className="ratingdiv">
                          <span>Direct</span>
                          <div className="progress">
                            <div
                              className="progress-bar w-100"
                              role="progressbar"
                              aria-valuenow="40"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <span className="sr-only">
                                100% Complete (success)
                              </span>
                            </div>
                          </div>
                          <span>
                            58 <b>(79.5%)</b>
                          </span>
                        </div>
                        <div className="ratingdiv">
                          <span>Organic</span>
                          <div className="progress">
                            <div
                              className="progress-bar w-100"
                              role="progressbar"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <span className="sr-only">10% Complete</span>
                            </div>
                          </div>
                          <span>
                            5 <b>(6.8%)</b>
                          </span>
                        </div>
                        <div className="ratingdiv">
                          <span>Android</span>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              aria-valuenow="60"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{ width: "60%" }}
                            >
                              <span className="sr-only">
                                60% Complete (warning)
                              </span>
                            </div>
                          </div>
                          <span>
                            3 <b>(4.1%)</b>
                          </span>
                        </div>
                        <div className="ratingdiv">
                          <span>Referral</span>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              aria-valuenow="80"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{ width: "80%" }}
                            >
                              <span className="sr-only">
                                10% Complete (danger)
                              </span>
                            </div>
                          </div>
                          <span>
                            2<b>(2.7%)</b>
                          </span>
                        </div>
                        <div className="ratingdiv">
                          <span>Social </span>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              aria-valuenow="80"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{ width: "80%" }}
                            >
                              <span className="sr-only">
                                40% Complete (danger)
                              </span>
                            </div>
                          </div>
                          <span>
                            1 <b>(1.4%)</b>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="performancerating">
                  <div
                    className="tropy"
                    data-container="body"
                    data-toggle="popover"
                    data-placement="bottom"
                    data-title="Top Rated in Accuracy"
                    data-content="This auctioneer excels at providing descriptions and photos that represent items accurately."
                    data-original-title=""
                    title=""
                  >
                    <figure>
                      <img
                        src={process.env.PUBLIC_URL + "/assets/svg/trophy.svg"}
                      />
                    </figure>
                    <p>Accurate Descriptions</p>
                  </div>
                  <div
                    className="tropy"
                    data-container="body"
                    data-toggle="popover"
                    data-placement="top"
                    data-title="Top Rated in Responsiveness"
                    data-content="This auctioneer excels at responding to customer inquiries in a helpful manner."
                    data-original-title=""
                    title=""
                  >
                    <figure>
                      <img
                        src={process.env.PUBLIC_URL + "/assets/svg/trophy.svg"}
                      />
                    </figure>
                    <p>Accurate Descriptions</p>
                  </div>
                  <div
                    className="tropy"
                    data-container="body"
                    data-toggle="popover"
                    data-placement="bottom"
                    data-title="Top Rated in Payments"
                    data-content="This auctioneer excels at providing customers a way to easily pay for items."
                    data-original-title=""
                    title=""
                  >
                    <figure>
                      <img
                        src={process.env.PUBLIC_URL + "/assets/svg/trophy.svg"}
                      />
                    </figure>
                    <p>Accurate Descriptions</p>
                  </div>
                  <div
                    className="tropy"
                    data-container="body"
                    data-toggle="popover"
                    data-placement="top"
                    data-title="Top Rated in Shipping"
                    data-content="This auctioneer excels in offering a seamless shipping experience"
                    data-original-title=""
                    title=""
                  >
                    <figure>
                      <img src="/assets/svg/trophy.svg" />
                    </figure>
                    <p>Accurate Descriptions</p>
                  </div>
                </div>
              </div>
              <h3 className="largetext">
                Bidder Reviews for Dalshire International
                <a className="seeall">see all</a>
              </h3>
              <div className="row reviewtable">
                <div className="col-md-3">
                  <h4>
                    David
                    <span
                      style={{ fontSize: "16px", color: "#70a340" }}
                      className="material-icons-outlined"
                    >
                      task_alt
                    </span>
                  </h4>
                  <p>Mcminnville, Tennessee</p>
                </div>
                <div className="col-md-6">
                  <ul>
                    <li>
                      <span className="material-icons-round md-48">star</span>
                    </li>
                    <li>
                      <span className="material-icons-round md-48">star</span>
                    </li>
                    <li>
                      <span className="material-icons-round md-48">star</span>
                    </li>
                    <li>
                      <span className="material-icons-round md-48">star</span>
                    </li>
                    <li>
                      <span className="material-icons-round md-48">
                        star_half
                      </span>
                    </li>
                    <li style={{ fontSize: "13px", paddingLeft: "12px;" }}>
                      Aug 06, 2021
                    </li>
                  </ul>
                  <b>Easy and safe to work with.</b>
                  <p>
                    Big Mets fan here. When I saw this up for auction I knew
                    that I needed to have it in my possession. The Ryan Express
                    was a big fan favorite and still is. The Mets made a mistake
                    in trading Nolan away. Glad he had such a great career. If
                    Dalshire International has more wonderful stuff like this,
                    I'm all in trying to get more items like this. Once shipped
                    it arrived very quickly. It was wrapped very well in bubble
                    wrap and boxed well too. It's two thumbs up for Dalshire
                    International.
                  </p>
                  <div className="queryies">
                    <span>
                      Helpful{" "}
                      <i className="material-icons-outlined">thumb_up</i>
                      (10)
                    </span>
                    <span>Report</span>
                  </div>
                </div>
                <div className="col-md-3 text-right">
                  <img
                    src="/assets/images/product1.jpg"
                    style={{ width: "100px" }}
                  />
                </div>
              </div>
              <div className="loadbtndiv">
                <button className="load-btn">See all 1,717 reviews</button>
              </div>
            </div>
            <div className="tabz" id="tab3">
              <h3 className="largetext">News about Dalshire International</h3>
              <div className="newflex">
                <div className="newscard">
                  <figure>
                    <img src="/assets/images/product2.jpg" />
                  </figure>
                  <a>
                    Dalshire International debuts on LiveAuctioneers April 23
                  </a>
                  <p>
                    DALLAS – Dalshire International will conduct a fine jewelry
                    auction on Tuesday, April 23 – the company’s debut with
                    LiveAuctioneers.
                  </p>
                </div>
              </div>
            </div>
            <div className="tabz" id="tab4">
              <h3 className="largetext">
                Past Auctions from Dalshire International
              </h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-inlineform">
                    <h5>Search :</h5>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="572 Past Auctions"
                        className="form-control"
                      />
                      <span className="input-group-btn">
                        <button className="btn btn-default" type="button">
                          <span className="material-icons-outlined">
                            search
                          </span>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-5 text-right">
                      <div className="form-inlineform">
                        <h5>VIEW :</h5>
                        <div className="selectbox">
                          <select className="fomr-control">
                            <option>24</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-7 text-right">
                      <div className="form-inlineform">
                        <h5>SORT:</h5>
                        <div className="selectbox">
                          <select className="fomr-control">
                            <option>Date: Descending</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cardflex">
                <div className="auctioncard">
                  <div className="horizontal-catalog-card">
                    <div className="leftblock">
                      <div className="one-and-two-wrapper">
                        <a className="first-img-container">
                          <img src="/assets/images/product1.jpg" />
                        </a>
                        <div className="secondary-img-container">
                          <a>
                            <img src="/assets/images/product2.jpg" />
                          </a>
                          <a>
                            <img src="/assets/images/product3.jpg" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="auctionbody">
                    <a>Memorabilia Collection Gallery</a>
                    <a>Dalshire International</a>
                    <h6>Started Aug 12, 2021 6:30 AM GMT+5:30</h6>
                    <div className="auctioncardfoot">
                      <span>
                        {" "}
                        <img
                          src="/assets/images/us.svg"
                          className="img-responsive"
                        />
                        Carrollton, TX
                      </span>
                      <span>Auction Ended</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8 text-right">
                  <div className="text-right">
                    <Pagination
                      count={10}
                      className="justify-content-end"
                      showFirstButton
                      showLastButton
                    />
                  </div>
                </div>
                <div className="col-md-4 text-right">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-inlineform">
                        <h5>VIEW :</h5>
                        <div className="selectbox">
                          <select className="fomr-control">
                            <option>24</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tabz" id="tab5">
              <h3 className="largetext">
                Record Auction Results for Dalshire International{" "}
                <a className="seeall">
                  See all
                  <span className="material-icons-round">arrow_right</span>
                </a>
              </h3>
              <Slider {...settings}>
                <div className="carosalcard">
                  <div className="carodalimg">
                    <img src="/assets/images/product1.jpg" alt="product img" />
                    <span className="material-icons-outlined">
                      favorite_border
                    </span>
                    {/* <FavouriteCheckbox
                      watchlisted={product.wat_list}
                      project_id={product.id}
                      updateData={props.updateData}
                    /> */}
                  </div>
                  <a>2.75ct 18k Oval Lab Diamond Inside-out E…</a>
                  <p>Jun 21, 2019</p>
                  <h6>
                    <span className="material-icons-outlined">
                      monetization_on
                    </span>{" "}
                    See Sold Price
                  </h6>
                </div>
                <div className="carosalcard">
                  <div className="carodalimg">
                    <img src="/assets/images/product1.jpg" alt="product img" />
                    <span className="material-icons-outlined">
                      favorite_border
                    </span>
                  </div>
                  <a>2.75ct 18k Oval Lab Diamond Inside-out E…</a>
                  <p>Jun 21, 2019</p>
                  <h6>
                    <span className="material-icons-outlined">
                      monetization_on
                    </span>{" "}
                    See Sold Price
                  </h6>
                </div>
                <div className="carosalcard">
                  <div className="carodalimg">
                    <img src="/assets/images/product1.jpg" alt="product img" />
                    <span className="material-icons-outlined">
                      favorite_border
                    </span>
                  </div>
                  <a>2.75ct 18k Oval Lab Diamond Inside-out E…</a>
                  <p>Jun 21, 2019</p>
                  <h6>
                    <span className="material-icons-outlined">
                      monetization_on
                    </span>{" "}
                    See Sold Price
                  </h6>
                </div>
                <div className="carosalcard">
                  <div className="carodalimg">
                    <img src="/assets/images/product1.jpg" alt="product img" />
                    <span className="material-icons-outlined">
                      favorite_border
                    </span>
                  </div>
                  <a>2.75ct 18k Oval Lab Diamond Inside-out E…</a>
                  <p>Jun 21, 2019</p>
                  <h6>
                    <span className="material-icons-outlined">
                      monetization_on
                    </span>{" "}
                    See Sold Price
                  </h6>
                </div>
                <div className="carosalcard">
                  <div className="carodalimg">
                    <img src="/assets/images/product1.jpg" alt="product img" />
                    <span className="material-icons-outlined">
                      favorite_border
                    </span>
                  </div>
                  <a>2.75ct 18k Oval Lab Diamond Inside-out E…</a>
                  <p>Jun 21, 2019</p>
                  <h6>
                    <span className="material-icons-outlined">
                      monetization_on
                    </span>{" "}
                    See Sold Price
                  </h6>
                </div>
                <div className="carosalcard">
                  <div className="carodalimg">
                    <img src="/assets/images/product1.jpg" alt="product img" />
                    <span className="material-icons-outlined">
                      favorite_border
                    </span>
                  </div>
                  <a>2.75ct 18k Oval Lab Diamond Inside-out E…</a>
                  <p>Jun 21, 2019</p>
                  <h6>
                    <span className="material-icons-outlined">
                      monetization_on
                    </span>{" "}
                    See Sold Price
                  </h6>
                </div>
              </Slider>
              <div className="loadbtndiv">
                <button className="load-btn">Consign Item</button>
                <button className="load-btn outbtn">
                  See all price results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={modalopen}
        // maxWidth={md}
      >
        <MuiDialogContent>
          <img src="/assets/images/dalshire_large.jpg" />
          <h3>Have a Question?</h3>
          <p>Sign up to send a question to the auctioneer.</p>
          <form>
            <div class="form-group">
              <label for="">EMAIL ADDRESS</label>
              <input type="text" class="form-control" />
            </div>
            <button>START NOW</button>
          </form>
          <p class="foot">
            Already have an account? <a>Log In</a>
          </p>
        </MuiDialogContent>
      </Dialog>
    </>
  );
}
