import React from "react";
import Skeletons from "../../Skeletons";
import ListViewSkeleton from "./ProductCardSkeletons/ListViewSkeleton";

function AuctionViewSkeleton() {
  return (
    <div className="auctionViewSkeleton">
      <Skeletons type="banner" />

      <div className="avsInfo">
        <div>
          <Skeletons type="text" />
          <Skeletons type="text" />
          <Skeletons type="text" />
        </div>
        <Skeletons type="box" />
      </div>
      <ListViewSkeleton />
      <ListViewSkeleton />
    </div>
  );
}

export default AuctionViewSkeleton;
