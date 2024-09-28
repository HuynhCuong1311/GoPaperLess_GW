import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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

export const Step2 = ({
  setOtp,
  phoneNumber = "",
  onDisableSubmit,
  resendCredentialOTP,
  setErrorPG,
  errorPG,
  authorizeOTP,
  isFetching,
}) => {
  const { t } = useTranslation();

  const maskedPhoneNumber = () => {
    const hiddenPart = phoneNumber
      .substring(phoneNumber.length - 7, phoneNumber.length - 2)
      .replace(/\d/g, "*");
    return (
      "+" +
      phoneNumber.slice(0, phoneNumber.length - 7) +
      hiddenPart +
      phoneNumber.slice(-2)
    );
  };
  const [progress, setProgress] = useState(100);
  const [isFirst, setIsFirst] = useState(true);
  const [otp1, setOtp1] = useState("");

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
    }
  }, [progress]);

  const handlePaste = (event) => {
    const data = event.clipboardData.getData("text");

    const formattedData = data.replace(/-/g, "");

    setOtp1(formattedData);
    // if (formattedData.length === 6) {
    //   setOtp(formattedData);
    //   onDisableSubmit(false);
    //   if (isFirst) {
    //     setIsFirst(false);
    //     authorizeOTP(formattedData);
    //   }
    // } else {
    //   onDisableSubmit(true);
    // }
  };
  const handleOnChange = (res) => {
    setErrorPG(null);
    setOtp1(res);
    // console.log("res: ", res.length);
    if (res.length === 6) {
      setOtp(res);
      onDisableSubmit(false);
      if (isFirst) {
        setIsFirst(false);
        authorizeOTP(res);
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
      setOtp1("");
      resendCredentialOTP();
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
        {t("electronic.step143")}
      </Typography>

      <Typography variant="h6">
        {/* A verification code has been sent to your phone: {maskedPhoneNumber()} */}
        {t("electronic.step144")}{" "}
        <span style={{ fontWeight: "bold" }}>{maskedPhoneNumber()}</span>
      </Typography>

      <Typography fontSize="14px" color="#1976D2" my="10px" textAlign="center">
        {/* Enter The Code That Was Sent To Your Phone */}
        {t("electronic.step143")}
      </Typography>
      <OtpInput
        value={otp1}
        onChange={handleOnChange}
        numInputs={6}
        renderInput={(props) => <input disabled={isFetching} {...props} />}
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
        {t("electronic.step144")}
      </Typography>
      <Box
        flexGrow={1}
        textAlign="center"
        // marginTop="15px"

        onClick={handleResend}
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
        >
          {t("electronic.step145")}
        </Typography>
      </Box>
      {errorPG && (
        <Box width={"100%"}>
          <Alert severity="error">{errorPG}</Alert>
        </Box>
      )}
    </Stack>
  );
};

Step2.propTypes = {
  setOtp: PropTypes.func,
  phoneNumber: PropTypes.string,
  onDisableSubmit: PropTypes.func,
  resendCredentialOTP: PropTypes.func,
  handleCloseModal1: PropTypes.func,
  setErrorPG: PropTypes.func,
  authorizeOTP: PropTypes.func,
  isFetching: PropTypes.bool,
  errorPG: PropTypes.string,
};

export default Step2;
