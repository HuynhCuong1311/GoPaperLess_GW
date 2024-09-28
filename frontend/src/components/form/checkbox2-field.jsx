/* eslint-disable no-unused-vars */
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const CheckBoxField2 = ({
  name,
  label,
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
    <Checkbox
      value={value}
      name={name}
      // onChange={(e) => handleChange(e, "allowed")}
      onChange={() => {
        const list = [...value];
        const index = list.indexOf(externalValue);
        index === -1 ? list.push(externalValue) : list.splice(index, 1);
        onChange(list);
      }}
      checked={value.includes(externalValue)}
      size="small"
      // disableRipple
      label={label}
      {...rest}
    />
  );
};

CheckBoxField2.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default CheckBoxField2;
