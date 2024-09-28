import { ReactComponent as EidIcon } from "@/assets/images/svg/e-id.svg";
import { ReactComponent as IssIcon } from "@/assets/images/svg/iss.svg";
import { ReactComponent as MobileIdIcon } from "@/assets/images/svg/mobile-id.svg";
import { ReactComponent as SignatureImage } from "@/assets/images/svg/signature-image.svg";
import { ReactComponent as SmartIdIcon } from "@/assets/images/svg/smart-id.svg";
import { ReactComponent as UsbIcon } from "@/assets/images/svg/usb-token.svg";
import SignatureItem from "@/components/configuration/components/SignatureItem";
import { useConnectorList, usePreFixList } from "@/hook";
import { getLang } from "@/utils/commonFunction";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { Chip, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { lazy, Suspense, useEffect, useMemo, useReducer } from "react";
import { useTranslation } from "react-i18next";

const SelectProvider = lazy(() =>
  import("@/components/configuration/selectProvider/SelectProvider")
);

const SmartIdFlow = lazy(() =>
  import("@/components/configuration/smartId/SmartIdFlow")
);

const UsbTokenFlow = lazy(() =>
  import("@/components/configuration/usbToken/UsbTokenFlow")
);

const EidFlow = lazy(() =>
  import("@/components/configuration/electronicId/EidFlow")
);

const IssFlow = lazy(() => import("@/components/configuration/iss/IssFlow"));

const SettingSignature = lazy(() =>
  import("@/components/configuration/settingSignature/SettingSignature")
);

const defaultValue = {};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "SET_DEFAULT":
      return {
        data: defaultValue,
        isShowSelectProvider: false,
        isShowSmartIdFlow: false,
        isShowUsbTokenFlow: false,
        isShowElectronicFlow: false,
        isShowIssFlow: false,
        isShowSettingSignature: false,
        index: null,
        signatureList: state.signatureList,
      };
    case "SET_DATA":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case "SET_INDEX":
      return {
        ...state,
        index: action.payload,
      };
    case "SET_CERT_LIST":
      return {
        ...state,
        certList: action.payload,
      };
    case "SET_SIGNATURE_LIST":
      return {
        ...state,
        signatureList: action.payload,
      };
    case "ADD_SIGNATURE":
      return {
        ...state,
        signatureList: [...state.signatureList, action.payload],
      };
    case "REMOVE_SIGNATURE":
      return {
        ...state,
        signatureList: state.signatureList.filter(
          (item, index) => index !== action.payload
        ),
      };
    case "UPDATE_SIGNATURE":
      return {
        ...state,
        signatureList: state.signatureList.map((item, index) => {
          if (index === action.index) {
            return { ...item, ...action.payload };
          }
          return item;
        }),
      };
    case "SET_IS_SHOW_SELECT_PROVIDER":
      return {
        ...state,
        isShowSelectProvider: action.payload,
      };
    case "SET_IS_SHOW_SMART_ID_FLOW":
      return {
        ...state,
        isShowSmartIdFlow: action.payload,
      };
    case "SET_IS_SHOW_USB_TOKEN_FLOW":
      return {
        ...state,
        isShowUsbTokenFlow: action.payload,
      };
    case "SET_IS_SHOW_ELECTRONIC_FLOW":
      return {
        ...state,
        isShowElectronicFlow: action.payload,
      };
    case "SET_IS_SHOW_ISS_FLOW":
      return {
        ...state,
        isShowIssFlow: action.payload,
      };
    case "SET_IS_SHOW_SETTING_SIGNATURE":
      return {
        ...state,
        isShowSettingSignature: action.payload,
      };

    default:
      throw new Error();
  }
};

