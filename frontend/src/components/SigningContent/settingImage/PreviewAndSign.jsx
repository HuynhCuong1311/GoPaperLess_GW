import DocumentPreview from "@/components/SigningContent/settingImage/DocumentPreview";
import { removeBase64Prefix } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export const PreviewAndSign = ({ open, onClose, state, handleSubmitModel }) => {
  // console.log("state: ", state);
  const { t } = useTranslation();

  const imageRef = useRef(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const pageLayout = {
    transformSize: ({ size }) => ({
      height: size.height + 30,
      width: size.width + 30,
    }),
  };

  const renderPage = (pdfProps) => {
    return (
      <div
        className="tum lum"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        id={`pdf-view1-${pdfProps.pageIndex}`}
      >
        {" "}
        {state.data.signatureData && (
          <DocumentPreview ref={imageRef} pdfProps={pdfProps} state={state} />
        )}
        {pdfProps.canvasLayer.children}
        {pdfProps.annotationLayer.children}
        <div style={{ userSelect: "none" }}>{pdfProps.textLayer.children}</div>
      </div>
    );
  };

  renderPage.propTypes = {
    props: PropTypes.shape({
      canvasLayer: PropTypes.object.isRequired,
      annotationLayer: PropTypes.object.isRequired,
      textLayer: PropTypes.object.isRequired,
    }),
  };

  const handleSubmitClick = () => {
    html2canvas(imageRef.current, { backgroundColor: null }).then((canvas) => {
      const data64 = canvas.toDataURL();
      handleSubmitModel({
        ...state.data,
        signatureImage: removeBase64Prefix(data64),
      });
      onClose();
    });
  };
  return (
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
      open={!!open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "100%", // Set your width here
          height: "700px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{
          backgroundColor: "dialogBackground.main",
          p: "10px 20px",
          height: "51px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            display: "inline-block",
            color: "signingtextBlue.main",
            borderBottom: "4px solid",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
          }}
        >
          {/* {title} */}
          {t("0-common.preview")}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "dialogBackground.main",
          height: "100%",
          // py: "10px",
          borderBottom: "1px solid",
          borderColor: "borderColor.main",
          p: "0 20px ",
        }}
      >
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
          // className="choyoyoy"
        >
          <Stack sx={{ m: 0, height: "100%" }}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={`data:application/pdf;base64,${state.data.pdfContent}`}
                  plugins={[defaultLayoutPluginInstance]}
                  renderPage={renderPage}
                  pageLayout={pageLayout}
                />
              </Worker>
            </Box>
            {/* content */}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          //   disabled={isPending || isSubmitDisabled}
          //   startIcon={
          //     isPending ? <CircularProgress color="inherit" size="1em" /> : null
          //   }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PreviewAndSign.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  state: PropTypes.object,
  handleSubmitModel: PropTypes.func,
};

export default PreviewAndSign;
