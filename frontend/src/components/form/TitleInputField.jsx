/* eslint-disable no-unused-vars */
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const TitleInputField = ({
  title,
  control,
  name,
  onChange: externalOnChange,
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
    <Box mb="10px">
      <Typography variant="h6" mb="10px">
        {title}
      </Typography>

      <TextField
        fullWidth
        size="small"
        margin="normal"
        name={name}
        value={value}
        onChange={(event) => {
          onChange(event);
          externalOnChange?.(event);
        }}
        onBlur={onBlur}
        inputRef={ref}
        error={!!error}
        helperText={error?.message}
        {...rest}
      />
    </Box>
  );
};

TitleInputField.propTypes = {
  title: PropTypes.string,
  control: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default TitleInputField;
