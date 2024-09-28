/* eslint-disable no-unused-vars */
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import { BpCheckedIcon, BpIcon } from "../styled/Checkbox";

const CheckBoxField = ({
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
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          name={name}
          // checkedIcon={<BpCheckedIcon />}
          // icon={<BpIcon />}
          onChange={(event) => {
            // console.log("event: ", event);
            externalOnChange && externalOnChange(event);
            onChange(event);
          }}
          sx={{
            color: "#c4c4c4",
            // ml: "2px",
            // '&.Mui-checked': {
            //   color: pink[600],
            // },
            "& .MuiSvgIcon-root": { fontSize: 21 },
          }}
        />
      }
      label={label}
      {...rest}
    />
  );
};

CheckBoxField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.any,
  control: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default CheckBoxField;
