import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { socket } from "./socket.js";
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import CustomSelect from "../components/atoms/Inputs/CustomSelect";
import CustomMultiSelect from "../components/atoms/Inputs/CustomMultiSelect";
import RadioBox from "../components/atoms/RadioBox";

import MenuItem from "@material-ui/core/MenuItem";
import CustomInput from "../components/atoms/Inputs/CustomInput";
import GooglePlaceAutoComplete from "../components/atoms/Inputs/GooglePlaceAutoComplete";
import CustomPhone from "../components/atoms/Inputs/CustomPhone.js";
import PasswordStrength from "./passwordStrength";

import CheckBox from "../components/atoms/CheckBox";
import CustomTextArea from "../components/atoms/Inputs/CustomTextArea";
import CKEditor from "ckeditor4-react";
import Uploader from "../common/uploader";

import FormHelperText from "@material-ui/core/FormHelperText";
import CustomAutocomplete from "../components/atoms/Inputs/CustomAutocomplete.js";
import { Checkbox } from "@material-ui/core";
import { ListItemText } from "@material-ui/core";

// import { CKEditor } from '@ckeditor/ckeditor5-react'
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

let serverTime = new Date();
const monthFormat = "YYYY-MM";
const dateFormat = "MM-DD-YYYY";
const dateTimeFormat = "MM-DD-YYYY h:mm a";
const timeFormat = "h:mm a";

if (socket) {
  socket.on("sliservertime", (data) => {
    if (moment(data.dTime).isValid()) {
      serverTime = new Date(data.dTime);
    }
  });
}

const errorCheck = (data, formik) => {
  return data.filter &&
    formik &&
    formik.touched &&
    formik.touched.filters &&
    formik.touched.filters[data.name] &&
    formik.errors &&
    formik.errors.filters &&
    formik.errors.filters[data.name]
    ? formik.errors.filters[data.name]
    : formik.touched[data.name] && formik.errors[data.name];
};

const multiSelectValue = (data, formik) => {
  return data.filter
    ? formik.values.filters[data.name].value.length <= data.options.length
      ? data.options
          .filter((d) =>
            formik.values.filters[data.name].value.length
              ? !formik.values.filters[data.name].value.includes(d.value)
              : true
          )
          .map((d) => d.value)
          .flat()
      : (formik.values.filters[data.name].value.length = 0 && null)
    : formik.values[data.name].length <= data.options.length
    ? data.options
        .filter((d) =>
          formik.values[data.name].length
            ? !formik.values[data.name].includes(d.value)
            : true
        )
        .map((d) => d.value)
        .flat()
    : (formik.values[data.name].length = 0 && null);
};

const helperText = (data, formik) => {
  return data.filter &&
    formik &&
    formik.touched &&
    formik.touched.filters &&
    formik.touched.filters[data.name] &&
    formik.errors &&
    formik.errors.filters &&
    formik.errors.filters[data.name]
    ? formik.errors.filters[data.name]
    : formik.touched[data.name] && formik.errors[data.name];
};

export const converDateTime = (data) => {
  let dataReturn = null;
  if (data) {
    if (moment(data).isValid()) {
      dataReturn = `${moment(data).format(dateTimeFormat)}`;
    }
  }
  return dataReturn;
};

export const converDate = (data) => {
  let dataReturn = "";
  if (data) {
    if (moment(data).isValid()) {
      dataReturn = `${moment(data).format(dateFormat)}`;
    }
  }
  return dataReturn;
};

export const getImages_url_check = (img, flag) => {
  var img_flag = flag;
  if (parseInt(img_flag) != 0 || img_flag == undefined) {
    return `${global.images_url}${img}`;
  } else {
    return `${process.env.NEXT_PUBLIC_FORWARD_DOMAIN}/uploads/product/${img}`;
    //return `https://forwardapidev.auctionsoftware.com/uploads/product/${img}`
  }
};

