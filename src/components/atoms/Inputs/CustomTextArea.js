import React from "react";
import TextField from "@mui/material/TextField";

const CustomInput = (props) => {
  const shrink = props.shrink ? props.shrink.toString() : "false";
  return (
    <div className="customTextArea">
      {props.upperLabel ? (
        <>
          <label>{props.label}</label>
          <TextField
            multiline
            maxRows={4}
            rows={props.rows}
            value={props.value}
            autoFocus={props.autoFocus}
            name={props.name}
            onChange={props.onChange || props.onChange}
            onBlur={props.onBlur || props.onBlur}
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
          />
        </>
      ) : (
        <TextField
          multiline
          maxRows={4}
          rows={props.rows}
          value={props.value}
          autoFocus={props.autoFocus}
          name={props.name}
          onChange={props.onChange || props.onChange}
          onBlur={props.onBlur || props.onBlur}
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
        />
      )}
    </div>
  );
};

export default CustomInput;
