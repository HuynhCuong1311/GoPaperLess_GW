/* eslint-disable react/prop-types */
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const SelectField = ({
  name,
  label,
  control,
  content,
  onChange: externalOnChange,
  // onBlur: externalOnBlur,
  // ref: externalRef,
  // value: externalValue,
  ...rest
}) => {
  const {
    field: { onChange, value, ref },
    // fieldState: { error },
  } = useController({ name, control });
  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <InputLabel id="demo-select-small-label">{label}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        ref={ref}
        value={value}
        label={label}
        onChange={(e) => {
          onChange(e.target.value);
          externalOnChange?.(e);
        }}
        {...rest}
      >
        {content}
      </Select>
      {/* <FormHelperText sx={{ color: "error.main" }}>
        {error?.message}
      </FormHelperText> */}
    </FormControl>
  );
};
SelectField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};
export default SelectField;
