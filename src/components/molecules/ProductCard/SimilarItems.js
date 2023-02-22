import { Button } from "@material-ui/core";
import React, { useState, useRef, useEffect, useContext } from "react";
import CustomInput from "../../atoms/Inputs/CustomInput";
import { useHistory } from "react-router-dom";
import PrimaryButton from "../../atoms/PrimaryButton";
import { dateFormatFront } from "../../../common/components";
import CommonContext from "../../../context/common/commonContext";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const SimilarItem = (props) => {
  const commonContext = useContext(CommonContext);
  const { setBidHistoryValue } = commonContext;

  const [product, setProduct] = useState();
  const history = useHistory();

  useEffect(() => {
    setProduct(props.data);
  }, [props.data]);

  return (
    <div className="similarItem d-flex justify-content-start align-items-start">
      {product ? (
        <div
          onClick={() =>
            document
              .getElementById("productView")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          <Button onClick={() => props.drawerHandler(props.data)}>
            <div className="pclImg">
              <LazyLoadImage
                src={product.avatarorg}
                alt={product.title}
                onError={(e) => noImageAvailable(e)}
                effect="blur"
                placeholderSrc="assets/svg/imageLoading.svg"
                height="100%"
                width="100%"
              />
            </div>
            <div className="listContent">
              <h2 onClick={props.drawerHandler} className="listProdTitle">
                {product.title}
              </h2>
              <div className="listLotInfo d-flex justify-content-start align-items-center">
                <h5>Lot # {product.item_id}</h5>
                <span className="listDivider">|</span>
                <h5>{product.allattachmentlist.length} Photos</h5>
              </div>
              <div className="listLotDetails">
                <p>NOTES: {product.nellisnotes}</p>
              </div>
            </div>
          </Button>
        </div>
      ) : null}
    </div>
  );
};
export default SimilarItem;
