import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CommonContext from "../../../context/common/commonContext";
import { Pagination } from "@material-ui/lab";
import ProductContext from "../../../context/product/productContext";
import {
  currencyFormat,
  dateTimeFormatFunction,
} from "../../../common/components";
import { Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
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

const BidHistory = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [bidPopUp, setBidPopUp] = React.useState({
    popup: false,
    id: 0,
  });
  let [viewProduct, setViewProduct] = useState([]);

  const commonContext = useContext(CommonContext);
  const productContext = useContext(ProductContext);
  const { bidHistoryValue, clearBidHistoryValue } = commonContext;
  const { search_allbidhistory, getAllBidHistory } = productContext;

  const [search, setSearch] = useState({
    limit: 10,
    page: 1,
    id: 0,
  });

  // console.log("TESTTTTTT SRIII", bidHistoryValue);
  useEffect(() => {
    // console.log("bidHistoryValue", bidHistoryValue);
    if (bidHistoryValue) {
      setSearch({ ...search, lotid: bidHistoryValue, page: 1 });
      setBidPopUp({ popup: true, id: bidHistoryValue });
      clearBidHistoryValue();
    }
  }, [bidHistoryValue]);

  useEffect(() => {
    if (search.lotid !== 0) {
      getAllBidHistory(search);
    }
  }, [search]);

  const onHandlePage = (event, value) => {
    setSearch({ ...search, page: value });
  };

  useEffect(() => {
    setViewProduct(
      search_allbidhistory.records.length ? search_allbidhistory.records : []
    );
  }, [search_allbidhistory]);

  return (
    <Modal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      open={bidPopUp.popup}
      className={`${classes.modal} customModal`}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={bidPopUp.popup}>
        <div className="bidHistoryModal">
          <div className={classes.paper}>
            <div className="modal fade show custom-modal">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Bid history</h4>
                    <Button
                      className="close"
                      onClick={() => setBidPopUp({ popup: false, id: 0 })}
                    >
                      <span className="material-icons">close</span>
                    </Button>
                  </div>
                  <div className="modal-body cm-body table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Current bid</th>
                          <th scope="col">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewProduct.map((data, index) => (
                          <>
                            <tr>
                              <td>
                                {data.user_id}{" "}
                                {!data.is_auctionio
                                  ? `(${data.store_name})`
                                  : ""}
                              </td>
                              <td>{currencyFormat(data.proposed_amount)}</td>
                              <td>{dateTimeFormatFunction(data.created_at)}</td>
                            </tr>
                          </>
                        ))}
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

export default BidHistory;
