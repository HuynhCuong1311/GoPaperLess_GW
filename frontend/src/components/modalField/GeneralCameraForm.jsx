import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InputField, TitleInputField } from "../form";
import CheckBoxField from "../form/checkbox-field";
import AllowRequireField from "../form/AllowRequireField";

export const GeneralCameraForm = ({
  participants,
  control,
  defaultValues,
  setValueForm,
}) => {
  const { t } = useTranslation();

  //   const [selected, setSelected] = useState([]);
  //   const [selected2, setSelected2] = useState([]);

  //   const handleChange = (event, type) => {
  //     const value = event.target.value;
  //     // console.log(value);
  //     // added below code to update selected options
  //     const list = type === "allowed" ? [...selected] : [...selected2];
  //     const index = list.indexOf(value);
  //     index === -1 ? list.push(value) : list.splice(index, 1);
  //     type === "allowed" ? setSelected(list) : setSelected2(list);
  //   };
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
        <Typography variant="h6" mb="10px">
          {t("modal.placeholder")}
        </Typography>
        <FormGroup sx={{ mb: "10px" }}>
          {/* <FormControlLabel
            control={
              <div style={{ alignSelf: "start" }}>
                <Checkbox defaultChecked sx={{ height: "24px" }} />
              </div>
            }
            label={
              <Typography variant="h6">{t("0-common.show_icon")}</Typography>
            }
            // sx={{ height: "48px" }}
          /> */}
          <CheckBoxField
            name="showIcon"
            control={control}
            label={
              <Typography variant="h6">{t("0-common.show_icon")}</Typography>
            }
            sx={{ height: "20px" }}
          />
        </FormGroup>
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
      </Box>
      <TitleInputField
        name="tooltip"
        title={t("0-common.tooltip")}
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
    </Box>
  );
};

GeneralCameraForm.propTypes = {
  participants: PropTypes.array,
  control: PropTypes.object,
  defaultValues: PropTypes.object,
  setValueForm: PropTypes.func,
};

export default GeneralCameraForm;
