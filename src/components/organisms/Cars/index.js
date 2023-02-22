import { Pagination } from "@material-ui/lab";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { DirectAPICAll, noImageAvailable } from "../../../common/components";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import Loaders from "../../../components/molecules/Loaders";
import NoRecordsFound from "../../../components/atoms/NoRecordsFound";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function Cars(props) {
  const [lots, setLots] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const pageCount = props.pageCount;

  useEffect(() => {
    async function init() {
      setLoading(true);
      const carsData = await DirectAPICAll(
        "get",
        `https://europeancarxchange.com/api/getAllVehicles?api_country=gmuser@123&page=${page}&perpage=${pageCount}&_csrf=&sortBy=ending_first_to_last`,
        {}
      );
      setLots(carsData.data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    init();
  }, [page, pageCount]);

  const onHandlePage = (event, value) => {
    setPage(value);
  };
  // console.log(lots, "checklots");
  return (
    <>
      {isLoading ? (
        <Loaders
          name="product_grid_view"
          isLoading={true}
          loop={props.loop ? props.loop : 6}
        />
      ) : lots && lots.data?.vehicles.length ? (
        <>
          <div className="carsContainer">
            {lots &&
              lots.data?.vehicles
                // .filter((data) => data.roadworthy == "yes")
                .map((data, index) => (
                  <div className="carsGrid">
                    <div className="pcgImg">
                      <LazyLoadImage
                        src={`https://ecxlive.s3.us-west-2.amazonaws.com/public/uploads/product/${data.avatar}`}
                        className="acImgLt cursorDecoy"
                        alt={data.title}
                        onError={(e) => noImageAvailable(e)}
                        effect="blur"
                        placeholderSrc="assets/svg/imageLoading.svg"
                        height="100%"
                        width="100%"
                      />
                      {/* <img
                      src={`https://ecxlive.s3.us-west-2.amazonaws.com/public/uploads/product/${data.avatar}`}
                      alt={data.title}
                      className=""
                      onError={(e) => noImageAvailable(e)}
                    /> */}
                    </div>
                    <h3 className="gridProdTitle">{data.title}</h3>
                    <div className="cgInfo">
                      <h5>
                        <span>Brand: </span>
                        {data.brand}
                      </h5>
                      <h5>
                        <span>Model: </span>
                        {data.gi_model}
                      </h5>
                      <h5>
                        <span>Year: </span>
                        {moment(data.first_reg_date).format("YYYY")}
                      </h5>
                      <h5>
                        <span>Mileage: </span>
                        {data.gi_mileage}
                      </h5>
                    </div>
                    {/* <PrimaryButton
                      label="View Details"
                      onClick={() =>
                        window.open(
                          `https://europeancarxchange.com/product/view/${data.id}`
                        )
                      }
                    /> */}
                  </div>
                ))}
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap w-100 my-3 pagination-wrapper">
            <Pagination
              count={Math.ceil(lots?.data?.total_vehicles / pageCount)}
              page={page}
              onChange={onHandlePage}
              siblingCount={3}
              showFirstButton
              showLastButton
              boundaryCount={2}
            />
          </div>
        </>
      ) : (
        <NoRecordsFound />
      )}
    </>
  );
}

export default Cars;
