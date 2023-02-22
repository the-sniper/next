import React, { useContext, useState, useEffect, useRef } from "react";
import FilterPanel from "@/components/organisms/FilterPanel";
import { Button, Fade, Drawer } from "@material-ui/core";
import GridView from "@/components/molecules/ProductCard/GridView";
import ListView from "@/components/molecules/ProductCard/ListView";
import SearchField from "@/components/molecules/SearchField";
import ProductViewSlider from "@/components/organisms/ProductViewSlider";
import ProductContext from "@/context/product/productContext";
import CommonContext from "@/context/common/commonContext";
import AuthContext from "@/context/auth/authContext";
import UserContext from "@/context/user/userContext";
import AlertContext from "@/context/alert/alertContext";
import { handleRedirectInternal, mapData } from "@/common/components";
import BuyerContext from "@/context/buyer/buyerContext";
import { useFormik } from "formik";
import { Pagination } from "@material-ui/lab";
import { socket, socketForward } from "@/common/socket";
import Popup from "@/components/organisms/Popup";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { FormatItalicTwoTone } from "@material-ui/icons";
import moment from "moment";
import AddCreditCard from "@/components/organisms/AddCreditCard";
import { object } from "yup";
import Loaders from "@/components/molecules/Loaders";
import { useMediaQuery } from "react-responsive";
import { messageHandler } from "@/common/socketHandler";
import { useRouter } from "next/router.js";

