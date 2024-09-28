import { usePending } from "@/hook";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { removeEmptyValues } from "@/utils/commonFunction";
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
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DetailsTextBoxForm, GeneralNumericForm } from ".";

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

export const NumericSettingField = ({
  open,
  onClose,
  numericData,
  workFlow,
  getFields,
}) => {
  const { t } = useTranslation();

  //   console.log("object", numericData);

  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();
  //   const fillForm = UseFillForm();

  // eslint-disable-next-line no-unused-vars
  const {
    control,
    handleSubmit,
    watch,
    setValue: setValueForm,
  } = useForm({
    defaultValues: {
      allow: numericData.remark || [],
      required: numericData.required || [],
      default_value: numericData.numeric_stepper.default_value,
      unit_of_change: numericData.numeric_stepper.unit_of_change,
      minimum_value: numericData.numeric_stepper.minimum_value,
      maximum_value: numericData.numeric_stepper.maximum_value,
      placeHolder: numericData.place_holder || "",
      tooltip: numericData.tool_tip_text || "",
      fieldName: numericData.field_name,
      left: numericData.dimension.x,
      top: numericData.dimension.y,
      width: numericData.dimension.width,
      height: numericData.dimension.height,
    },
  });
  // console.log("date now: ", dayjs(new Date()).format("DD-MM-YYYY"));
  const isPending = usePending();
  const formRef = useRef();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };

  const handleFormSubmit = (data) => {
    const newDimension = {
      x: data.left !== numericData.dimension.x ? parseFloat(data.left) : -1,
      y: data.top !== numericData.dimension.y ? parseFloat(data.top) : -1,
      width:
        data.width !== numericData.dimension.width
          ? parseFloat(data.width)
          : -1,
      height:
        data.height !== numericData.dimension.height
          ? parseFloat(data.height)
          : -1,
    };

    putSignature.mutate(
      {
        body: {
          field_name: numericData.field_name,
          dimension: newDimension,
          visible_enabled: true,
          remark: data.allow,
          numeric_stepper: removeEmptyValues({
            default_value: data.default_value,
            unit_of_change: data.unit_of_change,
            minimum_value: data.minimum_value,
            maximum_value: data.maximum_value,
          }),
          place_holder: data.placeHolder,
          tooltip: data.tooltip,
          seal_required: data.required,
          type: numericData.type,
        },
        field: numericData.type.toLowerCase(),
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
          {t("modal.edit_numeric")}
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
              <TabPanel value={value} index={0}>
                <GeneralNumericForm
                  participants={workFlow.participants}
                  control={control}
                  watch={watch}
                  setValueForm={setValueForm}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
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
          {t("0-common.close")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending}
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

NumericSettingField.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  numericData: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};

export default NumericSettingField;
