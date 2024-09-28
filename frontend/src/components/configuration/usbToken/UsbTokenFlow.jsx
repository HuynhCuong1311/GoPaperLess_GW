import { assurance as assuranceList } from "@/utils/Constant";
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
import PropTypes from "prop-types";
import { lazy, Suspense, useEffect, useMemo, useReducer } from "react";
import { useTranslation } from "react-i18next";

const SelectAssurance = lazy(() =>
  import("@/components/configuration/components/SelectAssurance")
);

const SelectCertificate = lazy(() =>
  import("@/components/configuration/components/SelectCertificate")
);

const defaultValue = {
  assurance: "",
  certSelected: null,
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "SET_DEFAULT":
      return {
        data: defaultValue,
        activeStep: 1,
        certList: [],
        filterCertList: [],
        isLoading: false,
        isError: false,
        isPGError: "",
        isDisabled: true,
        errorMessage: "",
      };

    case "SET_DATA":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case "SET_ACTIVE_STEP":
      return {
        ...state,
        activeStep: action.payload,
      };
    case "SET_ASSURANCE":
      return {
        ...state,
        data: { ...state.data, assurance: action.payload },
      };
    case "SET_CERT_SELECTED":
      return {
        ...state,
        data: { ...state.data, certSelected: action.payload },
      };
    case "SET_CERT_LIST":
      return {
        ...state,
        certList: action.payload,
      };
    case "SET_FILTER_CERT_LIST":
      return {
        ...state,
        filterCertList: action.payload,
      };
    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_IS_ERROR":
      return {
        ...state,
        isError: true,
        errorMessage: action.payload,
      };
    case "CLEAR_IS_ERROR":
      return {
        ...state,
        isError: false,
        errorMessage: "",
      };
    case "SET_DISABLED":
      return {
        ...state,
        isDisabled: action.payload,
      };
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
        isDisabled: false,
        errorMessage: "",
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: "",
        // data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload,
      };
    default:
      throw new Error();
  }
};

export const UsbTokenFlow = ({
  initData,
  certList,
  open,
  onClose,
  handleSubmitModel,
}) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: defaultValue,
    activeStep: 1,
    certList: [],
    filterCertList: [],
    isLoading: false,
    isError: false,
    isPGError: "",
    isDisabled: true,
    errorMessage: "",
  });
  // console.log("usbTokenFlow: ", state);

  useEffect(() => {
    if (open && certList) {
      dispatch({ type: "SET_DATA", payload: initData });
      dispatch({ type: "SET_CERT_LIST", payload: certList });
    }
  }, [initData, certList, open]);

  const handleClose = () => {
    dispatch({ type: "SET_DEFAULT" });
    onClose();
  };

  const handleBack = () => {
    dispatch({ type: "SET_ACTIVE_STEP", payload: state.activeStep - 1 });
  };

  const handleSubmitClick = () => {
    switch (state.activeStep) {
      case 1:
        {
          let newList = [];
          switch (state.data.assurance) {
            case "ESEAL":
              newList = state.certList.filter(
                (item) => item.seal === true && item.qes === false
              );
              break;
            case "QSEAL":
              newList = state.certList.filter(
                (item) => item.seal === true && item.qes === true
              );
              break;
            case "NORMAL":
              newList = state.certList.filter(
                (item) => item.seal === false && item.qes === false
              );
              break;
            case "QES":
              newList = state.certList.filter(
                (item) => item.seal === false && item.qes === true
              );
              break;
            default:
              break;
          }
          dispatch({ type: "SET_FILTER_CERT_LIST", payload: newList });
          dispatch({ type: "SET_ACTIVE_STEP", payload: 2 });
        }
        break;
      case 2:
        handleSubmitModel(state.data);
        dispatch({ type: "SET_DEFAULT" });
        break;
      default:
    }
  };

  const steps = [
    <Suspense key={1} fallback={<div>Loading...</div>}>
      <SelectAssurance
        state={state}
        dispatch={dispatch}
        assuranceList={assuranceList}
      />
    </Suspense>,
    <Suspense key={2} fallback={<div>Loading...</div>}>
      <SelectCertificate state={state} dispatch={dispatch} />
    </Suspense>,
  ];

  const title = useMemo(() => {
    switch (state.activeStep) {
      case 1:
        return t("signingForm.title5");
      case 2:
        return t("modal.title1");

      default:
        return "remote signing";
    }
  }, [state.activeStep, t]);
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
          {title}
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
            {state.isError && (
              <Alert severity="error">{state.errorMessage}</Alert>
            )}
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
          disabled={state.isDisabled || state.isLoading}
          startIcon={
            state.isLoading ? (
              <CircularProgress color="inherit" size="1em" />
            ) : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {state.isError ? t("0-common.retry") : t("0-common.continue")}
          {/* {t("0-common.continue")} */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UsbTokenFlow.propTypes = {
  initData: PropTypes.object,
  certList: PropTypes.array,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleSubmitModel: PropTypes.func,
};

export default UsbTokenFlow;
