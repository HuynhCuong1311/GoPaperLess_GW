import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PhoneInputField2 } from "../form";

export const Step7 = ({
  onDisableSubmit,
  phoneNumber,
  setPhoneNumber,
  dialCode,
  handleSubmit,
  isSubmitDisabled,
  setErrorPG,
}) => {
  const { t } = useTranslation();

  // const [phoneNumber, setPhoneNumber] = useState("");
  let phoneWithoutDialCode;
  useEffect(() => {
    phoneWithoutDialCode = phoneNumber.slice(dialCode.current.length);
    if (
      phoneWithoutDialCode.match(/^0+/) &&
      phoneWithoutDialCode.length === 10
    ) {
      onDisableSubmit(false);
    } else if (
      phoneWithoutDialCode.match(/^(?!0+)/) &&
      phoneWithoutDialCode.length === 9
    ) {
      onDisableSubmit(false);
    } else {
      onDisableSubmit(true);
    }
  }, [phoneNumber, dialCode]);

  // eslint-disable-next-line no-unused-vars
  const handlePhoneNumber = (phone, country) => {
    dialCode.current = country.dialCode;
    setPhoneNumber(phone);
    setErrorPG(null);
    // phoneNumberRef.current = phone;
  };

  useEffect(() => {
    onDisableSubmit(true);
  }, []);
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
        <PhoneInputField2
          label={""}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          handlePhoneNumber={handlePhoneNumber}
          enterToSubmit={handleSubmit}
          isSubmitDisabled={isSubmitDisabled}
        />
      </Box>
    </Box>
  );
};

Step7.propTypes = {
  onDisableSubmit: PropTypes.func,
  phoneNumber: PropTypes.string,
  setPhoneNumber: PropTypes.func,
  dialCode: PropTypes.object,
  handleSubmit: PropTypes.func,
  isSubmitDisabled: PropTypes.bool,
  setErrorPG: PropTypes.func,
};

export default Step7;
