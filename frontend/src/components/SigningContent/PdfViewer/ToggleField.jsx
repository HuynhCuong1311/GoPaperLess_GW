import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ToggleSettingField } from "@/components/modalField";
import { UseFillForm, UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { checkTimeIsBeforeNow, getSigner, next } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { ReactComponent as ChaBonCau } from "@/assets/images/svg/cha_bon_cau.svg";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const ToggleField = ({ index, pdfPage, toggleData, workFlow }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fillForm = UseFillForm();

  const [dragPosition, setDragPosition] = useState({
    x: (toggleData.dimension?.x * pdfPage.width) / 100,
    y: (toggleData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const boxRef = useRef(null);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);
  const [toggleValue, setToggleValue] = useState(
    toggleData.value || toggleData.toggle_item.default_item
  );

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

  // const maxPosibleResizeWidth =
  //   (pdfPage.width * (100 - toggleData.dimension?.x)) / 100;
  // const maxPosibleResizeHeight =
  //   (pdfPage.height * (100 - toggleData.dimension?.y)) / 100;

  const putSignature = UseUpdateSig();

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        toggleData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
    },
  });

  useEffect(() => {
    setDragPosition({
      x: (toggleData.dimension?.x * pdfPage.width) / 100,
      y: (toggleData.dimension?.y * pdfPage.height) / 100,
    });
  }, [toggleData, pdfPage]);

  useEffect(() => {
    if (toggleData.selected && boxRef.current && !scrolled) {
      // console.log("boxRef.current: ", boxRef.current);
      boxRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      setScrolled(true);
    }
    if (!toggleData.selected) {
      setScrolled(false);
    }
  }, [toggleData, scrolled]);

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

  const handleToggle = (data) => {
    if (checkTimeIsBeforeNow(workFlow.deadlineAt)) {
      // return next("Deadline time has passed. Please re-sign again.", 2000, "error");
      toast.error(t("signing.workflow_expỉred"));
      return;
    }
    if (
      newPos.current.x !== null &&
      newPos.current.x !== dragPosition.x &&
      newPos.current.y !== dragPosition.y
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
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  //   const handleSave = (value) => {
  //     console.log("value: ", value);
  //     // fillForm.mutate(
  //     //   {
  //     //     body: [
  //     //       {
  //     //         field_name: toggleData.field_name,
  //     //         value: handleDateTimeChange(value),
  //     //       },
  //     //     ],
  //     //     documentId: workFlow.documentId,
  //     //   },
  //     //   {
  //     //     onSuccess: () => {
  //     //       queryClient.invalidateQueries({ queryKey: ["getField"] });
  //     //       queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
  //     //     },
  //     //   }
  //     // );
  //     putSignature.mutate(
  //       {
  //         body: {
  //           field_name: toggleData.field_name,
  //           visible_enabled: true,
  //           value: handleDateTimeChange(value),
  //           type: toggleData.type,
  //         },
  //         field: toggleData.type.toLowerCase(),
  //         documentId: workFlow.documentId,
  //       },
  //       {
  //         onSuccess: () => {
  //           queryClient.invalidateQueries({ queryKey: ["getField"] });
  //         },
  //       }
  //     );
  //   };

  //   const handleSubmit = async () => {
  //     fillForm.mutate(
  //       {
  //         body: [
  //           {
  //             field_name: toggleData.field_name,
  //             value: toggleData.value,
  //           },
  //         ],
  //         documentId: workFlow.documentId,
  //       },
  //       {
  //         onSuccess: () => {
  //           queryClient.invalidateQueries({ queryKey: ["getField"] });
  //           queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
  //         },
  //       }
  //     );
  //   };

  const handleSubmit = async () => {
    fillForm.mutate(
      {
        body: [
          {
            field_name: toggleData.field_name,
            value: toggleData.value,
          },
        ],
        type: "toggle",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: async () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
          queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
        },
      }
    );
  };

  const TopBar = ({ toggleData }) => {
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
            toggleData.remark &&
            toggleData.remark.includes(signerId)
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
        onStop={(e, data) => {
          // console.log("data: ", data);
          // console.log("e: ", e);

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

            putSignature.mutate(
              {
                body: {
                  field_name: toggleData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: x,
                    y: y,
                    width: -1,
                    height: -1,
                  },
                  visible_enabled: true,
                },
                field: "toggle",
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
        //   (toggleData.remark && !toggleData.remark.includes(signerId)) ||
        //   toggleData.process_status === "PROCESSED"
        // }
        disabled
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
            toggleData.dimension?.width * (pdfPage.width / 100),
            toggleData.dimension?.height * (pdfPage.height / 100),
          ]}
          maxConstraints={[
            toggleData.dimension?.width * (pdfPage.width / 100),
            toggleData.dimension?.height * (pdfPage.height / 100),
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={(e, { size }) => {
            // console.log("e: ", e);
            if (toggleData.remark && !toggleData.remark.includes(signerId))
              return;
            putSignature.mutate(
              {
                body: {
                  field_name: toggleData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: -1,
                    y: -1,
                    width: (size.width / pdfPage.width) * 100,
                    height: (size.height / pdfPage.height) * 100,
                  },
                  visible_enabled: true,
                },
                field: "toggle",
                documentId: workFlow.documentId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            );
          }}
          className={`sig toggle-${index}`}
        >
          <Box
            id={`toggleDrag-${index}`}
            sx={{
              backgroundColor:
                toggleData.verification ||
                (toggleData.remark && !toggleData.remark.includes(signerId))
                  ? "rgba(217, 223, 228, 0.7)"
                  : "rgba(254, 240, 138, 0.7)",
              ...(toggleData.selected && next),
              height: "100%",
              position: "relative",
              // padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor:
                toggleData.verification ||
                (toggleData.remark && !toggleData.remark.includes(signerId))
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
            // onClick={(e) => {
            //   if (
            //     signerId + "_" + toggleData.type + "_" + toggleData.suffix !==
            //       toggleData.field_name ||
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
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
                ref={boxRef}
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
                <Button
                  variant="text"
                  sx={{
                    width: "100%",
                    height: "100%",
                    textTransform: "none",
                    "&.Mui-disabled": {
                      color: "#545454",
                    },
                  }}
                  onClick={() => handleToggle(toggleValue)}
                  disabled={signer.signerStatus !== 1}
                >
                  {toggleValue}
                </Button>
                {toggleData.required.includes(signerId) && (
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
          getFields={() => {}}
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
};

export default ToggleField;
