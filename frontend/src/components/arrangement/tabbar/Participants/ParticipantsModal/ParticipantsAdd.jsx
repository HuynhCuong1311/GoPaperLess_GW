/* eslint-disable react/prop-types */
import { ReactComponent as Signer } from "@/assets/images/svg/person-edit.svg";
import { ReactComponent as Reviewer } from "@/assets/images/svg/person-check.svg";
import { ReactComponent as Editor } from "@/assets/images/svg/note-edit-outline.svg";
// import { ReactComponent as MeetingHost } from "@/assets/images/svg/person-star.svg";
import { ReactComponent as SendACopy } from "@/assets/images/svg/cc-outline.svg";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { participantsService } from "@/services/participants_service";
import { toast } from "react-toastify";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  // color: theme.palette.text.secondary,
}));

const ParticipantsAdd = ({ open, title, handleClose, workFlow, data }) => {
  const { t } = useTranslation();

  // const [signerId, setSignerId] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [reason, setReason] = useState("");
  // const [position, setPosition] = useState("");
  // const [purpose, setPurpose] = useState("");
  // const [subdivision, setSubdivision] = useState("");
  const queryClient = useQueryClient();
  const [participant, setParticipant] = useState({
    signerId: "",
    firstName: "",
    lastName: "",
    email: "",
    reason: "",
    position: "",
    purpose: "signer",
    structural_subdivision: "",
  });

  const [errors, setErrors] = useState({
    [t("arrangement.participant2")]: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  useEffect(() => {
    const { signerId, firstName, lastName, email } = participant;
    const noErrors =
      !errors.signerId &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.email;
    const allFieldsFilled = signerId && firstName && lastName && email;
    setIsSaveEnabled(noErrors && allFieldsFilled);
  }, [participant, errors]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const validateField = (name, value) => {
    let errorMessage = "";
    if (!value) {
      errorMessage = `${capitalizeFirstLetter(name)} ${t(
        "arrangement.participant1"
      )}`;
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      errorMessage = `${t("arrangement.participant2")}`;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleChange = (event, key) => {
    const value = event.target.value;
    validateField(key, value);
    setParticipant((prevParticipant) => ({ ...prevParticipant, [key]: value }));
  };

  // const handleChange = (event, key) => {
  //   switch (key) {
  //     case "signerId":
  //       setParticipant({ ...participant, signerId: event.target.value });
  //       break;
  //     case "firstName":
  //       setParticipant({ ...participant, firstName: event.target.value });
  //       break;
  //     case "lastName":
  //       setParticipant({ ...participant, lastName: event.target.value });
  //       break;
  //     case "email":
  //       setParticipant({ ...participant, email: event.target.value });
  //       break;
  //     case "reason":
  //       setParticipant({ ...participant, reason: event.target.value });
  //       break;
  //     case "position":
  //       setParticipant({ ...participant, position: event.target.value });
  //       break;
  //     case "purpose":
  //       setParticipant({ ...participant, purpose: event.target.value });
  //       break;
  //     case "structural_subdivision":
  //       setParticipant({
  //         ...participant,
  //         structural_subdivision: event.target.value,
  //       });
  //       break;
  //   }
  // };
  // console.log("participant: ", participant);

  const createParticipant = async (participant, workFlow) => {
    // Kiểm tra xem workFlow có thuộc tính 'participants' không
    // eslint-disable-next-line react/prop-types
    if (!workFlow || !workFlow.participants) {
      console.error("Invalid workflow data: missing 'participants' property");
      // toast.error("Invalid workflow data");
      handleClose();
      return;
    }

    // Khởi tạo một đối tượng để lưu trữ các địa chỉ email đã xuất hiện
    // const emailSet = new Set();
    let hasDuplicate = false;

    try {
      // Kiểm tra email mà bạn nhập vào
      const newParticipantEmail = participant.email;
      for (const user of workFlow.participants) {
        const userEmail = user.email;

        // So sánh địa chỉ email mới với từng địa chỉ email trong mảng participants
        if (userEmail === newParticipantEmail) {
          toast.error("Duplicate email found");
          hasDuplicate = true;
          handleClose();
          return;
        }
      }

      // Nếu không có địa chỉ email trùng lặp, gọi hàm createParticipant
      if (!hasDuplicate) {
        const response = await participantsService.createParticipant(
          participant,
          workFlow
        );
        queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
        if (response.status === 200) {
          toast.success(t("Add participants successfully"));
        }
      }
    } catch (error) {
      console.error("Lỗi khi gọi API addParticipant:", error);
      // toast.error(error.message);
      toast.error("Add participants error");
      // Xử lý lỗi tại đây nếu cần
    }
    handleClose();
  };

  // const [selectedValue, setSelectedValue] = useState(data || "Select"); // Khởi tạo giá trị mặc định

  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value); // Cập nhật giá trị khi chọn
  //   // Xử lý thêm các thao tác khác nếu cần
  // };
  // const [levels, setLevels] = useState(workFlow.signatureLevels || 2);
  //   console.log("levels: ", levels);
  //   console.log("dateTimeString: ", dateTimeString);

  //   useEffect(() => {
  //     setLevels(workFlow.signatureLevels);
  //   }, [workFlow.signatureLevels]); // Đối số thứ hai là mảng dependency

  //   const queryClient = useQueryClient();

  //   const updateDocumentsSetting = async () => {
  //     console.log("workFlow: ", workFlow);
  //     console.log("levels: ", levels);

  //     try {
  //       const response = await documentsService.updateDocumentsSetting(
  //         workFlow,
  //         levels,
  //         dateTimeString
  //       );
  //       queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
  //       toast.success(t("Update documents setting successfull"));
  //       handleClose();
  //     } catch (error) {
  //       console.error("Lỗi khi gọi API updateDocumentsSetting:", error);
  //       toast.error("Update documents setting error");
  //     }
  //   };
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
          width: "460px",
          maxWidth: "460px", // Set your width here
          //   height: "243px",
          height: "720px",
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
        <Box
          sx={{
            paddingTop: "10px",
            paddingBottom: errors.signerId ? "10px" : 0,
          }}
        >
          <Typography variant="h6" mb="10px" fontWeight={600}>
            {t("0-common.signer_id")}
          </Typography>

          <TextField
            fullWidth
            value={participant.signerId}
            // onChange={handleChange(setSignerId)}
            onChange={(event) => handleChange(event, "signerId")}
            error={!!errors.signerId}
            helperText={errors.signerId}
            InputLabelProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
            inputProps={{
              sx: {
                py: "11px",
                backgroundColor: "signingWFBackground.main",
              },
            }}
            sx={{
              my: 0,
              height: "45px",
              "& .MuiFormHelperText-root": {
                marginLeft: "0px",
              },
              "& .MuiInputBase-root": {
                height: "45px",
              },
            }}
          />
        </Box>
        <Box
          sx={{
            paddingTop: "10px",
            paddingBottom: errors.firstName ? "10px" : 0,
          }}
        >
          <Typography variant="h6" mb="10px" fontWeight={600}>
            {t("0-common.first name")}
          </Typography>

          <TextField
            fullWidth
            value={participant.firstName}
            onChange={(event) => handleChange(event, "firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName}
            InputLabelProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            inputProps={{
              sx: {
                py: "11px",
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            sx={{
              my: 0,
              height: "45px",
              "& .MuiFormHelperText-root": {
                marginLeft: "0px",
              },
              "& .MuiInputBase-root": {
                height: "45px",
              },
            }}
          />
        </Box>
        <Box
          sx={{
            paddingTop: "10px",
            paddingBottom: errors.lastName ? "10px" : 0,
          }}
        >
          <Typography variant="h6" mb="10px" fontWeight={600}>
            {t("0-common.last name")}
          </Typography>

          <TextField
            fullWidth
            value={participant.lastName}
            onChange={(event) => handleChange(event, "lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName}
            InputLabelProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            inputProps={{
              sx: {
                py: "11px",
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            sx={{
              my: 0,
              height: "45px",
              "& .MuiFormHelperText-root": {
                marginLeft: "0px",
              },
              "& .MuiInputBase-root": {
                height: "45px",
              },
            }}
          />
        </Box>
        <Box
          sx={{ paddingTop: "10px", paddingBottom: errors.email ? "10px" : 0 }}
        >
          <Typography variant="h6" mb="10px" fontWeight={600}>
            {t("0-common.email")}
          </Typography>

          <TextField
            fullWidth
            value={participant.email}
            onChange={(event) => handleChange(event, "email")}
            error={!!errors.email}
            helperText={errors.email}
            InputLabelProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            inputProps={{
              sx: {
                py: "11px",
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            sx={{
              my: 0,
              height: "45px",
              "& .MuiFormHelperText-root": {
                marginLeft: "0px",
              },
              "& .MuiInputBase-root": {
                height: "45px",
              },
            }}
          />
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <Typography variant="h6" mb="10px" fontWeight={600}>
            {t("0-common.Reason")}
          </Typography>

          <TextField
            fullWidth
            value={participant.reason}
            onChange={(event) => handleChange(event, "reason")}
            InputLabelProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            inputProps={{
              sx: {
                py: "11px",
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            sx={{
              my: 0,
              height: "45px",
              "& .MuiFormHelperText-root": {
                marginLeft: "0px",
              },
              "& .MuiInputBase-root": {
                height: "45px",
              },
            }}
          />
        </Box>
        <Box mt="10px" sx={{ width: "100%" }}>
          <Grid
            container
            rowSpacing="10px"
            columnSpacing={{ xs: 4, sm: 5, md: 6 }}
            // p="10px"
          >
            <Grid item xs={6} pt={0}>
              <Item sx={{ p: 0 }} elevation={0}>
                <Box>
                  <Typography variant="h6" mb="10px" fontWeight={600}>
                    {t("0-common.Position")}
                  </Typography>

                  <TextField
                    fullWidth
                    value={participant.position}
                    onChange={(event) => handleChange(event, "position")}
                    InputLabelProps={{
                      sx: {
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    inputProps={{
                      sx: {
                        py: "11px",
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    sx={{
                      my: 0,
                      height: "45px",
                      "& .MuiFormHelperText-root": {
                        marginLeft: "0px",
                      },
                      "& .MuiInputBase-root": {
                        height: "45px",
                      },
                      "& .MuiInputBase-input": {
                        fontFamily: "Montserrat",
                      },
                    }}
                  />
                </Box>
              </Item>
            </Grid>
            <Grid item xs={6} pt={0}>
              <Item sx={{ p: 0 }} elevation={0}>
                <Box>
                  <Typography variant="h6" mb="10px" fontWeight={600}>
                    {t("0-common.purpose")}
                  </Typography>

                  <FormControl
                    fullWidth
                    disabled={workFlow.workflowProcessType === "individual"}
                  >
                    <Select
                      value={participant.purpose}
                      onChange={(event) => handleChange(event, "purpose")}
                      sx={{
                        backgroundColor: "signingWFBackground.main",
                        height: "45px",
                        "& .MuiSelect-select": {
                          minWidth: "80%",
                          width: "100%",
                        },
                      }}
                    >
                      <MenuItem value={"signer"}>
                        <Grid container alignItems={"center"}>
                          <div
                            style={{
                              display: "inline-block",
                              marginTop: "4px",
                            }}
                          >
                            <Signer style={{ width: "16px", height: "16px" }} />
                          </div>
                          <div style={{ display: "inline-block" }}>
                            <span
                              style={{
                                paddingLeft: "12px",
                                fontSize: "14px",
                              }}
                            >
                              {t("0-common.signer")}
                            </span>
                          </div>
                        </Grid>
                      </MenuItem>
                      <MenuItem value={"reviewer"}>
                        <Grid container alignItems={"center"}>
                          <div
                            style={{
                              display: "inline-block",
                              marginTop: "4px",
                            }}
                          >
                            <Reviewer
                              style={{ width: "16px", height: "16px" }}
                            />
                          </div>
                          <div style={{ display: "inline-block" }}>
                            <span
                              style={{
                                paddingLeft: "12px",
                                fontSize: "14px",
                              }}
                            >
                              {t("0-common.reviewer")}
                            </span>
                          </div>
                        </Grid>
                      </MenuItem>
                      <MenuItem value={"editor"}>
                        <Grid container alignItems={"center"}>
                          <div
                            style={{
                              display: "inline-block",
                              marginTop: "4px",
                            }}
                          >
                            <Editor
                              style={{
                                width: "16px",
                                height: "17px",
                              }}
                            />
                          </div>
                          <div style={{ display: "inline-block" }}>
                            <span
                              style={{
                                paddingLeft: "12px",
                                fontSize: "14px",
                              }}
                            >
                              {t("0-common.editor")}
                            </span>
                          </div>
                        </Grid>
                      </MenuItem>
                      {/* <MenuItem value={meeting_host}>
                    <MeetingHost
                      style={{ width: "16px", height: "16px" }}
                    />
                    <span
                      style={{
                        paddingLeft: "12px",
                        fontSize: "14px",
                      }}
                    >
                      {t("0-common.meeting host")}
                    </span>
                  </MenuItem> */}
                      <MenuItem value={"send_a_copy"}>
                        <Grid container alignItems={"center"}>
                          <div
                            style={{
                              display: "inline-block",
                              marginTop: "4px",
                            }}
                          >
                            <SendACopy
                              style={{ width: "16px", height: "16px" }}
                            />
                          </div>
                          <div style={{ display: "inline-block" }}>
                            <span
                              style={{
                                paddingLeft: "12px",
                                fontSize: "14px",
                              }}
                            >
                              {t("0-common.send a copy")}
                            </span>
                          </div>
                        </Grid>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <Typography variant="h6" mb="10px" fontWeight={600}>
            {t("0-common.Structural subdivision")}
          </Typography>

          <TextField
            fullWidth
            value={participant.structural_subdivision}
            onChange={(event) => handleChange(event, "structural_subdivision")}
            InputLabelProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            inputProps={{
              sx: {
                py: "11px",
                backgroundColor: "signingWFBackground.main",
                fontFamily: "Montserrat",
              },
            }}
            sx={{
              my: 0,
              height: "45px",
              "& .MuiFormHelperText-root": {
                marginLeft: "0px",
              },
              "& .MuiInputBase-root": {
                height: "45px",
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          padding: "10px",
          px: "24px",
          backgroundColor: "var(--Gray-50, #F9FAFB)",
          borderTop: "1px solid var(--Gray-200, #E5E7EB)",
          paddingRight: "10px",
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
            margin: "4px 9px 4px 0px",
            marginLeft: "20px !important",
            fontWeight: 600,
          }}
          onClick={() => {
            createParticipant(participant, workFlow);
          }}
          type="button"
          disabled={!isSaveEnabled}
        >
          {t("0-common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ParticipantsAdd.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default ParticipantsAdd;
