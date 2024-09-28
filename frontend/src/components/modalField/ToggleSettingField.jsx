import { UseUpdateSig } from "@/hook/use-fpsService";
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
// import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DetailsTextBoxForm, GeneralToggleForm } from ".";
import { useQueryClient } from "@tanstack/react-query";

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

export const ToggleSettingField = ({
  open,
  onClose,
  toggleData,
  workFlow,
  getFields,
}) => {
  // console.log("toggleData: ", toggleData);
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();

  // eslint-disable-next-line no-unused-vars
  const {
    control,
    handleSubmit,
    watch,
    setValue: setValueForm,
  } = useForm({
    defaultValues: {
      allow: toggleData.remark || [],
      required: toggleData.required || [],
      default_item: toggleData.toggle_item.default_item || "",
      placeHolder: toggleData.place_holder || "",
      tooltip: toggleData.tool_tip_text || "",
      fieldName: toggleData.field_name,
      left: toggleData.dimension.x,
      top: toggleData.dimension.y,
      width: toggleData.dimension.width,
      height: toggleData.dimension.height,
    },
  });

  const defaultValues = watch();

  const formRef = useRef();

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [toggle, setToggle] = useState(toggleData.toggle_item.items);

  useEffect(() => {
    setToggle(toggleData.toggle_item.items);
  }, [toggleData]);

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };

  const handleFormSubmit = (data) => {
    const newDimension = {
      x: data.left !== toggleData.dimension.x ? parseFloat(data.left) : -1,
      y: data.top !== toggleData.dimension.y ? parseFloat(data.top) : -1,
      width:
        data.width !== toggleData.dimension.width ? parseFloat(data.width) : -1,
      height:
        data.height !== toggleData.dimension.height
          ? parseFloat(data.height)
          : -1,
    };

    putSignature.mutate(
      {
        body: {
          field_name: toggleData.field_name,
          dimension: newDimension,
          visible_enabled: true,
          remark: data.allow,
          place_holder: data.placeHolder,
          default_item: data.default_item,
          items: toggle.filter((items) => items.text !== ""),
          tooltip: data.tooltip,
          seal_required: data.required,
          type: toggleData.type,
        },
        field: toggleData.type.toLowerCase(),
        documentId: workFlow.documentId,
      },
      {
        onSuccess: async () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
          await getFields();
          onClose();
        },
      }
    );
  };

  const title = () => {
    switch (toggleData.type) {
      case "TOGGLE":
        return t("0-common.edit_toggle");
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
          {title()}
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
                {/* <GeneralTextBoxForm
              participants={participants}
              control={control}
            /> */}
                <GeneralToggleForm
                  participants={workFlow.participants}
                  control={control}
                  defaultValues={defaultValues}
                  setValueForm={setValueForm}
                  toggle={toggle}
                  setToggle={setToggle}
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
          disabled={toggle.every((item) => item.text === "")}
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
        >
          {t("0-common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ToggleSettingField.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  signer: PropTypes.object,
  toggleData: PropTypes.object,
  totalPages: PropTypes.number,
  workFlow: PropTypes.object,
  sealList: PropTypes.array,
  getFields: PropTypes.func,
};

export default ToggleSettingField;
