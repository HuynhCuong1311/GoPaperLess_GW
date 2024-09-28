/* eslint-disable no-unused-vars */
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { InitialsFieldSetting } from "@/components/modalField";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const Initial = ({
  index,
  pdfPage,
  initData,
  workFlow,
  totalPages,
  initList,
  getFields,
}) => {
  const queryClient = useQueryClient();

  const [dragPosition, setDragPosition] = useState({
    x: (initData.dimension?.x * pdfPage.width) / 100,
    y: (initData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);

  const newPos = useRef({ x: null, y: null });

  const signer =
    workFlow.workflowProcessType !== "individual"
      ? getSigner(workFlow)
      : workFlow.participants;
  const signerId =
    workFlow.workflowProcessType === "individual"
      ? "GROUP_PROVIDER"
      : signer?.signerId;

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - initData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - initData.dimension?.y)) / 100;

  const putSignature = UseUpdateSig();
  const removeSignature = async () => {
    const res = await fpsService.removeSignature(
      { documentId: workFlow.documentId },
      initData.field_name
    );
    if (res.status === 200) {
      await getFields();
    }
  };

  useEffect(() => {
    setDragPosition({
      x: (initData.dimension?.x * pdfPage.width) / 100,
      y: (initData.dimension?.y * pdfPage.height) / 100,
    });
  }, [initData]);

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

  const handleRemoveSignature = async () => {
    await removeSignature();
  };

  const TopBar = ({ initData }) => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          display:
            signerId + "_" + initData.type + "_" + initData.suffix ===
            initData.field_name
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
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(`initRauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (initData.page !== null && initData.page !== pdfPage.currentPage) ||
    initData.process_status === "PROCESSED"
  )
    return null;

  return (
    <>
      <Draggable
        handle={`#initDrag-${index}`}
        // bounds="parent"
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
          // console.log("data: ", data);
          // console.log("e: ", e);

          setIsControlled(true);
          handleDrag("none");
          const draggableComponent = document.querySelector(`.init-${index}`);
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
                field_name: initData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: x,
                  y: y,
                  width: -1,
                  height: -1,
                },
                visible_enabled: true,
              },
              "initials",
              workFlow.documentId
            );

            if (putpos.status !== 200) return;
            await getFields();
          }
        }}
        disabled={
          signerId + "_" + initData.type + "_" + initData.suffix !==
          initData.field_name
        }
      >
        <ResizableBox
          width={
            initData.dimension?.width
              ? initData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            initData.dimension?.height
              ? initData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: initData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[0, 0]}
          maxConstraints={[
            signerId + "_" + initData.type + "_" + initData.suffix !==
            initData.field_name
              ? initData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,

            signerId + "_" + initData.type + "_" + initData.suffix !==
            initData.field_name
              ? initData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          onResize={(e, { size }) => {}}
          onResizeStop={async (e, { size }) => {
            // console.log("e: ", e);
            if (
              signerId + "_" + initData.type + "_" + initData.suffix !==
              initData.field_name
            )
              return;
            const putpos = await fpsService.putSignature(
              {
                field_name: initData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: -1,
                  y: -1,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
              },
              "initials",
              workFlow.documentId
            );
            if (putpos.status !== 200) return;
            await getFields();
          }}
          className={`sig init-${index}`}
        >
          <Box
            id={`initDrag-${index}`}
            sx={{
              backgroundColor:
                initData.verification ||
                signerId + "_" + initData.type + "_" + initData.suffix !==
                  initData.field_name
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
                initData.verification ||
                signerId + "_" + initData.type + "_" + initData.suffix !==
                  initData.field_name
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
          >
            <div style={{ overflow: "hidden" }}>
              {showTopbar && <TopBar initData={initData} />}
              <span
                className={`initRauria-${index} topline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`initRauria-${index} rightline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`initRauria-${index} botline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`initRauria-${index} leftline`}
                style={{ display: "none" }}
              ></span>
              <span
                style={{
                  position: "absolute",
                  right: "2px",
                  top: "-2px",
                  color: "#EAB308",
                }}
              >
                *
              </span>
              Initials
            </div>
          </Box>
        </ResizableBox>
      </Draggable>

      {isOpenModalSetting[index] && (
        <InitialsFieldSetting
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          initData={initData}
          totalPages={totalPages}
          workFlow={workFlow}
          initList={initList}
          getFields={getFields}
        />
      )}
    </>
  );
};

Initial.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  initData: PropTypes.object,
  workFlow: PropTypes.object,
  totalPages: PropTypes.number,
  initList: PropTypes.array,
  getFields: PropTypes.func,
};

export default Initial;
