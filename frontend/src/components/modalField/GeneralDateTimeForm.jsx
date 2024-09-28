import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DayPicker, InputField, SelectField } from "../form";
import CheckBoxField from "../form/checkbox-field";
import AllowRequireField from "../form/AllowRequireField";
import MenuItem from "@mui/material/MenuItem";

export const GeneralDateTimeForm = ({
  participants,
  control,
  watch,
  setValueForm,
  setDisableSubmit,
}) => {
  const { t } = useTranslation();
  const defaultValues = watch();
  // console.log("defaultValues: ", defaultValues);

  const [openValue, setOpenValue] = useState(false);
  const [openMinValue, setOpenMinValue] = useState(false);
  const [openMaxValue, setOpenMaxValue] = useState(false);

  const format = defaultValues.date_format;
  // console.log("format: ", format);
  const removeElementIfNotAllowed = (element, allowArray, requiredArray) => {
    const isAllowed = allowArray.includes(element);
    if (!isAllowed) {
      const index = requiredArray.indexOf(element);
      if (index !== -1) {
        requiredArray.splice(index, 1);
        setValueForm("required", requiredArray);
      }
    }
  };

  useEffect(() => {
    const updatedRequiredArray = [...defaultValues.required];
    defaultValues.required.forEach((element) => {
      removeElementIfNotAllowed(
        element,
        defaultValues.allow,
        updatedRequiredArray
      );
    });
  }, [defaultValues.allow]);

  const dataSelect = [
    {
      label: "DD-MM-YYYY",
      value: "DD-MM-YYYY",
    },
    {
      label: "MM/DD/YYYY",
      value: "MM/DD/YYYY",
    },
    {
      label: "MMMM D, YYYY",
      value: "MMMM D, YYYY",
    },
    // {
    //   label: "M/D/YYYY",
    //   value: "M/D/YYYY",
    // },
    {
      label: "MMM D, YYYY",
      value: "MMM D, YYYY",
    },
  ];

  const selectContent = dataSelect.map((item, i) => {
    return (
      <MenuItem key={i} value={item.value}>
        {item.label}
      </MenuItem>
    );
  });

  const handleError = (reason) => {
    // console.log("reason: ", reason);
    // console.log("value: ", value);
    if (reason === null) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  };

  return (
    <Box>
      <Box mb="10px">
        <Typography variant="h6">{t("modal.camera_1")}</Typography>
      </Box>
      <AllowRequireField
        data={participants}
        defaultValues={defaultValues}
        control={control}
      />
      <Box mb="10px">
        <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
          {t("modal.default_value")}
        </Typography>
        <FormGroup sx={{ mb: "10px" }}>
          <CheckBoxField
            name="default_date_enabled"
            control={control}
            label={
              <Typography variant="h6">
                {t("modal.set_default_date")}
              </Typography>
            }
            sx={{
              height: "20px",

              // backgroundColor: "#FFF",
            }}
          />
        </FormGroup>

        <DayPicker
          name="value"
          control={control}
          format={format}
          minDate={defaultValues.minimum_date}
          maxDate={defaultValues.maximum_date}
          disabled={defaultValues.default_date_enabled}
          disableOpenPicker={defaultValues.default_date_enabled}
          open={openValue}
          onClose={() => setOpenValue(false)}
          onError={handleError}
          slotProps={{
            textField: {
              onClick: () => setOpenValue(true),
            },
          }}
        />
      </Box>
      <Box mb="10px">
        <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
          {t("modal.format")}
        </Typography>
        {/* <InputField
          //   label={t("0-common.text")}
          name="date_format"
          control={control}
          sx={{
            my: 0,
          }}
          inputProps={{
            sx: {
              py: "11px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
        /> */}
        <SelectField
          name="date_format"
          control={control}
          content={selectContent}
          sx={{ backgroundColor: "signingWFBackground.main" }}
        />
      </Box>
      <Box mb="10px">
        <Grid container rowSpacing={"20px"} columnSpacing={"20px"}>
          <Grid item xs={6}>
            <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
              {t("modal.min_date")}
            </Typography>

            <DayPicker
              name="minimum_date"
              control={control}
              format={format}
              maxDate={
                defaultValues.value
                  ? defaultValues.value
                  : defaultValues.maximum_date
              }
              open={openMinValue}
              onClose={() => setOpenMinValue(false)}
              onError={handleError}
              slotProps={{
                textField: {
                  onClick: () => setOpenMinValue(true),
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
              {t("modal.max_date")}
            </Typography>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} sx={{ p: 0 }}>
                <DatePicker
                  sx={{
                    padding: 0,
                    width: "100%",
                    "& .MuiInputBase-input": { py: 0 },
                    backgroundColor: "signingWFBackground.main",
                  }}
                />
              </DemoContainer>
            </LocalizationProvider> */}
            <DayPicker
              name="maximum_date"
              control={control}
              format={format}
              minDate={
                defaultValues.value
                  ? defaultValues.value
                  : defaultValues.minimum_date
              }
              open={openMaxValue}
              onClose={() => setOpenMaxValue(false)}
              onError={handleError}
              slotProps={{
                textField: {
                  onClick: () => setOpenMaxValue(true),
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box mb="10px">
        <Grid container rowSpacing={"20px"} columnSpacing={"20px"}>
          <Grid item xs={6}>
            <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
              {t("modal.placeholder")}
            </Typography>
            <InputField
              //   label={t("0-common.text")}
              name="placeHolder"
              control={control}
              sx={{
                my: 0,
              }}
              inputProps={{
                sx: {
                  py: "11px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
              {t("0-common.tooltip")}
            </Typography>
            <InputField
              //   label={t("0-common.text")}
              name="tooltip"
              control={control}
              sx={{
                mt: 0,
              }}
              inputProps={{
                sx: {
                  py: "11px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

GeneralDateTimeForm.propTypes = {
  participants: PropTypes.array,
  control: PropTypes.object,
  watch: PropTypes.func,
  setValueForm: PropTypes.func,
  setDisableSubmit: PropTypes.func,
};

export default GeneralDateTimeForm;
