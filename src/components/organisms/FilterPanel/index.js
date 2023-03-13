import React, { useContext, useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RadioBox, { GreenRadio } from "@/components/atoms/RadioBox";
import { useFormik, Formik } from "formik";
import { Button } from "@material-ui/core";
import CheckBox from "@/components/atoms/CheckBox";
import CommonContext from "@/context/common/commonContext";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import BuyerContext from "@/context/buyer/buyerContext";
import AuctionContext from "@/context/auction/auctionContext";
import ProductContext from "@/context/product/productContext";
import moment from "moment";
import { useRouter } from "next/router";
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: "100%",
  },
  root: {
    width: 180 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));
const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);
const PrettoSlider = withStyles({
  root: {
    color: "#8b1558",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "#fff",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 50,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const FilterPanel = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState([null, null]);
  const [expanded, setExpanded] = React.useState("panel0");
  const [allSeller, setAllSeller] = useState([]);
  const { allCategory, allSellers } = useContext(CommonContext);
  const {
    lotPriceChng,
    lotQtyChng,
    lotPrice,
    lotQty,
    category,
    categories,
    seller,
    sellers,
  } = useContext(BuyerContext);
  const [locationValues, setLocationValues] = useState([]);

  const { search_allproducts, allLots, getSellerList, getAllSeller } =
    useContext(ProductContext);
  const { getAllSearchAuction, search_allauctions, getAuctionDetails } =
    useContext(AuctionContext);

  const router = useRouter();
  useEffect(() => {
    if (lotQty && router?.asPath === "/search") {
      setExpanded("panel3");
    }

    if (lotPrice && router?.asPath === "/auctions") {
      setExpanded("panel4");
    }
    if (category) {
      setExpanded("panel0");
      sellers(false);
    }
    if (seller) {
      setExpanded("panel1");
      categories(false);
    }
  }, [lotQty, lotPrice, category, seller]);
  useEffect(() => {
    getSellerList();
  }, []);
  useEffect(() => {
    if (getAllSeller && getAllSeller.length > 0) {
      var temp_array = [];
      getAllSeller?.map(
        (val) =>
          val.username &&
          temp_array.push({ id: val.id, description: val.username })
      );
      setAllSeller(temp_array);
    }
  }, [getAllSeller]);
  // console.log(allSeller);
  useEffect(() => {
    if (search_allauctions && Object.keys(search_allauctions).length !== 0) {
      // let cityState = search_allauctions.records.map((ele, i) => {
      //   return {
      //     id: i,
      //     state: ele.state,
      //     country: ele.country,
      //     city: ele.city,
      //   };
      // });
      // let result = cityState.reduce((unique, o) => {
      //   if (
      //     !unique.some(
      //       (obj) =>
      //         obj.state === o.state &&
      //         obj.country === o.country &&
      //         obj.city === o.city
      //     )
      //   ) {
      //     unique.push(o);
      //   }
      //   return unique;
      // }, []);
      // setLocationValues(result);
      // console.log(result, "result");
      // console.log(cityState, "cityState");
    }
  }, [search_allauctions, allLots]);
  const formik = useFormik({
    initialValues: {
      title: "",
      auctionId: "",
      localpickup: "",
      shipping: "",
      categoryId: [],
      subCategoryId: [],
      conditionId: [],
      country: "",
      sellername: [],
      seller_id: [],
      locations: [],
      price: "",
      auctionDate: null,
      auctionEndDate: null,
      auction_type: [],
      type: 2,
    },
  });

  useEffect(() => {
    if (props.search) {
      let searchValue = props.search;

      if (searchValue?.categoryId?.length > 0) {
        formik.values.categoryId = searchValue.categoryId.map((cat) => {
          return cat.toString();
        });
      } else {
        formik.values.categoryId = [];
      }
      if (searchValue?.sellername?.length > 0) {
        formik.values.sellername = searchValue.sellername.map((cat) => {
          return cat.toString();
        });
      } else {
        formik.values.sellername = [];
      }

      if (searchValue?.auction_type?.length > 0) {
        formik.values.auction_type = searchValue.auction_type.map((cat) => {
          return cat.toString();
        });
      } else {
        formik.values.auction_type = [];
      }

      if (
        searchValue &&
        !Boolean(searchValue.auctionDate) &&
        !Boolean(searchValue.auctionEndDate)
      ) {
        formik.setFieldValue("auctionDate", null);
        formik.setFieldValue("auctionEndDate", null);
      } else if (searchValue) {
        formik.setFieldValue("auctionDate", props.search.auctionDate);
        formik.setFieldValue("auctionEndDate", props.search.auctionEndDate);
      }
    }
  }, [props.search]);

  useEffect(() => {
    props.setSearch({
      ...props.search,
      ...formik.values,
      page: 1,
    });
  }, [formik.values]);

  useEffect(() => {
    if (props && props.history && props.search) {
      let cartUrl = new URLSearchParams(props.location.search);
      cartUrl.set("catgId", props.search.categoryId?.toString());
      if (typeof window !== "undefined") {
        window.history.replaceState(
          "",
          "",
          "/auctions" + `?${cartUrl?.toString()}`
        );
      }
    }
  }, [props.search]);

  const filterValues = [
    {
      title: "Category",
      type: "check",
      name: "categoryId",
      show: true,
      item:
        allCategory?.length > 0 &&
        allCategory.filter((cat) => {
          if (cat.parent_id === 0) {
            return true;
          }
        }),
    },
    // {
    //   title: "Sub category",
    //   type: "check",
    //   name: "subCategoryId",
    //   item: allCategory.filter((cat) => {
    //     if (
    //       cat.parent_id !== 0 &&
    //       formik &&
    //       formik.values.filters &&
    //       formik.values.filters.category.value &&
    //       formik.values.filters.category.value.length
    //         ? formik.values.filters.category.value.includes(
    //             cat.parent_id.toString()
    //           )
    //         : false
    //     ) {
    //       return true;
    //     }
    //   }),
    // },

    {
      title: "Seller",
      type: "check",
      show: true,
      name: "seller_id",
      item: allSeller,
    },
    // {
    //   title: "Location",
    //   type: "check",
    //   name: "locations",
    //   item: locationValues && locationValues.length > 0 ? locationValues : [],
    //   show: true,
    // },
    {
      title: "Auction Type",
      type: "check",
      name: "auction_type",
      show: router?.asPath.includes("/auctions") ? true : false,
      item: [
        { id: 1, description: "Live Auction" },
        { id: 0, description: "Timed Auction" },
      ],
    },
    {
      title: "Lot type",
      type: "radio",
      name: "type",
      show: !router?.asPath?.includes("/auctions"),
      item: [
        { id: 2, description: "All" },
        { id: 1, description: "Auction" },
        { id: 0, description: "Buy Now" },
      ],
    },
    {
      title: "Date Range",
      type: "date",
      name: "dateRange",
      item: [
        {
          id: 0,
          defaultValue: null,
          name: "Start Date",
          valueName: "auctionDate",
        },
        {
          id: 1,
          defaultValue: null,
          name: "End Date",
          valueName: "auctionEndDate",
        },
      ],
      show: router?.asPath.includes("/auctions") ? true : false,
    },
    // {
    //   title: "Lot Size",
    //   type: "slider",
    //   name: "lotSize",
    //   item: [{ id: 1, defaultValue: new Date(), name: "End Date" }],
    //   show: router?.asPath === "/auctions" ? true : false,
    // },
    // {
    //   title: "Quantity",
    //   type: "slider",
    //   name: "quantity",
    //   item: [{ id: 1, defaultValue: formik.va, name: "End Date" }],
    //   show: router?.asPath === "/search" ? true : false,
    // },

    {
      title: "Price",
      type: "radio",
      name: "price",
      show: router?.route === "/search" ? true : false,
      item: [
        { id: 0, description: "All" },
        { id: 100, description: "$100 - $499" },
        { id: 500, description: "$500 - $999" },
        { id: 1000, description: "$1000 - $1,499" },
        { id: 1500, description: "$1,500 - $1,999" },
        { id: 2000, description: "$2000 and above" },
      ],
    },
  ];
  const handleChange = (panel) => (event, newExpanded) => {
    if (panel === expanded && !newExpanded) {
      setExpanded(newExpanded ? panel : false);
      lotQtyChng(false);
      lotPriceChng(false);
      categories(false);
      sellers(false);
    } else {
      setExpanded(newExpanded ? panel : false);
      lotQtyChng(false);
      lotPriceChng(false);
      categories(false);
      sellers(false);
    }
  };
  const clearSearchValue = () => {
    setExpanded("panel0");
    props.clearSearch();
  };

  return (
    <div className="filterPanel">
      {console.log(router, "router?.asPath")}
      <div className="d-flex justify-content-between align-items-center filterTitleCnt">
        <h4 className="fpTitle">Refine your search</h4>
        {props.clearSearch && (
          <Button onClick={() => clearSearchValue()} className="filterClear">
            <span className="material-icons">cancel</span>
            Clear all
          </Button>
        )}
      </div>
      <div className="filterAcc">
        {filterValues
          .filter((ele) => {
            return ele.show;
          })
          .map((data, index) => (
            <Accordion
              square
              key={index}
              expanded={
                expanded === `panel${index}`
                // || formik.values[data.name].length > 0
              }
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1d-content"
                id={`panel${index}d-header`}
              >
                <h6 className="accTitle">{data.title}</h6>
              </AccordionSummary>
              <AccordionDetails>
                {data.item && data.item.length > 0 ? (
                  <div className="filterCheck d-flex align-items-center flex-wrap">
                    {data.type === "check" ? (
                      <>
                        {data.item.map((d, i) => (
                          <>
                            <CheckBox
                              name={data.name}
                              label={
                                data.name === "categoryId"
                                  ? `${d.name}`
                                  : data.name === "locations"
                                  ? `${d.state},${d.city},${d.country}`
                                  : d.description
                              }
                              checked={
                                formik.values[data.name].indexOf(
                                  d.id.toString()
                                ) !== -1
                                  ? true
                                  : false
                              }
                              value={d.id.toString()}
                              onChange={formik.handleChange}
                            />
                          </>
                        ))}
                      </>
                    ) : data.type === "date" ? (
                      <>
                        <form className={classes.container} noValidate>
                          {data.item.map((ele) => (
                            <TextField
                              id="date"
                              label={ele.name}
                              type="datetime-local"
                              name={ele.valueName}
                              // className="date-range"
                              // defaultValue={new Date()}
                              value={formik.values[ele.valueName]}
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={formik.handleChange}
                            />
                          ))}
                        </form>
                      </>
                    ) : data.type === "slider" ? (
                      <div className={classes.root}>
                        <PrettoSlider
                          valueLabelDisplay="auto"
                          aria-label="pretto slider"
                          defaultValue={20}
                        />
                      </div>
                    ) : (
                      <>
                        <RadioBox
                          items={data.item}
                          value={formik.values[data.name]}
                          onChange={formik.handleChange}
                          name={`${data.name}`}
                          int={1}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <small>{`No ${data.title} found`}</small>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
    </div>
  );
};
export default FilterPanel;
