/* eslint-disable no-unused-vars */
import ISPluginClient from "@/assets/js/checkid";
import { useConnectorList, useSmartIdCertificate } from "@/hook";
import { UseCheckType } from "@/hook/use-apiService";
import { electronicService } from "@/services/electronic_service";
import { internalService } from "@/services/internal_service";
import {
  convertTypeEidToCriteria,
  filterCertificates,
  getLang,
  isValidEmail,
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
import Typography from "@mui/material/Typography";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Step1,
  Step10,
  Step11,
  Step13,
  Step14,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
} from ".";
import { Step4 as AssuranceStep } from "../modal1/Step4";

export const ModalEid = ({
  open,
  onClose,
  workFlow,
  dataSigning,
  setDataSigning,
  handleShowModalSignImage,
  signer,
}) => {
  const { t } = useTranslation();
  // console.log("workFlow: ", workFlow);

  const smartIdCertificate = useSmartIdCertificate();

  const [activeStep, setActiveStep] = useState(null);
  const [skipped, setSkipped] = useState(new Set());
  const [subject, setSubject] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [errorPG, setErrorPG] = useState(null);
  const [isIdentifyRegistered, setIsIdentifyRegistered] = useState(false);
  const [personalInfomation, setPersonalInformation] = useState(null);
  const [image, setImage] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [faceSuccess, setFaceSuccess] = useState(null);
  const [imageFace, setImageFace] = useState(null);
  const [shouldDetectFaces, setShouldDetectFaces] = useState(true);
  const [direction, setDirection] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processId, setProcessId] = useState(null);
  const [otp, setOtp] = useState(null);
  const [certificateList, setCertificateList] = useState([]);
  const [newListCert, setNewListCert] = useState([]);
  const [taxInformation, setTaxInformation] = useState(null);
  const [assurance, setAssurance] = useState("");
  const [certSelected, setCertSelected] = useState(0);

  const sdk = useRef(null);
  const emailRef = useRef(null);
  const [taxCode, setTaxCode] = useState(null);
  const dialCode = useRef("");
  const providerSelected = useRef(null);

  const connectorName = "MOBILE_ID_IDENTITY";
  const providerName = ["SMART_ID_SIGNING"];
  const connectorList = useConnectorList(providerName);
  // console.log("connectorList: ", connectorList);
  const checkType = UseCheckType();

  let lang = getLang();

  useEffect(() => {
    if (workFlow.provider === "ISS") {
      chechOwnerRssp();
    } else {
      checkIdentity();
    }
    return () => {
      setErrorPG(null);
      if (sdk.current) {
        disconnectWSHTML();
      }
    };
  }, []);

  const imageFaceRef = useRef(null);
  useEffect(() => {
    if (imageFace != null) {
      if (imageFaceRef.current) clearTimeout(imageFaceRef.current);
      imageFaceRef.current = setTimeout(() => {
        faceAndCreate();
      }, 1000);
    }
  }, [imageFace]);

  useEffect(() => {
    setErrorPG(null);
    setFaceSuccess(null);
  }, [activeStep]);

  function disconnectWSHTML() {
    console.log("đóng sdk");
    sdk.current.shutdown();
  }

  const handleReset = () => {
    setActiveStep(0);
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

  const handleBack = () => {
    switch (activeStep) {
      case 13:
        setActiveStep(12);
        break;
      case 14:
        setActiveStep(12);
        break;
      default:
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        break;
    }
  };

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  const chechOwnerRssp = async () => {
    // console.log("object");
    const data = {
      lang: lang,
      connectorName: "SMART_ID_MOBILE_ID",
      connectorNameRSSP: "SMART_ID_MOBILE_ID",
      criteria: convertTypeEidToCriteria(workFlow.criteriaAlias),
      code: workFlow.code,
    };
    try {
      const response = await internalService.getRsspCertificate(data);
      // console.log("response: ", response.data);
      const newList = filterCertificates(signer, response.data);
      // let newList = [];
      // if (
      //   signer.metaInformation?.certificate_sn ||
      //   signer.metaInformation?.base64_certificate
      // ) {
      //   newList = response.data.filter(
      //     (item) =>
      //       item.serialNumber.toLowerCase() ===
      //         signer.metaInformation.certificate_sn.toLowerCase() ||
      //       item.cert ===
      //         removeBeginEndCertificate(
      //           signer.metaInformation?.base64_certificate
      //         )
      //   );
      // } else {
      //   newList = response.data;
      // }
      setCertificateList(newList);
      setActiveStep(12);
    } catch (error) {
      console.log("error: ", error);
      setErrorPG(error.response.data.message);
    }
  };

  // step submit
  const checkIdentity = async () => {
    const data = {
      lang: lang,
      code: workFlow.code,
      type: workFlow.criteriaAlias,
    };
    try {
      const response = await electronicService.checkIdentity(data);
      if (response.data) {
        setSubject(response.data);
      }
      if (activeStep === null) {
        setActiveStep(1);
      }
      if (response.data.status === 0) {
        setIsIdentifyRegistered(true);
        setPersonalInformation(response.data.personal_informations);
        setImage(response.data.personal_informations.dg2);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectToWS = () => {
    const ipWS = "127.0.0.1";
    const portWS = "9505";
    const typeOfWS = "wss";

    // var url = typeOfWS + "://" + ipWS + ":" + portWS + "/ISPlugin";
    sdk.current = new ISPluginClient(
      ipWS,
      portWS,
      typeOfWS,
      function () {
        console.log("connected");
        //            socket onopen => connected
        setIsFetching(true);
        if (activeStep === 3) {
          readCard();
        } else {
          // faceScan();
        }
      },
      function () {
        //            socket disconnected
        console.log("Connect error");
      },
      function () {
        //            socket stopped
      },
      function (statusCallBack) {
        console.log("connected denied");
      },
      function (cmd, id, error, data) {
        //RECEIVE
        console.log("cmd: " + cmd);
      }
    );
  };

  const readCard = () => {
    setErrorPG(null);
    sdk.current.getInformationDetails(
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      lang,
      workFlow.code.slice(-6),
      60,
      function (response) {
        setIsFetching(false);
        setPersonalInformation(response.optionalDetails);
        setImage(response.image);
        handleNext();
      },
      function (error, mess) {
        switch (error) {
          case 1001:
            setErrorPG(t("electronic.eid not found"));
            break;
          case 1102:
            setErrorPG(t("electronic.can wrong"));
            break;
          default:
            setErrorPG(mess);
            break;
        }
        setIsFetching(false);
        disconnectWSHTML();
      },
      function () {
        console.log("timeout");
        setIsFetching(false);
        sdk.current = null;
      }
    );
  };

  const faceAndCreate = async () => {
    setIsFetching(true);
    const data = {
      lang: lang,
      code: workFlow.code,
      type: workFlow.criteriaAlias,
      facialImage: image,
      imageFace: imageFace,
      subject_id: personalInfomation?.subject_id,
    };

    try {
      const response = await electronicService.faceAndCreate(data);
      if (response.data.status === 0) {
        setJwt(response.data.jwt);
        try {
          var decoded = jwtDecode(response.data.jwt);

          if (decoded.mobile === "" || decoded.phone_number === "") {
            checkIdentity();
          }

          let stepToNavigate = -1;

          if (decoded.phone_number === "") {
            stepToNavigate = 7;
          } else if (decoded.email === "") {
            setPhoneNumber(decoded.phone_number);
            stepToNavigate = 9;
          } else {
            setPhoneNumber(decoded.phone_number);
            emailRef.current = decoded.email;
            stepToNavigate = 11;
          }

          if (stepToNavigate !== -1) {
            setDirection(t("electronic.faceSuccess"));
            setFaceSuccess(t("electronic.camSuccess"));
            setTimeout(() => {
              setIsFetching(false);
              setFaceSuccess(null);
              // handleNext(stepToNavigate);
              setActiveStep(stepToNavigate);
            }, 1000);
          }
        } catch (error) {
          console.error("Lỗi khi giải mã JWT:", error);
        }
      }
    } catch (error) {
      console.error("Lỗi khi gọi API faceAndCreate:", error);
      checkIdentity();
      setIsFetching(false);
      setErrorPG(error.response.data.message);
      // Xử lý lỗi tại đây nếu cần
    }
  };

  const updateSubject = async () => {
    setIsFetching(true);
    const data = {
      lang: lang,
      jwt: jwt,
      phoneNumber: phoneNumber,
      email: emailRef.current,
      subject_id: personalInfomation.subject_id,
    };

    try {
      const response = await electronicService.updateSubject(data);
      setIsFetching(false);
      setProcessId(response.data);
      switch (activeStep) {
        case 7:
          setActiveStep(8);
          break;
        case 9:
          setActiveStep(10);
          break;
      }
      // handleNext();
    } catch (error) {
      setIsFetching(false);
      console.error("Lỗi khi gọi API updateSubject:", error);
      switch (activeStep) {
        case 7:
          setErrorPG(t("electronic.phone error"));
          break;
        case 9:
          setErrorPG(t("electronic.email error"));
          break;
        default:
          setErrorPG(error.response.data.message);
          break;
      }

      // Xử lý lỗi tại đây nếu cần
    }
  };

  const perFormProcess = async (otp) => {
    setErrorPG(null);
    const data = {
      lang: lang,
      otp: otp,
      subject_id: personalInfomation.subject_id,
      process_id: processId,
    };
    try {
      setIsFetching(true);
      const response = await electronicService.perFormProcess(data);
      setIsFetching(false);
      if (response.data.status === 0) {
        setJwt(response.data.jwt);
        try {
          var decoded = jwtDecode(response.data.jwt);

          if (activeStep === 8) {
            if (decoded.email === "") {
              setActiveStep(9);
            } else {
              emailRef.current = decoded.email;
              setActiveStep(11);
            }
          } else {
            setActiveStep(11);
          }
        } catch (error) {
          console.error("Lỗi khi giải mã JWT:", error);
        }
      } else {
        setErrorPG(response.data.message);
        setIsFetching(false);
      }
    } catch (error) {
      setIsFetching(false);
      console.log("error: ", error);
      // setErrorPG(t("electronic.step136"));
      setErrorPG(error.response.data.message);
    }
  };

  const processOTPResend = async () => {
    setErrorPG(null);
    const data = {
      lang: lang,
      jwt: jwt,
      subject_id: personalInfomation.subject_id,
      process_id: processId,
    };
    try {
      const response = await electronicService.processOTPResend(data);
      if (response.data.status === 0) {
        switch (activeStep) {
          case 8:
            setActiveStep(9);
            break;
          case 10:
            setActiveStep(11);
            break;
        }
        // handleNext();
      } else {
        setErrorPG(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const checkCertificate = async () => {
    setIsFetching(true);
    const data = {
      lang: lang,
      jwt: jwt,
      connectorName: connectorName,
      connectorNameRSSP: providerSelected.current,
      enterpriseId: workFlow.enterpriseId,
      workFlowId: workFlow.workFlowId,
    };
    try {
      const response = await electronicService.checkCertificate(data);
      const newList = filterCertificates(signer, response.data);
      // let newList = [];
      // if (
      //   signer.metaInformation?.certificate_sn ||
      //   signer.metaInformation?.base64_certificate
      // ) {
      //   newList = response.data.filter(
      //     (item) =>
      //       item.serialNumber.toLowerCase() ===
      //         signer.metaInformation.certificate_sn.toLowerCase() ||
      //       item.cert ===
      //         removeBeginEndCertificate(
      //           signer.metaInformation?.base64_certificate
      //         )
      //   );
      // } else {
      //   newList = response.data;
      // }
      setCertificateList(newList);

      setIsFetching(false);
      // setCertificateList(response.data);
      // checkType.mutate(response.data, {
      //   onSuccess: (data2) => {
      //     setActiveStep(12);
      //   },
      // });
      setActiveStep(12);
    } catch (error) {
      setIsFetching(false);
      console.log("error", error);
      setErrorPG(error.response.data.message);
    }
  };

  const createCertificate = async () => {
    setIsFetching(true);
    const data = {
      lang: lang,
      jwt: jwt,
      connectorName: connectorName,
      connectorNameRSSP: providerSelected.current,
      enterpriseId: workFlow.enterpriseId,
      workFlowId: workFlow.workFlowId,
      assurance: assurance,
      taxCode: taxCode,
      authMode: "EXPLICIT/JWT", // xem lại
    };
    try {
      const response = await electronicService.createCertificate(data);

      // setCertificate(response.data);
      setDataSigning({
        ...workFlow,
        jwt: jwt,
        connectorName: "MOBILE_ID_IDENTITY",
        email: emailRef.current,
        phoneNumber: phoneNumber,
        certChain: response.data,
        assurance: assurance,
      });
      setFaceSuccess(t("electronic.createCertSuccess"));
      setTimeout(() => {
        setIsFetching(false);
        onClose();
        handleShowModalSignImage();
        setFaceSuccess(null);
      }, 3000);
    } catch (error) {
      setIsFetching(false);
      setErrorPG(t("electronic.createCertFaild"));
      console.log("error", error);
      setErrorPG(error.response.data.message);
    }
  };

  const getInformation = async () => {
    setIsFetching(true);

    const data = {
      lang: lang,
      code: workFlow.code,
      // code: "048080000061",
    };

    try {
      const response = await electronicService.getInformation(data);
      setIsFetching(false);
      setTaxInformation(response.data);
      setActiveStep(14);
    } catch (error) {
      setIsFetching(false);
      console.log("error", error);
      setErrorPG(error.response.data.message);
    }
  };

  let phoneWithoutDialCode;
  const handleSubmitClick = () => {
    setErrorPG(null);
    switch (activeStep) {
      case 1:
        if (isIdentifyRegistered) {
          setActiveStep(4);
        } else {
          setActiveStep(2);
        }
        break;
      case 3:
        connectToWS();
        break;
      case 6:
        setShouldDetectFaces(true);
        setErrorPG(null);
        break;
      case 7:
        phoneWithoutDialCode = phoneNumber.slice(dialCode.current.length);
        if (phoneWithoutDialCode.match(/^0+/)) {
          phoneWithoutDialCode = phoneWithoutDialCode.replace(/^0+/, "");
          setPhoneNumber(dialCode.current + phoneWithoutDialCode);
          break;
        }
        updateSubject();
        break;
      case 8:
        perFormProcess(otp);
        break;
      case 9:
        if (isValidEmail(emailRef.current)) {
          updateSubject();
        } else {
          setErrorPG(t("electronic.email invalid"));
        }
        break;
      case 10:
        perFormProcess(otp);
        break;
      case 11:
        checkCertificate();
        break;
      case 12:
        if (certificateList.length > 0) {
          switch (assurance) {
            case "ESEAL":
              setNewListCert(
                certificateList.filter(
                  (item) => item.seal === true && item.qes === false
                )
              );
              break;
            case "QSEAL":
              setNewListCert(
                certificateList.filter(
                  (item) => item.seal === true && item.qes === true
                )
              );
              break;
            case "NORMAL":
              setNewListCert(
                certificateList.filter(
                  (item) => item.seal === false && item.qes === false
                )
              );
              break;
            case "QES":
              setNewListCert(
                certificateList.filter(
                  (item) => item.seal === false && item.qes === true
                )
              );
              break;
          }
          if (dataSigning.provider === "ISS" || newListCert.length > 0) {
            setActiveStep(13);
          } else {
            switch (assurance) {
              case "ESEAL":
              case "QSEAL":
                getInformation();
                break;
              case "NORMAL":
              case "QES":
                createCertificate();
                break;
            }
          }
        } else {
          if (dataSigning.provider === "ELECTRONIC_ID") {
            switch (assurance) {
              case "ESEAL":
              case "QSEAL":
                getInformation();
                break;
              case "NORMAL":
              case "QES":
                createCertificate();
                break;
            }
          } else {
            setActiveStep(13);
          }
        }
        // switch (assurance) {
        //   case "NORMAL":
        //     if (
        //       certificateList.length > 0 &&
        //       certificateList.filter((item) => item.seal === false).length > 0
        //     ) {
        //       setNewListCert(
        //         certificateList.filter((item) => item.seal === false)
        //       );
        //       setActiveStep(13);
        //     } else {
        //       createCertificate();
        //     }
        //     break;
        //   case "ESEAL":
        //     if (
        //       certificateList.length > 0 &&
        //       certificateList.filter((item) => item.seal === true).length > 0
        //     ) {
        //       setNewListCert(
        //         certificateList.filter((item) => item.seal === true)
        //       );
        //       setActiveStep(13);
        //     } else {
        //       getInformation();
        //       // setActiveStep(14);
        //     }
        //     break;
        // }
        break;
      case 13:
        if (certSelected !== null) {
          setDataSigning({
            ...workFlow,
            jwt: jwt,
            connectorName: "MOBILE_ID_IDENTITY",
            // email: emailRef.current || newListCert[certSelected].email,
            email:
              dataSigning.provider === "ISS"
                ? newListCert[certSelected].email
                : emailRef.current,
            // phoneNumber: phoneNumber || newListCert[certSelected].phoneNumber,
            phoneNumber:
              dataSigning.provider === "ISS"
                ? newListCert[certSelected].phoneNumber
                : phoneNumber,
            assurance: assurance,
            certChain: newListCert[certSelected],
          });
          onClose();
          handleShowModalSignImage();
        } else {
          switch (assurance) {
            case "NORMAL":
              createCertificate();
              break;
            case "ESEAL":
              getInformation();
              // setActiveStep(14);
              break;
          }
          // getInformation();
          // setActiveStep(14);
        }
        break;
      case 14:
        setDataSigning({
          ...workFlow,
          jwt: jwt,
          connectorName: "MOBILE_ID_IDENTITY",
        });
        // setActiveStep(15);
        createCertificate();
        break;
      // case 15:
      //   createCertificate();
      //   break;
      default:
        handleNext();
    }
  };

  const steps = [
    <Step1 key="step1" isIdentifyRegistered={isIdentifyRegistered} />,
    <Step2 key="step2" onDisableSubmit={handleDisableSubmit} />,
    <Step3 key="step3" />,
    <Step4 key="step4" image={image} personalInfomation={personalInfomation} />,
    <Step5 key="step5" />,
    <Step6
      key="step6"
      setImageFace={setImageFace}
      shouldDetectFaces={shouldDetectFaces}
      setShouldDetectFaces={setShouldDetectFaces}
      setIsFetching={setIsFetching}
      setErrorPG={setErrorPG}
      direction={direction}
      setDirection={setDirection}
    />,
    <Step7
      key={"step7"}
      onDisableSubmit={handleDisableSubmit}
      phoneNumber={phoneNumber}
      setPhoneNumber={setPhoneNumber}
      dialCode={dialCode}
      handleSubmit={handleSubmitClick}
      isSubmitDisabled={isSubmitDisabled}
      setErrorPG={setErrorPG}
    />,
    <Step8
      key={"step8"}
      setOtp={setOtp}
      onDisableSubmit={handleDisableSubmit}
      processOTPResend={processOTPResend}
      setErrorPG={setErrorPG}
      perFormProcess={perFormProcess}
    />,
    <Step9
      key={"step9"}
      onDisableSubmit={handleDisableSubmit}
      emailRef={emailRef}
      setErrorPG={setErrorPG}
      handleSubmit={handleSubmitClick}
      isSubmitDisabled={isSubmitDisabled}
    />,
    <Step10
      key={"step10"}
      isFetching={isFetching}
      setOtp={setOtp}
      onDisableSubmit={handleDisableSubmit}
      processOTPResend={processOTPResend}
      handleCloseModal1={onClose}
      setErrorPG={setErrorPG}
      perFormProcess={perFormProcess}
    />,
    <Step11
      key={"step11"}
      onDisableSubmit={handleDisableSubmit}
      providerSelected={providerSelected}
      isFetching={isFetching}
      connectorList={connectorList?.data.SMART_ID_SIGNING}
      setErrorPG={setErrorPG}
    />,
    // <Step12
    //   key={"step12"}
    //   assurance={assurance}
    //   setAssurance={setAssurance}
    //   onDisableSubmit={handleDisableSubmit}
    // />,
    <AssuranceStep
      key={"step12"}
      assurance={assurance}
      setAssurance={setAssurance}
      onDisableSubmit={handleDisableSubmit}
      signer={signer}
    />,
    <Step13
      key={"step13"}
      data={newListCert}
      certSelected={certSelected}
      setCertSelected={setCertSelected}
      assurance={assurance}
      onDisableSubmit={handleDisableSubmit}
      // provider="ELECTRONIC_ID"
      provider={dataSigning?.provider}
    />,
    <Step14
      key={"step14"}
      onDisableSubmit={handleDisableSubmit}
      handleSubmit={handleSubmitClick}
      isSubmitDisabled={isSubmitDisabled}
      taxInformation={taxInformation?.document_data?.tax_informations}
      workFlow={workFlow}
      setActiveStep={setActiveStep}
      taxCode={taxCode}
      setTaxCode={setTaxCode}
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
          {workFlow.provider === "ISS"
            ? "Internal Signing Service"
            : t("electronic.title")}
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
            {activeStep === steps.length + 1 ? (
              <Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </Fragment>
            ) : (activeStep && workFlow.provider === "ISS") ||
              (subject && Object.keys(subject).length !== 0) ? (
              <Stack
                justifyContent="space-between"
                sx={{
                  height: "100%",
                }}
              >
                {/* Nội dung ở đây */}
                <Box flexGrow={1}>{steps[activeStep - 1]}</Box>
                {/* Hết nội dung */}
                {!faceSuccess && errorPG && (
                  <Alert severity="error" sx={{ mt: "10px" }}>
                    {errorPG}
                  </Alert>
                )}
                {faceSuccess && <Alert severity="success">{faceSuccess}</Alert>}
              </Stack>
            ) : null}

            {/* {unavail && <Alert severity="error">{unavail}</Alert>} */}
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
          onClick={
            activeStep === 2 ||
            activeStep === 3 ||
            activeStep === 13 ||
            activeStep === 14
              ? handleBack
              : onClose
          }
        >
          {activeStep === 2 ||
          activeStep === 3 ||
          activeStep === 13 ||
          activeStep === 14
            ? t("0-common.back")
            : t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={
            isFetching ||
            ((activeStep === 2 ||
              activeStep === 7 ||
              activeStep === 8 ||
              activeStep === 9 ||
              activeStep === 10 ||
              activeStep === 11 ||
              activeStep === 12 ||
              activeStep === 13 ||
              activeStep === 14 ||
              activeStep === 15) &&
              isSubmitDisabled)
          }
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
            : activeStep === steps.length
            ? t("0-common.submit")
            : t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalEid.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  workFlow: PropTypes.object,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
  handleShowModalSignImage: PropTypes.func,
  signer: PropTypes.object,
};

export default ModalEid;
