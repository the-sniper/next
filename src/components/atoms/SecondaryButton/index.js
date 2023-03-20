import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      width: "100%",
      height: "60px",
    },
  },
}));

const SecondaryButton = (props) => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${props.btnSize} secButton`}>
      <Button
        variant="outlined"
        onClick={props.onClick}
        type={props.type}
        disabled={props.disabled}
      >
        {props.iconLeft}
        {props.label}
        {props.children}
      </Button>
    </div>
  );
};

export default SecondaryButton;
