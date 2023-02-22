import React from "react";

const BidStatus = ({ bidTopStatus }) => {
  return (
    <div className="productStatus">
      {bidTopStatus ? (
        <h4
          className={`p4 ${
            bidTopStatus.includes("bought")
              ? "won"
              : bidTopStatus.includes("lost")
              ? "lost"
              : bidTopStatus.includes("losing")
              ? "losing"
              : bidTopStatus.includes("outbid")
              ? "outbid"
              : bidTopStatus.includes("reserve")
              ? "reserve"
              : bidTopStatus.includes("winning")
              ? "winning"
              : bidTopStatus.includes("proxy")
              ? "proxy"
              : ""
          }`}
        >
          {bidTopStatus.replace(/autoBid/g, "proxy bid")}
        </h4>
      ) : (
        ""
      )}
    </div>
  );
};

export default BidStatus;
