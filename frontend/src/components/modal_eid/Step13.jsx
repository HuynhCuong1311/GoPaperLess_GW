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

export const Step13 = ({
  data,
  certSelected,
  setCertSelected,
  // onDoubleClick,
  onDisableSubmit,
  assurance,
  provider,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("certs");

  const handleChangeRadio = (event) => {
    setValue(event.target.value);
  };

  const handleChangeButton = (event, nextView) => {
    setCertSelected(nextView);
  };
  useEffect(() => {
    if (value === "new") {
      onDisableSubmit(false);
    } else {
      if (certSelected === null || data.length === 0) {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
    }
  }, [value, certSelected, onDisableSubmit]);

  const content = data?.map((value, index) => (
    <ToggleButtonStyle
      sx={{
        textTransform: "capitalize",
        backgroundColor: "signingWFBackground.main",
      }}
      value={index}
      aria-label="list"
      key={index}
      // onDoubleClick={(e) => {
      //   if (certSelected === null) return;
      //   e.preventDefault();
      //   if (!isShowCertInfor[index]) {
      //     onDoubleClick(index);
      //   }
      // }}
    >
      <CertButton certdata={{ ...value, assurance, provider, index }} />
    </ToggleButtonStyle>
  ));

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
          {data.length === 0 ? (
            <Typography
              sx={{
                color: "#991B1B",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {t("signing.no_cert_found")}{" "}
            </Typography>
          ) : (
            <Box
              component="div"
              id="transition1-modal-description"
              sx={{
                overflowY: "auto",
                maxHeight: 300,
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
                  value={certSelected}
                  exclusive
                  onChange={handleChangeButton}
                  sx={{ width: "100%" }}
                >
                  {content}
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
              display: provider === "ISS" ? "none" : "block",
            }}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

Step13.propTypes = {
  data: PropTypes.array,
  setCertSelected: PropTypes.func,
  certSelected: PropTypes.number,
  onDoubleClick: PropTypes.func,
  onDisableSubmit: PropTypes.func,
  assurance: PropTypes.string,
  setCertificate: PropTypes.func,
  provider: PropTypes.string,
};

export default Step13;
