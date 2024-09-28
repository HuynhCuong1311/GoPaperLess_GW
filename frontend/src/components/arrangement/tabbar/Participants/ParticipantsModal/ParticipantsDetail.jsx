import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

export const ParticipantsDetail = ({ open, data, title, handleClose }) => {
  const { t } = useTranslation();
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      sx={{
        "& .MuiDialog-container": {
          "> .MuiPaper-root": {
            width: "500%",
            maxWidth: "500px", // Set your width here
            height: "700px",
            borderRadius: "10px",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{ backgroundColor: "dialogBackground.main", paddingBottom: "0px" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            display: "inline-block",
            color: "signingtextBlue.main",
            borderBottom: "4px solid",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      {/* <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton> */}
      {/* <Box sx={{ px: "24px" }}>
        <Divider />
      </Box> */}
      <DialogContent sx={{ backgroundColor: "dialogBackground.main" }}>
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Box width={"100%"} sx={{ paddingTop: "10px" }}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ paddingBottom: "10px" }}
            >
              {t("0-common.signer")}
            </Typography>
            <Box
              p={1}
              color={"signingtext1.main"}
              bgcolor={"#E8EBF0"}
              borderRadius={2}
              mb="15px"
              fontSize={"14px"}
            >
              {data.lastName} {data.firstName}
            </Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ paddingBottom: "10px" }}
            >
              {t("0-common.name")}
            </Typography>
            <Box
              p={1}
              color={"signingtext1.main"}
              bgcolor={"#E8EBF0"}
              borderRadius={2}
              mb="15px"
              fontSize={"14px"}
            >
              {data.firstName}
            </Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ paddingBottom: "10px" }}
            >
              {t("0-common.email")}
            </Typography>
            <Box
              p={1}
              color={"signingtext1.main"}
              bgcolor={"#E8EBF0"}
              borderRadius={2}
              mb={1}
              fontSize={"14px"}
            >
              {data.email}
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: "24px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleClose}
        >
          {t("0-common.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
ParticipantsDetail.propTypes = {
  data: PropTypes.object,
  open: PropTypes.bool,
  title: PropTypes.string,
  handleClose: PropTypes.func,
};
export default ParticipantsDetail;
