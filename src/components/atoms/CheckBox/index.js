import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";

import { ListItem, Tooltip } from "@material-ui/core";

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
