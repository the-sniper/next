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
import { Chip, LinearProgress, Button } from "@material-ui/core";
import { capitalize, currencyFormat } from "@/common/components";
import BiddingItem from "@/components/molecules/Bidding/BiddingItem";
import { useMediaQuery } from "react-responsive";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import "react-photoswipe/lib/photoswipe.css";
import AuctionContext from "@/context/auction/auctionContext";
import ProductContext from "@/context/product/productContext";
import AuthContext from "@/context/auth/authContext";
import AlertContext from "@/context/alert/alertContext";
import UserContext from "@/context/user/userContext";
import Tooltip from "@material-ui/core/Tooltip";
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
import MessageBox from "./MessageBox";
import productReducer from "@/context/product/productReducer";
import { LazyLoadImage } from "react-lazy-load-image-component";
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
  const [messageBoxContent, setMessageBoxContent] = useState([]);
  const [currentLotIndex, setCurrentLotIndex] = useState(0);
  const [currentLotImages, setCurrentLotImages] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [messageBoxElement, setMessageBoxElement] = useState();
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
    allauctionlots,
    auctiondetails,
    getAllAuctionMessages,
    allmessages,
    auctionRegisteredList,
    auctionPercentage,
    auctionPercent,
    responseStatus: auctionResponse,
    clearResponse,
  } = useContext(AuctionContext);
  const {
    getIndividualProductLotDetails,
    lot_details,
    getAllBidHistory,
    search_allbidhistory,
  } = useContext(ProductContext);
  const { addSavedSearch, getStripeCard } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);

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
    if (user && Object.keys(user).length) getAllSavedCards();
  }, [user]);

  useEffect(() => {
    let auctionId = router?.query.auctionId;
    let userId = router?.query.uid;
    if (auctionId) {
      getAuctionDetails({
        title: "",
        auctionId: auctionId,
        userid: userId,
        page: "",
        perpage: "2000",
        auctionDate: "",
        orderby: 1,
        is_auctionio: 1,
      });
      getAllAuctionMessages({
        auctionid: auctionId,
      });
      auctionPercentage({ auctionid: auctionId });
    } else {
      handleRedirectInternal(router, "auctions");
    }
  }, [search]);

  useEffect(() => {
    if (Object.keys(auctiondetails).length > 0) {
      let auctionDtsNew = { ...auctiondetails };
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
  // console.log(auctiondetails, 'auction details');

  useEffect(() => {
    socket.on("liveauctionclose", (data) => {
      // console.log(
      //   'Inside Auction Close in livelotpage',
      //   data,
      //   data.auctionid,
      //   props.match.params.auctionId
      // );
      let auctionId = router?.query.auctionId;
      if (parseInt(data.auctionid) === parseInt(auctionId)) {
        // console.log('Inside This Auction Close');
        setTimer(false);
        Swal.fire({
          icon: "success",
          title: "This Auction Has Been Ended By Seller Now.",
          showConfirmButton: true,
          position: "center",
        }).then(function (data) {
          if (data.isConfirmed) {
            return router.push("/searchAuction");
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    socket.on("bidderapproval", (data) => {
      // console.log('bidders approval socket data', data);
      setbidUpdate(data);
    });
  }, []);

  useEffect(() => {
    socket.on("liveauctionAwarding", (data) => {
      // console.log('closed auction emit', data);
      setClosedLot(data);
    });

    socket.on("cancelbidemitted", (data) => {
      // console.log('cancel bid emitted data', data);
      setCancelBid(data);
    });
  }, []);

  useEffect(() => {
    if (cancelBid) {
      // console.log(
      //   'cancel bid update values',
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
        //   'current id vs new lot id',
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
    if (closedLot) {
      // console.log(
      //   'allauctionlotsnew ===',
      //   allauctionlots[1],
      //   allauctionlots.length > 1
      // );
      if (allauctionlots[1] !== undefined || allauctionlots.length > 1) {
        let userId = router?.query.uid;
        getIndividualProductLotDetails({
          lotId: allauctionlots[currentLotIndex + 1].id,
          user_id: userId,
          is_auctionio: 1,
        });
        setClosedLot(null);
        allauctionlots.splice(0, 1);
      } else {
        Swal.fire({
          icon: "success",
          title: "This Auction Has Been Closed.",
          showConfirmButton: true,
          position: "center",
        }).then(function (data) {
          if (data.isConfirmed) {
            return router.push("/searchAuction?auctionType=1&catgId=");
          }
        });
      }
    }
  }, [closedLot]);

  useEffect(() => {
    updateRegisterStatus(bidUpdate);
  }, [bidUpdate]);

  const updateRegisterStatus = (data) => {
    // console.log('bidder update status', data);
    if (data.status === "active") {
      if (auction && auction.id && data.auction_obj) {
        // console.log('bidder update status inside if', data);
        let match_user = data.auction_obj.filter(
          (ele) => ele.user_id == user?.id
        );
        // console.log('active match_user', match_user);
        let match_auction = [];
        if (match_user.length > 0) {
          match_auction = match_user.filter(
            (ele) => ele.auction_id == auction.id
          );
        }
        // console.log('match_auction', match_auction);
        if (match_auction.length > 0) {
          auction.is_register_active = 0;
          setAuction(auction);
          setReload(!reload);
        }
      }
    } else {
      if (data.status === "unverified") {
        let match_user = data.user_id.filter((ele) => ele == user?.id);
        let match_auction;
        if (match_user.length > 0) {
          match_auction = data.auction_id.filter((ele) => ele == auction.id);
          if (match_auction.length > 0) {
            // console.log(
            //   'bidder update status unverified match user',
            //   match_user
            // );
            auction.is_register_active = 1;
            setAuction(auction);
            setReload(!reload);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (allauctionlots?.length > 0) {
      let userId = router?.query.uid;
      getIndividualProductLotDetails({
        lotId: allauctionlots[currentLotIndex].id,
        user_id: userId,
        is_auctionio: 1,
      });
    }
    // else {
    //   router.goBack();
    //   setAlert('No Auction Lot Present', 'warning');
    // }
    // console.log(allauctionlots, 'allauctionlots');

    let completedLots = allauctionlots.filter(
      (auctionlot) => auctionlot.market_status === "closed"
    ).length;
    if (completedLots !== 0) {
      setCompletionPercentage((completedLots / allauctionlots.length) * 100);
    }
  }, [allauctionlots, currentLotIndex]);

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
    let dataToDisplay = [];
    if (allmessages && allmessages.length > 0) {
      dataToDisplay = allmessages;
      dataToDisplay.sort(compareByDate);
    }
    // console.log(dataToDisplay, 'this is data to display');
    setMessageBoxContent(dataToDisplay);
  }, [allmessages]);

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
      // console.log('bid placed emit socket check after bid', data);
      setBidSocketData(data);
    });
  }, []);

  useEffect(() => {
    // console.log('bid socket update response', bidSocketData, lotDetails);
    if (
      bidSocketData &&
      Object.keys(bidSocketData).length > 0 &&
      lotDetails &&
      Object.keys(lotDetails).length > 0
    ) {
      let newLot = lotDetails;
      if (bidSocketData.status !== "failed") {
        if (parseInt(bidSocketData.id) === parseInt(newLot.lotDetails.id)) {
          // console.log(
          //   'entered if condition in update bid socket',
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
        // console.log('updated lot data', newLot);
      }
    }
    setReload(!reload);
  }, [bidSocketData]);

  useEffect(() => {
    socket.on("liveView", (data) => {
      // console.log('live count emitted values', data);
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

  const scrollToBottom = (element) => {
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  const handleLotChangeClick = (e, type) => {
    if (type === "next") {
      if (currentLotIndex < allauctionlots.length - 1) {
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
      // console.log('Offer', id);
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
      // console.log('peerConnection', peerConnection);
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

  // async function DirectAPICAll(method, url, data) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const config = {
  //         headers: {
  //           authorization:
  //             'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE2LCJpYXQiOjE2MjcwNDAxNTUsImV4cCI6MTYyNzY0NDk1NX0.bE9l99te-OBpA93qyxHpxGRhs_8_oBeeJt3oLBlklBk',
  //         },
  //       };
  //       if (method === 'get') {
  //         let res = await axios.get(`${url}`);
  //         console.log('responsode from api', res);
  //         resolve(res);
  //       } else if (method === 'post') {
  //         if (data) {
  //           let res = await axios.post(`${url}`, data, config);
  //           resolve(res);
  //         } else {
  //           let res = await axios.post(`${url}`);
  //           resolve(res);
  //         }
  //       }
  //     } catch (err) {
  //       console.log('responsode error from api', err);
  //       resolve(err);
  //     }
  //   });
  // }

  // async function init() {
  //   const payload = {
  //     auctionid: auction.id,
  //   };

  //   const data = await DirectAPICAll(
  //     'post',
  //     `https://dpworldapi.auctionsoftware.com/api/video/newVideoStream`,
  //     payload
  //   );
  //   if (data?.data?.data?.responseData?.length) {
  //     localStorage.setItem(
  //       'broadcasterID',
  //       data.data.data.responseData[0].sender_stream
  //     );
  //     socket.emit('watcher', data.data.data.responseData[0].sender_stream);
  //   }
  // }

  useEffect(() => {
    if (auctionResponse) {
      if (auctionResponse.from === "liveLot") {
        if (auctionResponse.status === "error") {
          // console.log('clear response status', auctionResponse);
          setAlert("Auction Not Found", "warning");
          clearResponse();
          handleRedirectInternal(router, "auctions");
        }
      }
    }
  }, [auctionResponse]);

  return (
    <>
      {isLoading ? (
        <div className="liveLotsLoader">
          <Loaders name="live_auction" isLoading={isLoading} />
        </div>
      ) : (
        <div className="liveLots customContainer">
          <div className="lotHeader">
            <div className="d-flex justify-content-between align-items-center">
              <h4
                dangerouslySetInnerHTML={{
                  __html: auction.title,
                }}
              ></h4>
              {new Date() < new Date(auction.date_added) && (
                <div className="lotTimer">
                  <span>Starts In:</span>{" "}
                  <Timer
                    date_added={auction.date_added}
                    date_closed={auction.date_closed}
                  />
                </div>
              )}
            </div>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Chip
                  size="medium"
                  label={`Lot ${lotDetails.lotDetails.sku}`}
                />
                <div className="d-flex align-items-end justify-content-end">
                  <h3 className="mr-2">
                    {`${parseFloat(
                      (auctionPercent.close_count /
                        auctionPercent.total_count) *
                        100
                    ).toFixed()}% Completed`}{" "}
                  </h3>
                  <h5>{`${allauctionlots.length} of ${auction.total_lot} Lots Remaining`}</h5>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <h1
                  dangerouslySetInnerHTML={{
                    __html: lotDetails.lotDetails.title,
                  }}
                ></h1>
                <div className="d-flex justify-content-end">
                  <Chip
                    className="mr-2 estChip"
                    size="medium"
                    label={`EST: ${currencyFormat(
                      lotDetails.lotDetails.lowest
                    )} - ${currencyFormat(lotDetails.lotDetails.highest)}`}
                  />
                  <Chip
                    size="medium"
                    label={`Buyers Premium ${auction.buyer_premium}%`}
                  />
                </div>
              </div>
            </div>
          </div>
          <LinearProgress
            variant="determinate"
            value={(
              (auctionPercent.close_count / auctionPercent.total_count) *
              100
            ).toFixed()}
          />
          <div className="row lotMain">
            <div className="col-md-6 col-12 lotSection ">
              <div className="d-flex">
                <div className="currentLot">
                  <div className="lotStats">
                    <span className="liveAuctionTag">
                      LIVE <span className="material-icons">visibility</span>
                      {liveCountValue}
                    </span>
                  </div>
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
            <div className="col-md-3 col-12">
              <div className="bidCnt">
                <h2>{currencyFormat(lotDetails.current_bid)}</h2>

                {new Date() < new Date(auction.date_added) ? (
                  <div className="lvNtStBtn">
                    <PrimaryButton
                      label={
                        <span className="d-flex align-items-center">
                          <span>Live Auction Not Yet Started</span>
                        </span>
                      }
                      disabled={true}
                    />
                  </div>
                ) : (
                  allauctionlots &&
                  !!allauctionlots.length &&
                  !!Object.keys(lotDetails).length &&
                  allauctionlots[0].id === lotDetails.lotDetails.id && (
                    <BiddingItem
                      lotdetails={lotDetails}
                      type="hard"
                      size="medium"
                      auctionId={auction.id}
                      listOfCards={savedCards}
                      setViewAddCredit={setViewAddCredit}
                      liveLot={1}
                      auctionDtl={auction}
                      cancelBid={cancelBid}
                    />
                  )
                )}
              </div>
            </div>
            <div className="col-md-3 col-12">
              {new Date() >= new Date(auction.date_added) ? (
                <div className="bidsSection">
                  {messageBoxContent.length > 0 ? (
                    <MessageBox messageBoxContent={messageBoxContent} />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div className="noMsgFound">
                  <img src="/assets/images/emptyMessage.png" />
                  <p className="mt-3">No Messages Found</p>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 lotSection upcomming-sliebar">
              <div className="upcomingLots mt-5">
                <h5 className="upcmgLtsTtle">UPCOMING LOTS</h5>
                <div className="d-flex align-items-center lotChangeButton">
                  <Button
                    className="prevBtn"
                    onClick={(e) => handleLotChangeClick(e, "prev")}
                    disabled={currentLotIndex === 0 && true}
                  >
                    <span className="material-icons">chevron_left</span> Prev
                    Lots
                  </Button>
                  <Button
                    className="nextBtn"
                    onClick={(e) => handleLotChangeClick(e, "next")}
                    disabled={
                      currentLotIndex === allauctionlots.length - 1 && true
                    }
                  >
                    Next Lots{" "}
                    <span className="material-icons">chevron_right</span>
                  </Button>
                  {/* {currentLotIndex === allauctionlots.length - 1 ? null : (
                    
                  )}
                  {allauctionlots && allauctionlots.length > 9 ? (
                    
                  ) : null} */}
                </div>
                {/* <div className='ltImgGrdWrpr'>
                  {console.log('auctionlots', allauctionlots)}
                  {allauctionlots &&
                    allauctionlots.length > 0 &&
                    allauctionlots.map((lot, index) => (
                      <Button className='ucImg' key={index}>
                        <img
                          src={global.images_url + lot.avatar}
                          alt='Next Lot'
                          onClick={(e) => handleLotImageClick(e, index)}
                          onError={noImageAvailable}
                        />
                      </Button>
                    ))}
                </div> */}
                <Slider {...settings}>
                  {allauctionlots &&
                    allauctionlots.length > 0 &&
                    allauctionlots.map((lot, index) => (
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
                            {data.title === "Description" ? (
                              data.description
                            ) : (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: data.description.trim(),
                                }}
                              />
                            )}
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
                        {data.title === "Description" ? (
                          data.description
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: data.description,
                            }}
                          />
                        )}
                      </TabPanel>
                    ))}
                  </>
                )}
              </div>
            </div>
            {/* <div className="col-12 col-md-5">
              <div className="mapPlugin">Map plugin to be added here</div>
            </div> */}
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
