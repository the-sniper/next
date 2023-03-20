import React from "react";
import withStyles from '@mui/styles/withStyles';
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";

import { ListItem, Tooltip } from "@mui/material";

const GreenCheckbox = withStyles({
  root: {
    color: "var(--primColor)",
    "&$checked": {
      color: "var(--primColor)",
    },
    MuiFormControlLabelRoot: {
      marginBottom: 0,
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const CheckBox = (props) => {
  return (
    <div className="customCheckbox">
      {props.customLabel ? (
        <>
          <FormGroup row>
            <Tooltip title={props.label}>
              <FormControlLabel
                control={
                 <>
                  <GreenCheckbox
                    name={props.name}
                    checked={props.checked}
                    value={props.value}
                    onChange={props.onChange ? (e) => props.onChange(e) : null}
                  />
                  <div className="customCheckLabel">{props.labelData}</div>
                  </>
                }
              />
            </Tooltip>
          </FormGroup>
          <FormHelperText>{props.error}</FormHelperText>
        </>
      ) : (
        <>
          <FormGroup row>
            <FormControlLabel
              control={
                <GreenCheckbox
                  name={props.name}
                  checked={props.checked}
                  value={props.value}
                  onChange={props.onChange ? (e) => props.onChange(e) : null}
                />
              }
              label={<ListItem button>{props.label}</ListItem>}
            />
          </FormGroup>
          <FormHelperText>{props.error}</FormHelperText>
        </>
      )}
    </div>
  );
};

export default CheckBox;
