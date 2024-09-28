import Alert from "@mui/material/Alert";
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

export const Step2_smartid = ({
  data,
  dialCode,
  errorApi,
  setErrorApi,
  criteria,
  setCriteria,
  code,
  setCode,
  userId,
  setUserId,
  password,
  setPassword,
  connectorName,
  onDisableSubmit,
  handleSubmit,
}) => {
  const { t } = useTranslation();
  const [isPhoneSelect, setIsPhoneSelect] = useState(true);

  useEffect(() => {
    if (connectorName === "SMART_ID_VIETTEL-CA") {
      setCriteria("");
    }
  }, [connectorName]);

  useEffect(() => {
    if (
      ["SMART_ID_MOBILE_ID", "SMART_ID_LCA", "SMART_ID_VIETTEL-CA"].some(
        (item) => item === connectorName
      )
    ) {
      let phoneWithoutDialCode;
      switch (criteria) {
        case "PHONE":
          phoneWithoutDialCode = code.slice(dialCode.current.length);
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
          break;
        case "CITIZEN-IDENTITY-CARD":
          if (code.length === 12) {
            onDisableSubmit(false);
          } else {
            onDisableSubmit(true);
          }
          break;
        default:
          if (code.length >= 9 || userId.length >= 4) {
            onDisableSubmit(false);
          } else {
            onDisableSubmit(true);
          }
          break;
      }
    } else if (["SMART_ID_MISA-CA"].some((item) => item === connectorName)) {
      console.log("day he");
      if (userId.length >= 4 && password.length >= 8) {
        onDisableSubmit(false);
      } else {
        onDisableSubmit(true);
      }
    }
  }, [isPhoneSelect, code, criteria, password, connectorName, userId]);

  const handleChange1 = (event) => {
    setErrorApi(null);
    setCriteria(event.target.value);

    if (event.target.value === "PHONE") {
      setCode("84");
      setIsPhoneSelect(true);
    } else {
      setCode("");
      setIsPhoneSelect(false);
    }
  };

  useEffect(() => {
    if (data.length === 1) {
      setCriteria(data[0].value);
    }
  }, [data]);

  const createTitle = () => {
    switch (criteria) {
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
          ["SMART_ID_MOBILE_ID", "SMART_ID_LCA"].some(
            (item) => item === connectorName
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
            value={criteria}
            onChange={handleChange1}
            sx={{
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
                display: "flex",
              },
              backgroundColor: "signingWFBackground.main",
            }}
          >
            {data?.map((item) => (
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
            value={code}
            onChange={(phone, country) => {
              setErrorApi(null);
              setCode(phone);
              dialCode.current = country.dialCode;
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
        {/* ) : ( */}
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
            // name={name}
            value={code}
            onChange={(event) => {
              setErrorApi(null);
              if (criteria === "PASSPORT-ID") {
                setCode(event.target.value);
              } else if (criteria === "PERSONAL-ID") {
                setCode(event.target.value.replace(/[^\d-]/g, ""));
              } else {
                setCode(event.target.value.replace(/\D/g, ""));
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
                criteria === "CITIZEN-IDENTITY-CARD"
                  ? 12
                  : criteria === "PERSONAL-ID"
                  ? 20
                  : 9,
            }}
          />
        </Box>
      </Box>

      <Box
        width={"100%"}
        display={connectorName === "SMART_ID_VIETTEL-CA" ? "block" : "none"}
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
          value={userId}
          onChange={(event) => {
            setErrorApi(null);
            setUserId(event.target.value);
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
          ["SMART_ID_MISA-CA"].some((item) => item === connectorName)
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
            value={userId}
            onChange={(event) => {
              setErrorApi(null);
              setUserId(event.target.value);
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
                criteria === "CITIZEN-IDENTITY-CARD"
                  ? 12
                  : criteria === "PERSONAL-ID"
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
            value={password}
            onChange={(event) => {
              setErrorApi(null);
              setPassword(event.target.value);
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
                criteria === "CITIZEN-IDENTITY-CARD"
                  ? 12
                  : criteria === "PERSONAL-ID"
                  ? 20
                  : 20,
            }}
          />
        </Box>
      </Box>

      {errorApi && (
        <Box width={"100%"}>
          <Alert severity="error">{errorApi}</Alert>
        </Box>
      )}
    </Stack>
  );
};

Step2_smartid.propTypes = {
  data: PropTypes.array,
  dialCode: PropTypes.object,
  errorApi: PropTypes.string,
  criteria: PropTypes.string,
  setCriteria: PropTypes.func,
  code: PropTypes.string,
  setCode: PropTypes.func,
  userId: PropTypes.string,
  setUserId: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
  connectorName: PropTypes.string,
  onDisableSubmit: PropTypes.func,
  handleSubmit: PropTypes.func,
  setErrorApi: PropTypes.func,
};

export default Step2_smartid;
