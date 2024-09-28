import {
  UseCheckType2,
  useConnectWS,
  useGetTokenCertificate,
  usePending,
} from "@/hook";
import { getLang } from "@/utils/commonFunction";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

const defaultValue = {
  provider: "",
  connectorName: "",
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "SET_DEFAULT":
      return {
        data: defaultValue,
        isLoading: false,
        isError: false,
        isPGError: "",
        isDisabled: true,
        errorMessage: "",
      };

    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
      };
    case "SET_PROVIDER":
      return {
        ...state,
        data: { ...state.data, provider: action.payload },
      };
    case "SET_CONNECTOR_NAME":
      return {
        ...state,
        isError: false,
        // isDisabled: false,
        data: { ...state.data, connectorName: action.payload },
      };

    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_IS_ERROR":
      return {
        ...state,
        isError: true,
        errorMessage: action.payload,
      };
    case "CLEAR_IS_ERROR":
      return {
        ...state,
        isError: false,
        errorMessage: "",
      };
    case "SET_ISPG_ERROR":
      return {
        ...state,
        isPGError: action.payload,
      };
    case "SET_DISABLED":
      return {
        ...state,
        isDisabled: action.payload,
      };
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
        isDisabled: false,
        errorMessage: "",
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: "",
        // data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload,
      };
    default:
      throw new Error();
  }
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 400, // Set chiều cao tối đa của menu
    },
  },
};

