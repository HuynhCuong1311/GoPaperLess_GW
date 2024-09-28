import { ReactComponent as ErrorIcon } from "@/assets/images/svg/error_icon.svg";
import { ReactComponent as ValidSigWFIcon } from "@/assets/images/svg/icon_Chip_White.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { ReactComponent as ValidSealIcon } from "@/assets/images/svg/seal_icon.svg";
import { ReactComponent as ValidSealWFIcon } from "@/assets/images/svg/sealwf.svg";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import { ReactComponent as ValidSigIcon } from "@/assets/images/svg/valid.svg";
import { ReactComponent as WarningIcon2 } from "@/assets/images/svg/warning2_icon.svg";
import { ReactComponent as WarningIcon } from "@/assets/images/svg/warningError.svg";
import { ReactComponent as InValidIcon } from "@/assets/images/svg/error.svg";
import { ReactComponent as WarningWFIcon } from "@/assets/images/svg/warningErrorwf.svg";
import { ReactComponent as InValidWFIcon } from "@/assets/images/svg/errorwf.svg";
import { convertTime } from "@/utils/commonFunction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const SigDetail = ({ open, signDetail, handleClose }) => {
  console.log("signDetail: ", signDetail);
  const { t } = useTranslation();

  const signType = signDetail.is_seal === true ? "eseal" : "Signature";

  const name = signDetail.certificate?.subject?.CN[0];
  // const warnings = signDetail.warnings;
  // const errors = signDetail.errors;

  const commonName = signDetail.certificate?.issuer?.CN?.[0]
    ? signDetail?.certificate?.issuer?.CN[0]
    : "";
  const organization = signDetail.certificate?.issuer?.O?.[0]
    ? ", " + signDetail.certificate?.issuer?.O[0]
    : "";
  const country = signDetail.certificate?.issuer?.C?.[0]
    ? ", " + signDetail.certificate?.issuer?.C[0]
    : "";

  const validFrom =
    signDetail.certificate?.valid_from || signDetail.certificate?.validFrom;

  const validTo =
    signDetail.certificate?.valid_to || signDetail.certificate?.validTo;

  const signArray = {
    certificated: [
      {
        title: t("0-common.Signing Time"),
        subtitle: signDetail.signing_time
          ? convertTime(signDetail.signing_time)
          : null,
      },
      {
        title:
          signType === "Signature"
            ? t("validation.sigFormat")
            : t("validation.sealFormat"),
        subtitle: signDetail.format,
      },
      {
        title:
          signType === "Signature"
            ? t("validation.sigScope")
            : t("validation.sealScope"),
        subtitle: signDetail.scope?.name,
      },
      {
        title: t("0-common.Certificate Owner"),
        subtitle: commonName ? commonName : null,
      },
      {
        title: t("0-common.Certificate issuer"),
        subtitle: commonName + organization + country,
      },
      {
        title: t("0-common.Certificate validity period"),
        subtitle: convertTime(validFrom) + " - " + convertTime(validTo),
      },
    ].filter((item) => item.subtitle !== null),
  };

  const [expanded, setExpanded] = useState("warnings");

  const handleChangeShow = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  const sigTitle = () => {
    switch (signType) {
      case "Signature":
        if (signDetail.indication === "TOTAL_PASSED") {
          return t("signing.signature_valid");
        }
        if (signDetail.indication === "INDETERMINATE") {
          return t("signing.indeterminate signatures");
        }
        if (
          signDetail.indication !== "TOTAL_PASSED" &&
          signDetail.indication !== "INDETERMINATE"
        ) {
          return t("signing.invalid signatures");
        }
        break;
      case "eseal":
        if (signDetail.indication === "TOTAL_PASSED") {
          return t("validation.sealValidTitle2");
        }
        if (signDetail.indication === "INDETERMINATE") {
          return t("validation.indeterminateSeal");
        }
        if (
          signDetail.indication !== "TOTAL_PASSED" &&
          signDetail.indication !== "INDETERMINATE"
        ) {
          return t("validation.invalidSeal");
        }
        break;
    }
  };

  const icon = () => {
    if (signDetail.indication === "TOTAL_PASSED") {
      if (signDetail.isSigned) {
        if (signDetail.is_seal) {
          return (
            <SvgIcon viewBox={"0 0 40 40"}>
              <ValidSealIcon height={40} width={40} />
            </SvgIcon>
          );
        } else {
          return (
            <SvgIcon viewBox={"0 0 40 40"}>
              <ValidSigIcon height={40} width={40} />
            </SvgIcon>
          );
        }
      } else {
        if (signDetail.is_seal) {
          return (
            <SvgIcon viewBox={"0 0 40 40"}>
              <ValidSealWFIcon height={35} width={35} />
            </SvgIcon>
          );
        } else {
          return (
            <SvgIcon viewBox={"0 0 40 40"}>
              <ValidSigWFIcon height={35} width={35} />
            </SvgIcon>
          );
        }
      }
    }
    if (signDetail.indication === "INDETERMINATE") {
      if (signDetail.isSigned) {
        return (
          <SvgIcon viewBox={"0 0 40 40"}>
            <WarningIcon height={40} width={40} />
          </SvgIcon>
        );
      } else {
        return (
          <SvgIcon viewBox={"0 0 40 40"}>
            <WarningWFIcon height={35} width={35} />
          </SvgIcon>
        );
      }
    }
    if (
      signDetail.indication !== "TOTAL_PASSED" &&
      signDetail.indication !== "INDETERMINATE"
    ) {
      if (signDetail.isSigned) {
        return (
          <SvgIcon viewBox={"0 0 40 40"}>
            <InValidIcon height={40} width={40} />
          </SvgIcon>
        );
      } else {
        return (
          <SvgIcon viewBox={"0 0 40 40"}>
            <InValidWFIcon height={35} width={35} />
          </SvgIcon>
        );
      }
    }
  };

  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
        },
      }}
    >
      <Box width="350px" mt="10px">
        <Box px="20px">
          <Stack
            direction="row"
            alignItems={"center"}
            height={60}
            sx={{
              position: "sticky",
              top: 10,
              zIndex: 1,
              p: 2,
              backgroundColor: "#fff",
            }}
            gap={1}
          >
            <Box width="25px" height="25px">
              {signDetail.is_seal === true ? <SealIcon /> : <SignatureIcon />}
            </Box>
            <Typography variant="h3" sx={{ fontWeight: "700" }}>
              {name}
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <Stack
          direction="row"
          alignItems={"center"}
          sx={{
            p: 2,
            height: "91px",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            flexGrow={1}
            bgcolor={"signingBackground.main"}
            p="12px 16px"
            borderRadius="10px"
          >
            {icon()}
            <Box>
              <Typography
                fontWeight="550"
                textTransform="uppercase"
                variant="h3"
              >
                {sigTitle()}
              </Typography>
              <Typography variant="h2">
                {t("validation.signSubTitle")}
                {/* {sign.name} */}
              </Typography>
            </Box>
          </Stack>
        </Stack>
        {/* <Divider sx={{ borderColor: "borderColor.main" }} /> */}
        {signDetail.warnings?.length > 0 && (
          <Accordion
            disableGutters
            expanded={expanded === "warnings"}
            onChange={handleChangeShow("warnings")}
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
                },
                height: "25px",
                px: "20px",
              }}
            >
              <WarningIcon2 />
              <Typography variant="h2" sx={{ pl: "20px" }}>
                {signType === "Signature"
                  ? t("validation.sigWarnings")
                  : t("validation.sealWarnings")}
              </Typography>
            </AccordionSummary>
            {signDetail.warnings.map((val, i) => {
              return (
                <Box key={i}>
                  <AccordionDetails
                    sx={{
                      fontSize: "14px",
                      padding: "11px 20px",
                    }}
                  >
                    {val.value}
                  </AccordionDetails>
                  {i !== signDetail.warnings.length - 1 && (
                    <Divider
                      sx={{
                        width: "calc(100% - 20px)",
                        marginLeft: "auto",
                        height: "2px",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Accordion>
        )}

        {signDetail.errors?.length > 0 && (
          <Accordion
            disableGutters
            expanded={expanded === "error"}
            onChange={handleChangeShow("error")}
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
                  // justifyContent: "space-between",
                  alignItems: "center",
                },
                height: "25px",
                px: "20px",
              }}
            >
              <ErrorIcon />
              <Typography variant="h2" sx={{ pl: "20px" }}>
                {signType === "Signature"
                  ? t("validation.sigErrors")
                  : t("validation.sealErrors")}
              </Typography>
            </AccordionSummary>
            {signDetail.errors.map((val, i) => {
              return (
                <Box key={i}>
                  <AccordionDetails
                    sx={{
                      fontSize: "14px",
                      padding: "11px 20px",
                      // width: "100%",
                      // py: 1,
                    }}
                  >
                    {val.value}
                  </AccordionDetails>
                  {i !== signDetail.errors.length - 1 && (
                    <Divider
                      sx={{
                        width: "calc(100% - 20px)",
                        marginLeft: "auto",
                        height: "2px",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Accordion>
        )}
        <Divider sx={{ borderColor: "borderColor.main" }} />
        <Box px="20px">
          {signArray.certificated.map((step, index) => (
            <Box key={index} py="10px">
              <Typography variant="h6" fontWeight={"bold"}>
                {step.title}
              </Typography>
              <Typography variant="h6" color="signingtext2.main">
                {step.subtitle}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

SigDetail.propTypes = {
  open: PropTypes.bool,
  signDetail: PropTypes.object,
  handleClose: PropTypes.func,
  signType: PropTypes.string,
  sign: PropTypes.object,
};

export default SigDetail;
