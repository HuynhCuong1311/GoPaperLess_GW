import { ReactComponent as GiunIcon } from "@/assets/images/svg/congiun.svg";
import { ReactComponent as EidIcon } from "@/assets/images/svg/e-id.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as IssIcon } from "@/assets/images/svg/iss.svg";
import { ReactComponent as MobileIdIcon } from "@/assets/images/svg/mobile-id.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ReactComponent as SignIcon } from "@/assets/images/svg/sign_icon.svg";
import { ReactComponent as SmartIdIcon } from "@/assets/images/svg/smart-id.svg";
import { ReactComponent as UsbIcon } from "@/assets/images/svg/usb-token.svg";
import "@/assets/style/react-resizable.css";
import { SigDetail } from "@/components/SigningContent/PdfViewer";
import { useConnectorList, UseGetHeaderFooter, usePreFixList } from "@/hook";
import { UseRemoveField, UseUpdateSig } from "@/hook/use-fpsService";
import {
  checkIsPosition,
  checkTimeIsBeforeNow,
  convertSignOptionsToProvider,
  getLang,
  getSigner,
  next,
} from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import { toast } from "react-toastify";

const SelectProvider = lazy(() =>
  import("@/components/configuration/selectProvider/SelectProvider")
);

const ModalSetting = lazy(() =>
  import("@/components/modal_setting/SignatureSetting/SignatureSetting")
);

const SmartIdFlow = lazy(() =>
  import("@/components/configuration/smartId/SmartIdFlow")
);

const UsbTokenFlow = lazy(() =>
  import("@/components/configuration/usbToken/UsbTokenFlow")
);

const EidFlow = lazy(() =>
  import("@/components/configuration/electronicId/EidFlow")
);

const IssFlow = lazy(() => import("@/components/configuration/iss/IssFlow"));

const SettingSignatureImage = lazy(() =>
  import("@/components/SigningContent/settingImage/SettingSignatureImage")
);

const ModalSmartId = lazy(() =>
  import("@/components/modal3/ModalSmartId/ModalSmartid")
);

const ModalOTPPin = lazy(() =>
  import("@/components/modal3/ModalUsb/ModalOTPPin")
);

const ModalJwtScal1 = lazy(() =>
  import("@/components/modal3/ModalInternal/JwtScal1")
);

const ModalOTP_SMS = lazy(() =>
  import("@/components/modal3/ModalEidSign/OTP_SMS")
);

const ModalOTP_EMAIL = lazy(() =>
  import("@/components/modal3/ModalInternal/OTP_EMAIL")
);

const defaultValue = {};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "SET_DEFAULT":
      return {
        data: defaultValue,
        signatureDetails: null,
        isShowSelectProvider: [false],
        isShowSmartIdFlow: [false],
        isShowUsbTokenFlow: [false],
        isShowElectronicFlow: [false],
        isShowIssFlow: [false],
        isShowSettingSignature: [false],
        isShowSigDetail: [false],
        isShowModalSetting: [false],
        isShowModalSmartid: [false],
        isShowModalOTPPin: [false],
        isShowModalJwtScal1: [false],
        isShowModalOTP_SMS: [false],
        isShowModalOTP_EMAIL: [false],
      };
    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
      };
    case "SET_SIGNATURE_DETAILS":
      return {
        ...state,
        signatureDetails: action.payload,
      };
    case "SET_CERT_LIST":
      return {
        ...state,
        certList: action.payload,
      };
    case "SET_IS_SHOW_SELECT_PROVIDER": {
      const newValue = [...state.isShowSelectProvider];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowSelectProvider: newValue,
      };
    }
    case "SET_IS_SHOW_SMART_ID_FLOW": {
      const newValue = [...state.isShowSmartIdFlow];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowSmartIdFlow: newValue,
      };
    }

    case "SET_IS_SHOW_USB_TOKEN_FLOW": {
      const newValue = [...state.isShowUsbTokenFlow];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowUsbTokenFlow: newValue,
      };
    }
    case "SET_IS_SHOW_ELECTRONIC_FLOW": {
      const newValue = [...state.isShowElectronicFlow];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowElectronicFlow: newValue,
      };
    }
    case "SET_IS_SHOW_ISS_FLOW": {
      const newValue = [...state.isShowIssFlow];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowIssFlow: newValue,
      };
    }
    case "SET_IS_SHOW_SETTING_SIGNATURE": {
      const newValue = [...state.isShowSettingSignature];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowSettingSignature: newValue,
      };
    }
    case "SET_IS_SHOW_SIG_DETAIL": {
      const newValue = [...state.isShowSigDetail];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowSigDetail: newValue,
      };
    }
    case "SET_IS_SHOW_MODAL_SETTING": {
      const newValue = [...state.isShowModalSetting];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowModalSetting: newValue,
      };
    }
    case "SET_IS_SHOW_MODAL_SMARTID": {
      const newValue = [...state.isShowModalSmartid];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowModalSmartid: newValue,
      };
    }
    case "SET_IS_SHOW_MODAL_OTP_PIN": {
      const newValue = [...state.isShowModalOTPPin];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowModalOTPPin: newValue,
      };
    }
    case "SET_IS_SHOW_MODAL_JWT_SCAL1": {
      const newValue = [...state.isShowModalJwtScal1];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowModalJwtScal1: newValue,
      };
    }
    case "SET_IS_SHOW_MODAL_OTP_SMS": {
      const newValue = [...state.isShowModalOTP_SMS];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowModalOTP_SMS: newValue,
      };
    }
    case "SET_IS_SHOW_MODAL_OTP_EMAIL": {
      const newValue = [...state.isShowModalOTP_EMAIL];
      newValue[action.index] = action.payload;
      return {
        ...state,
        isShowModalOTP_EMAIL: newValue,
      };
    }
    default:
      throw new Error();
  }
};

