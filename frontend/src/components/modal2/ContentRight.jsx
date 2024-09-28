import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const ContentRight = ({ direction, watch, subtitle, type }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        width: direction ? "50%" : "0",
        // fontSize: "12px",
        textAlign:
          watch("alignment") === "auto" || watch("alignment") === "left"
            ? "left"
            : "right",
        // textTransform: "capitalize",
        color: "black",
        // fontWeight: "bold",
        wordBreak: "break-word",
      }}
    >
      <Typography
        fontSize={type == "reviewSignature" ? "32%" : 12}
        fontWeight="bold"
      >
        {watch("name")
          ? (watch("label") ? t("modal.content1") + ": " : "") +
            subtitle.nameText
          : ""}
      </Typography>
      <Typography
        fontSize={type == "reviewSignature" ? "32%" : 12}
        fontWeight="bold"
      >
        {watch("dn") && subtitle.dnText
          ? (watch("label") ? "DN: " : "") + subtitle.dnText
          : ""}
      </Typography>
      <Typography
        fontSize={type == "reviewSignature" ? "32%" : 12}
        fontWeight="bold"
      >
        {watch("reason")
          ? (watch("label") ? t("0-common.Reason") + ": " : "") +
            subtitle.reasonText
          : ""}
      </Typography>
      <Typography
        fontSize={type == "reviewSignature" ? "32%" : 12}
        fontWeight="bold"
      >
        {watch("location")
          ? (watch("label") ? t("0-common.Location") + ": " : "") +
            subtitle.locationText
          : ""}
      </Typography>
      <Typography
        fontSize={type == "reviewSignature" ? "32%" : 12}
        fontWeight="bold"
      >
        {watch("date")
          ? (watch("label") ? t("0-common.date") + ": " : "") +
            subtitle.dateText
          : ""}
      </Typography>
      <Typography
        fontSize={type == "reviewSignature" ? "32%" : 12}
        fontWeight="bold"
      >
        {watch("itver")
          ? (watch("label") ? t("0-common.itext version") + ": " : "") +
            subtitle.itverText
          : ""}
      </Typography>
    </Box>
  );
};

ContentRight.propTypes = {
  subtitle: PropTypes.object,
  direction: PropTypes.bool,
  watch: PropTypes.func,
  type: PropTypes.string,
};

export default ContentRight;
