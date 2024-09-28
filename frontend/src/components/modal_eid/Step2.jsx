import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Step2 = ({ onDisableSubmit }) => {
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const { t } = useTranslation();
  const handleCheckbox1Change = (event) => {
    setIsChecked1(event.target.checked);
    onDisableSubmit(!(event.target.checked && isChecked2));
  };

  const handleCheckbox2Change = (event) => {
    setIsChecked2(event.target.checked);
    onDisableSubmit(!(event.target.checked && isChecked1));
  };

  useEffect(() => {
    onDisableSubmit(!(isChecked1 && isChecked2));
  }, [isChecked1, isChecked2]);
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main" }}
        mb="10px"
      >
        {/* Please accept provider’s terms of service. */}
        {t("electronic.step21")}
      </Typography>

      <FormGroup sx={{ height: "41px", mb: "10px" }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              sx={{
                // paddingTop: "0",
                color: "#26293F",
                "&.Mui-checked": {
                  color: "#0d6efd",
                },
              }}
              checked={isChecked1}
              onChange={handleCheckbox1Change}
            />
          }
          label={
            <Typography component="span" fontSize="14px">
              {t("electronic.step22")}{" "}
              <Link
                to="https://www.dokobit.com/terms/ElectronicId-privacy-policy"
                target="_blank"
              >
                {/* Privacy Policy */}
                {t("electronic.step23")}
              </Link>{" "}
              {t("electronic.step24")}
            </Typography>
          }
          sx={{ alignItems: "flex-start" }}
        />
      </FormGroup>

      <FormGroup sx={{ height: "41px" }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              sx={{
                // paddingTop: "0",
                color: "#26293F",
                "&.Mui-checked": {
                  color: "#0d6efd",
                },
              }}
              checked={isChecked2}
              onChange={handleCheckbox2Change}
            />
          }
          label={
            <Typography component="span" fontSize="14px">
              {t("electronic.step25")}{" "}
              <Link
                to="https://www.dokobit.com/terms/ElectronicId-terms-and-conditions-of-the-video-identification-process"
                target="_blank"
              >
                {/* Terms and Conditions */}
                {t("electronic.step26")}
              </Link>{" "}
              {/* on the Video Identification Process. */}
              {t("electronic.step27")}
            </Typography>
          }
          sx={{ alignItems: "flex-start" }}
        />
      </FormGroup>
    </Box>
  );
};

Step2.propTypes = {
  onDisableSubmit: PropTypes.func,
};

export default Step2;
