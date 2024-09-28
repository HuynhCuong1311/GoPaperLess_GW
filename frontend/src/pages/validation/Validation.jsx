import "@/assets/style/validation.css";
import { PDFViewer } from "@/components/validate/PdfViewer";
import { TabDocument } from "@/components/validate/TabBar";
import { UseGetFields } from "@/hook/use-fpsService";
import { validationService } from "@/services/validation";
import i18n from "@/utils/languages/i18n";
import { IosShareOutlined } from "@mui/icons-material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// const CustomButton = styled(Button)`
//   text-transform: none; /* Đặt textTransform thành none để bỏ chữ in hoa */
//   border-radius: 50px;
//   white-space: nowrap;
//   background: rgb(90, 51, 139);
// `;

export const Validation = () => {
  const { t } = useTranslation();

  const { upload_token } = useParams();
  // console.log("upload_token: ", upload_token);
  // const documentId = 14969;

  const [isFetching, setIsFetching] = useState(false);

  // const [infoFile, setInfoFile] = useState({});
  const [validFile, setValidFile] = useState({});
  const [isFinish, setIsFinish] = useState(null);
  // const [ sigSelected, setSigSelected ] = useState(null);

  const [lang, setLang] = useState("English");

  const field = UseGetFields(validFile.document_id);

  useEffect(() => {
    if (validFile.lang) {
      setLang(validFile.lang);
    }
  }, [validFile]);

  useEffect(() => {
    if (lang) {
      // setLanguage(lang);
      switch (lang) {
        case "en":
          i18n.changeLanguage("en");
          localStorage.setItem("language", "English");
          break;
        case "vi":
          i18n.changeLanguage("vi");
          localStorage.setItem("language", "Việt Nam");
          break;
        default:
          break;
      }
    }
  }, [lang]);

  useEffect(() => {
    if (upload_token) {
      // getFirstFileFromUploadToken(upload_token);
      getValidView();
    }
  }, []);

  useEffect(() => {
    if (validFile.ppl_file_validation_id) {
      checkStatus();
    }
  }, [validFile]);

  const getValidView = async () => {
    setIsFetching(true);
    try {
      const response = await validationService.getView({
        uploadToken: upload_token,
      });

      setValidFile(response.data);
      setLang(response.data.lang);
      setIsFetching(false);
      // setInfoFile(response.data);
    } catch (error) {
      setIsFetching(false);
      console.error(error);
    }
  };

  const postback = async () => {
    const data = {
      postBackUrl: validFile.postback_url,
      status: "OK",
      uploadToken: upload_token,
      fileValidationId: validFile.ppl_file_validation_id,
    };
    try {
      await validationService.postBack(data);
      checkStatus();
    } catch (error) {
      console.error(error);
    }
  };

  const checkStatus = async () => {
    const data = {
      fileValidationId: validFile.ppl_file_validation_id,
    };
    try {
      const response = await validationService.checkStatus(data);
      setIsFinish(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      {isFetching && (
        <div
          className="modal backdrop fade show d-flex justify-content-center align-items-center"
          style={{ background: "#00000080" }}
        >
          <div className="loader" />
        </div>
      )}
      <Box sx={{ height: { md: "auto", lg: "calc(100vh - 110px)" } }}>
        <Box>
          <AppBar
            position="static"
            sx={{
              height: (theme) => theme.GoPaperless.appBarHeight,
            }}
          >
            <Toolbar
              variant="dense"
              sx={{
                backgroundColor: "signingWFBackground.main",
                gap: 2,
                height: (theme) => theme.GoPaperless.appBarHeight,
                // padding: "13px 0",
                padding: "13px 24px",
              }}
            >
              <Chip
                label="PDF"
                size="small"
                sx={{
                  backgroundColor: "#4F4E4E",
                  color: "white",
                  fontWeight: "500",
                }}
              />
              <Typography
                color="signingtext1.main"
                variant="h3"
                component="div"
                sx={{ flexGrow: 1, textTransform: "uppercase" }}
              >
                {validFile?.file?.fileName}
              </Typography>

              {/* <Box sx={{ flexGrow: 1 }} /> */}
              <Box
                sx={{
                  // display: { xs: "none", md: "flex" },
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {validFile.postback_url && (
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="#ccc"
                    onClick={postback}
                    disabled={isFinish === 1}
                  >
                    <Tooltip title="Finish">
                      <IosShareOutlined />
                    </Tooltip>
                  </IconButton>
                )}

                <Chip
                  label={t("validation.downloadReport")}
                  component="a"
                  color="primary"
                  // color="primary"
                  sx={{
                    padding: "8px 16px",
                    height: "36px",
                    fontWeight: "500",
                    borderRadius: "25px",
                    backgroundColor: "#3B82F6",
                    // backgroundColor: checkWorkFlowStatus ? "#3B82F6" : "#9b9895",
                    cursor: "pointer",
                    color: "white",
                    gap: "10px",
                    "& span": {
                      padding: "0",
                    },
                    "& svg.MuiChip-icon": {
                      margin: "0",
                    },
                    "& .MuiChip-label": {
                      display: { xs: "none", md: "flex" },
                    },
                  }}
                  // href="#basic-chip"
                  href={`${window.location.origin}/api/internalusage/validation/${upload_token}/download/report-pdf`}
                  icon={
                    <SaveAltIcon fontSize="small" color="borderColor.light" />
                  }
                  // clickable
                />

                {/* <a
                  style={{ color: "white", textDecoration: "none" }}
                  href={`${window.location.origin}/api/internalusage/validation/${upload_token}/download/report-pdf`}
                  download
                >
                  <CustomButton
                    startIcon={<FileDownloadOutlinedIcon />}
                    variant="contained"
                    disabled={
                      validFile?.signatures?.length === 0 &&
                      validFile?.seals?.length === 0
                    }
                  >
                    {t("validation.downloadReport")}
                  </CustomButton>
                </a> */}
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: (theme) => theme.GoPaperless.containerMaxWidth,
            height: (theme) => `calc(100% - ${theme.GoPaperless.appBarHeight})`,
          }}
        >
          <Container
            disableGutters
            maxWidth="100%"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              height: { lg: "100%" }, // ở màn hình lg sẽ cao bằng 100% chiều cao thẻ div cha
              border: "1px solid #E8EBF0",
              pt: 2,
              gap: 4,
            }}
          >
            {/* width={{ xs: "100%", lg: "70%" }} */}
            <Box
              width={{ xs: "100%", lg: "72%" }}
              height={{ xs: "500px", lg: "100%" }}
              sx={{
                border: "1px solid #E8EBF0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                height="53px"
                bgcolor="signingWFBackground.main"
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  height={"24px"}
                  lineHeight={"24px"}
                  bgcolor="signingWFBackground.main"
                  pl={2}
                >
                  {validFile?.file?.fileName}
                </Typography>
              </Stack>
              <Box
                overflow="auto"
                height={{ xs: "500px", lg: "calc(100% - 53px)" }}
              >
                {Object.keys(validFile).length !== 0 && (
                  <PDFViewer validFile={validFile} field={field.data} />
                )}
              </Box>
            </Box>
            <Box
              width={{ xs: "100%", lg: "28%" }}
              // width={{ xs: "100%", lg: "510px" }}
              // height={{ xs: "100%", lg: "100%" }}
            >
              <TabDocument validFile={validFile} />
            </Box>
          </Container>
        </Container>
      </Box>
    </main>
  );
};

export default Validation;
