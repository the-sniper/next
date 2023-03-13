import React, { useState, useEffect, useContext } from "react";
import EventView from "./eventView";
import RegularView from "./regularView";
import AuctionContext from "@/context/auction/auctionContext";
import AuthContext from "@/context/auth/authContext";
import { useRouter } from "next/router";
import { DirectAPICAll } from "@/common/components";
import axios from "axios";

function AuctionView({ auctionMetaData }) {
  const router = useRouter();
  const [auctionDetails, setAuctionDetails] = useState({});

  const { getAuctionDetails, auctiondetails } = useContext(AuctionContext);
  const {
    isAuthenticated,
    user,
    donar_registration,
    getdonarexistingcard,
    getdonarlist,
    responseStatus: donar_response,
    clearResponse: donar_clearresponse,
  } = useContext(AuthContext);
  useEffect(() => {
    let auctionId = router?.query.auctionId;
    getAuctionDetails({
      title: "",
      auctionId: auctionId,
      userid: user && user.id ? user.id : "",
      page: 1,
      perpage: 25,
      orderby: 1,
      is_auctionio: 1,
    });
  }, []);
  useEffect(() => {
    if (Object.keys(auctiondetails).length > 0) {
      setAuctionDetails(auctiondetails);
    }
  }, [auctiondetails]);

  return (
    <div className="">
      {Boolean(parseInt(auctionDetails.charity_type)) ? (
        <EventView auctionDetailsInitial={auctionDetails} />
      ) : (
        <RegularView auctionMetaData={auctionMetaData} />
      )}
    </div>
  );
}

export default AuctionView;

export async function getServerSideProps(context) {
  const { params } = context;
  const aucId = params.aid;

  const response = await DirectAPICAll(
    "post",
    `https://forwardapidev.auctionsoftware.com/api_buyer/auctionLotAPI`,
    {
      title: "",
      auctionId: aucId,
      userid: "",
      page: 1,
      perpage: 25,
      orderby: 1,
      is_auctionio: 1,
    }
  );

  const data = response.data;
  return {
    props: {
      auctionMetaData: data?.response?.auctionList || null,
    },
  };
}
