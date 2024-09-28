import { ReactComponent as ChaBonCau } from "@/assets/images/svg/cha_bon_cau.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ToggleSettingField } from "@/components/modalField";
import { UseFillForm, UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const ToggleField = ({
  index,
  pdfPage,
  toggleData,
  workFlow,
  getFields,
}) => {
  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();
  const fillForm = UseFillForm();

  const [dragPosition, setDragPosition] = useState({
    x: (toggleData.dimension?.x * pdfPage.width) / 100,
    y: (toggleData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);
  const [toggleValue, setToggleValue] = useState(
    toggleData.value || toggleData.toggle_item.default_item
  );

  // useEffect(() => {
  //   setToggleValue(toggleData.value || toggleData.toggle_item.default_item);
  // }, [toggleData]);

  useEffect(() => {
    const index = toggleData.toggle_item.items.find(
      (item) => item.value === toggleData.value
    );
    if (!index) {
      setToggleValue(toggleData.toggle_item.default_item);
    } else {
      setToggleValue(toggleData.value);
    }
  }, [toggleData]);

  const newPos = useRef({ x: null, y: null });
  const signer = getSigner(workFlow);
  const signerId = signer?.signerId;

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - toggleData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - toggleData.dimension?.y)) / 100;

  const removeSignature = async () => {
    const res = await fpsService.removeSignature(
      { documentId: workFlow.documentId },
      toggleData.field_name
    );
    if (res.status === 200) {
      await getFields();
    }
  };

  useEffect(() => {
    setDragPosition({
      x: (toggleData.dimension?.x * pdfPage.width) / 100,
      y: (toggleData.dimension?.y * pdfPage.height) / 100,
    });
  }, [toggleData, pdfPage]);

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

  const handleToggle = (data) => {
    if (
      (newPos.current.x !== dragPosition.x &&
        newPos.current.y !== dragPosition.y) ||
      toggleData.toggle_item.items.length === 1
    ) {
      return;
    }
    const currentIndex = toggleData.toggle_item.items.findIndex(
      (item) => item.text === data
    );
    if (currentIndex !== -1) {
      setToggleValue(
        currentIndex === toggleData.toggle_item.items.length - 1
          ? toggleData.toggle_item.items[0].text
          : toggleData.toggle_item.items[currentIndex + 1].text
      );
    }
    putSignature.mutate(
      {
        body: {
          field_name: toggleData.field_name,
          visible_enabled: true,
          value:
            currentIndex === toggleData.toggle_item.items.length - 1
              ? toggleData.toggle_item.items[0].text
              : toggleData.toggle_item.items[currentIndex + 1].text,
          type: toggleData.type,
        },
        field: "toggle",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: async () => {
          await getFields();
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const handleSubmit = async () => {
    fillForm.mutate(
      {
        body: [
          {
            field_name: toggleData.field_name,
            value: toggleValue,
          },
        ],
        type: "toggle",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: async () => {
          await getFields();
          queryClient.invalidateQueries({ queryKey: ["getField"] });
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
            display: toggleData.value ? "block" : "none",
          }}
          onClick={() => {
            handleSubmit();
          }}
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
    const elements = document.getElementsByClassName(`toggleRauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (toggleData.page !== null && toggleData.page !== pdfPage.currentPage) ||
    toggleData.process_status === "PROCESSED"
  )
    return null;

  return (
    <>
      <Draggable
        handle={`#toggleDrag-${index}`}
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
          setIsControlled(true);
          handleDrag("none");
          const draggableComponent = document.querySelector(`.toggle-${index}`);
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
                field_name: toggleData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: x,
                  y: y,
                  width: -1,
                  height: -1,
                },
                visible_enabled: true,
                toogle_item: toggleData.toogle_item,
              },
              "toggle",
              workFlow.documentId
            );

            if (putpos.status !== 200) return;
            await getFields();
          }
        }}
        disabled={toggleData.process_status === "PROCESSED"}
      >
        <ResizableBox
          width={
            toggleData.dimension?.width
              ? toggleData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            toggleData.dimension?.height
              ? toggleData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: toggleData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            toggleData.process_status === "PROCESSED"
              ? toggleData.dimension?.width * (pdfPage.width / 100)
              : 0,
            toggleData.process_status === "PROCESSED"
              ? toggleData.dimension?.height * (pdfPage.height / 100)
              : 0,
          ]}
          maxConstraints={[
            toggleData.process_status === "PROCESSED"
              ? toggleData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,
            toggleData.process_status === "PROCESSED"
              ? toggleData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={async (e, { size }) => {
            // console.log("e: ", e);
            if (
              signerId + "_" + toggleData.type + "_" + toggleData.suffix !==
              toggleData.field_name
            )
              return;

            const putpos = await fpsService.putSignature(
              {
                field_name: toggleData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: -1,
                  y: -1,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
                toogle_item: toggleData.toogle_item,
              },
              "toggle",
              workFlow.documentId
            );
            if (putpos.status !== 200) return;
            await getFields();
          }}
          className={`sig toggle-${index}`}
        >
          <Box
            id={`toggleDrag-${index}`}
            sx={{
              backgroundColor:
                !signer ||
                (signer && toggleData.remark.includes(signer.signerId))
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
                (signer && toggleData.remark.includes(signer.signerId))
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
            <Tooltip title={toggleData.tool_tip_text} placement="bottom">
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
                {showTopbar && <TopBar toggleData={toggleData} />}
                <span
                  className={`toggleRauria-${index} topline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`toggleRauria-${index} rightline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`toggleRauria-${index} botline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`toggleRauria-${index} leftline`}
                  style={{ display: "none" }}
                ></span>
                {/* {toggleData.show_icon_enabled && <Toggle />}
              <Typography>{toggleData.toggle_item.default_item}</Typography> */}
                <Button
                  variant="text"
                  sx={{ width: "100%", height: "100%", textTransform: "none" }}
                  onClick={() => handleToggle(toggleValue)}
                >
                  {toggleValue}
                </Button>
                {signer && toggleData.required.includes(signer.signerId) && (
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
              </div>
            </Tooltip>
          </Box>
        </ResizableBox>
      </Draggable>

      {isOpenModalSetting[index] && (
        <ToggleSettingField
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          toggleData={toggleData}
          workFlow={workFlow}
          getFields={getFields}
        />
      )}
    </>
  );
};

ToggleField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  toggleData: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};

export default ToggleField;
