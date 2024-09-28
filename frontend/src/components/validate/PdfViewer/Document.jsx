/* eslint-disable react/prop-types */
import { Qrypto, Signature } from "@/components/validate/PdfViewer";
import PropTypes from "prop-types";

export const Document = ({ props, signatures, qrypto, validFile }) => {
  const pdfPage = {
    currentPage: props.pageIndex + 1,
    height: props.height,
    width: props.width,
    zoom: props.scale,
    actualHeight: props.height / props.scale,
    actualWidth: props.width / props.scale,
    rotate: props.rotation,
  };
  return (
    <div>
      {props.canvasLayer.children}
      {signatures?.map((signatureData, index) => {
        if (signatureData.page !== props.pageIndex + 1) return null;
        return (
          <Signature
            key={index}
            index={index}
            pdfPage={pdfPage}
            signatureData={signatureData}
            validFile={validFile}
          />
        );
      })}
      {qrypto?.map((qryptoData, index) => {
        if (qryptoData.page !== props.pageIndex + 1) return null;
        return (
          <Qrypto
            key={index}
            index={index}
            pdfPage={pdfPage}
            qryptoData={qryptoData}
            validFile={validFile}
          />
        );
      })}
      {props.annotationLayer.children}
      <div style={{ userSelect: "none" }}>{props.textLayer.children}</div>
    </div>
  );
};

Document.propTypes = {
  props: PropTypes.object,
  signatures: PropTypes.array,
  qrypto: PropTypes.array,
};

export default Document;
