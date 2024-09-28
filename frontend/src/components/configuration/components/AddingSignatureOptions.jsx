import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const AddingSignatureOptions = ({ data, direction }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        width: direction ? "50%" : "0",
        textAlign:
          data.signatureOptions.alignment === "auto" ||
          data.signatureOptions.alignment === "left"
            ? "left"
            : "right",
        // textTransform: "capitalize",
        color: "black",
        // fontWeight: "bold",
        wordBreak: "break-word",
      }}
    >
      <Typography fontWeight="bold" fontSize="inherit">
        {data.signatureOptions.name
          ? (data.signatureOptions.label ? t("modal.content1") + ": " : "") +
            data.nameValue
          : ""}
      </Typography>
      <Typography fontWeight="bold" fontSize="inherit">
        {data.signatureOptions.dn && data.dnValue
          ? (data.signatureOptions.label ? "DN: " : "") + data.dnValue
          : ""}
      </Typography>
      <Typography fontWeight="bold" fontSize="inherit">
        {data.signatureOptions.reason
          ? (data.signatureOptions.label ? t("0-common.Reason") + ": " : "") +
            data.reasonValue
          : ""}
      </Typography>
      <Typography fontWeight="bold" fontSize="inherit">
        {data.signatureOptions.location
          ? (data.signatureOptions.label ? t("0-common.Location") + ": " : "") +
            data.locationValue
          : ""}
      </Typography>
      <Typography fontWeight="bold" fontSize="inherit">
        {data.signatureOptions.date
          ? (data.signatureOptions.label ? t("0-common.date") + ": " : "") +
            data.dateValue
          : ""}
      </Typography>
      <Typography fontWeight="bold" fontSize="inherit">
        {data.signatureOptions.itver
          ? (data.signatureOptions.label
              ? t("0-common.itext version") + ": "
              : "") + data.itverValue
          : ""}
      </Typography>
    </Box>
  );
};

AddingSignatureOptions.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
  direction: PropTypes.bool,
};

export default AddingSignatureOptions;
