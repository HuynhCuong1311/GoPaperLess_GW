/* eslint-disable react/prop-types */
import "@/assets/style/pdfViewer.css";
import Document from "@/components/validate/PdfViewer/Document";
import { useAppContext } from "@/hook/use-appContext";
import { Box } from "@mui/material";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export const PDFViewer = ({ validFile, field }) => {
  const { sigSelected, blink } = useAppContext();
  const renderPage = (props) => {
    return (
      <div
        className={`cuong-page-${props.pageIndex}`}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Document
          props={props}
          validFile={validFile}
          signatures={field?.signature.map((item) => ({
            ...item,
            selected: item.field_name === sigSelected && blink ? true : false,
          }))}
          qrypto={field?.qrypto.map((item) => ({
            ...item,
            selected: item.field_name === sigSelected && blink ? true : false,
          }))}
        />
      </div>
    );
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const pageLayout = {
    transformSize: ({ size }) => ({
      height: size.height + 30,
      width: size.width + 30,
    }),
  };
  return (
    <Box
      height="100%"
      width="100%"
      className="review_pdf"
      onContextMenu={() => {
        // console.log("event: ", event);
        return;
        // event.preventDefault();
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={`data:application/pdf;base64,${validFile?.base64}`}
          plugins={[defaultLayoutPluginInstance]}
          renderPage={renderPage}
          pageLayout={pageLayout}
        />
      </Worker>
    </Box>
  );
};

export default PDFViewer;
