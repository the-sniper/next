import { Button, Drawer } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import GridView from '@/components/molecules/ProductCard/GridView';
import ListView from '@/components/molecules/ProductCard/ListView';
import ProductViewSlider from '@/components/organisms/ProductViewSlider';
import DashboardLayout from '@/components/templates/DashboardLayout';
import UserContext from '@/context/user/userContext';
import AuthContext from '@/context/auth/authContext';
import ProductContext from '@/context/product/productContext';
import { Pagination } from '@mui/material';

function MyOrders() {
  const [auctionView, setAuctionView] = useState('Grid');
  const [viewProducts, setViewProducts] = useState([]);
  const [totalViewProducts, setTotalViewProducts] = useState('');
  const [page, setPage] = useState(1);
  const { getOrders } = useContext(UserContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { getIndividualProductLotDetails, lot_details } =
    useContext(ProductContext);
  const [state, setState] = useState({
    right: false,
    bottom: false,
    data: {},
  });

  const toggleDrawer = (anchor, open, data) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    if (open) {
      getIndividualProductLotDetails({
        lotId: data.project_id,
        user_id: user && user.id ? user.id : '',
        is_auctionio: 1,
      });
      setState({ ...state, [anchor]: open, data: data });
    } else {
      setState({ ...state, [anchor]: open, data: {} });
    }
  };

  const getMyOrderProduct = async (page) => {
    let myOrderProducts = [];
    myOrderProducts = await getOrders({ user_id: user.id, page: page });
    setViewProducts(myOrderProducts.results);
    setTotalViewProducts(myOrderProducts.total_results);
  };

  useEffect(() => {
    if (isAuthenticated) {
      getMyOrderProduct(page);
    }
  }, [user]);

  const onHandlePage = (event, page) => {
    setPage(page);
    getMyOrderProduct(page);
  };

  return (
    <DashboardLayout
      title="My Orders"
      totalLots={totalViewProducts > 0 ? totalViewProducts : ''}
      gridListToggle={
        <div className="gridListToggle">
          <Button
            className={auctionView === 'Grid' ? 'active' : ''}
            onClick={() => setAuctionView('Grid')}
          >
            <span className="material-icons">apps</span>Grid
          </Button>
          <Button
            className={auctionView === 'List' ? 'active' : ''}
            onClick={() => setAuctionView('List')}
          >
            <span className="material-icons">view_list</span>List
          </Button>
        </div>
      }
    >{viewProducts?.length > 0?
      <div className={`searchResults ${auctionView}`}>
        {viewProducts?.map((data, index) => (
          <>
            {auctionView === 'Grid' ? (
              <>
                <GridView
                  key={index}
                  data={data}
                  from="dashboard"
                  action="order"
                  favId={`searchProd_${index}`}
                  drawerHandler={toggleDrawer('right', true, data)}
                />
              </>
            ) : (
              <>
                <ListView
                  data={data}
                  key={index}
                  from="dashboard"
                  action="order"
                  favId={`searchProd_${index}`}
                  drawerHandler={toggleDrawer('right', true, data)}
                />
              </>
            )}
          </>
        ))}
      </div>:<p>No Orders Found</p>}
   
      {totalViewProducts > 10 ?(
        <div className="mybids-page">
          <Pagination
            count={Math.ceil(totalViewProducts / 10)}
            page={page}
            onChange={onHandlePage}
            siblingCount={3}
            showFirstButton
            showLastButton
            boundaryCount={2}
          />
        </div>):""}
     

      <Drawer
        className="rightDrawer productViewDrawer"
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
      >
        {lot_details && Object.keys(lot_details).length !== 0 ? (
          <ProductViewSlider
            lotDetails={lot_details}
            handleClose={toggleDrawer('right', false)}
          />
        ) : null}
      </Drawer>
    </DashboardLayout>
  );
}

export default MyOrders;
