import React, { useState, useRef, useEffect, useContext } from "react";
import { LOGO, SITE_NAME } from "src/Utils";
import ProductContext from "@/context/product/productContext";
import AuthContext from "@/context/auth/authContext";
import { handleRedirectInternal, currencyFormat } from "@/common/components";
import { useRouter } from "next/router";

const Invoice = (props) => {
  const authContext = useContext(AuthContext);
  const productContext = useContext(ProductContext);
  const router = useRouter();
  const { search_allinvoiceproducts, getAllInvoiceProducts } = productContext;
  const { isAuthenticated } = authContext;

  const [search, setSearch] = useState({
    id: null,
  });
  let [invoiceDetails, setInvoiceDetails] = useState({
    invoiceProducts: [],
    shippingAddress: {},
    invoiceInformation: null,
  });

  useEffect(() => {
    if (isAuthenticated) {
      getAllInvoiceProducts(search);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setSearch({
      id: router?.query.id,
    });
  }, [router?.query.id]);

  useEffect(() => {
    if (search_allinvoiceproducts) {
      setInvoiceDetails({
        invoiceProducts: search_allinvoiceproducts.record.length
          ? search_allinvoiceproducts.record
          : [],
        invoiceInformation: search_allinvoiceproducts.record.length
          ? search_allinvoiceproducts.record[0]
          : null,
        shippingAddress: search_allinvoiceproducts.shipping_address,
      });
    }
  }, [search_allinvoiceproducts]);

  useEffect(() => {
    setInvoiceDetails({
      invoiceProducts: [],
      shippingAddress: {},
      invoiceInformation: null,
    });
    return () => {
      setInvoiceDetails({
        invoiceProducts: [],
        shippingAddress: {},
        invoiceInformation: null,
      });
    };
  }, []);

  // console.log("invoiceDetails", invoiceDetails);

  return (
    <div className="invcPage">
      {console.log(router, "seeRouter")}
      <div className="invoiceWrapper">
        {invoiceDetails && invoiceDetails.invoiceInformation ? (
          <>
            <div className="logoContainer">
              <img src={LOGO} alt={SITE_NAME} />
            </div>

            <div className="adrsInfo row pt-4">
              <div className="lftContainer col-md-6 col-sm-12">
                <h5 className="mb-0 mt-2">
                  {invoiceDetails.invoiceInformation.seller_first}{" "}
                  {invoiceDetails.invoiceInformation.seller_last}
                </h5>
                <p>
                  {invoiceDetails.invoiceInformation.seller_address1},{" "}
                  {invoiceDetails.invoiceInformation.seller_city}
                  <br />
                  {invoiceDetails.invoiceInformation.seller_state},{" "}
                  {invoiceDetails.invoiceInformation.seller_country}{" "}
                  {invoiceDetails.invoiceInformation.seller_zip}
                  <br /> Phone: {invoiceDetails.invoiceInformation.seller_phone}
                </p>
              </div>
              <div className="rtContainer text-right col-md-6 col-sm-12">
                <p className="m-0">
                  Invoice #: {invoiceDetails.invoiceInformation.common_invoice}
                </p>
                <p className="m-0">
                  Date: {invoiceDetails.invoiceInformation.paydate}
                </p>
                <p className="m-0">
                  {" "}
                  Status:{" "}
                  {invoiceDetails.invoiceInformation.paid === "0"
                    ? "Unpaid"
                    : "Paid"}
                </p>
              </div>
            </div>

            <hr className="mt-0" />
            <div className="byrAcInfo row">
              <div className="byrInfo col-md-7">
                <h4 className="my-4">Buyer Information</h4>
                <div className="d-flex align-items-center my-2">
                  <label className="m-0">Buyer Name:</label>
                  <p className="m-0">
                    {invoiceDetails.invoiceInformation.first_name}{" "}
                    {invoiceDetails.invoiceInformation.last_name}
                  </p>
                </div>
                <div className="d-flex align-items-center my-2">
                  <label className="m-0">Paddle #:</label>
                  <p className="m-0">
                    {invoiceDetails.invoiceInformation.user_id}
                  </p>
                </div>
                <div className="d-flex align-items-center my-2">
                  <label className="m-0">Phone #</label>
                  <p className="m-0">
                    {invoiceDetails.invoiceInformation.phone}
                  </p>
                </div>
                <div className="d-flex align-items-center my-2">
                  <label className="m-0">Email</label>
                  <p className="m-0">
                    {invoiceDetails.invoiceInformation.email}
                  </p>
                </div>
                <div className="d-flex align-items-center my-2">
                  <label className="m-0">Billing</label>
                  <p className="m-0">
                    {invoiceDetails.invoiceInformation.address1}{" "}
                    {invoiceDetails.invoiceInformation.city}
                    <br /> {invoiceDetails.invoiceInformation.state},{" "}
                    {invoiceDetails.invoiceInformation.country}{" "}
                    {invoiceDetails.invoiceInformation.zip}
                  </p>
                </div>
              </div>
              {/* <div className="actnInfo col-md-5">
                <h4 className="my-4">Auction Information</h4>
                <div className="d-flex align-items-center my-2">
                  <label className="m-0">Auction:</label>
                  <p className="m-0">
                    #{" "}
                    {invoiceDetails.invoiceInformation.lotof &&
                    invoiceDetails.invoiceInformation.lotof > 0
                      ? invoiceDetails.invoiceInformation.lotof
                      : ""}{" "}
                  </p>
                </div>
                <div className="d-flex align-items-center my-2">
                  <label className="m-0">Date:</label>
                  <p className="m-0">
                    {invoiceDetails.invoiceInformation.paydate}
                  </p>
                </div>
                <div className="d-flex align-items-start my-2">
                  <label className="m-0">Location:</label>
                  <p className="m-0">
                    {invoiceDetails.invoiceInformation.seller_address1},{" "}
                    {invoiceDetails.invoiceInformation.seller_city} <br />{" "}
                    {invoiceDetails.invoiceInformation.seller_state}{" "}
                    {invoiceDetails.invoiceInformation.seller_country}{" "}
                    {invoiceDetails.invoiceInformation.seller_zip}
                  </p>
                </div>
              </div> */}
            </div>
            <div className="tableWrapper mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Lot</th>
                    <th>Title</th>
                    <th>Sales Price</th>
                    <th>Transaction Fee</th>
                    <th>Shipping Fee</th>
                    <th>Sales Tax</th>
                    <th>Buyer Premium</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceDetails.invoiceProducts.map((data, index) => (
                    <tr>
                      <td>{data.project_id}</td>
                      <td>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: data.description,
                          }}
                        ></p>
                      </td>
                      <td>{currencyFormat(data.amount)}</td>
                      <td>{currencyFormat(data.transaction_fee)}</td>
                      <td>{currencyFormat(data.shipping_amount)}</td>
                      <td>{currencyFormat(data.sales_tax_amount)}</td>
                      <td>
                        {currencyFormat(
                          data.buypremium_amount + data.selling_fee
                        )}
                      </td>
                      <td>{currencyFormat(Number(data.total_invoice))}</td>
                    </tr>
                  ))}

                  {/* <tr>
                <td colspan='6' className='pt-4'></td>
                <td colspan='2' className='brdrBtn ttlDuTxt pt-4'>
                  Total Due
                </td>
                <td className='brdrBtn pt-4'>{Number($val.amount)+Number((($val.amount)/100)*($val.buyer_premium))} </td>
              </tr> */}
                </tbody>
              </table>
            </div>
            <div className="text-center ftrCntnt">
              <p>THANK YOU FOR SHOPPING WITH US</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
export default Invoice;
