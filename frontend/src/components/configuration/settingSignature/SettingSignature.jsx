import useCountry from "@/hook/use-country";
import { isObjectEmpty } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { lazy, Suspense, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

const defaultValue = {
  locationValue: "",
  dateValue: "",
  nameValue: "",
  logoValue: "",
  reasonValue: "signature",
  dnValue: "",
  itverValue: "itext core 8.0.2",
  contactInfor: "",
  signatureOptions: {
    name: true,
    date: false,
    logo: false,
    reason: true,
    dn: false,
    itver: false,
    location: true,
    label: true,
    alignment: "auto",
    format: 10,
    signatureType: "text",
    drawUrl: "",
    uploadUrl: "",
  },
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "SET_DEFAULT":
      return {
        data: defaultValue,
        activeStep: 1,
        isDisabled: true,
        index: null,
      };
    case "SET_ACTIVE_STEP":
      return {
        ...state,
        activeStep: action.payload,
      };
    case "SET_DATA":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case "SET_INDEX":
      return {
        ...state,
        index: action.payload,
      };
    case "SET_CONTACT_INFOR":
      return {
        ...state,
        data: { ...state.data, contactInfor: action.payload },
      };
    case "SET_LOCATION_VALUE":
      return {
        ...state,
        data: { ...state.data, locationValue: action.payload },
      };
    case "SET_DATE_VALUE":
      return {
        ...state,
        data: { ...state.data, dateValue: action.payload },
      };
    case "SET_NAME_VALUE":
      return {
        ...state,
        data: { ...state.data, nameValue: action.payload },
      };
    case "SET_REASON_VALUE":
      return {
        ...state,
        data: { ...state.data, reasonValue: action.payload },
      };
    case "SET_LOGO_VALUE":
      return {
        ...state,
        data: { ...state.data, logoValue: action.payload },
      };
    case "SET_DN_VALUE":
      return {
        ...state,
        data: { ...state.data, dnValue: action.payload },
      };
    case "SET_ITVERSION_VALUE":
      return {
        ...state,
        data: { ...state.data, itverValue: action.payload },
      };
    case "SET_NAME":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            name: action.payload,
          },
        },
      };
    case "SET_DATE":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            date: action.payload,
          },
        },
      };
    case "SET_LOGO":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            logo: action.payload,
          },
        },
      };
    case "SET_REASON":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            reason: action.payload,
          },
        },
      };
    case "SET_DN":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            dn: action.payload,
          },
        },
      };
    case "SET_ITVER":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            itver: action.payload,
          },
        },
      };
    case "SET_LOCATION":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            location: action.payload,
          },
        },
      };
    case "SET_LABEL":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            label: action.payload,
          },
        },
      };
    case "SET_ALIGNMENT":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            alignment: action.payload,
          },
        },
      };
    case "SET_FORMAT":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            format: action.payload,
          },
        },
      };
    case "SET_SIGNATURE_TYPE":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            signatureType: action.payload,
          },
        },
      };
    case "SET_DRAW_URL":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            drawUrl: action.payload,
          },
        },
      };
    case "SET_UPLOAD_URL":
      return {
        ...state,
        data: {
          ...state.data,
          signatureOptions: {
            ...state.data.signatureOptions,
            uploadUrl: action.payload,
          },
        },
      };
    case "SET_DISABLED":
      return {
        ...state,
        isDisabled: action.payload,
      };
    default:
      throw new Error();
  }
};

const ConfigSignature = lazy(() =>
  import("@/components/configuration/settingSignature/ConfigSignature")
);

const ReviewSignature = lazy(() =>
  import("@/components/configuration/settingSignature/ReviewSignature")
);

export const SettingSignature = ({
  open,
  onClose,
  initData,
  handleSubmitModel,
  // handleRemoveSignature,
  handleUpdateSignature,
}) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: defaultValue,
    activeStep: 1,
    isDisabled: true,
    index: null,
  });
  console.log("settingSignature: ", state);
  console.log("initData: ", initData);

  const { address } = useCountry();

  const formattedDateTime = () => {
    const currentDatetime = new Date();
    const options = {
      timeZone: "Asia/Bangkok", // 'UTC+7' is equivalent to 'Asia/Bangkok'
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return new Intl.DateTimeFormat("en-GB", options).format(currentDatetime);
  };
  useEffect(() => {
    if (open && !isObjectEmpty(initData)) {
      dispatch({ type: "SET_DATA", payload: initData });
      dispatch({
        type: "SET_NAME_VALUE",
        payload: initData.certSelected.subject,
      });
      dispatch({ type: "SET_LOCATION_VALUE", payload: address });
      dispatch({ type: "SET_DATE_VALUE", payload: formattedDateTime() });
      dispatch({
        type: "SET_CONTACT_INFOR",
        payload: initData.certSelected.email || "",
      });
      dispatch({
        type: "SET_DN_VALUE",
        payload: initData.certSelected.subjectDN,
      });

      dispatch({ type: "SET_INDEX", payload: initData.index });
    }
  }, [initData, address, initData.certSelected, open]);

  const handleSubmitClick = () => {
    switch (state.activeStep) {
      case 1:
        dispatch({ type: "SET_ACTIVE_STEP", payload: 2 });
        // setActiveStep(2);
        break;
      case 2:
        if (state.index) {
          dispatch({ type: "SET_DEFAULT" });
          handleUpdateSignature(state);
        } else {
          console.log("dô dây he");
          dispatch({ type: "SET_DEFAULT" });
          handleSubmitModel(state.data);
        }
        break;
      default:
        dispatch({ type: "SET_DEFAULT" });
        onClose();
    }
  };

  const handleClose = () => {
    dispatch({ type: "SET_DEFAULT" });
    onClose();
  };

  const handleBack = () => {
    dispatch({ type: "SET_ACTIVE_STEP", payload: state.activeStep - 1 });
    // setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    <Suspense key={1} fallback={<div>Loading...</div>}>
      <ConfigSignature state={state} dispatch={dispatch} />
    </Suspense>,
    <Suspense key={2} fallback={<div>Loading...</div>}>
      <ReviewSignature
        state={state}
        dispatch={dispatch}
        handleClose={handleClose}
        // handleRemoveSignature={handleRemoveSignature}
      />
    </Suspense>,
  ];

  const title = () => {
    switch (state.activeStep) {
      case 1:
        return "Your Signature";
      case 2:
        return "Review";
      default:
        return "Your Signature";
    }
  };

  return (
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
      open={!!open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        sx: {
          width: "500px",
          maxWidth: "500px", // Set your width here
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
          {title()}
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
            {/* {steps[activeStep]} */}
            <Box flexGrow={1}>{steps[state.activeStep - 1]}</Box>
            {/* {activeStep} */}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={state.activeStep === 1 ? handleClose : handleBack}
        >
          {state.activeStep === 1 ? t("0-common.cancel") : t("0-common.back")}
        </Button>
        <Button
          variant="contained"
          disabled={state.isDisabled}
          // startIcon={
          //   isPending ? <CircularProgress color="inherit" size="1em" /> : null
          // }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
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

SettingSignature.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  initData: PropTypes.object,
  addSignature: PropTypes.func,
  handleSubmitModel: PropTypes.func,
  handleRemoveSignature: PropTypes.func,
  handleUpdateSignature: PropTypes.func,
};

export default SettingSignature;
