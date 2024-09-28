import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import PropTypes from "prop-types";
import { useRef } from "react";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SignatureCanvas from "react-signature-canvas";

export const DialogDraw = ({ open, handleClose, name, control }) => {
  const {
    field: { onChange },
  } = useController({ name, control });
  const sigCanvasRef = useRef(null);

  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogContent dividers={scroll === "paper"}>
        <DialogContentText
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{ border: "1px solid #ccc" }}
        >
          <SignatureCanvas
            name={name}
            canvasProps={{
              //   height: "96",
              style: {
                backgroundColor: "white",
                marginLeft: "auto",
                marginRight: "auto",
                width: "100%",
              },
            }}
            ref={sigCanvasRef}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => sigCanvasRef.current.clear()}>
          {t("0-common.clear")}
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onChange(sigCanvasRef.current.getTrimmedCanvas().toDataURL());
            handleClose();
          }}
        >
          {t("0-common.apply")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogDraw.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  name: PropTypes.string,
  control: PropTypes.object,
  onClick: PropTypes.func,
  setErrorDraw: PropTypes.func,
};

export default DialogDraw;
