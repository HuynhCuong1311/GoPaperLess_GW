import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const Step1 = ({ phoneNumber }) => {
  const { t } = useTranslation();
  //   const phoneNumber = "84901790767";
  const maskedPhoneNumber = () => {
    const hiddenPart = phoneNumber
      .substring(phoneNumber.length - 7, phoneNumber.length - 2)
      .replace(/\d/g, "*");
    return (
      "+" +
      phoneNumber.slice(0, phoneNumber.length - 7) +
      hiddenPart +
      phoneNumber.slice(-2)
    );
  };

  return (
    <Box>
      <Typography variant="h6" mb="10px">
        {/* Confirm your phone number in order to sign the document with a Qualified
        Electronic Signature. */}
        {t("electronic.step132")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          fontFamily: "Montserrat, Nucleo, Helvetica, sans-serif",
          justifyContent: "center",
        }}
        autoComplete="off"
      >
        <TextField
          fullWidth
          size="small"
          id="outlined-read-only-input"
          type="text"
          value={maskedPhoneNumber()}
          autoComplete="new-password"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            readOnly: true,
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
        />
      </Box>
    </Box>
  );
};

Step1.propTypes = {
  phoneNumber: PropTypes.string,
};

export default Step1;
