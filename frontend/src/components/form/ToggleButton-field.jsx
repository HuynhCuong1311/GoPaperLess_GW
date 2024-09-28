import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const ToggleButtonField = ({
  name,
  control,
  content,
  // onChange: externalOnChange, // không cho user overide lại các thuộc tính này
  // onBlur: externalOnBlur,
  // ref: externalRef,
  // value: externalValue,
  ...rest
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control });
  const handleChange = (event, nextView) => {
    onChange(nextView);
  };

  return (
    <Box width={"100%"}>
      <ToggleButtonGroup
        orientation="vertical"
        value={value}
        exclusive
        onChange={handleChange}
        sx={{ width: "100%" }}
        {...rest}
      >
        {content}
      </ToggleButtonGroup>
      <FormHelperText
        error={!!error}
        sx={{
          color: "red",
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {error?.message}
      </FormHelperText>
    </Box>
  );
};

ToggleButtonField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  content: PropTypes.node,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default ToggleButtonField;
