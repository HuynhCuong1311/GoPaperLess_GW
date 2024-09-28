import { ReactComponent as EidIcon } from "@/assets/images/svg/e-id.svg";
import { ReactComponent as IssIcon } from "@/assets/images/svg/iss.svg";
import { ReactComponent as MobileIdIcon } from "@/assets/images/svg/mobile-id.svg";
import { ReactComponent as SmartIdIcon } from "@/assets/images/svg/smart-id.svg";
import { ReactComponent as UsbIcon } from "@/assets/images/svg/usb-token.svg";
import FormControl from "@mui/material/FormControl";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 400, // Set chiều cao tối đa của menu
    },
  },
};

export const SigningMethod = ({ state, dispatch, connectorList }) => {
  const { t } = useTranslation();

  const [data2, setData2] = useState(null);

  const mapProvider = useMemo(() => {
    return ["mobile", "smartid", "usbtoken", "electronic_id", "iss"]
      .map((option) => {
        switch (option) {
          case "mobile":
            return {
              label: "Mobile-ID",
              icon: <MobileIdIcon />,
              value: "MOBILE_ID_SIGNING",
            };
          case "smartid":
            return {
              label: "Remote Signing",
              icon: <SmartIdIcon />,
              value: "SMART_ID_SIGNING",
            };
          case "usbtoken":
            return {
              label: "USB-Token",
              icon: <UsbIcon />,
              value: "USB_TOKEN_SIGNING",
            };
          case "electronic_id":
            return {
              label: "Electronic video based Identification",
              icon: <EidIcon />,
              value: "ELECTRONIC_ID",
            };
          case "iss":
            return {
              label: "Internal Signing Service",
              icon: <IssIcon />,
              value: "ISS",
            };
          default:
            return null;
        }
      })
      .filter(Boolean);
  }, []);

  useEffect(() => {
    if (state.data.provider !== "ISS" && state.data.connectorName === "") {
      //   onDisableSubmit(true);
      dispatch({ type: "SET_DISABLED", payload: true });
    } else {
      //   onDisableSubmit(false);
      dispatch({ type: "SET_DISABLED", payload: false });
    }
    // if (
    //   (provider === "USB_TOKEN_SIGNING" || provider === "ELECTRONIC_ID") &&
    //   errorPG
    // ) {
    //   onDisableSubmit(true);
    // }
  }, [state.data.provider, state.data.connectorName, dispatch, state.isError]);

  useEffect(() => {
    if (mapProvider.length === 1) {
      //   setProvider(mapProvider[0].value);
      dispatch({ type: "SET_PROVIDER", payload: mapProvider[0].value });
    }
  }, [mapProvider, dispatch]);

  useEffect(() => {
    const filterValue = state.data.provider;
    const filterProvider = connectorList?.data[filterValue];

    if (filterProvider) {
      const content2 = filterProvider.map((item, i) => {
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
        // setConnectorName(content2[0].value);
        dispatch({ type: "SET_CONNECTOR_NAME", payload: content2[0].value });
      }
      setData2(content2);
    } else {
      setData2(null);
    }
  }, [state.data.provider, connectorList, dispatch]);

  const handleChange1 = (e) => {
    dispatch({ type: "SET_PROVIDER", payload: e.target.value });

    dispatch({ type: "SET_CONNECTOR_NAME", payload: "" });

    const filterValue = e.target.value;
    const filterProvider = connectorList?.data[filterValue];

    if (filterProvider) {
      const content2 = filterProvider.map((item, i) => {
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
        dispatch({ type: "SET_CONNECTOR_NAME", payload: content2[0].value });
      }
      setData2(content2);
    } else {
      setData2(null);
    }
  };

  const handleChange2 = (e) => {
    // setErrorApi(null);
    // setConnectorName(e.target.value);
    dispatch({ type: "SET_CONNECTOR_NAME", payload: e.target.value });
    // setCert({});
  };

  const createQque = () => {
    switch (state.data.provider) {
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
          value={state.data.provider}
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
        disabled={state.data.provider === ""}
        sx={{
          flexGrow: 1,
          display:
            state.data.provider === "ISS" || state.data.provider === ""
              ? "none"
              : "flex",
        }}
      >
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {createQque()}
        </Typography>
        <Select
          labelId="demo-simple-select1-label-step2"
          id="demo-simple-select-step2"
          value={state.data.connectorName}
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
    </Stack>
  );
};

SigningMethod.propTypes = {
  state: PropTypes.shape({
    data: PropTypes.object,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    isDisabled: PropTypes.bool,
  }),
  dispatch: PropTypes.func,
  connectorList: PropTypes.object,
};

export default SigningMethod;
