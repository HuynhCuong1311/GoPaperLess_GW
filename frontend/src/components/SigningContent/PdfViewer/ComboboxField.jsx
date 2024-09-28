import { ReactComponent as ChaBonCau } from "@/assets/images/svg/cha_bon_cau.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ComboboxSettingField } from "@/components/modalField";
import { UseFillForm, UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { checkTimeIsBeforeNow, getSigner, next } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import { toast } from "react-toastify";

export const ComboboxField = ({ index, pdfPage, comboboxData, workFlow }) => {
  const { t } = useTranslation();
  const fillForm = UseFillForm();
  const queryClient = useQueryClient();

  const [dragPosition, setDragPosition] = useState({
    x: (comboboxData.dimension?.x * pdfPage.width) / 100,
    y: (comboboxData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const boxRef = useRef(null);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);
  const [comboValue, setComboValue] = useState(comboboxData.value || "Select");

  const newPos = useRef({ x: null, y: null });
  const signer = getSigner(workFlow);
  const signerId = signer?.signerId;

  // const maxPosibleResizeWidth =
  //   (pdfPage.width * (100 - comboboxData.dimension?.x)) / 100;
  // const maxPosibleResizeHeight =
  //   (pdfPage.height * (100 - comboboxData.dimension?.y)) / 100;

  useEffect(() => {
    if (comboboxData.selected && boxRef.current && !scrolled) {
      // console.log("boxRef.current: ", boxRef.current);
      boxRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      setScrolled(true);
    }
    if (!comboboxData.selected) {
      setScrolled(false);
    }
  }, [comboboxData, scrolled]);

  const defaultArray = [
    {
      text: "-- Select --",
      value: "Select",
    },
    ...comboboxData.combo_item.items,
  ];

  const selectContent = defaultArray.map((item, i) => {
    return (
      <MenuItem key={i} value={item.value}>
        {item.text}
      </MenuItem>
    );
  });

  const putSignature = UseUpdateSig();

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        comboboxData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
    },
  });

  useEffect(() => {
    setDragPosition({
      x: (comboboxData.dimension?.x * pdfPage.width) / 100,
      y: (comboboxData.dimension?.y * pdfPage.height) / 100,
    });
  }, [comboboxData, pdfPage]);

  const handleChange = (event) => {
    setComboValue(event.target.value);
    putSignature.mutate(
      {
        body: {
          field_name: comboboxData.field_name,
          visible_enabled: true,
          value: event.target.value === "Select" ? "" : event.target.value,
          type: comboboxData.type,
        },
        field: "combo",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: async () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
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
            field_name: comboboxData.field_name,
            value: comboboxData.value,
          },
        ],
        type: "combo",
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

  const TopBar = ({ comboboxData }) => {
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
            comboboxData.remark &&
            comboboxData.remark.includes(signerId) &&
            comboboxData.value
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
            // display: comboboxData.value ? "block" : "none",
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
    const elements = document.getElementsByClassName(`comboboxRauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (comboboxData.page !== null && comboboxData.page !== pdfPage.currentPage) ||
    comboboxData.process_status === "PROCESSED"
  )
    return null;
  return (
    <>
      <Draggable
        handle={`#comboboxDrag-${index}`}
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
          const draggableComponent = document.querySelector(
            `.combobox-${index}`
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

            putSignature.mutate(
              {
                body: {
                  field_name: comboboxData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: x,
                    y: y,
                    width: -1,
                    height: -1,
                  },
                  visible_enabled: true,
                },
                field: "combo",
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
        //   (comboboxData.remark && !comboboxData.remark.includes(signerId)) ||
        //   comboboxData.process_status === "PROCESSED"
        // }
        disabled
      >
        <ResizableBox
          width={
            comboboxData.dimension?.width
              ? comboboxData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          // height={
          //   comboboxData.dimension?.height
          //     ? comboboxData.dimension?.height * (pdfPage.height / 100)
          //     : 150
          // }
          axis="x"
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: comboboxData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            comboboxData.dimension?.width * (pdfPage.width / 100),
            comboboxData.dimension?.height * (pdfPage.height / 100),
          ]}
          maxConstraints={[
            comboboxData.dimension?.width * (pdfPage.width / 100),
            comboboxData.dimension?.height * (pdfPage.height / 100),
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={(e, { size }) => {
            // console.log("e: ", e);
            if (comboboxData.remark && !comboboxData.remark.includes(signerId))
              return;
            putSignature.mutate(
              {
                body: {
                  field_name: comboboxData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: -1,
                    y: -1,
                    width: (size.width / pdfPage.width) * 100,
                    height: (size.height / pdfPage.height) * 100,
                  },
                  visible_enabled: true,
                },
                field: "combo",
                documentId: workFlow.documentId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            );
          }}
          className={`sig combobox-${index}`}
        >
          <Box
            id={`comboboxDrag-${index}`}
            sx={{
              backgroundColor:
                comboboxData.verification ||
                (comboboxData.remark && !comboboxData.remark.includes(signerId))
                  ? "rgba(217, 223, 228, 0.7)"
                  : "rgba(254, 240, 138, 0.7)",
              ...(comboboxData.selected && next),
              height: "100%",
              position: "relative",
              // padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor:
                comboboxData.verification ||
                (comboboxData.remark && !comboboxData.remark.includes(signerId))
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
            //     signerId + "_" + comboboxData.type + "_" + comboboxData.suffix !==
            //       comboboxData.field_name ||
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
            <Tooltip title={comboboxData.tool_tip_text} placement="top">
              <div
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
                ref={boxRef}
              >
                {showTopbar && <TopBar comboboxData={comboboxData} />}
                <span
                  className={`comboboxRauria-${index} topline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`comboboxRauria-${index} rightline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`comboboxRauria-${index} botline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`comboboxRauria-${index} leftline`}
                  style={{ display: "none" }}
                ></span>
                <FormControl fullWidth size="small">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={comboValue}
                    // label="Age"
                    onChange={handleChange}
                    disabled={
                      signer.signerStatus !== 1 ||
                      (comboboxData.remark &&
                        !comboboxData.remark.includes(signerId))
                    }
                    // sx={{
                    //   pointerEvents: "none",
                    // }}
                  >
                    {selectContent}
                  </Select>
                </FormControl>
                {comboboxData.required.includes(signerId) && (
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
        <ComboboxSettingField
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          comboboxData={comboboxData}
          workFlow={workFlow}
          getFields={() => {}}
        />
      )}
    </>
  );
};

ComboboxField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  comboboxData: PropTypes.object,
  workFlow: PropTypes.object,
};

export default ComboboxField;
