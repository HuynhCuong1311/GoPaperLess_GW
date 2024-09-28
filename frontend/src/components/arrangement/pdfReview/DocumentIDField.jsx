import { ReactComponent as Camera } from "@/assets/images/contextmenu/camera.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { DocumentIDSettingField } from "@/components/modalField";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const DocumentIDField = ({
  index,
  pdfPage,
  documentIDData,
  workFlow,
  getFields,
}) => {
  const [dragPosition, setDragPosition] = useState({
    x: (documentIDData.dimension?.x * pdfPage.width) / 100,
    y: (documentIDData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);

  const newPos = useRef({ x: null, y: null });
  const signer = getSigner(workFlow);
  const signerId = signer?.signerId;

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - documentIDData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - documentIDData.dimension?.y)) / 100;

  const removeSignature = async () => {
    const res = await fpsService.removeSignature(
      { documentId: workFlow.documentId },
      documentIDData.field_name
    );
    if (res.status === 200) {
      await getFields();
    }
  };

  useEffect(() => {
    setDragPosition({
      x: (documentIDData.dimension?.x * pdfPage.width) / 100,
      y: (documentIDData.dimension?.y * pdfPage.height) / 100,
    });
  }, [documentIDData, pdfPage]);

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

  const TopBar = () => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          //   display:
          //     signerId + "_" + cameraData.type + "_" + cameraData.suffix ===
          //     cameraData.field_name
          //       ? "flex"
          //       : "none",
          //   width: "100%",
          display: "flex",
          backgroundColor: "#D9DFE4",
        }}
        className="topBar"
      >
        {/* <SvgIcon
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
        /> */}
        <SvgIcon
          component={GarbageIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
            // display: isSetPos ? "none" : "block",
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(
      `documentIDRauria-${index}`
    );

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (documentIDData.page !== null &&
      documentIDData.page !== pdfPage.currentPage) ||
    documentIDData.process_status === "PROCESSED"
  )
    return null;

  return (
    <>
      <Draggable
        handle={`#documentIDDrag-${index}`}
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
          const draggableComponent = document.querySelector(
            `.documentID-${index}`
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
                field_name: documentIDData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: x,
                  y: y,
                  width: -1,
                  height: -1,
                },
                visible_enabled: true,
              },
              "text",
              workFlow.documentId
            );

            if (putpos.status !== 200) return;
            await getFields();
          }
        }}
        disabled={documentIDData.process_status === "PROCESSED"}
      >
        <ResizableBox
          width={
            documentIDData.dimension?.width
              ? documentIDData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            documentIDData.dimension?.height
              ? documentIDData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: documentIDData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            documentIDData.process_status === "PROCESSED"
              ? documentIDData.dimension?.width * (pdfPage.width / 100)
              : 0,
            documentIDData.process_status === "PROCESSED"
              ? documentIDData.dimension?.height * (pdfPage.height / 100)
              : 0,
          ]}
          maxConstraints={[
            documentIDData.process_status === "PROCESSED"
              ? documentIDData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,
            documentIDData.process_status === "PROCESSED"
              ? documentIDData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={async (e, { size }) => {
            // console.log("e: ", e);
            if (
              signerId +
                "_" +
                documentIDData.type +
                "_" +
                documentIDData.suffix !==
              documentIDData.field_name
            )
              return;

            const putpos = await fpsService.putSignature(
              {
                field_name: documentIDData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: -1,
                  y: -1,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
              },
              "text",
              workFlow.documentId
            );
            if (putpos.status !== 200) return;
            await getFields();
          }}
          className={`sig documentID-${index}`}
        >
          <Box
            id={`documentIDDrag-${index}`}
            sx={{
              backgroundColor:
                !signer ||
                (signer && documentIDData.remark.includes(signer.signerId))
                  ? "rgba(254, 240, 138, 0.7)"
                  : "rgba(217, 223, 228, 0.7)",
              height: "100%",
              position: "relative",
              // padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor:
                !signer ||
                (signer && documentIDData.remark.includes(signer.signerId))
                  ? "#EAB308"
                  : "black",
            }}
            onMouseMove={() => {
              setShowTopbar(true);
            }}
            onMouseLeave={() => {
              setShowTopbar(false);
            }}
            onMouseDown={() => {
              setTimeout(() => {
                setShowTopbar(false);
              }, 500);
            }}
            // onClick={(e) => {
            //   if (
            //     signerId + "_" + cameraData.type + "_" + cameraData.suffix !==
            //       cameraData.field_name ||
            //     (newPos.current.x !== dragPosition.x &&
            //       newPos.current.y !== dragPosition.y)
            //   ) {
            //     return;
            //   } else if (
            //     e.target.id === `sealDrag-${index}` ||
            //     e.target.parentElement?.id === `sealDrag-${index}` ||
            //     e.target.id === "click-duoc"
            //   ) {
            //     handleOpenSigningForm(index);
            //   }
            // }}
          >
            <div
              style={{
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                gap: "4px",
              }}
            >
              {showTopbar && <TopBar documentIDData={documentIDData} />}
              <span
                className={`documentIDRauria-${index} topline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`documentIDRauria-${index} rightline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`documentIDRauria-${index} botline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`documentIDRauria-${index} leftline`}
                style={{ display: "none" }}
              ></span>
              {documentIDData.show_icon_enabled && <Camera />}
              <Typography>{documentIDData.place_holder}</Typography>
              {/* Camera */}
            </div>
          </Box>
        </ResizableBox>
      </Draggable>

      {isOpenModalSetting[index] && (
        <DocumentIDSettingField
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          documentIDData={documentIDData}
          workFlow={workFlow}
        />
      )}
    </>
  );
};

DocumentIDField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  documentIDData: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};

export default DocumentIDField;
