import useCountry from "@/hook/use-country";
import { apiService } from "@/services/api_service";
import { removeBase64Prefix } from "@/utils/commonFunction";
import DrawIcon from "@mui/icons-material/Draw";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DrawSignForm, TextSignForm } from "../SigningContent/PdfViewer";
import UploadSignForm from "../SigningContent/PdfViewer/UploadSignForm";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`modal-tabpanel-${index}`}
      aria-labelledby={`modal-tab-${index}`}
      style={{ flexGrow: 1 }}
      {...other}
    >
      {value === index && (
        <Box width="100%">
          <Box width="100%">{children}</Box>
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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const ModalSigningImage2 = ({
  open,
  onClose,
  signer,
  dataSigning,
  setDataSigning,
  handleShowmodal,
}) => {
  const { t } = useTranslation();

  const { signing_token: signingToken } = useParams();
  const [value, setValue] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const textElement = useRef();
  const drawElement = useRef();
  const fileElement = useRef();

  const { data: headerFooter } = useQuery({
    queryKey: ["checkHeader"],
    queryFn: () => apiService.checkHeaderFooter(signingToken),
  });

  // console.log("headerFooter: ", headerFooter?.data);

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const { address } = useCountry();
  useEffect(() => {
    setDataSigning({
      ...dataSigning,
      country: signer.metaInformation?.country
        ? signer.metaInformation?.country
        : address,
      countryRealtime: address,
      signingPurpose: signer.signingPurpose
        ? signer.signingPurpose
        : "signature",
      reason: signer.customReason ? signer.customReason : "signature",
    });
  }, [address]);

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

  const formattedDatetime = new Intl.DateTimeFormat("en-GB", options).format(
    currentDatetime
  );

  const handleTextSubmit = (data) => {
    // console.log("data: ", data);
    setDataSigning({
      ...dataSigning,
      imageBase64: removeBase64Prefix(data),
    });
    onClose();
    handleShowmodal();
  };

  const handleDrawSubmit = (data) => {
    // console.log("data: ", data);
    setDataSigning({
      ...dataSigning,
      imageBase64: removeBase64Prefix(data),
    });
    onClose();
    handleShowmodal();
  };

  const handleFileSubmit = (data) => {
    // console.log("data: ", data);
    setDataSigning({
      ...dataSigning,
      imageBase64: removeBase64Prefix(data),
    });
    onClose();
    handleShowmodal();
  };

  const handleSubmitClick = () => {
    switch (value) {
      case 0:
        textElement.current.requestSubmit();
        break;
      case 1:
        drawElement.current.requestSubmit();
        break;
      case 2:
        fileElement.current.requestSubmit();
    }
  };

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
            maxWidth: "470px", // Set your width here
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
          {/* {title} */}
          {t("signing.sign_document")}
        </Typography>
        {/* {subtitle && (
          <Typography variant="h5" width={"100%"}>
            {subtitle}
          </Typography>
        )} */}
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
      <DialogContent sx={{ backgroundColor: "dialogBackground.main" }}>
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="icon position tabs example"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                minHeight: 0,
              },
              minHeight: 0,
              mb: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Tab
              icon={<KeyboardIcon fontSize="small" />}
              iconPosition="start"
              label={t("0-common.text")}
              sx={{
                textTransform: "capitalize",
              }}
              {...a11yProps(0)}
            />
            <Tab
              icon={<DrawIcon fontSize="small" />}
              iconPosition="start"
              label={t("0-common.draw")}
              sx={{
                textTransform: "capitalize",
              }}
              {...a11yProps(1)}
            />
            <Tab
              icon={<UploadIcon fontSize="small" />}
              iconPosition="start"
              label={t("0-common.upload")}
              sx={{
                textTransform: "capitalize",
              }}
              {...a11yProps(2)}
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <TextSignForm
              ref={textElement}
              onTextSubmit={handleTextSubmit}
              signer={signer}
              dataSigning={dataSigning}
              headerFooter={headerFooter?.data}
              formattedDatetime={formattedDatetime}
              onDisableSubmit={handleDisableSubmit}
            />
            {/* text */}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DrawSignForm
              ref={drawElement}
              onDrawSubmit={handleDrawSubmit}
              signer={signer}
              dataSigning={dataSigning}
              headerFooter={headerFooter?.data}
              formattedDatetime={formattedDatetime}
              onDisableSubmit={handleDisableSubmit}
            />
            {/* draw */}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <UploadSignForm
              ref={fileElement}
              onFileSubmit={handleFileSubmit}
              signer={signer}
              dataSigning={dataSigning}
              headerFooter={headerFooter?.data}
              formattedDatetime={formattedDatetime}
              onDisableSubmit={handleDisableSubmit}
            />
          </TabPanel>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: "24px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={onClose}
        >
          {t("0-common.close")}
        </Button>
        <Button
          variant="contained"
          disabled={isSubmitDisabled}
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.sign")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalSigningImage2.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  signer: PropTypes.object,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
  handleShowmodal: PropTypes.func,
};

export default ModalSigningImage2;
