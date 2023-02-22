import React from "react";
import Skeletons from "../../Skeletons";

function LiveAuctionSkeleton() {
  return (
    <div className="liveAuctionSkeleton">
      <div className="laTopContainer">
        <div className="laImage">
          <Skeletons type="gridImage" />
          <div className="d-flex">
            <Skeletons type="thumbnail" />
            <Skeletons type="thumbnail" />
            <Skeletons type="thumbnail" />
          </div>
        </div>
        <Skeletons type="box" />
        <div className="laAct">
          <Skeletons type="text" />
          <Skeletons type="text" />
          <Skeletons type="text" />
          <Skeletons type="text" />
          <Skeletons type="text" />
          <Skeletons type="text" />
          <Skeletons type="text" />
          <Skeletons type="text" />
        </div>
      </div>
      <div className="lasSubTitle">
        <Skeletons type="text" />
      </div>
      <div className="laInfo">
        <Skeletons type="thumbnail" />
        <Skeletons type="thumbnail" />
        <Skeletons type="thumbnail" />
        <Skeletons type="thumbnail" />
        <Skeletons type="thumbnail" />
        <Skeletons type="thumbnail" />
      </div>
    </div>
  );
}

export default LiveAuctionSkeleton;
