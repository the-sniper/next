import React, { useEffect, useState, useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import { Link, NavLink, useHistory } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { LOGO, SITE_NAME } from "../../../Utils";
import FilterPanel from "../../organisms/FilterPanel";
import { Button } from "@material-ui/core";
import PrimaryButton from "../../atoms/PrimaryButton";
import { Badge, Divider, ListItem, SwipeableDrawer } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import BuyerContext from "../../../context/buyer/buyerContext";
import AlertContext from "../../../context/alert/alertContext";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchField = (props) => {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const classes = useStyles();
  const { lotPriceChng, lotQtyChng, categories, category, sellers } =
    useContext(BuyerContext);
  const { setAlert } = useContext(AlertContext);
  const [searchText, setSearchText] = useState("");
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
    if (event.target.value === "") {
      props.clearSearch();
    }
  };
  const [searchLot, setSearchLot] = useState([]);

  const [search, setSearch] = useState({
    title: "",
    auctionId: "",
    localpickup: "",
    shipping: "",
    categoryId: "",
    country: "",
    page: 1,
    perpage: 15,
    auctionDate: "",
    date_closed: null,
    date_added: null,
    price: "",
  });
  const clearSearchFilter = () => {
    setSearch({
      ...search,
      title: "",
      auctionId: "",
      localpickup: "",
      shipping: "",
      categoryId: "",
      country: "",
      page: 1,
      perpage: 45,
      auctionDate: null,
    });
  };

  const [state, setState] = useState({
    top: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const handleSearchButtonClick = (event) => {
    props.setSearch({
      ...props.search,
      title: searchText,
    });
  };

  const handleSaveSearchButtonClick = (event) => {
    let categoryString = "";
    let sellernameString = "";
    let titleString = "";

    Object.keys(props.search).map((key) => {
      if (key === "categoryId" && props.search[key]?.length > 0) {
        categoryString = `${key}=${props.search[key].join(",")}`;
      }
      if (key === "sellername" && props.search[key]?.length > 0) {
        sellernameString = `${key}=${props.search[key].join(",")}`;
      }
      if (key === "title" && props.search[key]) {
        titleString = `${key}=${props.search[key]}`;
      }
    });

    if (categoryString || sellernameString || titleString) {
      let saveUrl =
        typeof window !== "undefined" && `${window.location.pathname}?`;
      if (categoryString) saveUrl += categoryString;
      if (sellernameString) saveUrl += `&${sellernameString}`;
      if (titleString) saveUrl += `&${titleString}`;
      props.handleSaveSearch(saveUrl);
    } else {
      setAlert("No search parameter set", "warning");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchButtonClick();
    }
  };
  const filterTabOpen = () => {
    categories(true);
  };
  const sellerTab = () => {
    sellers(true);
  };
  useEffect(() => {
    if (props.search) {
      setSearchText(props.search.title);
    }
  }, [props.search]);
  return (
    <>
      <div className="search-field">
        <div className={classes.root}>
          <AppBar className="seach-field-bar" position="static">
            <Toolbar>
              {/* <div className="searchFieldLt">
                <Button onClick={filterTabOpen}>
                  <span
                    className="material-icons"
                    onClick={toggleDrawer("left", true)}
                  >
                    menu
                  </span>
                  <span className="m-0 shopcatertxt">Shop by category</span>
                </Button>
                <Button onClick={filterTabOpen}>
                Lot {location.pathname === "/search" ? "Qty" : "Size"}
              </Button>
                <Button onClick={sellerTab}>Brands/Retailers</Button>
              </div> */}
              <div className="searchFieldRt">
                {props.handleSaveSearch && (
                  <div className="searchfilter-btn mr-2">
                    <PrimaryButton
                      label={<span class="material-icons">save</span>}
                      btnSize="small"
                      onClick={handleSaveSearchButtonClick}
                    />
                  </div>
                )}
                <div className="searchBar">
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    value={searchText}
                    onChange={handleSearchTextChange}
                    onKeyPress={handleKeyPress}
                    inputProps={{ "aria-label": "search" }}
                  />
                </div>
                <div className="searchfilter-btn ml-2">
                  <PrimaryButton
                    label="Search"
                    btnSize="small"
                    onClick={handleSearchButtonClick}
                  />
                </div>
                <div className="allCategory">
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Results per page
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      size="small"
                      autoWidth={true}
                      value={props.search.perpage || search.perpage}
                      onChange={(event, editor) => {
                        props.setSearch({
                          ...props.search,
                          perpage: event.target.value,
                        });
                      }}
                    >
                      <MenuItem value={15}>15</MenuItem>
                      <MenuItem value={30}>30</MenuItem>
                      <MenuItem value={45}>45</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </div>
      <React.Fragment>
        <SwipeableDrawer
          className="headerDrawer"
          anchor={"left"}
          open={state["left"]}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          disableSwipeToOpen={false}
          onClose={toggleDrawer("left", false)}
          onOpen={toggleDrawer("left", true)}
        >
          <div className="headRt respNav d-flex justify-content-start align-items-center">
            <div className="naLogoHead d-flex justify-content-between align-items-center">
              <Link to="/">
                <img src={LOGO} alt={SITE_NAME} />
              </Link>
              <Button
                className="headDrawerClose"
                onClick={toggleDrawer("left", false)}
              >
                <span className="material-icons">clear</span>
              </Button>
            </div>
            <Divider />
            <FilterPanel
              setSearch={setSearch}
              clearSearch={clearSearchFilter}
              search={search}
            />
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default SearchField;
