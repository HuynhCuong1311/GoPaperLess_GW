import { assurance as assuranceValue } from "@/utils/Constant";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { SelectField } from "../../form";

export const Step4 = ({ assurance, setAssurance, onDisableSubmit, signer }) => {
  // console.log("assurance: ", assurance);
  // console.log("signer: ", signer);
  const { t } = useTranslation();
  // console.log("assuranceValue: ", assuranceValue);
  const [defaultValue, setDefaultValue] = useState([]);
  // console.log("defaultValue: ", defaultValue);

  useEffect(() => {
    if (assurance === "") {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
  }, [assurance]);

  const handleChange = (event) => {
    setAssurance(event.target.value);
  };

  useEffect(() => {
    const newDefaultValue = [];
    for (const item of signer.metaInformation.signature_type_options) {
      const index = assuranceValue.findIndex((i) => i.value === item);
      if (index !== -1) {
        newDefaultValue.push(assuranceValue[index]);
      }
    }
    if (newDefaultValue.length === 1) {
      setAssurance(newDefaultValue[0].value);
    }
    setDefaultValue(newDefaultValue);
  }, [signer]);

  // useEffect(() => {

  // },[])

  return (
    <Stack sx={{ minWidth: 400, height: "100%" }}>
      <FormControl fullWidth size="small" sx={{ flexGrow: 1 }}>
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {t("signingForm.title5")}
        </Typography>
        <Select
          labelId="demo-simple-select1-label"
          id="demo-simple-select"
          value={assurance}
          onChange={handleChange}
          sx={{
            backgroundColor: "signingWFBackground.main",
          }}
        >
          {defaultValue.map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* {defaultValue && defaultValue.length === 0 && (
        <Box width={"100%"}>
          <Alert severity="error">{t("signing.assurance_alert")}</Alert>
        </Box>
      )} */}
    </Stack>
  );
};

Step4.propTypes = {
  onDisableSubmit: PropTypes.func,
  assurance: PropTypes.string,
  setAssurance: PropTypes.func,
  signer: PropTypes.object,
};

export default Step4;
