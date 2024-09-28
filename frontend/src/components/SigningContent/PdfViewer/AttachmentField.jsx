import { ReactComponent as Attachment } from "@/assets/images/contextmenu/attachment.svg";
import { ReactComponent as ChaBonCau } from "@/assets/images/svg/cha_bon_cau.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { AttachmentSign, CameraSettingField } from "@/components/modalField";
import { UseFillForm, UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import {
  addBase64Prefix,
  checkTimeIsBeforeNow,
  getSigner,
  next,
} from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import { toast } from "react-toastify";

export const AttachmentField = ({ index, pdfPage, attachData, workFlow }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fillForm = UseFillForm();

  const [dragPosition, setDragPosition] = useState({
    x: (attachData.dimension?.x * pdfPage.width) / 100,
    y: (attachData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const boxRef = useRef(null);
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

  // const maxPosibleResizeWidth =
  //   (pdfPage.width * (100 - attachData.dimension?.x)) / 100;
  // const maxPosibleResizeHeight =
  //   (pdfPage.height * (100 - attachData.dimension?.y)) / 100;

  const putSignature = UseUpdateSig();

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        attachData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
    },
  });

  useEffect(() => {
    setDragPosition({
      x: (attachData.dimension?.x * pdfPage.width) / 100,
      y: (attachData.dimension?.y * pdfPage.height) / 100,
    });
  }, [attachData, pdfPage]);

  useEffect(() => {
    if (attachData.selected && boxRef.current && !scrolled) {
      // console.log("boxRef.current: ", boxRef.current);
      boxRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      setScrolled(true);
    }
    if (!attachData.selected) {
      setScrolled(false);
    }
  }, [attachData, scrolled]);

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
    // console.log("remove");
    // if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature.mutate();
  };

  const handleSubmit = async () => {
    if (checkTimeIsBeforeNow(workFlow.deadlineAt)) {
      // return next("Deadline time has passed. Please re-sign again.", 2000, "error");
      toast.error(t("signing.workflow_expỉred"));
      return;
    }
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
          // await getFields();
          queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
        },
      }
    );
  };

  const TopBar = ({ attachData }) => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          display:
            signer.signerStatus === 1 &&
            attachData.remark &&
            attachData.remark.includes(signerId) &&
            attachData.file
              ? "flex"
              : "none",
          // width: "100%",
          // display: "flex",
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
            display: "none",
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
            display: "none",
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
        onStop={(e, data) => {
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

            putSignature.mutate(
              {
                body: {
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
                field: "attachment",
                documentId: workFlow.documentId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            );
          }
        }}
        // disabled={
        //   (attachData.remark && !attachData.remark.includes(signerId)) ||
        //   attachData.process_status === "PROCESSED"
        // }
        disabled
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
            attachData.dimension?.width * (pdfPage.width / 100),
            attachData.dimension?.height * (pdfPage.height / 100),
          ]}
          maxConstraints={[
            attachData.dimension?.width * (pdfPage.width / 100),
            attachData.dimension?.height * (pdfPage.height / 100),
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={(e, { size }) => {
            // console.log("e: ", e);
            if (attachData.remark && !attachData.remark.includes(signerId))
              return;
            putSignature.mutate(
              {
                body: {
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
                field: "attachment",
                documentId: workFlow.documentId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            );
          }}
          className={`sig attach-${index}`}
        >
          <Box
            id={`attachDrag-${index}`}
            sx={{
              backgroundColor:
                attachData.verification ||
                (attachData.remark && !attachData.remark.includes(signerId))
                  ? "rgba(217, 223, 228, 0.7)"
                  : "rgba(254, 240, 138, 0.7)",
              ...(attachData.selected && next),
              height: "100%",
              position: "relative",
              // padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor:
                attachData.verification ||
                (attachData.remark && !attachData.remark.includes(signerId))
                  ? "black"
                  : "#EAB308",
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
                attachData.remark &&
                !attachData.remark.includes(signerId)
                // ||
                // (newPos.current.x !== dragPosition.x &&
                //   newPos.current.y !== dragPosition.y)
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
                style={{ width: "100%", height: "100%" }}
                ref={boxRef}
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
                {attachData.required.includes(signerId) && (
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
          getFields={() => {}}
        />
      )}
      <CameraSettingField
        open={isOpenModalSetting[index]}
        onClose={() => handleCloseModalSetting(index)}
        signer={signer}
        cameraData={attachData}
        workFlow={workFlow}
      />
    </>
  );
};

AttachmentField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  attachData: PropTypes.object,
  workFlow: PropTypes.object,
};

export default AttachmentField;
