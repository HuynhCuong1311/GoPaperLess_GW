import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const SignatureOptions = ({ state, dispatch }) => {
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
    <Box>
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
        <TextField
          fullWidth
          size="small"
          margin="normal"
          value={state.data.contactInfor}
          onChange={(event) => {
            dispatch({
              type: "SET_CONTACT_INFOR",
              payload: event.target.value,
            });
          }}
          inputProps={{
            sx: {
              py: "11px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
          sx={{ m: "0 0 10px" }}
        />
      </Box>
      <Typography
        variant="h6"
        color="signingtext1.main"
        fontWeight={600}
        mb="10px"
        height={17}
      >
        {t("signing.include_text")}
      </Typography>

      <FormGroup sx={{ flexDirection: "row" }}>
        <Stack sx={{ width: "50%" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.data.signatureOptions.name}
                onChange={(event) => {
                  dispatch({
                    type: "SET_NAME",
                    payload: event.target.checked,
                  });
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("0-common.name")}
            sx={{
              color: "signingtext1.main",
              fontWeight: 500,
              width: "100%",
              height: "21px",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
              "& .MuiSvgIcon-root": { fontSize: 21 },
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                lineHeight: "150%",
                fontWeight: 500,
                color: "signingtext1.main",
                marginRight: "10px !important",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.data.signatureOptions.date}
                onChange={(event) => {
                  dispatch({
                    type: "SET_DATE",
                    payload: event.target.checked,
                  });
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("0-common.date")}
            sx={{
              color: "signingtext1.main",
              fontWeight: 500,
              width: "100%",
              height: "21px",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
              "& .MuiSvgIcon-root": { fontSize: 21 },
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                lineHeight: "150%",
                fontWeight: 500,
                color: "signingtext1.main",
                marginRight: "10px !important",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.data.signatureOptions.logo}
                onChange={(event) => {
                  dispatch({
                    type: "SET_LOGO",
                    payload: event.target.checked,
                  });
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("0-common.logo")}
            sx={{
              color: "signingtext1.main",
              fontWeight: 500,
              width: "100%",
              height: "21px",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
              "& .MuiSvgIcon-root": { fontSize: 21 },
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                lineHeight: "150%",
                fontWeight: 500,
                color: "signingtext1.main",
                marginRight: "10px !important",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.data.signatureOptions.reason}
                onChange={(event) => {
                  dispatch({
                    type: "SET_REASON",
                    payload: event.target.checked,
                  });
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("0-common.Reason")}
            sx={{
              color: "signingtext1.main",
              fontWeight: 500,
              width: "100%",
              height: "21px",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
              "& .MuiSvgIcon-root": { fontSize: 21 },
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                lineHeight: "150%",
                fontWeight: 500,
                color: "signingtext1.main",
                marginRight: "10px !important",
              },
            }}
          />
        </Stack>
        <Stack sx={{ width: "50%" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.data.signatureOptions.dn}
                onChange={(event) => {
                  dispatch({
                    type: "SET_DN",
                    payload: event.target.checked,
                  });
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("0-common.distinguished name")}
            sx={{
              color: "signingtext1.main",
              fontWeight: 500,
              width: "100%",
              height: "21px",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
              "& .MuiSvgIcon-root": { fontSize: 21 },
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                lineHeight: "150%",
                fontWeight: 500,
                color: "signingtext1.main",
                marginRight: "10px !important",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.data.signatureOptions.itver}
                onChange={(event) => {
                  dispatch({
                    type: "SET_ITVER",
                    payload: event.target.checked,
                  });
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("0-common.itext version")}
            sx={{
              color: "signingtext1.main",
              fontWeight: 500,
              width: "100%",
              height: "21px",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
              "& .MuiSvgIcon-root": { fontSize: 21 },
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                lineHeight: "150%",
                fontWeight: 500,
                color: "signingtext1.main",
                marginRight: "10px !important",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.data.signatureOptions.location}
                onChange={(event) => {
                  dispatch({
                    type: "SET_LOCATION",
                    payload: event.target.checked,
                  });
                  if (event.target.checked) {
                    queryClient.invalidateQueries({
                      queryKey: ["getLocation"],
                    });
                  }
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("0-common.Location")}
            sx={{
              color: "signingtext1.main",
              fontWeight: 500,
              width: "100%",
              height: "21px",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
              "& .MuiSvgIcon-root": { fontSize: 21 },
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                lineHeight: "150%",
                fontWeight: 500,
                color: "signingtext1.main",
                marginRight: "10px !important",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.data.signatureOptions.label}
                onChange={(event) => {
                  dispatch({
                    type: "SET_LABEL",
                    payload: event.target.checked,
                  });
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("0-common.labels")}
            sx={{
              color: "signingtext1.main",
              fontWeight: 500,
              width: "100%",
              height: "21px",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
              "& .MuiSvgIcon-root": { fontSize: 21 },
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                lineHeight: "150%",
                fontWeight: 500,
                color: "signingtext1.main",
                marginRight: "10px !important",
              },
            }}
          />
        </Stack>
        <Stack sx={{ width: "100%", flexDirection: "row", mt: "10px" }}>
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
            <ToggleButtonGroup
              value={state.data.signatureOptions.alignment}
              onChange={(event, newAlignment) => {
                console.log("newAlignment: ", newAlignment);
                dispatch({
                  type: "SET_ALIGNMENT",
                  payload: newAlignment,
                });
              }}
              aria-label="Platform"
              size="small"
              color="primary"
              exclusive
              sx={{ height: "45px" }}
            >
              <ToggleButton value="auto">Auto</ToggleButton>
              <ToggleButton value="left">
                <FormatAlignLeftIcon />
              </ToggleButton>
              ,
              <ToggleButton value="right">
                <FormatAlignRightIcon />
              </ToggleButton>
              ,
            </ToggleButtonGroup>
          </Box>
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
              {t("0-common.digits format")}
            </FormLabel>
            <FormControl sx={{ width: "100%" }} size="small">
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={state.data.signatureOptions.format}
                onChange={(e) => {
                  console.log("value: ", e.target.value);
                }}
                disabled
              >
                {selectContent}
              </Select>
              {/* <FormHelperText sx={{ color: "error.main" }}>
        {error?.message}
      </FormHelperText> */}
            </FormControl>
          </Box>
        </Stack>
      </FormGroup>
    </Box>
  );
};

SignatureOptions.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
};

export default SignatureOptions;
