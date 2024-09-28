/* eslint-disable react/prop-types */
import { ReactComponent as AppearanceIcon } from "@/assets/images/svg/appearance-icon.svg";
import useCountry from "@/hook/use-country";
import { apiService } from "@/services/api_service";
import DrawIcon from "@mui/icons-material/Draw";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import UploadIcon from "@mui/icons-material/Upload";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  AddSubtitle,
  AppearanceSignForm,
  DrawSignForm,
  ReviewSign,
  TextSignForm,
  UploadSignForm,
} from ".";

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

export const ModalSigning = ({
  open,
  onClose,
  signer,
  dataSigning,
  setDataSigning,
  handleShowmodal,
  signatureData,
  pdfPage,
  isControlled,
  isSetPos,
  index,
  signerId,
  maxPosibleResizeWidth,
  maxPosibleResizeHeight,
  workFlow,
  setIsControlled,
  dragPosition,
  setDragPosition,
  handleDrag,
  newPos,
  openResize,
  setOpenResize,
}) => {
  const { t } = useTranslation();
  // console.log("signer", signer);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      text:
        typeof dataSigning?.certChain?.subject === "string"
          ? dataSigning.certChain.subject
          : dataSigning.certChain.subject.commonName,
      drawUrl: "",
      fileUrl: "",
      imageScrop: "",
      name: true,
      contactInfor: dataSigning.email,
      date: false,
      logo: false,
      reason: true,
      dn: false,
      itver: false,
      location: true,
      label: true,
      alignment: "auto",
      format: 10,
    },
  });

  const { signing_token: signingToken } = useParams();
  const [value, setValue] = useState(
    signer.annotation?.signature_image ? 3 : 0
  );
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const textElement = useRef();
  const drawElement = useRef();
  const fileElement = useRef();
  const formRef = useRef();

  const { data: headerFooter } = useQuery({
    queryKey: ["checkHeader"],
    queryFn: () => apiService.checkHeaderFooter(signingToken),
  });

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

  useEffect(() => {
    if (value === 3) {
      handleDisableSubmit(false);
    }
  }, [value]);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  const handleFormSubmit = (data) => {
    setDataSigning({
      ...dataSigning,
      contactInfor: data.contactInfor,
    });
    handleOpenResize(true);
    // switch (value) {
    //   case 0:
    //     html2canvas(textElement.current, { backgroundColor: null }).then(
    //       (canvas) => {
    //         const data64 = canvas.toDataURL();

    //         setDataSigning({
    //           ...dataSigning,
    //           contactInfor: data.contactInfor,
    //           imageBase64: removeBase64Prefix(data64),
    //         });
    //         onClose();
    //         handleShowmodal();
    //       }
    //     );
    //     break;
    //   case 1:
    //     html2canvas(drawElement.current, { backgroundColor: null }).then(
    //       (canvas) => {
    //         const data64 = canvas.toDataURL();
    //         // console.log("data64: ", canvas);

    //         setDataSigning({
    //           ...dataSigning,
    //           contactInfor: data.contactInfor,
    //           imageBase64: removeBase64Prefix(data64),
    //         });
    //         onClose();
    //         handleShowmodal();
    //       }
    //     );
    //     break;
    //   case 2:
    //     html2canvas(fileElement.current, { backgroundColor: null }).then(
    //       (canvas) => {
    //         const data64 = canvas.toDataURL();

    //         // console.log(data64);
    //         setDataSigning({
    //           ...dataSigning,
    //           contactInfor: data.contactInfor,
    //           imageBase64: removeBase64Prefix(data64),
    //         });
    //         onClose();
    //         handleShowmodal();
    //       }
    //     );
    //     break;
    // }
  };

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };
  // handle resize signature
  const [imgBase64, setImgBase64] = useState(null);
  // console.log("data64: ", imgBase64);

  const handleOpenResize = (status) => {
    setOpenResize(status);
  };
  useEffect(() => {
    setImgBase64(null);
  }, [
    value,
    watch("location"),
    watch("drawUrl"),
    watch("fileUrl"),
    watch("imageScrop"),
    watch("name"),
    watch("contactInfor"),
    watch("date"),
    watch("logo"),
    watch("reason"),
    watch("dn"),
    watch("itver"),
    watch("location"),
    watch("label"),
    watch("alignment"),
    watch("format"),
    watch("text"),
    signer,
  ]);
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
          {/* {title} */}
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
          //   component="div"
          ref={formRef}
          component="form"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
          onSubmit={handleSubmit(handleFormSubmit)}
          // className="choyoyoy"
        >
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
                  variant={
                    signer.annotation?.signature_image
                      ? "scrollable"
                      : "fullWidth"
                  }
                  aria-label="full width tabs example"
                  sx={{
                    // height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    backgroundColor: "dialogBackground.main",
                  }}
                >
                  <Tab
                    icon={<KeyboardIcon fontSize="small" />}
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
                    icon={<DrawIcon fontSize="small" />}
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
                    icon={<UploadIcon fontSize="small" />}
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
                  <Tab
                    icon={<AppearanceIcon fontSize="small" />}
                    iconPosition="start"
                    label={t("0-common.appearance")}
                    {...a11yProps(3)}
                    sx={{
                      // height: "45px",
                      minHeight: "45px", //set height for tabs and tab
                      textTransform: "none",
                      color: "signingtext1.main",
                      display: signer.annotation?.signature_image
                        ? "block"
                        : "none",
                    }} //set height for tabs and tab
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <TextSignForm
                  ref={textElement}
                  dataSigning={dataSigning}
                  headerFooter={headerFooter?.data}
                  formattedDatetime={formattedDatetime}
                  onDisableSubmit={handleDisableSubmit}
                  watch={watch}
                  control={control}
                  imgBase64={imgBase64}
                />
                {/* text */}
              </TabPanel>
              <TabPanel value={value} index={1}>
                <DrawSignForm
                  ref={drawElement}
                  dataSigning={dataSigning}
                  headerFooter={headerFooter?.data}
                  formattedDatetime={formattedDatetime}
                  onDisableSubmit={handleDisableSubmit}
                  watch={watch}
                  control={control}
                  imgBase64={imgBase64}
                />
                {/* draw */}
              </TabPanel>
              <TabPanel value={value} index={2}>
                <UploadSignForm
                  ref={fileElement}
                  dataSigning={dataSigning}
                  headerFooter={headerFooter?.data}
                  formattedDatetime={formattedDatetime}
                  onDisableSubmit={handleDisableSubmit}
                  watch={watch}
                  control={control}
                  imgBase64={imgBase64}
                />
              </TabPanel>
              {signer.annotation?.signature_image && (
                <TabPanel value={value} index={3}>
                  <AppearanceSignForm
                    ref={textElement}
                    signatureImage={signer.annotation.signature_image}
                    onDisableSubmit={handleDisableSubmit}
                  />
                </TabPanel>
              )}
            </AppBar>
          </Box>
          {value !== 3 && <AddSubtitle control={control} signer={signer} />}
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
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
        {/* <Button
          variant="contained"
          disabled={isSubmitDisabled}
          // startIcon={
          //   isPending ? <CircularProgress color="inherit" size="1em" /> : null
          // }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          type="button"
          onClick={() => {
            handleOpenResize(true);
          }}
        >
          {t("0-common.preview")}
        </Button> */}
        <Button
          variant="contained"
          disabled={isSubmitDisabled}
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
            fontWeight: 600,
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.preview&continue")}
        </Button>
      </DialogActions>
      <ReviewSign
        open={openResize}
        handleOpenResize={handleOpenResize}
        ref={textElement}
        dataSigning={dataSigning}
        setDataSigning={setDataSigning}
        headerFooter={headerFooter?.data}
        formattedDatetime={formattedDatetime}
        isSubmitDisabled={isSubmitDisabled}
        onDisableSubmit={handleDisableSubmit}
        watch={watch}
        control={control}
        value={value}
        signatureData={signatureData}
        pdfPage={pdfPage}
        isControlled={isControlled}
        isSetPos={isSetPos}
        index={index}
        signerId={signerId}
        maxPosibleResizeWidth={maxPosibleResizeWidth}
        maxPosibleResizeHeight={maxPosibleResizeHeight}
        workFlow={workFlow}
        handleFormSubmit={handleFormSubmit}
        setImgBase64={setImgBase64}
        setIsControlled={setIsControlled}
        dragPosition={dragPosition}
        setDragPosition={setDragPosition}
        handleDrag={handleDrag}
        newPos={newPos}
        handleSubmitClick={handleSubmitClick}
        handleShowmodal={handleShowmodal}
        onClose2={() => setOpenResize(false)}
        onClose={onClose}
      />
    </Dialog>
  );
};

ModalSigning.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  signer: PropTypes.object,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
  handleShowmodal: PropTypes.func,
};

export default ModalSigning;
