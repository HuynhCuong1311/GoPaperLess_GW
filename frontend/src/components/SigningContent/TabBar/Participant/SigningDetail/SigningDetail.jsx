import { ReactComponent as PencilIcon } from "@/assets/images/svg/pencil_wait.svg";
import { ReactComponent as PersonIcon } from "@/assets/images/svg/person_icon.svg";
import { ReactComponent as SigValidIcon } from "@/assets/images/svg/sig_valid.svg";
import { useCommonHook } from "@/hook";
import { checkSignerStatus, checkSignerWorkFlow } from "@/utils/commonFunction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const SigningDetail = ({ open, participant, handleClose }) => {
  const { t } = useTranslation();
  const { signerToken } = useCommonHook();
  const status = checkSignerStatus(participant, signerToken);
  const check = checkSignerWorkFlow(participant, signerToken);

  const [expanded, setExpanded] = useState("info");

  const handleChangeShow = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  const participantInfo = {
    info: [
      {
        title: t("0-common.Resolution"),
        subtitle: participant.signing_purpose
          ? participant.signing_purpose
          : "Signature",
      },
      {
        title: t("0-common.company"),
        subtitle: participant.metaInformation.company
          ? participant.metaInformation.company
          : null,
      },
      {
        title: t("0-common.Position"),
        subtitle: participant.metaInformation.position
          ? participant.metaInformation.position
          : null,
      },
      {
        title: t("0-common.Structural subdivision"),
        subtitle: participant.metaInformation.structural_subdivision
          ? participant.metaInformation.structural_subdivision
          : null,
      },
      {
        title: t("0-common.Location"),
        subtitle: participant.metaInformation.country
          ? participant.metaInformation.country
          : null,
      },
      {
        title: t("0-common.Reason"),
        subtitle: participant.customReason ? participant.customReason : null,
      },
    ].filter((item) => item.subtitle !== null),
  };

  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          // borderRadius: "10px",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
        },
      }}
    >
      <Box width="350px">
        <Stack
          direction="row"
          alignItems={"center"}
          height={60}
          sx={{
            position: "sticky",
            top: 10,
            zIndex: 1,
            p: "20px",
            backgroundColor: "#fff",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            // justifyContent={"space-between"}
            gap={1}
            flexGrow={1}
          >
            <PersonIcon />
            <Box>
              <Typography
                fontWeight="550"
                textTransform="uppercase"
                variant="h3"
                color="textBlack.main"
              >
                {participant.lastName} {participant.firstName}
              </Typography>
              <Typography fontWeight="550" variant="h2" color="#9E9C9C">
                {participant.email}
              </Typography>
            </Box>
            {/* <Button
              onClick={handleClose}
              sx={{
                minWidth: "32px",
                maxWidth: "32px",
                height: "32px",
                backgroundColor: "#F3F5F8",
              }}
            >
              <CloseIcon sx={{ color: "#7A7A8C" }} />
            </Button> */}
          </Stack>
        </Stack>

        {participantInfo.info.length > 0 && (
          <Accordion
            expanded={expanded === "info"}
            onChange={handleChangeShow("info")}
            disableGutters
            elevation={0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{
                mt: "10px",
                px: "20px",
                backgroundColor: "accordingBackGround.main",
                height: "25px",
                minHeight: "unset !important",
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              {status === 2 ? (
                <>
                  <SvgIcon
                    color="#33B843"
                    sx={{ fontSize: 16, color: "#33B843" }}
                    viewBox={"0 0 16 16"}
                  >
                    <SigValidIcon />
                  </SvgIcon>
                  {/* <SigValidIcon /> */}
                  <Typography
                    variant="h2"
                    sx={
                      {
                        // color: check ? "textSuccess.main" : "signingtext1.main",
                        // color: "success.main",
                      }
                    }
                  >
                    {participant.signedType === "NORMAL"
                      ? t("signing.signature_valid")
                      : t("validation.sealValidTitle2")}
                  </Typography>
                </>
              ) : status === 1 ? (
                <>
                  <SvgIcon
                    // color="primary"
                    sx={{ fontSize: 16, color: "primary.main" }}
                    viewBox={"0 0 16 16"}
                  >
                    <PencilIcon />
                  </SvgIcon>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "signingtext1.main",
                    }}
                  >
                    {t("signing.wait_my_signature")}
                  </Typography>
                </>
              ) : (
                <>
                  <PencilIcon />
                  <Typography
                    variant="h2"
                    sx={{
                      color: check
                        ? "signingtextBlue.main"
                        : "signingtext1.main",
                    }}
                  >
                    {participant.signerType === 1 && "Waiting for signature"}
                    {participant.signerType === 2 && "Waiting for approve"}
                    {participant.signerType === 3 && "Signature is valid"}
                    {participant.signerType === 5 && "Only view"}
                  </Typography>
                </>
              )}
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {participantInfo.info.map((item, index) => (
                <Stack
                  key={index}
                  px="20px"
                  height={55}
                  justifyContent={"center"}
                >
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "signingtext2.main",
                      fontWeight: 400,
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                  {/* {index !== participantInfo.info.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )} */}
                  {/* <Divider sx={{ my: 1 }} /> */}
                </Stack>
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {/* {participantInfo.certificated.length > 0 && (
          <Accordion
            expanded={expanded === "certificated"}
            onChange={handleChangeShow("certificated")}
            disableGutters
            elevation={0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{
                backgroundColor: "accordingBackGround.main",
                minHeight: "unset !important",
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <SvgIcon
                color="primary"
                sx={{ fontSize: 16 }}
                viewBox={"0 0 16 16"}
              >
                <LockIcon />
              </SvgIcon>
              <Typography
                variant="h5"
                sx={{
                  color: "signingtextBlue.main",
                }}
              >
                {t("validation.sigValidTitle")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ py: 2, px: 0 }}>
              {participantInfo.certificated.map((item, index) => (
                <Box key={index} px={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "signingtext1.main",
                      fontWeight: 600,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "signingtext2.main",
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )} */}
      </Box>
    </Drawer>
  );
};
SigningDetail.propTypes = {
  open: PropTypes.bool,
  participant: PropTypes.object,
  handleClose: PropTypes.func,
};
export default SigningDetail;
