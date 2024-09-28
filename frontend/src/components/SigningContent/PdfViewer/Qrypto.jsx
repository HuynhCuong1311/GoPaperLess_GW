/* eslint-disable no-unused-vars */
import qrypto from "@/assets/images/qrcode-qrypto.png";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { QryptoSettingField } from "@/components/modalField";
import { UseGetQryptoInfo } from "@/hook/use-apiService";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import QryptoDetail from "./QryptoDetail";

export const Qrypto = ({
  index,
  pdfPage,
  qryptoData,
  workFlow,
  setQryptoInfo,
}) => {
  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();
  const getQryptoInfo = UseGetQryptoInfo(qryptoData.qrypto_base45, index);

  const [sigDetail, setSigDetail] = useState([]);

  useEffect(() => {
    const sigInfor = queryClient.getQueryData(["getSignedInfo"]) || [];
    const newSig1 = sigInfor?.find(
      (item) => item.value.field_name === qryptoData.field_name
    );

    setSigDetail({ isSigned: true, ...newSig1 });
  }, [qryptoData]);

  const signer = getSigner(workFlow);
  const signerId = signer.signerId;

  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);
  const [isShowQryptoDetail, setIsShowQryptoDetail] = useState([false]);

  const [dragPosition, setDragPosition] = useState({
    x: (qryptoData.dimension?.x * pdfPage.width) / 100,
    y: (qryptoData.dimension?.y * pdfPage.height) / 100,
  });

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - qryptoData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - qryptoData.dimension?.y)) / 100;

  useEffect(() => {
    setDragPosition({
      x: (qryptoData.dimension?.x * pdfPage.width) / 100,
      y: (qryptoData.dimension?.y * pdfPage.height) / 100,
    });
  }, [qryptoData, pdfPage]);

  useEffect(() => {
    if (getQryptoInfo.data && !sigDetail.id && qryptoData.items) {
      setQryptoInfo(getQryptoInfo.data);
    }
  }, [getQryptoInfo.data]);

  const toggleQryptoDetail = (index) => {
    const newIsOpen = [...isShowQryptoDetail];
    newIsOpen[index] = !newIsOpen[index];
    setIsShowQryptoDetail(newIsOpen);
  };

  const handleOpenModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = true;
    setIsOpenModalSetting(newValue);
  };

  const handleCloseModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = false;
    setIsOpenModalSetting(newValue);
  };
  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        qryptoData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
    },
  });

  const handleRemoveSignature = async () => {
    removeSignature.mutate();
  };

  const TopBar = () => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          display: "none",
          backgroundColor: "#D9DFE4",
          gap: "5px",
        }}
        className="topBar"
      >
        <SvgIcon
          component={SettingIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
          }}
          onClick={() => handleOpenModalSetting(index)}
        />
        <SvgIcon
          component={GarbageIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(`qryptorauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (qryptoData.page !== null && qryptoData.page !== pdfPage.currentPage)
    return null;

  return (
    <>
      <Draggable
        handle={`#qryptoDrag-${index}`}
        // bounds="parent"
        onDrag={() => handleDrag("block")}
        position={dragPosition}
        cancel=".topBar"
        onStart={(e, data) => {
          setDragPosition({ x: data.x, y: data.y });
          setIsControlled(false);
        }}
        onStop={(e, data) => {
          e.preventDefault();
          setIsControlled(true);
          handleDrag("none");
          const draggableComponent = document.querySelector(`.qrypto-${index}`);
          const targetComponents = document.querySelectorAll(".sig");
          const containerComponent = document.getElementById(
            `pdf-view-${pdfPage.currentPage - 1}`
          );

          const containerRect = containerComponent.getBoundingClientRect();

          const draggableRect = draggableComponent.getBoundingClientRect();

          if (
            draggableRect.right > containerRect.right ||
            draggableRect.left < containerRect.left ||
            draggableRect.bottom > containerRect.bottom ||
            draggableRect.top < containerRect.top
          ) {
            return;
          }
          let isOverTarget = false;

          targetComponents.forEach((targetComponent) => {
            if (isOverTarget) return;

            const targetRect = targetComponent.getBoundingClientRect();

            if (draggableComponent === targetComponent) return;

            if (
              draggableRect.left < targetRect.right &&
              draggableRect.right > targetRect.left &&
              draggableRect.top < targetRect.bottom &&
              draggableRect.bottom > targetRect.top
            ) {
              isOverTarget = true;
              console.log("Draggable component is over the target component");
            }
          });

          if (
            (dragPosition?.x === data.x && dragPosition?.y === data.y) ||
            isOverTarget
          ) {
            return;
          }
          setDragPosition({ x: data.x, y: data.y });
          const rectComp = containerComponent.getBoundingClientRect();
          // console.log("rectComp: ", rectComp);

          const rectItem = draggableComponent.getBoundingClientRect();
          // console.log("rectItem: ", rectItem);

          const x =
            (Math.abs(rectItem.left - rectComp.left) * 100) / rectComp.width;

          const y =
            (Math.abs(rectItem.top - rectComp.top) * 100) / rectComp.height;

          putSignature.mutate(
            {
              body: {
                field_name: qryptoData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: x,
                  y: y,
                  width: -1,
                  height: -1,
                },
                visible_enabled: true,
              },
              field: "qrcode-qrypto",
              documentId: workFlow.documentId,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["getField"] });
              },
            }
          );
        }}
        disabled={
          signerId + "_" + qryptoData.type + "_" + qryptoData.suffix !==
          qryptoData.field_name
        }
      >
        <ResizableBox
          width={
            qryptoData.dimension?.width
              ? qryptoData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            qryptoData.dimension?.height
              ? qryptoData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: qryptoData.process_status === "PROCESSED" ? 0 : 1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            signerId + "_" + qryptoData.type + "_" + qryptoData.suffix !==
            qryptoData.field_name
              ? qryptoData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? 120
              : 200,

            signerId + "_" + qryptoData.type + "_" + qryptoData.suffix !==
            qryptoData.field_name
              ? qryptoData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? 120
              : 50,
          ]}
          maxConstraints={[
            signerId + "_" + qryptoData.type + "_" + qryptoData.suffix !==
            qryptoData.field_name
              ? qryptoData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,

            signerId + "_" + qryptoData.type + "_" + qryptoData.suffix !==
            qryptoData.field_name
              ? qryptoData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          lockAspectRatio={true}
          onResize={(e, { size }) => {}}
          onResizeStop={(e, { size }) => {
            // console.log("e: ", e);
            if (
              signerId + "_" + qryptoData.type + "_" + qryptoData.suffix !==
              qryptoData.field_name
            )
              return;
            putSignature.mutate(
              {
                body: {
                  field_name: qryptoData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: -1,
                    y: -1,
                    width: (size.width / pdfPage.width) * 100,
                    height: (size.height / pdfPage.height) * 100,
                  },
                  visible_enabled: true,
                },
                field: "qrcode-qrypto",
                documentId: workFlow.documentId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            );
          }}
          className={`sig qrypto-${index}`}
        >
          <Box
            id={`qryptoDrag-${index}`}
            sx={{
              height: "100%",
              position: "relative",
              // padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px solid",
              borderColor: "#e1e1e1",
            }}
            onMouseMove={(e) => {
              setShowTopbar(true);
            }}
            onMouseLeave={(e) => {
              setShowTopbar(false);
            }}
            onMouseDown={(e) => {
              setTimeout(() => {
                setShowTopbar(false);
              }, 500);
            }}
            onClick={(e) => {
              if (qryptoData.process_status === "PROCESSED") {
                console.log("kìn chá nà");
                toggleQryptoDetail(index);
              }
            }}
          >
            {showTopbar && <TopBar qryptoData={qryptoData} />}
            <span
              className={`qryptorauria-${index} topline`}
              style={{ display: "none" }}
            ></span>
            <span
              className={`qryptorauria-${index} rightline`}
              style={{ display: "none" }}
            ></span>
            <span
              className={`qryptorauria-${index} botline`}
              style={{ display: "none" }}
            ></span>
            <span
              className={`qryptorauria-${index} leftline`}
              style={{ display: "none" }}
            ></span>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                backgroundImage: qryptoData.image_qr
                  ? `url(data:image/png;base64,${qryptoData.image_qr})`
                  : `url(${qrypto})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              alt="The house from the offer."
            />
          </Box>
        </ResizableBox>
      </Draggable>
      {isOpenModalSetting[index] && (
        <QryptoSettingField
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          qryptoData={qryptoData}
          workFlow={workFlow}
        />
      )}
      {isShowQryptoDetail[index] && getQryptoInfo.data && (
        <QryptoDetail
          open={isShowQryptoDetail[index]}
          qryptoData={qryptoData}
          qryptoInfor={getQryptoInfo.data}
          sigDetail={sigDetail.value}
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
  setQryptoInfo: PropTypes.func,
};

export default Qrypto;
