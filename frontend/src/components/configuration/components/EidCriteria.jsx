import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const EidCriteria = ({
  criteriaList,
  state,
  dispatch,
  handleSubmit,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    switch (state.criteria) {
      case "CITIZEN-IDENTITY-CARD":
        if (state.code.length === 12) {
          dispatch({ type: "SET_DISABLED", payload: false });
        } else {
          dispatch({ type: "SET_DISABLED", payload: true });
        }
        break;

      default:
        if (state.code.length >= 9) {
          dispatch({ type: "SET_DISABLED", payload: false });
        } else {
          dispatch({ type: "SET_DISABLED", payload: true });
        }
        break;
    }
  }, [state.criteria, state.code, dispatch]);

  useEffect(() => {
    if (criteriaList.length === 1) {
      //   setCriteria(data[0].value);
      dispatch({ type: "SET_CRITERIA", payload: criteriaList[0].value });
    }
  }, [criteriaList, dispatch]);

  const createTitle = () => {
    switch (state.criteria) {
      case "CITIZEN-IDENTITY-CARD":
        return t("signing.personal_code");
      case "PASSPORT-ID":
        return t("signing.passport");
      case "PERSONAL-ID":
        return t("signing.identity_card");
      case "TAX-CODE":
        return t("signing.tax_code");
    }
  };

  const handleChange1 = (event) => {
    dispatch({ type: "SET_CRITERIA", payload: event.target.value });
  };
  return (
    <Stack sx={{ minWidth: 400, height: "100%" }}>
      <Typography variant="h6" fontWeight={500} mb="15px" color="textBold.main">
        {t("signingForm.title3")}
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {t("signing.search_criteria")}
        </Typography>
        <Select
          labelId="demo-simple-select1-label"
          id="demo-simple-select"
          value={state.criteria}
          onChange={handleChange1}
          sx={{
            "& .MuiListItemSecondaryAction-root": {
              right: "30px",
              display: "flex",
            },
            backgroundColor: "signingWFBackground.main",
          }}
        >
          {criteriaList?.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              {item.remark}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box width={"100%"} flexGrow={1}>
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb={"10px"}>
          {createTitle()}
        </Typography>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          value={state.code}
          onChange={(event) => {
            if (state.criteria === "PASSPORT-ID") {
              dispatch({ type: "SET_CODE", payload: event.target.value });
              dispatch({
                type: "SET_CODE_NUMBER",
                payload: state.criteria + ":" + event.target.value,
              });
            } else if (state.criteria === "PERSONAL-ID") {
              dispatch({
                type: "SET_CODE",
                payload: event.target.value.replace(/[^\d-]/g, ""),
              });
              dispatch({
                type: "SET_CODE_NUMBER",
                payload:
                  state.criteria +
                  ":" +
                  event.target.value.replace(/[^\d-]/g, ""),
              });
            } else {
              dispatch({
                type: "SET_CODE",
                payload: event.target.value.replace(/\D/g, ""),
              });
              dispatch({
                type: "SET_CODE_NUMBER",
                payload:
                  state.criteria + ":" + event.target.value.replace(/\D/g, ""),
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          sx={{ my: 0, backgroundColor: "signingWFBackground.main" }}
          inputProps={{
            maxLength:
              state.criteria === "CITIZEN-IDENTITY-CARD"
                ? 12
                : state.criteria === "PERSONAL-ID"
                ? 20
                : 9,
          }}
        />
      </Box>
    </Stack>
  );
};

EidCriteria.propTypes = {
  criteriaList: PropTypes.array,
  state: PropTypes.object,
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default EidCriteria;
