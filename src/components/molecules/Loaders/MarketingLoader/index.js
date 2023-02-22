import React from "react";
import Skeletons from "../../../Skeletons";

function MarketingSkeleton() {
  return (
    <div className="marketingSkeleton">
      <Skeletons type="title" />

      <div className="msCnt">
        <div className="msLt">
          <Skeletons type="gridImage" />
        </div>

        <div className="msRt">
          <Skeletons type="text" />
          <Skeletons type="text" />
          <Skeletons type="actionButton" />
          <Skeletons type="gridImage" />
        </div>
      </div>
    </div>
  );
}

export default MarketingSkeleton;
