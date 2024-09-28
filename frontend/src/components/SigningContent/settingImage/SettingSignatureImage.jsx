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
import DrawIcon from "@mui/icons-material/Draw";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import UploadIcon from "@mui/icons-material/Upload";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

const TextSignField = lazy(() =>
  import("@/components/configuration/components/TextSignField")
);

const SignatureOptions = lazy(() =>
  import("@/components/configuration/components/SignatureOptions")
);

const DrawSignField = lazy(() =>
  import("@/components/configuration/components/DrawSignField")
);

const UploadSignField = lazy(() =>
  import("@/components/configuration/components/UploadSignField")
);

const PreviewAndSign = lazy(() =>
  import("@/components/SigningContent/settingImage/PreviewAndSign")
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: "10px 0",
            backgroundColor: "dialogBackground.main",
            color: "black",
          }}
        >
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

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
        value: 0,
        isShowReview: false,
        isDisabled: true,
      };
    case "SET_VALUE":
      return {
        ...state,
        value: action.payload,
      };
    case "SET_IS_SHOW_REVIEW":
      return {
        ...state,
        isShowReview: action.payload,
      };
    case "SET_DATA":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
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

const SettingSignatureImage = ({
  open,
  onClose,
  initData,
  handleSubmitModel,
}) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: defaultValue,
    value: 0,
    isShowReview: false,
    isDisabled: true,
  });
  // console.log("initData: ", initData);
  // console.log("SettingSignatureImage: ", state);

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
    }
  }, [initData, address, initData.certSelected, open]);

  const handleChange = (event, newValue) => {
    // setValue(newValue);
    dispatch({ type: "SET_VALUE", payload: newValue });
    let payloadValue;

    switch (newValue) {
      case 0:
        payloadValue = "text";
        break;
      case 1:
        payloadValue = "draw";
        break;
      case 2:
        payloadValue = "upload";
        break;
      default:
        payloadValue = "text";
    }
    dispatch({ type: "SET_SIGNATURE_TYPE", payload: payloadValue });
  };

  const handleSubmitClick = () => {
    dispatch({ type: "SET_IS_SHOW_REVIEW", payload: true });
  };

  const handleClose = () => {
    dispatch({ type: "SET_DEFAULT" });
    onClose();
  };
  //   {t("signing.sign_document")}
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
          <Stack
            sx={{
              mt: 0,
              mb: 1,
              height: "100%",
              width: "100%",
              bgcolor: "dialogBackground.main",
            }}
          >
            <AppBar position="static" elevation={0}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "#E5E7EB",
                  backgroundColor: "dialogBackground.main",
                }}
              >
                <Tabs
                  value={state.value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  TabScrollButtonProps={{
                    sx: {
                      color: "signingtextBlue.main",
                    },
                  }}
                  // textColor="inherit"
                  // variant="fullWidth"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                  sx={{
                    // height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    backgroundColor: "dialogBackground.main",
                  }}
                >
                  <Tab
                    icon={
                      <KeyboardIcon
                        fontSize="small"
                        sx={{
                          color: "signingtextBlue.main",
                        }}
                      />
                    }
                    iconPosition="start"
                    label={t("0-common.text")}
                    {...a11yProps(0)}
                    sx={{
                      // height: "45px",
                      minHeight: "45px", //set height for tabs and tab
                      textTransform: "none",
                      color: "signingtext1.main",
                    }} //set height for tabs and tab
                  />
                  <Tab
                    icon={
                      <DrawIcon
                        fontSize="small"
                        sx={{
                          color: "signingtextBlue.main",
                        }}
                      />
                    }
                    iconPosition="start"
                    label={t("0-common.draw")}
                    {...a11yProps(1)}
                    sx={{
                      // height: "45px",
                      minHeight: "45px", //set height for tabs and tab
                      textTransform: "none",
                      color: "signingtext1.main",
                    }} //set height for tabs and tab
                  />
                  <Tab
                    icon={
                      <UploadIcon
                        fontSize="small"
                        sx={{
                          color: "signingtextBlue.main",
                        }}
                      />
                    }
                    iconPosition="start"
                    label={t("0-common.upload")}
                    {...a11yProps(2)}
                    sx={{
                      // height: "45px",
                      minHeight: "45px", //set height for tabs and tab
                      textTransform: "none",
                      color: "signingtext1.main",
                    }} //set height for tabs and tab
                  />
                </Tabs>
              </Box>
              <TabPanel value={state.value} index={0}>
                <Suspense fallback={<div>Loading...</div>}>
                  <TextSignField state={state} dispatch={dispatch} />
                </Suspense>
                {/* abc */}
              </TabPanel>
              <TabPanel value={state.value} index={1}>
                <Suspense fallback={<div>Loading...</div>}>
                  <DrawSignField state={state} dispatch={dispatch} />
                </Suspense>
              </TabPanel>
              <TabPanel value={state.value} index={2}>
                <Suspense fallback={<div>Loading...</div>}>
                  <UploadSignField state={state} dispatch={dispatch} />
                </Suspense>
              </TabPanel>
            </AppBar>
            <Suspense fallback={<div>Loading...</div>}>
              <SignatureOptions state={state} dispatch={dispatch} />
            </Suspense>
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleClose}
        >
          {t("0-common.cancel")}
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
          {t("0-common.preview&continue")}
        </Button>
      </DialogActions>
      <Suspense fallback={<div>Loading...</div>}>
        <PreviewAndSign
          state={state}
          dispatch={dispatch}
          open={state.isShowReview}
          onClose={() => {
            dispatch({ type: "SET_IS_SHOW_REVIEW", payload: false });
          }}
          handleSubmitModel={(data) => {
            handleSubmitModel(data);
            dispatch({ type: "SET_DEFAULT" });
          }}
        />
      </Suspense>
    </Dialog>
  );
};

SettingSignatureImage.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  initData: PropTypes.object,
  handleSubmitModel: PropTypes.func,
};

export default SettingSignatureImage;