const SelectProvider = ({
  connectorList,
  mapProvider,
  filterConnector,
  open,
  onClose,
  handleSubmitModel,
}) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: defaultValue,
    isLoading: false,
    isError: false,
    isPGError: "",
    isDisabled: true,
    errorMessage: "",
  });

  const isPending = usePending();
  const connectWS = useConnectWS();
  const getTokenCertificate = useGetTokenCertificate();
  const checkType = UseCheckType2();

  const lang = getLang();

  const [data2, setData2] = useState(null);

  useEffect(() => {
    if (open) {
      const ipWS = "127.0.0.1";
      const portWS = "9505";
      const typeOfWS = "wss";

      var url = typeOfWS + "://" + ipWS + ":" + portWS + "/ISPlugin";

      const socket = new WebSocket(url);

      // Xử lý sự kiện khi kết nối mở thành công
      socket.addEventListener("open", () => {
        // console.log("Kết nối WebSocket đã thành công");
        dispatch({ type: "FETCH_SUCCESS" });
        dispatch({ type: "SET_DISABLED", payload: true });
        socket.close();
        // onBlur(true);
      });

      // Xử lý sự kiện khi xảy ra lỗi trong quá trình kết nối
      socket.addEventListener("error", () => {
        // console.error("Lỗi kết nối WebSocket:", error);
      });

      // Xử lý sự kiện khi kết nối bị đóng
      socket.addEventListener("close", (event) => {
        // console.log("Kết nối WebSocket đã bị đóng");
        // console.log("Mã đóng:", event.code);
        if (event.code === 1006) {
          // setErrorPG(t("modal.checkidwarning"));
          dispatch({
            type: "SET_ISPG_ERROR",
            payload: t("modal.checkidwarning"),
          });
        }
        // console.log("Lí do:", event.reason);
      });

      // Kiểm tra trạng thái kết nối hiện tại
      // console.log("Trạng thái kết nối:", socket.readyState);
    }
  }, [open, t]);

  useEffect(() => {
    if (state.data.provider !== "ISS" && state.data.connectorName === "") {
      dispatch({ type: "SET_DISABLED", payload: true });
    } else {
      dispatch({ type: "SET_DISABLED", payload: false });
    }
  }, [state.data.provider, state.data.connectorName, state.isError]);

  useEffect(() => {
    const filterValue = state.data.provider;
    const filterProvider = connectorList?.[filterValue] || [];

    if (filterProvider) {
      const filterData = filterProvider.filter((item) =>
        filterConnector.includes(item.connectorName)
      );
      const content = filterData.length > 0 ? filterData : filterProvider;
      const content2 = content?.map((item, i) => {
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
  }, [state.data.provider, connectorList, filterConnector]);

  const handleChange1 = (e) => {
    dispatch({ type: "SET_PROVIDER", payload: e.target.value });

    dispatch({ type: "SET_CONNECTOR_NAME", payload: "" });

    const filterValue = e.target.value;
    const filterProvider = connectorList?.[filterValue];

    if (filterProvider) {
      const filterData = filterProvider.filter((item) =>
        filterConnector.includes(item.connectorName)
      );
      const content = filterData.length > 0 ? filterData : filterProvider;
      const content2 = content?.map((item, i) => {
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

  const handleClose = () => {
    dispatch({ type: "SET_DEFAULT" });
    onClose();
  };

  const handleSubmitClick = () => {
    // console.log("provider: ", state.data.provider);
    switch (state.data.provider) {
      case "SMART_ID_SIGNING":
        if (
          [
            "SMART_ID_MOBILE_ID",
            "SMART_ID_LCA",
            "SMART_ID_VIETTEL-CA",
            "SMART_ID_MISA-CA",
          ].some((item) => item === state.data.connectorName)
        ) {
          onClose();
          dispatch({ type: "SET_DEFAULT" });
          handleSubmitModel(state.data);
        } else {
          dispatch({
            type: "SET_IS_ERROR",
            payload: t("signingForm.title6"),
          });
        }
        break;
      case "USB_TOKEN_SIGNING":
        {
          const dllUsb = connectorList?.USB_TOKEN_SIGNING?.filter(
            (item) => item.connectorName === state.data.connectorName
          )[0]?.identifier;
          // console.log("dllUsb: ", dllUsb);
          connectWS.mutate(
            {},
            {
              onSuccess: (data) => {
                console.log("data: ", data);
                getTokenCertificate.mutate(
                  {
                    dllUsb,
                    lang,
                  },
                  {
                    onSuccess: (data2) => {
                      console.log("getTokenCertificate: ", data2);
                      checkType.mutate(data2.signingCertificates, {
                        onSuccess: (data3) => {
                          // console.log("checkType: ", data3);
                          onClose();
                          dispatch({ type: "SET_DEFAULT" });
                          handleSubmitModel({
                            ...state.data,
                            certList: data3,
                            tokenDetails: data2.tokenDetails,
                          });
                        },
                        onError: (error) => {
                          console.log("error: ", error);
                          dispatch({
                            type: "SET_IS_ERROR",
                            payload: error.response.data.message,
                          });
                        },
                      });
                    },
                    onError: (error) => {
                      console.log("error: ", error);
                      dispatch({
                        type: "SET_IS_ERROR",
                        payload: error,
                      });
                    },
                  }
                );
              },
              onError: (error) => {
                console.log("error: ", error);
              },
            }
          );
          // onClose();
          // dispatch({ type: "SET_DEFAULT" });
          // handleSubmitModel(state.data);
        }
        break;
      case "ELECTRONIC_ID":
        onClose();
        dispatch({ type: "SET_DEFAULT" });
        handleSubmitModel(state.data);
        break;
      case "ISS":
        onClose();
        dispatch({ type: "SET_DEFAULT" });
        handleSubmitModel(state.data);
        break;
      default:
        dispatch({
          type: "SET_IS_ERROR",
          payload: t("signingForm.title6"),
        });
        break;
    }
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
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
      open={!!open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        sx: {
          width: "500px",
          maxWidth: "500px", // Set your width here
          height: "700px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{
          backgroundColor: "dialogBackground.main",
          p: "10px 20px",
          height: "51px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            display: "inline-block",
            color: "signingtextBlue.main",
            borderBottom: "4px solid",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
          }}
        >
          {t("signing.signing_method")}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "dialogBackground.main",
          height: "100%",
          // py: "10px",
          borderBottom: "1px solid",
          borderColor: "borderColor.main",
          p: "0 20px 10px",
        }}
      >
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
          // className="choyoyoy"
        >
          <Stack sx={{ width: "100%", height: "100%" }}>
            <Box flexGrow={1}>
              <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
                <Typography
                  variant="h6"
                  color="#1F2937"
                  fontWeight={600}
                  mb="10px"
                >
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
                        <ListItemSecondaryAction>
                          {item.icon}
                        </ListItemSecondaryAction>
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
                <Typography
                  variant="h6"
                  color="#1F2937"
                  fontWeight={600}
                  mb="10px"
                >
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
            </Box>
            {state.isPGError &&
              (state.data.provider === "USB_TOKEN_SIGNING" ||
                state.data.provider === "ELECTRONIC_ID") && (
                <Alert severity="error">{state.isPGError}</Alert>
              )}
            {state.isError && (
              <Alert severity="error">{state.errorMessage}</Alert>
            )}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={
            state.isDisabled ||
            isPending ||
            (!!state.isPGError &&
              (state.data.provider === "USB_TOKEN_SIGNING" ||
                state.data.provider === "ELECTRONIC_ID"))
          }
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SelectProvider.propTypes = {
  connectorList: PropTypes.object,
  mapProvider: PropTypes.array,
  filterConnector: PropTypes.array,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleSubmitModel: PropTypes.func,
};

export default SelectProvider;
