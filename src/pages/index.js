import React, { useState, useContext, useEffect, useRef } from "react";
import { Button, Drawer, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import AuctionCard from "@/components/molecules/ProductCard/AuctionCard";
import GridView from "@/components/molecules/ProductCard/GridView";
import ProductViewSlider from "@/components/organisms/ProductViewSlider";
import AuctionContext from "@/context/auction/auctionContext";
import ProductContext from "@/context/product/productContext";
import moment from "moment";
import CommonContext from "@/context/common/commonContext";
import AuthContext from "@/context/auth/authContext";
import AlertContext from "@/context/alert/alertContext";
import {
  capitalize,
  handleRedirectInternal,
  noImageAvailable,
  mapData,
} from "@/common/components";
import { socket, socketForward, reInitializeSocket } from "@/common/socket";
import Slider from "react-slick";
import ClientCarousel from "@/components/organisms/ClientCarousel";
import ReactPlayer from "react-player";
import Fade from "react-reveal/Fade";
import AOS from "aos";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Loaders from "@/components/molecules/Loaders";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cars from "@/components/organisms/Cars";
import Lottie from "react-lottie";
import * as animationData from "@/assets/lottie/banner.json";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useRouter } from "next/router";
import Plugins from "@/components/organisms/Plugins";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    background: "transparent",
    boxShadow: "none",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Home() {
  const {
    getAllCalendarAuction,
    getAllFeatureAuction,
    getAllTimedAuction,
    getAllLiveAuction,
    getAllOtherAuction,
    getAllTopLots,
    homePageCalendarAuction,
    homePageFeaturedAuction,
    homePageLiveAuction,
    homePageTimedAuction,
    homePageOtherAuction,
    homePageTopLots,
  } = useContext(AuctionContext);
  const { getIndividualProductLotDetails, lot_details } =
    useContext(ProductContext);
  const { allCategory, searchValue, setSearchValue } =
    useContext(CommonContext);
  const { setAlert } = useContext(AlertContext);
  const { isAuthenticated, sendContactUs } = useContext(AuthContext);
  const [otherAuction, setOtherAuction] = useState([]);
  const [auctionLots, setAuctionLots] = useState([]);
  const [sponsoredDetails, setSponsoredDetails] = useState(null);
  const [auctionView, setAuctionView] = useState("Grid");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const today = new Date();
  const classes = useStyles();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    // getAllCalendarAuction({});
    // getAllFeatureAuction({});
    getAllTimedAuction({});
    getAllLiveAuction({});
    getAllTopLots({});
    // getAllOtherAuction({});
  }, []);
  useEffect(() => {
    if (homePageOtherAuction && homePageOtherAuction.length !== 0) {
      let filteredValue =
        homePageOtherAuction.filter(
          (otherAuction) =>
            moment.utc(otherAuction.date_closed).local() >= today
        ).length !== 0 &&
        homePageOtherAuction
          .filter(
            (otherAuction) =>
              moment.utc(otherAuction.date_closed).local() >= today
          )
          .slice(0, 8);
      setOtherAuction(filteredValue);
    }
  }, [homePageOtherAuction]);

  useEffect(() => {
    if (homePageTopLots) {
      if (homePageTopLots.results && homePageTopLots.results.length >= 0) {
        // console.log(homePageTopLots.results, "homePageTopLots");
        setAuctionLots(homePageTopLots.results);
        setSponsoredDetails(homePageTopLots.storeowner);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [homePageTopLots]);

  const [state, setState] = useState({
    right: false,
    bottom: false,
    data: {},
  });
  const toggleDrawer = (anchor, open, data) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (open) {
      let productDtls = {
        lotId: data.id,
        is_auctionio: 1,
      };
      getIndividualProductLotDetails(productDtls);
      setState({ ...state, [anchor]: open, data: data });
    } else {
      setState({ ...state, [anchor]: open, data: {} });
    }
  };
  //console.log(homePageOtherAuction, "homePageOtherAuction");
  const featuredAuctionRedirect = (data) => {
    // console.log(data, "this is from the home page");
    if (data && Object.keys(data).length !== 0) {
      router.push({
        pathname: "/auctionView",
        search: `?auctionId=${data.id}&viewType=list`,
      });
    }
  };
  const lotPageRedirect = (data) => {
    if (data && Object.keys(data).length !== 0) {
      let productDtls = {
        lotId: data.id,
        is_auctionio: 1,
      };
      getIndividualProductLotDetails(productDtls);
      handleRedirectInternal(
        router,
        "productView",
        `?auctionId=${data.auction_id}&auctionLotId=${data.id}`
      );
    }
  };

  // const handleCategoryClick = (categoryId) => {
  //   setSearchValue({
  //     ...searchValue,
  //     categoryId: categoryId,
  //   });
  //   handleRedirectInternal(router, "auctions");
  // };

  const auctionLotsRef = useRef(auctionLots);

  useEffect(() => {
    auctionLotsRef.current = auctionLots;
  });

  useEffect(() => {
    socketForward.on("realclosedupdates", (data) => {
      // let user_id = user.id
      const index = auctionLotsRef.current.findIndex(
        (s) => s.id === parseInt(data.pid, 10)
      );
      let productToChange = auctionLotsRef.current[index];

      // console.log("productToChange", productToChange);
      if (index !== -1) {
        if (data.usr !== "") {
          // if (user_id === parseInt(data.bpop_cbidder)) {
          // }  else {
          getAllTopLots({});
          // }
        } else {
          getAllTopLots({});
        }
      }
    });

    socket.on("bidoffers", (data) => {
      if (
        data &&
        Object.keys(data).length > 0 &&
        homePageOtherAuction &&
        homePageOtherAuction.length > 0
      ) {
        let modifiedLots = homePageOtherAuction.map((ele) => {
          // console.log(ele, "socket ele");
          let newLot = ele;
          // console.log(
          //   Number(data.lotid) === Number(newLot.id),
          //   "data.lotid === newLot.id"
          // );
          if (data.lotid === newLot.id) {
            newLot.bidcnt = data.bids_offer[0].bidcnt;
            newLot.wprice = data.bids_offer[0].current_amount;
            return newLot;
          } else {
            return newLot;
          }
        });
        // console.log(modifiedLots, "modifiedLots");
        setOtherAuction(modifiedLots);
      }
    });

    socketForward.on("bidAddtime", (data) => {
      if (
        data &&
        Object.keys(data).length > 0 &&
        homePageOtherAuction &&
        homePageOtherAuction.length > 0
      ) {
        let modifiedLots = homePageOtherAuction.map((ele) => {
          // console.log(ele, "socket ele");
          let newLot = ele;
          // console.log(
          //   Number(data.id) === Number(newLot.id),
          //   "data.lotid === newLot.id"
          // );
          if (data.id === newLot.id) {
            newLot.bidcnt = data.bpop_bidcount;
            newLot.wprice = data.bpop_wprice;
            return newLot;
          } else {
            return newLot;
          }
        });
        // console.log(modifiedLots, "modifiedLots");
        setOtherAuction(modifiedLots);
      }
    });
  }, [homePageOtherAuction]);

  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  const validationArray = Yup.object({
    first_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z ]*$/g, "Special characters not allowed")
      .max(15, "Maximum 15 characters only")
      .required("Required"),
    last_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z ]*$/g, "Special characters not allowed")
      .max(15, "Maximum 15 characters only")
      .required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    location: Yup.string()
      .trim()
      .matches(/^[a-zA-Z ]*$/g, "Special characters not allowed")
      .required("Required"),
    phone: Yup.string()
      .trim()
      .matches(/^[0-9- +()]*$/g, "Only numbers are allowed")
      .max(20, "Maximum 20 charaters")
      .min(10, "Minimum 10 characters")
      .required("Required!"),
    message: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      location: "",
      phone: "",
      message: "",
    },
    validationSchema: validationArray,
    onSubmit: async (values) => {
      const res = await sendContactUs(values);
      if (res) {
        setAlert("Form submitted successfuly!", "success");
        formik.resetForm();
      } else {
        setAlert("Cannot able to submit", "error");
      }
    },
  });

  const contactInfo = [
    {
      type: "misc",
      content: <span>Hello, I am</span>,
      formik: formik,
    },
    {
      label: "first name",
      name: "first_name",
      type: "text",
      placeholder: "Enter your first name",
      class: "contactInput",
      variant: "Standard",
      formik: formik,
    },
    {
      label: "last name",
      name: "last_name",
      type: "text",
      placeholder: "Enter your last name",
      class: "contactInput",
      variant: "Standard",
      formik: formik,
    },
    {
      type: "misc",
      content: <span>from</span>,
      formik: formik,
    },
    {
      label: "location",
      name: "location",
      type: "text",
      placeholder: "Enter your location",
      class: "contactInput",
      variant: "Standard",
      formik: formik,
    },
    {
      type: "misc",
      content: <span>and I would like to sell</span>,
      formik: formik,
    },
    {
      label: "something",
      name: "message",
      type: "text",
      placeholder: "What would you like to sell",
      class: "contactInput",
      variant: "Standard",
      formik: formik,
    },
    {
      type: "misc",
      content: (
        <>
          <br />
          <span>Please reach me out at</span>
        </>
      ),
      class: "separator",
      formik: formik,
    },

    {
      label: "email address",
      name: "email",
      type: "text",
      placeholder: "Enter your email address",
      class: "contactInput",
      variant: "Standard",
      formik: formik,
    },
    {
      label: "phone number",
      name: "phone",
      type: "number",
      placeholder: "Enter yout phone number",
      class: "contactInput",
      variant: "Standard",
      formik: formik,
    },
  ];

  return (
    <div className="home">
      {/* <div className="homeHero">
        <div className="heroTop">
          <div data-aos="fade-up">
            <h1>
              <span className="siteName">Auction.io</span>
            </h1>
            <div class="clientLogo">
              <a
                href="https://www.slibuy.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img src="./assets/images/slibuy.png" alt="Slibuy Logo" />
              </a>
              <a
                href="https://velvetcricket.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="./assets/images/velvet.png"
                  alt="Velvet Cricket Logo"
                />
              </a>
              <a
                href="https://www.loveseat.com/oc/"
                target="_blank"
                rel="noreferrer"
              >
                <img src="./assets/images/loveseat.png" alt="Loveseat Logo" />
              </a>
              <a
                href="https://www.hawaiiauctionservices.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="./assets/images/has.png"
                  alt="Hawaii Auction Services Logo"
                />
              </a>
            </div>
          </div>
        </div>
        <div data-aos="fade-up" data-aos-delay="1000" id="heroAnchor">
          <div className="heroVideo">
            <img src="/assets/images/laptopMockup.png" alt="Mockup" />
            <video
              src="./assets/images/main_video.mp4"
              muted={true}
              autoPlay
              playsInline
              loop
            />
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="1200"
          data-aos-anchor="#heroAnchor"
          className="btnWrpr d-flex align-items-center justify-content-center"
        >
        
          <PrimaryButton
            label="Want to bid?"
            btnSize="small"
            onClick={() => handleRedirectInternal(router, "auctions")}
          />
          <PrimaryButton
            label="Want to sell?"
            btnSize="small"
            onClick={() => window.open("https://seller.auction.io")}
            className="sell-button"
          />
        </div>
      </div> */}

      {/* <div className="homeNewHero customContainer">
        <div className="newBanner">
          <h3>
            Build your own <br />
            Fully Functional Auction Site
          </h3>
          <img
            src="/assets/svg/banner_Illustration.svg"
            alt="Banner illustration"
          />
        </div>
        <div class="table-responsive pricingTable" id="pricingTable">
          <table class="table table-borderd">
            <thead>
              <tr class="headPlan">
                <th>Plan</th>
                <th>Startup - One time</th>
                <th>Business</th>
                <th>
                  Enterprise
                  <span className="prfdChip">Preferred Plan</span>
                </th>
              </tr>

              <tr class="headPrice">
                <th>Price</th>
                <th>One Time Auction (Free)</th>
                <th>
                  $200 <span>per month</span>
                </th>
                <th>
                  $500 <span>per month</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Auction.io marketplace fees (Timed)</td>
                <td>2%</td>
                <td>2%</td>
                <td>2%</td>
              </tr>
              <tr>
                <td>Auction.io marketplace fees (Live)</td>
                <td>2%</td>
                <td>2%</td>
                <td>2%</td>
              </tr>
              <tr>
                <td id="kickstart">ONLINE PAYMENT FEES</td>
                <td>3.1% + 30 cents</td>
                <td>3.1% + 30 cents</td>
                <td>3.1% + 30 cents</td>
              </tr>
              <tr>
                <td>LIVE AUCTION TOOL (OPTIONAL)</td>
                <td>$650</td>
                <td>$650</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>BUYER FEES TOOL</td>
                <td>No</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr className="hltRow">
                <td>WE CREATE AUCTION STORE | MARKETPLACE FOR YOU</td>
                <td>No</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>LIVE AUCTION IN YOUR STORE</td>
                <td>No</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>TIMED AUCTION IN YOUR STORE</td>
                <td>No</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Sell via your store fees</td>
                <td>NA</td>
                <td>NA</td>
                <td>0%</td>
              </tr>

              <tr>
                <td>MAX ACTIVE LISTING PER AUCTION</td>
                <td>400</td>
                <td>1500</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>YOU SELECT AUCTION DATE</td>
                <td>$199/Auction</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>WE SELECT AUCTION DATE</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Auctions allowed per year</td>
                <td>1</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td>
                  {" "}
                  <a href="https://app.auction.io/login?plan=1" target="_blank">
                    <button class="btn pricingButton">GO</button>
                  </a>
                </td>
                <td>
                  {" "}
                  <a href="https://app.auction.io/login?plan=2" target="_blank">
                    <button class="btn pricingButton">GO</button>
                  </a>
                </td>
                <td>
                  {" "}
                  <a href="https://app.auction.io/login?plan=3" target="_blank">
                    <button class="btn pricingButton">GO</button>
                  </a>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div> */}

      <div className="customContainer">
        <Plugins />
      </div>

      {isLoading ? (
        <div className="customContainer my-4">
          <Loaders name="product_grid_view" isLoading={true} loop={8} />
        </div>
      ) : (
        <>
          {auctionLots.length === 0 ? (
            <>
              {homePageTimedAuction &&
              homePageTimedAuction.length !== 0 &&
              homePageTimedAuction.filter(
                (featuredAuction) =>
                  moment.utc(featuredAuction.date_closed).local() >= today
              ).length !== 0 ? (
                <div className="featuredAuctions customContainer">
                  <div
                    className="faBg"
                    // data-aos="fade-up"
                    // data-aos-easing="ease-in-sine"
                    // data-aos-duration="1500"
                    // data-aos-delay="0"
                  ></div>
                  <div
                    className="homeTitle timedAuctionTitle"
                    data-aos="fade-up"
                    // data-aos-delay="500"
                  >
                    <Button
                      onClick={() =>
                        router.push("/searchAuction?auctionType=0")
                      }
                    >
                      See All
                    </Button>
                    <h2>
                      <span>Timed</span>
                      Auctions
                    </h2>
                  </div>
                  <div className="faCnt">
                    {homePageTimedAuction
                      .filter(
                        (featuredAuction) =>
                          moment.utc(featuredAuction.date_closed).local() >=
                          today
                      )
                      .slice(0, 6)
                      .map((data, index) => (
                        <div
                          data-aos="fade-up"
                          key={`fa_${index}`}
                          data-aos-delay={500 + index * 100}
                        >
                          <div
                            className="faCard"
                            onClick={() => {
                              featuredAuctionRedirect(data);
                            }}
                          >
                            {/* <LazyLoadImage
                              src={`${global.images_url}${data.avatar}`}
                              className="acImgLt"
                              alt={data.title}
                              onError={(e) => noImageAvailable(e)}
                              effect="blur"
                              placeholderSrc="assets/svg/imageLoading.svg"
                              height="100%"
                              width="100%"
                            /> */}
                            <img
                              src={`${global.images_url}${data.avatar}`}
                              alt={data.title}
                              onError={(e) => noImageAvailable(e)}
                              fetchpriority="low"
                            />
                            <div className="faInfo">
                              <h4>{capitalize(data.title)}</h4>
                              {/* <h4>${data.price}</h4> */}
                              <div className="d-flex justify-content-between align-items-center w-100">
                                <h5>
                                  {moment.utc(data.date_added).local() >=
                                  today ? (
                                    <>
                                      Starts at &nbsp;
                                      {moment
                                        .utc(data.date_added)
                                        .local()
                                        .format("LL LT")}
                                    </>
                                  ) : (
                                    <>
                                      Ends at &nbsp;
                                      {moment
                                        .utc(data.date_closed)
                                        .local()
                                        .format("LL LT")}
                                    </>
                                  )}
                                </h5>
                                {/* <div className="featBrand">
                        <span>Featured on:</span>
                        <img src={"/assets/images/nellis.png"} alt="Featured" />
                      </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {auctionLots.length === 0 ? (
            <>
              {homePageLiveAuction &&
              homePageLiveAuction.length !== 0 &&
              homePageLiveAuction.filter(
                (calendarAuction) =>
                  moment.utc(calendarAuction.date_closed).local() >= today
              ).length !== 0 ? (
                <div className="calendarAuctions customContainer">
                  <div
                    className="caBg"
                    data-aos="fade-up"
                    data-aos-easing="ease-in-sine"
                    data-aos-duration="1500"
                  ></div>
                  <div
                    className="homeTitle"
                    data-aos="fade-up"
                    data-aos-delay="500"
                    data-aos-once="true"
                  >
                    <Button
                      onClick={() =>
                        router.push("/searchAuction?auctionType=1")
                      }
                    >
                      See All
                    </Button>
                    <h2>
                      <span>Live</span>
                      Auctions
                    </h2>
                  </div>
                  <div className="caCnt">
                    {homePageLiveAuction
                      .filter(
                        (calendarAuction) =>
                          moment.utc(calendarAuction.date_closed).local() >=
                          today
                      )
                      .slice(0, 6)
                      .map((data, index) => (
                        <>
                          <div
                            data-aos="fade-up"
                            key={`la_${index}`}
                            data-aos-delay={500 + index * 200}
                            data-aos-once="true"
                          >
                            <AuctionCard
                              data={data}
                              featuredAuctionRedirect={featuredAuctionRedirect}
                              noTimer={data.auction_type === 1 ? true : false}
                            />
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {/* {auctionLots.length === 0 ? (
            <>
              {homePageOtherAuction &&
              homePageOtherAuction.length !== 0 &&
              homePageOtherAuction.filter(
                (otherAuction) =>
                  moment.utc(otherAuction.date_closed).local() >= today
              ).length !== 0 ? (
                <div className="otherAuctions customContainer">
                  <div className="homeTitle">
                    <Button onClick={() => router.push("/search")}>
                      See All
                    </Button>
                    <h2>
                      <span>Other</span>
                      Auctions
                    </h2>
                  </div>
                  <div className="oaCnt">
                    {otherAuction &&
                      otherAuction.length !== 0 &&
                      otherAuction.map((data, index) => (
                        <GridView
                          data={data}
                          favId={`searchProd_${index}`}
                          drawerHandler={() => lotPageRedirect(data)}
                          updateData={() => getAllOtherAuction({})}
                        />
                      ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null} */}
          {auctionLots.length > 0 ? (
            <>
              <div className="calendarAuctions customContainer">
                <div
                  className="caBg"
                  data-aos="fade-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="1500"
                ></div>
                <div
                  className="homeTitle d-flex justify-content-between flex-wrap"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  data-aos-once="true"
                >
                  <div>
                    <Button onClick={() => router.push("/search")}>
                      See All
                    </Button>
                    <h2>
                      <span>Featured</span>
                      Lots
                    </h2>
                  </div>
                  {console.log(sponsoredDetails, "sponsoredDetails")}
                  <h5 className="saSeller">
                    <span className="material-icons">stars</span>
                    Sponsored by:
                    <span className="saSellerInfo">
                      {sponsoredDetails && sponsoredDetails?.store_name
                        ? sponsoredDetails?.store_name
                        : `${capitalize(
                            sponsoredDetails.first_name
                          )} ${capitalize(sponsoredDetails.last_name)}`}
                    </span>
                  </h5>
                </div>
                {auctionLots.length > 0 ? (
                  <>
                    <div className="searchResults grid">
                      {auctionLots.map((data, index) => (
                        <>
                          <div
                            data-aos="fade-up"
                            key={`la_${index}`}
                            // data-aos-delay={500 + index * 200}
                            data-aos-once="true"
                          >
                            <GridView
                              data={data}
                              location={`${sponsoredDetails?.state}, ${sponsoredDetails?.country}`}
                              auctionType={
                                data.con_check === 1 ? "live" : "timed"
                              }
                              noTimer={data.con_check === 1 ? 1 : 0}
                              from="home"
                              favId={`searchProd_${index}`}
                              drawerHandler={() => lotPageRedirect(data)}
                              updateData={() => getAllTopLots({})}
                            />
                          </div>
                        </>
                      ))}
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </>
          ) : null}
        </>
      )}

      <div className="calendarAuctions customContainer">
        <div
          className="caBg"
          data-aos="fade-up"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1500"
        ></div>
        <div
          className="homeTitle"
          data-aos="fade-up"
          data-aos-delay="500"
          data-aos-once="true"
        >
          <Button onClick={() => router.push("/car_auction")}>See All</Button>
          <h2>
            <span>Car</span>
            Auctions
          </h2>
        </div>
        <Cars pageCount={50} loop={12} />
      </div>

      <div className="workTogether" data-aos="fade-top">
        <div className="workTogetherInner customContainer d-flex justify-content-between align-items-end ">
          <div>
            {/* <h6>GOT A PROJECT IN MIND?</h6> */}
            <h3>Why Auction.io?</h3>
          </div>
          {isAuthenticated ? null : (
            <Button onClick={() => handleRedirectInternal(router, "signup")}>
              Register today
            </Button>
          )}
        </div>
      </div>

      <div className="whyUs">
        <div
          className="whyUsItem"
          data-aos="fade-up"
          data-aos-delay={300}
          data-aos-once="true"
        >
          <img src="./assets/svg/1.svg" alt="" />
          <p className="hdTxt">Quality Matters</p>
          <p className="bdyTxt">
            Auction.io provides detailed view to verify the quality of the
            product before you submit a bid.
          </p>
        </div>
        <div
          className="whyUsItem"
          data-aos="fade-up"
          data-aos-delay={500}
          data-aos-once="true"
        >
          <img src="./assets/svg/2.svg" alt="" />
          <p className="hdTxt">Real Time Bids</p>
          <p className="bdyTxt">
            Suggested Retail Pricing and Machine learning Sale price in real
            time eliminates guess work.
          </p>
        </div>
        <div
          className="whyUsItem"
          data-aos="fade-up"
          data-aos-delay={700}
          data-aos-once="true"
        >
          <img src="./assets/svg/3.svg" alt="" />
          <p className="hdTxt">Save when you BUY</p>
          <p className="bdyTxt">
            Auction.io is here to save you money! We sell items from our website
            for you to pick up either from our warehouse or Auctioneer’s
            Warehouse directly. Pickup or Shipping Terms are clearly defined
            before making payment.
          </p>
        </div>
        <div
          className="whyUsItem"
          data-aos="fade-up"
          data-aos-delay={900}
          data-aos-once="true"
        >
          <img src="./assets/svg/4.svg" alt="" />
          <p className="hdTxt">Powered Locally</p>
          <p className="bdyTxt">
            Get the clarity about the products from the local Auctioneer before
            you buy! Support and promote local business and the liquidation of
            national brands.
          </p>
        </div>
      </div>
      <div className="clntIfoWrpr customContainer mb-4">
        <div
          className="clntLgs w-100"
          data-aos="fade-right"
          data-aos-once="true"
        >
          <ClientCarousel />
        </div>
        <div
          className="d-flex reviewSection"
          data-aos="fade-left"
          data-aos-delay="800"
          data-aos-once="true"
        >
          <div className="shpCnfdns px-5">
            <h3>Shop with Confidence</h3>
            <p>
              AuctionSoftware.com has built many auction websites for Small,
              Medium and Large enterprise customers in every industry since
              2014. Our software platform is handling around $180M transactions
              every year. Our Software is the solution for your auction needs!
            </p>
          </div>
          <div className="rtngWrpr">
            <div className="cptraWrpr">
              <a href="https://www.capterra.com/p/136964/Auction-Software/#reviews">
                Review us at
              </a>
              <img src="/assets/images/captera.png" alt="Capterra review" />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="homeContact customContainer">
        <div className="homeContactTitle">
          <h6>Sell Stuff</h6>
          <h3>Want to reach us out quickly? </h3>
          <h3>Fill this form and we will get in touch with you.</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="homeContactInner">
            {Object.values(mapData(contactInfo))}
          </div>
          <PrimaryButton label="Submit" type="submit" btnSize="small" />
          <img
            src="./assets/svg/contact.svg"
            alt="Contact"
            className="contactImg"
          />
        </form>

        <h4 className="sellerRegistration">
          Ready for a detailed registration? Here is our{' '}
          <a
            href="https://app.auction.io/login?plan=1"
            target="_blank"
            rel="noreferrer"
          >
            Seller signup
          </a>
        </h4>
      </div> */}

      {/* <ReactPlayer url="https://vimeo.com/591863269" playing="true" width="100%" /> */}
      {/* <div className="marketingInfo d-flex justify-content-between align-items-center customContainer">
        <h2>Line of marketing text goes here</h2>
        <Button>Learn More</Button>
      </div> */}
      {/* <div className="appDownload d-flex justify-content-between align-items-center customContainer">
        <object
          data="/assets/svg/phone.svg"
          type="image/svg+xml"
          aria-label="phone"
        />
        <h2>Get notified, fast. Get the app.</h2>
        <div className="adAppBtn">
          <a href="#">
            <img src="/assets/images/appstore.png" alt="appstore" />
          </a>
          <a href="#">
            <img src="/assets/images/gplay.png" alt="gplay" />
          </a>
        </div>
      </div> */}
      {/* <Drawer
        className="rightDrawer productViewDrawer"
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {" "}
        {lot_details && Object.keys(lot_details).length !== 0 ? (
          <ProductViewSlider />
        ) : null}
      </Drawer> */}
      <Dialog
        className="videoDialogWrapper"
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <div className="d-flex align-items-center justify-content-end">
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </AppBar>
        <ReactPlayer
          className="cstmVdoPlayer"
          url="https://vimeo.com/591863269"
          playing="true"
        />
      </Dialog>
    </div>
  );
}

export default Home;
