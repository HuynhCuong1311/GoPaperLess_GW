import { maskedEmail } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const Step1 = ({ email }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6" mb="10px">
        {/* Confirm your phone number in order to sign the document with a Qualified
        Electronic Signature. */}
        {t("electronic.step133")}
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
          value={maskedEmail(email)}
          autoComplete="new-password"
          InputLabelProps={{ shrink: true }}
          disabled
          InputProps={{
            // readOnly: true,
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
  email: PropTypes.string,
};

export default Step1;
