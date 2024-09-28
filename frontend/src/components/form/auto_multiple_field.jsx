/* eslint-disable no-unused-vars */
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const AutoMultipleField = ({
  name,
  control,
  onChange: externalOnChange, // không cho user overide lại các thuộc tính này
  onBlur: externalOnBlur,
  ref: externalRef,
  value: externalValue,
  options,
  ...rest
}) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name, control });
  return (
    <Autocomplete
      multiple
      name={name}
      id="tags-outlined"
      size="small"
      forcePopupIcon={false}
      options={options}
      getOptionLabel={(option) => option.title}
      filterSelectedOptions
      disableClearable
      onChange={(event, value) => onChange(value.map((v) => v.value))}
      renderInput={({ InputProps, ...params }) => (
        <TextField
          {...params}
          InputProps={{
            ...InputProps,
            sx: {
              minHeight: "44px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
        />
      )}
    />
  );
};

AutoMultipleField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
  options: PropTypes.array,
};

export default AutoMultipleField;
