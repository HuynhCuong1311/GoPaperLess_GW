import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const Step1 = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6">{t("modal.approve_1")}</Typography>
    </Box>
  );
};

Step1.propTypes = {};

export default Step1;
