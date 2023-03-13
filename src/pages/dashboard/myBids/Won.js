import React from "react";
import { useState, useContext, useEffect } from "react";
import ProductContext from "@/context/product/productContext";
import AuthContext from "@/context/auth/authContext";
import AlertContext from "@/context/alert/alertContext";
import GridView from "@/components/molecules/ProductCard/GridView";
import ListView from "@/components/molecules/ProductCard/ListView";
import { Pagination } from "@material-ui/lab";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useRouter } from "next/router";

const Won = ({ auctionView }) => {
  const { getDashboardMybids, dashboardMyBids } = useContext(ProductContext);
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const router = useRouter();
  const [lots, setLots] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [data, setData] = useState({
    user_id: user?.id,
    page: 1,
    perpage: 10,
    total: 0,
  });

  useEffect(() => {
    if (user) {
      getDashboardMybids(data, "mywonbids");
    }
  }, [user, data.page]);
  useEffect(() => {
    if (dashboardMyBids.results) {
      setLots(dashboardMyBids.results);
      setData({
        ...data,
        total: dashboardMyBids.total_results,
      });
    }
  }, [dashboardMyBids]);
  const mybidsRedirect = (data) => {
    router.push({
      pathname: `/productView/${data.id}`,
      search: `?auctionLotId=${data.auction_id}`,
    });
  };

  const onHandlePage = (event, page) => setData({ ...data, page });

  const addToCheckout = (data) => {
    if (invoice.length) {
      if (invoice.find((val) => val?.common_invoice === data.common_invoice)) {
        let temp = invoice;
        let index = temp.indexOf(data);
        if (index > -1) {
          temp.splice(index, 1);
        }
        setInvoice([...temp]);
      } else {
        if (invoice.find((val) => val?.seller_id === data.seller_id)) {
          setInvoice((prev) => [...prev, data]);
        } else {
          setAlert("Kindly Add Same Seller Products!", "error");
        }
      }
    } else {
      setInvoice([data]);
    }
  };

  const handleSubmit = () => {
    let invoice_id = [];
    invoice.map((val) => invoice_id.push(val.common_invoice));
    router.push(`/checkout/auction?id=${invoice_id.join("&id=")}`);
  };
  return (
    <div>
      {lots.length ? (
        <div className={`searchResults ${auctionView}`}>
          {lots.map((val, ind) =>
            auctionView === "Grid" ? (
              <GridView
                key={ind}
                data={val}
                favId={`searchProd_${ind}`}
                from="dashboard"
                action={val && Number(val.paid) === 0 ? "won" : "order"}
                drawerHandler={() => mybidsRedirect(val)}
                addToCheckout={() => addToCheckout(val)}
                invoice={invoice}
              />
            ) : (
              <ListView
                key={ind}
                data={val}
                favId={`searchProd_${ind}`}
                from="dashboard"
                action={val && Number(val.paid) === 0 ? "won" : "order"}
                drawerHandler={() => mybidsRedirect(val)}
                addToCheckout={() => addToCheckout(val)}
                invoice={invoice}
              />
            )
          )}
        </div>
      ) : (
        <div>No Products Found</div>
      )}
      {data.total > data.perpage && (
        <div className="mybids-page">
          <Pagination
            count={Math.ceil(data.total / data.perpage)}
            page={data.page}
            onChange={onHandlePage}
            siblingCount={3}
            showFirstButton
            showLastButton
            boundaryCount={2}
          />
        </div>
      )}
      {invoice.length ? (
        <div className="row mt-3">
          <div className="col-md-3 float-right">
            <PrimaryButton
              label="CHECKOUT"
              btnSize="small"
              onClick={handleSubmit}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Won;
