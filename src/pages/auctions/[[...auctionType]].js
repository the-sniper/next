import React, { useContext, useState, useEffect } from "react";
import FilterPanel from "@/components/organisms/FilterPanel";
import { Button, Fade, Drawer } from "@material-ui/core";
import GridView from "@/components/molecules/ProductCard/GridView";
import AuctionGridView from "@/components/molecules/ProductCard/AuctionGridCard";
import AuctionListView from "@/components/molecules/ProductCard/AuctionListCard";
import SearchField from "@/components/molecules/SearchField";
import ProductViewSlider from "@/components/organisms/ProductViewSlider";
import AuctionContext from "@/context/auction/auctionContext";
import CommonContext from "@/context/common/commonContext";
import AuthContext from "@/context/auth/authContext";
import { handleRedirectInternal } from "@/common/components";
import BuyerContext from "@/context/buyer/buyerContext";
import ProductContext from "@/context/product/productContext";
import moment from "moment";
import { Pagination } from "@material-ui/lab";
import { date } from "yup";
import NoRecordsFound from "@/components/atoms/NoRecordsFound";
import Loaders from "@/components/molecules/Loaders";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";

function Auctions(props) {
  const [auctionView, setAuctionView] = useState("Grid");
  const [catgId, setCatgId] = useState([]);
  const router = useRouter();
  const { allCategory, searchValue, setSearchValue } =
    useContext(CommonContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { getAllSearchAuction, search_allauctions, getAuctionDetails } =
    useContext(AuctionContext);
  const { lotPriceChng, lotQtyChng, lotPrice, lotQty } =
    useContext(BuyerContext);
  const isMobile = useMediaQuery({
    query: "(max-width: 991px)",
  });
  const {
    getAllSearchProducts,
    search_allproducts,
    individual_product_dtls,
    getIndividualProductLotId,
    getIndividualProductLotDetails,
    searchAllLots,
    allLots,
    lot_details,
  } = useContext(ProductContext);
  const [state, setState] = useState({
    right: false,
    bottom: false,
    data: {},
  });
  const [locationValues, setLocationValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState({});
  const [viewAuction, setViewAuction] = useState([]);

  useEffect(() => {
    isMobile && setAuctionView("Grid");
  });

  let getAuctionType = router?.query?.auctionType
    ? router?.query?.auctionType[0]
    : "";

  useEffect(() => {
    let url = router.query.searchUrl;
    let title = "";
    let auctionType = [];
    let catergoryId = "";
    let selectedCatgoryIds = [];
    if (router?.query?.title) title = router?.query?.title;
    if (router?.query?.auctionType) auctionType = [router?.query?.auctionType];
    if (searchValue && searchValue.categoryId) {
      catergoryId = [searchValue.categoryId];
      setSearchValue({});
    }
    if (router?.query?.catgId)
      selectedCatgoryIds = router?.query?.catgId.split(",");

    setSearch({
      title: title,
      auctionId: "",
      localpickup: "",
      shipping: "",
      categoryId: catergoryId ? catergoryId : selectedCatgoryIds,
      country: "",
      page: 1,
      perpage:
        typeof window != "undefined" && getAuctionType === "events" ? 400 : 45,
      auctionDate: "",
      sellername: "",
      locations: [],
      auctionEndDate: "",
      auction_type: auctionType[0],

      price: "",
    });
  }, [searchValue, router.query]);

  useEffect(() => {
    if (Object.keys(search).length > 0) {
      let searchAuctionValue = {
        title: search.title,
        auctionId: search.auctionId,
        localpickup: search.localpickup,
        shipping: search.shipping,
        categoryId: search.categoryId?.toString(),
        sellername: search.sellername?.toString(),
        country: search.country,
        page: search.page,
        // auctionDate: search.auctionDate,
        startPrice: "",
        endPrice: "",
        auctionDate: search.auctionDate
          ? moment(search.auctionDate).format("YYYY-MM-DD HH:mm:ss")
          : "",
        auctionEndDate: search.auctionEndDate
          ? moment(search.auctionEndDate).format("YYYY-MM-DD HH:mm:ss")
          : "",
        perpage: search.perpage,
        auction_type:
          search.auction_type?.length === 2 ? "" : search.auction_type,

        location: JSON.stringify(
          locationValues.filter(function (obj) {
            return search.locations.some(function (obj2) {
              return obj.id === Number(obj2);
            });
          })
        ),
      };

      setIsLoading(true);
      getAllSearchAuction(searchAuctionValue);
    }
  }, [search, search.locations]);

  const compareByDate = (objectA, objectB) => {
    const dateObjectA = Date.parse(objectA.date_added);
    const dateObjectB = Date.parse(objectB.date_added);

    let comparison = 0;
    if (dateObjectA < dateObjectB) {
      comparison = 1;
    } else if (dateObjectA > dateObjectB) {
      comparison = -1;
    }
    return comparison;
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    if (search_allauctions.records.length > 0) {
      search_allauctions.records.map((data) => {
        if (parseInt(data.event_enable)) {
          data.donation_per = parseInt(
            parseFloat(
              parseInt(data.donationamt) / parseInt(data.expected_amount)
            ) * 100
          );
        } else {
          data.donation_per = 0;
        }
      });
      setViewAuction(search_allauctions.records);
    } else {
      setViewAuction([]);
    }
  }, [search_allauctions]);

  useEffect(() => {
    if (search_allauctions && Object.keys(search_allauctions).length !== 0) {
      let cityState = search_allauctions.records.map((ele, i) => {
        return {
          id: i,
          state: ele.state,
          country: ele.country,
          city: ele.city,
        };
      });
      let result = cityState.reduce((unique, o) => {
        if (
          !unique.some(
            (obj) =>
              obj.state === o.state &&
              obj.country === o.country &&
              obj.city === o.city
          )
        ) {
          unique.push(o);
        }
        return unique;
      }, []);
      setLocationValues(result);
    }
  }, [search_allauctions]);

  useEffect(() => {
    lotPriceChng(false);
    lotQtyChng(false);
  }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   getAllSearchProducts({
  //     title: search.title,
  //     auctionId: search.auctionId,
  //     localpickup: search.localpickup,
  //     shipping: search.shipping,
  //     categoryId: search.categoryId.toString(),
  //     country: search.country,
  //     page: 1,
  //     perpage: 10,
  //     // auctionDate: search.auctionDate,
  //     auctionEndDate: search.date_closed.length > 0 ? search.date_closed : "",
  //     auctionDate: search.date_added.length > 0 ? search.date_added : "",
  //   });
  // }, [search]);

  const toggleDrawer = (anchor, open, data) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (open) {
      let individualData = {
        title: "",
        auctionId: 1047,
        user_id: "",
        page: 1,
        perpage: 5,
      };
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
      sellername: "",
      categoryId: "",
      country: "",
      page: 1,
      perpage: 45,
      auctionDate: null,
      auctionEndDate: null,
      auction_type: "",
    });
  };

  const auctionLotView = (auctionData) => {
    if (Object.keys(auctionData).length) {
      router.push({
        pathname: `/auctionView/${auctionData.id}`,
        search: `?auctionId=${auctionData.id}&viewType=list&title=${auctionData.title}`,
      });
    }
  };

  const onHandlePage = (event, value) => {
    setSearch({ ...search, page: value });
  };

  return (
    <div
      className={`search customContainer footerFixer ${
        typeof window != "undefined" && getAuctionType === "events"
          ? "eventContainer"
          : ""
      }`}
    >
      {console.log(search, "auctionTypeSearch")}
      <div className="filterAction">
        <Button
          className="filterTrigger"
          onClick={toggleDrawer("bottom", true)}
        >
          <span className="material-icons">filter_list</span> Filters
        </Button>
        {typeof window != "undefined" && getAuctionType != "events" && (
          <SearchField
            setSearch={setSearch}
            clearSearch={clearSearchFilter}
            search={search}
          />
        )}
      </div>
      {typeof window != "undefined" && getAuctionType != "events" && (
        <>
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
        </>
      )}
      <div className="searchCnt d-flex justify-content-start align-items-start">
        {typeof window != "undefined" && getAuctionType != "events" && (
          <div className="searchLt">
            <div className="deskFilter">
              <FilterPanel
                setSearch={setSearch}
                clearSearch={clearSearchFilter}
                search={search}
                {...props}
              />
            </div>
          </div>
        )}
        <div
          className={`searchRt ${
            typeof window != "undefined" && getAuctionType === "events"
              ? "evntRt mt-5"
              : ""
          }`}
        >
          <div className="d-flex justify-content-between align-items-center"></div>
          {isLoading ? (
            <Loaders name="product_grid_view" isLoading={isLoading} loop={8} />
          ) : viewAuction.length > 0 ? (
            <>
              {typeof window != "undefined" && getAuctionType === "events" ? (
                <div className={`searchResultsAuction ${auctionView}`}>
                  {viewAuction
                    .filter((ele) => ele.event_enable == 1)
                    .map((auction, index) => (
                      <>
                        {auctionView === "Grid" ? (
                          <>
                            <AuctionGridView
                              auction={auction}
                              type={`${
                                Boolean(auction.event_enable) ? "event" : ""
                              }`}
                              auctionLotView={auctionLotView}
                              noTimer={
                                auction.auction_type === 1 ? true : false
                              }
                            />
                          </>
                        ) : (
                          <>
                            <AuctionListView
                              data={auction}
                              favId={`searchProd_${index}`}
                              auction={auction}
                              auctionLotView={auctionLotView}
                              drawerHandler={toggleDrawer(
                                "right",
                                true,
                                auction
                              )}
                              noTimer={
                                auction.auction_type === 1 ? true : false
                              }
                            />
                          </>
                        )}
                      </>
                    ))}
                </div>
              ) : (
                <div className={`searchResultsAuction ${auctionView}`}>
                  {viewAuction.map((auction, index) => (
                    <>
                      {auctionView === "Grid" ? (
                        <>
                          <AuctionGridView
                            auction={auction}
                            type={`${
                              Boolean(auction.event_enable) ? "event" : ""
                            }`}
                            auctionLotView={auctionLotView}
                            noTimer={auction.auction_type === 1 ? true : false}
                          />
                        </>
                      ) : (
                        <>
                          <AuctionListView
                            data={auction}
                            favId={`searchProd_${index}`}
                            auction={auction}
                            auctionLotView={auctionLotView}
                            drawerHandler={toggleDrawer("right", true, auction)}
                            noTimer={auction.auction_type === 1 ? true : false}
                          />
                        </>
                      )}
                    </>
                  ))}
                </div>
              )}

              {search_allauctions &&
                search_allauctions.totalRecords > search.perpage && (
                  <div className="d-flex justify-content-between align-items-center flex-wrap w-100 my-3 pagination-wrapper">
                    <Pagination
                      count={Math.ceil(
                        search_allauctions.totalRecords / search.perpage
                      )}
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
            <NoRecordsFound />
          )}
        </div>
      </div>

      {/* PRODUCT VIEW DRAWER */}
      {/* <Drawer
        className="rightDrawer productViewDrawer"
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        <ProductViewSlider />
      </Drawer> */}

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
    </div>
  );
}

export default Auctions;
