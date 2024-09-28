/* eslint-disable no-unused-vars */
import { handleDateTimeChange } from "@/utils/commonFunction";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const DayPicker = ({
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
  // const format = useWatch({ name: "date_format", control });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]} sx={{ p: 0 }}>
        <DatePicker
          name={name}
          value={dayjs(value).isValid() ? value : null}
          // value={value}
          // slotProps={{ textField: { placeholder: "cuong" } }}
          sx={{
            padding: 0,
            width: "100%",
            "& .MuiInputBase-input": { py: 0 },
            backgroundColor: "signingWFBackground.main",
          }}
          // format={extractDatePart(format)}
          onChange={(newValue) => {
            onChange(handleDateTimeChange(newValue));
          }}
          {...rest}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

DayPicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.any,
  control: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default DayPicker;
