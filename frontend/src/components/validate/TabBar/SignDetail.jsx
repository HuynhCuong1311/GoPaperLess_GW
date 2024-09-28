import { convertTime } from "@/utils/commonFunction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import ShowSignature from "./ShowSignature";
import { useAppContext } from "@/hook/use-appContext";

export const SignDetail = ({ sign, signType }) => {
  const { handleSigSelected } = useAppContext();
  // console.log("sign: ", sign);
  // let name = sign.name + " " + signType;
  // const [expanded, setExpanded] = useState("panel");

  // const handleChangeShow = (panel) => (event, isExpanded) => {
  //   setExpanded(isExpanded ? panel : true);
  // };

  // console.log("sign: ", sign);
  const [isOpen, setIsOpen] = useState([false]);
  // console.log("isOpen: ", isOpen);
  // let name = sign.name + " " + signType;

  const [expand, setExpand] = useState(true);

  const toggleDrawer = (index) => {
    const newIsOpen = [...isOpen];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };

  return (
    <Accordion disableGutters elevation={0} expanded={expand}>
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
        <Typography variant="h2">{sign.title}</Typography>
        <Avatar
          sx={{
            bgcolor: "signingtextBlue.main",
            width: 16,
            height: 16,
            fontSize: "10px",
          }}
        >
          {sign.value.length}
        </Avatar>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, width: "100%" }}>
        {sign.value.map((signvalue, index) => {
          return (
            <Stack
              key={index}
              direction={"row"}
              spacing={1}
              backgroundColor="signingWFBackground.main"
              // color={check ? "signingtextBlue.main" : ""}
              sx={{
                p: "10px 20px",
              }}
              alignItems={"center"}
              borderTop="1px solid"
              borderBottom={index === sign.value.length - 1 ? "1px solid" : ""}
              borderColor="borderColor.main"
              width="100%"
              // height="50px"
              onClick={() => handleSigSelected(signvalue.field_name)}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                onClick={() => toggleDrawer(index)}
                sx={{ cursor: "pointer" }}
              >
                {sign.icon}
              </Stack>
              <Box flexGrow={1}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "16px", lineHeight: "normal" }}
                >
                  {signvalue.certificate.subject.CN[0]}
                </Typography>
                <Typography variant="h2">{sign.title}</Typography>
                {signvalue.indication === "TOTAL_PASSED" && (
                  <Typography variant="h2">
                    {convertTime(signvalue.signing_time)}
                  </Typography>
                )}
              </Box>
              {/* <IconButton onClick={() => toggleDrawer(index)}>
                <ShowDetailIcon />
              </IconButton> */}
              {isOpen[index] && (
                <ShowSignature
                  open={isOpen[index]}
                  signDetail={signvalue}
                  sign={sign}
                  signType={signType}
                  handleClose={() => toggleDrawer(index)}
                />
              )}
            </Stack>
            // <AccordionDetails key={i} sx={{ padding: "unset !important" }}>
            //   <ShowSignature
            //     sig={val}
            //     sign={sign}
            //     signType={signType}
            //     index={i}
            //   />
            //   {/* <Divider /> */}
            // </AccordionDetails>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
SignDetail.propTypes = {
  sign: PropTypes.object,
  signType: PropTypes.string,
};
export default SignDetail;
