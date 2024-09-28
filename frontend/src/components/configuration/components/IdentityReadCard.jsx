import checkid from "@/assets/images/checkid.png";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export const IdentityReadCard = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "textBold.main" }}>
        {/* Read the document chip */}
        {t("electronic.step31")}
      </Typography>
      <Typography variant="h6" my="15px" color="textBold.main">
        {/* Insert/place the document on the card reader. */}
        {t("electronic.step32")}
      </Typography>

      <Box
        style={{ textAlign: "center" }}
        width="254px"
        height="242px"
        marginX="auto"
      >
        <img
          src={checkid}
          width="100%"
          height="100%"
          style={{ borderRadius: "50%" }}
          alt="chip"
        />
      </Box>
    </Box>
  );
};

IdentityReadCard.propTypes = {};

export default IdentityReadCard;
