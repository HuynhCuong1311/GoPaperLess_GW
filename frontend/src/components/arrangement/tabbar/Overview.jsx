import { ReactComponent as OverviewIcon } from "@/assets/images/svg/overview.svg";
import { useCommonHook } from "@/hook";
import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { convertTime } from "@/utils/commonFunction";
import Alert from "@mui/material/Alert";
import { checkTimeIsBeforeNow } from "@/utils/commonFunction";

export const OverView = ({ workFlow, qrSigning }) => {
  // console.log("workFlow: ", workFlow);
  const { t } = useTranslation();
  const { signingToken } = useCommonHook();

  // console.log("OverView workFlow", workFlow?.signingToken);

  const { data: headerFooter } = useQuery({
    queryKey: ["checkHeader"],
    queryFn: () => apiService.checkHeaderFooter(signingToken || qrSigning), //code a Cường
    // queryFn: () => apiService.checkHeaderFooter(workFlow?.signingToken),
    enabled: signingToken !== undefined || qrSigning !== undefined, //chỉ gọi api khi có giá trị id // Code a Cường
    // enabled: workFlow?.signingToken !== undefined, //chỉ gọi api khi có giá trị id
  });
  // console.log("headerFooter: ", headerFooter?.data);
  return (
    <Box>
      <Stack direction="row" sx={{ px: "20px", height: "50px" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <OverviewIcon />
          <Typography sx={{ fontWeight: "550" }} variant="h3">
            {t("0-common.overview")}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ color: "borderColor.main" }} />
      <Stack sx={{ px: 2, py: 1 }} spacing={1}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "borderColor.main",
            borderRadius: 2,
            p: "5px 15px",
          }}
        >
          <Typography sx={{ color: "signingtext2.main" }} variant="h6">
            {t("0-common.shared_by")}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{
                height: "32px",
                width: "32px",
                borderRadius: "50%",
                backgroundColor: "#E64DB0",
                color: "white",
              }}
            >
              {headerFooter?.data?.name?.charAt(0)}
            </Stack>
            <Stack justifyContent={"center"}>
              <Typography
                variant="h6"
                sx={{
                  color: "textBlack.main",
                }}
              >
                {headerFooter?.data?.name}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: "600" }}>
                {headerFooter?.data?.notificationEmail}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        {workFlow.deadlineAt && (
          <Box
            sx={{
              border: "1px solid",
              borderColor: "borderColor.main",
              borderRadius: 2,
              p: "5px 15px",
            }}
          >
            <Typography sx={{ color: "signingtext2.main" }} variant="h6">
              {t("0-common.deadline")}
            </Typography>
            <Typography variant="h6" sx={{ color: "textBlack.main" }}>
              {convertTime(workFlow.deadlineAt)}
            </Typography>
          </Box>
        )}
        {workFlow.deadlineAt && checkTimeIsBeforeNow(workFlow.deadlineAt) && (
          <Alert
            variant="outlined"
            severity="error"
            sx={{
              borderLeft: "6px solid #EB6A00",
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              background: "#F3F5F8",
              p: "10px 15px",
            }}
          >
            <Typography variant="h6" mb="8px">
              {t("signing.workflow_expỉred")}
            </Typography>
          </Alert>
        )}
      </Stack>
    </Box>
  );
};
OverView.propTypes = {
  workFlow: PropTypes.object,
  qrSigning: PropTypes.string,
};
export default OverView;
