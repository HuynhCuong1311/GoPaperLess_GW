/* eslint-disable no-unused-vars */
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const PasswordField = ({
  name,
  control,
  onChange: externalOnChange, // không cho user overide lại các thuộc tính này
  onBlur: externalOnBlur,
  ref: externalRef,
  value: externalValue,
  ...rest
}) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <TextField
      fullWidth
      error={!!error}
      value={value}
      name={name}
      size="small"
      id="pinNumber"
      // label="Password"
      type="search"
      // autoComplete="current-password"
      onChange={(event) => {
        // console.log("object");
        onChange(event);
        externalOnChange?.(event);
      }}
      inputRef={ref}
      helperText={error?.message}
      {...rest}
    />
  );
};

PasswordField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default PasswordField;
