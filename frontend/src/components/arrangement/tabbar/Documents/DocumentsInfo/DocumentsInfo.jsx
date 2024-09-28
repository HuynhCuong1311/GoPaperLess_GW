import { ReactComponent as FigureIcon } from "@/assets/images/svg/figure.svg";
import { SigningDetail } from "@/components/arrangement/tabbar/Documents/SigningDetail";
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

export const DocumentsInfo = ({ documentsList, signType, attachment }) => {
  const { t } = useTranslation();
  // const { signerToken } = useCommonHook();
  const [isOpen, setIsOpen] = useState([false]);
  // console.log("isOpen: ", isOpen);

  const [expand, setExpand] = useState(true);

  const toggleDrawer = (index) => {
    const newIsOpen = [...isOpen];

    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };

  // if (
  //   documentsList.deadlineAt &&
  //   new Date(documentsList.deadlineAt) < new Date()
  // ) {
  //   alert("Deadline has expired");
  //   return;
  // }
  // Begin: Change params for participants
  // let [searchParams, setSearchParams] = useSearchParams();
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
          {signType === "Signature"
            ? t("0-common.participants")
            : t("batch.documents")}
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
      <AccordionDetails sx={{ p: 0 }}>
        <Stack
          key={0}
          direction={"row"}
          spacing={1}
          backgroundColor={"signerBackGround.main"}
          color={"signingtextBlue.main"}
          sx={{
            p: "10px 20px",
          }}
          alignItems={"center"}
          borderTop="1px solid"
          borderBottom={"1px solid"}
          borderColor="borderColor.main"
          // height="50px"
        >
          {/* {check ? (
                  <SignerSelected />
                ) : (
                  <WaitingSig width={24} height={24} />
                )} */}
          <Box
            onClick={() => toggleDrawer(0)}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {status === 2 ? (
              <Signed_Icon />
            ) : check ? (
              <SignerSelected />
            ) : ( */}
            <FigureIcon width={24} height={24} />
            {/* )} */}
          </Box>
          <Box
            flexGrow={1}
            sx={{ cursor: "pointer" }}
            // onClick={() => {
            //   searchParams.get("access_token") === participants.signerToken
            //     ? setSearchParams({})
            //     : setSearchParams({
            //         access_token: participants.signerToken,
            //       });
            // }}
          >
            <Typography
              variant="h6"
              color={"signingtextBlue.main"}
              fontSize={16}
              lineHeight="normal"
            >
              {documentsList.documentName}
            </Typography>
            <Typography variant="h2" color={"signingtextBlue.main"}>
              {/* {status === 2
                ? participants.signedType === "NORMAL"
                  ? t("signing.signature_valid")
                  : t("validation.sealValidTitle2")
                : status === 1
                ? t("signing.wait_my_signature")
                : t("signing.wait_signature")} */}
            </Typography>
          </Box>
          {/* <IconButton onClick={() => toggleDrawer(index)}>
                <ShowDetailIcon />
              </IconButton> */}
          <SigningDetail
            open={isOpen[0]}
            documentsList={documentsList}
            attachment={attachment}
            handleClose={() => toggleDrawer(0)}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
DocumentsInfo.propTypes = {
  documentsList: PropTypes.array,
  signType: PropTypes.string,
  attachment: PropTypes.array,
};
export default DocumentsInfo;
