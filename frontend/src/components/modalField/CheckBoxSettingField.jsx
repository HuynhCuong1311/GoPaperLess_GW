import { fpsService } from "@/services/fps_service";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CheckBoxSettingForm, DetailsTextBoxForm } from ".";
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

export const CheckBoxSettingField = ({
  open,
  onClose,
  dimension,
  fieldGroup,
  participants,
  checkBoxData,
  type,
  workFlow,
  getFields,
}) => {
  const formRef = useRef();
  const [tabIndex, setTabIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const { t } = useTranslation();
  const [remark, setRemark] = useState(checkBoxData[0]?.remark || []);
  const [required, setRequired] = useState(checkBoxData[0]?.required || []);
  const [multipleChecked, setMultipleChecked] = useState(
    checkBoxData[0]?.multiple_checked
  );
  const [alignment, setAlignment] = useState(
    checkBoxData[0]?.align_option?.horizontal_alignment
  );
  const [radio, setRadio] = useState(
    checkBoxData.filter((e) => e.checked === true)[0]?.field_name
  );

  const [checked, setChecked] = useState(
    checkBoxData.map((checkbox) => checkbox.checked || false)
  );

  const checkedStyle = [
    {
      background_rgbcode: "#3B82F6",
      border_rgbcode: "#3B82F6",
      checked_rgbcode: "#FFFFFF",
    },
    {
      background_rgbcode: "#22C55E",
      border_rgbcode: "#22C55E",
      checked_rgbcode: "#FFFFFF",
    },
    {
      background_rgbcode: "#EF4444",
      border_rgbcode: "#EF4444",
      checked_rgbcode: "#FFFFFF",
    },
    {
      background_rgbcode: "#000000",
      border_rgbcode: "#000000",
      checked_rgbcode: "#FFFFFF",
    },
    {
      background_rgbcode: "#DBEAFE",
      border_rgbcode: "#3B82F6",
      checked_rgbcode: "#3B82F6",
    },
    {
      background_rgbcode: "#FEE2E2",
      border_rgbcode: " #EF4444",
      checked_rgbcode: "#EF4444",
    },
    {
      background_rgbcode: "#F3F4F6",
      border_rgbcode: "#000000",
      checked_rgbcode: "#000000",
    },
  ];
  const uncheckedStyle = [
    {
      background_rgbcode: "#FFFFFF",
      border_rgbcode: "#E5E7EB",
      checked_rgbcode: "#FFFFFF",
    },
    {
      background_rgbcode: "#E5E7EB",
      border_rgbcode: " #E5E7EB",
      checked_rgbcode: "#FFFFFF",
    },
    {
      background_rgbcode: "#FFFFFF",
      border_rgbcode: " #000",
      checked_rgbcode: "#FFFFFF",
    },
    {
      background_rgbcode: "#FFFFFF",
      border_rgbcode: "#3B82F6",
      checked_rgbcode: "#FFFFFF",
    },
    {
      background_rgbcode: "#FFFFFF",
      border_rgbcode: "#22C55E",
      checked_rgbcode: "#FFFFFF",
    },
    {
      background_rgbcode: "#FFFFFF",
      border_rgbcode: "#EF4444",
      checked_rgbcode: "#FFFFFF",
    },
  ];
  const [checkedStyles, setCheckedStyles] = useState(
    checkedStyle.findIndex((e) => {
      return (
        e.background_rgbcode ===
          checkBoxData[0]?.checkbox_frame?.background_rgbcode &&
        e.border_rgbcode === checkBoxData[0]?.checkbox_frame?.border_rgbcode &&
        e.checked_rgbcode === checkBoxData[0]?.checkbox_frame?.checked_rgbcode
      );
    })
  );
  const [uncheckedStyles, setUncheckedStyles] = useState(
    uncheckedStyle.findIndex((e) => {
      return (
        e.background_rgbcode ===
          checkBoxData[0]?.uncheckbox_frame?.background_rgbcode &&
        e.border_rgbcode ===
          checkBoxData[0]?.uncheckbox_frame?.border_rgbcode &&
        e.checked_rgbcode === checkBoxData[0]?.uncheckbox_frame?.checked_rgbcode
      );
    })
  );
  useEffect(() => {
    setChecked(checkBoxData.map((checkbox) => checkbox.checked));
  }, [checkBoxData]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      tooltip: checkBoxData[0]?.tool_tip_text,
      checkBoxData: checkBoxData,
      fieldGroup: fieldGroup,
      left: dimension.x,
      top: dimension.y,
      width: dimension.width,
      height: dimension.height,
      // items: [...qryptoData?.items],
    },
  });
  const handleFormSubmit = async (data) => {
    setIsPending(true);
    let response = false;
    try {
      if (type === "radio") {
        await Promise.all(
          data.checkBoxData.map(async (item) => {
            delete item.required;
            const putpos = await fpsService.putSignature(
              {
                ...item,
                remark,
                tooltip: data.tooltip,
                checked: item.field_name === radio ? true : false,
                seal_required: required,
                checkbox_frame: checkedStyle[checkedStyles],
                uncheckbox_frame: uncheckedStyle[uncheckedStyles],
                align_option: {
                  ...item.align_option,
                  horizontal_alignment: alignment,
                },
              },
              type === "radio" ? "radioboxV2" : "checkboxV2",
              workFlow.documentId
            );
            if (putpos.status !== 200) return;
            response = true;
          })
        );
      } else {
        await Promise.all(
          data.checkBoxData.map(async (item, index) => {
            delete item.required;
            const putpos = await fpsService.putSignature(
              {
                ...item,
                remark,
                tooltip: data.tooltip,
                checked: checked[index],
                seal_required: required,
                multiple_checked: multipleChecked,
                checkbox_frame: checkedStyle[checkedStyles],
                uncheckbox_frame: uncheckedStyle[uncheckedStyles],
                align_option: {
                  ...item.align_option,
                  horizontal_alignment: alignment,
                },
              },
              type === "radio" ? "radioboxV2" : "checkboxV2",
              workFlow.documentId
            );
            if (putpos.status !== 200) return;
            response = true;
          })
        );
      }
      if (response) {
        await getFields();
        onClose();
      } else {
        console.log("fail");
        toast.error("Update failed");
        setIsPending(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
      setIsPending(false);
    }
  };
  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };
  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <Dialog
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
          {type === "radio"
            ? `${t("arrangement.edit").toLocaleUpperCase()} RADIO`
            : `${t("arrangement.edit").toLocaleUpperCase()} CHECKBOX`}
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
          {" "}
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
                <CheckBoxSettingForm
                  participants={participants}
                  checkBoxData={checkBoxData}
                  control={control}
                  type={type}
                  remark={remark}
                  setRemark={setRemark}
                  checked={checked}
                  setChecked={setChecked}
                  required={required}
                  setRequired={setRequired}
                  radio={radio}
                  setRadio={setRadio}
                  multipleChecked={multipleChecked}
                  setMultipleChecked={setMultipleChecked}
                  alignment={alignment}
                  setAlignment={setAlignment}
                  styles={{
                    checkedStyles,
                    uncheckedStyles,
                    checkedStyle,
                    uncheckedStyle,
                    setCheckedStyles,
                    setUncheckedStyles,
                  }}
                />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <DetailsTextBoxForm control={control} type="group" />
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

CheckBoxSettingField.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dimension: PropTypes.object,
  fieldGroup: PropTypes.string,
  participants: PropTypes.array,
  checkBoxData: PropTypes.array,
  type: PropTypes.string,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};
