import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useReducer,
} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Timer from "@/common/timer";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Chip, LinearProgress, Button } from "@mui/material";
import { capitalize, currencyFormat } from "@/common/components";
import BiddingItem from "@/components/molecules/Bidding/BiddingItem";
import { useMediaQuery } from "react-responsive";
import makeStyles from '@mui/styles/makeStyles';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "react-photoswipe/lib/photoswipe.css";
import AuctionContext from "@/context/auction/auctionContext";
import ProductContext from "@/context/product/productContext";
import AuthContext from "@/context/auth/authContext";
import AlertContext from "@/context/alert/alertContext";
import UserContext from "@/context/user/userContext";
import Tooltip from "@mui/material/Tooltip";
import AddCreditCard from "@/components/organisms/AddCreditCard";
import { handleRedirectInternal, noImageAvailable } from "@/common/components";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Popup from "@/components/organisms/Popup";
import PrimaryButton from "@/components/atoms/PrimaryButton";

import ReactPlayer from "react-player/lazy";
import { socket, socketForward } from "@/common/socket";
import Slider from "react-slick";
import Loaders from "@/components/molecules/Loaders";
import productReducer from "@/context/product/productReducer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PreBidComponent from "@/components/molecules/PreBidComponent";
import { useRouter } from "next/router";

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
      {value === index && <div className="tabBody">{children}</div>}
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

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

// function SampleNextArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <button type='button' class='slick-next pull-left' onClick={onClick}>
//       <span class='material-icons'>chevron_right</span>
//     </button>
//   );
// }

// function SamplePrevArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <button type='button' class='slick-prev pull-right' onClick={onClick}>
//       <span class='material-icons'>chevron_left</span>
//     </button>
//   );
// }

