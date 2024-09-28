import { renderIcon, useCommonHook } from "@/hook";
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

export const ParticipantInfo = ({ participantsList, signType }) => {
  const { t } = useTranslation();
  const { signerToken } = useCommonHook();
  const [isOpen, setIsOpen] = useState([false]);
  // console.log("isOpen: ", isOpen);

  const [expand, setExpand] = useState(true);

  const toggleDrawer = (index) => {
    const newIsOpen = [...isOpen];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };

  // const renderIcon = (signerType, signerStatus) => {
  //   if (signerStatus === 1) {
  //     switch (signerType) {
  //       case 1:
  //       case 2:
  //         return <SignerReviewerWait width={24} height={24} />;
  //       case 3:
  //         return <EditorWait width={24} height={24} />;
  //       case 5:
  //         return <OnlyView width={24} height={24} />;
  //     }
  //   } else {
  //     switch (signerType) {
  //       case 1:
  //       case 2:
  //         return <SignerReviewerSigned width={24} height={24} />;
  //       case 3:
  //         return <EditorSubmitted width={24} height={24} />;
  //       case 5:
  //         return <OnlyView width={24} height={24} />;
  //     }
  //   }
  // };

  const renderStatus = (signerType, signerStatus) => {
    if (signerStatus === 1) {
      switch (signerType) {
        case 1:
          return t("signing.wait_signature");
        case 2:
          return t("signing.wait_approve");
        case 3:
          return t("signing.wait_submit");
        case 5:
          return t("signing.only_view");
      }
    } else {
      switch (signerType) {
        case 1:
          return t("signing.signature_valid");
        case 2:
          return t("signing.approved");
        case 3:
          return t("signing.submitted");
        case 5:
          return t("signing.only_view");
      }
    }
  };

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expand}
      sx={{
        height: "calc(100% - 50px - 1px)",
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
          {signType === "Signature"
            ? t("0-common.participants")
            : t("0-common.seals")}
        </Typography>
        {/* <Avatar
          sx={{
            bgcolor: "signingtextBlue.main",
            width: 16,
            height: 16,
            fontSize: "10px",
          }}
        >
          {participantsList.length}
        </Avatar> */}
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, width: "100%" }}>
        {participantsList.map((participant, index) => {
          // const status = checkSignerStatus(participant, signerToken);
          const check = checkSignerWorkFlow(participant, signerToken);

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
              // height="50px"
            >
              <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                onClick={() => toggleDrawer(index)}
                sx={{ cursor: "pointer" }}
              >
                {renderIcon(participant.signerType, participant.signerStatus)}
              </Stack>
              <Box flexGrow={1}>
                <Typography
                  variant="h6"
                  color={check ? "signingtextBlue.main" : "textBlack.main"}
                  fontSize={16}
                  lineHeight="normal"
                >
                  {participant.lastName} {participant.firstName}
                </Typography>
                <Typography
                  variant="h2"
                  color={check ? "signingtextBlue.main" : "signingtext2.main"}
                >
                  {renderStatus(
                    participant.signerType,
                    participant.signerStatus
                  )}
                </Typography>
              </Box>
              {/* <IconButton onClick={() => toggleDrawer(index)}>
                <ShowDetailIcon />
              </IconButton> */}
              <SigningDetail
                open={isOpen[index]}
                participant={participant}
                handleClose={() => toggleDrawer(index)}
              />
            </Stack>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
ParticipantInfo.propTypes = {
  participantsList: PropTypes.array,
  signType: PropTypes.string,
};
export default ParticipantInfo;
