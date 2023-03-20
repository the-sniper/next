import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Fade } from "@mui/material";
import GridViewSkeleton from "./ProductCardSkeletons/GridViewSkeleton";
import ListViewSkeleton from "./ProductCardSkeletons/ListViewSkeleton";
import CartSkeleton from "./CartSkeleton";
import CheckoutSkeleton from "./CheckoutSkeleton";
import ProductViewSkeleton from "./ProductViewSkeleton";
import AuctionViewSkeleton from "./AuctionViewSkeleton";
import LiveAuctionSkeleton from "./LiveAuctionSkeleton";
import MarketingSkeleton from "./MarketingLoader";

const returnSwitch = (props) => {
  switch (props.name) {
    case "product_grid_view":
      return <GridViewSkeleton />;
    case "product_list_view":
      return <ListViewSkeleton />;
    case "cart":
      return <CartSkeleton />;
    case "checkout":
      return <CheckoutSkeleton />;
    case "product_view":
      return <ProductViewSkeleton />;
    case "auction_view":
      return <AuctionViewSkeleton />;
    case "live_auction":
      return <LiveAuctionSkeleton />;
    case "marketing":
      return <MarketingSkeleton />;
    default:
      return <CircularProgress disableShrink />;
  }
};

const Loaders = (props) => {
  return (
    <>
      {props.isLoading ? (
        <>
          <Fade in={props.isLoading} timeout={600}>
            <div
              className={`loadingCnt ${
                typeof window !== "undefined" &&
                localStorage.getItem("theme") === "theme-dark" &&
                "dark"
              }`}
            >
              {[...Array(props.loop ? props.loop : 1)].map((data, index) => (
                <div
                  className={props.name === "home" ? "loader" : ""}
                  key={index}
                >
                  {returnSwitch(props)}
                </div>
              ))}
            </div>
          </Fade>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Loaders;