function LiveLots(props) {
  const router = useRouter();
  const search = router.query.search;
  const [auction, setAuction] = useState({});
  const [lotDetails, setLotDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentLotIndex, setCurrentLotIndex] = useState(0);
  const [currentLotImages, setCurrentLotImages] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [savedCards, setSavedCards] = useState([]);
  const [viewAddCredit, setViewAddCredit] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [showTimer, setTimer] = useState(true);
  const [liveCountValue, setLiveCountValue] = useState(0);
  const [bidUpdate, setbidUpdate] = useState("");
  const [bidSocketData, setBidSocketData] = useState("");
  const [closedLot, setClosedLot] = useState(null);
  const [cancelBid, setCancelBid] = useState("");
  const [reload, setReload] = useState(false);
  const [timerView, setTimerView] = useState(true);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 3,
    // prevArrow: <SamplePrevArrow />,
    // nextArrow: <SampleNextArrow />,
  };
  const { user } = useContext(AuthContext);

  // const createMessageBoxRef = useCallback((node) => {
  //   if (node !== null) {
  //     console.log('set message box element socket update', node);
  //     setMessageBoxElement(node);
  //   }
  // });

  const {
    getAuctionDetails,
    auctiondetails,
    getAllAuctionMessages,
    allmessages,
    auctionRegisteredList,
    auctionPercentage,
    auctionPercent,
  } = useContext(AuctionContext);
  const productContext = useContext(ProductContext);
  const { addSavedSearch, getStripeCard } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  const [allauctionlots, setAllAuctionLots] = useState([]);

  const {
    getIndividualProductLotDetails,
    lot_details,
    getAllBidHistory,
    search_allbidhistory,
    getAllLots,
    allLotsData,
  } = productContext;

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
  // console.log(
  //   currentLotIndex,
  //   allauctionlots[currentLotIndex]?.id,
  //   allauctionlots,
  //   'allauctionlots[currentLotIndex].id'
  // );
  useEffect(() => {
    if (
      allLotsData &&
      allLotsData.results &&
      Array.isArray(allLotsData.results) &&
      allLotsData.results.length !== 0
    ) {
      var auction_details = allLotsData.auctionList;
      auction_details.isRegistered = allLotsData.isRegistered;
      auction_details.currentProjectId = allLotsData.current_projectid;
      // setAllAuctionLots(auction_details);
      setAuction(auction_details);
    }
  }, [allLotsData]);

  useEffect(() => {
    if (user && Object.keys(user).length) getAllSavedCards();
  }, [user]);

  useEffect(() => {
    let auctionId = router?.query.auctionId;
    // console.log("auctionid props.match.params.auction", auctionId);
    // if (auctionId) {
    getAllLots({
      limit: 1000,
      orserby: 2,
      page: 1,
      lotof: auctionId,
      order: 1,
      userid: router?.query.userId,
      is_auctionio: 1,
    });
    getAllAuctionMessages({
      auctionid: auctionId,
    });
    auctionPercentage({ auctionid: auctionId });
    // } else {
    //   handleRedirectInternal(router, "auctions");
    // }
  }, [router?.query.auctionId]);

  useEffect(() => {
    if (allLotsData && Object.keys(allLotsData).length > 0) {
      let auctionDtsNew = { ...allLotsData };
      if (auctionRegisteredList.length > 0) {
        if (auctionRegisteredList[0].status === "active") {
          auctionDtsNew.is_register_active = 0;
        } else {
          auctionDtsNew.is_register_active = 1;
        }
      } else {
        auctionDtsNew.is_register_active = 1;
      }
      setAuction(auctionDtsNew);
    }
    // else {
    //   router.goBack();
    //   setAlert('Auction Id does not exist', 'warning');
    // }
  }, [auctiondetails]);

  useEffect(() => {
    getIndividualProductLotDetails({
      lotId: router?.query.lotId,
      user_id: router?.query.userId,
      is_auctionio: 1,
    });
  }, [router?.query.lotId]);

  useEffect(() => {
    if (allLotsData?.results?.length) {
      let myArray = allLotsData.results;
      let index = myArray.findIndex(
        (element) => parseInt(element.id) === parseInt(router?.query.lotId)
      );
      // console.log("currentLotIndex----------------- foundindex value", index);
      if (index > -1) {
        setCurrentLotIndex(index);
      }
    }
  }, [allLotsData?.results]);

  useEffect(() => {
    socket.on("liveauctionclose", (data) => {
      // console.log(
      //   "Inside Auction Close in livelotpage",
      //   data,
      //   data.auctionid,
      //   router?.query.auctionId
      // );
      if (parseInt(data.auctionid) === parseInt(router?.query.auctionId)) {
        // console.log("Inside This Auction Close");
        setTimer(false);
        Swal.fire({
          icon: "success",
          title: "This Auction Has Been Ended By Seller Now.",
          showConfirmButton: true,
          position: "center",
        }).then(function (data) {
          if (data.isConfirmed) {
            return router.push("/search");
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    socket.on("bidderapproval", (data) => {
      // console.log("bidders approval socket data", data);
      setbidUpdate(data);
    });
  }, []);

  useEffect(() => {
    socket.on("liveauctionAwarding", (data) => {
      // console.log("closed auction emit", data);
      setClosedLot(data);
    });

    socket.on("cancelbidemitted", (data) => {
      // console.log("cancel bid emitted data", data);
      setCancelBid(data);
    });
  }, []);

  useEffect(() => {
    if (cancelBid) {
      // console.log(
      //   "cancel bid update values",
      //   lotDetails,
      //   cancelBid,
      //   cancelBid.prodata
      // );
      if (
        cancelBid &&
        cancelBid.prodata &&
        Object.keys(cancelBid.prodata).length > 0 &&
        lotDetails &&
        Object.keys(lotDetails).length > 0
      ) {
        let newLot = lotDetails;

        // console.log(
        //   "current id vs new lot id",
        //   cancelBid.id,
        //   newLot.lotDetails.id
        // );

        if (parseInt(cancelBid.project_id) === parseInt(newLot.lotDetails.id)) {
          newLot.lotDetails.bidcnt = cancelBid.bpop_bidcount;
          newLot.lotDetails.wprice = cancelBid.bpop_wprice;
          newLot.current_bid = cancelBid.prodata.proposed_amount;
          newLot.next_bid = cancelBid.prodata.currentbid_increment;
        }
        setLotDetails(newLot);
        // dispatch(auctionMsgDetails({ auctionid: auction.id }))
      }
    }
  }, [cancelBid]);

  useEffect(() => {
    // console.log("closedLot useEffec -------- >", closedLot);
    if (closedLot) {
      // console.log(
      //   "closedLot allauctionlotsnew ===",
      //   allLotsData.results[currentLotIndex + 1],
      //   allLotsData.results.length > 1
      // );
      if (allLotsData.results[currentLotIndex + 1] !== undefined) {
        if (
          parseInt(closedLot.lotid) ===
          parseInt(allLotsData.results[currentLotIndex]?.id)
        ) {
          handleRedirectInternal(
            router,
            `lotView/${router?.query.auctionId}/${
              allLotsData.results[currentLotIndex + 1]?.id
            }/${router?.query.userId}`
          );
        }
        // console.log(
        //   "closedLot new auction data before value set",
        //   auction,
        //   closedLot.lotid,
        //   allLotsData.results[currentLotIndex]?.id
        // );
        let newAuction = auction;
        newAuction.currentProjectId = closedLot.next_lot;
        // console.log(
        //   "closedLot new Auction Data after data set",
        //   newAuction,
        //   auction,
        //   allLotsData.results[currentLotIndex + 1]?.id,
        //   closedLot.next_lot
        // );
        setAuction(newAuction);
        setClosedLot(null);
      } else {
        Swal.fire({
          icon: "success",
          title: "This Auction Has Been Closed.",
          showConfirmButton: true,
          position: "center",
        }).then(function (data) {
          if (data.isConfirmed) {
            return router.push("/auctions?title=&catgId=");
          }
        });
      }
    }
  }, [closedLot]);

  useEffect(() => {
    updateRegisterStatus(bidUpdate);
  }, [bidUpdate]);

  const updateRegisterStatus = (data) => {
    if (
      auction &&
      auction.id &&
      props.userDetails?.userdetails?.id &&
      data.auction_obj
    ) {
      let match_user = data.auction_obj.filter(
        (ele) => ele.user_id == user?.id
      );
      // console.log("match_user", match_user);
      let match_auction = [];
      if (match_user.length > 0) {
        match_auction = match_user.filter(
          (ele) => ele.auction_id == auction.id
        );
      }
      // console.log("match_auction", match_auction);
      if (match_auction.length > 0) {
        if (data.status === "active") {
          auction.is_register_active = 0;
          setAuction(auction);
        } else {
          auction.is_register_active = 1;
          setAuction(auction);
        }
      }
    }
  };

  // useEffect(() => {
  //   console.log('get individual product details allauctionlots');
  //   if (allLotsData && allLotsData.results.length > 0) {
  //     getIndividualProductLotDetails({
  //       lotId: allLotsData.results[currentLotIndex]?.id,
  //       user_id: user && user.id ? user.id : '',
  //     });
  //   }
  //   console.log(allauctionlots, 'allauctionlots');
  // }, [allLotsData, currentLotIndex]);

  useEffect(() => {
    if (Object.keys(lot_details).length > 0) {
      setIsLoading(false);
      setLotDetails(lot_details);
      let lotimages = [];
      if (lot_details.images.length > 0) {
        lot_details.images.map((imgObj) =>
          lotimages.push({
            original: global.images_url + imgObj.file_name,
            thumbnail: global.images_url + imgObj.file_name,
          })
        );
      }
      setCurrentLotImages(lotimages.reverse());
    }
  }, [lot_details]);

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
    // socket.on('bidoffers', (data) => {
    //   console.log('bid offers submitted socket data', data);
    //   if (
    //     data &&
    //     Object.keys(data).length > 0 &&
    //     lotDetails &&
    //     Object.keys(lotDetails).length > 0
    //   ) {
    //     let newLot = lotDetails;
    //     if (data.lotid === newLot.lotDetails.id) {
    //       newLot.lotDetails.bidcnt = data.bids_offer[0].bidcnt;
    //       newLot.lotDetails.wprice = data.bids_offer[0].current_amount;
    //       newLot.current_bid = data.bids_offer[0].current_amount;
    //     }
    //     setLotDetails(newLot);
    //   }
    // });

    socket.on("bidAddtime", (data) => {
      // console.log(
      //   "bid placed emit socket check after bid-------------->",
      //   data
      // );
      setBidSocketData(data);
    });
  }, []);

  // console.log(
  //   "allauctionlots",
  //   allLotsData && allLotsData.results,
  //   lot_details
  // );

  useEffect(() => {
    // console.log("bid socket update response", bidSocketData, lotDetails);
    if (bidSocketData && lotDetails && Object.keys(lotDetails).length > 0) {
      let newLot = lotDetails;
      if (bidSocketData.status !== "failed") {
        if (parseInt(bidSocketData.id) === parseInt(newLot.lotDetails.id)) {
          // console.log(
          //   "entered if condition in update bid socket",
          //   newLot,
          //   bidSocketData
          // );
          newLot.lotDetails.bidcnt = bidSocketData.bpop_bidcount;
          newLot.lotDetails.wprice = bidSocketData.bpop_wprice;
          newLot.current_bid = bidSocketData.bpop_wprice;
          newLot.next_bid = bidSocketData.bpop_nextbid;
          newLot.highbid =
            bidSocketData.bpop_higher &&
            bidSocketData.bpop_higher == router?.query.user_id
              ? true
              : false;
        }
        setLotDetails(newLot);
        // console.log("updated lot data", newLot);
      }
    }
    setReload(!reload);
  }, [bidSocketData]);

  useEffect(() => {
    // console.log("function initiated", lotDetails, props.bidding);
    if (bidSocketData && lotDetails && Object.keys(lotDetails).length > 0) {
      let bidding = bidSocketData;
      if (lotDetails && Object.keys(lotDetails).length > 0) {
        // console.log(
        //   "props bidding ids socket id",
        //   bidding.id,
        //   lotDetails.lotDetails.id
        // );
        if (bidding.id == lotDetails.lotDetails.id) {
          const newLot = lotDetails;
          // console.log("product valuessssss-------------->2222", newLot);
          if (bidding.bpop_cbidder == user.id) {
            if (bidding.status == "failed") {
              bidding.error && setAlert(bidding.error);
            } else if (bidding.status == "success") {
              newLot.lotDetails.wprice = bidding.bpop_wprice;
              newLot.current_bid = bidding.bpop_wprice;
              if (bidding.bpop_higher == user.id) {
                newLot.next_bid =
                  bidding.bpop_cuser_nextbid || bidding.bpop_nextbid;
              } else {
                newLot.next_bid = bidding.bpop_nextbid_org;
              }
              newLot.lotDetails.bidcnt = bidding.bpop_bidcount;
              setLotDetails(newLot);
            }
          } else {
            if (bidding.status !== "failed") {
              if (
                newLot.userBidCount !== undefined &&
                newLot.userBidCount !== 0
              ) {
                if (bidding.bpop_higher != user.id) {
                  if (
                    Number(bidding.bpop_wprice) >=
                    Number(newLot.lotDetails.next_bid)
                  ) {
                    newLot.next_bid = bidding.bpop_nextbid_org;
                  }
                  newLot.lotDetails.wprice = bidding.bpop_wprice;
                  newLot.current_bid = bidding.bpop_wprice;
                  newLot.lotDetails.bidcnt = bidding.bpop_bidcount;
                  setLotDetails(newLot);
                } else {
                  newLot.lotDetails.wprice = bidding.bpop_wprice;
                  if (bidding.bpop_higher == user.id) {
                    newLot.next_bid =
                      bidding.bpop_wprice_morehigh +
                      (bidding.bpop_wprice_morehigh_increment ||
                        bidding.bpop_increment);
                  } else {
                    newLot.next_bid = bidding.bpop_nextbid_org;
                  }
                  newLot.lotDetails.bidcnt = bidding.bpop_bidcount;
                  newLot.current_bid = bidding.bpop_wprice;
                  setLotDetails(newLot);
                }
              } else {
                if (bidding.bpop_higher == user.id) {
                  newLot.next_bid =
                    bidding.bpop_wprice_morehigh +
                    (bidding.bpop_wprice_morehigh_increment ||
                      bidding.bpop_increment);
                } else {
                  newLot.next_bid = bidding.bpop_nextbid_org;
                }
                newLot.lotDetails.wprice = bidding.bpop_wprice;
                newLot.current_bid = bidding.bpop_wprice;
                newLot.lotDetails.bidcnt = bidding.bpop_bidcount;
                setLotDetails(newLot);
              }
            }
          }
        }
      }
    }
  }, [bidSocketData]);

  useEffect(() => {
    socket.on("liveView", (data) => {
      // console.log("live count emitted values", data);
      setLiveCountValue(data);
    });
  }, []);

  useEffect(() => {
    if (auction && !!Object.keys(auction).length)
      getAllAuctionMessages({
        auctionid: auction.id,
      });
  }, []);

  useEffect(() => {
    socket.on("liveAuctionMsg", (data) => {
      setNewMsg(data);
    });
  }, []);

  const scrollToBottom = (element) => {
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  const handleLotChangeClick = (e, type) => {
    if (type === "next") {
      if (currentLotIndex < allLotsData?.results.length - 1) {
        setCurrentLotIndex(currentLotIndex + 1);
        // let currentLotInd = currentLotIndex + 1;
        // let nextSetLot = allauctionlots.slice(currentLotInd);
      }
    }
    if (type === "prev") {
      if (currentLotIndex > 0) {
        setCurrentLotIndex(currentLotIndex - 1);
      }
    }
  };

  const handleLotImageClick = (e, index) => {
    if (currentLotIndex !== index) {
      setCurrentLotIndex(index);
    }
  };

  useEffect(() => {
    if (
      allLotsData?.results?.length &&
      currentLotIndex !== "" &&
      currentLotIndex !== undefined
    ) {
      // console.log(
      //   "currentLotIndex----------------->outside if",
      //   currentLotIndex,
      //   allLotsData.results[currentLotIndex]?.id
      // );
      if (allLotsData.results[currentLotIndex]?.id != router?.query.lotId) {
        // console.log(
        //   "currentLotIndex----------------->currentlotid and params id are not same",
        //   currentLotIndex,
        //   allLotsData.results[currentLotIndex]?.id
        // );
        handleRedirectInternal(
          router,
          `lotView/${router?.query.auctionId}/${allLotsData.results[currentLotIndex]?.id}/${router?.query.userId}`
        );
      }
    }
  }, [currentLotIndex]);

  const isMobile = useMediaQuery({
    query: "(max-width: 600px)",
  });
  const [isOpen, setOpen] = useState(false);
  const classes = useStyles();

  const productDetails = [
    {
      title: "Description",
      description: lotDetails?.lotDetails?.description,
    },
    {
      title: "Shipping",
      description: auction.store_comment_two,
    },
    {
      title: "Conditions",
      description: auction.store_comment_four,
    },
    {
      title: "Auction notes",
      description: auction.store_comment_one + auction.store_comment_five,
    },
  ];

  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // useEffect(() => {
  //   if (auction.id) {
  //     init();
  //   }
  // }, [auction]);

  const config = {
    iceServers: [
      {
        urls: "turn:100.20.224.224:3478",
        credential: "Aucsoft@!",
        username: "AsUser",
      },
    ],
  };

  let [uri, setUri] = useState([]);

  let peerConnection;
  const videoRef = useRef();

  useEffect(() => {
    socket.on("offer", (id, description) => {
      // console.log("Offer", id);
      peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answer", id, peerConnection.localDescription);
        });
      peerConnection.ontrack = (event) => {
        // console.log(event.streams[0]);
        setUri(event.streams[0]);
      };
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    });
  }, []);

  useEffect(() => {
    socket.on("candidate", (id, candidate) => {
      // console.log("peerConnection", peerConnection);
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });
  }, []);

  // useEffect(() => {
  //   return () => {
  //     socket.emit('watcher-disconnect', localStorage.getItem('broadcasterID'));
  //     if (peerConnection) {
  //       peerConnection.close();
  //     }
  //     reInitializeSocket();
  //   };
  // }, []);

  useEffect(() => {
    socket.on("disconnectPeer", () => {
      peerConnection.close();
    });
  }, [socket]);

  // useEffect(() => {
  //   window.onunload = window.onbeforeunload = () => {
  //     socket.emit('watcher-disconnect', localStorage.getItem('broadcasterID'));
  //     if (peerConnection) {
  //       peerConnection.close();
  //     }
  //     reInitializeSocket();
  //   };
  // }, [window]);

  const tooltipLotdtls = (lot) => {
    return (
      <div className="toolTopInfo">
        <img
          src={global.images_url + lot.avatar}
          alt="Next Lot"
          onClick={(e) => handleLotImageClick(e)}
          onError={noImageAvailable}
        />
        <p>
          Lot Name :{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: lot.title,
            }}
          ></span>
        </p>
        <p>Current Price : US ${lot.wprice}</p>
      </div>
    );
  };

  const timerShow = () => {
    // console.log("date if condition check");
    if (
      lotDetails &&
      lotDetails.lotDetails &&
      new Date() >= new Date(lotDetails.lotDetails.date_added)
    ) {
      // console.log("date if condition check inside if");
      setTimerView(false);
      clearInterval(timerInterval);
    }
  };

  const timerInterval = setInterval(timerShow, 1000);

  return (
    <>
      {isLoading ? (
        <div className="liveLotsLoader">
          <Loaders name="live_auction" isLoading={isLoading} />
        </div>
      ) : (
        <div className="liveLots customContainer">
          <div className="row lotMain">
            <div className="col-md-6 col-12 lotSection ">
              <div className="topShftNav mb-5">
                <a
                  href={`/auctionView?auctionId=${auction.id}&viewType=list&title=${auction.title}`}
                  className="vwActnBtn d-flex align-items-center mr-auto"
                >
                  <span className="material-icons">chevron_left</span> View
                  Auction
                </a>
              </div>
              <div className="d-flex">
                <div className="currentLot">
                  <div className="imageSliderLive">
                    <ImageGallery
                      items={currentLotImages}
                      thumbnailPosition="bottom"
                      showNav={false}
                      showBullets={false}
                      showFullscreenButton={true}
                      showPlayButton={false}
                      lazyLoad={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="topShftNav d-flex align-items-center justify-content-between mb-5">
                <div className="prevLotShft">
                  {currentLotIndex === 0 ? (
                    ""
                  ) : (
                    <p
                      className="d-flex cursorDecoy align-items-center mb-0"
                      onClick={(e) => handleLotChangeClick(e, "prev")}
                    >
                      <span className="material-icons">chevron_left</span> Prev
                      Lot
                    </p>
                  )}
                </div>
                <div className="crntLtVe">Lot {lotDetails.lotDetails.sku}</div>
                <div className="rtLotShft">
                  {allLotsData &&
                  currentLotIndex === allLotsData.results.length - 1 ? (
                    ""
                  ) : (
                    <p
                      className="d-flex cursorDecoy align-items-center mb-0"
                      onClick={(e) => handleLotChangeClick(e, "next")}
                    >
                      Next Lot{" "}
                      <span className="material-icons">chevron_right</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="lotDetails text-left">
                <h2
                  className="mb-2"
                  dangerouslySetInnerHTML={{
                    __html: lotDetails.lotDetails.title,
                  }}
                ></h2>
                <h6 className="autnTitle text-left mb-4">{auction.title}</h6>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2 mt-5">
                <p className="mb-0">
                  Estimate: {currencyFormat(lotDetails.lotDetails.lowest)} -
                  {currencyFormat(lotDetails.lotDetails.highest)}
                </p>
                <div>
                  {timerView && (
                    <Timer
                      date_added={lotDetails.lotDetails.date_added}
                      date_closed={lotDetails.lotDetails.date_closed}
                      timerBasic={true}
                      withText={1}
                    />
                  )}
                </div>
              </div>
              <div className="bidCnt">
                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="text-left">
                    {currencyFormat(lotDetails.current_bid)}
                  </h2>
                  {auction.con_check === 1 ? (
                    <p className="cursorDecoy">
                      {lotDetails.lotDetails.bidcnt} Bids
                    </p>
                  ) : (
                    <p
                      className="cursorDecoy"
                      // onClick={(e) => handleHistory(lotDetails.lotDetails.id)}
                    >
                      {lotDetails.lotDetails.bidcnt} Bids
                    </p>
                  )}
                </div>

                {/* {allLotsData &&
                  allLotsData.results.length &&
                  new Date() < new Date(lotDetails.lotDetails.date_closed) && (
                    <>
                      {new Date() <
                      new Date(lotDetails.lotDetails.date_added) ? (
                        <PreBidComponent
                          lotdetails={lotDetails}
                          type="proxy"
                          size="medium"
                          auctionId={auction.id}
                          user={user}
                          is_not_approved={auction.isRegistered}
                        />
                      ) : (
                        auction.currentProjectId !=
                          lotDetails.lotDetails.id && (
                          <PreBidComponent
                            lotdetails={lotDetails}
                            type="proxy"
                            size="medium"
                            auctionId={auction.id}
                            user={user}
                            is_not_approved={auction.isRegistered}
                          />
                        )
                      )}
                    </>
                  )} */}
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12 col-md-12">
              <div className={`${isMobile && "mobileView"} productDetails`}>
                {isMobile ? (
                  <div className="pvAccordian mt-2 mb-2 w-100">
                    {productDetails.map((data, index) => (
                      <Accordion
                        expanded={expanded === `panel${index}`}
                        onChange={handleExpand(`panel${index}`)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${index}a-content`}
                          id={`panel${index}a-header`}
                        >
                          <Typography className={classes.heading}>
                            {data.title}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: data.description.trim(),
                              }}
                            />
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                ) : (
                  <>
                    <AppBar position="static">
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="simple tabs example"
                      >
                        {productDetails.map((data, index) => (
                          <Tab label={data.title} {...a11yProps({ index })} />
                        ))}
                      </Tabs>
                    </AppBar>
                    {productDetails.map((data, index) => (
                      <TabPanel value={value} index={index}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: data.description,
                          }}
                        />
                      </TabPanel>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 lotSection upcomming-sliebar">
              <div className="upcomingLots mt-5">
                <h5 className="upcmgLtsTtle mb-4">OTHER LOTS</h5>
                <Slider {...settings}>
                  {allLotsData &&
                    allLotsData.results &&
                    allLotsData.results.length > 0 &&
                    allLotsData.results.map((lot, index) => (
                      <Button
                        className={`ucImg  ${
                          currentLotIndex === index ? "active-slide" : ""
                        }`}
                        key={index}
                      >
                        <Tooltip
                          placement="top"
                          title={tooltipLotdtls(lot)}
                          arrow
                        >
                          <LazyLoadImage
                            src={global.images_url + lot.avatar}
                            onError={(e) => noImageAvailable(e)}
                            effect="blur"
                            placeholderSrc="assets/svg/imageLoading.svg"
                            height="100%"
                            width="100%"
                            onClick={(e) => handleLotImageClick(e, index)}
                          />
                        </Tooltip>
                      </Button>
                    ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      )}
      <Popup
        open={viewAddCredit}
        size="sm"
        modaltitle="Add Card Details"
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
  );
}

export default LiveLots;
