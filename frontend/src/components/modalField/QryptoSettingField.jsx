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
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DetailsTextBoxForm, QryptoGeneralForm } from ".";
import { fpsService } from "@/services/fps_service";
import { toast } from "react-toastify";

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

export const QryptoSettingField = ({
  open,
  onClose,
  qryptoData,
  workFlow,
  getFields,
}) => {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);
  const { control, handleSubmit, watch, register, unregister, setValue } =
    useForm({
      defaultValues: {
        workFlowName: workFlow.documentName,
        fileName:
          workFlow.fileName.substring(0, workFlow.fileName.lastIndexOf(".")) ||
          workFlow.fileName,
        fieldName: qryptoData.field_name,
        left: qryptoData.dimension.x,
        top: qryptoData.dimension.y,
        width: qryptoData.dimension.width,
        height: qryptoData.dimension.height,
        items: qryptoData?.items || [],
      },
    });

  const formRef = useRef();

  const [tabIndex, setTabIndex] = useState(0);
  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };

  const handleFormSubmit = async (data) => {
    setIsPending(true);

    const request = {
      field_name: data.fieldName,
      dimension: {
        x: data.left,
        y: data.top,
        width: data.width,
        height: data.height,
      },
      visible_enabled: true,
      page: qryptoData.page,
      type: "QRYPTO",
      items: data.items
        .filter((item) => item !== null)
        .map((item) => {
          switch (item.remark) {
            case "table":
              return {
                ...item,
                value: item.value.filter((value) => value !== null),
              };
            default:
              return item;
          }
        }),
    };
    try {
      const response = await fpsService.putSignature(
        request,
        "qrcode-qrypto",
        workFlow.documentId
      );
      if (response.status === 200) {
        await getFields();
        onClose();
      }
      setIsPending(false);
    } catch (error) {
      toast.error(error);
      setIsPending(false);
    }
  };

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
          maxWidth: "500px",
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
          {t("arrangement.edit_qrypto")}
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
          ref={formRef}
          component="form"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
            <AppBar position="static" elevation={0}>
              <Box sx={{ borderBottom: 1, borderColor: "#E5E7EB" }}>
                <Tabs
                  value={tabIndex}
                  onChange={handleChange}
                  indicatorColor="primary"
                  // textColor="inherit"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                  sx={{
                    height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    backgroundColor: "dialogBackground.main",
                  }}
                >
                  <Tab
                    // icon={<DrawIcon fontSize="small" />}
                    iconPosition="start"
                    label={t("0-common.general")}
                    {...a11yProps(0)}
                    sx={{
                      height: "45px",
                      minHeight: "45px", //set height for tabs and tab
                      textTransform: "none",
                      color: "#1F2937",
                    }} //set height for tabs and tab
                  />
                  <Tab
                    // icon={<DrawIcon fontSize="small" />}
                    iconPosition="start"
                    label={t("0-common.details")}
                    {...a11yProps(1)}
                    sx={{
                      height: "45px",
                      minHeight: "45px", //set height for tabs and tab
                      textTransform: "none",
                      color: "#1F2937",
                    }} //set height for tabs and tab
                  />
                </Tabs>
              </Box>
              <TabPanel value={tabIndex} index={0}>
                <QryptoGeneralForm
                  control={control}
                  watch={watch}
                  register={register}
                  setValue={setValue}
                  unregister={unregister}
                />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <DetailsTextBoxForm control={control} />
              </TabPanel>
            </AppBar>
          </Box>
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
            backgroundColor: "#FFF",
            border: "1px solid var(--Gray-200, #E5E7EB)",
            boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            color: "#1F2937",
            fontWeight: 600,
          }}
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          // disabled={isPending || isSubmitDisabled}
          // startIcon={
          //   isPending ? <CircularProgress color="inherit" size="1em" /> : null
          // }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
            fontWeight: 600,
          }}
          onClick={handleSubmitClick}
          type="button"
          disabled={isPending}
        >
          {t("0-common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

QryptoSettingField.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.string,
  qryptoData: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};

export default QryptoSettingField;
