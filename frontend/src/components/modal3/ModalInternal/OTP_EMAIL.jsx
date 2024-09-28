import { usePending } from "@/hook";
import {
  useAuthorizeOTP,
  useCredentialOTP,
} from "@/hook/use-electronicService";
import { convertProviderToSignOption } from "@/utils/commonFunction";
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
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EmailStep2, Step1 } from ".";

export const OTP_EMAIL = ({ open, onClose, dataSigning }) => {
  console.log("dataSigning: ", dataSigning);
  const { t } = useTranslation();
  const credentialOTP = useCredentialOTP();
  const authorizeOTP = useAuthorizeOTP();
  const isPending = usePending();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  const [skipped, setSkipped] = useState(new Set());
  const [errorPG, setErrorPG] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [otp, setOtp] = useState(null);
  const [requestID, setRequestID] = useState(null);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = (step = 1) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + step);
    setSkipped(newSkipped);
  };

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        credentialOTP.mutate(
          {
            lang: dataSigning.language,
            credentialID: dataSigning.certSelected.credentialID,
          },
          {
            onSuccess: (data) => {
              setRequestID(data);
              setActiveStep(2);
            },
            onError: (error) => {
              setErrorPG(error.response.data.message);
            },
          }
        );
        break;
      case 2:
        authorizeOTP.mutate(
          {
            fieldName: dataSigning.signatureData.field_name,
            signerToken: dataSigning.workFlow.signerToken,
            signingOption: convertProviderToSignOption(dataSigning.provider),
            signingToken: dataSigning.workFlow.signingToken,
            lang: dataSigning.language,
            credentialID: dataSigning.certSelected.credentialID,
            codeNumber: dataSigning.criteria + ":" + dataSigning.code,
            certChain: dataSigning.certSelected.cert,
            country: dataSigning.locationValue,
            imageBase64: dataSigning.signatureImage,
            requestID: requestID,
            otp: otp,
            contactInfor: dataSigning.contactInfor,
            assurance: dataSigning.assurance,
            textField: dataSigning.textField,
          },
          {
            onError: (error) => {
              setErrorPG(error.response.data.message);
            },
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
        break;
      default:
        handleNext();
    }
  };

  const steps = [
    <Step1 key="Step1" email={dataSigning.certSelected?.email} />,
    <EmailStep2
      key="Step2"
      setOtp={setOtp}
      otp={otp}
      email={dataSigning.certSelected?.email}
      onDisableSubmit={handleDisableSubmit}
      requestID={requestID}
      setRequestID={setRequestID}
      dataSigning={dataSigning}
      setErrorPG={setErrorPG}
      errorPG={errorPG}
      onClose={onClose}
      isPending={isPending}
    />,
  ];

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
            <Box flexGrow={1}>{steps[activeStep - 1]}</Box>
            {errorPG && <Alert severity="error">{errorPG}</Alert>}
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
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || (activeStep === 2 && isSubmitDisabled)}
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
          {errorPG
            ? t("0-common.retry")
            : activeStep === 2
            ? t("0-common.submit")
            : t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

OTP_EMAIL.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
  signatureData: PropTypes.object,
};

export default OTP_EMAIL;
