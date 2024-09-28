import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

export const PhoneInputField2 = ({
  label,
  phoneNumber,
  setPhoneNumber,
  handlePhoneNumber,
  enterToSubmit,
  disabled = false,
  isSubmitDisabled = false,
}) => {
  return (
    <PhoneInput
      country={"vn"}
      placeholder={label}
      enableSearch={true}
      specialLabel={label}
      value={phoneNumber}
      onChange={(phone, country) => handlePhoneNumber(phone, country)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isSubmitDisabled) {
          enterToSubmit();
        }
      }}
      onBlur={(phone, country) => {
        if (phoneNumber === "") setPhoneNumber(`+ ${country.dialCode}`);
      }}
      onFocus={(phone, country) => {
        if (phoneNumber === "") setPhoneNumber(`+ ${country.dialCode}`);
      }}
      inputStyle={{
        height: "45px",
        width: "100%",
        opacity: disabled ? "0.5" : "1",
      }}
      inputProps={{
        maxLength: 16,
      }}
      disabled={disabled}
      copyNumbersOnly={false}
      countryCodeEditable={false}
    />
  );
};
PhoneInputField2.propTypes = {
  label: PropTypes.string,
  phoneNumber: PropTypes.string,
  setPhoneNumber: PropTypes.func,
  handlePhoneNumber: PropTypes.func,
  enterToSubmit: PropTypes.func,
  disabled: PropTypes.bool,
  copyNumbersOnly: PropTypes.bool,
  isSubmitDisabled: PropTypes.bool,
};
export default PhoneInputField2;
