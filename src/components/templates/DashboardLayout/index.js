import React, { useEffect, useState, useContext } from "react";
import { Button } from "@mui/material";
import SideNav from "./SideNav";
import { LOGO, SITE_NAME } from "../../../Utils";
import { Badge, Divider, ListItem, SwipeableDrawer } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";

const DashboardLayout = ({ title, gridListToggle, children, totalLots }) => {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const router = useRouter();
  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };
  const [state, setState] = useState({
    top: false,
    right: false,
  });
  return (
    <>
      <div className="dashboard customContainer">
        <div className="d-flex justify-content-start">
          <div className="dashboardLt">
            <SideNav />
            {/* <FilterPanel
            setSearch={setSearch}
            clearSearch={clearSearchFilter}
            search={search}
          /> */}
          </div>
          <div className="dashboardRt">
            <Button className="filterBtn" onClick={toggleDrawer("left", true)}>
              Dashboard Menu
            </Button>
            <div className="maTitle d-flex justify-content-between align-items-center w-100">
              <h2 className="dashTitle">
                {title}{" "}
                {totalLots && (
                  <span>
                    {totalLots} {totalLots < 2 ? "Lot" : "Lots"}
                  </span>
                )}
              </h2>
              {gridListToggle}
            </div>
            {children}
          </div>
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
          <div className="dasbord headRt respNav d-flex justify-content-start align-items-center">
            <div className="naLogoHead d-flex justify-content-between align-items-center">
              <Link href="/">
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
            <SideNav />
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default DashboardLayout;
