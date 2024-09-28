import { SigDetail } from "@/components/SigningContent/PdfViewer";
import { validFocus } from "@/utils/commonFunction";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

export const Signature = ({ signatureData, pdfPage, index, validFile }) => {
  // console.log("validFile: ", validFile);
  // console.log("signatureData: ", signatureData);
  // console.log("pdfPage: ", pdfPage);
  const queryClient = useQueryClient();
  // const field = queryClient.getQueryData(["getField"]);

  const [isShowSigDetail, setIsShowSigDetail] = useState([false]);
  const [sigDetail, setSigDetail] = useState([]);
  // console.log("sigDetail: ", sigDetail);
  const [scrolled, setScrolled] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (signatureData.selected && boxRef.current && !scrolled) {
      // console.log("boxRef.current: ", boxRef.current);
      boxRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      setScrolled(true);
    }
    if (!signatureData.selected) {
      setScrolled(false);
    }
  }, [signatureData, scrolled]);

  useEffect(() => {
    const newSig1 = validFile?.signatures?.find(
      (item) => item.field_name === signatureData.field_name
    );
    // console.log("newSig1: ", newSig1);
    const newSig2 = validFile?.seals?.find(
      (item) => item.field_name === signatureData.field_name
    );
    // console.log("newSig2: ", newSig2);
    setSigDetail({ isSigned: true, ...newSig1, ...newSig2 });
  }, [signatureData, queryClient]);

  const toggleSigDetail = (index) => {
    const newIsOpen = [...isShowSigDetail];
    newIsOpen[index] = !newIsOpen[index];
    setIsShowSigDetail(newIsOpen);
  };

  if (signatureData.page !== null && signatureData.page !== pdfPage.currentPage)
    return null;

  return (
    <>
      <div
        ref={boxRef}
        style={{
          position: "absolute",
          zIndex: 100,
          opacity: 1,
          width: signatureData.dimension?.width * (pdfPage.width / 100),
          height: signatureData.dimension?.height * (pdfPage.height / 100),
          top: (signatureData.dimension?.y * pdfPage.height) / 100,
          left: (signatureData.dimension?.x * pdfPage.width) / 100,
          ...(signatureData.selected && validFocus),
        }}
        onClick={() => toggleSigDetail(index)}
      />

      {isShowSigDetail[index] && (
        <SigDetail
          open={isShowSigDetail[index]}
          signDetail={sigDetail}
          handleClose={() => toggleSigDetail(index)}
        />
      )}
    </>
  );
};

Signature.propTypes = {
  signatureData: PropTypes.object,
  pdfPage: PropTypes.object,
  index: PropTypes.number,
  validFile: PropTypes.object,
};

export default Signature;
