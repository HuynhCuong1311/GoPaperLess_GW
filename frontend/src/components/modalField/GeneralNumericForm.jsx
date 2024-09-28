import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InputField } from "../form";
import AllowRequireField from "../form/AllowRequireField";

export const GeneralNumericForm = ({
  participants,
  control,
  watch,
  setValueForm,
}) => {
  const { t } = useTranslation();
  const defaultValues = watch();

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
        <Grid container rowSpacing={"10px"} columnSpacing={"20px"}>
          <Grid item xs={6}>
            <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
              {t("modal.default_value")}
            </Typography>
            <InputField
              //   label={t("0-common.text")}
              name="default_value"
              control={control}
              sx={{
                my: 0,
                '& input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button':
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
              }}
              inputProps={{
                sx: {
                  py: "11px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              type="number"
              //   inputMode="numeric"
              //   type="text"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
              {t("modal.unit_change")}
            </Typography>
            <InputField
              //   label={t("0-common.text")}
              name="unit_of_change"
              control={control}
              sx={{
                mt: 0,
                '& input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button':
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
              }}
              inputProps={{
                sx: {
                  py: "11px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
              {t("modal.min_value")}
            </Typography>
            <InputField
              //   label={t("0-common.text")}
              name="minimum_value"
              control={control}
              sx={{
                my: 0,
                '& input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button':
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
              }}
              inputProps={{
                sx: {
                  py: "11px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" mb="10px" sx={{ height: "17px" }}>
              {t("modal.max_value")}
            </Typography>
            <InputField
              //   label={t("0-common.text")}
              name="maximum_value"
              control={control}
              sx={{
                mt: 0,
                '& input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button':
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
              }}
              inputProps={{
                sx: {
                  py: "11px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              type="number"
            />
          </Grid>
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

GeneralNumericForm.propTypes = {
  participants: PropTypes.array,
  control: PropTypes.object,
  watch: PropTypes.func,
  setValueForm: PropTypes.func,
};

export default GeneralNumericForm;
