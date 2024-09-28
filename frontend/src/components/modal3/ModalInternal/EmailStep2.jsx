import {
  useAuthorizeOTP,
  useCredentialOTP,
} from "@/hook/use-electronicService";
import {
  convertProviderToSignOption,
  maskedEmail,
} from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";

function CircularProgressWithLabel(props) {
  const formatTime = (seconds) => {
    const totalTime = 300;
    const minutes = Math.floor(((seconds / 100) * totalTime) / 60);
    const remainingSeconds = Math.floor(((seconds / 100) * totalTime) % 60);

    const formattedTime = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;

    return formattedTime;
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

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export const EmailStep2 = ({
  otp,
  setOtp,
  email = "",
  onDisableSubmit,
  requestID,
  setRequestID,
  dataSigning,
  setErrorPG,
  isPending,
  onClose,
}) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(100);
  const credentialOTP = useCredentialOTP();
  const authorizeOTP = useAuthorizeOTP();
  const [isFirst, setIsFirst] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (progress > 0.5) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => prevProgress - 1 / 3);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [progress]);

  useEffect(() => {
    if (progress <= 0.5) {
      setProgress(0);
      setErrorPG(t("electronic.timeout"));
      onDisableSubmit(true);
    }
  }, [progress]);

  const handlePaste = (event) => {
    const data = event.clipboardData.getData("text");

    if (data.includes("-")) {
      // Loại bỏ ký tự "-" và trả về kết quả
      const formattedData = data.replace(/-/g, "");
      setOtp(formattedData);
      // handleInput(formattedData);
      if (formattedData.length === 6) {
        //   setOtp(formattedData);
        onDisableSubmit(false);
        if (isFirst) {
          setIsFirst(false);
          // authorizeOTP(formattedData);
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
              otp: formattedData,
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
        }
      } else {
        onDisableSubmit(true);
      }
    } else {
      setOtp(data);
    }
  };
  const handleOnChange = (res) => {
    setErrorPG(null);
    // setOtp1(res);
    // console.log("res: ", res.length);
    setOtp(res);
    if (res.length === 6) {
      onDisableSubmit(false);
      if (isFirst) {
        setIsFirst(false);
        // authorizeOTP(res);
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
            otp: res,
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
            onError: (error) => {
              // setOtp("");
              // onDisableSubmit(true);
              setErrorPG(error.response.data.message);
            },
          }
        );
      }
    } else {
      onDisableSubmit(true);
    }
  };
  useEffect(() => {
    onDisableSubmit(true);
  }, []);

  const [enResend, setEnResend] = useState(true);

  const handleResend = () => {
    if (enResend) {
      setProgress(100);
      setErrorPG(null);
      setIsFirst(true);
      setOtp("");
      onDisableSubmit(true);
      //   resendCredentialOTP();
      credentialOTP.mutate(
        {
          lang: dataSigning.language,
          credentialID: dataSigning.certSelected.credentialID,
        },
        {
          onSuccess: (data) => {
            setRequestID(data);
          },
          onError: (error) => {
            setErrorPG(error.response.data.message);
          },
        }
      );
      setEnResend(false);
      setTimeout(() => {
        setEnResend(true);
      }, 180000);
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const inputStyle = {
    width: "43px",
    height: "43px",
    borderRadius: "7px",
    marginLeft: "8px",
    marginRight: "8px",
    /* background: #dddddd; */
    fontSize: "20px",
    border: "1px solid #3b82f6",
    disabled: true,
  };

  return (
    <Stack height="100%">
      <Typography variant="h6" sx={{ fontWeight: 600, color: "textBold.main" }}>
        {/* Enter the code that was sent to your phone */}
        {t("electronic.step101")}
      </Typography>

      <Typography variant="h6">
        {/* A verification code has been sent to your phone: {maskedPhoneNumber()} */}
        {t("electronic.step106")}
        <span style={{ fontWeight: "bold" }}>{maskedEmail(email)}</span>
      </Typography>

      <Typography fontSize="14px" color="#1976D2" my="10px" textAlign="center">
        {/* Enter The Code That Was Sent To Your Phone */}
        {t("electronic.step103")}
      </Typography>
      <OtpInput
        value={otp}
        onChange={handleOnChange}
        numInputs={6}
        renderInput={(props) => <input disabled={isPending} {...props} />}
        // inputStyle="inputStyle"
        // containerStyle="containerStyle"
        inputStyle={inputStyle}
        containerStyle={containerStyle}
        inputType="tel"
        shouldAutoFocus={true}
        onPaste={handlePaste}
      />
      <Box textAlign="center" my="10px">
        <CircularProgressWithLabel size={150} value={progress} />
      </Box>
      <Typography fontSize="14px" textAlign="center" mb="10px">
        {/* Verification process might take up to 5 minitues. */}
        {t("electronic.step107")}
      </Typography>
      <Box
        flexGrow={1}
        textAlign="center"
        // marginTop="15px"

        // onClick={handleResend}
        // className="buttontet"
        disabled={!enResend}
      >
        {/* Resend OTP */}
        <Typography
          className="hover-underline-animation"
          variant="h6"
          sx={{
            cursor: enResend ? "pointer" : "not-allowed",
            color: enResend ? "#1976D2" : "#26293f",
            // textDecoration: "underline",
          }}
          onClick={handleResend}
        >
          {t("electronic.step145")}
        </Typography>
      </Box>
    </Stack>
  );
};

EmailStep2.propTypes = {
  otp: PropTypes.string,
  setOtp: PropTypes.func,
  email: PropTypes.string,
  onDisableSubmit: PropTypes.func,
  requestID: PropTypes.string,
  setRequestID: PropTypes.func,
  setErrorPG: PropTypes.func,
  isPending: PropTypes.bool,
  errorPG: PropTypes.string,
  dataSigning: PropTypes.object,
  onClose: PropTypes.func,
};

export default EmailStep2;
