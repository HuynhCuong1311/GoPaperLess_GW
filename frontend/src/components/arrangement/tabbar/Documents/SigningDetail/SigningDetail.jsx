import { ReactComponent as DocumentsIcon } from "@/assets/images/svg/document.svg";
import { ReactComponent as DetailsIcon } from "@/assets/images/svg/material-symbols_info.svg";
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

export const SigningDetail = ({ open, documentsList, handleClose }) => {
  const { t } = useTranslation();
  const { signerToken } = useCommonHook();
  const status = checkSignerStatus(documentsList, signerToken);
  const check = checkSignerWorkFlow(documentsList, signerToken);

  const [expanded, setExpanded] = useState("info");

  const handleChangeShow = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  // const removeSignature = async (fieldName) => {
  //   const res = await fpsService.removeSignature(
  //     { documentId: documentsList.documentId },
  //     fieldName
  //   );
  //   if (res.status === 200) {
  //     await getFields();
  //   }
  // };

  const workflowStatus = (value) => {
    switch (value) {
      case "0":
        return "Draft";
      case "1":
        return "Pending";
      case "2":
        return "Signed";
      case "3":
        return "Completed";
      case "4":
        return "Archived";
      case "5":
        return "Declined";
      default:
        return 0;
    }
  };

  const documentInfo = {
    info: [
      {
        title: t("Name"),
        subtitle: documentsList?.documentName
          ? documentsList?.documentName
          : "Signature",
      },
      {
        title: t("Owner"),
        subtitle: documentsList?.createdBy ? documentsList?.createdBy : null,
      },
      {
        title: t("Document status"),
        subtitle: workflowStatus(documentsList?.workflowStatus)
          ? workflowStatus(documentsList.workflowStatus)
          : null,
      },
      {
        title: t("Upload"),
        subtitle: documentsList?.createdAt ? documentsList.createdAt : null,
      },
      {
        title: t("Modified"),
        subtitle: documentsList.lastModifiedAt
          ? documentsList.lastModifiedAt
          : null,
      },
      {
        title: t("Size"),
        subtitle: documentsList.fileSize ? documentsList.fileSize : null,
      },
      {
        title: t("Type"),
        subtitle: documentsList.fileName
          ? documentsList.fileName.substr(-3).toUpperCase()
          : null,
      },
      {
        title: t("Source"),
        subtitle: "File System",
      },
    ].filter((item) => item.subtitle !== null),
  };

  // const AttachmentInfo = {
  //   info: [
  //     {
  //       title: t("Name"),
  //       subtitle: "Attachment Name",
  //     },
  //   ].filter((item) => item.subtitle !== null),
  // };

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
            <DocumentsIcon />
            <Box>
              <Typography
                fontWeight="550"
                textTransform="uppercase"
                variant="h3"
                color="textBlack.main"
              >
                {documentsList.documentName}
              </Typography>
              <Typography fontWeight="550" variant="h2" color="#9E9C9C">
                {documentsList.email}
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

        {documentInfo.info.length > 0 && (
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
                    color="success"
                    sx={{ fontSize: 16 }}
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
                    {documentsList.signedType === "NORMAL"
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
                    <DetailsIcon />
                  </SvgIcon>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "signingtext1.main",
                    }}
                  >
                    {t("0-common.details")}
                  </Typography>
                </>
              ) : (
                <>
                  <DetailsIcon />
                  <Typography
                    variant="h2"
                    sx={{
                      color: check
                        ? "signingtextBlue.main"
                        : "signingtext1.main",
                    }}
                  >
                    {t("signing.wait_signature")}
                  </Typography>
                </>
              )}
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {documentInfo?.info?.map((item, index) => (
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

        {/* {AttachmentInfo.info.length > 0 && (
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
                padding: "0px 20px",
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <SvgIcon
                sx={{ fontSize: 14, color: "primary.main" }}
                viewBox={"0 0 16 16"}
              >
                <AttachmentsIcon />
              </SvgIcon>
              <Typography
                variant="h2"
                sx={{
                  color: "signingtext1.main",
                }}
              >
                {t("0-common.attachments")}
              </Typography>
            </AccordionSummary>
            {/* <AccordionDetails sx={{ py: 2, px: 0 }}>
              {attachment.map((item, index) => (
                <Box key={index} px={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "signingtext1.main",
                      fontWeight: 600,
                    }}
                  >
                    {item.fileName}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "signingtext2.main",
                      display: "inline-block",
                      paddingRight: "153px",
                    }}
                  >
                    {item.processed_by}
                  </Typography>
                  <DownloadIcon />
                  <DeleteIcon
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      // removeSignature(item.field_name);
                    }}
                  />
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
  documentsList: PropTypes.object,
  handleClose: PropTypes.func,
  attachment: PropTypes.array,
};
export default SigningDetail;
