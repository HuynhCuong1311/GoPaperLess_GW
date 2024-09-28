import DrawIcon from "@mui/icons-material/Draw";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import UploadIcon from "@mui/icons-material/Upload";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

export const ConfigSignature = ({ state, dispatch }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    switch (state.data.signatureOptions.signatureType) {
      case "text":
        setValue(0);
        break;
      case "draw":
        setValue(1);
        break;
      case "upload":
        setValue(2);
        break;
      default:
        return 0;
    }
  }, [state.data.signatureOptions.signatureType]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
  return (
    <>
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <AppBar position="static" elevation={0}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "#E5E7EB",
              backgroundColor: "dialogBackground.main",
            }}
          >
            <Tabs
              value={value}
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
          <TabPanel value={value} index={0}>
            <Suspense fallback={<div>Loading...</div>}>
              <TextSignField state={state} dispatch={dispatch} />
            </Suspense>
            {/* abc */}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Suspense fallback={<div>Loading...</div>}>
              <DrawSignField state={state} dispatch={dispatch} />
            </Suspense>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Suspense fallback={<div>Loading...</div>}>
              <UploadSignField state={state} dispatch={dispatch} />
            </Suspense>
          </TabPanel>
        </AppBar>
      </Box>
      <Suspense fallback={<div>Loading...</div>}>
        <SignatureOptions state={state} dispatch={dispatch} />
      </Suspense>
    </>
  );
};

ConfigSignature.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
};

export default ConfigSignature;
