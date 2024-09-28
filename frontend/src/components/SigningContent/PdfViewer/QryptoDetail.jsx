import { ReactComponent as HyperLink } from "@/assets/images/contextmenu/hyperlink.svg";
import { ReactComponent as QrQrypto } from "@/assets/images/contextmenu/qrypto.svg";
import pdfIcon from "@/assets/images/pdf_icon.png";
import { ReactComponent as ValidWFIcon } from "@/assets/images/svg/icon_Chip_White.svg";
import { SigDetail } from "@/components/SigningContent/PdfViewer";
import { parseStringToObject } from "@/utils/commonFunction";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { t } from "i18next";
import PropTypes from "prop-types";
import { useState } from "react";
import { convertDate } from "../../../utils/commonFunction";

export const QryptoDetail = ({ open, handleClose, qryptoInfor, sigDetail }) => {
  console.log("sigDetail: ", sigDetail);
  console.log("ki cuc dzay");
  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(true);

  const [isShowQryptoSigDetail, setIsShowQryptoSigDetail] = useState(false);

  const toggleQryptoSigDetail = () => {
    setIsShowQryptoSigDetail(!isShowQryptoSigDetail);
  };

  const subjectObj = parseStringToObject(
    qryptoInfor.getkidsresponse.CertificateInfo.subject
  );

  const issuerObj = parseStringToObject(
    qryptoInfor.getkidsresponse.CertificateInfo.issuer
  );

  const accessInfo = JSON.parse(
    qryptoInfor.getkidsresponse.CertificateInfo.accessInfo
  );

  const crlDistPoint = JSON.parse(
    qryptoInfor.getkidsresponse.CertificateInfo.crlDistPoint
  );

  const extendedKeyUsages = JSON.parse(
    qryptoInfor.getkidsresponse.CertificateInfo.extendedKeyUsages
  );

  // qryptoInfor.getkidsresponse.LayoutMaps.map((item, index) => {
  //   console.log("key: ", Object.keys(item));
  // });
  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
          width: "395px",
          py: "10px",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing="8px"
        height="54px"
        py="12px"
        px="20px"
      >
        <SvgIcon
          component={QrQrypto}
          inheritViewBox
          sx={{
            width: "30px",
            height: "30px",
            // color: "#545454",
            // cursor: "pointer",
          }}
        />
        <Typography
          variant="h6"
          sx={{ fontSize: "16px", fontWeight: 700, lineHeight: "24px" }}
        >
          {t("0-common.qrypto_code").toUpperCase()}
        </Typography>
      </Stack>
      <Divider />
      <Box m="16px 20px ">
        <Stack
          direction="row"
          alignItems="center"
          spacing="16px"
          height="50px"
          p="12px 16px"
          bgcolor="signingBackground.main"
          borderRadius="6px"
        >
          <ValidWFIcon height={18} width={18} />
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: "24px" }}>
            {t("signing.valid_verification_code")}
          </Typography>
        </Stack>
        <Typography
          variant="h6"
          sx={{
            lineHeight: "20px",
            mt: "10px",
            color: "signingtextBlue.main",
            cursor: "pointer",
            display: sigDetail ? "block" : "none",
          }}
          onClick={toggleQryptoSigDetail}
        >
          Show Qrypto Service Certificate
        </Typography>
      </Box>
      <Divider />
      {qryptoInfor.getkidsresponse.LayoutMaps.map((item, index) => {
        switch (Object.keys(item)[0]) {
          case "ModelT2":
            return (
              <Box key={index} p="8px 20px">
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, lineHeight: "20px", color: "#1F2937" }}
                >
                  {item.ModelT2.layout.key}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 400, lineHeight: "20px", color: "#6B7280" }}
                >
                  {item.ModelT2.layout.value}
                </Typography>
              </Box>
            );
          case "ModelT2WithOption":
            return (
              <Box key={index} p="8px 20px">
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, lineHeight: "20px", color: "#1F2937" }}
                >
                  {item.ModelT2WithOption.layout.key}
                </Typography>
              </Box>
            );
          case "choice":
            return (
              <Stack
                key={index}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                p="8px 20px"
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, lineHeight: "20px", color: "#1F2937" }}
                >
                  {item.field}
                </Typography>

                {item.value.map((val, i) => {
                  if (val.choice === true) {
                    return (
                      <Typography
                        key={i}
                        variant="h6"
                        sx={{
                          fontWeight: 400,
                          lineHeight: "20px",
                          color: "#6B7280",
                        }}
                      >
                        {val.element}
                      </Typography>
                    );
                  }
                })}
              </Stack>
            );
          case "Model_1L3_2L1":
            return (
              <Box key={index} p="8px 20px">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    lineHeight: "20px",
                    color: "#1F2937",
                    mb: "10px",
                  }}
                >
                  {item.Model_1L3_2L1.layout.key}
                </Typography>
                {item.Model_1L3_2L1.layout.list.map((val, i) => {
                  return (
                    <Box key={i}>
                      <Grid container spacing="10px" mb="10px">
                        {val.value.map((valItem, index) => {
                          return (
                            <Grid key={index} item xs={4}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 400,
                                  lineHeight: "20px",
                                  color: "#6B7280",
                                  wordBreak: "break-word",
                                }}
                              >
                                {valItem}
                              </Typography>
                            </Grid>
                          );
                        })}

                        <Grid
                          item
                          xs={4}
                          sx={{ display: val.smallKey ? "block" : "none" }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 400,
                              lineHeight: "20px",
                              color: "#6B7280",
                              wordBreak: "break-all",
                            }}
                          >
                            {val.smallKey}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
              </Box>
            );
          case "Model4T1P":
            return (
              <Box key={index} p="8px 20px">
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, lineHeight: "20px", color: "#1F2937" }}
                >
                  {item.Model4T1P.layout.key}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    {item.Model4T1P.layout.value.map((val, i) => {
                      return (
                        <Typography
                          key={i}
                          variant="h6"
                          sx={{
                            fontWeight: 400,
                            lineHeight: "20px",
                            color: "#6B7280",
                          }}
                        >
                          {val}
                        </Typography>
                      );
                    })}
                  </Box>
                  <Box
                    component="img"
                    sx={{
                      maxHeight: "80px",
                      maxWidth: "88px",
                    }}
                    alt="The house from the offer."
                    src={
                      `data:image/png;base64,` + item.Model4T1P.base64Content
                    }
                  />
                </Stack>
              </Box>
            );
          case "ModelUrl":
            return (
              <Stack
                direction="row"
                alignItems="center"
                key={index}
                p="8px 20px"
                spacing="8px"
              >
                <HyperLink />
                <Link
                  href={item.ModelUrl.layout.value}
                  variant="h6"
                  target="_blank"
                  sx={{
                    lineHeight: "20px",
                    fontWeight: 600,
                    letterSpacing: "0.07px",
                  }}
                >
                  {item.ModelUrl.layout.key}
                </Link>
              </Stack>
            );
          case "ModelF1":
            return (
              <Box key={index} p="0 20px">
                <Stack
                  bgcolor="#E8E8E8"
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing="10px"
                  p="8px"
                >
                  <Box
                    component="img"
                    sx={{
                      maxHeight: "80px",
                      maxWidth: "80px",
                    }}
                    alt="The house from the offer."
                    src={
                      item.ModelF1.layout.list[0].file_type ===
                      "application/pdf"
                        ? pdfIcon
                        : `data:${item.ModelF1.layout.list[0].file_type};base64,` +
                          item.ModelF1.base64Content
                    }
                  />
                  <Box textAlign="right">
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#6B7280",
                      }}
                    >
                      {item.ModelF1.layout.list[0].key}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#6B7280",
                      }}
                    >
                      {item.ModelF1.fileName}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#6B7280",
                      }}
                    >
                      {item.ModelF1.fileSize}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            );

          default:
            return null;
        }
      })}
      <Divider />
      <Accordion disableGutters elevation={0} expanded={expand1}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon onClick={() => setExpand1(!expand1)} />}
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
          <ErrorIcon sx={{ fontSize: 14, color: "#7A7A8C" }} />
          <Typography variant="h2" ml="20px" color="#9E9C9C">
            {t("0-common.validity_period")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, width: "100%" }}>
          <Box p="8px 20px">
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, lineHeight: "20px", color: "#1F2937" }}
            >
              {t("signing.not_valid_before")}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 400, lineHeight: "20px", color: "#6B7280" }}
            >
              {convertDate(
                qryptoInfor.getkidsresponse.qryptoInfo.qryptoCertificateData
                  .issuedAt
              )}
            </Typography>
          </Box>
          <Box p="8px 20px">
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, lineHeight: "20px", color: "#1F2937" }}
            >
              {t("signing.not_valid_after")}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 400, lineHeight: "20px", color: "#6B7280" }}
            >
              {convertDate(
                qryptoInfor.getkidsresponse.qryptoInfo.qryptoCertificateData
                  .expirationTime
              )}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider />
      <Accordion disableGutters elevation={0} expanded={expand2}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon onClick={() => setExpand2(!expand2)} />}
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
          <ErrorIcon sx={{ fontSize: 14, color: "#7A7A8C" }} />
          <Typography variant="h2" ml="20px" color="#9E9C9C">
            {t("0-common.certificate_details")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, width: "100%" }}>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.subject_name")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                UID
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {subjectObj.UID}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("signing.common_name")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {subjectObj.CN}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.state_or_province")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {subjectObj.ST}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.Country_or_region")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {subjectObj.C}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.issuer_name")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("signing.common_name")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {issuerObj.CN}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.organization_unit")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {issuerObj.OU}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.organization")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {issuerObj.O}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.Locality")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {issuerObj.L}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.state_or_province")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {issuerObj.ST}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.Country_or_region")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {issuerObj.C}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.serial_number")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.serial_number")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.serialNumber}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.validity_period")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("signing.not_valid_before")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.notBefore}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("signing.not_valid_after")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.notAfter}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.public_key_information")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.algorithm")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.algorithm}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.public_key_size")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.publicKeySize}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.public_key_data")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.publicKeyContent}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.certification rights information access")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.critical")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.critical ===
                "false"
                  ? "None"
                  : "Yes"}
              </Typography>
            </Box>
            {accessInfo.map((item, index) => {
              return (
                <Box key={index}>
                  <Box px="20px" mb="10px">
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        lineHeight: "20px",
                        color: "#1F2937",
                        px: "10px",
                      }}
                    >
                      {t("0-common.access_method")}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#6B7280",
                        px: "10px",
                      }}
                    >
                      {item.AccessMethod}
                    </Typography>
                  </Box>
                  <Box px="20px" mb="10px">
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        lineHeight: "20px",
                        color: "#1F2937",
                        px: "10px",
                      }}
                    >
                      URI
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#6B7280",
                        px: "10px",
                      }}
                    >
                      {item.URI}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.subject_key_identifier")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.critical")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo
                  .criticalIdentifier === "false"
                  ? "No"
                  : "Yes"}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.key_identifier")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {
                  qryptoInfor.getkidsresponse.CertificateInfo
                    .subjectKeyIdentifier
                }
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.basic_contrainst")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.critical")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.basicContrainst ===
                "false"
                  ? "No"
                  : "Yes"}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.certification_authority")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.ca === "false"
                  ? "No"
                  : "Yes"}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.authority_key_identifier")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.critical")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo
                  .criticalAuthorityKeyIdentifier === "false"
                  ? "No"
                  : "Yes"}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.key_identifier")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {
                  qryptoInfor.getkidsresponse.CertificateInfo
                    .authorityKeyIdentifier
                }
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.crl_distribution_point")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.critical")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.criticalCRL ===
                "false"
                  ? "No"
                  : "Yes"}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                URI
              </Typography>
              {crlDistPoint.map((item, index) => (
                <Typography
                  key={index}
                  variant="h6"
                  sx={{
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: "#6B7280",
                    px: "10px",
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.key_usage")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.critical")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo
                  .criticalKeyUsage === "false"
                  ? "No"
                  : "Yes"}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.usage")}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.keyUsages}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.extended_key_usage")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.critical")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo
                  .criticalKeyUsageExtended === "false"
                  ? "No"
                  : "Yes"}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.purpose")}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {extendedKeyUsages.map((usage) => usage.name).join(", ")}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.signature")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.algorithm")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.algorithmSig}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.parameters")}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.Param === "N/A"
                  ? "None"
                  : qryptoInfor.getkidsresponse.CertificateInfo.Param}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.signature_data")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.DataSignature}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.fingerprints")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                SHA-256
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.SHA256}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                SHA-1
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.SHA1}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box px="20px" my="10px">
              <Typography
                variant="h6"
                lineHeight="20px"
                bgcolor="#F3F5F8"
                fontWeight="600"
                px="10px"
              >
                {t("0-common.version")}
              </Typography>
            </Box>
            <Box px="20px" mb="10px">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1F2937",
                  px: "10px",
                }}
              >
                {t("0-common.version")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#6B7280",
                  px: "10px",
                }}
              >
                {qryptoInfor.getkidsresponse.CertificateInfo.version}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      {isShowQryptoSigDetail && (
        <SigDetail
          open={isShowQryptoSigDetail}
          signDetail={sigDetail}
          handleClose={toggleQryptoSigDetail}
        />
      )}
    </Drawer>
  );
};

QryptoDetail.propTypes = {
  open: PropTypes.bool,
  qryptoInfor: PropTypes.object,
  handleClose: PropTypes.func,
  sigDetail: PropTypes.object,
};

export default QryptoDetail;
