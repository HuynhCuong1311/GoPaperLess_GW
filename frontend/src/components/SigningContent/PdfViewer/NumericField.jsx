import { ReactComponent as ChaBonCau } from "@/assets/images/svg/cha_bon_cau.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { NumericSettingField } from "@/components/modalField";
import { UseFillForm, UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { checkTimeIsBeforeNow, getSigner, next } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import { toast } from "react-toastify";

export const NumericField = ({ index, pdfPage, numericData, workFlow }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fillForm = UseFillForm();

  const [dragPosition, setDragPosition] = useState({
    x: (numericData.dimension?.x * pdfPage.width) / 100,
    y: (numericData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const boxRef = useRef(null);

  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);
  const [numericValue, setNumericValue] = useState(
    numericData.numeric_stepper.default_value || ""
  );
  // console.log("numericValue: ", numericValue);

  const newPos = useRef({ x: null, y: null });
  const signer = getSigner(workFlow);
  const signerId = signer?.signerId;

  // const maxPosibleResizeWidth =
  //   (pdfPage.width * (100 - numericData.dimension?.x)) / 100;
  // const maxPosibleResizeHeight =
  //   (pdfPage.height * (100 - numericData.dimension?.y)) / 100;

  const putSignature = UseUpdateSig();

  useEffect(() => {
    if (numericData.numeric_stepper.default_value) {
      setNumericValue(numericData.numeric_stepper.default_value);
    }
  }, [numericData.numeric_stepper.default_value]);

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        numericData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
    },
  });

  useEffect(() => {
    setDragPosition({
      x: (numericData.dimension?.x * pdfPage.width) / 100,
      y: (numericData.dimension?.y * pdfPage.height) / 100,
    });
  }, [numericData, pdfPage]);

  useEffect(() => {
    if (numericData.selected && boxRef.current && !scrolled) {
      // console.log("boxRef.current: ", boxRef.current);
      boxRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      setScrolled(true);
    }
    if (!numericData.selected) {
      setScrolled(false);
    }
  }, [numericData, scrolled]);

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
            field_name: numericData.field_name,
            value: numericValue,
          },
        ],
        type: "numeric_stepper",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
          queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
        },
      }
    );
  };

  const TopBar = ({ numericData }) => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -27,
          right: -2,
          zIndex: 10,
          display:
            signer.signerStatus === 1 &&
            numericData.remark &&
            numericData.remark.includes(signerId)
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
    const elements = document.getElementsByClassName(`numericRauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (numericData.page !== null && numericData.page !== pdfPage.currentPage) ||
    numericData.process_status === "PROCESSED"
  )
    return null;
  return (
    <>
      <Draggable
        handle={`#numericDrag-${index}`}
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
            `.numeric-${index}`
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
                  field_name: numericData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: x,
                    y: y,
                    width: -1,
                    height: -1,
                  },
                  numeric_stepper: numericData.numeric_stepper,
                  visible_enabled: true,
                },
                field: "numeric_stepper",
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
        //   (numericData.remark && !numericData.remark.includes(signerId)) ||
        //   numericData.process_status === "PROCESSED"
        // }
        disabled
      >
        <ResizableBox
          width={
            numericData.dimension?.width
              ? numericData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            numericData.dimension?.height
              ? numericData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: numericData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            numericData.dimension?.width * (pdfPage.width / 100),
            numericData.dimension?.height * (pdfPage.height / 100),
          ]}
          maxConstraints={[
            numericData.dimension?.width * (pdfPage.width / 100),
            numericData.dimension?.height * (pdfPage.height / 100),
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={(e, { size }) => {
            // console.log("e: ", e);
            if (numericData.remark && !numericData.remark.includes(signerId))
              return;
            putSignature.mutate(
              {
                body: {
                  field_name: numericData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: -1,
                    y: -1,
                    width: (size.width / pdfPage.width) * 100,
                    height: (size.height / pdfPage.height) * 100,
                  },
                  numeric_stepper: numericData.numeric_stepper,
                  visible_enabled: true,
                },
                field: "numeric_stepper",
                documentId: workFlow.documentId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            );
          }}
          className={`sig numeric-${index}`}
        >
          <Box
            id={`numericDrag-${index}`}
            sx={{
              backgroundColor:
                numericData.verification ||
                (numericData.remark && !numericData.remark.includes(signerId))
                  ? "rgba(217, 223, 228, 0.7)"
                  : "rgba(254, 240, 138, 0.7)",
              ...(numericData.selected && next),
              height: "100%",
              position: "relative",
              // padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor:
                numericData.verification ||
                (numericData.remark && !numericData.remark.includes(signerId))
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
            //     signerId + "_" + numericData.type + "_" + numericData.suffix !==
            //       numericData.field_name ||
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
            <Tooltip title={numericData.tool_tip_text} placement="bottom">
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {showTopbar && <TopBar numericData={numericData} />}
                <span
                  className={`numericRauria-${index} topline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`numericRauria-${index} rightline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`numericRauria-${index} botline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`numericRauria-${index} leftline`}
                  style={{ display: "none" }}
                ></span>
                <TextField
                  // fullWidth
                  size="small"
                  margin="normal"
                  value={numericValue}
                  autoComplete="off"
                  // autoFocus={true}
                  placeholder={numericData.place_holder}
                  sx={{
                    my: 0,
                    width: "90%",
                    "& .MuiInputBase-root": {
                      // minHeight: "45px",
                      // height: textData.height,
                    },
                    "& fieldset": { border: "none" },
                    // backgroundColor: "rgba(254, 240, 138, 0.7)",
                    fontWeight: "bold",
                  }}
                  type="number"
                  inputRef={boxRef}
                  onChange={(e) => {
                    setNumericValue(e.target.value);
                  }}
                  inputProps={{
                    sx: { fontWeight: 600, padding: 0 }, // Sử dụng style để đặt fontWeight và padding
                    min: numericData.numeric_stepper.minimum_value,
                    max: numericData.numeric_stepper.maximum_value,
                    step: numericData.numeric_stepper.unit_of_change,
                  }}
                  InputProps={{
                    readOnly:
                      numericData.process_status === "PROCESSED" ||
                      (numericData.remark &&
                        !numericData.remark.includes(signerId)),
                  }}
                />
                {numericData.required.includes(signerId) && (
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
        <NumericSettingField
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          numericData={numericData}
          workFlow={workFlow}
          getFields={() => {}}
        />
      )}
    </>
  );
};

NumericField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  numericData: PropTypes.object,
  workFlow: PropTypes.object,
};

export default NumericField;
