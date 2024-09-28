import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Divider,
  IconButton,
  Tooltip,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PropTypes from "prop-types";

export const Details = ({ validFile, notSign }) => {
  const { t } = useTranslation();
  const { upload_token } = useParams();
  return (
    <Box>
      <Stack direction="row" sx={{ px: "20px", height: "50px" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <DescriptionOutlinedIcon />
          <Typography sx={{ fontWeight: "550" }} variant="h3">
            {t("validation.tab4")}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ color: "borderColor.main" }} />
      <Box sx={{ p: "10px 20px" }}>
        <Box sx={{ pb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {t("validation.reportId")}
          </Typography>
          <Typography variant="h5">
            {validFile?.validation_report_id}
          </Typography>
        </Box>
        <Box sx={{ pb: 2, overflowWrap: "break-word" }}>
          <Typography variant="h6" fontWeight="bold">
            {t("validation.documentHash")}
          </Typography>
          <Typography variant="h5">
            {validFile?.validated_document_hash}
          </Typography>
        </Box>
        {!notSign && (
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {t("validation.diadata")}
            </Typography>
            <a
              href={`${window.location.origin}/api/internalusage/validation/${upload_token}/download/diagnostic-data-xml`}
              style={{ color: "#211529", fontSize: "13px" }}
            >
              {t("validation.downloadDia")}
            </a>
          </Box>
        )}
      </Box>
      <Divider sx={{ color: "borderColor.main" }} />
      {!notSign && (
        <>
          <Box sx={{ p: "10px 20px" }}>
            <Typography variant="h6" fontWeight="bold">
              {t("validation.detailReport")}
            </Typography>
            <a
              href={`${window.location.origin}/api/internalusage/validation/${upload_token}/download/detailed-report-pdf`}
              style={{ color: "#211529", fontSize: "13px" }}
            >
              {t("validation.downloadDetail")}
            </a>
          </Box>
          <Divider sx={{ color: "borderColor.main" }} />
        </>
      )}

      <Box
        sx={{
          p: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {t("validation.liability")}
          </Typography>
          <Typography variant="h5">{t("validation.basicLiability")}</Typography>
        </Box>
        <Tooltip title={t("validation.tooltip")}>
          <IconButton>
            <InfoOutlinedIcon sx={{ fill: "#9E9C9C" }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ color: "borderColor.main" }} />
    </Box>
  );
};
Details.propTypes = {
  validFile: PropTypes.object,
  notSign: PropTypes.bool,
};
export default Details;
