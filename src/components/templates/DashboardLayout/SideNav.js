import React, { useContext, useState, useEffect } from "react";
import { Divider, ListItem } from "@mui/material";
import { useHistory } from "react-router-dom";
import makeStyles from '@mui/styles/makeStyles';
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const SideNav = () => {
  const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => {
    if (expanded === panel) {
      setExpanded("");
    } else {
      setExpanded(panel);
    }
  };

  return (
    <div className="sideNav">
      <ul>
        <ListItem button>
          <Link activeClassName="active" href="/dashboard/profile">
            Profile
          </Link>
        </ListItem>
        <ListItem button>
          <Link activeClassName="active" href="/dashboard/watchlist">
            Watchlist
          </Link>
        </ListItem>
        <ListItem button>
          <Link activeClassName="active" href="/dashboard/myBids/0">
            My Bids
          </Link>
        </ListItem>
        <ListItem button>
          <Link activeClassName="active" href="/dashboard/notifications">
            My Notifications
          </Link>
        </ListItem>
        <ListItem button>
          <Link activeClassName="active" href="/dashboard/myTickets">
            My Tickets
          </Link>
        </ListItem>
        {/* <ListItem button>
          <Link activeClassName="active" href="/dashboard/savedCards">
            Saved Cards
          </Link>
        </ListItem> */}
        <ListItem button>
          <Link activeClassName="active" href="/dashboard/savedSearch">
            Saved Searches
          </Link>
        </ListItem>
      </ul>
    </div>
  );
};

export default SideNav;
