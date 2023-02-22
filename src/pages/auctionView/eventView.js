import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Breadcrumbs, Drawer, Button } from "@material-ui/core";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SecondaryButton from "@/components/atoms/SecondaryButton";
import CustomSelect from "@/components/atoms/Inputs/CustomSelect";
import GridView from "@/components/molecules/ProductCard/GridView";
import NoRecordsFound from "@/components/atoms/NoRecordsFound";
import ListView from "@/components/molecules/ProductCard/ListView";
import { Link, useHistory, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import ProductViewSlider from "@/components/organisms/ProductViewSlider";
import {
  handleRedirectInternal,
  searchQueryParam,
  noImageAvailable,
  getImages_url_check,
  mapData,
  currencyFormat,
} from "@/common/components";
import csc from "country-state-city";
import ProductContext from "@/context/product/productContext";
import AuctionContext from "@/context/auction/auctionContext";
import CommonContext from "@/context/common/commonContext";
import AuthContext from "@/context/auth/authContext";
import AlertContext from "@/context/alert/alertContext";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import { date, object } from "yup";
import { Pagination } from "@material-ui/lab";

import { socket, socketForward } from "@/common/socket";
import UserContext from "@/context/user/userContext";
import Popup from "@/components/organisms/Popup";
import Loaders from "@/components/molecules/Loaders";
import { capitalize } from "@/common/components";
import { useMediaQuery } from "react-responsive";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Timer from "@/common/timer";
import { useFormik } from "formik";
import * as Yup from "yup";
import lookup from "country-code-lookup";
import DonorHistory from "@/components/organisms/DonarHistory";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddToCalendar from "@/components/molecules/AddToCalendar";
import { messageHandler } from "@/common/socketHandler";
import { useRouter } from "next/router";
import AddCreditCard from "@/components/organisms/AddCreditCard";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function EventView(props) {
  const router = useRouter();
  const { getIndividualProductLotDetails, lot_details } =
    useContext(ProductContext);
  const {
    getAuctionDetails,
    auctiondetails,
    totalAuctionLots,
    auctionRegistered,
    allauctionlots,
    registerForAuction,
    getAllAuctionMessages,
    allmessages,
    getSellerInfo,
    auctionSellerDtls,
    responseStatus: auctionResponse,
    clearResponse,
  } = useContext(AuctionContext);
  const {
    isAuthenticated,
    user,
    donar_registration,
    getdonarexistingcard,
    getdonarlist,
    responseStatus: donar_response,
    clearResponse: donar_clearresponse,
  } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const { allCategory, searchValue, setSearchValue, allCountries } =
    useContext(CommonContext);
  const [statesInLocal, setStatesinLocal] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [auctionView, setAuctionView] = useState("List");
  const [regBtn, setRegBtn] = useState(false);
  const [viewAddCredit, setViewAddCredit] = useState(false);
  const [carddetails, setCardDetails] = useState([]);
  const [donar_list, setDonarList] = useState({});
  const [popup_open, setPopupopen] = useState(false);
  const [selected_card, setSelectedCard] = useState("");
  const { addSavedSearch, getStripeCard } = useContext(UserContext);
  const [savedCards, setSavedCards] = useState([]);

  const [auctionDetails, setAuctionDetails] = useState({});
  const [messageBoxContent, setMessageBoxContent] = useState([]);
  const [messageBoxElement, setMessageBoxElement] = useState();
  const [page, setPage] = useState(1);
  const [auctionLots, setAuctionLots] = useState([]);
  const [value, setValue] = React.useState(1);
  const [currentDon, setCurrentDon] = useState("donAmount");

  const [state, setState] = useState({
    right: false,
    bottom: false,
    data: {},
  });
  const [lotCustomSearch, setLotCustomSearch] = useState({
    customSearchText: "",
    sortBy: "None",
    perPage: "25",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [readMore, setReadMore] = useState(false);
  const characterLimit = 500;
  const [newMsg, setNewMsg] = useState("");
  const [reload, setReload] = useState(false);
  const isMobile = useMediaQuery({
    query: "(max-width: 991px)",
  });
  const [timerView, setTimerView] = useState(true);

  const [addressInitialValues, setAddressInitialValues] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    address: "",
    id: "",
    payment: "Card",
    web_address: "",
    notes: "",
    amount: "",
    business_name: "",
    auctionid: "",
    extracardnumber: "",
    extradate: "",
    extrayear: "",
    extracvv: "",
    sourceID: "",
  });
  const [donar_loading, setDonarLoading] = useState(false);

  const sortBy = [
    {
      name: "None",
      key: 0,
    },
    {
      name: "Most Bids",
      key: 1,
    },
    {
      name: "Least Bids",
      key: 2,
    },
    {
      name: "Current Price (Low- High)",
      key: 3,
    },
    {
      name: "Current Price (High- Low)",
      key: 4,
    },
    // {
    //   name: "Time Remaining",
    //   key: 5,
    // },
    // {
    //   name: "Ending Today",
    //   key: 6,
    // },
    {
      name: "Estimate Price (Low - High)",
      key: 7,
    },
    {
      name: "Estimate Price (High - Low)",
      key: 8,
    },
  ];
  const perPage = [
    {
      key: 0,
      value: "5",
    },
    {
      key: 1,
      value: "10",
    },
    {
      key: 2,
      value: "15",
    },
    {
      key: 3,
      value: "25",
    },
    {
      key: 4,
      value: "50",
    },
  ];

  useEffect(() => {
    isMobile && setAuctionView("Grid");
  });

  const handleChange = (event, newValue) => {
    if (newValue == 2) {
      if (isAuthenticated) {
        setValue(newValue);
        window.scrollTo(0, 0);
      } else {
        handleRedirectInternal(router, "login");
      }
    } else if (newValue == 3) {
      if (isAuthenticated) {
        handleRedirectInternal(
          router,
          `ticketing/${auctionDetails.stage_id}/${auctionDetails.id}`
        );
      } else {
        handleRedirectInternal(router, "login");
      }
    } else setValue(newValue);
  };

  const getAllSavedCards = async () => {
    const result = await getStripeCard({ userid: user.id });
    if (
      result &&
      result.result_stripe &&
      result.result_stripe.status === "success"
    ) {
      setSavedCards(result.result_stripe.data.responseData.data);
    }
  };

  useEffect(() => {
    if (auctionResponse) {
      if (auctionResponse.from === "liveLot") {
        if (auctionResponse.status === "error") {
          setAlert("Auction Not Found", "warning");
          clearResponse();
          handleRedirectInternal(router, "auctions");
        }
      }
    }
  }, [auctionResponse]);

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
        user_id: user && user.id ? user.id : "",
        is_auctionio: 1,
      };
      getIndividualProductLotDetails(productDtls);
      setState({ ...state, [anchor]: open, data: data });
    } else {
      setState({ ...state, [anchor]: open, data: {} });
    }
  };

  useEffect(() => {
    let auctionId = router?.query.auctionId;
    if (auctionId) {
      setIsLoading(true);
      getAuctionDetails({
        title: "",
        auctionId: auctionId,
        userid: user && user.id ? user.id : "",
        page: 1,
        perpage: 25,
        orderby: 1,
        is_auctionio: 1,
      });
      getAllAuctionMessages({
        auctionid: auctionId,
      });
      getSellerInfo({ auctionid: auctionId });
    } else {
      handleRedirectInternal(router, "auctions");
    }
  }, [router.pathname, isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (router?.query.search) {
      let viewTypes = router.query.viewType;
      if (viewTypes === "grid") {
        setAuctionView("Grid");
      } else if (viewTypes === "list") {
        setAuctionView("List");
      }
    }
  }, [router.query]);

  const getAuctionFunction = () => {
    let auctionId = router?.query.auctionId;
    if (auctionId) {
      setIsLoading(true);
      getAuctionDetails({
        title: "",
        auctionId: auctionId,
        userid: user && user.id ? user.id : "",
        page: page,
        perpage: lotCustomSearch.perPage,
        orderby: 1,
        is_auctionio: 1,
      });
      getAllAuctionMessages({
        auctionid: auctionId,
      });
      getSellerInfo({ auctionid: auctionId });
    } else {
      handleRedirectInternal(router, "auctions");
    }
  };
  const auctionViewType = (view) => {
    if (props && props.location) {
      let searchParams = router.asPath;
      if (view === "list") {
        searchParams.set("viewType", "list");
        router.push({
          path: "/auctionView",
          search: searchParams.toString(),
        });
      } else if (view === "grid") {
        searchParams.set("viewType", "grid");
        router.push({
          path: "/auctionView",
          search: searchParams.toString(),
        });
      }
    }
  };

  socket.on("bidoffers", (data) => {
    if (
      data &&
      Object.keys(data).length > 0 &&
      allauctionlots &&
      allauctionlots.length > 0
    ) {
      let modifiedLots = allauctionlots
        .filter(
          (ele) =>
            (ele.auction === 1 && ele.buynow === 0) ||
            (ele.auction === 1 && ele.buynow === 1)
        )
        .map((ele) => {
          let newLot = ele;

          if (data.lotid === newLot.id) {
            newLot.bidcnt = data.bids_offer[0].bidcnt;
            newLot.wprice = data.bids_offer[0].current_amount;
            return newLot;
          } else {
            return newLot;
          }
        });
      setAuctionLots(modifiedLots);
      // if (Object.keys(auctionDetails).length) {
      //   getAllAuctionMessages({
      //     auctionid: auctionDetails.id,
      //   });
      // }
    }
  });

  const viewProductRef = useRef(auctionLots);
  const userRef = useRef(user);

  useEffect(() => {
    viewProductRef.current = auctionLots;
    userRef.current = user;
  });

  const handler = (message, type) => {
    messageHandler(
      message,
      viewProductRef.current,
      userRef.current,
      setAlert,
      setAuctionLots,
      type
    );
  };
  useEffect(() => {
    socket.on("realclosedupdates", (data) => {
      handler(data, "realclosedupdates");
    });
    socket.on("bidAddtime", (data) => {
      handler(data, "bidAddtime");
    });

    return () => {
      socket.off("realclosedupdates", (data) => {
        handler(data, "realclosedupdates");
      });
      socket.off("bidAddtime", (data) => {
        handler(data, "bidAddtime");
      });
    };
  }, []);

  useEffect(() => {
    if (allauctionlots.length >= 0) {
      let filterAuctionLot = allauctionlots.filter(
        (ele) =>
          (ele.auction === 1 && ele.buynow === 0) ||
          (ele.auction === 1 && ele.buynow === 1)
      );
      setAuctionLots(filterAuctionLot);
    }
  }, [allauctionlots]);

  useEffect(() => {
    if (Object.keys(auctiondetails).length > 0) {
      setAuctionDetails(auctiondetails);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      if (parseInt(auctiondetails.charity_type) == 1 && isAuthenticated) {
        getdonarexistingcard({ user_id: user?.id ? user.id : "" });
      }
      if (parseInt(auctiondetails.charity_type) == 1) {
        getdonarlist({ auctionid: auctiondetails.id, page: 1, perpage: 5 });
      }
    }
  }, [auctiondetails]);

  const handleLiveAuctionClick = () => {
    //Check is user is approved to view live auction
    //Add is Register approved to the AuctionLotAPI
    router.push({
      pathname: "/liveLots",
      search: `?auctionId=${auctionDetails.id}&uid=${user.id ? user.id : 0}`,
    });
  };

  const handleRegisterForAuctionClick = async () => {
    setRegBtn(true);
    const payload = {
      user_id: user.id,
      auction_id: auctiondetails.id,
      status: "moderate",
    };
    const result = await registerForAuction(payload);
    if (result) {
      let auctionId = router?.query.auctionId;
      if (auctionId) {
        setIsLoading(true);
        getAuctionDetails({
          title: "",
          auctionId: auctionId,
          userid: user && user.id ? user.id : "",
          page: 1,
          perpage: "",
          orderby: 1,
          is_auctionio: 1,
        });
      }
      setAlert("Auction Registration Request Sent", "success");
      setRegBtn(false);
    }
  };

  const handleSearchTextChange = (e) => {
    let copiedSearch = { ...lotCustomSearch };
    let name = e.target.name;
    let value = e.target.value;
    copiedSearch[name] = value;

    setLotCustomSearch(copiedSearch);
  };

  const searchAuctionLot = (notLoading) => {
    if (!notLoading) {
      setIsLoading(true);
    }
    let auctionId = router?.query.auctionId;
    let auctionSearch = {
      title: lotCustomSearch.customSearchText,
      auctionId: auctionId,
      userid: user && user.id ? user.id : "",
      page: page,
      perpage: lotCustomSearch.perPage,
      orderby: 1,
      is_auctionio: 1,
    };

    getAuctionDetails(auctionSearch);
  };

  const handleDrawerOpenLot = (data, notLoading) => {
    let productDtls = {
      lotId: data.id,
      user_id: user && user.id ? user.id : "",
      is_auctionio: 1,
    };
    let auctionId = router?.query.auctionId;
    let auctionSearch = {
      title: lotCustomSearch.customSearchText,
      auctionId: auctionId,
      userid: user && user.id ? user.id : "",
      page: page,
      perpage: lotCustomSearch.perPage,
      orderby: 1,
    };
    if (!notLoading) {
      setIsLoading(true);
    }
    getAuctionDetails(auctionSearch);
    getIndividualProductLotDetails(productDtls);
  };
  const clearAuctionLotSearch = () => {
    let auctionId = router?.query.auctionId;
    setLotCustomSearch({ ...lotCustomSearch, customSearchText: "" });
    let auctionSearch = {
      title: "",
      auctionId: auctionId,
      userid: "",
      page: 1,
      perpage: "25",
      orderby: 1,
    };
    setIsLoading(true);
    getAuctionDetails(auctionSearch);
  };

  const customSearchSelection = (e) => {
    let searchName = e.target.name;
    let searchValue = e.target.value;
    let searchVlaue = { ...lotCustomSearch };
    if (searchName === "perPage") {
      searchVlaue[searchName] = searchValue;
      setLotCustomSearch(searchVlaue);

      let auctionId = router?.query.auctionId;
      let customPage = {
        title: "",
        auctionId: auctionId,
        userid: "",
        page: page,
        perpage: searchValue,
        orderby: 1,
        is_auctionio: 1,
      };
      setIsLoading(true);
      getAuctionDetails(customPage);
      setPage(1);
    } else if (searchName === "sortBy") {
      searchVlaue[searchName] = searchValue;
      setLotCustomSearch(searchVlaue);
      searchSortBy(searchValue);
    }
  };
  useEffect(() => {
    if (user && Object.keys(user).length) getAllSavedCards();
  }, [user]);

  const searchSortBy = (perpage) => {
    switch (perpage) {
      case "None":
        setAuctionLots(
          allauctionlots.filter(
            (ele) =>
              (ele.auction === 1 && ele.buynow === 0) ||
              (ele.auction === 1 && ele.buynow === 1)
          )
        );
        break;
      case "Most Bids":
        let highCount = auctionLots.sort((x, y) => y.bidcnt - x.bidcnt);
        setAuctionLots(highCount);
        break;
      case "Least Bids":
        let leastBids = auctionLots.sort((x, y) => x.bidcnt - y.bidcnt);
        setAuctionLots(leastBids);
        break;
      case "Current Price (Low- High)":
        let lowToHigh = auctionLots.sort((x, y) => x.wprice - y.wprice);
        setAuctionLots(lowToHigh);
        break;
      case "Current Price (High- Low)":
        let hightToLow = auctionLots.sort((x, y) => y.wprice - x.wprice);
        setAuctionLots(hightToLow);
        break;
      // case "Time Remaining":
      //   setAuctionLots(allauctionlots);

      //   break;
      // case "Ending Today":
      //   let endingToday = allauctionlots.filter((ele) => {
      //     if (moment(ele.date_closed).isSame(new Date())) {
      //       return ele;
      //     }
      //   });
      //   setAuctionLots(allauctionlots);
      //   break;
      case "Estimate Price (Low - High)":
        let estimateLowToHigh = auctionLots.sort((x, y) => x.bprice - y.bprice);
        setAuctionLots(estimateLowToHigh);
        break;
      case "Estimate Price (High - Low)":
        let estimateHighToLow = auctionLots.sort((x, y) => y.bprice - x.bprice);
        setAuctionLots(estimateHighToLow);
        break;
      default:
        setAuctionLots(
          allauctionlots.filter(
            (ele) =>
              (ele.auction === 1 && ele.buynow === 0) ||
              (ele.auction === 1 && ele.buynow === 1)
          )
        );
    }
  };
  const onHandlePage = (e, page) => {
    setPage(page);
    let auctionId = router?.query.auctionId;
    let customPage = {
      title: "",
      auctionId: auctionId,
      userid: "",
      page: page,
      perpage: lotCustomSearch.perPage,
      orderby: 1,
    };
    setIsLoading(true);
    getAuctionDetails(customPage);
  };

  const handleCatBreadCrumClick = () => {
    let catObject = allCategory.filter(
      (category) => category.name === auctionDetails.maincat_name
    );
    if (catObject.length > 0) {
      handleRedirectInternal(router, "auctions", `catgId=${catObject[0].id}`);
    }
  };

  const scrollToBottom = (element) => {
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  const createMessageBoxRef = useCallback((node) => {
    if (node !== null) {
      setMessageBoxElement(node);
    }
  });

  // useEffect(() => {
  //   scrollToBottom(messageBoxElement);
  // }, [messageBoxElement]);

  const compareByDate = (objectA, objectB) => {
    const dateObjectA = Date.parse(objectA.date_sent);
    const dateObjectB = Date.parse(objectB.date_sent);

    let comparison = 0;
    if (dateObjectA < dateObjectB) {
      comparison = 1;
    } else if (dateObjectA > dateObjectB) {
      comparison = -1;
    }
    return comparison;
  };

  useEffect(() => {
    let dataToDisplay = [];
    if (allmessages && allmessages.length > 0) {
      dataToDisplay = allmessages;
      dataToDisplay.sort(compareByDate);
    }
    setMessageBoxContent(dataToDisplay);
  }, [allmessages]);

  useEffect(() => {
    let auctionId = router?.query.auctionId;
    socket.on("liveAuctionMsg", (data) => {
      if (data.auctionid == auctionId) {
        setNewMsg(data);
      }
    });
  }, []);

  useEffect(() => {
    if (newMsg) {
      let auctionMessage = {};
      auctionMessage.message = newMsg.message;
      auctionMessage.type = newMsg.type;
      messageBoxContent.splice(0, 0, auctionMessage);
    }
    setReload(!reload);
  }, [newMsg]);

  const todayDate = new Date();

  const timerShow = () => {
    if (auctionDetails && new Date(auctionDetails.date_added) <= new Date()) {
      setTimerView(false);
      clearInterval(timerInterval);
    } else if (
      auctionDetails &&
      new Date(auctionDetails.date_closed) <= new Date()
    ) {
      setTimerView(true);
      clearInterval(timerInterval);
    }
  };

  const timerInterval = setInterval(timerShow, 1000);

  useEffect(() => {
    socket.on("liveauctionclose", (data) => {
      let auctionId = router?.query.auctionId;
      if (parseInt(data.auctionid) === parseInt(auctionId)) {
        setAlert("This Auction Has Been Ended By Seller Now", "Warning");
        handleRedirectInternal(router, "auctions");
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      if (user.email) {
        let countryId = "";
        if (lookup.byCountry(user.country) != null) {
          let { id } = csc.getCountryByCode(
            lookup.byCountry(user.country).iso2
          );
          countryId = id;
        }
        let stateId = "";
        if (countryId) {
          let statesOfCountry = csc.getStatesOfCountry(countryId);
          let index = statesOfCountry.findIndex(
            (element) => element.name === user.state
          );
          if (index) {
            stateId = statesOfCountry[index].id;
          }
        }
        let auctionId = router?.query.auctionId;
        setAddressInitialValues({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          state: user.state,
          country: user.country,
          zip: user.zip,
          address: user.address1,
          eventid: 0,
          payment: "",
          web_address: "",
          notes: "",
          amount: "",
          business_name: "",
          auctionid: auctionId,
          user_id: user.id,
          extracardnumber: "",
          extradate: "",
          extrayear: "",
          extracvv: "",
          sourceID: "",
          cardhname: "",
        });
      }
    }
  }, [user]);

  const validateAddress = Yup.object({
    first_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z]*$/g, "Special characters and numbers are not allowed")
      .max(20, "20 characters max")
      .required("Required"),
    last_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z]*$/g, "Special characters and numbers are not allowed")
      .max(20, "20 characters max")
      .required("Required"),
    phone: Yup.string()
      .trim()
      .matches(/^[0-9- +()]*$/g, "Only numbers are allowed")
      .min(12, "Minimum 10 digits phone number")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email format")
      .max(250, "250 characters max")
      .required("Required"),
    country: Yup.string().trim().required("Required!"),
    city: Yup.string()
      .trim()
      .matches(/^[0-9a-zA-Z ]*$/g, "No special charaters allowed.")
      .required("Required!"),
    state: Yup.string().trim().required("Required!"),
    zip: Yup.string()
      .trim()
      .matches(/^[0-9]*$/g, "Only positive numbers allowed")
      .min(5, "Minimum 5 Numbers")
      .max(6, "Maximum 6 Numbers")
      .required("Required!"),
    address: Yup.string().trim().required("Required!"),
    //web_address: Yup.string().trim().required("Required!"),
    business_name: Yup.string()
      .trim()
      .required("Required!")
      .max(25, "Maximum 25 characters"),
    amount: Yup.string()
      .trim()
      .matches(/^[0-9]*$/g, "Only positive numbers allowed")
      .required("Required!"),
    //payment: Yup.string().trim().required("Required!"),
    extradate:
      currentDon != "donInfo" && !selected_card
        ? Yup.string().required("Required!")
        : "",
    extrayear:
      currentDon != "donInfo" && !selected_card
        ? Yup.string().required("Required!")
        : "",
    extracvv:
      currentDon != "donInfo" && !selected_card
        ? Yup.string()
            .required("Required!")
            .matches(/^[0-9]*$/g, "Only positive numbers allowed")
            .min(3, "Mininum 3 Numbers required")
            .max(4, "Maximum 3 Numbers required")
        : "",
    cardhname:
      currentDon != "donInfo" && !selected_card
        ? Yup.string()
            .trim()
            .matches(
              /^[a-z A-Z]*$/g,
              "The special characters and numbers are not allowed!"
            )
            .required("Required!")
        : "",
    extracardnumber:
      currentDon != "donInfo" && !selected_card
        ? Yup.string()
            .min(12, "Invalid credit card number!")
            .max(18, "Invalid credit card number!")
            .required("Required!")
        : "",
  });

  const addressFormik = useFormik({
    initialValues: addressInitialValues,
    validationSchema: validateAddress,
    onSubmit: async (values) => {
      if (currentDon == "donInfo") {
        setCurrentDon("donPay");
        return false;
      }
      setDonarLoading(true);
      var orinal_country = values["country"];
      var original_state = values["state"];
      let { name: countryName } = csc.getCountryById(values["country"]);
      let { name: stateName } = csc.getStateById(values["state"]);
      var data_send = addressFormik.values;
      data_send.country = countryName;
      addressFormik.values.country = orinal_country;
      data_send.state = original_state;
      data_send.cardcity = values.city;
      data_send.cardstate = values.state;
      data_send.zipcode = values.zip;
      if (selected_card) {
        data_send.sourceID = selected_card;
      }
      donar_registration(data_send);
      // const response = await addShippingAddress({
      //   ...values,
      //   user_id: user.id,
      //   country: countryName,
      //   state: stateName,
      // });
      // if (response) {
      //   setAlert(response, "success");
      //   getCheckout({ user_id: user.id });
      //   setIsPopupOpen(false);
      //   addressFormik.resetForm();
      // }
    },
    enableReinitialize: true,
  });

  const amountDetails = [
    {
      title: "Price",
      type: "radio",
      name: "amount",
      int: 1,
      class: "col-md-12 donAmountRadio",
      customLabel: true,
      item: [
        { id: 25, description: <div className="amountRadBox">$25</div> },
        { id: 50, description: "$50" },
        { id: 100, description: "$100" },
        { id: 250, description: "$250" },
        { id: 500, description: "$500" },
        { id: 1000, description: "$1000" },
      ],
      formik: addressFormik,
    },
    {
      label: "Custom Amount",
      type: "number",
      placeholder: "USD",
      class: "col-sm-6 col-12",
      name: "amount",
      formik: addressFormik,
    },
  ];

  const addressDetails = [
    {
      label: "First Name",
      type: "text",
      placeholder: "Enter First Name",
      class: "col-sm-6 col-12",
      name: "first_name",
      formik: addressFormik,
    },
    {
      label: "Last Name",
      type: "text",
      placeholder: "Enter Last Name",
      class: "col-sm-6 col-12",
      name: "last_name",
      formik: addressFormik,
    },
    {
      label: "Email",
      type: "email",
      placeholder: "Enter Email",
      class: "col-sm-6 col-12",
      name: "email",
      formik: addressFormik,
    },
    {
      label: "Phone Number",
      type: "phone",
      placeholder: "Enter Phone Number",
      class: "col-sm-6 col-12",
      name: "phone",
      formik: addressFormik,
    },
    {
      label: "Country",
      placeholder: "Select your country",
      class: "col-12 col-sm-6",
      type: "select",
      options: allCountries,
      name: "country",
      formik: addressFormik,
    },
    {
      label: "Address",
      placeholder: "Enter your Address",
      class: "col-12 col-sm-6",
      type: "text",
      name: "address",
      formik: addressFormik,
    },
    {
      label: "State",
      placeholder: "Select your state",
      class: "col-12 col-sm-6",
      type: "select",
      options: statesInLocal,
      name: "state",
      formik: addressFormik,
    },
    {
      label: "City",
      type: "text",
      placeholder: "Enter City",
      class: "col-sm-6 col-12",
      name: "city",
      formik: addressFormik,
    },
    {
      label: "Zip",
      type: "number",
      placeholder: "Enter Zip",
      class: "col-sm-6 col-12",
      name: "zip",
      formik: addressFormik,
    },
    {
      label: "Business Name",
      type: "text",
      placeholder: "Enter Business Name",
      class: "col-sm-6 col-12",
      name: "business_name",
      formik: addressFormik,
    },
    {
      label: "Web Address",
      type: "text",
      placeholder: "Enter Web Address",
      class: "col-sm-6 col-12",
      name: "web_address",
      formik: addressFormik,
    },
    // {
    //   label: "Payment Method",
    //   placeholder: "Select your payment method",
    //   class: "col-12 col-sm-6",
    //   type: "select",
    //   options: [
    //     {
    //       show: "Visa",
    //       value: "Visa",
    //     },
    //     {
    //       show: "Master Card",
    //       value: "MasterCard",
    //     },
    //     {
    //       show: "Paypal",
    //       value: "Paypal",
    //     },
    //     {
    //       show: "Cash",
    //       value: "Cash",
    //     },
    //     {
    //       show: "Check",
    //       value: "Check",
    //     },
    //   ],
    //   name: "payment",
    //   formik: addressFormik,
    // },
    // {
    //   label: "Amount",
    //   type: "number",
    //   placeholder: "USD",
    //   class: "col-sm-6 col-12",
    //   name: "amount",
    //   formik: addressFormik,
    // },
    {
      label: "Notes",
      type: "text",
      placeholder: "Enter Notes",
      class: "col-sm-6 col-12",
      name: "notes",
      formik: addressFormik,
    },
  ];

  const creditCardYearOptions = [];
  let date = new Date();
  let currentYear = date.getFullYear();
  let upToYear = parseInt(currentYear) + 25;
  for (let year = parseInt(currentYear); year < parseInt(upToYear); year++) {
    creditCardYearOptions.push({
      value: year,
      show: year,
    });
  }

  const creditCardMonthOptions = [];
  for (let month = parseInt(1); month <= parseInt(12); month++) {
    let monthValue = ("0" + month).slice(-2);
    creditCardMonthOptions.push({
      value: monthValue,
      show: monthValue,
    });
  }

  const paymentdetails = [
    {
      label: "Card Holder Name",
      type: "text",
      placeholder: "Enter card holder name",
      class: "col-6",
      name: "cardhname",
      formik: addressFormik,
    },
    {
      label: "Card No",
      type: "number",
      placeholder: "Enter your card no",
      class: "col-6",
      name: "extracardnumber",
      formik: addressFormik,
    },
    {
      label: "Expiry Month",
      placeholder: "MM",
      class: "col-sm-6 col-12",
      type: "select",
      name: "extradate",
      options: creditCardMonthOptions,
      formik: addressFormik,
    },
    {
      label: "Expiry Year",
      placeholder: "YYYY",
      class: "col-sm-6 col-12",
      type: "select",
      name: "extrayear",
      options: creditCardYearOptions,
      formik: addressFormik,
    },
    {
      label: "Cvv",
      type: "text",
      placeholder: "Enter your Cvv",
      class: "col-sm-6 col-12",
      name: "extracvv",
      formik: addressFormik,
    },
  ];

  useEffect(() => {
    const { id, name } = csc.getCountryById(addressFormik.values.country);
    let states = csc.getStatesOfCountry(id);
    states = states.map((ele) => {
      let o = {
        show: ele.name,
        value: ele.id,
      };
      return o;
    });
    setStatesinLocal(states);
    //addressFormik.values.state = "";
  }, [addressFormik.values.country]);

  useEffect(() => {
    if (donar_response) {
      if (donar_response.from == "donar_register") {
        if (donar_response.status == "success") {
          addressFormik.resetForm();
          setIsPopupOpen(false);
          setSelectedCard("");
          setValue(0);
          setCurrentDon("donAmount");
          getdonarlist({ auctionid: auctiondetails.id, page: 1, perpage: 5 });
          setAlert(donar_response.message, "success");
        } else {
          setAlert(donar_response.message, "error");
        }
        setDonarLoading(false);
      }
      if (donar_response.from == "donorcarddetails_bidderdetails_page") {
        setCardDetails(
          donar_response.message?.cardlist
            ? donar_response.message.cardlist
            : []
        );
      }
      if (donar_response.from == "donorlist_bidderdetails_page") {
        if (donar_response.message) {
          donar_response.message.totpercentage = parseInt(
            parseFloat(
              parseInt(donar_response.message.donationamt) /
                parseInt(auctiondetails.expected_amount)
            ) * 100
          );
          var given = moment(auctiondetails.date_closed, "YYYY-MM-DD");
          var current = moment().startOf("day");
          donar_response.message.total_days = moment
            .duration(given.diff(current))
            .asDays();
        }
        setDonarList(donar_response.message);
      }
      donar_clearresponse();
    }
  }, [donar_response]);
  console.log(router, "viewRouter");
  return (
    <div className="auctionViewContainer">
      {isLoading ? (
        <div className="container-lg">
          <Loaders name="auction_view" isLoading={isLoading} />
        </div>
      ) : (
        <>
          {auctionDetails && Object.keys(auctionDetails).length !== 0 ? (
            <div className="auctionView container-lg footerFixer">
              <>
                <div className="d-flex align-items-end justify-content-between">
                  <Breadcrumbs aria-label="breadcrumb">
                    <Button color="inherit" onClick={handleCatBreadCrumClick}>
                      {capitalize(auctionDetails.maincat_name)}
                    </Button>
                    <Typography color="textPrimary">
                      {capitalize(auctionDetails.title)}
                    </Typography>
                  </Breadcrumbs>
                  {!timerView && auctiondetails.auction_type === 1 ? (
                    <>
                      <span className="lvAtnStrd">
                        <img src="/assets/images/live.gif" alt="live_icon" />
                        Live Auction Started
                      </span>
                    </>
                  ) : (
                    <span className="text-danger">
                      <Timer
                        date_added={auctionDetails.date_added}
                        date_closed={auctionDetails.date_closed}
                        withText={1}
                        endText={"Time left" + ":"}
                        startText={"Live Auction Starts in" + ":"}
                      />
                    </span>
                  )}
                </div>

                <AppBar position="static" className="eventTabs">
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                  >
                    <Tab label="Overview" {...a11yProps(0)} />
                    <Tab label="Browse Items" {...a11yProps(1)} />
                    <Tab label="Donate" {...a11yProps(2)} />
                    {auctionDetails.stage_id > 0 ? (
                      <Tab label="Buy Tickets" {...a11yProps(3)} />
                    ) : (
                      ""
                    )}
                  </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                  <>
                    <div className="auctionViewBanner">
                      {auctionLots.length > 3 ? (
                        <div className="auctionMultipleBanner">
                          {auctionLots.slice(0, 3).map((data, index) => (
                            <LazyLoadImage
                              src={getImages_url_check(
                                data.avatar,
                                data.content_head1
                              )}
                              alt={data.title}
                              onError={(e) => noImageAvailable(e)}
                              effect="blur"
                              placeholderSrc="assets/svg/imageLoading.svg"
                              height="100%"
                              width="100%"
                            />
                          ))}
                        </div>
                      ) : (
                        <LazyLoadImage
                          src={getImages_url_check(
                            auctiondetails.avatar,
                            auctionDetails.img_flag
                          )}
                          alt={auctionDetails.title}
                          onError={(e) => noImageAvailable(e)}
                          effect="blur"
                          placeholderSrc="assets/svg/imageLoading.svg"
                          height="100%"
                          width="100%"
                        />
                      )}
                      {auctiondetails.auction_type === 1 ? (
                        <div className="liveAuctionTag">
                          LIVE{" "}
                          <span className="material-icons">visibility</span>
                          {Math.floor(Math.random() * (50 - 20) + 20)}
                        </div>
                      ) : (
                        <div className="timeAuctionTag">TIMED</div>
                      )}
                      {auctiondetails.auction_type === 1 && (
                        <div className="actnMs">
                          <div
                            className="bidsSection"
                            ref={createMessageBoxRef}
                          >
                            {messageBoxContent.length > 0
                              ? messageBoxContent
                                  .slice(0, 3)
                                  .map((messageObject, index) =>
                                    messageObject.type === "seller" ? (
                                      <div
                                        className="bidComment yellow"
                                        key={index}
                                      >
                                        {messageObject.message}
                                      </div>
                                    ) : (
                                      <div className="bidComment" key={index}>
                                        {messageObject.message}
                                      </div>
                                    )
                                  )
                              : ""}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="charityCnt">
                      <div className="charityLt">
                        <div className="eventDetails">
                          <h2 className="edTitle">Event Details</h2>
                          <div className="edInner">
                            <h4>Who:</h4>
                            <h5>
                              {capitalize(auctionSellerDtls.shipper_username)}
                            </h5>
                          </div>
                          <div className="edInner">
                            <h4>Where:</h4>
                            <h5>
                              {auctionDetails.city},{auctionDetails.state},
                              {auctionDetails.country}
                            </h5>
                          </div>
                          <div className="edInner">
                            <h4>Attire:</h4>
                            <h5>
                              {auctionDetails.custom_field_5
                                ? auctionDetails.custom_field_5
                                : "-"}
                            </h5>
                          </div>
                          <div className="edInner">
                            <h4>Starts:</h4>
                            <h5>
                              {moment
                                .utc(auctionDetails.date_added)
                                .local()
                                .format("ddd, MMMM DD, YYYY LT")}
                              <AddToCalendar data={auctionDetails} />
                            </h5>
                          </div>
                          <div className="edInner">
                            <h4>Ends:</h4>
                            <h5>
                              {moment
                                .utc(auctionDetails.date_closed)
                                .local()
                                .format("ddd, MMMM DD, YYYY LT")}
                            </h5>
                          </div>
                        </div>
                        <div className="auctionDetails mx-auto">
                          <div className="auctionDetailsflexWrap d-flex justify-content-between w-100">
                            <div className="w-100">
                              {auctionDetails.auction_type === 1 ? (
                                <div className="avRt">
                                  {Boolean(auctionRegistered) && (
                                    <PrimaryButton
                                      onClick={handleLiveAuctionClick}
                                      label="ENTER LIVE AUCTION"
                                    />
                                  )}
                                  {!Boolean(auctionRegistered) && (
                                    <>
                                      <SecondaryButton
                                        label="REGISTER FOR AUCTION"
                                        disabled={!isAuthenticated || regBtn}
                                        onClick={handleRegisterForAuctionClick}
                                        // disabled={regBtn}
                                      />
                                      <small>
                                        You'll have to register before you can
                                        place bids in this auction. This auction
                                        has already started, so you might want
                                        to hurry!
                                      </small>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <h5 className="auctionTypeTag timed w-100">
                                    <span className="material-icons-round">
                                      schedule
                                    </span>
                                    TIMED AUCTION
                                  </h5>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="donationThemeWrapper">
                          <div className="prgrsContainer ">
                            <div>
                              <div>
                                {donar_list?.donationamt ? (
                                  <h3>
                                    {currencyFormat(donar_list.donationamt)}
                                  </h3>
                                ) : (
                                  <h3>{currencyFormat()}</h3>
                                )}
                                <p>
                                  raised of{" "}
                                  <b>
                                    {currencyFormat(
                                      auctionDetails.expected_amount
                                    )}
                                  </b>{" "}
                                  goal
                                </p>
                              </div>
                              <div className="prgrsBrCntnr mb-3">
                                <div className="progress">
                                  {donar_list?.donationcnt2 ? (
                                    <div
                                      className="progress-bar"
                                      style={{
                                        width:
                                          donar_list.totpercentage.toString() +
                                          "%",
                                      }}
                                      role="progressbar"
                                      aria-valuenow="50"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="stsCntnr d-flex align-items-center justify-content-between">
                                  <p className="m-0">
                                    {donar_list?.donationcnt2 ? (
                                      <>
                                        <span>{donar_list.donationcnt2}</span>
                                        {parseInt(donar_list.donationcnt2) == 1
                                          ? "supporter"
                                          : "supporters"}
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                  </p>
                                  {donar_list.total_days ? (
                                    <p className="m-0">
                                      <span>{donar_list.total_days}</span>{" "}
                                      {donar_list.total_days == 1
                                        ? "day left"
                                        : "days left"}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <div>
                                {parseInt(auctionDetails.charity_type) == 1 &&
                                auctionDetails.market_status == "open" ? (
                                  <div>
                                    <PrimaryButton
                                      btnSize=""
                                      onClick={(e) => {
                                        if (isAuthenticated) {
                                          handleChange(e, 2);
                                        } else {
                                          handleRedirectInternal(
                                            router,
                                            "login"
                                          );
                                        }
                                      }}
                                      label={
                                        <>
                                          <span class="material-icons mr-3">
                                            volunteer_activism
                                          </span>{" "}
                                          Make a donation
                                        </>
                                      }
                                    />
                                    {/* <p className="mt-2 mb-2 text-center">
                                  Expected Amount:
                                  {currencyFormat(
                                    auctionDetails.expected_amount
                                  )}
                                </p> */}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="dnrList">
                            <div className="hdrCntnr d-flex align-items-center justify-content-between">
                              <h5>
                                <span className="material-icons mr-2">
                                  favorite_border
                                </span>
                                Recent Donors
                              </h5>
                              {donar_list?.donationlist?.length > 0 ? (
                                <Button
                                  className="shlAlBtn m-0"
                                  onClick={(e) => {
                                    setPopupopen(true);
                                  }}
                                >
                                  Show all
                                </Button>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="dnrDtlCntnr">
                              {donar_list?.donationlist?.length > 0 ? (
                                <>
                                  {donar_list.donationlist.map((data) => (
                                    <div className="dnrCntnr d-flex align-items-center justify-content-between">
                                      <h5>
                                        <span className="material-icons mr-3">
                                          account_circle
                                        </span>
                                        {data.first_name + " " + data.last_name}
                                      </h5>
                                      <p className="amtVl m-0">
                                        {currencyFormat(data.total_amount)}
                                      </p>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <div>
                                  <p>{"No details found!"}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="charityRt">
                        <h3 className="crTitle">
                          {capitalize(auctionDetails.title)}
                        </h3>

                        <p
                          className="liveAuctionDesc"
                          dangerouslySetInnerHTML={{
                            __html: auctionDetails.description,
                          }}
                        ></p>
                      </div>
                    </div>
                  </>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <>
                    <div className="auctionLots ">
                      <h3 className="alTitle">Lots from this auction</h3>
                      <div className="lotAuctionlist d-flex align-items-center justify-content-between">
                        <div className="form-inline auctionSearchForm">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Search by title within this auction"
                            aria-label="Search"
                            value={lotCustomSearch.customSearchText}
                            onChange={handleSearchTextChange}
                            name="customSearchText"
                          />
                          {lotCustomSearch.customSearchText.length > 0 ? (
                            <span onClick={clearAuctionLotSearch}>
                              <CloseIcon />
                            </span>
                          ) : null}
                          <Button className="btn" onClick={searchAuctionLot}>
                            <span className="material-icons">search</span>
                          </Button>
                        </div>
                        <div className="auctionMiscFilters w-100 d-flex justify-content-end align-items-end">
                          {!isMobile && (
                            <div className="gridListToggle">
                              <Button
                                className={
                                  auctionView === "Grid" ? "active" : ""
                                }
                                onClick={() => {
                                  setAuctionView("Grid");
                                  auctionViewType("grid");
                                }}
                              >
                                <span className="material-icons">apps</span>
                              </Button>
                              <Button
                                className={
                                  auctionView === "List" ? "active" : ""
                                }
                                onClick={() => {
                                  setAuctionView("List");
                                  auctionViewType("list");
                                }}
                              >
                                <span className="material-icons">
                                  view_list
                                </span>
                              </Button>
                            </div>
                          )}
                          <div className="mr-2">
                            <CustomSelect
                              label="Results per page"
                              name="perPage"
                              selectType="noBorder"
                              value={lotCustomSearch.perPage}
                              size="small"
                              onChange={customSearchSelection}
                            >
                              {perPage.map((opt, optindex) => (
                                <option value={opt.id}>{opt.value}</option>
                              ))}
                            </CustomSelect>
                          </div>
                          <CustomSelect
                            label="Sort by"
                            value={lotCustomSearch.sortBy}
                            size="small"
                            selectType="noBorder"
                            name="sortBy"
                            //   shrink={search.orderby !== "" ? true : false}
                            onChange={customSearchSelection}
                          >
                            {sortBy.map((opt, optindex) => (
                              <option value={opt.id}>{opt.name}</option>
                            ))}
                          </CustomSelect>
                        </div>
                      </div>

                      {totalAuctionLots > Number(lotCustomSearch.perPage) ? (
                        <div className="d-flex justify-content-end align-items-center flex-wrap w-100 my-3 pagination-wrapper">
                          <Pagination
                            count={Math.ceil(
                              Number(totalAuctionLots) /
                                Number(lotCustomSearch.perPage)
                            )}
                            page={page}
                            onChange={onHandlePage}
                            siblingCount={3}
                            showFirstButton
                            showLastButton
                            boundaryCount={2}
                          />
                        </div>
                      ) : null}
                      {auctionLots.length > 0 ? (
                        <>
                          <div className={`searchResults pb-4 ${auctionView}`}>
                            {auctionLots.map((data, index) => (
                              <>
                                {auctionView === "Grid" ? (
                                  <>
                                    <GridView
                                      data={data}
                                      auctionDetails={auctionDetails}
                                      favId={`searchProd_${index}`}
                                      drawerHandler={toggleDrawer(
                                        "right",
                                        true,
                                        data
                                      )}
                                      updateData={() =>
                                        state.right &&
                                        router.pathname === "/auctionView"
                                          ? handleDrawerOpenLot(data, true)
                                          : searchAuctionLot(true)
                                      }
                                      listOfCards={savedCards}
                                      setViewAddCredit={setViewAddCredit}
                                      noTimer={
                                        auctionDetails.auction_type === 1 &&
                                        new Date(data.date_added) < new Date()
                                          ? true
                                          : false
                                      }
                                      auctionType={
                                        auctionDetails.auction_type === 1
                                          ? "live"
                                          : "timed"
                                      }
                                    />
                                  </>
                                ) : (
                                  <>
                                    <ListView
                                      auctionDetails={auctionDetails}
                                      data={data}
                                      favId={`searchProd_${index}`}
                                      drawerHandler={toggleDrawer(
                                        "right",
                                        true,
                                        data
                                      )}
                                      updateData={() =>
                                        state.right &&
                                        router.pathname === "/auctionView"
                                          ? handleDrawerOpenLot(data, true)
                                          : searchAuctionLot(true)
                                      }
                                      listOfCards={savedCards}
                                      setViewAddCredit={setViewAddCredit}
                                      noTimer={
                                        auctionDetails.auction_type === 1 &&
                                        new Date(data.date_added) <= new Date()
                                          ? true
                                          : false
                                      }
                                      auctionType={
                                        auctionDetails.auction_type === 1
                                          ? "live"
                                          : "timed"
                                      }
                                    />
                                  </>
                                )}
                              </>
                            ))}
                          </div>

                          {totalAuctionLots >
                          Number(lotCustomSearch.perPage) ? (
                            <div className="d-flex justify-content-end align-items-center flex-wrap w-100 my-3 pagination-wrapper">
                              <Pagination
                                count={Math.ceil(
                                  Number(totalAuctionLots) /
                                    Number(lotCustomSearch.perPage)
                                )}
                                page={page}
                                onChange={onHandlePage}
                                siblingCount={3}
                                showFirstButton
                                showLastButton
                                boundaryCount={2}
                              />
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <NoRecordsFound />
                      )}
                    </div>
                  </>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <div className="donationPageWrapper">
                    <form
                      className="donationFormWrapper"
                      onSubmit={addressFormik.handleSubmit}
                    >
                      <h3 className="pyhdrTtle">1. Select A Donation Amount</h3>
                      {currentDon === "donAmount" && (
                        <div className="row">
                          {Object.values(mapData(amountDetails))}
                          <div className="col-md-3">
                            <PrimaryButton
                              disabled={
                                addressFormik.values.amount != "" ? false : true
                              }
                              label="Continue"
                              onClick={() => setCurrentDon("donInfo")}
                            />
                          </div>
                        </div>
                      )}
                      {currentDon != "donAmount" &&
                        addressFormik.values.amount != "" && (
                          <>
                            <div className="fnlDntnInfo">
                              <div className="d-flex align-items-center justify-content-between">
                                {capitalize(auctionDetails.title)}
                                <p className="donAmountVle">
                                  {currencyFormat(addressFormik.values.amount)}
                                </p>
                              </div>
                              <div className="ttlAmountWrpr d-flex align-items-center justify-content-between mt-4">
                                <SecondaryButton
                                  onClick={() => setCurrentDon("donAmount")}
                                  label="Edit Donation"
                                  btnSize="small"
                                />
                                <div className="d-flex align-items-center">
                                  <label>Total:</label>
                                  <p className="donAmountVle">
                                    {currencyFormat(
                                      addressFormik.values.amount
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      <h3 className="pyhdrTtle">2. Your Information</h3>
                      {currentDon === "donInfo" && (
                        <>
                          <div className="row">
                            {Object.values(mapData(addressDetails))}
                            <div className="col-md-9"></div>
                            <div className="col-md-3 mb-4">
                              <PrimaryButton
                                // disabled={
                                //   !(
                                //     addressFormik.isValid && addressFormik.dirty
                                //   )
                                // }
                                label="Continue"
                                onClick={() => addressFormik.handleSubmit()}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {currentDon != "donInfo" &&
                        currentDon != "donAmount" &&
                        addressFormik.values.first_name != "" &&
                        addressFormik.values.last_name != "" &&
                        addressFormik.values.email != "" &&
                        addressFormik.values.phone != "" &&
                        addressFormik.values.amount != "" && (
                          <>
                            <div className="fnlDntnInfo">
                              <h4 className="usrNameVale">
                                {addressFormik.values.first_name +
                                  " " +
                                  addressFormik.values.last_name}
                              </h4>
                              <div className="usrCntctInfo d-flex align-items-center justify-content-start mt-4">
                                <p className="mr-4">
                                  <span className="material-icons">mail</span>
                                  {addressFormik.values.email}
                                </p>

                                <p>
                                  <span className="material-icons">phone</span>
                                  {addressFormik.values.phone}
                                </p>
                              </div>
                            </div>
                            <div className="ttlAmountWrpr d-flex align-items-center justify-content-between mt-4">
                              <SecondaryButton
                                onClick={() => setCurrentDon("donInfo")}
                                label="Edit Information"
                                btnSize="small"
                              />
                            </div>
                          </>
                        )}
                      <h3 className="pyhdrTtle">3. Payment</h3>
                      {currentDon === "donPay" && (
                        <div className="paymWrpr">
                          {carddetails.length > 0 ? (
                            <div className="row">
                              <div className="col-4">
                                Use Existing Card details
                              </div>
                              <div className="col-8">
                                <CustomSelect
                                  label={"Card Details"}
                                  value={selected_card}
                                  onChange={(e) =>
                                    setSelectedCard(e.target.value)
                                  }
                                >
                                  <option value="">{"Select Card"}</option>
                                  {carddetails.map((val) => (
                                    <option value={val.id}>
                                      {"XXXX XXXX XXXX XXXX " + val.last4}
                                    </option>
                                  ))}
                                </CustomSelect>
                              </div>
                              {selected_card == "" ? <p>OR</p> : ""}
                            </div>
                          ) : (
                            ""
                          )}
                          {selected_card == "" ? (
                            <div className="row">
                              {Object.values(mapData(paymentdetails))}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                      <PrimaryButton
                        disabled={donar_loading ? true : false}
                        label="Save"
                        type="submit"
                      />
                    </form>
                  </div>
                </TabPanel>

                <TabPanel value={value} index={3}>
                  Buy Tickets
                </TabPanel>

                <Drawer
                  className="rightDrawer productViewDrawer"
                  anchor={"right"}
                  open={state["right"]}
                  onClose={toggleDrawer("right", false)}
                >
                  {lot_details && Object.keys(lot_details).length !== 0 ? (
                    <ProductViewSlider
                      lotDetails={lot_details}
                      auctionDetails={auctionDetails}
                      handleClose={toggleDrawer("right", false)}
                    />
                  ) : null}
                </Drawer>
                <Popup
                  open={viewAddCredit}
                  modaltitle="Add Card Details"
                  size="sm"
                  handleClose={() => {
                    setViewAddCredit(false);
                  }}
                >
                  <AddCreditCard
                    getSavedCards={getAllSavedCards}
                    setViewAddCredit={setViewAddCredit}
                  />
                </Popup>
              </>
            </div>
          ) : null}
        </>
      )}
      <DonorHistory popup={popup_open} setPopup={setPopupopen} />
      {/* <Popup
        open={isPopupOpen}
        size="md"
        handleClose={() => {
          setIsPopupOpen(false);
        }}
        modaltitle={"Donation Information"}
      >
        <form onSubmit={addressFormik.handleSubmit}>
          <div className="row">{Object.values(mapData(addressDetails))}</div>
          Payment
          {carddetails.length > 0 ? (
            <div className="row">
              <div className="col-4">Use Existing Card details</div>
              <div className="col-8">
                <CustomSelect
                  label={"Card Details"}
                  value={selected_card}
                  onChange={(e) => setSelectedCard(e.target.value)}
                >
                  <option value="">{"Select Card"}</option>
                  {carddetails.map((val) => (
                    <option value={val.id}>
                      {"XXXX XXXX XXXX XXXX " + val.last4}
                    </option>
                  ))}
                </CustomSelect>
              </div>
              {selected_card == "" ? <p>OR</p> : ""}
            </div>
          ) : (
            ""
          )}
          {selected_card == "" ? (
            <div className="row">{Object.values(mapData(paymentdetails))}</div>
          ) : (
            ""
          )}
          <PrimaryButton
            disabled={donar_loading ? true : false}
            label="Save"
            type="submit"
          />
        </form>
      </Popup> */}
    </div>
  );
}

export default EventView;