export const SignaturesList = ({ initData, setSignatureList }) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: defaultValue,
    isShowSelectProvider: false,
    isShowSmartIdFlow: false,
    isShowUsbTokenFlow: false,
    isShowElectronicFlow: false,
    isShowIssFlow: false,
    isShowSettingSignature: false,
    index: null,
    signatureList: [],
  });
  console.log("SignatureList: ", state);

  const providerName = [
    "MOBILE_ID_SIGNING",
    "SMART_ID_SIGNING",
    "USB_TOKEN_SIGNING",
    "ELECTRONIC_ID",
    "ISS",
  ];
  const connectorList = useConnectorList(providerName);

  const lang = useMemo(() => getLang(), []);
  const prefixList = usePreFixList(lang);

  useEffect(() => {
    if (initData) {
      dispatch({ type: "SET_SIGNATURE_LIST", payload: initData });
    }
  }, [initData]);

  const filterPrefix = prefixList?.data?.filter(
    (item) =>
      item.type === "PHONE-ID" ||
      item.type === "PERSONAL-ID" ||
      item.name === "TAX-CODE"
  );
  // console.log("filterPrefix: ", filterPrefix);

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

  const handleRemoveSignature = (index) => {
    dispatch({ type: "SET_DEFAULT" });
    dispatch({ type: "REMOVE_SIGNATURE", payload: index });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: false });
  };

  const handleUpdateSignature = (data) => {
    dispatch({ type: "SET_DEFAULT" });
    dispatch({
      type: "UPDATE_SIGNATURE",
      index: data.index,
      payload: data.data,
    });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: false });
  };

  const handleOpen = () => {
    // setOpen(true);
    dispatch({ type: "SET_DEFAULT" });
    dispatch({ type: "SET_IS_SHOW_SELECT_PROVIDER", payload: true });
  };
  const handleClose = () => {
    // setOpen(false);
    dispatch({ type: "SET_IS_SHOW_SELECT_PROVIDER", payload: false });
  };

  const handleSubmitModelSelectProvider = (data) => {
    console.log("data: ", data);

    switch (data.provider) {
      case "SMART_ID_SIGNING":
        dispatch({ type: "SET_DATA", payload: data });
        dispatch({ type: "SET_IS_SHOW_SMART_ID_FLOW", payload: true });
        break;
      case "USB_TOKEN_SIGNING":
        {
          const newData = {
            connectorName: data.connectorName,
            provider: data.provider,
            tokenDetails: data.tokenDetails,
          };
          dispatch({ type: "SET_DATA", payload: newData });
          dispatch({ type: "SET_CERT_LIST", payload: data.certList });
          dispatch({ type: "SET_IS_SHOW_USB_TOKEN_FLOW", payload: true });
        }
        break;
      case "ELECTRONIC_ID":
        dispatch({ type: "SET_DATA", payload: data });
        dispatch({ type: "SET_IS_SHOW_ELECTRONIC_FLOW", payload: true });
        break;
      case "ISS":
        dispatch({ type: "SET_DATA", payload: data });
        dispatch({ type: "SET_IS_SHOW_ISS_FLOW", payload: true });
        break;
      default:
        break;
    }
  };

  const handleSubmitModelSmartIdFlow = (data) => {
    delete data.accessToken;
    dispatch({ type: "SET_DATA", payload: data });
    dispatch({ type: "SET_IS_SHOW_SMART_ID_FLOW", payload: false });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: true });
  };

  const handleSubmitModelUsbTokenFlow = (data) => {
    dispatch({ type: "SET_DATA", payload: data });
    console.log("data: ", data);
    dispatch({ type: "SET_IS_SHOW_USB_TOKEN_FLOW", payload: false });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: true });
  };

  const handleSubmitModelElectronicFlow = (data) => {
    delete data.jwt;
    dispatch({ type: "SET_DATA", payload: data });
    dispatch({ type: "SET_IS_SHOW_ELECTRONIC_FLOW", payload: false });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: true });
  };

  const handleSubmitModelIssFlow = (data) => {
    delete data.jwt;
    dispatch({ type: "SET_DATA", payload: data });
    dispatch({ type: "SET_IS_SHOW_ISS_FLOW", payload: false });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: true });
  };

  const handleSubmitModelSettingSignature = (data) => {
    dispatch({ type: "SET_DEFAULT" });
    dispatch({ type: "ADD_SIGNATURE", payload: data });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: false });
  };

  useEffect(() => {
    setSignatureList(state.signatureList);
  }, [state.signatureList, setSignatureList]);

  return (
    <Box
      sx={{
        maxWidth: "1114px",
        margin: "0 auto 24px",
        padding: "24px 30px",
        backgroundColor: "signingWFBackground.main",
        borderRadius: "10px",
      }}
    >
      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: "600",
          lineHeight: "36px",
          color: "#26293F",
        }}
      >
        Signature
      </Typography>
      {state.signatureList.length === 0 && (
        <Stack
          direction="row"
          sx={{ padding: "16px 30px", mt: "24px", backgroundColor: "#F3F5F8" }}
        >
          <SignatureImage />
          <Box sx={{ padding: "20px 40px", width: "510px" }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "600",
                lineHeight: "36px",
                color: "#1C1C1C",
              }}
            >
              More personal e-signing with a digitized version of your signature
            </Typography>
            <Typography
              sx={{
                mt: "12px",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "24px",
                color: "#1C1C1C",
              }}
            >
              Add an image of your reproduced signature in writing to the
              signature annotation.
            </Typography>
          </Box>
          <Chip
            label={t("arrangement.add")}
            color="primary"
            sx={{
              margin: "auto",
              padding: "8px 16px",
              height: "40px",
              width: "184px",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "24px",
              borderRadius: "25px",
              backgroundColor: "#3B82F6",
              cursor: "pointer",
              color: "white",
              gap: "8px",
              "& span": {
                padding: "0",
              },
              "& svg.MuiChip-icon": {
                margin: "0",
              },
              "& .MuiChip-label": {
                display: { xs: "none", md: "flex" },
              },
            }}
            icon={<AddIcon fontSize="small" color="borderColor.light" />}
            // clickable
            onClick={handleOpen}
          />
        </Stack>
      )}
      {state.signatureList.length > 0 && (
        <Stack sx={{ padding: "24px", mt: "24px", backgroundColor: "#F3F5F8" }}>
          {state.index === null && (
            <Stack
              sx={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              <Chip
                label={t("arrangement.add")}
                // color={checkWorkFlowStatus ? "primary" : "secondary"}
                color="primary"
                // variant="outlined"
                sx={{
                  padding: "8px 16px",
                  height: "40px",
                  fontWeight: "500",
                  // border: "2px solid ",
                  borderRadius: "25px",
                  boxShadow: "0px 0px 2px #DFD9E7 inset",
                  // backgroundColor: "#fff",
                  // backgroundColor: checkWorkFlowStatus ? "#3B82F6" : "#9b9895",
                  cursor: "pointer",
                  // color: "#1E40AF",
                  gap: "8px",
                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                  },
                  "& .MuiChip-label": {
                    display: { xs: "none", md: "flex" },
                  },
                }}
                icon={<AddIcon fontSize="small" color="borderColor.light" />}
                // clickable
                onClick={handleOpen}
              />
            </Stack>
          )}
          {state.index !== null && (
            <Stack
              direction="row"
              gap="16px"
              justifyContent="flex-end"
              alignItems="center"
            >
              <IconButton
                aria-label="Example"
                onClick={() => handleRemoveSignature(state.index)}
              >
                <DeleteIcon />
              </IconButton>
              <Chip
                label={t("0-common.edit")}
                // color={checkWorkFlowStatus ? "primary" : "secondary"}
                //   color="success"
                variant="outlined"
                sx={{
                  padding: "8px 16px",
                  height: "40px",
                  fontWeight: "500",
                  // border: "2px solid ",
                  borderRadius: "25px",
                  boxShadow: "0px 0px 2px #DFD9E7 inset",
                  backgroundColor: "#fff",
                  // backgroundColor: checkWorkFlowStatus ? "#3B82F6" : "#9b9895",
                  cursor: "pointer",
                  color: "#1E40AF",
                  gap: "10px",
                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                  },
                  "& .MuiChip-label": {
                    display: { xs: "none", md: "flex" },
                  },
                }}
                icon={<CreateIcon fontSize="small" color="borderColor.light" />}
                // clickable
                onClick={() =>
                  dispatch({
                    type: "SET_IS_SHOW_SETTING_SIGNATURE",
                    payload: true,
                  })
                }
              />
            </Stack>
          )}

          <Stack direction="row" gap="16px" mt="16px" flexWrap="wrap">
            {state.signatureList.map((item, index) => (
              <Box
                key={index}
                sx={{
                  // width: "50%",
                  flexBasis: "calc(50% - 8px)",
                  padding: "25px",
                  backgroundColor: "#F7F9FC",
                  borderRadius: "4px",
                  border: `5px solid ${
                    index === state.index ? "#3B82F6" : "white"
                  }`,
                  boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.10)",
                }}
                onClick={() => {
                  if (state.index !== null) {
                    dispatch({ type: "SET_INDEX", payload: null });
                    dispatch({ type: "SET_DATA", payload: defaultValue });
                  } else {
                    dispatch({ type: "SET_INDEX", payload: index });
                    dispatch({ type: "SET_DATA", payload: item });
                  }
                }}
              >
                <Box
                  sx={{
                    height: "134px",
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #DFDBD6",
                  }}
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <SignatureItem data={item} />
                  </Suspense>
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <SelectProvider
          connectorList={connectorList?.data}
          mapProvider={mapProvider}
          filterConnector={[]}
          open={state.isShowSelectProvider}
          onClose={handleClose}
          handleSubmitModel={handleSubmitModelSelectProvider}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <SmartIdFlow
          initData={state.data}
          filterPrefix={filterPrefix}
          open={state.isShowSmartIdFlow}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({ type: "SET_IS_SHOW_SMART_ID_FLOW", payload: false });
          }}
          handleSubmitModel={handleSubmitModelSmartIdFlow}
          connectorList={connectorList.data?.SMART_ID_SIGNING}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <UsbTokenFlow
          initData={state.data}
          certList={state.certList}
          open={state.isShowUsbTokenFlow}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({ type: "SET_IS_SHOW_USB_TOKEN_FLOW", payload: false });
          }}
          handleSubmitModel={handleSubmitModelUsbTokenFlow}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <EidFlow
          initData={state.data}
          filterPrefix={filterPrefix}
          open={state.isShowElectronicFlow}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({ type: "SET_IS_SHOW_ELECTRONIC_FLOW", payload: false });
          }}
          handleSubmitModel={handleSubmitModelElectronicFlow}
          connectorList={connectorList.data?.SMART_ID_SIGNING}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <IssFlow
          initData={state.data}
          filterPrefix={filterPrefix}
          open={state.isShowIssFlow}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({ type: "SET_IS_SHOW_ISS_FLOW", payload: false });
          }}
          handleSubmitModel={handleSubmitModelIssFlow}
          connectorList={connectorList.data?.SMART_ID_SIGNING}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <SettingSignature
          initData={state.data}
          open={state.isShowSettingSignature}
          onClose={() => {
            // setOpen(false);
            dispatch({ type: "SET_DEFAULT" });
            dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: false });
          }}
          handleSubmitModel={handleSubmitModelSettingSignature}
          // handleRemoveSignature={handleRemoveSignature}
          handleUpdateSignature={handleUpdateSignature}
        />
      </Suspense>
    </Box>
  );
};

SignaturesList.propTypes = {
  setSignatureList: PropTypes.func,
  initData: PropTypes.array,
};

export default SignaturesList;
