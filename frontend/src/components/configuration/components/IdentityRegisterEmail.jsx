import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const IdentityRegisterEmail = ({ state, dispatch, handleSubmit }) => {
  const { t } = useTranslation();
  const handleEmail = (event) => {
    dispatch({ type: "CLEAR_IS_ERROR" });
    if (event.target.value.length === 0) {
      dispatch({ type: "SET_DISABLED", payload: true });
    } else {
      dispatch({ type: "SET_DISABLED", payload: false });
    }
    dispatch({ type: "SET_EMAIL", payload: event.target.value });
  };
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main" }}
        mb={"10px"}
      >
        {/* Enter your phone number to receive a verification code. */}
        {t("electronic.step91")}
      </Typography>
      <Typography
        variant="h6"
        textAlign={"center"}
        mb={"10px"}
        sx={{ color: "signingtextBlue.main" }}
      >
        {/* Phone Verification */}
        {t("electronic.step93")}
      </Typography>

      <Box
        sx={{
          mt: 1,
        }}
        autoComplete="off"
      >
        <TextField
          fullWidth
          size="small"
          id="outlined-read-only-input"
          label=""
          type="email"
          //   inputRef={phoneNumberInputRef}
          autoComplete="new-password"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            sx: {
              fontSize: "14px",
              py: "11px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
          onChange={handleEmail}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !state.isDisabled) {
              handleSubmit();
            }
          }}
        />
      </Box>
    </Box>
  );
};

IdentityRegisterEmail.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default IdentityRegisterEmail;
