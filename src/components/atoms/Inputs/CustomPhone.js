import React, { useContext } from "react";
import MuiPhoneInput from "material-ui-phone-number";

const CustomPhone = (props) => {
  const shrink = props.shrink ? props.shrink.toString() : "false";
  return (
    <div className="customInput">
      {props.upperLabel ? (
        <>
          <label>{props.label}</label>
          <MuiPhoneInput
            value={props.value ? props.value : "+1"}
            autoFocus={props.autoFocus}
            name={props.name}
            onChange={props.onChange || props.onChange}
            InputProps={{
              inputProps: props.inputProps,
              startAdornment: props.startAdornment,
              shrink: shrink,
            }}
            id={props.id}
            type={props.type}
            size={props.size}
            disabled={props.disabled}
            variant="outlined"
            placeholder={props.placeholder}
            error={props.error}
            helperText={props.helperText}
            countryCodeEditable={props.countryCodeEditable}
          />
        </>
      ) : (
        <MuiPhoneInput
          value={props.value ? props.value : "+1"}
          autoFocus={props.autoFocus}
          name={props.name}
          onChange={props.onChange || props.onChange}
          InputProps={{
            inputProps: props.inputProps,
            startAdornment: props.startAdornment,
            shrink: shrink,
          }}
          id={props.id}
          label={props.label}
          type={props.type}
          size={props.size}
          disabled={props.disabled}
          variant="outlined"
          placeholder={props.placeholder}
          error={props.error}
          helperText={props.helperText}
          countryCodeEditable={props.countryCodeEditable}
        />
      )}
    </div>
  );
};

export default CustomPhone;
