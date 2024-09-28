import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ChildModal from "./ChildModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export const NestModal = ({ open, handleClose, title, data }) => {
  const { t } = useTranslation();
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 900 }}>
          <Box
            component="div"
            id="scroll-dialog-title"
            sx={{
              backgroundColor: "dialogBackground.main",
              paddingBottom: "0px",
            }}
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
          </Box>
          <IconButton
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
          </IconButton>

          <Box sx={{ backgroundColor: "dialogBackground.main" }}>
            <Box component="div" id="scroll-dialog-description">
              {/* {data} */}
              <ChildModal data={data} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
            <Button
              variant="outlined"
              sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
              onClick={handleClose}
            >
              {t("0-common.cancel")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

NestModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  data: PropTypes.array,
};

export default NestModal;
