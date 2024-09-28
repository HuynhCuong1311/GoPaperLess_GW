import QryptoDetail from "@/components/SigningContent/PdfViewer/QryptoDetail";
import { UseGetQryptoInfo } from "@/hook/use-apiService";
import { validFocus } from "@/utils/commonFunction";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

export const Qrypto = ({ qryptoData, pdfPage, index, validFile }) => {
  const getQryptoInfo = UseGetQryptoInfo(qryptoData.qrypto_base45, index);

  const [isShowQryptoDetail, setIsShowQryptoDetail] = useState([false]);
  const [sigDetail, setSigDetail] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const boxRef = useRef(null);
  //   console.log("sigDetail: ", sigDetail);

  useEffect(() => {
    if (qryptoData.selected && boxRef.current && !scrolled) {
      // console.log("boxRef.current: ", boxRef.current);
      boxRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      setScrolled(true);
    }
    if (!qryptoData.selected) {
      setScrolled(false);
    }
  }, [qryptoData, scrolled]);

  useEffect(() => {
    const newSig1 = validFile?.signatures?.find(
      (item) => item.field_name === qryptoData.field_name
    );
    // console.log("newSig1: ", newSig1);
    const newSig2 = validFile?.seals?.find(
      (item) => item.field_name === qryptoData.field_name
    );
    // console.log("newSig2: ", newSig2);
    if (newSig1 || newSig2) {
      setSigDetail({ isSigned: true, ...newSig1, ...newSig2 });
    }
  }, [validFile]);

  const toggleQryptoDetail = (index) => {
    const newIsOpen = [...isShowQryptoDetail];
    newIsOpen[index] = !newIsOpen[index];
    setIsShowQryptoDetail(newIsOpen);
  };
  return (
    <>
      <div
        ref={boxRef}
        style={{
          position: "absolute",
          zIndex: 100,
          opacity: 1,
          width: qryptoData.dimension?.width * (pdfPage.width / 100),
          height: qryptoData.dimension?.height * (pdfPage.height / 100),
          top: (qryptoData.dimension?.y * pdfPage.height) / 100,
          left: (qryptoData.dimension?.x * pdfPage.width) / 100,
          ...(qryptoData.selected && validFocus),
        }}
        onClick={() => toggleQryptoDetail(index)}
      />

      {isShowQryptoDetail[index] && getQryptoInfo.data && (
        <QryptoDetail
          open={isShowQryptoDetail[index]}
          qryptoData={qryptoData}
          qryptoInfor={getQryptoInfo.data}
          sigDetail={sigDetail}
          handleClose={() => toggleQryptoDetail(index)}
        />
      )}
    </>
  );
};

Qrypto.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  qryptoData: PropTypes.object,
  workFlow: PropTypes.object,
  validFile: PropTypes.object,
};

export default Qrypto;
