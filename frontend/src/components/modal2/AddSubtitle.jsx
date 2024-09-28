import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { InputField, SelectField } from "../form";
import CheckBoxField from "../form/checkbox-field";
import ToggleAlignment from "../form/toggle-alignment";

export const AddSubtitle = ({ control }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dataSelect = [
    {
      label: "0123456789",
      value: 10,
    },
  ];

  const selectContent = dataSelect.map((item, i) => {
    return (
      <MenuItem key={i} value={item.value}>
        {item.label}
      </MenuItem>
    );
  });
  return (
    <>
      <Box>
        <Typography
          variant="h6"
          color="signingtext1.main"
          fontWeight={600}
          mb="10px"
          height={17}
        >
          {t("signing.contact_information")}
        </Typography>
        <InputField
          label=""
          name="contactInfor"
          control={control}
          inputProps={{
            sx: {
              py: "11px",
              color: "signingtext1.main",
              backgroundColor: "signingWFBackground.main",
            },
          }}
          sx={{ m: "0 0 10px" }}
        />
      </Box>
      <FormLabel
        component="legend"
        sx={{
          fontSize: "14px",
          height: 17,
          mb: "10px",
          color: "signingtext1.main",
          fontWeight: 600,
        }}
      >
        {t("signing.include_text")}
      </FormLabel>
      <FormGroup sx={{ flexDirection: "collumn" }}>
        <Box sx={{ display: "flex" }}>
          <Stack width={"50%"} gap={0}>
            <CheckBoxField
              name="name"
              control={control}
              label={t("0-common.name")}
              sx={{
                color: "signingtext1.main",
                fontWeight: 500,
                width: "100%",
                height: "21px",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
            />
            <CheckBoxField
              name="date"
              control={control}
              label={t("0-common.date")}
              sx={{
                color: "signingtext1.main",
                fontWeight: 500,
                width: "100%",
                height: "21px",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
            />
            <CheckBoxField
              name="logo"
              control={control}
              label={t("0-common.logo")}
              sx={{
                color: "signingtext1.main",
                fontWeight: 500,
                width: "100%",
                height: "21px",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
            />
            <CheckBoxField
              name="reason"
              control={control}
              label={t("0-common.Reason")}
              sx={{
                color: "signingtext1.main",
                fontWeight: 500,
                width: "100%",
                height: "21px",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
            />
          </Stack>
          <Stack width={"50%"} gap={0}>
            <CheckBoxField
              name="dn"
              control={control}
              label={t("0-common.distinguished name")}
              sx={{
                color: "signingtext1.main",
                fontWeight: 500,
                width: "100%",
                height: "21px",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
            />
            {/* <CheckBoxField
              name="itver"
              control={control}
              label={t("0-common.itext version")}
              sx={{
                width: "100%",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
            /> */}
            <CheckBoxField
              name="location"
              control={control}
              label={t("0-common.Location")}
              sx={{
                color: "signingtext1.main",
                fontWeight: 500,
                width: "100%",
                height: "21px",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
              onChange={(event) => {
                if (event.target.checked) {
                  queryClient.invalidateQueries({ queryKey: ["getLocation"] });
                }
              }}
            />
            <CheckBoxField
              name="label"
              control={control}
              label={t("0-common.labels")}
              sx={{
                color: "signingtext1.main",
                fontWeight: 500,
                width: "100%",
                height: "21px",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
            />
          </Stack>
        </Box>
        <Box sx={{ display: "flex", mt: "10px" }}>
          <Box width={"50%"}>
            <FormLabel
              component="legend"
              sx={{
                color: "signingtext1.main",
                fontWeight: 600,
                fontSize: "14px",
                height: 17,
                mb: "10px",
              }}
            >
              {t("0-common.text direction")}
            </FormLabel>
            <ToggleAlignment
              name="alignment"
              control={control}
              size="small"
              color="primary"
              exclusive
              sx={{ height: "45px" }}
            />
          </Box>
          <Box width={"50%"}>
            <FormLabel
              component="legend"
              sx={{
                fontSize: "14px",
                height: 17,
                mb: "10px",
                color: "signingtext1.main",
                fontWeight: 600,
              }}
            >
              {t("0-common.digits format")}
            </FormLabel>
            <SelectField
              name="format"
              control={control}
              content={selectContent}
              disabled={true}
            />
          </Box>
        </Box>
      </FormGroup>
    </>
  );
};

AddSubtitle.propTypes = {
  control: PropTypes.object,
};

export default AddSubtitle;
