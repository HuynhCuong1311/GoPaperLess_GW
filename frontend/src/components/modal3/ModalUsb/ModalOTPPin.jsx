import CertButton from "@/components/CertButton/CertButton";
import {
  useAuthorizeOTP,
  useConnectWS,
  usePending,
  useTokenGetSignature,
  useUsbHash,
  useUsbPackFile,
} from "@/hook";
import {
  convertProviderToSignOption,
  getUrlWithoutProtocol,
} from "@/utils/commonFunction";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useReducer } from "react";
import { useTranslation } from "react-i18next";

const defaultValue = {
  pinValue: "",
  dtbsHash: "",
  hashList: "",
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
        data: { ...state.data, ...action.payload },
      };
    case "SET_PIN_VALUE":
      return {
        ...state,
        data: { ...state.data, pinValue: action.payload },
      };
    case "SET_DTBS_HASH":
      return {
        ...state,
        data: { ...state.data, dtbsHash: action.payload },
      };
    case "SET_HASH_LIST":
      return {
        ...state,
        data: { ...state.data, hashList: action.payload },
      };
    case "SET_IS_DISABLED":
      return {
        ...state,
        isDisabled: action.payload,
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
    case "SET_TAXINFORMATIONS":
      return {
        ...state,
        taxInformations: action.payload,
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

const ModalOTPPin = ({ dataSigning, open, onClose }) => {
  // console.log("dataSigning: ", dataSigning);
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: defaultValue,
    isLoading: false,
    isError: false,
    isPGError: "",
    isDisabled: true,
    errorMessage: "",
  });
  // console.log("OTPPIN state: ", state);

  const isPending = usePending();
  const usbHash = useUsbHash();
  const connectWS = useConnectWS();
  const signature = useTokenGetSignature();
  const packFile = useUsbPackFile();
  const queryClient = useQueryClient();
  const authorizeOTP = useAuthorizeOTP();

  const handleClose = () => {
    dispatch({ type: "SET_DEFAULT" });
    onClose();
  };

  const handleSubmitClick = () => {
    if (dataSigning.provider === "ISS") {
      authorizeOTP.mutate(
        {
          fieldName: dataSigning.signatureData.field_name,
          signerToken: dataSigning.workFlow.signerToken,
          signingOption: convertProviderToSignOption(dataSigning.provider),
          signingToken: dataSigning.workFlow.signingToken,
          lang: dataSigning.language,
          credentialID: dataSigning.certSelected.credentialID,
          codeNumber: dataSigning.code,
          certChain: dataSigning.certSelected.cert,
          country: dataSigning.locationValue,
          imageBase64: dataSigning.signatureImage,
          otp: state.data.pinValue,
          contactInfor: dataSigning.contactInfor,
          assurance: dataSigning.assurance,
          textField: dataSigning.textField,
        },
        {
          onSuccess: (data) => {
            window.parent.postMessage(
              { data: data.data, status: "Success" },
              "*"
            );
            queryClient.invalidateQueries({ queryKey: ["getField"] });
            // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
            queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
            onClose();
            return data;
          },
        }
      );
    } else {
      usbHash.mutateAsync(
        {
          contactInfor: dataSigning.contactInfor,
          fieldName: dataSigning.signatureData.field_name,
          signerToken: dataSigning.workFlow.signerToken,
          signingToken: dataSigning.workFlow.signingToken,
          connectorName: dataSigning.connectorName,
          certChain: dataSigning.certSelected,
          signingPurpose: dataSigning.reasonValue,
          country: dataSigning.locationValue,
          imageBase64: dataSigning.signatureImage,
          textField: dataSigning.textField,
        },
        {
          onSuccess: (data) => {
            console.log("data: ", data);
            // dispatch({ type: "SET_DTBS_HASH", payload: data.hashPG });
            // dispatch({ type: "SET_HASH_LIST", payload: data.hash });

            connectWS.mutate(
              {},
              {
                onSuccess: (data1) => {
                  console.log("data1: ", data1);
                  const temp = {
                    dtbsHash: data.hashPG,
                    algorithm: "SHA256",
                  };
                  const signObjects = [];
                  signObjects.push(temp);
                  const getSignatureRequest = {
                    certId: dataSigning.certSelected.userId,
                    pin: state.data.pinValue,
                    signObjects,
                    urlWithoutProtocol: getUrlWithoutProtocol(),
                  };
                  signature.mutate(getSignatureRequest, {
                    onSuccess: (data2) => {
                      console.log("data2: ", data2);
                      packFile.mutate(
                        {
                          fieldName: dataSigning.signatureData.field_name,
                          signerToken: dataSigning.workFlow.signerToken,
                          signingOption: convertProviderToSignOption(
                            dataSigning.provider
                          ),
                          signingToken: dataSigning.workFlow.signingToken,
                          hashList: data.hash,
                          certChain: dataSigning.certSelected,
                          country: dataSigning.locationValue,
                          imageBase64: dataSigning.signatureImage,
                          contactInfor: dataSigning.contactInfor,
                          assurance: dataSigning.assurance,
                          signatures: data2.signatures,
                        },
                        {
                          onSuccess: (data3) => {
                            window.parent.postMessage(
                              { data: data.data, status: "Success" },
                              "*"
                            );
                            queryClient.invalidateQueries({
                              queryKey: ["getField"],
                            });
                            // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
                            queryClient.invalidateQueries({
                              queryKey: ["getWorkFlow"],
                            });
                            onClose();
                            return data3;
                          },
                          onError: (error) => {
                            console.log("error: ", error);
                            dispatch({
                              type: "SET_IS_ERROR",
                              payload: error.message,
                            });
                          },
                        }
                      );
                    },
                    onError: (error) => {
                      console.log("error: ", error);
                      dispatch({
                        type: "SET_IS_ERROR",
                        payload: error.message,
                      });
                    },
                  });
                },
                onError: (error) => {
                  console.log("connectWS error: ", error);
                  dispatch({
                    type: "SET_IS_ERROR",
                    payload: t("modal.checkidwarning"),
                  });
                },
              }
            );
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
          maxWidth: "500px",
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
          {t("signing.sign_document")}
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
          <Stack sx={{ mt: 0, mb: 1, height: "100%" }}>
            <Typography variant="h6" color="#475569">
              {t("modal.usb1")}
            </Typography>
            <Box
              sx={{
                my: "10px",
                backgroundColor: "signingWFBackground.main",
                borderRadius: "6px",
                border: "1px solid #3B82F6",
                padding: "7px 0",
              }}
            >
              <CertButton
                certdata={{
                  ...dataSigning.certSelected,
                  assurance: state.data.assurance,
                  provider: state.data.provider,
                  index: 0,
                }}
              />
            </Box>
            <Typography
              variant="body2"
              mb="10px"
              textAlign={"center"}
              color={"signingtextBlue.main"}
            >
              {/* Enter <span style={{ fontWeight: "bold" }}>PIN</span> for signing */}
              {t("modal.usb2")}
            </Typography>
            <Box width={"100%"} autoComplete="off" flexGrow={1}>
              <TextField
                fullWidth
                value={state.data.pinValue}
                size="small"
                id="pinNumber"
                // label="Password"
                type="search"
                // autoComplete="current-password"
                onChange={(event) => {
                  dispatch({
                    type: "SET_PIN_VALUE",
                    payload: event.target.value,
                  });
                  dispatch({ type: "CLEAR_IS_ERROR" });
                  if (
                    (dataSigning.provider === "USB_TOKEN_SIGNING" &&
                      event.target.value.length >=
                        dataSigning?.tokenDetails?.minPinLength &&
                      event.target.value.length <=
                        dataSigning?.tokenDetails?.maxPinLength) ||
                    (dataSigning.provider === "ISS" &&
                      event.target.value.length >= 6)
                  ) {
                    dispatch({ type: "SET_IS_DISABLED", payload: false });
                  } else {
                    dispatch({ type: "SET_IS_DISABLED", payload: true });
                  }
                }}
                inputProps={{
                  sx: {
                    py: "11px",
                    backgroundColor: "signingWFBackground.main",
                    textAlign: "center",
                  },
                  maxLength:
                    dataSigning.provider === "USB_TOKEN_SIGNING"
                      ? dataSigning?.tokenDetails?.maxPinLength
                      : 200,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmitClick();
                  }
                }}
                disabled={isPending}
              />
            </Box>
            <Stack width={"100%"}>
              {state.isError && (
                <Alert severity="error">{state.errorMessage}</Alert>
              )}
            </Stack>
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{ p: "15px 20px", height: "70px", backgroundColor: "#F9FAFB" }}
      >
        <Button
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            fontWeight: 600,
            backgroundColor: "white",
          }}
          onClick={handleClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || state.isDisabled}
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
            fontWeight: 600,
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

ModalOTPPin.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
};

export default ModalOTPPin;
