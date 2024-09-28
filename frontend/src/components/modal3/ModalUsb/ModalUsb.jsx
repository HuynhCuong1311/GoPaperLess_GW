import { ReactComponent as CardIcon } from "@/assets/images/svg/card.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import ISPluginClient from "@/assets/js/checkid";
import { PasswordField } from "@/components/form";
import { usePending, useUsbHash, useUsbPackFile } from "@/hook";
import { useAuthorizeOTP } from "@/hook/use-electronicService";
import {
  convertSmartIdType,
  convertTime,
  getLang,
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
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ModalUsb = ({ open, onClose, dataSigning, setDataSigning }) => {
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      pin: "",
    },
  });

  const { t } = useTranslation();

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const usbHash = useUsbHash();
  // console.log("usbHash: ", usbHash.data);
  const authorizeOTP = useAuthorizeOTP();

  const isPending = usePending();
  const queryClient = useQueryClient();

  const packFile = useUsbPackFile();
  // console.log("packFile: ", packFile);

  const formRef = useRef();
  const sdk = useRef(null);
  let lang = getLang();
  const [errorApi, setErrorApi] = useState(null);
  const urlWithoutProtocol = getUrlWithoutProtocol();

  const getCertificate = useMutation({
    mutationFn: async (data) => {
      // console.log("data: ", data);
      try {
        const response = await connectWS(data);
        // console.log("response: ", response);
        return response;
      } catch (error) {
        // console.log("error: ", error);
        throw new Error(error);
      }
    },

    onSuccess: (data) => {
      const request = {
        ...dataSigning,
        signatures: data.signatures,
      };
      packFile.mutate(request, {
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
      });
      return data;
    },
    onError: () => {
      console.log("pin sai");
      reset({
        pin: "",
      });
    },
  });

  useEffect(() => {
    if (
      (dataSigning.provider === "USB_TOKEN_SIGNING" &&
        watch("pin").length >= dataSigning?.tokenDetails?.minPinLength &&
        watch("pin").length <= dataSigning?.tokenDetails?.maxPinLength) ||
      (dataSigning.provider === "ISS" && watch("pin").length >= 6)
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [watch("pin"), setIsSubmitDisabled, watch, dataSigning.provider]);

  function disconnectWSHTML() {
    sdk.current.shutdown();
  }

  const connectWS = (data) => {
    // console.log("data: ", data);
    return new Promise(function (resolve, reject) {
      const ipWS = "127.0.0.1";
      const portWS = "9505";
      const typeOfWS = "wss";
      sdk.current = new ISPluginClient(
        ipWS,
        portWS,
        typeOfWS,
        function () {
          // console.log("connected");
          //            socket onopen => connected
          getSignature(data, resolve, reject);
          // flagFailedConnectHTML = 1;
        },
        function () {
          //            socket disconnected
          // console.log("Connect error");
        },
        function () {
          //            socket stopped
        },
        function () {
          // console.log("connected denied");
          // console.log("statusCallBack: ", statusCallBack);
          disconnectWSHTML();
        },
        function (cmd, id, error, data) {
          console.log("id: ", id);
          //RECEIVE
          console.log("cmd: ", cmd);
          console.log("error: ", error);
          console.log("data: ", data);
        }
      );
    });
  };

  const getSignature = (data, resolve, reject) => {
    // console.log("dataSigning: ", dataSigning);
    const certId = dataSigning.certChain.id;
    const pin = data.pin;
    const temp = {
      dtbsHash: data.dtbsHash,
      algorithm: "SHA256",
    };
    const signObjects = [];
    signObjects.push(temp);
    const timeOutInterval = 60;
    sdk.current.signTokenCertificate(
      certId,
      pin,
      signObjects,
      urlWithoutProtocol,
      timeOutInterval,
      lang,
      function (response) {
        resolve(response);
        disconnectWSHTML();
      },
      function (error, mess) {
        console.log("error: ", error);
        console.log("mess: ", mess);
        reject(mess);
        // setErrorGetCert(mess);
        disconnectWSHTML();
      },
      function () {
        // console.log("timeout");
        sdk.current = null;
      }
    );
  };

  const handelCancel = () => {
    onClose();
    disconnectWSHTML();
  };

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };

  const handleFormSubmit = (data1) => {
    // console.log("data: ", data1);
    if (dataSigning.provider === "ISS") {
      authorizeOTP.mutate(
        {
          lang: dataSigning.language,
          credentialID: dataSigning.certChain.credentialID,
          otp: data1.pin,
          signerId: dataSigning.signerId,
          signingToken: dataSigning.signingToken,
          fileName: dataSigning.fileName,
          signerToken: dataSigning.signerToken,
          connectorName: dataSigning.connectorName,
          signingOption: "internal signing service",
          codeNumber: dataSigning.code,
          type: convertSmartIdType(dataSigning.criteriaAlias), //CITIZEN-IDENTITY-CARD
          certChain: dataSigning.certChain.cert,
          enterpriseId: dataSigning.enterpriseId,
          workFlowId: dataSigning.workFlowId,
          fieldName: dataSigning.fieldName,
          lastFileId: dataSigning.lastFileId,
          documentId: dataSigning.documentId,
          country: dataSigning.country,
          countryRealtime: dataSigning.countryRealtime,
          signingPurpose: dataSigning.signingPurpose,
          imageBase64: dataSigning.imageBase64,
          assurance: dataSigning.assurance,
          contactInfor: dataSigning.contactInfor,
          textField: dataSigning.textField,
          workFlowProcessType: dataSigning.workFlowProcessType,
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
      usbHash.mutateAsync(dataSigning, {
        onSuccess: (data) => {
          // console.log("data: ", data);
          setDataSigning({
            ...dataSigning,
            pin: data1.pin,
            dtbsHash: data.hashPG,
            hashList: data.hash,
          });
          const request = {
            dtbsHash: data.hashPG,
            pin: data1.pin,
          };
          getCertificate.mutateAsync(request);
        },
      });
    }
  };
  // console.log("hash error: ", usbHash.error);

  useEffect(() => {
    const error1 =
      getCertificate?.error?.message ||
      packFile?.error?.message ||
      usbHash?.error?.response?.data?.message ||
      authorizeOTP.error?.response?.data?.message;
    setErrorApi(error1);
  }, [
    getCertificate?.error,
    packFile?.error,
    usbHash?.error,
    authorizeOTP?.error,
  ]);
  return (
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
      open={!!open}
      onClose={onClose}
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
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                width: "100%",
                border: "1px solid",
                borderColor: "borderColorBlue.main",
                borderRadius: "10px",
                my: "10px",
                px: 2,
                py: 1,
              }}
            >
              <SvgIcon
                component={
                  dataSigning.assurance === "ESEAL" ? SealIcon : CardIcon
                }
                inheritViewBox
                sx={{
                  width: "60px",
                  height: "60px",
                  color: "signingtextBlue.main",
                  cursor: "pointer",
                  mx: 2,
                }}
                // onClick={() => handleOpenSigningForm(index)}
              />

              <Box flexGrow={1} textAlign="left">
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ textTransform: "uppercase" }}
                >
                  {dataSigning?.certChain?.subject.commonName ||
                    dataSigning?.certChain?.subject}
                </Typography>
                <Typography variant="h6">
                  {/* {t("usb.usb9")} */}
                  {t("0-common.issuer")}:{" "}
                  {dataSigning?.certChain?.issuer.commonName ||
                    dataSigning?.certChain?.issuer}
                </Typography>
                <Typography variant="h6">
                  {t("0-common.valid")}:{" "}
                  {convertTime(dataSigning?.certChain?.validFrom).split(" ")[0]}{" "}
                  {t("0-common.to")}{" "}
                  {convertTime(dataSigning?.certChain?.validTo).split(" ")[0]}
                </Typography>
              </Box>
            </Stack>
            <Typography
              variant="body2"
              mb="10px"
              textAlign={"center"}
              color={"signingtextBlue.main"}
            >
              {/* Enter <span style={{ fontWeight: "bold" }}>PIN</span> for signing */}
              {t("modal.usb2")}
            </Typography>
            <Box
              width={"100%"}
              component="form"
              autoComplete="off"
              ref={formRef}
              onSubmit={handleSubmit(handleFormSubmit)}
              flexGrow={1}
            >
              <PasswordField
                name="pin"
                fullWidth
                control={control}
                //   sx={{ height: "28px" }}
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
                    handleSubmit(handleFormSubmit)();
                  }
                }}
                onChange={() => {
                  setErrorApi(null);
                }}
                disabled={isPending}
              />
            </Box>
            <Stack width={"100%"}>
              {errorApi && <Alert severity="error">{errorApi}</Alert>}
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
          onClick={handelCancel}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || isSubmitDisabled}
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

ModalUsb.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
};

export default ModalUsb;
