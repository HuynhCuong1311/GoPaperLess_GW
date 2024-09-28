/* eslint-disable no-unused-vars */
import { ReactComponent as GiunIcon } from "@/assets/images/svg/congiun.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import "@/assets/style/react-resizable.css";
import { SignatureSetting } from "@/components/modal_setting";
import { SigDetail } from "@/components/SigningContent/PdfViewer";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { checkIsPosition, getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";

/* eslint-disable react/prop-types */
export const Signature = ({
  index,
  pdfPage,
  signatureData,
  workFlow,
  getFields,
}) => {
  const { t } = useTranslation();

  const [isOpenModalSetting, setOpenModalSetting] = useState([false]);
  const [dragPosition, setDragPosition] = useState({
    x: (signatureData.dimension?.x * pdfPage.width) / 100,
    y: (signatureData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(true);

  const [showTopbar, setShowTopbar] = useState(false);
  const [isShowSigDetail, setIsShowSigDetail] = useState(false);
  const [sigDetail, setSigDetail] = useState({});
  const queryClient = useQueryClient();
  const newPos = useRef({
    x: (signatureData.dimension?.x * pdfPage.width) / 100,
    y: (signatureData.dimension?.y * pdfPage.height) / 100,
  });
  const signer =
    workFlow.workflowProcessType !== "individual"
      ? getSigner(workFlow)
      : workFlow.participants;
  const signerId =
    workFlow.workflowProcessType === "individual"
      ? "GROUP_PROVIDER"
      : signer?.signerId;
  const [isSetPos, setIsSetPos] = useState(false);

  useEffect(() => {
    setDragPosition({
      x: (signatureData.dimension?.x * pdfPage.width) / 100,
      y: (signatureData.dimension?.y * pdfPage.height) / 100,
    });
  }, [signatureData]);

  useEffect(() => {
    const sigInfor = queryClient.getQueryData(["getSignedInfo"]) || [];
    const newSig1 =
      sigInfor
        ?.filter((item) => item.value.field_name === signatureData.field_name)
        ?.map((item) => ({ isSigned: true, ...item.value })) || [];

    setSigDetail(newSig1[0]);
  }, [signatureData, workFlow, queryClient]);

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - signatureData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - signatureData.dimension?.y)) / 100;

  const putSignature = UseUpdateSig();

  useEffect(() => {
    setIsSetPos(checkIsPosition(workFlow));
  }, [workFlow]);
  const removeSignature = async () => {
    const res = await fpsService.removeSignature(
      { documentId: workFlow.documentId },
      signatureData.field_name
    );

    if (res.status === 200) {
      getFields();
    }
  };

  const handleOpenModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = true;
    setOpenModalSetting(newValue);
  };

  const handleCloseModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = false;
    setOpenModalSetting(newValue);
  };

  const handleRemoveSignature = async () => {
    removeSignature();
  };

  const TopBar = ({ signatureData }) => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          display: signatureData.remark?.includes(
            workFlow.workFlowId + "_" + signerId
          )
            ? "flex"
            : "none",
          backgroundColor: "#D9DFE4",
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
            mx: "5px",
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
            display: isSetPos ? "none" : "block",
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(`rauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (signatureData.page !== null && signatureData.page !== pdfPage.currentPage)
    return null;

  return (
    <>
      <Draggable
        handle={`#sigDrag-${index}`}
        onDrag={() => handleDrag("block")}
        position={dragPosition}
        cancel=".topBar"
        onStart={(e, data) => {
          setDragPosition({ x: data.x, y: data.y });
          newPos.current.x = data.x;
          newPos.current.y = data.y;
          setIsControlled(false);
        }}
        onStop={async (e, data) => {
          setIsControlled(true);
          handleDrag("none");
          const draggableComponent = document.querySelector(
            `.signature-${index}`
          );
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

          if (isOverTarget) {
            return;
          } else {
            if (dragPosition?.x === data.x && dragPosition?.y === data.y) {
              return;
            }
            setDragPosition({ x: data.x, y: data.y });
            const rectComp = containerComponent.getBoundingClientRect();

            const rectItem = draggableComponent.getBoundingClientRect();

            const x =
              (Math.abs(rectItem.left - rectComp.left) * 100) / rectComp.width;

            const y =
              (Math.abs(rectItem.top - rectComp.top) * 100) / rectComp.height;
            const putpos = await fpsService.putSignature(
              {
                field_name: signatureData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: x,
                  y: y,
                  width: -1,
                  height: -1,
                },
                visible_enabled: true,
              },
              signatureData.type.toLowerCase(),
              workFlow.documentId
            );
            if (!putpos) return;
            getFields();
          }
        }}
        disabled={
          isSetPos ||
          !signatureData.remark?.includes(workFlow.workFlowId + "_" + signerId)
        }
      >
        <ResizableBox
          width={
            signatureData.dimension?.width
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            signatureData.dimension?.height
              ? signatureData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: signatureData.process_status === "PROCESSED" ? 0 : 1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            isSetPos ||
            workFlow.workFlowId +
              "_" +
              signerId +
              "_" +
              signatureData.type +
              "_" +
              signatureData.suffix !==
              signatureData.field_name
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? (pdfPage.width * 20) / 100
              : 200,
            isSetPos ||
            workFlow.workFlowId +
              "_" +
              signerId +
              "_" +
              signatureData.type +
              "_" +
              signatureData.suffix !==
              signatureData.field_name
              ? signatureData.dimension?.height * (pdfPage.height / 100)
              : 50,
          ]}
          maxConstraints={[
            isSetPos ||
            workFlow.workFlowId +
              "_" +
              signerId +
              "_" +
              signatureData.type +
              "_" +
              signatureData.suffix !==
              signatureData.field_name
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,
            isSetPos ||
            workFlow.workFlowId +
              "_" +
              signerId +
              "_" +
              signatureData.type +
              "_" +
              signatureData.suffix !==
              signatureData.field_name
              ? signatureData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          onResize={(e, { size }) => {}}
          onResizeStop={async (e, { size }) => {
            if (
              isSetPos ||
              workFlow.workFlowId +
                "_" +
                signerId +
                "_" +
                signatureData.type +
                "_" +
                signatureData.suffix !==
                signatureData.field_name
            )
              return;
            const putpos = await fpsService.putSignature(
              {
                field_name: signatureData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: -1,
                  y: -1,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
              },
              signatureData.type.toLowerCase(),
              workFlow.documentId
            );
            if (!putpos) return;
            getFields();
          }}
          className={`sig signature-${index}`}
        >
          <Box
            id={`sigDrag-${index}`}
            sx={{
              backgroundColor:
                signatureData.process_status === "PROCESSED" ||
                !signatureData.remark?.includes(
                  workFlow.workFlowId + "_" + signerId
                )
                  ? "rgba(217, 223, 228, 0.7)"
                  : "rgba(254, 240, 138, 0.7)",
              height: "100%",
              position: "relative",
              padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor:
                signatureData.process_status === "PROCESSED" ||
                !signatureData.remark?.includes(
                  workFlow.workFlowId + "_" + signerId
                )
                  ? "black"
                  : "#EAB308",
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
              if (signatureData.process_status === "PROCESSED") {
                setIsShowSigDetail(true);
              }
            }}
          >
            <div>
              {showTopbar && <TopBar signatureData={signatureData} />}
              <span
                className={`rauria-${index} topline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`rauria-${index} rightline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`rauria-${index} botline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`rauria-${index} leftline`}
                style={{ display: "none" }}
              ></span>
              <Box
                id="click-duoc"
                variant="h5"
                width={"100%"}
                borderBottom="2px dotted"
                borderColor={
                  !signatureData.remark?.includes(
                    workFlow.workFlowId + "_" + signerId
                  )
                    ? "black"
                    : "#EAB308"
                }
                textAlign={"center"}
                height="45px"
              >
                Signature
                <br />
                <SvgIcon
                  component={GiunIcon}
                  inheritViewBox
                  sx={{
                    width: "15px",
                    height: "15px",
                    color: "#545454",
                  }}
                />
              </Box>
            </div>
          </Box>
        </ResizableBox>
      </Draggable>

      {isOpenModalSetting[index] && (
        <SignatureSetting
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          signatureData={signatureData}
          workFlow={workFlow}
        />
      )}
      {isShowSigDetail && (
        <SigDetail
          open={isShowSigDetail}
          signDetail={sigDetail}
          handleClose={() => setIsShowSigDetail(false)}
        />
      )}
    </>
  );
};

export default Signature;
