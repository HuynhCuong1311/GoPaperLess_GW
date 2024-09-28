/* eslint-disable react/prop-types */
import { documentsService } from "@/services/documents_service";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import DocumentsTable from "./DocumentsTable";

export const DocumentsModal = ({
  open,
  data,
  title,
  handleClose,
  workFlow,
}) => {
  const descriptionElementRef = useRef(null);
  const queryClient = useQueryClient();
  const handleSubmitClick = () => {
    updateDocumentsSetting(dateTimeString);
    handleClose();
  };

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  const [dateTimeString, setDateTimeString] = useState("");

  const updateDocumentsSetting = async (newValue) => {
    // const data = {
    //   fullName,
    //   firstName,
    //   lastName,
    //   customReason,
    //   position,
    //   signingPurpose,
    //   structuralSubdivision,
    //   metaInformation,
    //   signerToken: row.signerToken,
    // };

    try {
      const response = await documentsService.updateDocumentsSetting(
        workFlow,
        workFlow.signatureLevels,
        dateTimeString
      );

      // setProcess(response.data);
      queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
      toast.success(t("Update documents setting successfully"));
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
      toast.error("Update documents setting error");
      // Xử lý lỗi tại đây nếu cần
    }
    // handleClose();
  };
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
          width: "950px",
          maxWidth: "950px", // Set your width here
          height: "650px",
          borderRadius: "10px",
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
            height: "31px",
          }}
        >
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "dialogBackground.main" }}>
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <DocumentsTable
            workFlow={workFlow}
            data={data}
            handleClose={handleClose}
            setDateTimeString={setDateTimeString}
            updateDocumentsSetting={updateDocumentsSetting}
            dateTimeString={dateTimeString}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          px: "24px",
          backgroundColor: "#F9FAFB",
          borderTop: "1px solid var(--Gray-200, #E5E7EB)",
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
            marginLeft: "20px !important",
            margin: "16px 0px",
            fontWeight: 600,
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DocumentsModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default DocumentsModal;
