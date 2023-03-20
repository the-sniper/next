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

const PrimaryButton = (props) => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${props.btnSize} primButton`}>
      <Button
        variant="contained"
        id={props.id}
        onClick={props.onClick}
        disabled={props.disabled}
        type={props.type}
        className={props.className}
        onKeyUp={props.onKeyUp}
      >
        {props.iconLeft}
        {props.label}
        {props.children}
      </Button>
    </div>
  );
};

export default PrimaryButton;
