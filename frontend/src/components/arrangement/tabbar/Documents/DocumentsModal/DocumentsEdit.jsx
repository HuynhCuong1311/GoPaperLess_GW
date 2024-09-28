/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
import { documentsService } from "@/services/documents_service";
import { participantsService } from "@/services/participants_service";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// const steps = [
//   {
//     label: "Qualified Electronic Signature (QES)",
//     description: `It has equivalent legal effect of a handwritten signature.`,
//   },
//   {
//     label: "All signature levels (QES, AES, SES)",
//     description:
//       "For documents without legal form requirement and with low liability risk. Document recipients can choose all levels, as low as simple electronic signature.",
//   },
// ];

const DocumentsEdit = ({
  open,
  title,
  handleClose,
  workFlow,
  dateTimeString,
  levels,
  setLevels,
}) => {
  const { t } = useTranslation();
  // const [levels, setLevels] = useState(workFlow.signatureLevels || 2);

  useEffect(() => {
    if (open) {
      setLevels(workFlow.signatureLevels);
    }
  }, [open, workFlow.signatureLevels]); // Đối số thứ hai là mảng dependency

  const queryClient = useQueryClient();

  const updateDocumentsSetting = async () => {
    try {
      const response = await documentsService.updateDocumentsSetting(
        workFlow,
        levels,
        dateTimeString
      );
      if (response.data === 1) {
        workFlow.participants.map(async (par) => {
          if (par.signerType === 1) {
            // console.log("par.signerType: ", par.signerType);
            const updateSigner = { ...par, purpose: par.signerType };
            updateSigner.metaInformation.signature_type_options =
              levels === 1
                ? ["QES", "QSEAL"]
                : ["NORMAL", "ESEAL", "QES", "QSEAL"];
            await participantsService.updateParticipant(updateSigner);
          }
        });
      }
      // setProcess(response.data);
      queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
      toast.success(t("Update documents setting successfull"), {
        style: { fontFamily: "Montserrat" },
      });
      handleClose();
      // if (!btnSave || (btnSave && lastIndex)) {
      //   toast.success(t("Update signature levels successfull"));
      // }
      // toast.success("Update participants successful."); // Display success notification
      // <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      //   Import successful.
      // </Alert>;
    } catch (error) {
      console.error("Lỗi khi gọi API updateDocumentsSetting:", error);
      toast.error("Update documents setting error", {
        style: { fontFamily: "Montserrat" },
      });
      // Xử lý lỗi tại đây nếu cần
    }
    // handleClose();
  };

  //   const handleReset = () => {
  //     setActiveStep(0);
  //   };

  // const [value, setValue] = useState(dayjs("2022-04-17T15:30"));
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      // sx={{
      //   "& .MuiDialog-container": {
      //     "> .MuiPaper-root": {
      //       width: "100%",
      //       height: "650px",
      //       maxWidth: "950px", // Set your width here
      //       borderRadius: "10px",
      //     },
      //   },
      // }}
      PaperProps={{
        sx: {
          width: "531px",
          maxWidth: "531px", // Set your width here
          //   height: "243px",
          height: "290px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{
          backgroundColor: "#FFF",
          paddingBottom: "0px",
          textAlign: "center",
          // display: "flex", // Sử dụng Flexbox
          // alignItems: "center", // Căn giữa theo chiều dọc
          // justifyContent: "space-between", // Căn phần tử con theo chiều ngang
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "20px",
            fontWeight: "bold",
            display: "inline-block",
            color: "#1F2937",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
            height: "31px",
          }}
        >
          {title}
        </Typography>
        {/* <CancleIcon /> */}
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "#FFF" }}>
        <Box sx={{ maxWidth: 400 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Checkbox checked={true} sx={{ opacity: levels === 1 ? 0.7 : 1 }} />
            <Box
              sx={{
                padding: "10px 0",
                borderBottom: "1px solid var(--Gray-200, #E5E7EB)",
              }}
            >
              <Typography
                sx={{
                  color: "#1F2937",
                  fontFamily: "Montserrat",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {t("arrangement.documentsSetting5")}
              </Typography>
              <Typography
                sx={{
                  color: "#6B7280",
                  fontFamily: "Montserrat",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {t("arrangement.documentsSetting6")}
              </Typography>
            </Box>
          </Box>
          <Divider
            orientation="vertical"
            sx={{
              height: "55px",
              width: "21px",
              borderRightWidth: "2px",
              margin: "-30px 1px -12px",
              borderColor: levels === 2 ? "#357EEB" : null,
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Checkbox
              checked={levels === 2}
              onChange={(e) => (e.target.checked ? setLevels(2) : setLevels(1))}
            />
            <Box sx={{ padding: "10px 0" }}>
              <Typography
                sx={{
                  color: "#1F2937",
                  fontFamily: "Montserrat",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {t("arrangement.documentsSetting7")}
              </Typography>
              <Typography
                sx={{
                  color: "#6B7280",
                  fontFamily: "Montserrat",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {t("arrangement.documentsSetting8")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: "24px",
          backgroundColor: "var(--Gray-50, #F9FAFB)",
          borderTop: "1px solid var(--Gray-200, #E5E7EB)",
          paddingRight: "9px",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            backgroundColor: "#FFF",
            border: "1px solid var(--Gray-200, #E5E7EB)",
            boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            color: "#1F2937",
            fontWeight: 600,
          }}
          onClick={handleClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "9px !important",
            fontWeight: 600,
          }}
          onClick={() => {
            updateDocumentsSetting();
          }}
          type="button"
        >
          {t("0-common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DocumentsEdit.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  //   data: PropTypes.array,
  handleClose: PropTypes.func,
  workFlow: PropTypes.object,
  dateTimeString: PropTypes.string,
  levels: PropTypes.number,
  setLevels: PropTypes.func,
};

export default DocumentsEdit;
