import React from "react";
import { useState, useContext, useEffect } from "react";
import ProductContext from "@/context/product/productContext";
import AuthContext from "@/context/auth/authContext";
import AlertContext from "@/context/alert/alertContext";
import GridView from "@/components/molecules/ProductCard/GridView";
import ListView from "@/components/molecules/ProductCard/ListView";
import { Pagination } from '@mui/material';
import { useRouter } from "next/router";

const BidsDashboard = ({ auctionView, type }) => {
  const { getDashboardMybids, dashboardMyBids } = useContext(ProductContext);
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const router = useRouter();
  const [lots, setLots] = useState([]);
  const [data, setData] = useState({
    user_id: user?.id,
    page: 1,
    perpage: 10,
    total: 0,
  });

  useEffect(() => {
    if (user) {
      getDashboardMybids(data, `my${type}bids`);
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
                drawerHandler={() => mybidsRedirect(val)}
              />
            ) : (
              <ListView
                key={ind}
                data={val}
                favId={`searchProd_${ind}`}
                from="dashboard"
                drawerHandler={() => mybidsRedirect(val)}
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
    </div>
  );
};

export default BidsDashboard;
