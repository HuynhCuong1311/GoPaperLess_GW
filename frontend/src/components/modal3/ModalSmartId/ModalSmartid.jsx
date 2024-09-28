import { useMisaSign, usePending, useSmartIdSign, useVtCASign } from "@/hook";
import { rsspService } from "@/services/rssp_service";
import {
  capitalLize,
  convertProviderToSignOption,
} from "@/utils/commonFunction";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function CircularProgressWithLabel(props) {
  // console.log("props: ", props);
  const formatTime = (seconds) => {
    const totalTime = 300;
    const minutes = Math.floor(((seconds / 100) * totalTime) / 60);
    const remainingSeconds = Math.floor(((seconds / 100) * totalTime) % 60);

    const formattedTime = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;

    return formattedTime;
  };

  CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
  };
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontSize: "1.75rem" }}
          component="div"
          color="text.secondary"
        >
          {/* {`${Math.round(props.value)}%`} */}
          {formatTime(props.value)}
        </Typography>
      </Box>
    </Box>
  );
}

export const ModalSmartid = ({ open, onClose, dataSigning }) => {
  // console.log("dataSigning: ", dataSigning);
  const { t } = useTranslation();
  const isPending = usePending();

  const queryClient = useQueryClient();

  const [vcode, setVc] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(100);

  const [signFileController, setSignFileController] = useState(
    new AbortController()
  );
  const timer = useRef(null);

  const smartSign = useSmartIdSign({ signal: signFileController.signal });
  const misaSign = useMisaSign({ signal: signFileController.signal });
  const vtSign = useVtCASign({ signal: signFileController.signal });

  useEffect(() => {
    if (!open) return;
    if (progress > 0.5) {
      timer.current = setInterval(() => {
        setProgress((prevProgress) => prevProgress - 1 / 3);
      }, 1000);

      return () => {
        clearInterval(timer.current);
      };
    }
    if (progress <= 0.5) {
      setProgress(0);
    }
  }, [progress, open]);

  useEffect(() => {
    if (
      open &&
      ["SMART_ID_MOBILE_ID", "SMART_ID_LCA"].some(
        (item) => item === dataSigning.connectorName
      )
    ) {
      smartSign.mutate(
        {
          fieldName: dataSigning.signatureData.field_name,
          codeNumber: dataSigning.criteria + ":" + dataSigning.code,
          connectorName: dataSigning.connectorName,
          country: dataSigning.locationValue,
          imageBase64: dataSigning.signatureImage,
          language: dataSigning.language,
          requestID: dataSigning.requestID,
          signerToken: dataSigning.workFlow.signerToken,
          signingOption: convertProviderToSignOption(dataSigning.provider),
          signingToken: dataSigning.workFlow.signingToken,
          codeEnable: dataSigning.codeEnable,
          certChain: dataSigning.certSelected,
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
            queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
            onClose();
            return true;
          },
          onError: (err) => {
            console.log("err: ", err);
            setProgress(0);
            setError(err.response.data.message);
            clearInterval(timer.current);
          },
        }
      );
      getVCEnabled();
    } else if (
      ["SMART_ID_MISA-CA"].some((item) => item === dataSigning.connectorName)
    ) {
      misaSign.mutate(
        {
          fieldName: dataSigning.signatureData.field_name,
          connectorName: dataSigning.connectorName,
          country: dataSigning.locationValue,
          imageBase64: dataSigning.signatureImage,
          language: dataSigning.language,
          signerToken: dataSigning.workFlow.signerToken,
          signingOption: convertProviderToSignOption(dataSigning.provider),
          signingToken: dataSigning.workFlow.signingToken,
          certChain: dataSigning.certSelected,
          contactInfor: dataSigning.contactInfor,
          assurance: dataSigning.assurance,
          textField: dataSigning.textField,
          remoteSigningAccessToken: dataSigning.remoteSigningAccessToken,
        },
        {
          onSuccess: (data) => {
            window.parent.postMessage(
              { data: data.data, status: "Success" },
              "*"
            );
            queryClient.invalidateQueries({ queryKey: ["getField"] });
            queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
            onClose();
            return true;
          },
          onError: (err) => {
            console.log("err: ", err);
            setProgress(0);
            setError(err.response.data.message);
            clearInterval(timer.current);
          },
        }
      );
    } else if (
      ["SMART_ID_VIETTEL-CA"].some((item) => item === dataSigning.connectorName)
    ) {
      vtSign.mutate(
        {
          fieldName: dataSigning.signatureData.field_name,
          connectorName: dataSigning.connectorName,
          country: dataSigning.locationValue,
          imageBase64: dataSigning.signatureImage,
          language: dataSigning.language,
          signerToken: dataSigning.workFlow.signerToken,
          signingOption: convertProviderToSignOption(dataSigning.provider),
          signingToken: dataSigning.workFlow.signingToken,
          certChain: dataSigning.certSelected,
          contactInfor: dataSigning.contactInfor,
          assurance: dataSigning.assurance,
          textField: dataSigning.textField,
          accessToken: dataSigning.accessToken,
          credentialID: dataSigning.certSelected.credential_id,
          userId: dataSigning.userName,
        },
        {
          onSuccess: (data) => {
            window.parent.postMessage(
              { data: data.data, status: "Success" },
              "*"
            );
            queryClient.invalidateQueries({ queryKey: ["getField"] });
            queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
            onClose();
            return true;
          },
          onError: (err) => {
            console.log("err: ", err);
            setProgress(0);
            setError(err.response.data.message);
            clearInterval(timer.current);
          },
        }
      );
    }
  }, [open]);

  const getVCEnabled = async () => {
    const response = await rsspService.getVc({
      requestID: dataSigning.requestID,
    });
    // console.log("response: ", response.data);
    setVc(response.data);
    // setVCEnabled(false);
  };

  const handleSign = () => {
    setProgress(100);
    setVc(null);
    setError(null);
    if (
      ["SMART_ID_MOBILE_ID", "SMART_ID_LCA"].some(
        (item) => item === dataSigning.connectorName
      )
    ) {
      smartSign.mutate(
        {
          fieldName: dataSigning.signatureData.field_name,
          codeNumber: dataSigning.criteria + ":" + dataSigning.code,
          connectorName: dataSigning.connectorName,
          country: dataSigning.locationValue,
          imageBase64: dataSigning.signatureImage,
          language: dataSigning.language,
          requestID: dataSigning.requestID,
          signerToken: dataSigning.workFlow.signerToken,
          signingOption: convertProviderToSignOption(dataSigning.provider),
          signingToken: dataSigning.workFlow.signingToken,
          codeEnable: dataSigning.codeEnable,
          certChain: dataSigning.certSelected,
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
            queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
            onClose();
            return true;
          },
          onError: (err) => {
            console.log("err: ", err);
            setProgress(0);
            setError(err.response.data.message);
            clearInterval(timer.current);
          },
        }
      );
      getVCEnabled();
    } else if (
      ["SMART_ID_MISA-CA"].some((item) => item === dataSigning.connectorName)
    ) {
      misaSign.mutate(
        {
          fieldName: dataSigning.signatureData.field_name,
          connectorName: dataSigning.connectorName,
          country: dataSigning.locationValue,
          imageBase64: dataSigning.signatureImage,
          language: dataSigning.language,
          signerToken: dataSigning.workFlow.signerToken,
          signingOption: convertProviderToSignOption(dataSigning.provider),
          signingToken: dataSigning.workFlow.signingToken,
          certChain: dataSigning.certSelected,
          contactInfor: dataSigning.contactInfor,
          assurance: dataSigning.assurance,
          textField: dataSigning.textField,
          remoteSigningAccessToken: dataSigning.remoteSigningAccessToken,
        },
        {
          onSuccess: (data) => {
            window.parent.postMessage(
              { data: data.data, status: "Success" },
              "*"
            );
            queryClient.invalidateQueries({ queryKey: ["getField"] });
            queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
            onClose();
            return true;
          },
          onError: (err) => {
            console.log("err: ", err);
            setProgress(0);
            setError(err.response.data.message);
            clearInterval(timer.current);
          },
        }
      );
    } else if (
      ["SMART_ID_VIETTEL-CA"].some((item) => item === dataSigning.connectorName)
    ) {
      vtSign.mutate(
        {
          fieldName: dataSigning.signatureData.field_name,
          connectorName: dataSigning.connectorName,
          country: dataSigning.locationValue,
          imageBase64: dataSigning.signatureImage,
          language: dataSigning.language,
          signerToken: dataSigning.workFlow.signerToken,
          signingOption: convertProviderToSignOption(dataSigning.provider),
          signingToken: dataSigning.workFlow.signingToken,
          certChain: dataSigning.certSelected,
          contactInfor: dataSigning.contactInfor,
          assurance: dataSigning.assurance,
          textField: dataSigning.textField,
          accessToken: dataSigning.accessToken,
          credentialID: dataSigning.certSelected.credential_id,
          userId: dataSigning.userName,
        },
        {
          onSuccess: (data) => {
            window.parent.postMessage(
              { data: data.data, status: "Success" },
              "*"
            );
            queryClient.invalidateQueries({ queryKey: ["getField"] });
            queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
            onClose();
            return true;
          },
          onError: (err) => {
            console.log("err: ", err);
            setProgress(0);
            setError(err.response.data.message);
            clearInterval(timer.current);
          },
        }
      );
    }
  };

  const handleCancelSign = () => {
    signFileController.abort();
    setSignFileController(new AbortController());
    clearInterval(timer.current);
    onClose();
  };

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
          {/* {title} */}
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
        >
          <Stack sx={{ mt: 0, mb: 1, height: "100%" }}>
            <Typography variant="h6">
              {dataSigning.codeEnable
                ? t("modal.smartid1")
                : t("modal.smartid5")}
            </Typography>
            <Box p="25px" textAlign={"center"} mb={"10px"}>
              {!dataSigning.codeEnable ? (
                <Typography
                  fontSize={"24px"}
                  height={"29px"}
                  fontWeight={"bold"}
                >
                  {t("modal.smartid6")}
                </Typography>
              ) : vcode ? (
                <Typography
                  fontSize={"48px"}
                  height={"59px"}
                  fontWeight={"bold"}
                >
                  {vcode}
                </Typography>
              ) : (
                <CircularProgress />
              )}
            </Box>
            <Typography variant="h6" mb={"10px"}>
              {dataSigning.codeEnable
                ? t("modal.smartid4")
                : t("modal.smartid7")}
              {/* {t("modal.smartid4")} */}
            </Typography>
            <Box textAlign="center" my="10px" flexGrow={1}>
              <CircularProgressWithLabel
                size={150}
                value={progress}
                them={300}
              />
            </Box>

            <Stack width={"100%"}>
              {error && <Alert severity="error">{capitalLize(error)}</Alert>}
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
          onClick={handleCancelSign}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending}
          startIcon={
            smartSign.isPending ? (
              <CircularProgress color="inherit" size="1em" />
            ) : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
            fontWeight: 600,
          }}
          onClick={handleSign}
          type="button"
        >
          {t("0-common.retry")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalSmartid.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
};

export default ModalSmartid;
