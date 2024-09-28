import { ReactComponent as HyperLink } from "@/assets/images/contextmenu/hyperlink.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { HyperlinkSettingField } from "@/components/modalField";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const HyperlinkField = ({
  index,
  pdfPage,
  hyperlinkData,
  workFlow,
  getFields,
}) => {
  const [dragPosition, setDragPosition] = useState({
    x: (hyperlinkData.dimension?.x * pdfPage.width) / 100,
    y: (hyperlinkData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);

  const newPos = useRef({ x: null, y: null });
  const signer = getSigner(workFlow);
  const signerId = signer?.signerId;

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - hyperlinkData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - hyperlinkData.dimension?.y)) / 100;

  const removeSignature = async () => {
    const res = await fpsService.removeSignature(
      { documentId: workFlow.documentId },
      hyperlinkData.field_name
    );
    if (res.status === 200) {
      await getFields();
    }
  };

  useEffect(() => {
    setDragPosition({
      x: (hyperlinkData.dimension?.x * pdfPage.width) / 100,
      y: (hyperlinkData.dimension?.y * pdfPage.height) / 100,
    });
  }, [hyperlinkData, pdfPage]);

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
    const elements = document.getElementsByClassName(
      `hyperlinkRauria-${index}`
    );

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (hyperlinkData.page !== null &&
      hyperlinkData.page !== pdfPage.currentPage) ||
    hyperlinkData.process_status === "PROCESSED"
  )
    return null;
  return (
    <>
      <Draggable
        handle={`#hyperlinkDrag-${index}`}
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
            `.hyperlink-${index}`
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
                field_name: hyperlinkData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: x,
                  y: y,
                  width: -1,
                  height: -1,
                },
                visible_enabled: true,
              },
              "hyperlink",
              workFlow.documentId
            );

            if (putpos.status !== 200) return;
            await getFields();
          }
        }}
        disabled={hyperlinkData.process_status === "PROCESSED"}
      >
        <ResizableBox
          width={
            hyperlinkData.dimension?.width
              ? hyperlinkData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            hyperlinkData.dimension?.height
              ? hyperlinkData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: hyperlinkData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            hyperlinkData.process_status === "PROCESSED"
              ? hyperlinkData.dimension?.width * (pdfPage.width / 100)
              : 0,
            hyperlinkData.process_status === "PROCESSED"
              ? hyperlinkData.dimension?.height * (pdfPage.height / 100)
              : 0,
          ]}
          maxConstraints={[
            hyperlinkData.process_status === "PROCESSED"
              ? hyperlinkData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,
            hyperlinkData.process_status === "PROCESSED"
              ? hyperlinkData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={async (e, { size }) => {
            // console.log("e: ", e);
            if (
              signerId +
                "_" +
                hyperlinkData.type +
                "_" +
                hyperlinkData.suffix !==
              hyperlinkData.field_name
            )
              return;

            const putpos = await fpsService.putSignature(
              {
                field_name: hyperlinkData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: -1,
                  y: -1,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
              },
              "hyperlink",
              workFlow.documentId
            );
            if (putpos.status !== 200) return;
            await getFields();
          }}
          className={`sig hyperlink-${index}`}
        >
          <Box
            id={`hyperlinkDrag-${index}`}
            sx={{
              backgroundColor:
                !signer ||
                (signer && hyperlinkData.remark.includes(signer.signerId))
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
                (signer && hyperlinkData.remark.includes(signer.signerId))
                  ? "#EAB308"
                  : "black",
              width: "100%",
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
          >
            <Tooltip title={hyperlinkData.tool_tip_text} placement="bottom">
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
              >
                {showTopbar && <TopBar hyperlinkData={hyperlinkData} />}
                <span
                  className={`hyperlinkRauria-${index} topline`}
                  // style={{ display: "none" }}
                ></span>
                <span
                  className={`hyperlinkRauria-${index} rightline`}
                  // style={{ display: "none" }}
                ></span>
                <span
                  className={`hyperlinkRauria-${index} botline`}
                  // style={{ display: "none" }}
                ></span>
                <span
                  className={`hyperlinkRauria-${index} leftline`}
                  style={{ left: "-11px" }}
                ></span>

                {hyperlinkData.show_icon_enabled && <HyperLink />}
                <Typography style={{ overflow: "hidden", maxWidth: "100%" }}>
                  <a
                    href={hyperlinkData.address}
                    style={{ color: "#a19b6e" }}
                    target="blank"
                  >
                    {hyperlinkData.place_holder}
                  </a>
                  {/* {hyperlinkData.address
                    ? hyperlinkData.address
                    : hyperlinkData.place_holder} */}
                </Typography>
                {/* <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  multiline={hyperlinkData.type === false}
                  rows={5}
                  value={hyperlinkData}
                  autoComplete="off"
                  placeholder={hyperlinkData.place_holder}
                  sx={{
                    my: 0,
                    "& .MuiInputBase-root": {
                      // minHeight: "45px",
                      // height: textData.height,
                    },
                    "& fieldset": { border: "none" },
                    // backgroundColor: "rgba(254, 240, 138, 0.7)",
                    fontWeight: "bold",
                  }}
                  // onChange={handleChange}
                  inputProps={{
                    sx: { fontWeight: 600, padding: 0 }, // Sử dụng style để đặt fontWeight và padding
                  }}
                />
                {hyperlinkData.required && (
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
                )} */}
              </Stack>
            </Tooltip>
          </Box>
        </ResizableBox>
      </Draggable>

      {isOpenModalSetting[index] && (
        <HyperlinkSettingField
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          hyperlinkData={hyperlinkData}
          workFlow={workFlow}
          getFields={getFields}
        />
      )}
    </>
  );
};

HyperlinkField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  hyperlinkData: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};

export default HyperlinkField;
