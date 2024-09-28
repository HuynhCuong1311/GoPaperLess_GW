import { CheckBoxSettingField } from "@/components/modalField";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { getSigner } from "@/utils/commonFunction";
import { RadioGroup } from "@mui/material";
import Box from "@mui/material/Box";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CheckBoxItem from "./CheckBoxItem";
import { toast } from "react-toastify";

export const RadioBox = ({ pdfPage, checkBoxData, workFlow, getFields }) => {
  const signer = getSigner(workFlow);
  const signerId = signer.signerId;
  const [positionGroup, setPositionGroup] = useState(null);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState(false);
  const putSignature = UseUpdateSig();
  const queryClient = useQueryClient();

  useEffect(() => {
    let positionDemo = {};
    const position = checkBoxData.map((checkBox) => {
      return {
        x: (checkBox.dimension?.x * pdfPage.width) / 100,
        y: (checkBox.dimension?.y * pdfPage.height) / 100,
        width: checkBox.dimension?.width * (pdfPage.width / 100),
        height: checkBox.dimension?.height * (pdfPage.height / 100),
      };
    });

    position.map((pos) => {
      if (positionDemo?.x) {
        if (positionDemo?.x > pos.x) {
          positionDemo.x = pos.x;
        }
        if (positionDemo?.y > pos.y) {
          positionDemo.y = pos.y;
        }
        if (positionDemo.width < pos.width + pos.x) {
          positionDemo.width = pos.width + pos.x;
        }

        if (positionDemo.height < pos.height + pos.y) {
          positionDemo.height = pos.height + pos.y;
        }

        setPositionGroup({
          x: positionDemo.x - 10,
          y: positionDemo.y - 10,
          width: positionDemo.width - positionDemo.x + 20,
          height: positionDemo.height - positionDemo.y + 20,
        });
      } else {
        positionDemo = {
          x: pos.x,
          y: pos.y,
          width: pos.width + pos.x,
          height: pos.height + pos.y,
        };

        setPositionGroup({
          x: pos.x - 10,
          y: pos.y - 10,
          width: pos.width + 20,
          height: pos.height + 20,
        });
      }
    });
  }, [checkBoxData, pdfPage, workFlow]);

  return (
    <RadioGroup
      value={checkBoxData.filter((e) => e.checked === true)[0]?.field_name}
      onChange={async (e) => {
        try {
          await Promise.all(
            checkBoxData.map(async (checkbox) => {
              if (checkbox.field_name === e.target.value) {
                putSignature.mutate(
                  {
                    body: {
                      ...checkbox,
                      field_name: checkbox.field_name,
                      page: pdfPage.currentPage,
                      dimension: checkbox.dimension,
                      type: "RADIOBOX",
                      checked: true,
                      group_name: checkbox.group_name,
                      visible_enabled: true,
                    },
                    field: "radio",
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
                      ...checkbox,
                      field_name: checkbox.field_name,
                      page: pdfPage.currentPage,
                      dimension: checkbox.dimension,
                      type: "RADIOBOX",
                      checked: false,
                      group_name: checkbox.group_name,

                      visible_enabled: true,
                    },
                    field: "radio",
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
              }
            })
          );
        } catch (error) {
          console.error("Error:", error);
          toast.error("An error occurred");
        }
      }}
    >
      {checkBoxData.map((checkBox, i) => (
        <CheckBoxItem
          key={i}
          index={i}
          pdfPage={pdfPage}
          checkBoxItem={checkBox}
          workFlow={workFlow}
          getFields={getFields}
          type="radio"
        />
      ))}
      {checkBoxData.filter((e) => e.process_status != "PROCESSED").length > 0 &&
        positionGroup?.x &&
        positionGroup?.y && (
          <Box
            sx={{
              border: "1px dashed #EAB308",
              position: "absolute",
              width: `${positionGroup?.width}px`,
              transform: `translate(${positionGroup?.x}px, ${positionGroup?.y}px)`,
              height: `${positionGroup?.height}px`,
              zIndex: 99,
            }}
          >
            <Box
              sx={{
                height: "100%",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {checkBoxData[0].required.includes(signerId) && (
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
            </Box>
          </Box>
        )}
      {isOpenModalSetting && (
        <CheckBoxSettingField
          open={isOpenModalSetting}
          onClose={() => setIsOpenModalSetting(false)}
          dimension={positionGroup}
          fieldGroup={checkBoxData[0].group_name}
          participants={workFlow.participants}
          checkBoxData={checkBoxData}
          type="radio"
          workFlow={workFlow}
          getFields={getFields}
        />
      )}
    </RadioGroup>
  );
};

RadioBox.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  checkBoxData: PropTypes.array,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};
