import React, { useContext, useState, useEffect } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import CommonContext from "@/context/common/commonContext";
import { Pagination } from '@mui/material';
import ProductContext from "@/context/product/productContext";
import { currencyFormat, dateTimeFormatFunction } from "@/common/components";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import AuthContext from "@/context/auth/authContext";
import { useRouter } from "next/router";
const useStyles = makeStyles((theme, maxWidth) => ({
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "100%",
    maxWidth: "55rem",
  },
}));

const DonorHistory = (props) => {
  const classes = useStyles();
  const [bidPopUp, setBidPopUp] = React.useState({
    popup: props.popup,
    id: 0,
  });
  let [viewProduct, setViewProduct] = useState({});
  const {
    getdonarlist,
    responseStatus: donar_response,
    clearResponse: donar_clearresponse,
  } = useContext(AuthContext);

  //   const commonContext = useContext(CommonContext);
  //   const productContext = useContext(ProductContext);
  //   const { bidHistoryValue, clearBidHistoryValue } = commonContext;
  //   const { search_allbidhistory, getAllBidHistory } = productContext;
  const router = useRouter();
  let auctionId = router?.query.auctionId;
  const [search, setSearch] = useState({
    perpage: 10,
    page: 1,
    auctionid: auctionId,
    from: "donorlist_popup_bidderdetails_page",
  });

  //   console.log("TESTTTTTT SRIII", props);
  // useEffect(() => {
  //   if (props.donor_details.length > 0) {
  //     setViewProduct(props.donor_details);
  //   }
  // }, [props.donor_details]);

  useEffect(() => {
    if (search.auctionId != "" && props.popup) {
      getdonarlist(search);
    }
  }, [props.popup]);

  useEffect(() => {
    if (donar_response) {
      if (donar_response.from == "donorlist_popup_bidderdetails_page") {
        if (donar_response.message) {
          // console.log(
          //   "llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll",
          //   donar_response.message
          // );
          setViewProduct(donar_response.message);
        }
        donar_clearresponse();
      }
    }
  }, [donar_response]);

  const onHandlePage = (event, value) => {
    setSearch({ ...search, page: value });
    var data = search;
    data.page = value;
    getdonarlist(data);
  };

  //   useEffect(() => {
  //     setViewProduct(
  //       search_allbidhistory.records.length ? search_allbidhistory.records : []
  //     );
  //   }, [search_allbidhistory]);

  return (
    <Modal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      open={props.popup}
      className={`${classes.modal} customModal`}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      onClose={() => props.setPopup(false)}
    >
      <Fade in={props.popup}>
        <div className="bidHistoryModal donorHistoryModal">
          <div className={classes.paper}>
            <div className="modal fade show custom-modal">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Donor history</h4>
                    <Button
                      className="close"
                      onClick={() => props.setPopup(false)}
                    >
                      <span className="material-icons">close</span>
                    </Button>
                  </div>
                  <div className="modal-body cm-body table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          {/* <th scope="col">Email</th> */}
                          <th scope="col">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewProduct?.donationlist?.length > 0 ? (
                          <>
                            {viewProduct.donationlist.map((data, index) => (
                              <>
                                <tr>
                                  <td>
                                    {data.first_name + " " + data.last_name}
                                  </td>
                                  {/* <td>{data.email}</td> */}
                                  <td>{currencyFormat(data.total_amount)}</td>
                                </tr>
                              </>
                            ))}
                          </>
                        ) : (
                          ""
                        )}
                      </tbody>
                    </table>
                    {/* <div className="d-flex justify-content-between align-items-center flex-wrap w-100 mb-3 pagination-wrapper">
                      <h6>
                        Showing {search_allbidhistory.setDisp} of{" "}
                        {search_allbidhistory.totalRecords}
                      </h6>
                      <Pagination
                        count={Math.ceil(
                          search_allbidhistory.totalRecords / search.limit
                        )}
                        page={search.page}
                        onChange={onHandlePage}
                        siblingCount={3}
                        showFirstButton
                        showLastButton
                        boundaryCount={2}
                      />
                    </div> */}
                    <Pagination
                      count={Math.ceil(
                        parseInt(viewProduct.donationcnt) /
                          parseInt(search.perpage)
                      )}
                      page={search.page}
                      onChange={onHandlePage}
                      siblingCount={3}
                      showFirstButton
                      showLastButton
                      boundaryCount={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default DonorHistory;
