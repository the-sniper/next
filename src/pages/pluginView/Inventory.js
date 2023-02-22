import React from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const Inventory = (props) => {
  const history = useHistory();
  return (
    <div>
      <div className="dscrptnContainer customContainer">
        <div className="tpMnCntnr d-flex pt-5">
          <Button
            className="bkButton mt-3 ml-4"
            onClick={() => history.goBack()}
          >
            <span class="material-icons-outlined mr-2">keyboard_backspace</span>
            Back
          </Button>
          <img
            className="mnPlgnImg"
            src="/assets/images/plugins/inventory/main_image.jpg"
          />
          <div className="mnTxtCntnr">
            <div className="plgnTtle">
              <h2>Inventory</h2>
            </div>
            <div className="shrDsctpn">
              <p>The Inventory feature will be used for the Store Seller.</p>
              <p>
                In Inventory system a company tallies up their inventory stocks
                every once in a while. Or periodically. Then they compare a
                current number against a previous number to determine inventory
                change over time.
              </p>
              <p>
                Inventory levels are monitored in real time. And all inventory
                management and control decisions can be made at any time based
                on current, accurate numbers. Because those numbers are all
                updated perpetually, after every purchase and every sale.
              </p>
            </div>
            <div className="mrDscrptnCntnr my-2 py-2">
              <img
                className="stpImg"
                src="/assets/images/plugins/inventory/image_store.png"
              />
            </div>
          </div>
        </div>
        <div className="mrDscrptnCntnr container">
          <h1 className="text-center my-5">Store Admin Page</h1>
          <h5>
            The admin or seller can go to the to Store Configuration &#10132;
            View Store &#10132; View My Store Admin and view the Store Admin
            Page as shown below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/inventory/image_one.png"
            />
          </div>
          <h5>
            Next , Click Inventory tab and then We can create Inventory ,Active
            Inventory and Find Active Lot Search
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/inventory/step1.png"
            />
          </div>

          <h1 className="text-center my-5">Add Inventory</h1>
          <h5>We can Add New Inventory by using Lot id </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/inventory/step2.png"
            />
          </div>

          <h1 className="text-center my-5">Active Inventory</h1>
          <h5>
            In Active Inventory Page , Select any one of the LOT ID and then We
            can Add Location as shown Below.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/inventory/step3.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/inventory/step4.png"
            />
          </div>
          <h5>
            Then that Location is added in Current Location and also We can edit
            after add the Location.
          </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/inventory/step5.png"
            />
          </div>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/inventory/step6.png"
            />
          </div>
          <h5>
            When we add the New Current Location the Previous one is updated in
            Last Location and then Stocked Date is automatically update
          </h5>
          <h1 className="text-center my-5">Active Inventory Lot Search</h1>
          <h5>We can search Active Inventory by using Lot id </h5>
          <div>
            <img
              className="stpImg"
              src="/assets/images/plugins/inventory/step7.png"
            />
          </div>
        </div>
      </div>
      <div className="pyCntnr">
        <div className="customContainer d-flex align-items-center justify-content-between">
          <div className="lftInfo">
            <div className="lgCntnr">
              <img
                src={process.env.NEXT_PUBLIC_IMAGE_URL + props.pluginData?.image}
              />
            </div>
            <div className="prcCntr">
              <p>Price</p>
              <h2>
                <>
                  {currencyFormat(props.pluginData?.price)}/
                  {props.pluginData?.duration}
                </>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
