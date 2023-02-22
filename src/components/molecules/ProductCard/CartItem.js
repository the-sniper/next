import { Button } from "@material-ui/core";
import React, { useState, useRef, useEffect, useContext } from "react";
// import CustomInput from '../../atoms/Inputs/CustomInput'
// import PrimaryButton from '../../atoms/PrimaryButton'
import { currencyFormat } from "../../../common/components";
import BuynowContext from "../../../../product/context/buynow/buynowContext";
import { mapData } from "../../../../product/common/components";
import * as Yup from "yup";
import { useFormik } from "formik";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const CartItem = (props) => {
  const [product, setProduct] = useState();
  const [reload, setReload] = useState(false);
  const { addToCart } = useContext(BuynowContext);
  const { t } = useTranslation();
  useEffect(() => {
    setProduct(props.data);
  }, [props.data]);

  const validationArray = Yup.object({
    quantity: Yup.number()
      .min(1, `${t("min_quantity")} `)
      .max(
        product ? product.projects_qty - product.projects_sold : 0,
        `${t("max_quantity")} ${
          product ? product.projects_qty - product.projects_sold : 0
        }`
      )
      .required(t("enter_quantity")),
  });

  const formik = useFormik({
    initialValues: {
      quantity: 0,
    },
    validationSchema: validationArray,
    onSubmit: debounce((values) => {
      addToCart({
        cart: [
          {
            product_id: product.project_id,
            qty: values.quantity,
          },
        ],
      });
    }, 1000),
  });

  useEffect(() => {
    if (product) {
      formik.values.quantity = product ? product.qty : 0;
      setReload(!reload);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      if (formik.values.quantity !== product.qty) {
        formik.submitForm();
      }
    }
  }, [formik.values.quantity]);

  const formikQuantity = [
    {
      label: "",
      name: "quantity",
      type: "number",
      placeholder: "Qty",
      size: "small",
      autoFocus: false,
      formik: formik,
    },
  ];

  return (
    <>
      {product ? (
        <>
          <div className="cartItem d-flex justify-content-between align-items-start">
            <div className="itemInfo d-flex justify-content-start">
              <div className="pclImg">
                <LazyLoadImage
                  onError={(e) => noImageAvailable(e)}
                  effect="blur"
                  placeholderSrc="assets/svg/imageLoading.svg"
                  height="100%"
                  width="100%"
                  src={
                    global.site_url +
                    "/uploads/product/" +
                    product.projects_avatar
                  }
                  alt={product.title}
                />
              </div>
              <div className="listContent">
                <h2 className="listProdTitle">{product.projects_title}</h2>
                {props.from == "buynowcart" ||
                props.from == "buynowcheckout" ||
                (props.from == "invoice" &&
                  product.buynow_autype === "buynow") ? (
                  <>
                    <div className="listLotInfo d-flex justify-content-start align-items-center">
                      <h5>
                        <span>{t("amount")}:</span>
                        <span>{currencyFormat(product.amount)}</span>
                      </h5>
                      <h5>
                        <span>{t("quantity")}:</span> <span>{product.qty}</span>
                      </h5>
                    </div>
                    <div className="listLotInfo d-flex justify-content-start align-items-center">
                      <h5>
                        <span>{t("sub_total")}:</span>
                        <span>{currencyFormat(product.per_total)}</span>
                      </h5>
                    </div>
                    <div className="listLotInfo d-flex justify-content-start align-items-center">
                      <h5>
                        <span>Tax({product.tax_percent}%):</span>
                        <span>{currencyFormat(product.total_tax)}</span>
                      </h5>
                    </div>
                    <div className="listLotInfo d-flex justify-content-start align-items-center">
                      <h5>
                        <span>{t("total")}:</span>
                        <span>{currencyFormat(product.total_amount)}</span>
                      </h5>
                    </div>
                  </>
                ) : props.from == "cart" ||
                  props.from == "checkout" ||
                  (props.from == "invoice" &&
                    product.buynow_autype === "live") ? (
                  <>
                    <div className="listLotInfo d-flex justify-content-start align-items-center">
                      <h5>
                        <span>{t("sub_total")}:</span>
                        <span>{currencyFormat(product.per_total)}</span>
                      </h5>
                    </div>
                    <div className="listLotInfo d-flex justify-content-start align-items-center">
                      <h5>
                        <span>
                          {t("tax")}({product.tax_percent}%):
                        </span>
                        <span>{currencyFormat(product.total_tax)}</span>
                      </h5>
                    </div>
                    <div className="listLotInfo d-flex justify-content-start align-items-center">
                      <h5>
                        <span>{t("total")}:</span>
                        <span>{currencyFormat(product.total_amount)}</span>
                      </h5>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="listActBtn">
              {/* <div className="listBidInfo d-flex justify-content-between align-items-center">
                                <p className="d-flex justify-content-center align-items-center">
                                    <span>{currencyFormat(product.buynowamount)}</span>
                                    {props.from == 'cart' ? (
                                        <>
                                            <span className="listDivider">|</span>
                                            <span>Unpaid</span>
                                        </>
                                    ) : null}
                                </p>
                            </div> */}
              {props.from == "buynowcart" ? (
                <>
                  <Button
                    className="removeCart"
                    onClick={() =>
                      props.changeOnCart({
                        cart_id: product.cart_id,
                        qty: product.qty,
                        product_id: product.projects_id,
                      })
                    }
                  >
                    {t("remove_from_cart")}
                  </Button>
                  <div className="updateCartQuantity">
                    <Button
                      disabled={formik.values.quantity <= 1}
                      onClick={() => {
                        formik.setFieldValue(
                          "quantity",
                          parseInt(formik.values.quantity) - 1
                        );
                      }}
                    >
                      <span className="material-icons">remove_circle</span>
                    </Button>
                    {Object.values(mapData(formikQuantity))}
                    <Button
                      onClick={() => {
                        formik.setFieldValue(
                          "quantity",
                          parseInt(formik.values.quantity) + 1
                        );
                      }}
                    >
                      <span className="material-icons">add_circle</span>
                    </Button>
                  </div>
                </>
              ) : props.from == "cart" ? (
                <>
                  {product.in_cart === 0 ? (
                    <Button
                      className="removeCart"
                      onClick={() =>
                        props.changeOnCart({
                          cart: 1,
                          id: product.projects_id,
                        })
                      }
                    >
                      {t("add_to_cart")}
                    </Button>
                  ) : (
                    <Button
                      className="removeCart"
                      onClick={() =>
                        props.changeOnCart({
                          cart: 0,
                          id: product.projects_id,
                        })
                      }
                    >
                      {t("remove_from_cart")}
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
export default CartItem;
