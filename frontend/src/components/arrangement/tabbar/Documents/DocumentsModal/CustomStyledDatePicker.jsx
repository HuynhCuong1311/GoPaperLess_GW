import { styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export const CustomStyledDatePicker = styled(DatePicker)({
  width: "100%",

  "& .MuiInputBase-root ": {
    color: "#6B7280",
    fontWeight: 500,
    paddingRight: "13px",
    "&:hover fieldset": {
      borderColor: "#E5E7EB",
    },
  },
  ".Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB !important",
  },
  "& .MuiInputBase-input": {
    "&::placeholder": {
      opacity: 1,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "6px",
    border: "1px solid #E5E7EB",
  },
  ".MuiButtonBase-root": {
    padding: "6px",
    backgroundColor: "#D1D5DB",
    borderRadius: "0px 6px 6px 0px",
  },
});
