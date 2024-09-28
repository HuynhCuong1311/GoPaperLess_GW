import { usePending } from "@/hook";
import { usePerFormProcess } from "@/hook/use-electronicService";
import { getLang } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
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

export const OTPConfirm = ({
  state,
  dispatch,
  processOTPResend,
  title,
  handleStepProcessPerForm,
}) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(100);
  const [isFirst, setIsFirst] = useState(true);

  const lang = getLang();

  const isPending = usePending();

  const perFormProcess = usePerFormProcess();
  //   const [otp1, setOtp1] = useState("");

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
      dispatch({ type: "SET_IS_ERROR", payload: t("electronic.timeout") });
    }
  }, [progress, dispatch, t]);

  const handleInput = (value) => {
    // dispatch({ type: "CLEAR_IS_ERROR" });
    // dispatch({ type: "SET_OTP", payload: value });
    if (value.length === 6) {
      dispatch({ type: "SET_DISABLED", payload: false });
      if (isFirst) {
        setIsFirst(false);
        perFormProcess.mutate(
          {
            lang: lang,
            otp: value,
            subject_id: state.identitySubjectId,
            process_id: state.processId,
          },
          {
            onSuccess: (data) => {
              console.log("data: ", data);
              dispatch({
                type: "SET_JWT",
                payload: data.jwt,
              });
              dispatch({ type: "SET_OTP", payload: null });
              setIsFirst(true);
              handleStepProcessPerForm();
            },
            onError: (error) => {
              console.log("perFormProcess error: ", error);
              dispatch({
                type: "SET_IS_ERROR",
                payload: error.response.data.message,
              });
            },
          }
        );
      }
    } else {
      dispatch({ type: "SET_DISABLED", payload: true });
    }
  };

  const handlePaste = (event) => {
    const data = event.clipboardData.getData("text");
    dispatch({ type: "CLEAR_IS_ERROR" });
    if (data.includes("-")) {
      // Loại bỏ ký tự "-" và trả về kết quả
      const formattedData = data.replace(/-/g, "");
      dispatch({ type: "SET_OTP", payload: formattedData });
      handleInput(formattedData);
    } else {
      dispatch({ type: "SET_OTP", payload: data });
    }
  };

  const handleOnChange = (res) => {
    // setErrorPG(null);
    dispatch({ type: "CLEAR_IS_ERROR" });
    dispatch({ type: "SET_OTP", payload: res });
    handleInput(res);
  };

  const [enResend, setEnResend] = useState(true);

  const handleResend = () => {
    if (enResend) {
      setProgress(100);
      dispatch({ type: "CLEAR_IS_ERROR" });
      setIsFirst(true);
      // AuthInputRef.current?.clear();
      dispatch({ type: "SET_OTP", payload: null });
      // processOTPResend();
      processOTPResend.mutate(
        {
          lang: lang,
          jwt: state.data.jwt,
          subject_id: state.data.identitySubjectId,
          process_id: state.data.processId,
        },
        {
          onSuccess: (data) => {
            console.log("data: ", data);
          },
          onError: (error) => {
            console.log("processOTPResend error: ", error);
            dispatch({
              type: "SET_IS_ERROR",
              payload: error.response.data.message,
            });
          },
        }
      );
      setEnResend(false);
      setTimeout(() => {
        setEnResend(true);
      }, 180000);
    }
  };

  // const getTitles = () => {
  //   switch (state.activeStep) {
  //     case 12:
  //       return {
  //         title: t("electronic.step81"),
  //         subtitle: t("electronic.step81"),
  //       };

  //     case 14:
  //       return {
  //         title: t("electronic.step101"),
  //         subtitle: t("electronic.step101"),
  //       };

  //     default:
  //       return {
  //         title: "",
  //         subtitle: "",
  //       };
  //   }
  // };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main" }}
        mb={"10px"}
      >
        {/* Enter The Code That Was Sent To Your Phone */}
        {title.title}
      </Typography>
      <Typography
        fontSize="15px"
        mb={"10px"}
        textAlign="center"
        color="signingtextBlue.main"
        height="17px"
      >
        {/* Enter The Code That Was Sent To Your Phone */}
        {title.subtitle}
      </Typography>

      <OtpInput
        value={state.otp}
        onChange={handleOnChange}
        numInputs={6}
        //   renderSeparator={<span>-</span>}
        renderInput={(props) => <input disabled={isPending} {...props} />}
        inputStyle="inputStyle"
        containerStyle="containerStyle"
        inputType="tel"
        shouldAutoFocus={true}
        onPaste={handlePaste}
      />
      <Box textAlign="center" mt="20px">
        <CircularProgressWithLabel size={150} value={progress} />
      </Box>
      <Typography variant="h6" height={"32px"} textAlign="center" mt="18px">
        {/* Verification process might take up to 5 minitues. */}
        {t("electronic.step84")}
      </Typography>
      <Box
        textAlign="center"
        marginTop="15px"
        // onClick={processOTPResend}
        // className="buttontet"
        disabled={!enResend}
        height={"18px"}
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
          {t("electronic.step85")}
        </Typography>
      </Box>
    </Box>
  );
};

OTPConfirm.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
  processOTPResend: PropTypes.object,
  title: PropTypes.object,
  handleStepProcessPerForm: PropTypes.func,
};

export default OTPConfirm;
