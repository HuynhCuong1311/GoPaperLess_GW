/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { UseUpdateSig } from "@/hook/use-fpsService";
import { removeBase64Prefix } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useQueryClient } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import { forwardRef, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PreviewDocument } from ".";

export const ReviewSign = forwardRef(
  (
    {
      open,
      handleOpenResize,
      dataSigning,
      setDataSigning,
      headerFooter,
      formattedDatetime,
      isSubmitDisabled,
      onDisableSubmit,
      watch,
      control,
      value,
      signatureData,
      pdfPage,
      index,
      workFlow,
      setImgBase64,
      handleShowmodal,
      onClose,
      onClose2,
    },
    ref
  ) => {
    // console.log("signatureData: ", signatureData);
    // console.log("isSubmitDisabled: ", isSubmitDisabled);
    const { t } = useTranslation();
    const putSignature = UseUpdateSig();
    const queryClient = useQueryClient();
    const textElement = useRef(null);
    // const [location, setLocation] = useState(dragPosition);

    const [dimension, setDimension] = useState({
      width: signatureData.dimension?.width,
      height: signatureData.dimension?.height,
    });

    const firstPos = useRef({
      x: signatureData.dimension?.x,
      y: signatureData.dimension?.y,
      width: signatureData.dimension?.width,
      height: signatureData.dimension?.height,
    });

    const [disabled, setDisabled] = useState(false);

    // useEffect(() => {
    //   setDimension({
    //     x: signatureData.dimension.x,
    //     y: signatureData.dimension.y,
    //     width: -1,
    //     height: -1,
    //   });
    // }, [open]);
    // console.log("dimension: ", dimension);
    // function handleSign() {
    //   putSignature.mutate({
    //     body: {
    //       field_name: signatureData.field_name,
    //       page: pdfPage.currentPage,
    //       dimension: dimension,
    //       visible_enabled: true,
    //     },
    //     field: signatureData.type.toLowerCase(),
    //     documentId: workFlow.documentId,
    //   });
    // }

    const handleSubmit = () => {
      setDisabled(true);
      // putSignature.mutate(
      //   {
      //     body: {
      //       field_name: signatureData.field_name,
      //       page: pdfPage.currentPage,
      //       dimension: {
      //         x: dimension.x !== signatureData.dimension.x ? dimension.x : -1,
      //         y: dimension.y !== signatureData.dimension.y ? dimension.y : -1,
      //         width:
      //           dimension.width !== signatureData.dimension.width
      //             ? dimension.width
      //             : -1,
      //         height:
      //           dimension.height !== signatureData.dimension.height
      //             ? dimension.height
      //             : -1,
      //       },
      //       visible_enabled: true,
      //     },
      //     field: signatureData.type.toLowerCase(),
      //     documentId: workFlow.documentId,
      //   },
      //   {
      //     onSuccess: () => {
      //       html2canvas(textElement.current, { backgroundColor: null }).then(
      //         (canvas) => {
      //           const data64 = canvas.toDataURL();

      //           setDataSigning({
      //             ...dataSigning,
      //             imageBase64: removeBase64Prefix(data64),
      //           });
      //           onClose();
      //           onClose2();
      //           queryClient.invalidateQueries({ queryKey: ["getField"] });
      //           setDisabled(false);
      //           handleShowmodal();
      //         }
      //       );
      //     },
      //   }
      // );
      html2canvas(textElement.current, { backgroundColor: null }).then(
        (canvas) => {
          const data64 = canvas.toDataURL();

          setDataSigning({
            ...dataSigning,
            imageBase64: removeBase64Prefix(data64),
          });
          onClose();
          onClose2();
          // queryClient.invalidateQueries({ queryKey: ["getField"] });
          setDisabled(false);
          handleShowmodal();
        }
      );
    };

    const renderPage = (props) => {
      return (
        <PreviewDocument
          props={props}
          signatureData={signatureData}
          index={index}
          dimension={dimension}
          setDimension={setDimension}
          workFlow={workFlow}
          value={value}
          control={control}
          watch={watch}
          textElement={textElement}
          dataSigning={dataSigning}
          headerFooter={headerFooter}
          formattedDatetime={formattedDatetime}
          onDisableSubmit={onDisableSubmit}
        />
      );
    };

    // useEffect(() => {
    //   console.log(11);
    //   html2canvas(textElement?.current, { backgroundColor: null }).then(
    //     (canvas) => {
    //       const data64 = canvas.toDataURL();
    //       setImgBase64(data64);
    //       console.log(12);
    //     }
    //   );
    // }, [signatureData]);
    const pageLayout = {
      transformSize: ({ size }) => ({
        height: size.height + 30,
        width: size.width + 30,
      }),
    };
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "70%",
            width: "100%",
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
            overflow: "scroll",
          }}
        >
          <Box
            sx={{
              width: "100%",
              position: "relative",
            }}
          >
            {/* <PDFViewer
              base64={workFlow.pdfBase64}
              renderPage={renderPage}
              pageLayout={pageLayout}
            /> */}
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={`data:application/pdf;base64,${workFlow.pdfBase64}`}
                plugins={[defaultLayoutPluginInstance]}
                renderPage={renderPage}
                pageLayout={pageLayout}
              />
            </Worker>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
          <Button
            variant="outlined"
            sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
            onClick={() => {
              // setLocation(dragPosition);
              putSignature.mutate(
                {
                  body: {
                    field_name: signatureData.field_name,
                    page: pdfPage.currentPage,
                    dimension: {
                      x: firstPos.current.x,
                      y: firstPos.current.y,
                      width: firstPos.current.width,
                      height: firstPos.current.height,
                    },
                    visible_enabled: true,
                  },
                  field: signatureData.type.toLowerCase(),
                  documentId: workFlow.documentId,
                },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: ["getField"],
                    });
                    handleOpenResize(false);
                    setImgBase64(null);
                  },
                }
              );
            }}
          >
            {t("0-common.cancel")}
          </Button>
          <Button
            variant="contained"
            disabled={disabled}
            sx={{
              borderRadius: "10px",
              borderColor: "borderColor.main",
              marginLeft: "20px !important",
            }}
            type="button"
            onClick={handleSubmit}
          >
            {t("0-common.continue")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

ReviewSign.displayName = "ReviewSign";
