import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CheckBoxItem from "./CheckBoxItem";
import { getSigner } from "@/utils/commonFunction";

export const CheckBox = ({ pdfPage, checkBoxData, workFlow }) => {
  const signer = getSigner(workFlow);
  const signerId = signer.signerId;
  const [positionGroup, setPositionGroup] = useState(null);
  const addLocalStogare = () => {
    checkBoxData.filter((e) => e?.checked == false)[0]?.checkbox_frame
      ? localStorage.setItem(
          "checkbox_false",
          JSON.stringify(
            checkBoxData.filter((e) => e?.checked == false)[0]?.checkbox_frame
          )
        )
      : localStorage.setItem(
          "checkbox_false",
          JSON.stringify({
            background_rgbcode: "#FFFFFF",
            border_rgbcode: "#E5E7EB",
            checked_rgbcode: "#FFFFFF",
          })
        );
    checkBoxData.filter((e) => e?.checked == true)[0]?.checkbox_frame
      ? localStorage.setItem(
          "checkbox_true",
          JSON.stringify(
            checkBoxData.filter((e) => e?.checked == false)[0]?.checkbox_frame
          )
        )
      : localStorage.setItem(
          "checkbox_true",
          JSON.stringify({
            background_rgbcode: "#3B82F6",
            border_rgbcode: "#3B82F6",
            checked_rgbcode: "#FFFFFF",
          })
        );
  };
  useEffect(() => {
    addLocalStogare();
  }, []);
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
  }, [checkBoxData]);

  return (
    <>
      {checkBoxData.map((checkBox, i) => (
        <CheckBoxItem
          key={i}
          index={i}
          pdfPage={pdfPage}
          checkBoxItem={checkBox}
          workFlow={workFlow}
          checkBoxData={checkBoxData}
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
              // onMouseMove={() => {
              //   workFlow?.workflowStatus < 2 ? setShowTopbar(true) : null;
              // }}
              // onMouseLeave={() => {
              //   setShowTopbar(false);
              // }}
              // onMouseDown={() => {
              //   setTimeout(() => {
              //     setShowTopbar(false);
              //   }, 500);
              // }}
            >
              {checkBoxData[0]?.required?.includes(signerId) && (
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
      {/* {isOpenModalSetting && (
        <CheckBoxSettingField
          open={isOpenModalSetting}
          onClose={() => setIsOpenModalSetting(false)}
          dimension={positionGroup}
          fieldGroup={checkBoxData[0].group_name}
          participants={workFlow.participants}
          checkBoxData={checkBoxData}
          workFlow={workFlow}
          getFields={queryClient.invalidateQueries({ queryKey: ["getField"] })}
        />
      )} */}
    </>
  );
};

CheckBox.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  checkBoxData: PropTypes.array,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};
