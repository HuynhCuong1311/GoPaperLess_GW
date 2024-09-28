import CertButton from "@/components/CertButton/CertButton";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as CertNotFound } from "@/assets/images/svg/cert_not_found.svg";

const ToggleButtonStyle = styled(ToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    border: "2px solid #0f6dca !important",
  },
  "&:not(.Mui-selected)": {
    color: "#111", // tắt chức năng làm mờ của Mui
  },
  marginBottom: "4px",
  border: "1px solid gray !important",
  borderRadius: "10px",
});

const SelectCertificate = ({ state, dispatch }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("certs");
  const [certIndex, setCertIndex] = useState(0);

  useEffect(() => {
    if (value === "new") {
      dispatch({
        type: "SET_CERT_SELECTED",
        payload: null,
      });
      dispatch({ type: "SET_DISABLED", payload: false });
    } else {
      if (!state.data.certSelected || state.certList.length === 0) {
        dispatch({ type: "SET_DISABLED", payload: true });
      } else {
        dispatch({ type: "SET_DISABLED", payload: false });
      }
    }
  }, [value, state.data.certSelected, state.certList, dispatch]);

  const handleChangeRadio = (event) => {
    setValue(event.target.value);
  };

  const handleChangeButton = (event, nextView) => {
    setCertIndex(nextView);
    // dispatch({
    //   type: "SET_CERT_SELECTED",
    //   payload: state.filterCertList[nextView],
    // });
  };

  useEffect(() => {
    dispatch({
      type: "SET_CERT_SELECTED",
      payload: state.filterCertList[certIndex],
    });
  }, [certIndex, dispatch, state.filterCertList, state.data.assurance]);

  return (
    <Box>
      <Typography
        style={{
          color: "textBold.main",
          fontSize: "14px",
          fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
        }}
      >
        {t("modal.subtitle1")}
      </Typography>

      <FormControl fullWidth>
        {/* <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel> */}
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChangeRadio}
        >
          <FormControlLabel
            value="certs"
            control={<Radio />}
            label={t("electronic.step121")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "bold !important",
                fontSize: "14px",
              },
              color: "#2978EB",
            }}
          />
          {state.filterCertList.length === 0 ? (
            <Box sx={{ textAlign: "center", p: "24px 0" }}>
              <CertNotFound />
              <Typography
                sx={{
                  mt: "8px",
                  color: "#6B7280",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                {t("signing.no_cert_found")}{" "}
              </Typography>
            </Box>
          ) : (
            <Box
              component="div"
              id="transition1-modal-description"
              sx={{
                overflowY: "auto",
                maxHeight: 352,
                opacity: value !== "certs" ? 0.5 : 1,
                pointerEvents: value !== "certs" ? "none" : "auto",
              }}
              disabled={value !== "certs"}
            >
              <div
                className="btn-group-vertical w-100"
                role="group"
                aria-label="Vertical radio toggle button group"
              >
                <ToggleButtonGroup
                  orientation="vertical"
                  value={certIndex}
                  exclusive
                  onChange={handleChangeButton}
                  sx={{ width: "100%" }}
                >
                  {state.filterCertList.map((item, index) => (
                    <ToggleButtonStyle
                      sx={{
                        textTransform: "capitalize",
                        backgroundColor: "signingWFBackground.main",
                      }}
                      value={index}
                      aria-label="list"
                      key={index}
                    >
                      <CertButton
                        certdata={{
                          ...item,
                          assurance: state.data.assurance,
                          provider: state.data.provider,
                          index,
                        }}
                      />
                    </ToggleButtonStyle>
                  ))}
                </ToggleButtonGroup>
              </div>
            </Box>
          )}

          <FormControlLabel
            value="new"
            control={<Radio />}
            label={t("electronic.step122")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "bold !important",
                fontSize: "14px",
              },
              color: "#2978EB",
              //   display: state.data.provider === "ISS" ? "none" : "block",
            }}
            disabled={state.data.provider === "USB_TOKEN_SIGNING"}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

SelectCertificate.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
};

export default SelectCertificate;
