import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SelectField } from "../form";

export const GeneralSealForm = ({ participants, control }) => {
  const { t } = useTranslation();

  const data1 = participants?.map((item) => (
    <MenuItem key={item.id} value={item.signerId}>
      {item.lastName + " " + item.firstName}
    </MenuItem>
  ));
  return (
    <Box
      sx={{
        "& >.MuiBox-root": {
          marginBottom: "10px",
        },
      }}
    >
      <Box>
        <Typography variant="h6" mb="10px">
          {t("modal.assigned_to")}
        </Typography>
        <FormControl fullWidth>
          <SelectField
            name="assign"
            control={control}
            label=""
            content={data1}
            // onChange={handleChange1}
            sx={{
              backgroundColor: "signingWFBackground.main",
              height: "45px",
            }}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

GeneralSealForm.propTypes = {
  participants: PropTypes.array,
  control: PropTypes.object,
};

export default GeneralSealForm;
