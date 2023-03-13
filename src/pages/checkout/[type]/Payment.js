import React, { useContext, useEffect, useState } from "react";
import { currencyFormat, mapData } from "@/common/components";
import * as Yup from "yup";
import AuthContext from "@/context/auth/authContext";
import AlertContext from "@/context/alert/alertContext";
import ProductContext from "@/context/product/productContext";
import StripeCardContext from "@/context/stripe/card/cardContext";
import UserContext from "@/context/user/userContext";
import Popup from "@/components/organisms/Popup";
import { useFormik } from "formik";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useRouter } from "next/router";
const Payment = ({ items, total, cart_ids }) => {
  const {
    successAfterPayAuction,
    successAfterPay,
    getStaticPage,
    static_page,
    responseStatus,
    clearResponse,
  } = useContext(ProductContext);
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const { getAllStripeCards, get_all_card_details, createStripeCard } =
    useContext(StripeCardContext);
  const { getBuynowCheckout } = useContext(UserContext);
  const router = useRouter();
  const type = router?.query.type;
  const id =
    typeof window != "undefined" &&
    new URLSearchParams(window.location.search.substring(1)).getAll("id");
  const [cardInitialValues, setCardInitialValues] = useState({
    userid: "",
    email: "",
    cardNumber: "",
    cardName: "",
    cardCountry: "US",
    cardAddress: "",
    cardCity: "",
    cardZip: "",
    cardState: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [allData, setAllData] = useState([]);
  const [cardData, setCardData] = useState("nocard");
  const validationCard = Yup.object({
    cardNumber: Yup.string()
      .min(12, "Invalid credit card number!")
      .max(18, "Invalid credit card number!")
      .required("Required!"),
    cardName: Yup.string()
      .trim()
      .matches(
        /^[a-z A-Z]*$/g,
        "The special characters and numbers are not allowed!"
      )
      .required("Required!"),
    cardAddress: Yup.string().trim().required("Required!"),
    cardCity: Yup.string().trim().required("Required!"),
    cardState: Yup.string().trim().required("Required!"),
    cardZip: Yup.string()
      .trim()
      .matches(/^[0-9]*$/g, "Only positive numbers allowed")
      .min(5, "Minimum 5 Numbers")
      .max(6, "Maximum 6 Numbers")
      .required("Required!"),
    expiryMonth: Yup.string().required("Required!"),
    expiryYear: Yup.string().required("Required!"),
    cvv: Yup.string()
      .required("Required!")
      .min(3, "Mininum 3 Numbers required")
      .max(4, "Maximum 4 Numbers required"),
  });
  const cardFormik = useFormik({
    initialValues: cardInitialValues,
    validationSchema: cardData === "nocard" ? validationCard : "",
    onSubmit: async (values) => {
      setLoading(true);

      let body = {};
      if (cardData === "nocard") {
        body = {
          customer: user.card_paymentid,
          currency: user?.country == 38 ? "cad" : "usd",
          description: "Amount paid from auction io buyer page(card)!",
          card_name: values.cardName,
          card_number: values.cardNumber,
          card_cvc: values.cvv,
          card_exp_month: values.expiryMonth,
          card_exp_year: values.expiryYear,
          card_token: true,
          message: "Manual Payment!",
          card_address_line1: values.cardAddress,
          card_address_line2: values.cardAddress1,
          card_address_city: values.cardCity,
          card_address_state: values.cardState,
          card_address_country: values?.cardCountry == "38" ? "CA" : "US",
          card_address_zip: values.cardZip,
          billing_details: {
            email: user.email,
            name: user.first_name,
            address: {
              line1: user.address1,
              line2: user.address2,
              city: user.city,
              state: user.state,
              country: user?.country == "38" ? "CA" : "US",
              postal_code: user.zip,
            },
          },
        };
      } else {
        body = {
          source: cardData,
          customer: user.card_paymentid,
          currency: user?.country == 38 ? "cad" : "usd",
          description: "Card checkout",
        };
      }
      if (saveCard) {
        let newCard = {
          account_id: process.env.NEXT_PUBLIC_AUCTIONPAYID,
          customer_id: user ? user.card_paymentid : "",
          cvv: "",
          card_address_zip: values.cardZip,
          card_address_country: values.cardCountry == "38" ? "CA" : "US",
          is_primary: "",
          user_id: "",
          id: "",
          card_token: true,
          card_name: values.cardName,
          card_number: values.cardNumber,
          card_cvc: values.cvv,
          card_exp_month: values.expiryMonth,
          card_exp_year: values.expiryYear,
          card_address_line1: values.cardAddress,
          card_address_line2: values.cardAddress1,
          card_address_city: values.cardCity,
          card_address_state: values.cardState,
        };
        createStripeCard(newCard);
      }

      if (type === "auction") {
        successAfterPayAuction({
          invoice_id: id,
          payment_details: body,
          //   shipping_addr_id: selectAddress,
          user_country: user?.country == "38" ? "CA" : "US",
          user_id: user?.id,
          //   ship_local,
          //   shipping_inside: shipping,
          //   need_discount: need_discount,
          //   discount_details: discount_details,
          //   transfer_location: transfer_location,
          //   transfer_amount_details: transfer_amount_details,
        });
      }
      if (type === "buynow") {
        successAfterPay({
          cart_ids: JSON.stringify(cart_ids),
          payment_details: body,
          // shipping_addr_id: selectAddress,
          user_country: user?.country == "38" ? "CA" : "US",
          user_id: user?.id,
          // ship_local,
          // shipping_inside: shipping,
          // transfer_location: transfer_location,
          // transfer_amount_details: transfer_amount_details,
          // shipping_amount_from_shipstation: global.pluginConfiguration?.shipping
          //   ?.enable
          //   ? items.map((val) => {
          //       return val.shipping_fee;
          //     })
          //   : [],
        });
      }
    },
    enableReinitialize: true,
  });

  const creditCardYearOptions = [];
  let date = new Date();
  let currentYear = date.getFullYear();
  let upToYear = parseInt(currentYear) + 25;
  for (let year = parseInt(currentYear); year < parseInt(upToYear); year++) {
    creditCardYearOptions.push({
      value: year,
      show: year,
    });
  }
  const creditCardMonthOptions = [];
  for (let month = parseInt(1); month <= parseInt(12); month++) {
    let monthValue = ("0" + month).slice(-2);
    creditCardMonthOptions.push({
      value: monthValue,
      show: monthValue,
    });
  }
  const cardDetails = [
    {
      label: "Card Holder Name",
      type: "text",
      placeholder: "Enter card holder name",
      class: "col-12",
      name: "cardName",
      formik: cardFormik,
    },
    {
      label: "Card Number",
      type: "number",
      placeholder: "Enter your card number",
      class: "col-12",
      name: "cardNumber",
      formik: cardFormik,
    },
    {
      label: "Card Address",
      type: "text",
      placeholder: "Enter your card address",
      class: "col-12",
      name: "cardAddress",
      formik: cardFormik,
    },
    {
      label: "City",
      type: "text",
      placeholder: "Enter your city",
      class: "col-12",
      name: "cardCity",
      formik: cardFormik,
    },
    {
      label: "State",
      type: "text",
      placeholder: "Enter your state",
      class: "col-12",
      name: "cardState",
      formik: cardFormik,
    },
    {
      label: "Zip Code",
      type: "number",
      placeholder: "Enter your zip code",
      class: "col-sm-6 col-12",
      name: "cardZip",
      formik: cardFormik,
    },
    {
      label: "Expiry Month",
      placeholder: "MM",
      class: "col-sm-6 col-12",
      type: "select",
      name: "expiryMonth",
      options: creditCardMonthOptions,
      formik: cardFormik,
    },
    {
      label: "Expiry Year",
      placeholder: "YYYY",
      class: "col-sm-6 col-12",
      type: "select",
      name: "expiryYear",
      options: creditCardYearOptions,
      formik: cardFormik,
    },
    {
      label: "Cvv",
      type: "number",
      placeholder: "Enter your Cvv",
      class: "col-sm-6 col-12",
      name: "cvv",
      formik: cardFormik,
    },
  ];
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    clearResponse();
    if (type === "buynow") {
      getBuynowCheckout({
        user_id: user.id,
      });
    }
    router.push(`/dashboard/myBids/1`);
  };
  const onChange = (e) => {
    e.target.checked ? setCardData(e.target.value) : setCardData("nocard");
  };
  useEffect(() => {
    if (responseStatus) {
      if (
        responseStatus.from === "successAfterPay" ||
        responseStatus.from === "successAfterPayAuction"
      ) {
        if (responseStatus.status === "success") {
          setOpen(true);
        } else {
          setAlert(responseStatus.message, "error");
          setLoading(false);
        }
      }
    }
  }, [responseStatus]);
  useEffect(() => {
    if (user) {
      getAllStripeCards({
        account_id: process.env.NEXT_PUBLIC_AUCTIONPAYID,
        customer_id: user.card_paymentid,
        object: "card",
      });
    }
  }, [user]);
  useEffect(() => {
    getStaticPage(
      {
        page_id:
          type === "buynow" ? "buynow_success_msg" : "auction_success_msg",
        site_id: items[0]?.site_id,
      },
      1
    );
  }, []);
  useEffect(() => {
    if (get_all_card_details) {
      setAllData(get_all_card_details.records);
    }
  }, [get_all_card_details]);
  return (
    <div>
      <div className="row">
        {allData &&
          allData.map((data, index) => (
            <div key={index} className="cardSelect">
              <label htmlFor={`ritemb${index}`} className="cardmain">
                <div className="flx">
                  <p>{"xxxx-xxxx-xxxx-" + data.last4}</p>
                  <div className="radio-item">
                    <input
                      type="checkbox"
                      id={`ritemb${index}`}
                      name="ritem"
                      value={data.id}
                      checked={cardData === data.id}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="flx">
                  <p>{data.brand}</p>
                  <p>
                    {data.exp_month}/{data.exp_year}
                  </p>
                </div>
              </label>
            </div>
          ))}
      </div>
      {cardData === "nocard" ? (
        <div className="row">{Object.values(mapData(cardDetails))}</div>
      ) : null}
      <div className="text-center form-group mt-2">
        <PrimaryButton
          label={
            loading
              ? "Loading..."
              : `Pay ${
                  parseFloat(
                    total?.deposit_amount ? total?.deposit_amount : 0
                  ) > 0
                    ? currencyFormat(total?.deposit_amount)
                    : total?.shipping_fee != 0
                    ? currencyFormat(total?.total_payable_amount)
                    : currencyFormat(total?.local_pick_total_payable_amount)
                }`
          }
          onClick={cardFormik.handleSubmit}
          type="button"
          disabled={loading}
        />
      </div>
      {open && (
        <Popup
          open={open}
          size="md"
          className="save-search-modal"
          handleClose={handleClose}
          modaltitle="Order Successful"
        >
          <div className="order-success-wrap orPlcdSs text-center">
            <img src="/image/check_circle.svg" alt="" />
            <p className="os-text">
              Congratulations - You have purchased&nbsp;
            </p>
            <ul className="os-text pdtNmLst">
              {items.map((data, index) => (
                <li>
                  <b>
                    <span key={index}>{data.title}</span>
                  </b>
                </li>
              ))}
            </ul>
            {static_page.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: static_page.content,
                }}
              ></div>
            ) : (
              <>
                <p>
                  Shipping
                  {items.length &&
                  items.filter((ele) => ele.localpickup == 1)?.length != 0
                    ? "/Pick-up"
                    : ""}{" "}
                  Information will be sent to your emails inbox.
                </p>
                <p>To download your invoice, visit your Profile.</p>
              </>
            )}
          </div>
        </Popup>
      )}
    </div>
  );
};

export default Payment;