function Search() {
  const [auctionView, setAuctionView] = useState("Grid");
  const [savedCards, setSavedCards] = useState([]);
  const router = useRouter();
  const { allCategory } = useContext(CommonContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const {
    getIndividualProductLotDetails,
    searchAllLots,
    allLots,
    lot_details,
  } = useContext(ProductContext);
  const { addSavedSearch, getStripeCard } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  const { lotPriceChng, lotQtyChng, lotPrice, lotQty } =
    useContext(BuyerContext);
  const today = new Date();
  const isMobile = useMediaQuery({
    query: "(max-width: 991px)",
  });

  const [priceRng, setPriceRng] = useState([
    { id: 0, description: "All", startAmt: "", endAmt: "" },
    { id: 100, description: "$100 - $499", startAmt: "100", endAmt: "499" },
    { id: 500, description: "$500 - $999", startAmt: "500", endAmt: "999" },
    {
      id: 1000,
      description: "$1000 - $1,499",
      startAmt: "1000",
      endAmt: "1499",
    },
    {
      id: 1500,
      description: "$1,500 - $1,999",
      startAmt: "1500",
      endAmt: "1999",
    },
    {
      id: 2000,
      description: "$2000 and above",
      startAmt: "2000",
      endAmt: "",
    },
  ]);
  const [state, setState] = useState({
    right: false,
    bottom: false,
    data: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchLot, setSearchLot] = useState([]);
  const [saveSearchUrl, setSaveSearchUrl] = useState("");
  const [nameSearchOpen, setNameSearchOpen] = useState(false);
  const [viewAddCredit, setViewAddCredit] = useState(false);
  const [search, setSearch] = useState({
    title: "",
    auctionId: "",
    localpickup: "",
    shipping: "",
    categoryId: "",
    sellername: "",
    seller_id: [],
    country: "",
    page: 1,
    perpage: 15,
    auctionDate: "",
    date_closed: null,
    date_added: null,
    price: "",
    state: "",
    country: "",
    type: 2,
  });

  const searchUrl = router?.query.search;

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
    isMobile && setAuctionView("Grid");
  });

  useEffect(() => {
    let url = new URLSearchParams(searchUrl);
    let categoryId = "";
    let sellername = "";
    let title = "";
    if (url.get("categoryId")) categoryId = url.get("categoryId").split(",");
    if (url.get("sellername")) sellername = url.get("sellername").split(",");
    if (url.get("title")) title = url.get("title");
    setSearch({
      ...search,
      categoryId,
      sellername,
      title,
    });
  }, [searchUrl]);
  useEffect(() => {
    let url = new URLSearchParams(searchUrl);
    if (!url.toString()) {
      searchAllLots(search);
    }
    lotPriceChng(false);
    lotQtyChng(false);
  }, []);

  useEffect(() => {
    if (allLots && allLots.results) {
      setSearchLot(allLots.results);
      setIsLoading(false);
    }
  }, [allLots]);

  useEffect(() => {
    setIsLoading(true);
    searchAllLots({
      title: search.title,
      type: search.type == 2 ? "" : search.type,
      auctionId: search.auctionId,
      localpickup: search.localpickup,
      shipping: search.shipping,
      categoryId: search.categoryId.toString(),
      sellername: search.sellername.toString(),
      seller_id: search.seller_id.toString(),
      country: search.country,
      page: search.page,
      perpage: search.perpage,
      auctionDate: search.auctionDate,
      state: search.state,
      country: search.country,
      userid: user && user.id ? user.id : "",
      startPrice:
        search &&
        search.price.length !== 0 &&
        priceRng.filter((ele) => ele.id === Number(search.price))[0].startAmt,
      endPrice:
        search &&
        search.price.length !== 0 &&
        priceRng.filter((ele) => ele.id === Number(search.price))[0].endAmt,
    });
  }, [search, user]);

  useEffect(() => {
    // console.log(user, "tyhisi is user");
    if (user && Object.keys(user).length) getAllSavedCards();
  }, [user]);

  // useEffect(() => {
  //   console.log(individual_product_dtls, "individual_product_dtls");
  //   if (Object.keys(individual_product_dtls).length) {
  //     let productDtls = {
  //       lotId: individual_product_dtls.auctionList.id,
  //     };
  //     getIndividualProductLotDetails(productDtls);
  //   }
  // }, [individual_product_dtls]);

  const formik = useFormik({
    initialValues: {
      search_name: "",
    },
    validationSchema: "",
    onSubmit: async (values) => {
      if (values.search_name && isAuthenticated) {
        let payload = {
          search_url: saveSearchUrl,
          user_id: user.id,
          title: values.search_name,
        };
        const success = await addSavedSearch(payload);
        if (success) {
          setAlert("Search Saved Successfully", "success");
        } else {
          setAlert("Something went wrong", "warning");
        }
        setNameSearchOpen(false);
        formik.resetForm();
      }
    },
  });

  const saveSearch = [
    {
      label: "Search Name",
      type: "text",
      placeholder: "Enter Search Name",
      class: "col-12",
      name: "search_name",
      formik: formik,
    },
  ];

  const toggleDrawer = (anchor, open, data) => (event) => {
    // console.log("toggle drawer enabled");
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (open && anchor == "right") {
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

  const clearSearchFilter = () => {
    setSearch({
      ...search,
      title: "",
      auctionId: "",
      localpickup: "",
      shipping: "",
      categoryId: "",
      sellername: "",
      country: "",
      page: 1,
      perpage: 15,
      auction_type: "",
      auctionDate: null,
      state: "",
      country: "",
    });
  };

  const lotPageRedirect = (data) => {
    if (data && Object.keys(data).length !== 0) {
      // console.log("this is from the search page", data);
      let productDtls = {
        lotId: data.id,
        is_auctionio: 1,
      };
      getIndividualProductLotDetails(productDtls);
      handleRedirectInternal(
        router,
        "productView",
        `?auctionId=${data.lotof}&auctionLotId=${data.id}`
      );
    }
  };

  const onHandlePage = (event, value) => {
    setSearch({ ...search, page: value });
  };
  useEffect(() => {
    if (allLots && allLots.results && allLots.results.length !== 0) {
      socket.on("bidoffers", (data) => {
        //console.log(data, "this is from socket");
        if (
          data &&
          Object.keys(data).length > 0 &&
          allLots &&
          allLots.results &&
          allLots.results.length > 0
        ) {
          let modifiedLots = allLots.results.map((ele) => {
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
          //console.log(modifiedLots, "modifiedLots");
          setSearchLot(modifiedLots);
        }
      });

      // socketForward.on("bidAddtime", (data) => {
      //   console.log(data, "this is from  bidAddtime socket");
      //   if (
      //     data &&
      //     Object.keys(data).length > 0 &&
      //     allLots &&
      //     allLots.results &&
      //     allLots.results.length > 0
      //   ) {
      //     let modifiedLots = allLots.results.map((ele) => {
      //       console.log(ele, "socket ele");
      //       let newLot = ele;
      //       console.log(
      //         Number(data.id) === Number(newLot.id),
      //         "bidAddtime data.lotid === newLot.id"
      //       );
      //       if (data.id === newLot.id) {
      //         newLot.bidcnt = data.bpop_bidcount;
      //         newLot.wprice = data.bpop_wprice;
      //         return newLot;
      //       } else {
      //         return newLot;
      //       }
      //     });
      //     //console.log(modifiedLots, "modifiedLots");
      //     setSearchLot(modifiedLots);
      //   }
      // });
    }
  }, [allLots]);

  const viewProductRef = useRef(searchLot);
  const userRef = useRef(user);

  useEffect(() => {
    viewProductRef.current = searchLot;
    userRef.current = user;
  });

  const handler = (message, type) => {
    messageHandler(
      message,
      viewProductRef.current,
      userRef.current,
      setAlert,
      setSearchLot,
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

  const updateItems = () => {
    let auctionLot = {
      title: "",
      auctionId: "",
      auctionDate: "",
      state: "",
      country: "",
      categoryId: "",
      sellername: "",
      page: 1,
      perpage: 15,
      userid: user && user.id ? user.id : "",
    };
    searchAllLots(auctionLot);
  };

  const handleSaveSearch = (url) => {
    setSaveSearchUrl(url);
    setNameSearchOpen(true);
  };

  return (
    <div className="search customContainer">
      {console.log(searchLot, "checkSearch")}
      <div className="filterAction">
        <Button
          className="filterTrigger"
          onClick={toggleDrawer("bottom", true)}
        >
          <span className="material-icons">filter_list</span> Filters
        </Button>
        <SearchField
          setSearch={setSearch}
          clearSearch={clearSearchFilter}
          search={search}
          handleSaveSearch={handleSaveSearch}
        />
      </div>
      {!isMobile && (
        <div className="gridListToggle">
          <Button
            className={auctionView === "Grid" ? "active" : ""}
            onClick={() => setAuctionView("Grid")}
          >
            <span className="material-icons">apps</span>GRID
          </Button>
          <Button
            className={auctionView === "List" ? "active" : ""}
            onClick={() => setAuctionView("List")}
          >
            <span className="material-icons">view_list</span>LIST
          </Button>
        </div>
      )}
      <div className="searchCnt d-flex justify-content-start align-items-start">
        <div className="searchLt">
          <div className="deskFilter">
            <FilterPanel
              setSearch={setSearch}
              clearSearch={clearSearchFilter}
              search={search}
            />
          </div>
        </div>
        <div className="searchRt">
          {isLoading ? (
            <Loaders name="product_grid_view" isLoading={true} loop={8} />
          ) : searchLot.length > 0 ? (
            <>
              <div className={`searchResults ${auctionView}`}>
                {searchLot.map((data, index) => (
                  <>
                    {auctionView === "Grid" ? (
                      <GridView
                        data={data}
                        key={index}
                        favId={`searchProd_${index}`}
                        drawerHandler={toggleDrawer("right", true, data)}
                        auctionType={data.con_check == 1 ? "live" : "Timed"}
                        updateData={updateItems}
                        listOfCards={savedCards}
                        setViewAddCredit={setViewAddCredit}
                        noTimer={data.con_check === 1 ? 1 : 0}
                      />
                    ) : (
                      <ListView
                        key={index}
                        data={data}
                        favId={`searchProd_${index}`}
                        updateData={updateItems}
                        drawerHandler={toggleDrawer("right", true, data)}
                        auctionType={data.con_check == 1 ? "live" : "Timed"}
                        listOfCards={savedCards}
                        setViewAddCredit={setViewAddCredit}
                        noTimer={data.con_check === 1 ? 1 : 0}
                      />
                    )}
                  </>
                ))}
              </div>
              {allLots && allLots.total_results > search.perpage && (
                <div className="d-flex justify-content-between align-items-center flex-wrap w-100 my-3 pagination-wrapper">
                  <Pagination
                    count={Math.ceil(allLots.total_results / search.perpage)}
                    page={search.page}
                    onChange={onHandlePage}
                    siblingCount={3}
                    showFirstButton
                    showLastButton
                    boundaryCount={2}
                  />
                </div>
              )}
            </>
          ) : (
            "No records found"
          )}
        </div>
      </div>

      {/* PRODUCT VIEW DRAWER */}
      <Drawer
        className="rightDrawer productViewDrawer"
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {lot_details && Object.keys(lot_details).length !== 0 ? (
          <ProductViewSlider
            lotDetails={lot_details}
            handleClose={toggleDrawer("right", false)}
          />
        ) : null}
      </Drawer>

      <Drawer
        className="responsiveFilterDrawer"
        anchor={"bottom"}
        open={state["bottom"]}
        onClose={toggleDrawer("bottom", false)}
      >
        <FilterPanel
          setSearch={setSearch}
          clearSearch={clearSearchFilter}
          search={search}
        />
      </Drawer>

      <Popup
        open={nameSearchOpen}
        size="md"
        handleClose={() => {
          setNameSearchOpen(false);
          formik.resetForm();
        }}
        modaltitle={"Name Search"}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="row">{Object.values(mapData(saveSearch))}</div>
          <PrimaryButton label="Save" type="submit" />
        </form>
      </Popup>
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
    </div>
  );
}

export default Search;
