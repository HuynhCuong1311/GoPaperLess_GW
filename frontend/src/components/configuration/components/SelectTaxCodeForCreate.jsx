import { ReactComponent as TaxIcon } from "@/assets/images/svg/tax_icon.svg";
import { ModalTaxInfor } from "@/components/modal_eid";
import styled from "@emotion/styled";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ToggleButtonStyle = styled(ToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    border: "1px solid #0f6dca !important",
    color: "#3B82F6",
  },
  "&:not(.Mui-selected)": {
    color: "#111", // tắt chức năng làm mờ của Mui
  },
  marginBottom: "4px",
  border: "1px solid #357EEB !important",
  borderRadius: "10px",
  padding: "7px",
});

export const SelectTaxCodeForCreate = ({ state, dispatch }) => {
  const { t } = useTranslation();
  const [isShowTaxInfor, setShowTaxInfor] = useState([false]);
  const [taxIndex, setTaxIndex] = useState(null);

  useEffect(() => {
    if (taxIndex === null || state.taxInformation?.length === 0) {
      dispatch({ type: "SET_DISABLED", payload: true });
    } else {
      dispatch({ type: "SET_DISABLED", payload: false });
    }
  }, [taxIndex, dispatch, state.taxInformation]);

  const handleShowTaxInfor = (index) => {
    const newValue = [...isShowTaxInfor];
    newValue[index] = true;
    setShowTaxInfor(newValue);
  };

  const handleCloseTaxInfor = (index) => {
    const newValue = [...isShowTaxInfor];
    newValue[index] = false;
    setShowTaxInfor(newValue);
  };

  const handleChange = (event, nextView) => {
    setTaxIndex(nextView);
    dispatch({
      type: "SET_TAX_CODE",
      payload: state.taxInformations[nextView].company_information.tax_code,
    });
  };

  return (
    <Stack height="100%">
      <Typography
        variant="h6"
        // sx={{ height: "17px" }}
        mb={"10px"}
        color="textBold.main"
      >
        {/* Enter your phone number to receive a verification code. */}
        {t("electronic.step147")}
      </Typography>
      <Typography
        variant="h6"
        // textAlign={"center"}
        mb={"10px"}
        sx={{ fontWeight: 600, color: "textBold.main", height: "17px" }}
      >
        {/* Phone Verification */}
        {t("signing.personal_code")}
        {/* Citizen identification Code */}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: "45px",
          mb: "10px",
        }}
        autoComplete="off"
      >
        <TextField
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          value={state.data.code}
          disabled
          InputLabelProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
          inputProps={{
            sx: {
              py: "11px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
          sx={{ my: 0, height: "45px" }}
        />
      </Box>
      <Box width={"100%"} flexGrow={1}>
        {state.taxInformations === undefined ? (
          <Stack direction="column" justifyContent="flex-end" height="100%">
            <Alert severity="error">{t("electronic.no_tax_found")}</Alert>
          </Stack>
        ) : (
          <ToggleButtonGroup
            orientation="vertical"
            value={taxIndex}
            exclusive
            onChange={handleChange}
            sx={{ width: "100%" }}
          >
            {state.taxInformations?.map((value, index) => (
              <ToggleButtonStyle
                sx={{
                  textTransform: "capitalize",
                  backgroundColor: "signingWFBackground.main",
                }}
                value={index}
                aria-label="list"
                key={index}
                // onDoubleClick={(e) => {
                //   e.preventDefault();
                //   if (!isShowCertInfor[index]) {
                //     onDoubleClick(index);
                //   }
                // }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <Tooltip title={t("signing.tax_tooltip")} followCursor>
                    <Box height="60px" minWidth="60px" mx={2}>
                      <SvgIcon
                        component={TaxIcon}
                        inheritViewBox
                        sx={{
                          width: "100%",
                          height: "100%",
                          color: "signingtextBlue.main",
                          cursor: "pointer",
                          // mx: 2,
                        }}
                        onClick={() => handleShowTaxInfor(index)}
                      />
                    </Box>
                  </Tooltip>

                  <Box flexGrow={1} textAlign="left">
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ textTransform: "uppercase", color: "inherit" }}
                    >
                      {value.company_information.official_name}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "inherit" }}>
                      {t("signing.tax_code")}:{" "}
                      {value.company_information.tax_code}
                    </Typography>
                  </Box>
                </Stack>
                {isShowTaxInfor[index] && (
                  <ModalTaxInfor
                    open={isShowTaxInfor[index]}
                    onClose={() => handleCloseTaxInfor(index)}
                    data={value}
                  />
                )}
              </ToggleButtonStyle>
            ))}
          </ToggleButtonGroup>
        )}
      </Box>
    </Stack>
  );
};

SelectTaxCodeForCreate.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
};

export default SelectTaxCodeForCreate;
