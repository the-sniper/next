import React, { useContext, useState, useEffect } from "react";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import {
  handleRedirectInternal,
  currencyFormat,
} from "@/common/components";
import UserContext from "@/context/user/userContext";
import AuthContext from "@/context/auth/authContext";
import { useRouter } from "next/router";

function Cart() {
  const { buynow_cart_items, buynow_cart_total_info } = useContext(UserContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(null);
  const [taxPercentage, setTaxPercentage] = useState(10);
  const [shippingId, setShippingId] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      if (buynow_cart_items.length > 0) {
        setCartItems(buynow_cart_items);
      } else {
        setCartItems([]);
      }
    }
  }, [buynow_cart_items]);

  const getTax = (amount) => {
    return (taxPercentage / 100) * amount;
  };

  const getTotal = (amount) => {
    return amount + getTax(amount);
  };

  const getCartTotalBeforeTax = () => {
    let total = 0;
    cartItems.map((item) => (total += item.amount));
    return total;
  };

  const getCartTotalTaxes = () => {
    let taxes = 0;
    cartItems.map((item) => (taxes += getTax(item.amount)));
    return taxes;
  };

  const handleProceedToCheckout = () => {
    let productIds = [];
    cartItems.map((item) => productIds.push(item.project_id));

    // handleRedirectInternal(router, "checkout/buynow");

    handleRedirectInternal(router, "checkout/buynow");
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (
        buynow_cart_total_info &&
        Object.keys(buynow_cart_total_info).length > 0
      ) {
        setCartTotal(buynow_cart_total_info);
      } else {
        setCartTotal(null);
      }
    }
  }, [buynow_cart_total_info]);

  return (
    <div className="cart customContainer footerFixer">
      <div className="cartLt">
        {cartItems.length > 0 ? (
          <>
            <h2 className="cartTitle">Cart Items</h2>
            <div className="table-responsive">
              <table class="table cartItem">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Product Image</th>
                    <th scope="col">Auction Id</th>
                    <th scope="col">Auction Type</th>
                    <th scope="col">Lot Id</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col">Buyer Premium (%)</th>
                    <th scope="col">Shipping Cost</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((data, index) => (
                    <tr key={index}>
                      <td>
                        {/* <img src={data.img} alt={data.title} onError={}/> */}
                        {index + 1}
                      </td>
                      <td>
                        <img
                          src={`${global.images_url}${data.avatar}`}
                          alt="productimg"
                        />
                      </td>
                      <td>{data.lotof}</td>
                      <td>
                        {Number(data.auction_type) === 1
                          ? "Live Auction"
                          : "Timed Auction"}
                      </td>
                      <td>{data.deed_document}</td>
                      <td>{data.title}</td>
                      <td>{currencyFormat(data.amount)}</td>
                      <td>
                        {currencyFormat(data.item_buypremium_amt)}{" "}
                        {`(${data.listing_fee}%)`} Inc 2% Market Fee
                      </td>
                      <td>{currencyFormat(data.shippingcost)}</td>
                      <td>{currencyFormat(data.total_item_amt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="emptyCart">
            <img
              src="/assets/svg/emptyCart.svg"
              alt="Empty cart illustration"
            />
            <h5>You don't have any products added to your cart yet.</h5>
            <h6>
              It doesn't have to be that way. Browse through thousands of
              products we have, <br /> You surely will find what you are looking
              for.
            </h6>
            <PrimaryButton
              label="Continue Shopping"
              onClick={() => handleRedirectInternal(router, "auctions")}
            />
          </div>
        )}
      </div>

      {cartItems.length > 0 && cartTotal ? (
        <>
          <div className="cartRt">
            <h3 className="cartSummaryTitle">Order Summary</h3>
            <ul>
              <li className="row">
                <span className="col">Subtotal:</span>
                <span className="col">
                  {currencyFormat(cartTotal.total_sale_amt)}
                </span>
              </li>
              <li className="row">
                <span className="col">Total Buyer Premium:</span>
                <span className="col">
                  {currencyFormat(cartTotal.total_buypremium_amt)}
                </span>
              </li>
              <li className="row">
                <span className="col">Total Shipping Amount:</span>
                <span className="col">
                  {currencyFormat(cartTotal.total_shipping_amt)}
                </span>
              </li>
              <li className="row">
                <span className="col">Due Amount:</span>
                <span className="col">
                  {currencyFormat(cartTotal.total_due_amt)}
                </span>
              </li>
              <li className="row">
                <span className="col">Transaction Fee:</span>
                <span className="col">
                  {currencyFormat(cartTotal.transaction_amt)}
                </span>
              </li>
              <li className="row">
                <span className="col">Total Paid Amount:</span>
                <span className="col">
                  {currencyFormat(cartTotal.total_pay_amt)}
                </span>
              </li>
            </ul>
            <PrimaryButton
              onClick={handleProceedToCheckout}
              label="Proceed to checkout"
            />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Cart;
