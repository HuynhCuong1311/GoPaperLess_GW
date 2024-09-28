import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";

const IdentityRegisterPhone = ({ state, dispatch, handleSubmit }) => {
  const { t } = useTranslation();

  const [dialCode, setDialCode] = useState("");

  useEffect(() => {
    let phoneWithoutDialCode;
    console.log("phoneWithoutDialCode: ", phoneWithoutDialCode);
    if (dialCode.length === 0) {
      dispatch({ type: "SET_DISABLED", payload: false });
    }
    phoneWithoutDialCode = state.data.phoneNumber.slice(dialCode.length);
    if (
      phoneWithoutDialCode.match(/^0+/) &&
      phoneWithoutDialCode.length === 10
    ) {
      dispatch({ type: "SET_DISABLED", payload: false });
    } else if (
      phoneWithoutDialCode.match(/^(?!0+)/) &&
      phoneWithoutDialCode.length === 9
    ) {
      dispatch({ type: "SET_DISABLED", payload: false });
    } else {
      dispatch({ type: "SET_DISABLED", payload: true });
    }
  }, [state.data.phoneNumber, dialCode, dispatch]);
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main", height: "17px" }}
        mb={"10px"}
      >
        {/* Enter your phone number to receive a verification code. */}
        {t("electronic.step71")}
      </Typography>
      <Typography
        variant="h6"
        textAlign={"center"}
        mb={"10px"}
        sx={{ fontWeight: 600, color: "signingtextBlue.main", height: "17px" }}
      >
        {/* Phone Verification */}
        {t("electronic.step73")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          fontFamily: "Montserrat, Nucleo, Helvetica, sans-serif",
          justifyContent: "center",
          width: "100%",
          height: "45px",
        }}
        autoComplete="off"
      >
        <PhoneInput
          country={"vn"}
          // placeholder={label}
          enableSearch={true}
          specialLabel={""}
          value={state.data.phoneNumber}
          onChange={(phone, country) => {
            //   setErrorApi(null);
            //   setCode(phone);
            //   dialCode.current = country.dialCode;
            // dispatch({ type: "SET_PHONE_NUMBER", payload: phone });
            setDialCode(country.dialCode);

            let phoneWithoutDialCode = phone.slice(country.dialCode.length);
            if (phoneWithoutDialCode.match(/^0+/)) {
              // Remove all leading '0's, leaving at least one '0'
              phoneWithoutDialCode = phoneWithoutDialCode.replace(/^0+/, "");
            }
            dispatch({
              type: "SET_PHONE_NUMBER",
              payload: country.dialCode + phoneWithoutDialCode,
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          inputStyle={{
            height: "45px",
            width: "100%",
            fontSize: "14px",
          }}
          copyNumbersOnly={false}
          countryCodeEditable={false}
          // enableLongNumbers={11}
          inputProps={{
            maxLength: 16,
          }}
        />
      </Box>
    </Box>
  );
};

IdentityRegisterPhone.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default IdentityRegisterPhone;
