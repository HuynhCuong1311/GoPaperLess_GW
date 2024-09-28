import { usePending } from "@/hook";
import { removeBase64Prefix } from "@/utils/commonFunction";
import UploadIcon from "@mui/icons-material/Upload";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { UploadInitForm } from ".";
import { UseFillInit } from "@/hook/use-fpsService";

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

export const SealSigningField = ({
  open,
  onClose,
  sealData,
  workFlow,
  sealsignerList,
}) => {
  const { t } = useTranslation();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      fileUrl: "",
      imageScrop: "",
      apply: false,
    },
  });

  const queryClient = useQueryClient();
  const isPending = usePending();

  const fillInit = UseFillInit();

  const [value, setValue] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const textElement = useRef();
  const formRef = useRef();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  const handleFormSubmit = (data) => {
    html2canvas(textElement.current, { backgroundColor: null }).then(
      (canvas) => {
        const data64 = canvas.toDataURL();
        fillInit.mutate(
          {
            body: {
              field_name: sealData.field_name,
              apply_to_all: data.apply,
              // initial_pages: [initData.page],
              initial_field: sealsignerList,
              value: removeBase64Prefix(data64),
            },
            field: "stamp",
            documentId: workFlow.documentId,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["getField"] });
              queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
              onClose();
            },
          }
        );
      }
    );
  };

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
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
          {t("modal.apply_seal")}
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
                  icon={<UploadIcon fontSize="small" />}
                  iconPosition="start"
                  label={t("0-common.upload")}
                  {...a11yProps(0)}
                  sx={{
                    height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    textTransform: "none",
                    color: "#1F2937",
                  }} //set height for tabs and tab
                />
              </Tabs>

              <TabPanel value={value} index={0}>
                <UploadInitForm
                  ref={textElement}
                  watch={watch}
                  control={control}
                  onDisableSubmit={handleDisableSubmit}
                />
              </TabPanel>
            </AppBar>
          </Box>
          <FormGroup>
            <FormControlLabel
              control={
                <Controller
                  name="apply"
                  control={control}
                  render={({ field }) => <Checkbox {...field} />}
                />
              }
              label={t("modal.initmodal_1")}
            />
          </FormGroup>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || isSubmitDisabled}
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
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

SealSigningField.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  sealData: PropTypes.object,
  workFlow: PropTypes.object,
  sealsignerList: PropTypes.array,
};

export default SealSigningField;
