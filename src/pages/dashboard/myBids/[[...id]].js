import { Button } from "@mui/material";
import React, { useState } from "react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Won from "./Won";
import BidsDashboard from "./bidsDashboard";
import { useEffect } from "react";
import { useRouter } from "next/router";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function MyBids() {
  const router = useRouter();
  const id = router?.query?.id;

  const [auctionView, setAuctionView] = useState("List");
  const [value, setValue] = useState(id ? parseInt(id) : 0);
  const handleChange = (event, newValue) => {
    if (typeof window != "undefined") {
      router.push({
        pathname: `/dashboard/myBids/${newValue}`,
      });
    }
  };

  useEffect(() => {
    setValue(id ? parseInt(id) : 0);
  }, [router?.query.id]);

  return (
    <DashboardLayout
      title="MyBids"
      totalLots=""
      gridListToggle={
        <div className="gridListToggle">

          <Button
            className={auctionView === "Grid" ? "active" : ""}
            onClick={() => setAuctionView("Grid")}
          >
            <span className="material-icons">apps</span>Grid
          </Button>
          <Button
            className={auctionView === "List" ? "active" : ""}
            onClick={() => setAuctionView("List")}
          >
            <span className="material-icons">view_list</span>List
          </Button>
        </div>
      }
    >
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Active" {...a11yProps(0)} />
          <Tab label="Won" {...a11yProps(1)} />
          <Tab label="Lost" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <BidsDashboard auctionView={auctionView} type="active" />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Won auctionView={auctionView} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <BidsDashboard auctionView={auctionView} type="loss" />
      </TabPanel>
    </DashboardLayout>
  );
}

export default MyBids;
