import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";

export const SmartIdCriteria = ({
  criteriaList,
  state,
  dispatch,
  handleSubmit,
}) => {
  const { t } = useTranslation();
  const [isPhoneSelect, setIsPhoneSelect] = useState(undefined);
  // const [dialCode, setDialCode] = useState("");

  useEffect(() => {
    if (
      (state.data.provider === "SMART_ID_SIGNING" && state.activeStep === 4) ||
      state.data.provider === "ELECTRONIC_ID"
    ) {
      dispatch({ type: "SET_CRITERIA", payload: "CITIZEN-IDENTITY-CARD" });
    } else if (state.data.provider === "ISS") {
      dispatch({ type: "SET_CONNECTOR_NAME", payload: "SMART_ID_MOBILE_ID" });
    }
    if (state.data.criteria === "PHONE") {
      setIsPhoneSelect(true);
    } else {
      // dispatch({ type: "SET_CODE", payload: "" }); // chỗ này
      setIsPhoneSelect(false);
    }
  }, [state.data.criteria, state.activeStep, state.data.provider, dispatch]);

  useEffect(() => {
    if (state.data.connectorName === "SMART_ID_VIETTEL-CA") {
      //   setCriteria("");
      dispatch({ type: "SET_CRITERIA", payload: "" });
    }
  }, [state.data.connectorName, dispatch]);

  useEffect(() => {
    switch (state.data.connectorName) {
      case "SMART_ID_MOBILE_ID":
      case "SMART_ID_LCA":
      case "SMART_ID_VIETTEL-CA":
      case "Vietnam": {
        let phoneWithoutDialCode;

        switch (state.data.criteria) {
          case "PHONE":
            if (state.dialCode.length === 0) {
              dispatch({ type: "SET_DISABLED", payload: false });
              break;
            }
            phoneWithoutDialCode = state.data.code.slice(state.dialCode.length);
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
            break;

          case "CITIZEN-IDENTITY-CARD":
            if (state.data.code.length === 12) {
              dispatch({ type: "SET_DISABLED", payload: false });
            } else {
              dispatch({ type: "SET_DISABLED", payload: true });
            }
            break;

          default:
            if (
              state.data.code.length >= 9 ||
              state.data.userName?.length >= 4
            ) {
              dispatch({ type: "SET_DISABLED", payload: false });
            } else {
              dispatch({ type: "SET_DISABLED", payload: true });
            }
            break;
        }
        break;
      }

      case "SMART_ID_MISA-CA":
        if (state.data.userName.length >= 4 && state.password.length >= 8) {
          dispatch({ type: "SET_DISABLED", payload: false });
        } else {
          dispatch({ type: "SET_DISABLED", payload: true });
        }
        break;

      default:
        // Optional: handle any other connectorName cases here if needed
        break;
    }
  }, [
    isPhoneSelect,
    state.data.code,
    state.data.criteria,
    state.password,
    state.data.connectorName,
    state.data.userName,
    state.dialCode,
    dispatch,
  ]);

  const handleChange1 = (event) => {
    // setErrorApi(null);
    // setCriteria(event.target.value);
    dispatch({ type: "SET_CRITERIA", payload: event.target.value });
    // dispatch({ type: "SET_CODE_NUMBER", payload: "" });

    if (event.target.value === "PHONE") {
      //   setCode("84");
      dispatch({ type: "SET_CODE", payload: "84" });
      setIsPhoneSelect(true);
    } else {
      //   setCode("");
      dispatch({ type: "SET_CODE", payload: "" });
      setIsPhoneSelect(false);
    }
  };

  useEffect(() => {
    if (criteriaList.length === 1) {
      //   setCriteria(data[0].value);
      dispatch({ type: "SET_CRITERIA", payload: criteriaList[0].value });
    }
  }, [criteriaList, dispatch]);

  const createTitle = () => {
    switch (state.data.criteria) {
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

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h6" color="textBold.main" fontWeight={500} mb="15px">
        {t("signingForm.title1")}
      </Typography>
      <Box
        display={
          ["SMART_ID_MOBILE_ID", "SMART_ID_LCA", "Vietnam"].some(
            (item) => item === state.data.connectorName
          )
            ? "block"
            : "none"
        }
      >
        <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
          <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
            {t("signing.search_criteria")}
          </Typography>
          <Select
            labelId="demo-simple-select1-label"
            id="demo-simple-select"
            value={state.data.criteria}
            disabled={state.activeStep === 4 || state.activeStep === 16}
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

        <Box
          width={"100%"}
          display={isPhoneSelect ? "block" : "none"}
          // mt={6}
          flexGrow={1}
        >
          <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
            {t("signing.phoneNumber")}
          </Typography>
          <PhoneInput
            country={"vn"}
            // placeholder={label}
            enableSearch={true}
            specialLabel={""}
            value={state.data.code}
            onChange={(phone, country) => {
              dispatch({ type: "SET_CODE", payload: phone });
              dispatch({ type: "SET_DIAL_CODE", payload: country.dialCode });
              // setDialCode(country.dialCode);

              // let phoneWithoutDialCode = phone.slice(country.dialCode.length);
              // if (phoneWithoutDialCode.match(/^0+/)) {
              //   // Remove all leading '0's, leaving at least one '0'
              //   phoneWithoutDialCode = phoneWithoutDialCode.replace(/^0+/, "");
              //   // dispatch({
              //   //   type: "SET_CODE",
              //   //   payload: country.dialCode + phoneWithoutDialCode,
              //   // });
              // }
              // dispatch({
              //   type: "SET_CODE_NUMBER",
              //   payload:
              //     state.data.criteria +
              //     ":" +
              //     country.dialCode +
              //     phoneWithoutDialCode,
              // });
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
        <Box
          width={"100%"}
          display={isPhoneSelect ? "none" : "block"}
          flexGrow={1}
        >
          <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
            {createTitle()}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            value={state.data.code}
            onChange={(event) => {
              if (state.data.criteria === "PASSPORT-ID") {
                dispatch({ type: "SET_CODE", payload: event.target.value });
                // dispatch({
                //   type: "SET_CODE_NUMBER",
                //   payload: state.data.criteria + ":" + event.target.value,
                // });
              } else if (state.data.criteria === "PERSONAL-ID") {
                dispatch({
                  type: "SET_CODE",
                  payload: event.target.value.replace(/[^\d-]/g, ""),
                });
                // dispatch({
                //   type: "SET_CODE_NUMBER",
                //   payload:
                //     state.data.criteria +
                //     ":" +
                //     event.target.value.replace(/[^\d-]/g, ""),
                // });
              } else {
                dispatch({
                  type: "SET_CODE",
                  payload: event.target.value.replace(/\D/g, ""),
                });
                // dispatch({
                //   type: "SET_CODE_NUMBER",
                //   payload:
                //     state.data.criteria +
                //     ":" +
                //     event.target.value.replace(/\D/g, ""),
                // });
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
                state.data.criteria === "CITIZEN-IDENTITY-CARD"
                  ? 12
                  : state.data.criteria === "PERSONAL-ID"
                  ? 20
                  : 9,
            }}
          />
        </Box>
      </Box>

      <Box
        width={"100%"}
        display={
          state.data.connectorName === "SMART_ID_VIETTEL-CA" ? "block" : "none"
        }
        flexGrow={1}
      >
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {t("0-common.username")}
        </Typography>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          value={state.data.userName}
          onChange={(event) => {
            dispatch({ type: "SET_USER_NAME", payload: event.target.value });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          sx={{ my: 0, backgroundColor: "signingWFBackground.main" }}
        />
      </Box>

      <Box
        display={
          ["SMART_ID_MISA-CA"].some((item) => item === state.data.connectorName)
            ? "block"
            : "none"
        }
        flexGrow={1}
      >
        <Box width={"100%"} sx={{ mb: "15px" }}>
          <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
            {t("0-common.username")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            // name={name}
            value={state.data.userId}
            onChange={(event) => {
              dispatch({ type: "SET_USER_NAME", payload: event.target.value });
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
                state.data.criteria === "CITIZEN-IDENTITY-CARD"
                  ? 12
                  : state.data.criteria === "PERSONAL-ID"
                  ? 20
                  : 20,
            }}
          />
        </Box>

        <Box width={"100%"} sx={{ mb: "15px" }}>
          <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
            {t("0-common.password")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            // name={name}
            value={state.password}
            onChange={(event) => {
              dispatch({ type: "SET_PASSWORD", payload: event.target.value });
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
                state.data.criteria === "CITIZEN-IDENTITY-CARD"
                  ? 12
                  : state.FormControlcriteria === "PERSONAL-ID"
                  ? 20
                  : 20,
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
};

SmartIdCriteria.propTypes = {
  criteriaList: PropTypes.array,
  state: PropTypes.object,
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default SmartIdCriteria;
