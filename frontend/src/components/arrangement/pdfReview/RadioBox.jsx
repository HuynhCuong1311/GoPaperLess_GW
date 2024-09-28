import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { CheckBoxSettingField } from "@/components/modalField";
import { fpsService } from "@/services/fps_service";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CheckBoxItem from "./CheckBoxItem";
import { RadioGroup, Tooltip } from "@mui/material";
import { getSigner } from "@/utils/commonFunction";
import { toast } from "react-toastify";

export const RadioBox = ({
  index,
  pdfPage,
  checkBoxData,
  workFlow,
  getFields,
}) => {
  const [positionGroup, setPositionGroup] = useState(null);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState(false);
  const signer = getSigner(workFlow);

  const removeSignature = async () => {
    const response = await checkBoxData.map(async (checkBox) => {
      const res = await fpsService.removeSignature1(
        { documentId: workFlow.documentId },
        checkBox.field_name
      );
      if (res.status === 200) return true;
      return false;
    });
    if (response.find((res) => res === false)) {
      toast.error("Remove signature failed");
    }
    setTimeout(async () => {
      await getFields();
    }, 1000);
  };
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

  const TopBar = () => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          display: "flex",
          backgroundColor: "#D9DFE4",
          gap: "5px",
        }}
        className="topBar"
      >
        <SvgIcon
          component={SettingIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
          }}
          onClick={() => setIsOpenModalSetting(true)}
        />
        <SvgIcon
          component={GarbageIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };
  const handleRemoveSignature = async () => {
    await removeSignature();
  };
  return (
    <RadioGroup
      value={checkBoxData.filter((e) => e.checked === true)[0]?.field_name}
      onChange={async (e) => {
        try {
          await Promise.all(
            checkBoxData.map(async (checkbox) => {
              if (checkbox.field_name === e.target.value) {
                console.log(
                  checkBoxData.filter((e) => e.checked)[0]?.checkbox_frame
                );
                await fpsService.putSignature(
                  {
                    ...checkbox,
                    field_name: checkbox.field_name,
                    page: pdfPage.currentPage,
                    dimension: checkbox.dimension,
                    type: "RADIOBOXV2",
                    checked: true,
                    group_name: checkbox.group_name,
                    visible_enabled: true,
                  },
                  "radioboxV2",
                  workFlow.documentId
                );
              } else {
                await fpsService.putSignature(
                  {
                    ...checkbox,
                    field_name: checkbox.field_name,
                    page: pdfPage.currentPage,
                    dimension: checkbox.dimension,
                    type: "RADIOBOXV2",
                    checked: false,
                    group_name: checkbox.group_name,
                    visible_enabled: true,
                  },
                  "radioboxV2",
                  workFlow.documentId
                );
              }
            })
          );
          await getFields();
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
      {positionGroup?.x && positionGroup?.y && (
        <Tooltip title={checkBoxData[0].tool_tip_text} placement="bottom">
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
              onMouseMove={() => {
                workFlow?.workflowStatus < 2 ? setShowTopbar(true) : null;
              }}
              onMouseLeave={() => {
                setShowTopbar(false);
              }}
              onMouseDown={() => {
                setTimeout(() => {
                  setShowTopbar(false);
                }, 500);
              }}
            >
              {showTopbar && <TopBar checkBoxData={checkBoxData} />}
            </Box>
            {signer && checkBoxData[0]?.required.includes(signer.signerId) && (
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
        </Tooltip>
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
