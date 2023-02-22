import React from "react";
import Skeletons from "../../../Skeletons";
function GridViewSkeleton() {
  return (
    <div className="gridViewSkeleton">
      <Skeletons type="gridImage" />
      <Skeletons type="title" />
      <Skeletons type="text" />
      <Skeletons type="text" />
      {/* <Skeletons type="text" /> */}
      <Skeletons type="actionButton" />
    </div>
  );
}

export default GridViewSkeleton;
