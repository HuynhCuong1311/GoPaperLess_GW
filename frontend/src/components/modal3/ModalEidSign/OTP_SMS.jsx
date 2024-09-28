import { electronicService } from "@/services/electronic_service";
import { convertProviderToSignOption } from "@/utils/commonFunction";
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
import { Step1, Step2 } from ".";

export const OTP_SMS = ({ open, onClose, dataSigning }) => {
  // console.log("dataSigning: ", dataSigning);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  const [skipped, setSkipped] = useState(new Set());
  const [errorPG, setErrorPG] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [requestID, setRequestID] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [otp, setOtp] = useState(null);

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

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

  const credentialOTP = async () => {
    setIsFetching(true);
    const data = {
      lang: dataSigning.language,
      credentialID: dataSigning.certSelected.credentialID,
      // connectorName: dataSigning.connectorName,
      // enterpriseId: dataSigning.enterpriseId,
      // workFlowId: dataSigning.workFlowId,
    };
    try {
      const response = await electronicService.credentialOTP(data);
      setRequestID(response.data);
      setIsFetching(false);
      if (activeStep === 1) {
        setActiveStep(2);
      }
    } catch (error) {
      setIsFetching(false);
      console.log("error", error);
    }
  };

  const authorizeOTP = async (otp) => {
    setIsFetching(true);
    setErrorPG(null);
    const data = {
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
    };
    try {
      const response = await electronicService.authorizeOTP(data);
      window.parent.postMessage(
        { data: response.data, status: "Success" },
        "*"
      );
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
      queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
      onClose();
    } catch (error) {
      console.log("error", error);
      setIsFetching(false);
      setErrorPG(error.response.data.message);
    }
  };

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        credentialOTP();
        break;
      case 2:
        authorizeOTP(otp);
        break;
      default:
        handleNext();
    }
  };

  const steps = [
    <Step1 key={"Step1"} phoneNumber={dataSigning.certSelected?.phoneNumber} />,
    <Step2
      key={"Step2"}
      setOtp={setOtp}
      onDisableSubmit={handleDisableSubmit}
      phoneNumber={dataSigning.certSelected?.phoneNumber}
      resendCredentialOTP={credentialOTP}
      handleCloseModal1={onClose}
      setErrorPG={setErrorPG}
      errorPG={errorPG}
      authorizeOTP={authorizeOTP}
      isFetching={isFetching}
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
          disabled={isFetching || (activeStep === 2 && isSubmitDisabled)}
          startIcon={
            isFetching ? <CircularProgress color="inherit" size="1em" /> : null
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

OTP_SMS.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
  signatureData: PropTypes.object,
};

export default OTP_SMS;
