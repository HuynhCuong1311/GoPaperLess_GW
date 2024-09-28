import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const Step1 = ({
  provider,
  setProvider,
  connectorName,
  setConnectorName,
  mapProvider,
  connectorList,
  filterConnector,
  onDisableSubmit,
  errorPG,
  errorApi,
  setErrorApi,
}) => {
  const { t } = useTranslation();
  const [data2, setData2] = useState(null);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 400, // Set chiều cao tối đa của menu
      },
    },
  };

  useEffect(() => {
    if (
      (provider !== "ISS" && connectorName === "") ||
      ((provider === "USB_TOKEN_SIGNING" || provider === "ELECTRONIC_ID") &&
        errorPG)
    ) {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
    // if (
    //   (provider === "USB_TOKEN_SIGNING" || provider === "ELECTRONIC_ID") &&
    //   errorPG
    // ) {
    //   onDisableSubmit(true);
    // }
  }, [connectorName, onDisableSubmit, provider, errorPG]);

  useEffect(() => {
    if (mapProvider.length === 1) {
      setProvider(mapProvider[0].value);
    }
  }, [mapProvider]);

  useEffect(() => {
    const filterValue = provider;
    const filterProvider = connectorList?.[filterValue];

    if (filterProvider) {
      const filterData = filterProvider.filter((item) =>
        filterConnector.includes(item.connectorName)
      );
      const content = filterData.length > 0 ? filterData : filterProvider;
      const content2 = content.map((item, i) => {
        return (
          <MenuItem
            key={i}
            value={
              item.connectorName !== "MOBILE_ID_IDENTITY"
                ? item.connectorName
                : item.remark
            }
          >
            {item.remark}
            <ListItemSecondaryAction>
              <img src={item.logo} height="25" alt="logo" />
            </ListItemSecondaryAction>
          </MenuItem>
        );
      });
      if (content2.length === 1) {
        setConnectorName(content2[0].value);
      }
      setData2(content2);
    } else {
      setData2(null);
    }
  }, [provider]);

  const handleChange1 = (e) => {
    setProvider(e.target.value);

    setConnectorName("");

    const filterValue = e.target.value;
    const filterProvider = connectorList?.[filterValue];

    if (filterProvider) {
      const filterData = filterProvider.filter((item) =>
        filterConnector.includes(item.connectorName)
      );
      const content = filterData.length > 0 ? filterData : filterProvider;
      const content2 = content.map((item, i) => {
        return (
          <MenuItem
            key={i}
            value={
              item.connectorName !== "MOBILE_ID_IDENTITY"
                ? item.connectorName
                : item.remark
            }
          >
            {item.remark}
            <ListItemSecondaryAction>
              <img src={item.logo} height="25" alt="logo" />
            </ListItemSecondaryAction>
          </MenuItem>
        );
      });
      if (content2.length === 1) {
        setConnectorName(content2[0].value);
      }
      setData2(content2);
    } else {
      setData2(null);
    }
  };

  const handleChange2 = (e) => {
    setErrorApi(null);
    setConnectorName(e.target.value);
    // setCert({});
  };

  const createQque = () => {
    switch (provider) {
      case "MOBILE_ID_SIGNING":
        return t("signingForm.quanque3");
      case "SMART_ID_SIGNING":
        return t("signingForm.quanque1");
      case "USB_TOKEN_SIGNING":
        return t("signingForm.quanque2");
      case "ELECTRONIC_ID":
        return t("signingForm.quanque1");
    }
  };

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {t("signing.signing_method")}
        </Typography>

        <Select
          labelId="demo-simple-select1-label-step1"
          id="demo-simple-select-step1"
          value={provider}
          onChange={handleChange1}
          sx={{
            "& .MuiListItemSecondaryAction-root": {
              right: "30px",
              display: "flex",
            },
            backgroundColor: "signingWFBackground.main",
          }}
        >
          {mapProvider.map((item, i) => {
            return (
              <MenuItem key={i} value={item.value}>
                {item.label}
                <ListItemSecondaryAction>{item.icon}</ListItemSecondaryAction>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl
        fullWidth
        size="small"
        disabled={provider === ""}
        sx={{
          flexGrow: 1,
          display: provider === "ISS" || provider === "" ? "none" : "flex",
        }}
      >
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {createQque()}
        </Typography>
        <Select
          labelId="demo-simple-select1-label-step2"
          id="demo-simple-select-step2"
          value={connectorName}
          onChange={handleChange2}
          sx={{
            "& .MuiListItemSecondaryAction-root": {
              right: "30px",
              display: "flex",
            },
            backgroundColor: "signingWFBackground.main",
            maxHeight: "300px",
          }}
          // MenuProps={MenuProps}
          MenuProps={MenuProps}
        >
          {data2}
        </Select>
      </FormControl>

      {/* <CheckIdSoft name="messageError" /> */}
      {provider === "USB_TOKEN_SIGNING" && errorApi && (
        <Box width={"100%"} mt={2}>
          <Alert severity="error">{errorApi}</Alert>
        </Box>
      )}
      {(provider === "USB_TOKEN_SIGNING" || provider === "ELECTRONIC_ID") &&
        errorPG && (
          <Box width={"100%"} mt={2}>
            <Alert severity="error">
              {errorPG}
              <a
                href="https://checkid.mobile-id.vn/plugin/gw/checkid_client_installer.exe"
                download
                style={{ color: "#991B1B", fontWeight: "bold" }}
              >
                {t("modal.download")}
              </a>
            </Alert>
          </Box>
        )}
    </Stack>
  );
};

Step1.propTypes = {
  provider: PropTypes.string,
  setProvider: PropTypes.func,
  connectorName: PropTypes.string,
  setConnectorName: PropTypes.func,
  mapProvider: PropTypes.array,
  connectorList: PropTypes.object,
  filterConnector: PropTypes.array,
  onDisableSubmit: PropTypes.func,
  errorPG: PropTypes.string,
  errorApi: PropTypes.string,
  setErrorApi: PropTypes.func,
};

export default Step1;
