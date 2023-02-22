import React from "react";
const CarsFooter = () => {
  return (
    <div className="cars-footer">
      <div className="container">
        <div className="cl-text">Interested in our product?</div>
        <button
          className="btn btn-blue"
          onClick={() => window.open("https://www.auctionsoftware.com/contact-us/")}
        >
          SCHEDULE YOUR DEMO
        </button>
        <div className="cpy-rtext">
          Auctionsoftware.com © 2022. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default CarsFooter;
