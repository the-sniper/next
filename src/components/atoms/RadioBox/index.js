import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import { ListItem } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import withStyles from '@mui/styles/withStyles';

export const GreenRadio = withStyles({
  root: {
    color: "var(--primColor)",
    "&$checked": {
      color: "var(--primColor)",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

function RadioBox(props) {
  return (
    <div className="RadioBox">
      {props.customLabel ? (
        <RadioGroup
          aria-label={props.name}
          name={props.name}
          value={props.int === 1 ? parseInt(props.value) : props.value}
          onChange={props.onChange}
        >
          {props.items.map((d, i) => (
            <FormControlLabel
              value={props.int === 1 ? parseInt(d.id) : d.id}
              control={<GreenRadio />}
              className={props.value == d.id ? 'checked' : 'unChecked'}
              label={<div className="customCheckLabel">{d.description}</div>}
            />
          ))}
        </RadioGroup>
      ) : (
        <>
          <h6 className="radioTitle">{props.title}</h6>
          <RadioGroup
            aria-label={props.name}
            name={props.name}
            value={props.int === 1 ? parseInt(props.value) : props.value}
            onChange={props.onChange}
          >
            {props.items.map((d, i) => (
              <FormControlLabel
                value={props.int === 1 ? parseInt(d.id) : d.id}
                control={<GreenRadio />}
                label={d.description}
              />
            ))}
          </RadioGroup>
        </>
      )}
    </div>
  );
}

export default RadioBox;
