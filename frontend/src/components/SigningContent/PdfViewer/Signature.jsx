/* eslint-disable no-unused-vars */
import { ReactComponent as GiunIcon } from "@/assets/images/svg/congiun.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ReactComponent as SignIcon } from "@/assets/images/svg/sign_icon.svg";
import "@/assets/style/react-resizable.css";
import { ModalSigning } from "@/components/modal2";
import { ModalSmartid, ModalUsb, OTP_SMS } from "@/components/modal3";
import {
  FaceMode,
  JwtScal1,
  OTP_EMAIL,
} from "@/components/modal3/ModalInternal";
import { ModalEid } from "@/components/modal_eid";
import { SignatureSetting } from "@/components/modal_setting";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import {
  checkIsPosition,
  checkTimeIsBeforeNow,
  getSigner,
  next,
} from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import { toast } from "react-toastify";
import { SigDetail } from ".";
import { SigningForm2 } from "../../modal1";

/* eslint-disable react/prop-types */
export const Signature = ({
  index,
  pdfPage,
  signatureData,
  workFlow,
  textbox,
  textField,
  initial,
  props,
  openResize,
  setOpenResize,
}) => {
  // console.log("textField: ", textField);
  // console.log("initial: ", initial);
  // console.log("workFlow: ", workFlow);
  // console.log("page: ", page);
  // console.log("qrypto: ", qrypto);
  // console.log("signatureData: ", signatureData);

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const field = queryClient.getQueryData(["getField"]);

  const [isOpenModalSetting, setOpenModalSetting] = useState([false]);
  const [isOpenSigningForm, setOpenSigningForm] = useState([false]);
  const [isShowModalSignImage, setShowModalSignImage] = useState([false]);
  const [isShowModalSmartid, setShowModalSmartid] = useState([false]);
  const [isShowModalUsb, setShowModalUsb] = useState([false]);
  const [isShowEidModal, setShowEidModal] = useState([false]);
  const [isShowEidModalSign, setShowEidModalSign] = useState([false]);
  const [isShowModalInternalEmail, setShowModalInternalEmail] = useState([
    false,
  ]);
  const [isShowModalInternalFace, setShowModalInternalFace] = useState([false]);
  const [isShowModalJwtScal1, setShowModalJwtScal1] = useState([false]);

  const [dragPosition, setDragPosition] = useState({
    x: (signatureData.dimension?.x * pdfPage.width) / 100,
    y: (signatureData.dimension?.y * pdfPage.height) / 100,
  });
  // console.log("dragPosition: ", dragPosition);
  const [isControlled, setIsControlled] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const [showTopbar, setShowTopbar] = useState(false);
  const [isShowSigDetail, setIsShowSigDetail] = useState([false]);
  const isOver = useRef(false);

  // const queryClient = useQueryClient();
  const newPos = useRef({
    x: (signatureData.dimension?.x * pdfPage.width) / 100,
    y: (signatureData.dimension?.y * pdfPage.height) / 100,
  });
  // console.log("currentPos: ", newPos.current);
  const [dataSigning, setDataSigning] = useState({});
  // console.log("dataSigning: ", dataSigning);
  const boxRef = useRef(null);

  const signer = getSigner(workFlow);
  // console.log("signer: ", signer);
  const signerId = signer.signerId;
  const [isSetPos, setIsSetPos] = useState(false);
  // console.log("isSetPos: ", isSetPos);

  const [sigDetail, setSigDetail] = useState([]);
  // console.log("sigDetail: ", sigDetail);

  // const checkInit = initial.findIndex(
  //   (item) =>
  //     item.process_status === "UN_PROCESSED" &&
  //     item.field_name.includes(signerId)
  // );
  // // console.log("checkInit: ", checkInit);

  // const checkTextBox = textbox.findIndex(
  //   (item) =>
  //     item.field_name.includes(signerId) &&
  //     item.value === "" &&
  //     item.required === true
  // );

  const [newFields, setNewFields] = useState(
    Object.entries(field)
      .filter(([key, value]) => key !== "textField" && Array.isArray(value)) // Loại bỏ các phần tử không phải là mảng
      .flatMap(([, value]) => value)
      .filter(
        (item) =>
          item.process_status === "UN_PROCESSED" &&
          item.field_name.includes(signer.signerId)
      )
  );

  useEffect(() => {
    setNewFields(
      Object.entries(field)
        .filter(([key, value]) => key !== "textField" && Array.isArray(value)) // Loại bỏ các phần tử không phải là mảng
        .flatMap(([, value]) => value)
        .filter(
          (item) =>
            item.type !== "SIGNATURE" &&
            item.process_status === "UN_PROCESSED" &&
            item.remark?.includes(signer.signerId)
        )
    );
  }, [field]);

  // console.log("NewFields: ", newFields);
  const checkRequired = newFields.findIndex(
    (item) =>
      (item.required === true ||
        (Array.isArray(item.required) && item.required?.includes(signerId))) &&
      (item.value === "" || !item.value)
  );
  // console.log("checkRequired: ", checkRequired);

  useEffect(() => {
    setDragPosition({
      x: (signatureData.dimension?.x * pdfPage.width) / 100,
      y: (signatureData.dimension?.y * pdfPage.height) / 100,
    });
  }, [signatureData]);

  useEffect(() => {
    if (signatureData.selected && boxRef.current && !scrolled) {
      // console.log("boxRef.current: ", boxRef.current);
      boxRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      setScrolled(true);
    }
    if (!signatureData.selected) {
      setScrolled(false);
    }
  }, [signatureData, scrolled]);
  // useEffect(() => {
  //   if (signatureData.selected && boxRef.current) {
  //     // console.log("object");
  //     boxRef.current.focus();
  //   }
  // }, [signatureData.selected]);

  useEffect(() => {
    const sigInfor = queryClient.getQueryData(["getSignedInfo"]) || [];
    const newSig1 =
      sigInfor
        ?.filter((item) => item.value.field_name === signatureData.field_name)
        ?.map((item) => ({ isSigned: true, ...item.value })) || [];

    const newSig2 =
      workFlow?.participants
        ?.filter(
          (item) =>
            item.certificate &&
            item.certificate.field_name === signatureData.field_name
        )
        ?.map((item) => ({ isSigned: false, ...item.certificate })) || [];

    setSigDetail([...newSig1, ...newSig2]);
  }, [signatureData, workFlow, queryClient]);

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - signatureData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - signatureData.dimension?.y)) / 100;

  const putSignature = UseUpdateSig();

  useEffect(() => {
    setIsSetPos(checkIsPosition(workFlow));
  }, [workFlow]);

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        signatureData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
    },
  });

  const toggleSigDetail = (index) => {
    const newIsOpen = [...isShowSigDetail];
    newIsOpen[index] = !newIsOpen[index];
    setIsShowSigDetail(newIsOpen);
  };

  const handleOpenModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = true;
    setOpenModalSetting(newValue);
  };

  const handleCloseModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = false;
    setOpenModalSetting(newValue);
  };

  const handleOpenSigningForm = (index) => {
    const newValue = [...isOpenSigningForm];
    newValue[index] = true;
    setOpenSigningForm(newValue);
  };

  const handleCloseSigningForm = (index) => {
    const newValue = [...isOpenSigningForm];
    newValue[index] = false;
    setOpenSigningForm(newValue);
  };

  const handleShowModalSignImage = (index) => {
    const newValue = [...isShowModalSignImage];
    newValue[index] = true;
    setShowModalSignImage(newValue);
  };

  const handleCloseModalSignImage = (index) => {
    const newValue = [...isShowModalSignImage];
    newValue[index] = false;
    setShowModalSignImage(newValue);
  };

  const handleShowModalSmartid = (index) => {
    const newValue = [...isShowModalSmartid];
    newValue[index] = true;
    setShowModalSmartid(newValue);
  };

  const handleCloseModalSmartid = (index) => {
    // console.log("yeye");
    const newValue = [...isShowModalSmartid];
    newValue[index] = false;
    setShowModalSmartid(newValue);
  };

  const handleShowModalUsb = (index) => {
    const newValue = [...isShowModalUsb];
    newValue[index] = true;
    setShowModalUsb(newValue);
  };

  const handleCloseModalUsb = (index) => {
    const newValue = [...isShowModalUsb];
    newValue[index] = false;
    setShowModalUsb(newValue);
  };

  const handleShowEidModal = (index) => {
    const newValue = [...isShowEidModal];
    newValue[index] = true;
    setShowEidModal(newValue);
  };

  const handleCloseEidModal = (index) => {
    const newValue = [...isShowEidModal];
    newValue[index] = false;
    setShowEidModal(newValue);
  };

  const handleShowEidModalSign = (index) => {
    const newValue = [...isShowEidModalSign];
    newValue[index] = true;
    setShowEidModalSign(newValue);
  };

  const handleCloseEidModalSign = (index) => {
    const newValue = [...isShowEidModalSign];
    newValue[index] = false;
    setShowEidModalSign(newValue);
  };

  const handleShowInternalModalEmail = (index) => {
    const newValue = [...isShowModalInternalEmail];
    newValue[index] = true;
    setShowModalInternalEmail(newValue);
  };

  const handleCloseInternalModalEmail = (index) => {
    const newValue = [...isShowModalInternalEmail];
    newValue[index] = false;
    setShowModalInternalEmail(newValue);
  };

  const handleShowInternalModalFace = (index) => {
    const newValue = [...isShowModalInternalFace];
    newValue[index] = true;
    setShowModalInternalFace(newValue);
  };

  const handleCloseInternalModalFace = (index) => {
    const newValue = [...isShowModalInternalFace];
    newValue[index] = false;
    setShowModalInternalFace(newValue);
  };

  const handleShowJwtScal1 = (index) => {
    const newValue = [...isShowModalJwtScal1];
    newValue[index] = true;
    setShowModalJwtScal1(newValue);
  };

  const handleCloseJwtScal1 = (index) => {
    const newValue = [...isShowModalJwtScal1];
    newValue[index] = false;
    setShowModalJwtScal1(newValue);
  };

  const handleShowmodal = (index) => {
    switch (dataSigning.provider) {
      case "SMART_ID_SIGNING":
        handleShowModalSmartid(index);
        break;
      case "USB_TOKEN_SIGNING":
        handleShowModalUsb(index);
        break;
      case "ELECTRONIC_ID":
        handleShowJwtScal1(index);
        break;
      case "ISS":
        switch (dataSigning.certChain.authMode) {
          case "EXPLICIT/OTP-SMS":
            handleShowEidModalSign(index);
            break;
          case "EXPLICIT/PIN":
            handleShowModalUsb(index);
            break;
          case "EXPLICIT/OTP-EMAIL":
            handleShowInternalModalEmail(index);
            break;
          case "EXPLICIT/JWT":
            handleShowInternalModalFace(index);
            break;
        }
        break;
    }
  };

  const handleRemoveSignature = async () => {
    // if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature.mutate();
  };

  const TopBar = ({ signatureData }) => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          // display:
          //   signerId + "_" + signatureData.type + "_" + signatureData.suffix ===
          //   signatureData.field_name
          //     ? "flex"
          //     : "none",
          display: signatureData.remark?.includes(
            workFlow.workFlowId + "_" + signerId
          )
            ? "flex"
            : "none",
          backgroundColor: "#D9DFE4",
        }}
        className="topBar"
      >
        <SvgIcon
          component={SignIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
          }}
          onClick={() => {
            // if (checkInit !== -1) {
            //   alert(t("signing.init_warning"));
            //   return;
            // } else if (checkTextBox !== -1) {
            //   alert(t("signing.text_warning"));
            //   return;
            // } else {
            //   handleOpenSigningForm(index);
            // }
            if (checkTimeIsBeforeNow(workFlow.deadlineAt)) {
              toast.error(t("signing.workflow_expỉred"));
            } else if (checkRequired !== -1) {
              toast.error(t("signing.text_warning"));
            } else {
              handleOpenSigningForm(index);
            }
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
            display:
              isSetPos || workFlow.arrangement_enabled === 1 ? "none" : "block",
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(`rauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (signatureData.page !== null && signatureData.page !== pdfPage.currentPage)
    return null;

  return (
    <>
      <Draggable
        handle={`#sigDrag-${index}`}
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
          // console.log("signatureData: ", signatureData);
          // console.log("e: ", e);
          if (signatureData.process_status === "PROCESSED") return;

          setIsControlled(true);
          handleDrag("none");
          const draggableComponent = document.querySelector(
            `.signature-${index}`
          );
          const targetComponents = document.querySelectorAll(".sig");
          const containerComponent = document.getElementById(
            `pdf-view-${pdfPage.currentPage - 1}`
          );

          const containerRect = containerComponent.getBoundingClientRect();

          const draggableRect = draggableComponent.getBoundingClientRect();
          // console.log("draggableRect: ", draggableRect);
          // console.log("containerRect: ", containerRect);
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
              isOver.current = true;
              console.log("Draggable component is over the target component");
            } else {
              isOver.current = false;
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
                  field_name: signatureData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: x,
                    y: y,
                    width: -1,
                    height: -1,
                  },
                  visible_enabled: true,
                },
                field: signatureData.type.toLowerCase(),
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
        disabled={
          isSetPos ||
          !signatureData.remark?.includes(
            workFlow.workFlowId + "_" + signerId
          ) ||
          signatureData.process_status === "PROCESSED"
        }
      >
        <ResizableBox
          width={
            signatureData.dimension?.width
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            signatureData.dimension?.height
              ? signatureData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: signatureData.process_status === "PROCESSED" ? 0 : 1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            isSetPos ||
            signatureData.process_status === "PROCESSED" ||
            !signatureData.remark?.includes(
              workFlow.workFlowId + "_" + signerId
            )
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? (pdfPage.width * 20) / 100
              : 200,

            isSetPos ||
            signatureData.process_status === "PROCESSED" ||
            !signatureData.remark?.includes(
              workFlow.workFlowId + "_" + signerId
            )
              ? signatureData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? (pdfPage.height * 5) / 100
              : 50,
          ]}
          maxConstraints={[
            isSetPos ||
            signatureData.process_status === "PROCESSED" ||
            !signatureData.remark?.includes(
              workFlow.workFlowId + "_" + signerId
            )
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,

            isSetPos ||
            signatureData.process_status === "PROCESSED" ||
            !signatureData.remark?.includes(
              workFlow.workFlowId + "_" + signerId
            )
              ? signatureData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          onResize={(e, { size }) => {}}
          onResizeStop={(e, { size }) => {
            // console.log("e: ", e);
            if (
              isSetPos ||
              signatureData.process_status === "PROCESSED" ||
              !signatureData.remark?.includes(
                workFlow.workFlowId + "_" + signerId
              )
            )
              return;
            putSignature.mutate(
              {
                body: {
                  field_name: signatureData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: -1,
                    y: -1,
                    width: (size.width / pdfPage.width) * 100,
                    height: (size.height / pdfPage.height) * 100,
                  },
                  visible_enabled: true,
                },
                field: signatureData.type.toLowerCase(),
                documentId: workFlow.documentId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            );
          }}
          className={`sig signature-${index}`}
        >
          <Box
            id={`sigDrag-${index}`}
            sx={{
              backgroundColor:
                signatureData.process_status === "PROCESSED" ||
                !signatureData.remark?.includes(
                  workFlow.workFlowId + "_" + signerId
                )
                  ? "rgba(217, 223, 228, 0.7)"
                  : "rgba(254, 240, 138, 0.7)",
              ...(signatureData.selected && next),
              height: "100%",
              position: "relative",
              padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor:
                signatureData.process_status === "PROCESSED" ||
                !signatureData.remark?.includes(
                  workFlow.workFlowId + "_" + signerId
                )
                  ? "black"
                  : "#EAB308",
            }}
            onMouseMove={(e) => {
              if (!showTopbar) {
                setShowTopbar(true);
              }
            }}
            onMouseLeave={(e) => {
              if (showTopbar) {
                setShowTopbar(false);
              }
            }}
            onMouseDown={(e) => {
              setTimeout(() => {
                setShowTopbar(false);
              }, 500);
            }}
            onClick={(e) => {
              if (isOver.current) return;
              if (signatureData.process_status === "PROCESSED") {
                toggleSigDetail(index);
              } else if (checkTimeIsBeforeNow(workFlow.deadlineAt)) {
                toast.error(t("signing.workflow_expỉred"));
                return;
              } else if (
                !signatureData.remark?.includes(
                  workFlow.workFlowId + "_" + signerId
                ) ||
                (newPos.current.x !== dragPosition.x &&
                  newPos.current.y !== dragPosition.y)
              ) {
                return;
              } else if (
                e.target.id === `sigDrag-${index}` ||
                e.target.parentElement?.id === "drag" ||
                e.target.id === "click-duoc" ||
                e.target.parentElement?.id === "click-duoc"
              ) {
                // if (checkInit !== -1) {
                //   alert(t("signing.init_warning"));
                //   return;
                // }
                // if (checkTextBox !== -1) {
                //   alert(t("signing.text_warning"));
                //   return;
                // }
                // handleOpenSigningForm(index);
                if (checkRequired !== -1) {
                  toast.error(t("signing.text_warning"));
                  return;
                } else {
                  handleOpenSigningForm(index);
                }
              }
            }}
          >
            <div>
              {showTopbar && <TopBar signatureData={signatureData} />}
              <span
                className={`rauria-${index} topline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`rauria-${index} rightline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`rauria-${index} botline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`rauria-${index} leftline`}
                style={{ display: "none" }}
              ></span>
              <Box
                // ref={boxRef}
                id="click-duoc"
                variant="h5"
                width={"100%"}
                borderBottom="2px dotted"
                borderColor={
                  !signatureData.remark?.includes(
                    workFlow.workFlowId + "_" + signerId
                  )
                    ? "black"
                    : "#EAB308"
                }
                textAlign={"center"}
                height="45px"
                sx={{
                  overflow: "hidden",
                }}
              >
                Signature
                <br />
                <SvgIcon
                  component={GiunIcon}
                  inheritViewBox
                  sx={{
                    width: "15px",
                    height: "15px",
                    color: "#545454",
                  }}
                  // onClick={() => handleOpenSigningForm(index)}
                />
                <TextField
                  // sx={{ width: 0, height: 0, opacity: 0, position: "absolute" }}
                  sx={{
                    opacity: 0,
                    my: 0,
                    "& .MuiInputBase-root": {
                      height: 0,
                      width: 0,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderWidth: "0",
                        padding: "0",
                      },
                    },
                    "& .MuiInputBase-input": {
                      height: "0",
                      padding: "0",
                    },
                  }}
                  inputRef={boxRef}
                />
              </Box>
            </div>
          </Box>
        </ResizableBox>
      </Draggable>

      {isOpenModalSetting[index] && (
        <SignatureSetting
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          setDataSigning={setDataSigning}
          signatureData={signatureData}
          workFlow={workFlow}
        />
      )}

      {isOpenSigningForm[index] && (
        <SigningForm2
          open={isOpenSigningForm[index]}
          onClose={() => handleCloseSigningForm(index)}
          // index={signatureData.page - 1}
          workFlow={workFlow}
          handleShowModalSignImage={() => handleShowModalSignImage(index)}
          handleShowEidModal={() => handleShowEidModal(index)}
          setDataSigning={setDataSigning}
          signatureData={signatureData}
        />
      )}

      {isShowEidModal[index] && (
        <ModalEid
          open={isShowEidModal[index]}
          onClose={() => handleCloseEidModal(index)}
          workFlow={dataSigning}
          signer={signer}
          dataSigning={dataSigning}
          setDataSigning={setDataSigning}
          handleShowModalSignImage={() => handleShowModalSignImage(index)}
        />
      )}

      {isShowModalSignImage[index] && (
        <ModalSigning
          open={isShowModalSignImage[index]}
          onClose={() => handleCloseModalSignImage(index)}
          signer={signer}
          dataSigning={dataSigning}
          setDataSigning={setDataSigning}
          handleShowmodal={() => handleShowmodal(index)}
          signatureData={signatureData}
          pdfPage={pdfPage}
          isControlled={isControlled}
          isSetPos={isSetPos}
          index={index}
          signerId={signerId}
          maxPosibleResizeWidth={maxPosibleResizeWidth}
          maxPosibleResizeHeight={maxPosibleResizeHeight}
          workFlow={workFlow}
          setIsControlled={setIsControlled}
          dragPosition={dragPosition}
          setDragPosition={setDragPosition}
          handleDrag={handleDrag}
          newPos={newPos}
          props={props}
          openResize={openResize}
          setOpenResize={setOpenResize}
        />
      )}

      {isShowModalSmartid[index] && (
        <ModalSmartid
          open={isShowModalSmartid[index]}
          onClose={() => handleCloseModalSmartid(index)}
          dataSigning={{ ...dataSigning, textField }}
        />
      )}

      {isShowModalUsb[index] && (
        <ModalUsb
          open={isShowModalUsb[index]}
          onClose={() => handleCloseModalUsb(index)}
          dataSigning={{ ...dataSigning, textField }}
          setDataSigning={setDataSigning}
          textField={textField}
        />
      )}

      {isShowEidModalSign[index] && (
        <OTP_SMS
          open={isShowEidModalSign[index]}
          onClose={() => handleCloseEidModalSign(index)}
          dataSigning={{ ...dataSigning, textField }}
          setDataSigning={setDataSigning}
          signatureData={signatureData}
        />
      )}

      {isShowModalInternalEmail[index] && (
        <OTP_EMAIL
          open={isShowModalInternalEmail[index]}
          onClose={() => handleCloseInternalModalEmail(index)}
          dataSigning={{ ...dataSigning, textField }}
        />
      )}

      {isShowModalInternalFace[index] && (
        <FaceMode
          open={isShowModalInternalFace[index]}
          onClose={() => handleCloseInternalModalFace(index)}
          dataSigning={{ ...dataSigning, textField }}
        />
      )}

      {isShowModalJwtScal1[index] && (
        <JwtScal1
          open={isShowModalJwtScal1[index]}
          onClose={() => handleCloseJwtScal1(index)}
          dataSigning={{ ...dataSigning, textField }}
        />
      )}

      {isShowSigDetail[index] && (
        <SigDetail
          open={isShowSigDetail[index]}
          signDetail={sigDetail[0]}
          handleClose={() => toggleSigDetail(index)}
        />
      )}
    </>
  );
};

export default Signature;
