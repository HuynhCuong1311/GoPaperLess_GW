import { usePending } from "@/hook";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { handleDateTimeChange } from "@/utils/commonFunction";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DetailsTextBoxForm, GeneralDateTimeForm } from ".";

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

export const DateTimeSettingField = ({
  open,
  onClose,
  dateData,
  workFlow,
  getFields,
}) => {
  const { t } = useTranslation();

  // console.log(
  //   "object",
  //   dayjs("Sun Apr 17 2022 00:00:00 GMT+0700 (Indochina Time)", "DD-MM-YYYY")
  // );

  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();

  const [disableSubmit, setDisableSubmit] = useState(false);
  // const fillForm = UseFillForm();

  // eslint-disable-next-line no-unused-vars
  const {
    control,
    handleSubmit,
    watch,
    setValue: setValueForm,
  } = useForm({
    defaultValues: {
      allow: dateData.remark || [],
      required: dateData.required || [],
      default_date_enabled: dateData.date.default_date_enabled,
      date_format: dateData.date.date_format,
      value: dateData.value ? handleDateTimeChange(dateData.value) : null,
      minimum_date: handleDateTimeChange(dateData.date.minimum_date) || null,
      maximum_date: handleDateTimeChange(dateData.date.maximum_date) || null,
      placeHolder: dateData.place_holder || "",
      tooltip: dateData.tool_tip_text || "",
      fieldName: dateData.field_name,
      left: dateData.dimension.x,
      top: dateData.dimension.y,
      width: dateData.dimension.width,
      height: dateData.dimension.height,
    },
  });
  const isPending = usePending();
  const formRef = useRef();

  const [value, setValue] = useState(0);

  // useEffect(() => {
  //   const defaultEnable = watch("default_date_enabled");
  //   if (defaultEnable) {
  //     setValueForm("value", null);
  //   }
  //   if (defaultEnable || watch("value")) {
  //     setIsSubmitDisabled(false);
  //   } else {
  //     setIsSubmitDisabled(true);
  //   }
  // }, [watch("default_date_enabled"), watch("value")]);

  useEffect(() => {
    const defaultEnable = watch("default_date_enabled");
    if (defaultEnable) {
      setValueForm("value", null);
    }
  }, [watch("default_date_enabled"), watch("value")]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };

  const handleFormSubmit = (data) => {
    // fillForm.mutate(
    //   {
    //     body: [
    //       {
    //         field_name: dateData.field_name,
    //         value: data.value ? data.value.$d : new Date(),
    //       },
    //     ],
    //     documentId: workFlow.documentId,
    //   },
    //   {
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({ queryKey: ["getField"] });
    //       queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
    //       onClose();
    //     },
    //   }
    // );

    const newDimension = {
      x: data.left !== dateData.dimension.x ? parseFloat(data.left) : -1,
      y: data.top !== dateData.dimension.y ? parseFloat(data.top) : -1,
      width:
        data.width !== dateData.dimension.width ? parseFloat(data.width) : -1,
      height:
        data.height !== dateData.dimension.height
          ? parseFloat(data.height)
          : -1,
    };

    putSignature.mutate(
      {
        body: {
          field_name: dateData.field_name,
          dimension: newDimension,
          visible_enabled: true,
          remark: data.allow,
          value: data.default_date_enabled
            ? new Date()
            : data.value
            ? data.value.$d
            : null,
          date: {
            date_format: data.date_format,
            minimum_date: data.minimum_date,
            maximum_date: data.maximum_date,
            default_date_enabled: data.default_date_enabled,
            default_date: "",
          },
          place_holder: data.placeHolder,
          tooltip: data.tooltip,
          seal_required: data.required,
          type: dateData.type,
        },
        field: dateData.type.toLowerCase(),
        documentId: workFlow.documentId,
      },
      {
        onSuccess: async () => {
          await getFields();
          queryClient.invalidateQueries({ queryKey: ["getField"] });
          onClose();
        },
      }
    );
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
          {t("modal.edit_date")}
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
                  value={value}
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
                    // icon={<KeyboardIcon fontSize="small" />}
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
            </AppBar>
            <TabPanel value={value} index={0}>
              {/* <GeneralTextBoxForm
          participants={participants}
          control={control}
        /> */}
              <GeneralDateTimeForm
                participants={workFlow.participants}
                control={control}
                watch={watch}
                setValueForm={setValueForm}
                setDisableSubmit={setDisableSubmit}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <DetailsTextBoxForm control={control} />
            </TabPanel>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          p: "15px 20px",
          height: "70px",
          backgroundColor: "#F9FAFB",
        }}
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
          {t("0-common.close")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || disableSubmit}
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
            fontWeight: 600,
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DateTimeSettingField.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dateData: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};

export default DateTimeSettingField;
