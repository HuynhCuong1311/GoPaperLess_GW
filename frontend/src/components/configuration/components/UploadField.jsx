import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadField = ({ setFileUpload, handleUploadFile }) => {
  const { t } = useTranslation();
  const handleUploadImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFileUpload(reader.result);
      handleUploadFile();
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <Button
      component="label"
      startIcon={<CloudUploadIcon />}
      //   sx={{
      //     marginBottom: "0.5rem",
      //     marginTop: "1rem",
      //     fontWeight: "medium",
      //   }}
      variant="outlined"
      sx={{ border: "2px solid #357EEB", height: "45px" }}
    >
      {t("0-common.upload")}
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        onChange={handleUploadImage}
      />
    </Button>
  );
};

UploadField.propTypes = {
  setFileUpload: PropTypes.func,
  handleUploadFile: PropTypes.func,
};

export default UploadField;
