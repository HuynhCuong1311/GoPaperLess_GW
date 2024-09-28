import { ReactComponent as Attachment } from "@/assets/images/contextmenu/attachment.svg";
import { ReactComponent as ChaBonCau } from "@/assets/images/svg/cha_bon_cau.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { AttachmentSign, CameraSettingField } from "@/components/modalField";
import { UseFillForm } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { addBase64Prefix, getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const AttachmentField = ({
  index,
  pdfPage,
  attachData,
  workFlow,
  getFields,
}) => {
  const fillForm = UseFillForm();
  const queryClient = useQueryClient();

  const [dragPosition, setDragPosition] = useState({
    x: (attachData.dimension?.x * pdfPage.width) / 100,
    y: (attachData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenSigningForm, setOpenSigningForm] = useState([false]);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);
  const [initFile, setInitFile] = useState(() => {
    if (attachData.file) {
      const newBase64 = addBase64Prefix(
        attachData.file.value,
        attachData.file.file_extension
      );
      fetch(newBase64.newString).then((res) => {
        res.arrayBuffer().then((buf) => {
          const file = new File([buf], attachData.file.file_name, {
            type: newBase64.mimeType,
          });
          return file;
        });
      });
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (attachData.file) {
      const newBase64 = addBase64Prefix(
        attachData.file.value,
        attachData.file.file_extension
      );
      fetch(newBase64.newString).then((res) => {
        res.arrayBuffer().then((buf) => {
          const file = new File([buf], attachData.file.file_name, {
            type: newBase64.mimeType,
          });
          setInitFile(file);
        });
      });
    }
  }, [attachData.file]);

  const newPos = useRef({ x: null, y: null });
  const signer = getSigner(workFlow);
  const signerId = signer?.signerId;

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - attachData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - attachData.dimension?.y)) / 100;

  const removeSignature = async () => {
    const res = await fpsService.removeSignature(
      { documentId: workFlow.documentId },
      attachData.field_name
    );
    if (res.status === 200) {
      await getFields();
    }
  };

  useEffect(() => {
    setDragPosition({
      x: (attachData.dimension?.x * pdfPage.width) / 100,
      y: (attachData.dimension?.y * pdfPage.height) / 100,
    });
  }, [attachData, pdfPage]);

  const handleOpenSigningForm = (index) => {
    const newValue = [...isOpenSigningForm];
    newValue[index] = true;
    setOpenSigningForm(newValue);
  };

  const handleCloseSigningForm = (index) => {
    const newValue = [...isOpenSigningForm];
    newValue[index] = false;
    setOpenSigningForm(newValue);
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

  const handleRemoveSignature = async () => {
    await removeSignature();
  };

  const handleSubmit = async () => {
    fillForm.mutate(
      {
        body: [
          {
            field_name: attachData.field_name,
            // value: attachData,
          },
        ],
        type: "attachment",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: async () => {
          await getFields();
          // queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
          queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
        },
      }
    );
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
        <SvgIcon
          component={ChaBonCau}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
            display: attachData.file ? "block" : "none",
          }}
          onClick={handleSubmit}
        />
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
            // display: isSetPos ? "none" : "block",
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(`attachRauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (attachData.page !== null && attachData.page !== pdfPage.currentPage) ||
    attachData.process_status === "PROCESSED"
  )
    return null;
  return (
    <>
      <Draggable
        handle={`#attachDrag-${index}`}
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
          const draggableComponent = document.querySelector(`.attach-${index}`);
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
                field_name: attachData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: x,
                  y: y,
                  width: -1,
                  height: -1,
                },
                visible_enabled: true,
              },
              "attachment",
              workFlow.documentId
            );

            if (putpos.status !== 200) return;
            await getFields();
          }
        }}
        disabled={attachData.process_status === "PROCESSED"}
      >
        <ResizableBox
          width={
            attachData.dimension?.width
              ? attachData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            attachData.dimension?.height
              ? attachData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: attachData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            attachData.process_status === "PROCESSED"
              ? attachData.dimension?.width * (pdfPage.width / 100)
              : 0,
            attachData.process_status === "PROCESSED"
              ? attachData.dimension?.height * (pdfPage.height / 100)
              : 0,
          ]}
          maxConstraints={[
            attachData.process_status === "PROCESSED"
              ? attachData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,
            attachData.process_status === "PROCESSED"
              ? attachData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={async (e, { size }) => {
            // console.log("e: ", e);
            if (attachData.remark && !attachData.remark.includes(signerId))
              return;

            const putpos = await fpsService.putSignature(
              {
                field_name: attachData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: -1,
                  y: -1,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
              },
              "attachment",
              workFlow.documentId
            );
            if (putpos.status !== 200) return;
            await getFields();
          }}
          className={`sig attach-${index}`}
        >
          <Box
            id={`attachDrag-${index}`}
            sx={{
              backgroundColor:
                !signer ||
                (signer && attachData.remark.includes(signer.signerId))
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
                (signer && attachData.remark.includes(signer.signerId))
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
            onClick={(e) => {
              if (
                newPos.current.x !== dragPosition.x &&
                newPos.current.y !== dragPosition.y
              ) {
                return;
              } else if (
                e.target.id === `attachDrag-${index}` ||
                e.target.parentElement?.id === `attachDrag-${index}` ||
                e.target.id === "click-duoc"
              ) {
                handleOpenSigningForm(index);
              }
            }}
          >
            <Tooltip title={attachData.tool_tip_text} placement="bottom">
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
              >
                {showTopbar && <TopBar attachData={attachData} />}
                <span
                  className={`attachRauria-${index} topline`}
                  // style={{ display: "none" }}
                ></span>
                <span
                  className={`attachRauria-${index} rightline`}
                  // style={{ display: "none" }}
                ></span>
                <span
                  className={`attachRauria-${index} botline`}
                  // style={{ display: "none" }}
                ></span>
                <span
                  className={`attachRauria-${index} leftline`}
                  style={{ left: "-11px" }}
                ></span>

                {attachData.show_icon_enabled && <Attachment />}
                <Typography id="click-duoc" sx={{ color: "#a19b6e" }}>
                  {attachData.place_holder}
                </Typography>
                {signer && attachData.required.includes(signer.signerId) && (
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
                )}
              </Stack>
            </Tooltip>
          </Box>
        </ResizableBox>
      </Draggable>

      {isOpenSigningForm[index] && (
        <AttachmentSign
          open={isOpenSigningForm[index]}
          onClose={() => handleCloseSigningForm(index)}
          cameraData={attachData}
          workFlow={workFlow}
          initFile={initFile}
          getFields={getFields}
        />
      )}
      {isOpenModalSetting[index] && (
        <CameraSettingField
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          cameraData={attachData}
          workFlow={workFlow}
          getFields={getFields}
        />
      )}
    </>
  );
};

AttachmentField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  attachData: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};

export default AttachmentField;