export const mapData = (page) => {
  let formik = page.formik ? page.formik : page[0].formik;
  let pageData = page.data ? page.data : page;

  let data = pageData.map((data, index) => (
    <>
      <div key={index} className={data.class}>
        {data.type === "select" ? (
          <>
            <CustomSelect
              label={data.label}
              id={data.id}
              value={
                data.filter
                  ? formik.values.filters[data.name].value
                  : formik.values[data.name]
              }
              autoFocus={data.autoFocus}
              name={data.filter ? `filters.${data.name}.value` : data.name}
              size={data.size}
              onChange={data.onChange ? data.onChange : formik.handleChange}
              placeholder={data.placeholder}
              disabled={data.disabled}
              onBlur={formik.handleBlur}
              type={data.type}
              error={errorCheck(data, formik)}
              helperText={helperText(data, formik)}
            >
              {!data.isNoDefaultOptionValue && (
                <option value="">{data.placeholder}</option>
              )}
              {data.options &&
                data.options.map((opt, optindex) => (
                  <option key={optindex} value={opt.value}>
                    {opt.show}
                  </option>
                ))}

              {data.groupoptions &&
                data.groupoptions.map((opt, optindex) => (
                  <>
                    <optgroup label={opt.head}>
                      <>
                        {opt.options.map((opt, optindex) => (
                          <option key={optindex} value={opt.value}>
                            {opt.show}
                          </option>
                        ))}
                      </>
                    </optgroup>
                  </>
                ))}
            </CustomSelect>
          </>
        ) : data.type === "autocomplete" ? (
          <>
            <CustomAutocomplete
              label={data.label}
              id={data.id}
              value={
                data.filter
                  ? formik.values.filters[data.name].value
                  : formik.values[data.name]
              }
              autoFocus={data.autoFocus}
              name={data.filter ? `filters.${data.name}.value` : data.name}
              size={data.size}
              onChange={(val) => {
                data.filter
                  ? formik.setFieldValue(`filters.${data.name}.value`, val)
                  : formik.setFieldValue(data.name, val);
              }}
              placeholder={data.placeholder}
              disabled={data.disabled}
              onBlur={formik.handleBlur}
              options={data.options}
              type={data.type}
              error={errorCheck(data, formik)}
              helperText={helperText(data, formik)}
            />
          </>
        ) : data.type === "misc" ? (
          <>{data.content}</>
        ) : data.type === "switch" ? (
          <>
            <FormGroup row className="partialPaymentToggle">
              <FormControlLabel
                label={data.label}
                control={
                  <Switch
                    checked={formik.values[data.name]}
                    onChange={formik.handleChange}
                    name={data.name}
                    color={data.color}
                  />
                }
              />
            </FormGroup>
          </>
        ) : data.type === "check" ? (
          <>
            {data.options &&
              data.options.map((opt, optindex) => (
                <>
                  <div className="checkbox-outer-wrapper">
                    {opt.outerProps}
                    <CheckBox
                      key={optindex}
                      // id={opt.id.toString()}
                      name={data.name}
                      disabled={data.disabled}
                      label={opt.description ? opt.description : ""}
                      customLabel={data.customLabel}
                      labelData={opt.labelData}
                      checked={
                        formik.values[data.name].indexOf(opt.id.toString()) !==
                        -1
                      }
                      value={opt.id.toString()}
                      // value={opt.value.toString()}
                      onChange={formik.handleChange}
                    />
                  </div>
                </>
              ))}
            <div className="checkboxError">
              <FormHelperText>
                {formik.errors[data.name] &&
                  formik.touched[data.name] &&
                  formik.errors[data.name]}
              </FormHelperText>
            </div>
          </>
        ) : data.type === "uploadDropZone" ? (
          <>
            <Uploader
              formik={formik}
              name={data.name}
              icon={data.icon}
              titleText={data.titleText}
              innerText={data.innerText}
              folder={data.folder}
              multiple={data.multiple}
              accept={data.accept}
            ></Uploader>
          </>
        ) : data.type === "phone" ? (
          <>
            <CustomPhone
              id={data.id}
              value={formik.values[data.name]}
              autoFocus={data.autoFocus}
              name={data.name}
              disabled={data.disabled}
              shrink={formik.values[data.name] && true}
              onBlur={formik.handleBlur}
              onChange={(phone) => formik.setFieldValue(data.name, phone)}
              label={data.label}
              placeholder={data.placeholder}
              type={data.type}
              error={formik.touched[data.name] && formik.errors[data.name]}
              helperText={
                formik.errors[data.name] &&
                formik.touched[data.name] &&
                formik.errors[data.name]
              }
              countryCodeEditable={data.countryCodeEditable}
              size={data.size}
              upperLabel={data.upperLabel}
            />
          </>
        ) : data.type === "multiselect" ? (
          <>
            <CustomMultiSelect
              label={data.label}
              id={data.id}
              value={
                data.filter
                  ? formik.values.filters[data.name].value
                  : formik.values[data.name]
              }
              autoFocus={data.autoFocus}
              name={data.filter ? `filters.${data.name}.value` : data.name}
              onChange={(event, value) => {
                let arrayValue = event.target.value.flat();
                let allLength = data.filter
                  ? formik.values.filters[data.name].value.length ===
                    data.options.length
                  : formik.values[data.name].length === data.options.length;
                if (allLength && arrayValue.length === data.options.length) {
                  arrayValue = [];
                }
                data.filter
                  ? formik.setFieldValue(
                      `filters.${data.name}.value`,
                      arrayValue
                    )
                  : formik.setFieldValue(data.name, arrayValue);
              }}
              placeholder={data.placeholder}
              onBlur={formik.handleBlur}
              disabled={data.disabled}
              type={data.type}
              error={errorCheck(data, formik)}
              helperText={helperText(data, formik)}
              options={data.options}
            >
              <MenuItem value={multiSelectValue(data, formik)}>
                <Checkbox
                  checked={
                    data.filter
                      ? formik.values.filters[data.name].value?.flat().length ==
                        data.options.length
                        ? true
                        : false
                      : formik.values[data.name]?.flat().length ==
                        data.options.length
                      ? true
                      : false
                  }
                  onChange={(val) => {
                    val.target.checked
                      ? data.filter
                        ? formik.setFieldValue(
                            `filters.${data.name}.value`,
                            formik.values.filters[data.name].value.concat(
                              multiSelectValue(data, formik)
                            )
                          )
                        : formik.setFieldValue(
                            data.name,
                            formik.values[data.name].concat(
                              multiSelectValue(data, formik)
                            )
                          )
                      : data.filter
                      ? formik.setFieldValue(`filters.${data.name}.value`, [])
                      : formik.setFieldValue(data.name, []);
                  }}
                />
                <ListItemText primary={"All"} />
              </MenuItem>
              {data.options.map((opt, optindex) => (
                <MenuItem key={optindex} value={opt.value}>
                  <Checkbox
                    checked={
                      data.filter
                        ? formik?.values?.filters[data.name].value
                            ?.flat()
                            .indexOf(opt.value) > -1
                        : formik?.values[data.name]?.flat().indexOf(opt.value) >
                          -1
                    }
                    onChange={
                      data.onChange ? data.onChange : formik.handleChange
                    }
                  />
                  {opt.show}
                </MenuItem>
              ))}
            </CustomMultiSelect>
          </>
        ) : data.type === "ckeditor" ? (
          <>
            {/* <CKEditor
                        editor={ClassicEditor}
                        data={formik.values[data.name] ? formik.values[data.name] : ''}
                        onChange={(event, editor) => {
                            formik.setFieldValue(data.name, editor.getData())
                        }}
                    /> */}
            <CKEditor
              config={{
                allowedContent: true,
              }}
              type="classic"
              data={formik.values[data.name]}
              onChange={(event, editor) => {
                formik.setFieldValue(data.name, event.editor.getData());
              }}
            />
            <div className="checkboxError">
              <FormHelperText>
                {formik.errors[data.name] &&
                  formik.touched[data.name] &&
                  formik.errors[data.name]}
              </FormHelperText>
            </div>
          </>
        ) : data.type === "password_checker" ? (
          <>
            <PasswordStrength data={data} />
          </>
        ) : data.type === "date" ? (
          <>
            <KeyboardDatePicker
              margin="0"
              autoOk={true}
              showTodayButton={true}
              id={data.name}
              inputVariant="outlined"
              label={data.label}
              format={dateFormat}
              disabled={data.disabled}
              disableFuture={data.disableFuture || false}
              disablePast={data.disablePast || false}
              maxDate={data.maxDate || moment("01-01-2100").format(dateFormat)}
              maxDateMessage={
                data.maxDateMessage || "Date should not be after maximal date"
              }
              minDate={data.minDate || moment("01-01-1900").format(dateFormat)}
              minDateMessage={
                data.minDateMessage || "Date should not be before minimal date"
              }
              className="customDatepicker"
              value={
                data.filter
                  ? formik.values.filters[data.name].value || null
                  : formik.values[data.name] || null
              }
              inputValue={
                data.filter
                  ? formik.values.filters[data.name].value || null
                  : formik.values[data.name] || null
              }
              onChange={(val) => {
                data.filter
                  ? formik.setFieldValue(
                      `filters.${data.name}.value`,
                      converDate(val)
                    )
                  : formik.setFieldValue(data.name, converDate(val));
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              error={formik.touched[data.name] && formik.errors[data.name]}
              helperText={
                formik.errors[data.name] &&
                formik.touched[data.name] &&
                formik.errors[data.name]
              }
            />
          </>
        ) : data.type === "dateWithCustomPicker" ? (
          <>
            <KeyboardDatePicker
              margin="0"
              autoOk={true}
              showTodayButton={true}
              id={data.name}
              open={data.open}
              onOpen={data.onOpen ? data.onOpen : null}
              onClose={data.onClose ? data.onClose : null}
              inputVariant="outlined"
              label={data.label}
              format={dateFormat}
              disabled={data.disabled}
              disableFuture={data.disableFuture || false}
              disablePast={data.disablePast || false}
              maxDate={data.maxDate || moment("01-01-2100").format(dateFormat)}
              maxDateMessage={
                data.maxDateMessage || "Date should not be after maximal date"
              }
              minDate={data.minDate || moment("01-01-1900").format(dateFormat)}
              minDateMessage={
                data.minDateMessage || "Date should not be before minimal date"
              }
              className="customDatepicker"
              value={
                data.filter
                  ? formik.values.filters[data.name].value || null
                  : formik.values[data.name] || null
              }
              inputValue={
                data.filter
                  ? formik.values.filters[data.name].value || null
                  : formik.values[data.name] || null
              }
              onChange={(val) => {
                data.filter
                  ? formik.setFieldValue(
                      `filters.${data.name}.value`,
                      converDate(val)
                    )
                  : formik.setFieldValue(data.name, converDate(val));
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              error={formik.touched[data.name] && formik.errors[data.name]}
              helperText={
                formik.errors[data.name] &&
                formik.touched[data.name] &&
                formik.errors[data.name]
              }
            />
          </>
        ) : data.type === "month" ? (
          <>
            <KeyboardDatePicker
              margin="0"
              autoOk={true}
              openTo="year"
              views={["year", "month"]}
              showTodayButton={true}
              id={data.name}
              inputVariant="outlined"
              label={data.label}
              disablePast={data.disablePast || false}
              maxDate={data.maxDate || moment("01-01-2100").format(dateFormat)}
              maxDateMessage={
                data.maxDateMessage || "Date should not be after maximal date"
              }
              minDate={data.minDate || moment("01-01-1900").format(dateFormat)}
              minDateMessage={
                data.minDateMessage || "Date should not be before minimal date"
              }
              format={monthFormat}
              disabled={data.disabled}
              className="customDatepicker"
              value={formik.values[data.name]}
              inputValue={formik.values[data.name]}
              onChange={(val) => {
                formik.setFieldValue(
                  data.name,
                  moment(val).format(monthFormat)
                );
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              error={formik.touched[data.name] && formik.errors[data.name]}
              helperText={
                formik.errors[data.name] &&
                formik.touched[data.name] &&
                formik.errors[data.name]
              }
            />
          </>
        ) : data.type === "datetime" ? (
          <>
            <KeyboardDateTimePicker
              margin="0"
              autoOk={true}
              showTodayButton={true}
              id={data.name}
              inputVariant="outlined"
              label={data.label}
              format={dateTimeFormat}
              disabled={data.disabled}
              disablePast={data.disablePast || false}
              maxDate={data.maxDate || moment("01-01-2100").format(dateFormat)}
              maxDateMessage={
                data.maxDateMessage || "Date should not be after maximal date"
              }
              minDate={data.minDate || moment("01-01-1900").format(dateFormat)}
              minDateMessage={
                data.minDateMessage || "Date should not be before minimal date"
              }
              className="customDatepicker"
              value={formik.values[data.name]}
              inputValue={formik.values[data.name]}
              onChange={(val) => {
                formik.setFieldValue(data.name, converDateTime(val));
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              error={formik.touched[data.name] && formik.errors[data.name]}
              helperText={
                formik.errors[data.name] &&
                formik.touched[data.name] &&
                formik.errors[data.name]
              }
            />
          </>
        ) : data.type === "time" ? (
          <>
            <KeyboardTimePicker
              margin="0"
              autoOk={true}
              id={data.name}
              inputVariant="outlined"
              label={data.label}
              disabled={data.disabled}
              disablePast={data.disablePast || false}
              className="customDatepicker"
              value={formik.values[data.name]}
              inputValue={formik.values[data.name]}
              onChange={(val) => {
                formik.setFieldValue(data.name, moment(val).format(timeFormat));
              }}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
              error={formik.touched[data.name] && formik.errors[data.name]}
              helperText={
                formik.errors[data.name] &&
                formik.touched[data.name] &&
                formik.errors[data.name]
              }
            />
          </>
        ) : data.type === "textarea" ? (
          <>
            <CustomTextArea
              id={data.id}
              value={formik.values[data.name]}
              autoFocus={data.autoFocus}
              name={data.name}
              disabled={data.disabled}
              shrink={formik.values[data.name] && true}
              onBlur={formik.handleBlur}
              onChange={data.onChange ? data.onChange : formik.handleChange}
              label={data.label}
              placeholder={data.placeholder}
              type={data.type}
              error={formik.touched[data.name] && formik.errors[data.name]}
              helperText={
                formik.errors[data.name] &&
                formik.touched[data.name] &&
                formik.errors[data.name]
              }
              upperLabel={data.upperLabel}
              size={data.size}
              rows={data.rows}
            />
          </>
        ) : data.type === "checkbox" ? (
          <>
            <div className="chkBxWrpr">
              <CheckBox
                checked={formik.values[data.name]}
                label={data.label}
                value={true}
                disabled={data.disabled}
                onChange={() => {
                  formik.setFieldValue(data.name, !formik.values[data.name]);
                }}
                name={data.name}
                error={formik.touched[data.name] && formik.errors[data.name]}
                helperText={
                  formik.errors[data.name] &&
                  formik.touched[data.name] &&
                  formik.errors[data.name]
                }
              />
            </div>
          </>
        ) : data.type === "checkboxarray" ? (
          data.item.map((d, i) => (
            <>
              <CheckBox
                name={data.name}
                label={d.description}
                checked={
                  formik.values[data.name].indexOf(d.id.toString()) !== -1
                    ? true
                    : false
                }
                value={d.id.toString()}
                onChange={formik.handleChange}
              />
            </>
          ))
        ) : data.type === "google_place_autocomplete" ? (
          <GooglePlaceAutoComplete
            id={data.id}
            name={data.name}
            value={data.formik.values[data.name]}
            formik={data.formik}
            label={data.label}
            googlePlaceType={data.googlePlaceType}
            error={
              data.formik.touched[data.name] && data.formik.errors[data.name]
            }
            helperText={
              data.formik.errors[data.name] &&
              data.formik.touched[data.name] &&
              data.formik.errors[data.name]
            }
          />
        ) : data.type === "radio" ? (
          <>
            <RadioBox
              error={formik.touched[data.name] && formik.errors[data.name]}
              helperText={
                formik.errors[data.name] &&
                formik.touched[data.name] &&
                formik.errors[data.name]
              }
              title={data.title}
              name={data.name}
              items={data.item}
              value={formik.values[data.name]}
              onChange={formik.handleChange}
              customLabel={data.customLabel}
              int={data.int}
            />
          </>
        ) : (
          <>
            <CustomInput
              id={data.id}
              value={
                data.filter
                  ? formik.values.filters[data.name].value
                  : formik.values[data.name]
              }
              autoFocus={data.autoFocus}
              name={data.filter ? `filters.${data.name}.value` : data.name}
              disabled={data.disabled}
              shrink={
                data.filter
                  ? formik.values.filters[data.name].value
                    ? true
                    : false
                  : formik.values[data.name]
                  ? true
                  : false
              }
              onBlur={formik.handleBlur}
              onChange={data.onChange ? data.onChange : formik.handleChange}
              label={data.label}
              placeholder={data.placeholder}
              type={data.type}
              variant={data.variant ? data.variant : "outlined"}
              size={data.size}
              startAdornment={data.startAdornment}
              endAdornment={data.endAdornment}
              error={errorCheck(data, formik)}
              helperText={helperText(data, formik)}
              inputStyle={data.inputStyle}
              upperLabel={data.upperLabel}
              min={data.min}
              step={data.step}
            />
          </>
        )}
      </div>
    </>
  ));
  return data;
};

export const handleRedirectInternal = (history, path, search) => {
  history.push({ pathname: `/${path}`, search: search ? search : "" });
  if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
};

export const dateFormatFront = (data) => {
  return moment(data).isValid()
    ? `${moment(data).format("MMM Do")}, ${moment(data).format("h:mm a")}`
    : "-";
};

export const dateFormatFrontDay = (data) => {
  return `${moment(data).format("MMM Do YYYY")}`;
};

export const checkProductOpen = (date_added, user_role) => {
  let startDate = new Date(serverTime);
  let addDate = new Date(date_added);
  let milliSeconds = 0;
  // if (parseInt(user_role) !== 3) {
  //   milliSeconds = 1 * 3600000;
  // } else {
  // }
  let incrementedTime = addDate.getTime() + parseInt(milliSeconds);
  let newaddDate = new Date(incrementedTime);
  if (newaddDate > startDate) {
    return false;
    // let incrementedTime = addDate.getTime() + parseInt(milliSeconds);
    // let timerTime = incrementedTime - startDate.getTime();
    // if (timerTime <= 0) {
    //   return true;
    // } else {
    //   return false;
    // }
  } else {
    return true;
  }
};

export const maskEmailFront = (data) => {
  data = data.toString();
  var first4 = data.substring(0, 4);
  var last5 = data.substring(data.length - 5);
  var mask = data.substring(4, data.length - 5).replace(/[^]/g, "*");
  return first4 + mask + last5;
};

export const capitalize = (data) => {
  let dataReturn = "-";
  if (data) {
    data = data.replace(/_/g, " ").toLowerCase();
    data.split(" ");
    if (data instanceof Array) {
      dataReturn = data
        .map((word) => {
          return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ");
    } else {
      dataReturn = data.charAt(0).toUpperCase() + data.slice(1);
    }
  }
  return dataReturn;
};

export const currencyFormat = (data) => {
  let dataReturn = "US $0";
  if (data) {
    dataReturn = `US ${parseFloat(data).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}`;
  }
  return dataReturn;
};

export const dateFormatFunction = (data) => {
  let dataReturn = "-";
  if (data) {
    if (moment(data).isValid()) {
      dataReturn = `${moment(data).format(dateFormat)}`;
    }
  }
  return dataReturn;
};

export const dateTimeFormatFunction = (data) => {
  let dataReturn = "-";
  if (data) {
    if (moment(data).isValid()) {
      dataReturn = `${moment(data).format(dateTimeFormat)}`;
    }
  }
  return dataReturn;
};
export const scrollTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

export const DirectAPICAll = (method, url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (method === "get") {
        let res = await axios.get(`${url}`);
        // console.log("response code from api", res);
        resolve(res);
      } else if (method === "post") {
        if (data) {
          let res = await axios.post(`${url}`, data);
          resolve(res);
        } else {
          let res = await axios.post(`${url}`);
          resolve(res);
        }
      }
    } catch (err) {
      // console.log("responsode error from api", err);
      resolve(err);
    }
  });
};

export const noImageAvailable = (e) => {
  if (
    e.target.src.includes(process.env.NEXT_PUBLIC_IMAGE_URL) &&
    process.env.NEXT_PUBLIC_IMAGE_URL2
  ) {
    e.target.src = e.target.src.replace(
      process.env.NEXT_PUBLIC_IMAGE_URL,
      process.env.NEXT_PUBLIC_IMAGE_URL2
    );
  } else {
    e.target.src = "/assets/images/no_image.jpg";
    e.target.onError = null;
    e.target.className += " imgNotFound";
  }
};

export const searchQueryParam = (search, name) => {
  let queryValue = new URLSearchParams(search).get(name);
  return queryValue;
};

export const useCustomMediaQuery = (queryString) => {
  const [isMatch, setIsMatch] = useState(false);
  const mqChange = (mq) => {
    setIsMatch(mq.matches);
  };

  useEffect(() => {
    const mq = window.matchMedia(queryString);
    mq.addListener(mqChange);
    mqChange(mq);

    return () => {
      mq.removeListener(mqChange);
    };
  }, [queryString]);

  return isMatch;
};

export const removeHTMLTags = (data) => {
  if (typeof window !== 'undefined') {
      let tempEle = document.createElement('span')
      tempEle.innerHTML = data
      let convertedText = tempEle.textContent || tempEle.innerText || ''
      return convertedText
  }
}