const Signature2 = ({ index, pdfPage, signatureData, workFlow, textField }) => {
  // console.log("signatureData: ", signatureData);
  // console.log("workFlow: ", workFlow);
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: defaultValue,
    signatureDetails: null,
    isShowSelectProvider: false,
    isShowSmartIdFlow: false,
    isShowUsbTokenFlow: false,
    isShowElectronicFlow: false,
    isShowIssFlow: false,
    isShowSettingSignature: false,
    isShowSigDetail: [false],
    isShowModalSetting: [false],
    isShowModalSmartid: [false],
    isShowModalOTPPin: [false],
    isShowModalJwtScal1: [false],
    isShowModalOTP_SMS: [false],
    isShowModalOTP_EMAIL: [false],
  });
  console.log("Signature: ", state);

  const queryClient = useQueryClient();
  const field = queryClient.getQueryData(["getField"]);
  const putSignature = UseUpdateSig();
  const removeField = UseRemoveField();
  const headerFooter = UseGetHeaderFooter(workFlow.signingToken);

  const signer = getSigner(workFlow);
  const lang = useMemo(() => getLang(), []);
  const prefixList = usePreFixList(lang);

  const signingOptions = useMemo(() => {
    return signer.signingOptions
      ? signer.signingOptions.map((item) => Object.keys(item)[0])
      : ["mobile", "smartid", "usbtoken", "electronic_id", "iss"];
  }, [signer.signingOptions]);

  const providerName = convertSignOptionsToProvider(signingOptions);
  const connectorList = useConnectorList(providerName);

  const mapProvider = useMemo(() => {
    return signingOptions
      .map((option) => {
        switch (option) {
          case "mobile":
            return {
              label: "Mobile-ID",
              icon: <MobileIdIcon />,
              value: "MOBILE_ID_SIGNING",
            };
          case "smartid":
            return {
              label: "Remote Signing",
              icon: <SmartIdIcon />,
              value: "SMART_ID_SIGNING",
            };
          case "usbtoken":
            return {
              label: "USB-Token",
              icon: <UsbIcon />,
              value: "USB_TOKEN_SIGNING",
            };
          case "electronic_id":
            return {
              label: "Electronic video based Identification",
              icon: <EidIcon />,
              value: "ELECTRONIC_ID",
            };
          case "iss":
            return {
              label: "Internal Signing Service",
              icon: <IssIcon />,
              value: "ISS",
            };
          default:
            return null;
        }
      })
      .filter(Boolean);
  }, [signingOptions]);

  const filterConnector = signer.signingOptions
    ? signer.signingOptions.map((item) => Object.values(item)[0].join(","))
    : [];

  const filterPrefix = prefixList?.data?.filter(
    (item) =>
      item.type === "PHONE-ID" ||
      item.type === "PERSONAL-ID" ||
      item.name === "TAX-CODE"
  );

  const [dragPosition, setDragPosition] = useState({
    x: (signatureData.dimension?.x * pdfPage.width) / 100,
    y: (signatureData.dimension?.y * pdfPage.height) / 100,
  });

  const [isControlled, setIsControlled] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const [showTopbar, setShowTopbar] = useState(false);
  const isDragOver = useRef(false);

  const currentPos = useRef({
    x: (signatureData.dimension?.x * pdfPage.width) / 100,
    y: (signatureData.dimension?.y * pdfPage.height) / 100,
  });

  const dragRef = useRef(null);

  // console.log("signer: ", signer);
  const signerId = signer.signerId;
  const [isSetPos, setIsSetPos] = useState(false);
  // console.log("isSetPos: ", isSetPos);

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - signatureData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - signatureData.dimension?.y)) / 100;

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
  }, [field, signer.signerId]);

  // console.log("NewFields: ", newFields);

  const checkRequired = newFields.findIndex(
    (item) =>
      (item.required === true ||
        (Array.isArray(item.required) && item.required?.includes(signerId))) &&
      (item.value === "" || !item.value)
  );

  useEffect(() => {
    setIsSetPos(checkIsPosition(workFlow));
  }, [workFlow]);

  useEffect(() => {
    setDragPosition({
      x: (signatureData.dimension?.x * pdfPage.width) / 100,
      y: (signatureData.dimension?.y * pdfPage.height) / 100,
    });
  }, [signatureData, pdfPage.width, pdfPage.height]);

  useEffect(() => {
    if (signatureData.selected && dragRef.current && !scrolled) {
      // console.log("boxRef.current: ", boxRef.current);
      dragRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      setScrolled(true);
    }
    if (!signatureData.selected) {
      setScrolled(false);
    }
  }, [signatureData, scrolled]);

  useEffect(() => {
    const sigInfor = queryClient.getQueryData(["getSignedInfo"]) || [];
    const newSig1 = sigInfor?.find(
      (item) => item.value.field_name === signatureData.field_name
    );
    //     ?.map((item) => ({ isSigned: true, ...item.value })) || [];

    const newSig2 = workFlow?.participants?.find(
      (item) =>
        item.certificate &&
        item.certificate.field_name === signatureData.field_name
    );
    //     ?.map((item) => ({ isSigned: false, ...item.certificate })) || [];
    let result = null;
    if (newSig1) {
      result = { isSigned: true, ...newSig1.value };
    } else if (newSig2) {
      result = { isSigned: false, ...newSig2.certificate };
    }
    dispatch({
      type: "SET_SIGNATURE_DETAILS",
      payload: result,
    });
  }, [signatureData, workFlow, queryClient]);

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
              handleOpenSelecProvider();
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
          onClick={handleShowModalSetting}
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
          onClick={() =>
            removeField.mutate(
              {
                documentId: workFlow.documentId,
                field_name: signatureData.field_name,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            )
          }
        />
      </div>
    );
  };

  const handleOpenSelecProvider = () => {
    dispatch({ type: "SET_DEFAULT" });
    dispatch({ type: "SET_IS_SHOW_SELECT_PROVIDER", payload: true, index });
  };

  const handleCloseSelectProvider = () => {
    dispatch({ type: "SET_IS_SHOW_SELECT_PROVIDER", payload: false, index });
  };

  const handleShowModalSetting = () => {
    dispatch({ type: "SET_IS_SHOW_MODAL_SETTING", payload: true, index });
  };

  const handleCloseModalSetting = () => {
    dispatch({ type: "SET_IS_SHOW_MODAL_SETTING", payload: false, index });
  };

  const handleSubmitModelSelectProvider = (data) => {
    // console.log("data: ", data);

    switch (data.provider) {
      case "SMART_ID_SIGNING":
        dispatch({ type: "SET_DATA", payload: data });
        dispatch({ type: "SET_IS_SHOW_SMART_ID_FLOW", payload: true, index });
        break;
      case "USB_TOKEN_SIGNING":
        {
          const newData = {
            connectorName: data.connectorName,
            provider: data.provider,
            tokenDetails: data.tokenDetails,
          };
          dispatch({ type: "SET_DATA", payload: newData });
          dispatch({ type: "SET_CERT_LIST", payload: data.certList });
          dispatch({
            type: "SET_IS_SHOW_USB_TOKEN_FLOW",
            payload: true,
            index,
          });
        }
        break;
      case "ELECTRONIC_ID":
        dispatch({ type: "SET_DATA", payload: data });
        dispatch({ type: "SET_IS_SHOW_ELECTRONIC_FLOW", payload: true, index });
        break;
      case "ISS":
        dispatch({ type: "SET_DATA", payload: data });
        dispatch({ type: "SET_IS_SHOW_ISS_FLOW", payload: true, index });
        break;
      default:
        break;
    }
  };

  const handleSubmitModelSmartIdFlow = (data) => {
    dispatch({ type: "SET_DATA", payload: data });
    dispatch({ type: "SET_IS_SHOW_SMART_ID_FLOW", payload: false, index });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: true, index });
  };

  const handleSubmitModelUsbTokenFlow = (data) => {
    dispatch({ type: "SET_DATA", payload: data });
    console.log("data: ", data);
    dispatch({ type: "SET_IS_SHOW_USB_TOKEN_FLOW", payload: false, index });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: true, index });
  };

  const handleSubmitModelElectronicFlow = (data) => {
    dispatch({ type: "SET_DATA", payload: data });
    dispatch({ type: "SET_IS_SHOW_ELECTRONIC_FLOW", payload: false, index });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: true, index });
  };

  const handleSubmitModelIssFlow = (data) => {
    dispatch({ type: "SET_DATA", payload: data });
    dispatch({ type: "SET_IS_SHOW_ISS_FLOW", payload: false, index });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: true, index });
  };

  const handleSubmitModelSettingSignatureImage = (data) => {
    console.log("data: ", data);
    dispatch({
      type: "SET_DATA",
      payload: { ...data, language: lang, textField },
    });
    dispatch({ type: "SET_IS_SHOW_SETTING_SIGNATURE", payload: false, index });
    switch (data.provider) {
      case "SMART_ID_SIGNING":
        dispatch({ type: "SET_IS_SHOW_MODAL_SMARTID", payload: true, index });
        break;
      case "USB_TOKEN_SIGNING":
        dispatch({ type: "SET_IS_SHOW_MODAL_OTP_PIN", payload: true, index });
        break;
      case "ELECTRONIC_ID":
        dispatch({ type: "SET_IS_SHOW_MODAL_JWT_SCAL1", payload: true, index });
        break;
      case "ISS":
        switch (data.certSelected.authMode) {
          case "EXPLICIT/OTP-SMS":
            dispatch({
              type: "SET_IS_SHOW_MODAL_OTP_SMS",
              payload: true,
              index,
            });
            break;
          case "EXPLICIT/PIN":
            dispatch({
              type: "SET_IS_SHOW_MODAL_OTP_PIN",
              payload: true,
              index,
            });
            break;
          case "EXPLICIT/OTP-EMAIL":
            dispatch({
              type: "SET_IS_SHOW_MODAL_OTP_EMAIL",
              payload: true,
              index,
            });
            break;
          case "EXPLICIT/JWT":
            // handleShowInternalModalFace(index);
            break;
        }
        break;
      default:
        break;
    }
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
        // nodeRef={dragRef}
        handle={`#sigDrag-${index}`}
        // bounds="parent"
        onDrag={() => handleDrag("block")}
        position={dragPosition}
        cancel=".topBar"
        onStart={(e, data) => {
          setDragPosition({ x: data.x, y: data.y });
          currentPos.current.x = data.x;
          currentPos.current.y = data.y;
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
              isDragOver.current = true;
              console.log("Draggable component is over the target component");
            } else {
              isDragOver.current = false;
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
          //   onResize={(e, { size }) => {}}
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
            ref={dragRef}
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
            onMouseMove={() => {
              if (!showTopbar) {
                setShowTopbar(true);
              }
            }}
            onMouseLeave={() => {
              setShowTopbar(false);
            }}
            onMouseDown={() => {
              setTimeout(() => {
                setShowTopbar(false);
              }, 500);
            }}
            onClick={(e) => {
              if (isDragOver.current) return;
              if (signatureData.process_status === "PROCESSED") {
                dispatch({
                  type: "SET_IS_SHOW_SIG_DETAIL",
                  payload: true,
                  index,
                });
              } else if (checkTimeIsBeforeNow(workFlow.deadlineAt)) {
                toast.error(t("signing.workflow_expỉred"));
                return;
              } else if (
                !signatureData.remark?.includes(
                  workFlow.workFlowId + "_" + signerId
                ) ||
                (currentPos.current.x !== dragPosition.x &&
                  currentPos.current.y !== dragPosition.y)
              ) {
                return;
              } else if (
                e.target.id === `sigDrag-${index}` ||
                e.target.parentElement?.id === "drag" ||
                e.target.id === "click-duoc" ||
                e.target.parentElement?.id === "click-duoc"
              ) {
                if (checkRequired !== -1) {
                  toast.error(t("signing.text_warning"));
                  return;
                } else {
                  handleOpenSelecProvider();
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
                />
              </Box>
            </div>
          </Box>
        </ResizableBox>
      </Draggable>

      <Suspense fallback={<div>Loading...</div>}>
        <SelectProvider
          connectorList={connectorList?.data}
          mapProvider={mapProvider}
          filterConnector={filterConnector}
          open={state.isShowSelectProvider[index]}
          onClose={handleCloseSelectProvider}
          handleSubmitModel={handleSubmitModelSelectProvider}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <ModalSetting
          open={state.isShowModalSetting[index]}
          onClose={handleCloseModalSetting}
          signer={signer}
          signatureData={signatureData}
          workFlow={workFlow}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <SmartIdFlow
          initData={state.data}
          filterPrefix={filterPrefix}
          open={state.isShowSmartIdFlow[index]}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({
              type: "SET_IS_SHOW_SMART_ID_FLOW",
              payload: false,
              index,
            });
          }}
          handleSubmitModel={handleSubmitModelSmartIdFlow}
          connectorList={connectorList.data?.SMART_ID_SIGNING}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <UsbTokenFlow
          initData={state.data}
          certList={state.certList}
          open={state.isShowUsbTokenFlow[index]}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({
              type: "SET_IS_SHOW_USB_TOKEN_FLOW",
              payload: false,
              index,
            });
          }}
          handleSubmitModel={handleSubmitModelUsbTokenFlow}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <EidFlow
          initData={state.data}
          filterPrefix={filterPrefix}
          open={state.isShowElectronicFlow[index]}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({
              type: "SET_IS_SHOW_ELECTRONIC_FLOW",
              payload: false,
              index,
            });
          }}
          handleSubmitModel={handleSubmitModelElectronicFlow}
          connectorList={connectorList.data?.SMART_ID_SIGNING}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <IssFlow
          initData={state.data}
          filterPrefix={filterPrefix}
          open={state.isShowIssFlow[index]}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({ type: "SET_IS_SHOW_ISS_FLOW", payload: false, index });
          }}
          handleSubmitModel={handleSubmitModelIssFlow}
          connectorList={connectorList.data?.SMART_ID_SIGNING}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <SettingSignatureImage
          initData={{
            ...state.data,
            pdfContent: workFlow.pdfBase64,
            documentId: workFlow.documentId,
            signatureData: signatureData,
            index: index,
            logoValue: headerFooter.data?.data?.loGo,
          }}
          open={state.isShowSettingSignature[index]}
          onClose={() => {
            // setOpen(false);
            dispatch({ type: "SET_DEFAULT" });
            dispatch({
              type: "SET_IS_SHOW_SETTING_SIGNATURE",
              payload: false,
              index,
            });
          }}
          handleSubmitModel={handleSubmitModelSettingSignatureImage}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <ModalSmartId
          dataSigning={{
            ...state.data,
            workFlow: workFlow,
          }}
          open={state.isShowModalSmartid[index]}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({
              type: "SET_IS_SHOW_MODAL_SMARTID",
              payload: false,
              index,
            });
          }}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <ModalOTPPin
          dataSigning={{
            ...state.data,
            workFlow: workFlow,
          }}
          open={state.isShowModalOTPPin[index]}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({
              type: "SET_IS_SHOW_MODAL_OTP_PIN",
              payload: false,
              index,
            });
          }}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <ModalJwtScal1
          dataSigning={{
            ...state.data,
            workFlow: workFlow,
          }}
          open={state.isShowModalJwtScal1[index]}
          onClose={() => {
            dispatch({ type: "SET_DEFAULT" });
            dispatch({
              type: "SET_IS_SHOW_MODAL_JWT_SCAL1",
              payload: false,
              index,
            });
          }}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <ModalOTP_SMS
          dataSigning={{
            ...state.data,
            workFlow: workFlow,
          }}
          open={state.isShowModalOTP_SMS[index]}
          onClose={() => {
            dispatch({
              type: "SET_IS_SHOW_MODAL_OTP_SMS",
              payload: false,
              index,
            });
            dispatch({ type: "SET_DEFAULT" });
          }}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <ModalOTP_EMAIL
          dataSigning={{
            ...state.data,
            workFlow: workFlow,
          }}
          open={state.isShowModalOTP_EMAIL[index]}
          onClose={() => {
            dispatch({
              type: "SET_IS_SHOW_MODAL_OTP_EMAIL",
              payload: false,
              index,
            });
            dispatch({ type: "SET_DEFAULT" });
          }}
        />
      </Suspense>

      {state.signatureDetails && (
        <SigDetail
          signDetail={state.signatureDetails}
          open={state.isShowSigDetail[index]}
          handleClose={() => {
            dispatch({ type: "SET_IS_SHOW_SIG_DETAIL", payload: false, index });
          }}
        />
      )}
    </>
  );
};

Signature2.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  signatureData: PropTypes.object,
  workFlow: PropTypes.object,
  textField: PropTypes.array,
};

export default Signature2;
