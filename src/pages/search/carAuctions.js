import moment from "moment";
import React, { useState, useEffect } from "react";
import { DirectAPICAll, noImageAvailable } from "../../common/components";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import { useHistory } from "react-router-dom";
import Cars from "../../components/organisms/Cars";

function CarAuctions() {
  return (
    <div className="carAuctions customContainer">
      <h3 className="caTitle">Search Cars</h3>
      <Cars pageCount={100} />
    </div>
  );
}

export default CarAuctions;
