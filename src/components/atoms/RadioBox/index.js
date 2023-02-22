import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { ListItem } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";

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
