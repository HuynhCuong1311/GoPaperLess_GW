import { ReactComponent as ChaBonCau } from "@/assets/images/svg/cha_bon_cau.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { DateTimeSettingField } from "@/components/modalField";
import { UseFillForm, UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { getSigner, handleDateTimeChange } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const DateTimeField = ({
  index,
  pdfPage,
  dateData,
  workFlow,
  getFields,
}) => {
  // const fillForm = UseFillForm();
  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();
  const fillForm = UseFillForm();

  const [dragPosition, setDragPosition] = useState({
    x: (dateData.dimension?.x * pdfPage.width) / 100,
    y: (dateData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);
  const [open, setOpen] = useState(false);

  const newPos = useRef({ x: null, y: null });
  const signer = getSigner(workFlow);

  const [disableSubmit, setDisableSubmit] = useState(false);
  // const [cleared, setCleared] = useState(false);

  // useEffect(() => {
  //   if (cleared) {
  //     const timeout = setTimeout(() => {
  //       setCleared(false);
  //     }, 1500);

  //     return () => clearTimeout(timeout);
  //   }
  //   return () => {};
  // }, [cleared]);

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - dateData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - dateData.dimension?.y)) / 100;

  const removeSignature = async () => {
    const res = await fpsService.removeSignature(
      { documentId: workFlow.documentId },
      dateData.field_name
    );
    if (res.status === 200) {
      await getFields();
    }
  };

  useEffect(() => {
    setDragPosition({
      x: (dateData.dimension?.x * pdfPage.width) / 100,
      y: (dateData.dimension?.y * pdfPage.height) / 100,
    });
  }, [dateData, pdfPage]);

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

  const handleSave = (value) => {
    putSignature.mutate(
      {
        body: {
          field_name: dateData.field_name,
          visible_enabled: true,
          value: handleDateTimeChange(value),
          type: dateData.type,
        },
        field: dateData.type.toLowerCase(),
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
            field_name: dateData.field_name,
            value: dayjs(dateData.value).format(dateData.date.date_format),
          },
        ],
        type: "date",
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
          //     signerId + "_" + dateData.type + "_" + dateData.suffix ===
          //     dateData.field_name
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
            display: dateData.value && !disableSubmit ? "block" : "none",
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

  const handleError = (reason) => {
    // console.log("reason: ", reason);
    // console.log("value: ", value);
    if (reason === null) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  };

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(`dateTimeRauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (dateData.page !== null && dateData.page !== pdfPage.currentPage) ||
    dateData.process_status === "PROCESSED"
  )
    return null;
  return (
    <>
      <Draggable
        handle={`#dateTimeDrag-${index}`}
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
            `.dateTime-${index}`
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
                field_name: dateData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: x,
                  y: y,
                  width: -1,
                  height: -1,
                },
                visible_enabled: true,
              },
              "datetime",
              workFlow.documentId
            );

            if (putpos.status !== 200) return;
            await getFields();
          }
        }}
        disabled={dateData.process_status === "PROCESSED"}
      >
        <ResizableBox
          width={
            dateData.dimension?.width
              ? dateData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          // height={
          //   dateData.dimension?.height
          //     ? dateData.dimension?.height * (pdfPage.height / 100)
          //     : 150
          // }
          axis="x"
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: dateData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            dateData.process_status === "PROCESSED"
              ? dateData.dimension?.width * (pdfPage.width / 100)
              : 0,
            dateData.process_status === "PROCESSED"
              ? dateData.dimension?.height * (pdfPage.height / 100)
              : 0,
          ]}
          maxConstraints={[
            dateData.process_status === "PROCESSED"
              ? dateData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,
            dateData.process_status === "PROCESSED"
              ? dateData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={async (e, { size }) => {
            // console.log("e: ", e);
            // if (
            //   signerId + "_" + dateData.type + "_" + dateData.suffix !==
            //   dateData.field_name
            // )
            //   return;

            const putpos = await fpsService.putSignature(
              {
                field_name: dateData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: -1,
                  y: -1,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
              },
              "datetime",
              workFlow.documentId
            );
            if (putpos.status !== 200) return;
            await getFields();
          }}
          className={`sig dateTime-${index}`}
        >
          <Box
            id={`dateTimeDrag-${index}`}
            sx={{
              backgroundColor:
                !signer || (signer && dateData.remark.includes(signer.signerId))
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
                !signer || (signer && dateData.remark.includes(signer.signerId))
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
            //     signerId + "_" + dateData.type + "_" + dateData.suffix !==
            //       dateData.field_name ||
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
            <Tooltip title={dateData.tool_tip_text} placement="bottom">
              <div
                style={{
                  display: "flex",
                  // alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  gap: "4px",
                }}
              >
                {showTopbar && <TopBar dateData={dateData} />}
                <span
                  className={`dateTimeRauria-${index} topline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`dateTimeRauria-${index} rightline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`dateTimeRauria-${index} botline`}
                  style={{ display: "none" }}
                ></span>
                <span
                  className={`dateTimeRauria-${index} leftline`}
                  style={{ display: "none" }}
                ></span>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ p: 0, width: "100%" }}
                  >
                    <DatePicker
                      open={open}
                      onClose={() => setOpen(false)}
                      onError={handleError}
                      slotProps={{
                        textField: {
                          placeholder: dateData.place_holder,
                          onClick: () => setOpen(true),
                        },
                        // field: {
                        //   clearable: true,
                        //   onClear: () => setCleared(true),
                        // },
                      }}
                      value={
                        dayjs(dateData.value).isValid()
                          ? dayjs(dateData.value, "YYYY-MM-DD")
                          : null
                      }
                      // slotProps={{ textField: { placeholder: "cuong" } }}
                      sx={{
                        padding: 0,
                        width: "100%",
                        "& .MuiInputBase-input": { py: 0 },
                        // backgroundColor: "signingWFBackground.main",
                      }}
                      minDate={dayjs(
                        dateData.date.minimum_date,
                        "YYYY-MM-DDTHH:mm:ss.SSSZ"
                      )}
                      maxDate={dayjs(
                        dateData.date.maximum_date,
                        "YYYY-MM-DDTHH:mm:ss.SSSZ"
                      )}
                      format={dateData.date.date_format}
                      // onChange={(newValue) => setDateValue(newValue)}
                      onChange={(newValue) => handleSave(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {signer && dateData.required.includes(signer.signerId) && (
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
        <DateTimeSettingField
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          dateData={dateData}
          workFlow={workFlow}
          getFields={getFields}
        />
      )}
    </>
  );
};

DateTimeField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  dateData: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};

export default DateTimeField;
