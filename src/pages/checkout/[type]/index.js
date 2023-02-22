import React, { useContext, useState, useEffect } from "react";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import {
  handleRedirectInternal,
  currencyFormat,
  getImages_url_check,
} from "@/common/components";
import { useParams } from "react-router-dom";
import ProductContext from "@/context/product/productContext";
import AuthContext from "@/context/auth/authContext";
import AlertContext from "@/context/alert/alertContext";
import UserContext from "@/context/user/userContext";
import Payment from "./Payment";
import { useRouter } from "next/router";

const Checkout = () => {
  const {
    getCheckoutAuction,
    invoice_details,
    invoice_store_config,
    invoice_plugin_config,
    requestShipping,
    responseStatus,
    clearResponse,
  } = useContext(ProductContext);
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const { buynow_cart_items } = useContext(UserContext);
  const router = useRouter();

  const type = router?.query.type;
  const id =
    typeof window != "undefined" &&
    new URLSearchParams(window.location.search.substring(1)).getAll("id");
  const [viewCartItems, setViewCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState({
    amount: 0,
    buyers_premium: 0,
    sales_tax: 0,
    shipping_fee: 0,
    local_pick_sales_tax: 0,
    transaction_fee: 0,
    total_payable_amount: 0,
    local_pick_total_payable_amount: 0,
    discount_amount: 0,
    transfer_amount: 0,
    deposit_amount: 0,
  });
  const [changeShipping, setChangeShipping] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  useEffect(() => {
    if (user) {
      if (!id) {
        return router.push(`/mybids`);
      }
      if (type === "auction") {
        getCheckoutAuction({ invoice_id: id, user_id: user?.id });
      } else {
        let temp = {
          amount: 0,
          buyers_premium: 0,
          sales_tax: 0,
          shipping_fee: 0,
          local_pick_sales_tax: 0,
          transaction_fee: 0,
          total_payable_amount: 0,
          local_pick_total_payable_amount: 0,
          discount_amount: 0,
          transfer_amount: 0,
          deposit_amount: 0,
        };
        buynow_cart_items.map((val) => {
          temp.amount += parseFloat(
            type === "buynow" ? val.bprice : val.amount
          );
          temp.buyers_premium += parseFloat(
            val.buyers_premium + val.charge_fee
          );
          temp.transaction_fee += parseFloat(val.transaction_fee);
          temp.shipping_fee += parseFloat(val.shipping_fee);
          temp.sales_tax += parseFloat(val.sales_tax);
          temp.local_pick_sales_tax += parseFloat(val.local_pick_sales_tax);
          temp.total_payable_amount += parseFloat(val.total_payable_amount);
          temp.local_pick_total_payable_amount += parseFloat(
            val.local_pick_total_payable_amount
          );
          temp.discount_amount += parseFloat(val.discount_amount);
          temp.transfer_amount += parseFloat(val.transfer_amount);
          temp.deposit_amount += parseFloat(val.deposit_amount);
        });
        setViewCartItems(buynow_cart_items);
        setCartTotal(temp);
      }
    }
  }, [user, buynow_cart_items]);

  useEffect(() => {
    if (type === "auction") {
      if (invoice_details) {
        if (invoice_details.length > 0) {
          if (invoice_store_config?.transfer_item_location?.value == 1) {
            var city_equal_check =
              invoice_store_config?.transfer_city_location?.value;
            invoice_details.map((val) => {
              if (
                val.auction_city != city_equal_check &&
                val.auction_city ==
                  invoice_store_config?.transfer_city_location_from?.value
              ) {
                val.transfer_item_enable = 1;
              } else {
                val.transfer_fee_location = 0;
              }
            });
            setViewCartItems(invoice_details);
          } else {
            setViewCartItems(invoice_details);
          }
          let temp = {
            amount: 0,
            buyers_premium: 0,
            sales_tax: 0,
            shipping_fee: 0,
            local_pick_sales_tax: 0,
            transaction_fee: 0,
            total_payable_amount: 0,
            local_pick_total_payable_amount: 0,
            discount_amount: 0,
            transfer_amount: 0,
            deposit_amount: 0,
          };
          invoice_details.map((val) => {
            console.log(temp.amount, "temp.amount");
            temp.amount += parseFloat(
              type === "buynow" ? val.bprice : val.amount
            );
            temp.buyers_premium += parseFloat(
              val.buyers_premium + val.charge_fee
            );
            temp.transaction_fee += parseFloat(val.transaction_fee);
            temp.shipping_fee += parseFloat(val.shipping_fee);
            temp.sales_tax += parseFloat(val.sales_tax);
            temp.local_pick_sales_tax += parseFloat(val.local_pick_sales_tax);
            temp.total_payable_amount += parseFloat(val.total_payable_amount);
            temp.local_pick_total_payable_amount += parseFloat(
              val.local_pick_total_payable_amount
            );
            temp.discount_amount += parseFloat(val.discount_amount);
            temp.transfer_amount += parseFloat(val.transfer_amount);
            temp.deposit_amount += parseFloat(val.deposit_amount);
          });
          setCartTotal(temp);
        } else {
          if (invoice_details.message == "No invoice found") {
            setAlert(
              "You paid this item already.if not please check invoice id!",
              "error"
            );
            return router.push(`/mybids?s=1`);
          }
        }
      }
    }
  }, [invoice_details]);
  useEffect(() => {
    if (responseStatus) {
      if (responseStatus.from === "requestShipping") {
        setRequestLoading(false);
        if (responseStatus.status === "success") {
          setAlert("Shipping fee requested successfully!", "success");
          if (requestId) {
            document.getElementById(requestId).value = "";
            document.getElementById(`${requestId}_message`).value = "";
          }
        }
        clearResponse();
      }
    }
  }, [responseStatus]);

  const handleSubmit = async (e, val) => {
    e.preventDefault();
    setRequestId(`${val.id}`);
    const body = {
      site_id: val.site_id,
      from_id: user?.id,
      from_email: user?.email,
      customer_name: user?.first_name + " " + user?.last_name,
      to_id: val.user_id,
      lotid: val.product_id,
      auctionid: val.auctionid,
      invoiceid: val.common_invoice,
      shipping_fee: document.getElementById(`${val.id}`).value,
      message: document.getElementById(`${val.id}_message`).value,
    };
    setRequestLoading(true);
    requestShipping(body);
  };

  return (
    <div className="cart customContainer footerFixer">
      <div className="cartLt">
        {viewCartItems.length > 0 ? (
          <>
            <h2 className="cartTitle">CHECKOUT</h2>
            <div className="table-responsive">
              <table class="table cartItem">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Product Image</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Buyer Premium</th>
                    <th scope="col">Sales Tax</th>
                    {/* <th scope="col">Transfer Fee</th> */}
                    <th scope="col">Transaction Fee</th>
                    <th scope="col">Shipping Fee</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewCartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={getImages_url_check(
                            item.avatar,
                            item.content_head1
                          )}
                          alt="productimg"
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>
                        {currencyFormat(
                          parseFloat(item.bprice ? item.bprice : item.amount)
                        )}
                      </td>
                      <td>
                        {`${currencyFormat(
                          parseFloat(item.buyers_premium + item.charge_fee)
                        )} (${
                          item.buyers_premium_percentage +
                          item.charge_percentage
                        } %)`}
                      </td>
                      <td>
                        {currencyFormat(
                          parseFloat(
                            item.shipping_fee !== 0 && item.hasshipping == 1
                              ? item.sales_tax
                              : item.local_pick_sales_tax
                          )
                        )}
                        {item.sales_tax_per_state
                          ? `(${item.sales_tax_per_state} % + ${item.local_sales_tax_per_state} %)`
                          : `(${item.sales_tax_percentage} %)`}
                      </td>
                      {/* <td>
                        {parseFloat(item.transfer_fee_location) > 0
                          ? currencyFormat(
                              parseFloat(item.transfer_fee_location)
                            )
                          : null}
                      </td> */}
                      <td>
                        {item.transaction_fee != 0
                          ? `${currencyFormat(
                              parseFloat(item.transaction_fee)
                            )} (${item.transaction_label})`
                          : null}
                      </td>
                      <td>
                        {item.shipping_fee !== 0 &&
                        item.hasshipping == 1 &&
                        item.inside_vancouver !== "no" ? (
                          <>
                            <div className="cob-top">
                              <div className="co-label">{`Shipping Fee ${
                                item.shipping_type == 1
                                  ? `(${item.shipping_percentage} %)`
                                  : ""
                              }`}</div>
                              <div className="co-text d-flex align-items-center justify-content-start">
                                {currencyFormat(parseFloat(item.shipping_fee))}
                                {item.custom_field_4 == 1 &&
                                type === "auction" &&
                                invoice_plugin_config?.shipping?.enable ? (
                                  <>
                                    {changeShipping === `chg_${index}` ? (
                                      <p
                                        className="ml-auto mb-0 colorPrimary cursorDecoy"
                                        onClick={() => setChangeShipping(false)}
                                      >
                                        <span className="material-icons">
                                          <small>clear</small>
                                        </span>
                                      </p>
                                    ) : (
                                      <p
                                        className="ml-3 mb-0 colorPrimary cursorDecoy"
                                        onClick={() =>
                                          setChangeShipping(`chg_${index}`)
                                        }
                                      >
                                        <small>Change Shipping Fee</small>
                                      </p>
                                    )}
                                  </>
                                ) : null}
                              </div>
                            </div>
                            {item.custom_field_4 == 1 &&
                            type === "auction" &&
                            invoice_plugin_config?.shipping?.enable ? (
                              <>
                                {changeShipping === `chg_${index}` ? (
                                  <div className="cob-top">
                                    <>
                                      <form
                                        onSubmit={(e) => handleSubmit(e, item)}
                                      >
                                        <div className="input-group chkShpngMsg">
                                          <input
                                            id={`${item.id}_message`}
                                            type="text"
                                            placeholder="Type your message here..."
                                            className="form-control w-100 mb-2"
                                          />
                                          <input
                                            id={`${item.id}`}
                                            type="number"
                                            min="1"
                                            placeholder="Request shipping fee"
                                            className="form-control mr-2"
                                          />
                                          <div className="input-group-btn">
                                            <button
                                              type="submit"
                                              className="btn pink-btn"
                                              disabled={requestLoading}
                                            >
                                              {requestLoading
                                                ? "Sending..."
                                                : "Send"}
                                            </button>
                                          </div>
                                        </div>
                                      </form>
                                    </>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </>
                            ) : null}
                          </>
                        ) : null}
                      </td>
                      <td>
                        {currencyFormat(
                          parseFloat(
                            item.shipping_fee !== 0 && item.hasshipping == 1
                              ? item.total_payable_amount
                              : item.local_pick_total_payable_amount
                          )
                        )}
                      </td>
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
            <h5>No Invoice Found For This Invoice Id</h5>
            <PrimaryButton
              label="Continue Shopping"
              onClick={() => router.push("/searchAuction")}
            />
          </div>
        )}
      </div>

      {viewCartItems.length > 0 ? (
        <>
          <div className="cartRt">
            <h3 className="cartSummaryTitle">Order Summary</h3>
            <ul>
              <li className="row">
                <span className="col">Total Amount:</span>
                <span className="col">{currencyFormat(cartTotal.amount)}</span>
              </li>
              <li className="row">
                <span className="col">Buyer's Premium:</span>
                <span className="col">
                  {currencyFormat(cartTotal.buyers_premium)}
                </span>
              </li>
              <li className="row">
                <span className="col">Sales Tax:</span>
                <span className="col">
                  {currencyFormat(
                    cartTotal.shipping_fee != 0
                      ? cartTotal.sales_tax
                      : cartTotal.local_pick_sales_tax
                  )}
                </span>
              </li>
              <li className="row">
                <span className="col">Transaction Fee:</span>
                <span className="col">
                  {currencyFormat(cartTotal.transaction_fee)}
                </span>
              </li>
              <li className="row">
                <span className="col">Shipping Fee:</span>
                <span className="col">
                  {currencyFormat(cartTotal.shipping_fee)}
                </span>
              </li>
              <li className="row">
                <span className="col">Grand Total:</span>
                <span className="col">
                  {currencyFormat(
                    cartTotal.shipping_fee != 0
                      ? cartTotal.total_payable_amount
                      : cartTotal.local_pick_total_payable_amount
                  )}
                </span>
              </li>
            </ul>
            <Payment
              items={viewCartItems}
              total={cartTotal}
              cart_ids={viewCartItems.map((value) => value.cart_id)}
            />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Checkout;
