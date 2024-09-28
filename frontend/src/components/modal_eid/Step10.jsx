import { Box, Typography } from "@mui/material";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OTPInput from "react-otp-input";

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
        size={40}
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

export const Step10 = ({
  setOtp,
  onDisableSubmit,
  processOTPResend,
  setErrorPG,
  perFormProcess,
  isFetching,
}) => {
  const { t } = useTranslation();
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

  // close
  useEffect(() => {
    if (progress <= 0.5) {
      setProgress(0);
      setErrorPG(t("electronic.timeout"));
      // handleCloseModal1();
    }
  }, [progress]);
  const handlePaste = (event) => {
    const data = event.clipboardData.getData("text");

    const formattedData = data.replace(/-/g, "");

    setOtp1(formattedData);
    if (formattedData.length === 6) {
      setOtp(formattedData);
      onDisableSubmit(false);
      if (isFirst) {
        setIsFirst(false);
        perFormProcess(formattedData);
      }
    } else {
      onDisableSubmit(true);
    }
  };

  const handleOnChange = (res) => {
    setErrorPG(null);
    setOtp1(res);
    if (res.length === 6) {
      setOtp(res);
      onDisableSubmit(false);
      if (isFirst) {
        setIsFirst(false);
        perFormProcess(res);
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
      // AuthInputRef.current?.clear();
      setOtp1("");
      processOTPResend();
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
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main" }}
        mb={"10px"}
      >
        {/* Enter your phone number to receive a verification code. */}
        {t("electronic.step101")}
      </Typography>

      <Typography
        fontSize="15px"
        mb={"15px"}
        textAlign="center"
        color="signingtextBlue.main"
        height="17px"
      >
        {/* Enter The Code That Was Sent To Your Phone */}
        {t("electronic.step103")}
      </Typography>
      <OTPInput
        value={otp1}
        onChange={handleOnChange}
        numInputs={6}
        renderInput={(props) => <input disabled={isFetching} {...props} />}
        inputStyle={inputStyle}
        containerStyle={containerStyle}
        inputType="tel"
        shouldAutoFocus={true}
        onPaste={handlePaste}
      />
      <Box textAlign="center" mt="20px">
        <CircularProgressWithLabel size={150} value={progress} />
      </Box>
      <Typography variant="h6" height={"32px"} textAlign="center" mt="18px">
        {/* Verification process might take up to 5 minitues. */}
        {t("electronic.step104")}
      </Typography>
      <Box
        textAlign="center"
        marginTop="15px"
        // onClick={processOTPResend}

        // className="buttontet"
        disabled={!enResend}
      >
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
          {t("electronic.step105")}
        </Typography>
      </Box>
    </Box>
  );
};

Step10.propTypes = {
  setOtp: PropTypes.func,
  onDisableSubmit: PropTypes.func,
  processOTPResend: PropTypes.func,
  handleCloseModal1: PropTypes.func,
  setErrorPG: PropTypes.func,
  perFormProcess: PropTypes.func,
  isFetching: PropTypes.bool,
};

export default Step10;
