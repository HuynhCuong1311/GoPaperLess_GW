import { ReactComponent as EditorIcon } from "@/assets/images/svg/editor.svg";
import { ReactComponent as MeetingHost } from "@/assets/images/svg/person-star.svg";
import { ReactComponent as ReviewerIcon } from "@/assets/images/svg/reviewer.svg";
import { ReactComponent as SendCopyIcon } from "@/assets/images/svg/send_copy.svg";
import { ReactComponent as SignerIcon } from "@/assets/images/svg/signer.svg";
import { checkSignerWorkFlow } from "@/utils/commonFunction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SigningDetail } from "../SigningDetail";

export const ParticipantsInfo = ({
  participantsList,
  setSignerToken,
  signerToken,
  workflowStatus,
  workflowProcessType,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState([false]);

  const [expand, setExpand] = useState(true);

  const toggleDrawer = (index) => {
    const newIsOpen = [...isOpen];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };
  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expand}
      sx={{
        height: "calc(100% - 50px)",
        "> .MuiCollapse-vertical": {
          maxHeight: "calc(100% - 25px) !important",
          overflow: "auto",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon onClick={() => setExpand(!expand)} />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{
          backgroundColor: "accordingBackGround.main",
          minHeight: "unset !important",
          "& .MuiAccordionSummary-content": {
            justifyContent: "space-between",
            alignItems: "center",
          },
          height: "25px",
          px: "20px",
        }}
      >
        <Typography variant="h2" color="textBlack.main">
          {t("0-common.workflowName")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {participantsList.map((participants, index) => {
          // const status = checkSignerStatus(participants, signerToken);
          // console.log("status: ", status);
          const check = checkSignerWorkFlow(participants, signerToken);
          console.log(participants.signerType === "1");

          return (
            <Stack
              key={index}
              direction={"row"}
              spacing={1}
              backgroundColor={check ? "signerBackGround.main" : ""}
              color={check ? "signingtextBlue.main" : ""}
              sx={{
                p: "10px 20px",
              }}
              alignItems={"center"}
              borderTop="1px solid"
              borderBottom={
                index === participantsList.length - 1 ? "1px solid" : ""
              }
              borderColor="borderColor.main"
            >
              <Box
                onClick={() => toggleDrawer(index)}
                sx={{ cursor: "pointer" }}
              >
                {participants.signerType === 1 && (
                  <SignerIcon width={24} height={24} />
                )}
                {participants.signerType === 2 && (
                  <ReviewerIcon width={24} height={24} />
                )}
                {participants.signerType === 3 && (
                  <EditorIcon width={24} height={24} />
                )}
                {participants.signerType === 4 && (
                  <MeetingHost width={24} height={24} />
                )}
                {participants.signerType === 5 && (
                  <SendCopyIcon width={24} height={24} />
                )}
                {/* {status === 2 ? (
                  <Signed_Icon />
                ) : check ? (
                  <SignerSelected />
                ) : (
null
                  // <WaitingSig width={24} height={24} />
                )} */}
              </Box>
              <Box
                flexGrow={1}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  workflowStatus > 0
                    ? setSignerToken("")
                    : workflowProcessType !== "individual" &&
                      setSignerToken(participants.signerToken);
                }}
              >
                <Typography
                  variant="h6"
                  color={check ? "signingtextBlue.main" : "textBlack.main"}
                  fontSize={16}
                  lineHeight="normal"
                >
                  {participants.lastName} {participants.firstName}
                </Typography>
                <Typography
                  variant="h2"
                  color={check ? "signingtextBlue.main" : "signingtext2.main"}
                >
                  {participants.signerType === 1 && t("0-common.signer")}
                  {participants.signerType === 2 && t("0-common.reviewer")}
                  {participants.signerType === 3 && t("0-common.editor")}
                  {participants.signerType === 4 && t("0-common.meeting host")}
                  {participants.signerType === 5 && t("0-common.send a copy")}
                </Typography>
              </Box>
              {/* <IconButton onClick={() => toggleDrawer(index)}>
                <ShowDetailIcon />
              </IconButton> */}
              <SigningDetail
                open={isOpen[index]}
                participants={participants}
                handleClose={() => toggleDrawer(index)}
              />
            </Stack>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
ParticipantsInfo.propTypes = {
  participantsList: PropTypes.array,
  signType: PropTypes.string,
  setSignerToken: PropTypes.func,
  signerToken: PropTypes.string,
  workflowStatus: PropTypes.number,
  workflowProcessType: PropTypes.string,
};
export default ParticipantsInfo;
