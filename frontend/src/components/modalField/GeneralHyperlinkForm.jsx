import Box from "@mui/material/Box";
// import FormGroup from "@mui/material/FormGroup";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckBoxField2, InputField } from "../form";

export const GeneralHyperlinkForm = ({
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

  // useEffect(() => {
  //   const updatedRequiredArray = [...defaultValues.required];
  //   defaultValues.required.forEach((element) => {
  //     removeElementIfNotAllowed(
  //       element,
  //       defaultValues.allow,
  //       updatedRequiredArray
  //     );
  //   });
  // }, [defaultValues.allow]);

  return (
    <Box>
      {/* <Box mb="10px">
        <Typography variant="h6">{t("modal.camera_1")}</Typography>
      </Box> */}

      <Box mb="10px">
        <Typography variant="h6" mb="5px">
          {t("modal.text_to_display")}
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
      </Box>
      <Box mb="10px">
        <Typography variant="h6" mb="5px">
          {t("modal.address")}
        </Typography>
        <InputField
          name="address"
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
      <Box mb="10px">
        <Typography variant="h6" mb="5px">
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
      </Box>
    </Box>
  );
};

GeneralHyperlinkForm.propTypes = {
  participants: PropTypes.array,
  control: PropTypes.object,
  defaultValues: PropTypes.object,
  setValueForm: PropTypes.func,
};

export default GeneralHyperlinkForm;
