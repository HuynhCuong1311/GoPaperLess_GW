import { UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import { Radio } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const CheckBoxItem = ({
  index,
  pdfPage,
  checkBoxItem,
  workFlow,
  type,
  checkBoxData,
}) => {
  const signer = getSigner(workFlow);
  const signerId = signer.signerId;
  // const signer = getSigner(workFlow);
  const queryClient = useQueryClient();
  const [checkBox, setCheckBox] = useState(checkBoxItem);
  const putSignature = UseUpdateSig();
  useEffect(() => {
    setCheckBox(checkBoxItem);
  }, [checkBoxItem]);
  // const signerId = "ADMIN_PROVIDER";
  const [isControlled, setIsControlled] = useState(false);
  const [dragPosition, setDragPosition] = useState({
    x: (checkBox.dimension?.x * pdfPage.width) / 100,
    y: (checkBox.dimension?.y * pdfPage.height) / 100,
  });
  useEffect(() => {
    setDragPosition({
      x: (checkBox.dimension?.x * pdfPage.width) / 100,
      y: (checkBox.dimension?.y * pdfPage.height) / 100,
    });
  }, [checkBox]);
  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - checkBox.dimension?.x)) / 100;

  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - checkBox.dimension?.y)) / 100;

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(
      `qryptorauria-${index + checkBox.suffix}`
    );

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (checkBox.page !== null && checkBox.page !== pdfPage.currentPage) ||
    checkBox.process_status === "PROCESSED"
  )
    return null;

  return (
    <>
      <Draggable
        handle={`#qryptoDrag-${index}`}
        // bounds="parent"
        onDrag={() => handleDrag("block")}
        position={dragPosition}
        cancel=".topBar"
        onStart={(e, data) => {
          setDragPosition({ x: data.x, y: data.y });
          setIsControlled(false);
        }}
        onStop={async (e, data) => {
          e.preventDefault();
          setIsControlled(true);
          handleDrag("none");
          const draggableComponent = document.querySelector(
            `.checkbox-${checkBox.field_name}`
          );
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

          if (
            (dragPosition?.x === data.x && dragPosition?.y === data.y) ||
            isOverTarget
          ) {
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
              ...checkBox,
              field_name: checkBox.field_name,
              page: pdfPage.currentPage,
              dimension: {
                x: x,
                y: y,
                width: -1,
                height: -1,
              },
              type: type === "radio" ? "RADIOBOXV2" : "CHECKBOXV2",
              group_name: checkBox.group_name,
              visible_enabled: true,
            },
            type === "radio" ? "radioboxV2" : "checkboxV2",
            workFlow.documentId
          );
          if (!putpos) return;
          await queryClient.invalidateQueries({ queryKey: ["getField"] });
        }}
        disabled={
          signerId + "_" + checkBox.type + "_" + checkBox.suffix !==
          checkBox.field_name
        }
      >
        <ResizableBox
          width={
            checkBox.dimension?.width
              ? checkBox.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            checkBox.dimension?.height
              ? checkBox.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            signerId + "_" + checkBox.type + "_" + checkBox.suffix !==
            checkBox.field_name
              ? checkBox.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? 120
              : 200,

            signerId + "_" + checkBox.type + "_" + checkBox.suffix !==
            checkBox.field_name
              ? checkBox.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? 44
              : 50,
          ]}
          maxConstraints={[
            signerId + "_" + checkBox.type + "_" + checkBox.suffix !==
            checkBox.field_name
              ? checkBox.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,

            signerId + "_" + checkBox.type + "_" + checkBox.suffix !==
            checkBox.field_name
              ? checkBox.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          // lockAspectRatio={true}
          // onResize={(e, { size }) => {}}
          // onResizeStop={async (e, { size }) => {
          //   // console.log("e: ", e);
          //   if (
          //     signerId + "_" + checkBox.type + "_" + checkBox.suffix !==
          //     checkBox.field_name
          //   )
          //     return;
          //   const putpos = await fpsService.putSignature(
          //     {
          //       field_name: checkBox.field_name,
          //       page: pdfPage.currentPage,
          //       dimension: {
          //         x: -1,
          //         y: -1,
          //         width: (size.width / pdfPage.width) * 100,
          //         height: (size.height / pdfPage.height) * 100,
          //       },
          //       type: "CHECKBOX",
          //       group_name: checkBox.group_name,
          //       visible_enabled: true,
          //     },
          //     "checkbox",
          //     workFlow.documentId
          //   );
          //   if (!putpos) return;
          //   await getFields();
          // }}
          className={`sig checkbox-${checkBox.field_name}`}
        >
          <Box
            id={`qryptoDrag-${index}`}
            sx={{
              height: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                "& > button": {
                  display: "flex",
                },
              },
            }}
          >
            <span
              className={`qryptorauria-${index + checkBox.suffix} topline`}
              style={{ display: "none" }}
            ></span>
            <span
              className={`qryptorauria-${index + checkBox.suffix} rightline`}
              style={{ display: "none" }}
            ></span>
            <span
              className={`qryptorauria-${index + checkBox.suffix} botline`}
              style={{ display: "none" }}
            ></span>
            <span
              className={`qryptorauria-${index + checkBox.suffix} leftline`}
              style={{ display: "none" }}
            ></span>
            <Box
              sx={{
                border: "1px dashed #357EEB",
                width: "100%",
                height: "100%",
                display: "flex",
                padding: "10px",
                overflow: "hidden",

                justifyContent:
                  checkBox?.align_option?.horizontal_alignment == "LEFT"
                    ? "flex-start"
                    : "flex-end",
                alignItems: "center",
              }}
            >
              <FormGroup>
                <FormControlLabel
                  labelPlacement={
                    checkBox?.align_option?.horizontal_alignment == "LEFT"
                      ? "end"
                      : "start"
                  }
                  control={
                    type === "radio" ? (
                      <Radio
                        checked={checkBox.checked}
                        value={checkBox.field_name}
                        disabled={
                          checkBox?.remark?.includes(signerId) ? false : true
                        }
                        checkedIcon={
                          <Box
                            sx={{
                              background:
                                checkBox.checkbox_frame.background_rgbcode,
                              borderRadius: "50%",
                              border: `1px solid ${checkBox.checkbox_frame.border_rgbcode}`,
                              width: "16px",
                              height: "16px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <circle
                                cx="4"
                                cy="4"
                                r="3.5"
                                fill={checkBox.checkbox_frame.checked_rgbcode}
                              />
                            </svg>
                          </Box>
                        }
                        icon={
                          <Box
                            sx={{
                              background:
                                checkBox.uncheckbox_frame.background_rgbcode,
                              borderRadius: "50%",
                              border: `1px solid ${checkBox.uncheckbox_frame.border_rgbcode}`,
                              width: "16px",
                              height: "16px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          ></Box>
                        }
                      />
                    ) : (
                      <Checkbox
                        checked={checkBox.checked}
                        onChange={(e) => {
                          if (checkBox.multiple_checked) {
                            putSignature.mutate(
                              {
                                body: {
                                  ...checkBox,
                                  field_name: checkBox.field_name,
                                  page: pdfPage.currentPage,
                                  dimension: checkBox.dimension,
                                  type: "CHECKBOXV2",
                                  checked: e.target.checked,
                                  group_name: checkBox.group_name,
                                  visible_enabled: true,
                                },
                                field: "checkboxV2",
                                documentId: workFlow.documentId,
                              },
                              {
                                onSuccess: () => {
                                  queryClient.invalidateQueries({
                                    queryKey: ["getField"],
                                  });
                                },
                              }
                            );
                          } else {
                            putSignature.mutate(
                              {
                                body: {
                                  field_name: checkBox.field_name,
                                  page: pdfPage.currentPage,
                                  dimension: checkBox.dimension,
                                  type: "CHECKBOX",
                                  checked: e.target.checked,
                                  group_name: checkBox.group_name,
                                  visible_enabled: true,
                                },
                                field: "checkbox",
                                documentId: workFlow.documentId,
                              },
                              {
                                onSuccess: () => {
                                  queryClient.invalidateQueries({
                                    queryKey: ["getField"],
                                  });
                                },
                              }
                            );
                            checkBoxData
                              .filter(
                                (item) =>
                                  item.field_name !== checkBox.field_name
                              )
                              .map(async (item) => {
                                putSignature.mutate(
                                  {
                                    body: {
                                      field_name: item.field_name,
                                      page: pdfPage.currentPage,
                                      dimension: item.dimension,
                                      type: "CHECKBOX",
                                      checked: false,
                                      group_name: item.group_name,
                                      visible_enabled: true,
                                    },
                                    field: "checkbox",
                                    documentId: workFlow.documentId,
                                  },
                                  {
                                    onSuccess: () => {
                                      queryClient.invalidateQueries({
                                        queryKey: ["getField"],
                                      });
                                    },
                                  }
                                );
                              });
                          }
                        }}
                        checkedIcon={
                          <Box
                            sx={{
                              background:
                                checkBox.checkbox_frame.background_rgbcode,
                              border: `1px solid ${checkBox.checkbox_frame.border_rgbcode}`,
                              borderRadius: "4px",
                              width: "16px",
                              height: "16px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M11.1436 3.47369C11.2033 3.41276 11.2745 3.36436 11.3532 3.33131C11.4318 3.29827 11.5163 3.28125 11.6016 3.28125C11.6869 3.28125 11.7714 3.29827 11.85 3.33131C11.9287 3.36436 12 3.41276 12.0597 3.47369C12.3099 3.72657 12.3134 4.13519 12.0684 4.39244L6.89456 10.5087C6.83581 10.5732 6.76453 10.625 6.68506 10.661C6.60559 10.6971 6.51962 10.7165 6.43239 10.7181C6.34516 10.7198 6.25851 10.7036 6.17775 10.6706C6.09698 10.6376 6.0238 10.5884 5.96268 10.5262L2.81443 7.33594C2.69301 7.21212 2.625 7.04561 2.625 6.87219C2.625 6.69877 2.69301 6.53227 2.81443 6.40844C2.87415 6.34751 2.94542 6.29911 3.02407 6.26606C3.10272 6.23302 3.18718 6.216 3.27249 6.216C3.35781 6.216 3.44226 6.23302 3.52092 6.26606C3.59957 6.29911 3.67084 6.34751 3.73056 6.40844L6.40106 9.11482L11.1261 3.49294C11.1315 3.48618 11.1373 3.47975 11.1436 3.47369Z"
                                fill={checkBox.checkbox_frame.checked_rgbcode}
                              />
                            </svg>
                          </Box>
                        }
                        icon={
                          <Box
                            sx={{
                              background:
                                checkBox.uncheckbox_frame.background_rgbcode,
                              borderRadius: "4px",
                              border: `1px solid ${checkBox.uncheckbox_frame.border_rgbcode}`,
                              width: "16px",
                              height: "16px",
                            }}
                          ></Box>
                        }
                        disabled={
                          checkBox?.remark?.includes(signerId) ? false : true
                        }
                      />
                    )
                  }
                  value={checkBox.text_next_to}
                  label={checkBoxItem.text_next_to || ""}
                />
              </FormGroup>
            </Box>
          </Box>
        </ResizableBox>
      </Draggable>
    </>
  );
};

CheckBoxItem.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  checkBoxItem: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
  type: PropTypes.string,
  checkBoxData: PropTypes.array,
};

export default CheckBoxItem;
