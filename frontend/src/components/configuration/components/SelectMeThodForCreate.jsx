import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SelectMeThodForCreate = ({ state, dispatch, authModeList }) => {
  const { t } = useTranslation();
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  const handleCheckbox1Change = (event) => {
    setIsChecked1(event.target.checked);
  };

  const handleCheckbox2Change = (event) => {
    setIsChecked2(event.target.checked);
  };

  const handleChange = (event) => {
    // setErrorPG(null);
    dispatch({ type: "CLEAR_IS_ERROR" });
    dispatch({ type: "SET_AUTH_MODE", payload: event.target.value });
  };

  useEffect(() => {
    // onDisableSubmit(!(isChecked1 && isChecked2));
    if (!(isChecked1 && isChecked2 && state.data.provider)) {
      dispatch({ type: "SET_DISABLED", payload: true });
    } else {
      dispatch({ type: "SET_DISABLED", payload: false });
    }
  }, [isChecked1, isChecked2, state.data.provider, dispatch]);
  return (
    <Stack justifyContent="space-between" height="100%">
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "textBold.main", mb: "10px" }}
        >
          {t("electronic.step111")}
        </Typography>

        <Typography variant="h6" mb="10px" color="textBold.main">
          {/* Please accept our certification terms to sign the document. */}
          {t("electronic.step112")}
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isChecked1}
                onChange={handleCheckbox1Change}
              />
            }
            label={
              <Typography component="span" fontSize="14px">
                {t("electronic.step113")}{" "}
                <Link to="https://rssp.mobile-id.vn/vi/privacy" target="_blank">
                  {/* Certification Practices Statement. */}
                  {t("electronic.step114")}
                </Link>
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isChecked2}
                onChange={handleCheckbox2Change}
              />
            }
            label={
              <Typography component="span" fontSize="14px">
                {t("electronic.step113")}{" "}
                <Link to="https://rssp.mobile-id.vn/vi/terms" target="_blank">
                  {/* Terms and Conditions */}
                  {t("electronic.step115")}
                </Link>{" "}
                {/* on the Video Identification Process. */}
                {t("electronic.step116")}
              </Typography>
            }
          />
        </FormGroup>
      </Box>

      <Box sx={{ fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif" }}>
        <FormControl fullWidth size="small">
          <Typography variant="h6" color="#1F2937" fontWeight={600} mb={"10px"}>
            {t("electronic.step117")}
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={state.data.authMode}
            onChange={handleChange}
            sx={{
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
              },
              fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
              backgroundColor: "signingWFBackground.main",
            }}
            disabled={!isChecked1 || !isChecked2}
          >
            {authModeList.map((val, index) => (
              <MenuItem key={index} value={val.value}>
                {val.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Stack>
  );
};

SelectMeThodForCreate.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
  authModeList: PropTypes.array,
};

export default SelectMeThodForCreate;
