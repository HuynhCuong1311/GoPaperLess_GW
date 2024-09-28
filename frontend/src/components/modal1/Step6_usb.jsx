/* eslint-disable no-unused-vars */
import CertButton from "@/components/CertButton/CertButton";
import styled from "@emotion/styled";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect } from "react";
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

export const Step6_usb = ({
  data,
  certSelected,
  setCertSelected,
  onDoubleClick,
  onDisableSubmit,
  assurance,
  provider,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (certSelected === null || data?.length === 0) {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
  }, [certSelected, onDisableSubmit, data]);

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
      <CertButton
        certdata={{
          ...value,
          assurance,
          provider,
          index,
          cert: value.value,
          issuer: value.issuer.commonName,
          subject: value.subject.commonName,
        }}
      />
    </ToggleButtonStyle>
  ));

  const handleChange = (event, nextView) => {
    setCertSelected(nextView);
  };

  return (
    <Stack sx={{ minWidth: 400 }} height="100%">
      <Typography variant="h6" sx={{ mb: "10px" }} color="textBold.main">
        {t("signingForm.title2")}
      </Typography>
      <Box width={"100%"} flexGrow={1}>
        {data?.length === 0 ? (
          <Stack direction="column" justifyContent="flex-end" height="100%">
            <Alert severity="error">{t("signing.no_cert_found")}</Alert>
          </Stack>
        ) : (
          <ToggleButtonGroup
            orientation="vertical"
            value={certSelected}
            exclusive
            onChange={handleChange}
            sx={{ width: "100%" }}
          >
            {content}
          </ToggleButtonGroup>
        )}
      </Box>
    </Stack>
  );
};

Step6_usb.propTypes = {
  data: PropTypes.array,
  setCertSelected: PropTypes.func,
  certSelected: PropTypes.number,
  onDoubleClick: PropTypes.func,
  onDisableSubmit: PropTypes.func,
  assurance: PropTypes.string,
  provider: PropTypes.string,
};
export default Step6_usb;
