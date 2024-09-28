import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import "cropperjs/dist/cropper.css";
import PropTypes from "prop-types";
import { useRef } from "react";
import Cropper from "react-cropper";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const DialogFile = ({ open, handleClose, name, control, data }) => {
  const {
    field: { onChange },
    // fieldState: { error },
  } = useController({ name, control });

  const { t } = useTranslation();

  const imgCropSectionRef = useRef(null);

  const keepOriginal = () => {
    onChange(data);
    handleClose();
  };

  const getCropData = () => {
    if (typeof imgCropSectionRef.current?.cropper !== "undefined") {
      onChange(
        imgCropSectionRef.current?.cropper.getCroppedCanvas().toDataURL()
      );
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      {/* <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle> */}
      <DialogContent dividers={scroll === "paper"} sx={{ p: "15px 20px 0" }}>
        <DialogContentText
          component={"div"}
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{ border: "1px solid #ccc" }}
        >
          <Box name={name} sx={{ width: "100%" }}>
            <Cropper
              // src={data}
              // aspectRatio={413 / 136}
              // guides={false}
              // ref={imgCropSectionRef}

              style={{ height: 400, width: "100%" }}
              initialAspectRatio={1}
              preview=".img-preview"
              src={data}
              ref={imgCropSectionRef}
              viewMode={1}
              guides={true}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              checkOrientation={false}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button variant="outlined" onClick={keepOriginal}>
          {t("modal.upload1")}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            getCropData();
          }}
          sx={{
            // borderRadius: "10px",
            // borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
        >
          {t("modal.upload2")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogFile.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  name: PropTypes.string,
  control: PropTypes.object,
  onClick: PropTypes.func,
  setErrorDraw: PropTypes.func,
  data: PropTypes.string,
};

export default DialogFile;
