import {
  useConnectorList,
  usePending,
  usePreFixList,
  useSmartIdCertificate,
} from "@/hook";
import {
  convertProviderToSignOption,
  convertSignOptionsToProvider,
  convertTypeEid,
  getLang,
  getSigner,
} from "@/utils/commonFunction";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  Step1,
  Step2,
  Step3_smartid,
  Step4,
  Step5_usb,
  Step6_eid,
} from "../Signing";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SigningForm = ({
  open,
  onClose,
  workFlow,
  handleShowModalSignImage,
  handleShowEidModal,
  setDataSigning,
}) => {
  // console.log("workFlow: ", workFlow);
  // console.log("index: ", index);
  // console.log("open: ", open);

  const descriptionElementRef = useRef(null);

  let lang = getLang();

  // console.log("lang: ", lang);

  const isPending = usePending();

  // const sdk = useRef(null);

  // console.log("dataApi: ", dataApi.current);

  const [activeStep, setActiveStep] = useState(1);

  const signer = getSigner(workFlow);

  const signingOptions = signer.signingOptions
    ? signer.signingOptions.map((item) => Object.keys(item)[0])
    : ["mobile", "smartid", "usbtoken", "electronic_id"];

  const providerName = convertSignOptionsToProvider(signingOptions);

  const filterConnector = signer.signingOptions
    ? signer.signingOptions.map((item) => Object.values(item)[0].join(","))
    : [];

  const elementRef = useRef();
  const elementRef2 = useRef();
  const elementRef3 = useRef();
  const elementRef4 = useRef();
  const elementRef5 = useRef();
  const elementRef6 = useRef();

  const dataApi = useRef({
    fileName: workFlow.fileName,
    documentId: workFlow.documentId,
    workFlowId: workFlow.workFlowId,
    signingToken: workFlow.signingToken,
    signerToken: workFlow.signerToken,
    enterpriseId: workFlow.enterpriseId,
    signerId: signer.signerId,
    language: lang,
    fieldName: signer.signerId,
    lastFileUuid: workFlow.lastFileUuid,
  });
  // console.log("dataApi: ", dataApi.current);
  const handleNext = (step = 1) => {
    setActiveStep((prevActiveStep) => prevActiveStep + step);
  };

  const prefixList = usePreFixList(lang);
  // console.log("prefixList: ", prefixList);

  const connectorList = useConnectorList(providerName);
  // console.log("connectorList: ", connectorList.data);

  const cbSuccessgetSmartCert = () => {
    handleNext(1);
  };

  const smartIdCertificate = useSmartIdCertificate(cbSuccessgetSmartCert);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const filterPrefix = prefixList?.data?.filter(
    (item) => item.type === "PHONE-ID" || item.type === "PERSONAL-ID"
  );
  const filterPrefixEid = prefixList?.data?.filter(
    (item) => item.type === "PERSONAL-ID"
  );

  const handleStep1Submit = (data) => {
    // console.log("data: ", data);
    if (data.method === "eseal") {
      // onClose();
      toast.warn("Functionality is under development!");
    } else {
      handleNext(1);
    }
    // setMethod(data.method);
  };

  const handleStep2Submit = (data) => {
    // console.log("data: ", data);

    dataApi.current = {
      ...dataApi.current,
      signerId: signer.signerId,
      signingOption: convertProviderToSignOption(data.provider),
      lastFileId: workFlow.lastFileId,
      ...data,
    };

    switch (data.provider) {
      case "SMART_ID_SIGNING":
        if (data.connector === "SMART_ID_MOBILE_ID") {
          handleNext(1);
        } else {
          // onClose();
          toast.warn("Functionality is under development!");
        }
        break;
      case "USB_TOKEN_SIGNING":
        setActiveStep(5);
        break;
      case "ELECTRONIC_ID":
        if (data.connector === "Vietnam") {
          setActiveStep(6);
        } else {
          // onClose();
          toast.warn("Functionality is under development!");
        }
        break;
    }

    // setMethod(data.method);
  };

  const dialCode = useRef("");

  const handleStep3Submit = (data) => {
    // console.log("data: ", data);
    const codeNumber =
      data.criteria +
      ":" +
      (data.personalCode
        ? data.personalCode
        : data.phoneNumber.replace(dialCode.current, "0").trim());
    dataApi.current = {
      ...dataApi.current,
      codeNumber: codeNumber,
    };
    // console.log("dataApi.current: ", dataApi.current);
    smartIdCertificate.mutate(dataApi.current);
  };

  const handleStep4Submit = (data) => {
    // console.log("data: ", data);
    const requestID = uuidv4();
    dataApi.current = {
      ...dataApi.current,
      requestID: requestID,
      certChain: smartIdCertificate?.data?.listCertificate[data.certificate],
    };
    setDataSigning(dataApi.current);
    // handleNext(1);
    onClose();
    handleShowModalSignImage();
  };
  const handleStep5Submit = (data) => {
    // console.log("data: ", data);
    // console.log("dataApi: ", dataApi);
    dataApi.current = {
      ...dataApi.current,
      certChain: dataApi.current.signingCertificates[data.certificate],
    };
    setDataSigning(dataApi.current);
    onClose();
    handleShowModalSignImage();
  };

  const handleStep6Submit = (data) => {
    // console.log("data: ", data);
    const codeNumber = data.criteria + ":" + data.personalCode;
    dataApi.current = {
      ...dataApi.current,
      codeNumber: codeNumber,
      code: data.personalCode,
      criteriaAlias: convertTypeEid(data.criteria),
    };
    setDataSigning(dataApi.current);

    onClose();
    handleShowEidModal();
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        elementRef.current.requestSubmit();
        break;
      case 2:
        elementRef2.current.requestSubmit();
        break;
      case 3:
        elementRef3.current.requestSubmit();
        break;
      case 4:
        elementRef4.current.requestSubmit();
        break;
      case 5:
        elementRef5.current.requestSubmit();
        break;
      case 6:
        elementRef6.current.requestSubmit();
        break;
      default:
        // perFormProcess(); // chỉ để test
        handleNext();
    }
  };

  const steps = [
    <Step1 key="step1" ref={elementRef} onStep1Submit={handleStep1Submit} />,
    <Step2
      key="step2"
      ref={elementRef2}
      providerName={providerName}
      onStepSubmit={handleStep2Submit}
      connectorList={connectorList?.data}
      filterConnector={filterConnector}
    />,
    <Step3_smartid
      key="step3"
      ref={elementRef3}
      onStepSubmit={handleStep3Submit}
      data={filterPrefix}
      dialCode={dialCode}
      errorApi={smartIdCertificate?.error?.response?.data?.message}
    />,
    <Step4
      key="step4"
      ref={elementRef4}
      data={smartIdCertificate?.data?.listCertificate}
      onStepSubmit={handleStep4Submit}
    />,
    <Step5_usb
      key="step5"
      ref={elementRef5}
      listCertificate={dataApi.current.signingCertificates}
      onStepSubmit={handleStep5Submit}
    />,
    <Step6_eid
      key="step6"
      ref={elementRef6}
      data={filterPrefixEid}
      onStepSubmit={handleStep6Submit}
    />,
  ];

  let { title, subtitle } = useMemo(() => {
    switch (activeStep) {
      case 3:
        return {
          title: "SIGN DOCUMENT",
          subtitle:
            "Signing with Mobile-ID creates a qualified electronic signature which has equivalent legal effect of a handwritten signature.",
        };
      case 4:
      case 5:
        return {
          title: "SELECT CERTIFICATE",
          subtitle:
            "By choosing the certificate, I agree to the transfer of my name and personal identification code to the service provider.",
        };
      case 6:
        return {
          title: "SIGN DOCUMENT",
          subtitle: "Select document type",
        };
      default:
        return {
          title: "SIGN DOCUMENT",
          subtitle: "",
        };
    }
  }, [activeStep]);

  return (
    <Dialog
      // keepMounted={false}
      TransitionComponent={Transition}
      open={!!open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "470px",
            borderRadius: "10px",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{ backgroundColor: "dialogBackground.main", paddingBottom: "0px" }}
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
            marginBottom: "10px",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h5" width={"100%"}>
            {subtitle}
          </Typography>
        )}
      </DialogTitle>
      {/* <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton> */}
      {/* <Box sx={{ px: "24px" }}>
        <Divider />
      </Box> */}
      <DialogContent
        sx={{
          backgroundColor: "dialogBackground.main",
          maxHeight: "500px",
          // py: "10px",
        }}
      >
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
          // sx={{
          //   maxHeight: "500px",
          // }}
        >
          <Box sx={{ mt: 0, mb: 1 }} className="choioioioi">
            {/* {steps[activeStep]} */}
            {steps[activeStep - 1]}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: "24px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleCancelClick}
        >
          cancel
        </Button>
        <Button
          variant="outlined"
          disabled={isPending}
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleSubmitClick}
          type="button"
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
SigningForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleShowModalSignImage: PropTypes.func,
  handleShowEidModal: PropTypes.func,
  workFlow: PropTypes.object,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
};
export default SigningForm;
