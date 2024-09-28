import { ReactComponent as Signed_Icon } from "@/assets/images/svg/signed_icon2.svg";
import { ReactComponent as SignerSelected } from "@/assets/images/svg/signer_select.svg";
import { ReactComponent as WaitingSig } from "@/assets/images/svg/waiting_sig.svg";
import { SigningDetail } from "@/components/SigningContent/TabBar/Participant/SigningDetail";
import { useCommonHook } from "@/hook";
import { checkSignerStatus, checkSignerWorkFlow } from "@/utils/commonFunction";
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
import { useSearchParams } from "react-router-dom";

export const ParticipantInfo = ({ participantsList }) => {
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

  // Begin: Change params for participants
  let [searchParams, setSearchParams] = useSearchParams();
  // End: Change params for participants
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
          {t("0-common.participants")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {participantsList.map((participant, index) => {
          const status = checkSignerStatus(participant, signerToken);
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
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "rgba(0,0,0,0.1)",
                },
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
                {status === 2 ? (
                  <Signed_Icon />
                ) : check ? (
                  <SignerSelected />
                ) : (
                  <WaitingSig width={24} height={24} />
                )}
              </Box>
              <Box
                flexGrow={1}
                onClick={() => {
                  searchParams.get("access_token") === participant.signerToken
                    ? setSearchParams({})
                    : setSearchParams({
                        access_token: participant.signerToken,
                      });
                }}
              >
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
                  {status === 2
                    ? participant.signedType === "NORMAL"
                      ? t("signing.signature_valid")
                      : t("validation.sealValidTitle2")
                    : status === 1
                    ? t("signing.wait_my_signature")
                    : t("signing.wait_signature")}
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
