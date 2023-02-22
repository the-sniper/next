import React from "react";
import ProductView from "@/pages/productView/[pid]";

function ProductViewSlider({ lotDetails, auctionDetails, handleClose }) {
  return (
    <div className="productViewSlider">
      <ProductView
        from="slider"
        lotDetails={lotDetails}
        auctionDetails={auctionDetails}
        handleClose={handleClose}
      />
    </div>
  );
}

export default ProductViewSlider;
