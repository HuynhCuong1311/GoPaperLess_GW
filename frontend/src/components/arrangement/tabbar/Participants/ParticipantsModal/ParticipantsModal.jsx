/* eslint-disable react/prop-types */
import { participantsService } from "@/services/participants_service";
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
import ParticipantsTable from "./ParticipantsTable";
import { toast } from "react-toastify";

export const ParticipantsModal = ({
  open,
  data,
  title,
  handleClose,
  workFlow,
}) => {
  const descriptionElementRef = useRef(null);
  const queryClient = useQueryClient();
  const handleSubmitClick = () => {
    participant.map((value, index) => {
      updateParticipant(
        value,
        true,
        index === participant.length - 1 ? true : false
      );
    });
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
  const [participant, setParticipant] = useState([]);

  const updateParticipant = async (
    data,
    btnSave = false,
    lastIndex = false
  ) => {
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

    // console.log("open: ", open);

    try {
      const signer =
        data.purpose === 1
          ? {
              ...data,
              metaInformation: {
                ...data.metaInformation,
                signature_type_options:
                  workFlow.signatureLevels === 2
                    ? ["NORMAL", "ESEAL", "QES", "QSEAL"]
                    : ["QES", "QSEAL"],
              },
            }
          : {
              ...data,
              metaInformation: {
                ...data.metaInformation,
                signature_type_options: [],
              },
            };
      // console.log("data: ", signer);
      await participantsService.updateParticipant(signer);
      // setProcess(response.data);
      queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
      if (!btnSave || (btnSave && lastIndex)) {
        toast.success(t("Update participants successfully"), {
          style: { fontFamily: "Montserrat" },
        });
      }
      // toast.success("Update participants successful."); // Display success notification
      // <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      //   Import successful.
      // </Alert>;
    } catch (error) {
      console.error("Lỗi khi gọi API updateParticipant:", error);
      toast.error("Update participants error", {
        style: { fontFamily: "Montserrat" },
      });
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
          <ParticipantsTable
            workFlow={workFlow}
            data={data}
            handleClose={handleClose}
            setParticipant={setParticipant}
            updateParticipant={updateParticipant}
            participant={participant}
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
            "& .MuiButtonBase-root": {
              height: "36.49px",
            },
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

ParticipantsModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default ParticipantsModal;
