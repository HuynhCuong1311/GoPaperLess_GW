import { ReactComponent as OverviewIcon } from "@/assets/images/svg/overview.svg";
import { convertTime } from "@/utils/commonFunction";

import { CheckCircleOutline, Error } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Alert, Box, Divider, Stack, Tooltip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const Overview = ({ validFile }) => {
  const { t } = useTranslation();
  const statusToIcon = {
    // Valid: <CheckCircleIcon sx={{ fontSize: "1.5rem", color: "#228B22" }} />,
    2: (
      <Error sx={{ color: "rgb(235, 106, 0)", fontSize: "18px", mt: "1px" }} />
    ),
    0: (
      <Error sx={{ color: "rgb(216, 81, 63)", fontSize: "18px", mt: "1px" }} />
    ),
    // Thêm các ánh xạ khác nếu cần
  };
  return (
    <Box>
      <Stack direction="row" sx={{ px: "20px", height: "50px" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <OverviewIcon />
          <Typography sx={{ fontWeight: "550" }} variant="h3">
            {t("validation.tab1")}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ color: "borderColor.main" }} />
      <Box sx={{ padding: "8px 16px" }}>
        <Box
          sx={{
            display: "block",
            overflow: "hidden",
            padding: "12px 12px 12px 12px",
            borderRadius: "12px",
            alignItems: "center",
            background: "rgb(232, 235, 240)",
          }}
        >
          {validFile?.total_signatures === 0 && validFile?.total_seals === 0 ? (
            <Stack direction="row" alignItems="center" gap="10px">
              <CheckCircleOutline
                sx={{ fontSize: "1.5rem", color: "#9E9C9C" }}
              />
              <Typography variant="h5">
                {t("validation.overviewNotFound")}
              </Typography>
            </Stack>
          ) : (
            <Box sx={{ display: "flex", gap: "10px" }}>
              {statusToIcon[validFile?.status_code] || (
                <CheckCircleIcon
                  sx={{ fontSize: "1.5rem", color: "#228B22" }}
                />
              )}
              {/* {validFile.valid && ( */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <Typography variant="h6" sx={{ fontWeight: "700" }}>
                  {validFile?.status}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <PeopleOutlinedIcon
                    fontSize="small"
                    sx={{ fill: "#9E9C9C" }}
                  />
                  <Typography variant="h5">
                    {validFile?.total_valid_signatures} /{" "}
                    {validFile?.total_signatures} {t("validation.overview1")}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <WorkspacePremiumIcon
                    fontSize="small"
                    sx={{ fill: "#9E9C9C" }}
                  />
                  <Typography variant="h5">
                    {validFile?.total_valid_seal} / {validFile?.total_seals}{" "}
                    {t("validation.overview2")}
                  </Typography>
                </Box>
              </Box>
              {/* )} */}
            </Box>
          )}
        </Box>
      </Box>
      <Divider sx={{ color: "borderColor.main" }} />
      <Box sx={{ p: "8px 16px" }}>
        <Typography variant="h6" fontWeight="bold">
          {t("validation.overview3")}
        </Typography>
        <Typography variant="h5" sx={{ pb: 2 }}>
          {convertTime(validFile?.validation_time)}
        </Typography>
        <Alert
          severity="error"
          icon={<InfoOutlinedIcon sx={{ fill: "#9E9C9C" }} />}
          sx={{
            background: "rgb(232, 235, 240)",
            borderRadius: "12px",
            padding: "12px 12px 12px 12px",
          }}
        >
          <Typography variant="h5">{t("validation.overview4")}</Typography>
        </Alert>
      </Box>
      <Divider sx={{ color: "borderColor.main" }} />
      <Box sx={{ p: "8px 16px" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ marginBottom: "16px" }}
        >
          {t("validation.overview5")}
        </Typography>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Typography variant="h5">{t("validation.overview6")}</Typography>
          <Tooltip title={t("validation.tooltip")}>
            <InfoOutlinedIcon sx={{ fill: "#9E9C9C", cursor: "pointer" }} />
          </Tooltip>
        </Box>
      </Box>
      <Divider sx={{ color: "borderColor.main" }} />
    </Box>
  );
};
Overview.propTypes = {
  validFile: PropTypes.object,
};
export default Overview;
