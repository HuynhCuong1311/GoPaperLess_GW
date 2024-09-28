/* eslint-disable no-unused-vars */
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

const ToggleAlignment = ({
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
    <ToggleButtonGroup
      value={value}
      name={name}
      onChange={(event, newAlignment) => {
        onChange(newAlignment);
      }}
      aria-label="Platform"
      {...rest}
    >
      <ToggleButton value="auto">Auto</ToggleButton>
      <ToggleButton value="left">
        <FormatAlignLeftIcon />
      </ToggleButton>
      ,
      <ToggleButton value="right">
        <FormatAlignRightIcon />
      </ToggleButton>
      ,
    </ToggleButtonGroup>
  );
};

ToggleAlignment.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default ToggleAlignment;
