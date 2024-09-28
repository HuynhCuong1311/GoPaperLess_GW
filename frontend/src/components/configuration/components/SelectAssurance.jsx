import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const SelectAssurance = ({ state, dispatch, assuranceList }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (state.data.assurance === "") {
      //   onDisableSubmit(true);
      dispatch({ type: "SET_DISABLED", payload: true });
    } else {
      //   onDisableSubmit(false);
      dispatch({ type: "SET_DISABLED", payload: false });
    }
  }, [state.data.assurance, dispatch]);

  const handleChange = (event) => {
    dispatch({ type: "SET_ASSURANCE", payload: event.target.value });
  };

  return (
    <Stack sx={{ minWidth: 400, height: "100%" }}>
      <FormControl fullWidth size="small" sx={{ flexGrow: 1 }}>
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {t("signingForm.title5")}
        </Typography>
        <Select
          labelId="demo-simple-select1-label"
          id="demo-simple-select"
          value={state.data.assurance}
          onChange={handleChange}
          sx={{
            backgroundColor: "signingWFBackground.main",
          }}
        >
          {assuranceList.map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

SelectAssurance.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
  assuranceList: PropTypes.array,
};

export default SelectAssurance;
