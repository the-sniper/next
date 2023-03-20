import { Button, Drawer } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import GridView from "@/components/molecules/ProductCard/GridView";
import ListView from "@/components/molecules/ProductCard/ListView";
import ProductViewSlider from "@/components/organisms/ProductViewSlider";
import DashboardLayout from "@/components/templates/DashboardLayout";
import UserContext from "@/context/user/userContext";
import AuthContext from "@/context/auth/authContext";
import ProductContext from "@/context/product/productContext";
import NoRecordsFound from "@/components/atoms/NoRecordsFound";

function Watchlist() {
  const [auctionView, setAuctionView] = useState("Grid");
  const [viewProducts, setViewProducts] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [totalViewProducts, setTotalViewProducts] = useState("");
  const { getWatchList, getStripeCard } = useContext(UserContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { getIndividualProductLotDetails, lot_details } =
    useContext(ProductContext);
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
      getIndividualProductLotDetails({
        lotId: data.id,
        user_id: user && user.id ? user.id : "",
        is_auctionio: 1,
      });
      setState({ ...state, [anchor]: open, data: data });
    } else {
      setState({ ...state, [anchor]: open, data: {} });
    }
  };

  const getWatchlistProduct = async () => {
    let watchListProducts = [];
    watchListProducts = await getWatchList({ user_id: user.id, page: 1 });
    if (watchListProducts.results.length > 0) {
      watchListProducts.results.forEach((product, index, theArray) => {
        theArray[index] = {
          ...product,
          wat_list: 1,
        };
      });
    }
    setViewProducts(watchListProducts.results);
    setTotalViewProducts(watchListProducts.total_results);
  };

  useEffect(() => {
    if (isAuthenticated) {
      getWatchlistProduct();
    }
  }, [user]);

  useEffect(() => {
    // console.log(user, 'tyhisi is user');
    if (user && Object.keys(user).length) getAllSavedCards();
  }, [user]);

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

  return (
    <DashboardLayout
      title="Watchlist"
      totalLots={totalViewProducts > 0 ? totalViewProducts : ""}
      gridListToggle={
        <div className="gridListToggle">
          <Button
            className={auctionView === "Grid" ? "active" : ""}
            onClick={() => setAuctionView("Grid")}
          >
            <span className="material-icons">apps</span>Grid
          </Button>
          <Button
            className={auctionView === "List" ? "active" : ""}
            onClick={() => setAuctionView("List")}
          >
            <span className="material-icons">view_list</span>List
          </Button>
        </div>
      }
    >
      {totalViewProducts > 0 ? (
        <div className={`searchResults ${auctionView}`}>
          {viewProducts?.map((data, index) => (
            <>
              {auctionView === "Grid" ? (
                <>
                  <GridView
                    key={index}
                    data={data}
                    favId={`searchProd_${index}`}
                    updateData={getWatchlistProduct}
                    drawerHandler={toggleDrawer("right", true, data)}
                    listOfCards={savedCards}
                  />
                </>
              ) : (
                <>
                  <ListView
                    key={index}
                    data={data}
                    favId={`searchProd_${index}`}
                    updateData={getWatchlistProduct}
                    listOfCards={savedCards}
                    drawerHandler={toggleDrawer("right", true, data)}
                  />
                </>
              )}
            </>
          ))}
        </div>
      ) : (
        <NoRecordsFound />
      )}

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
    </DashboardLayout>
  );
}

export default Watchlist;
