/* eslint-disable react/prop-types */
import "@/assets/style/cursor.css";
import { useCommonHook } from "@/hook";
import { UseAddSig, UseAddTextField } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import {
  checkIsPosition,
  checkTimeIsBeforeNow,
  getSigner,
} from "@/utils/commonFunction";
import { generateFieldName } from "@/utils/getField";
import Box from "@mui/material/Box";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { Document } from ".";
import { ContextMenu } from "../../ContextMenu";
import useCountry from "@/hook/use-country";
import { initField, sigField } from "@/utils/AddField";
import { toast } from "react-toastify";
import mouse from "@/assets/images/svg/mouse-right2.svg";

export const PdfViewer = ({
  workFlow,
  field,
  fieldSelect,
  setQryptoInfo,
  blink,
}) => {
  // console.log("field: ", field);
  // console.log("fieldSelect: ", fieldSelect);
  // console.log("workFlow: ", workFlow);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { address } = useCountry();

  const [contextMenu, setContextMenu] = useState(null);

  const signerId = getSigner(workFlow).signerId;

  const signer = getSigner(workFlow);
  // console.log("signer: ", signer);
  const { signingToken } = useCommonHook();

  const [signInfo, setSignInFo] = useState(null);
  // console.log("signInfo: ", signInfo);

  const isSetPosRef = useRef(checkIsPosition(workFlow));
  // const isSetPos = isSetPosRef.current;

  useEffect(() => {
    isSetPosRef.current = checkIsPosition(workFlow);
  }, [workFlow]);

  // eslint-disable-next-line no-unused-vars
  // const { data: field } = useQuery({
  //   queryKey: ["getField"],
  //   queryFn: () => fpsService.getFields({ documentId: workFlow.documentId }),
  //   select: (data) => {
  //     // console.log("data: ", data);
  //     const newData = { ...data };
  //     const textField = data.textbox
  //       .filter(
  //         (item) =>
  //           item.type !== "TEXTFIELD" &&
  //           item.process_status !== "PROCESSED" &&
  //           item.value !== ""
  //       )
  //       .map((item) => {
  //         return {
  //           field_name: item.field_name,
  //           value: item.value,
  //         };
  //       });
  //     return {
  //       ...newData,
  //       textField,
  //       workFlowId: workFlow.workFlowId,
  //     };
  //   },
  // });

  // console.log("getField: ", field);

  const addSignature = UseAddSig();
  const addTextBox = UseAddTextField();
  // const updateQr = UseUpdateQr();

  const handleContextMenu = (page) => (event) => {
    if (workFlow.deadlineAt && checkTimeIsBeforeNow(workFlow.deadlineAt))
      return;
    if (
      signer.signerStatus !== 1 ||
      workFlow.arrangement_enabled === 1 ||
      (event.target.className !== "rpv-core__text-layer" &&
        event.target.className !== "rpv-core__text-layer-text")
    )
      return;
    const tumlum = document.getElementsByClassName("rpv-core__text-layer");
    const rect = tumlum[page.pageIndex].getBoundingClientRect();
    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    const data = {
      x: (x * 100) / rect.width,
      y: (y * 100) / rect.height,
      width: 22,
      height: 5,
      page: page.pageIndex + 1,
      // totalPage: page.doc._pdfInfo.numPages,
    };

    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
    setSignInFo(data);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const signatureField = (value) => {
    for (const item of field.signature) {
      // if (
      //   item.field_name.substring(0, item.field_name.length - 7) ===
      //   signerId + "_" + value
      // ) {
      //   alert(t("signing.sig_warning"));
      //   return;
      // }
      if (
        item.field_name.substring(0, item.field_name.length - 7) ===
        workFlow.workFlowId + "_" + signerId + "_" + value
      ) {
        toast.error(t("signing.sig_warning"));
        return;
      }
    }
    const newSignature = sigField(
      value,
      workFlow.workFlowId + "_" + signerId,
      signInfo
    );
    addSignature.mutate(
      {
        body: newSignature,
        field: newSignature.type.toLowerCase(),
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const handleValue = (value) => {
    switch (value) {
      case "NAME":
        return signer.lastName + " " + signer.firstName;
      case "EMAIL":
        return signer.email;
      case "JOBTITLE":
        return signer.metaInformation?.position || "";
      case "COMPANY":
        return signer.metaInformation?.company || "";
      case "LOCATION":
        return address;
      default:
        return "";
    }
  };

  const handlePlaceHolder = (type) => {
    switch (type) {
      case "TEXTAREA":
        return "Text Area";
      case "TEXTFIELD":
        return "Text Field";
      case "JOBTITLE":
        return "Job Title";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    }
  };

  const textField = (value) => {
    // console.log("value: ", value);
    const fieldName = generateFieldName(signerId, value);
    const newTextField = {
      type: value,
      field_name: fieldName.value,
      page: signInfo.page,
      value: handleValue(value),
      read_only: false,
      multiline: value === "TEXTAREA" ? true : false,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: value === "TEXTAREA" ? 23.4 : 15,
        height: value === "TEXTAREA" ? 9.2 : 2,
      },
      required: false,
      place_holder: handlePlaceHolder(value),
      suffix: fieldName.suffix,
      remark: [signerId],
    };
    addTextBox.mutate(
      {
        body: newTextField,
        field: "text",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const seal = (value) => {
    const sealField = generateFieldName(signerId, value);
    const newSeal = {
      type: value,
      field_name: sealField.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: sealField.suffix,
      visible_enabled: true,
      remark: [signerId],
      required: false,
    };
    addTextBox.mutate(
      {
        body: newSeal,
        field: "stamp",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const addTextField = (value) => {
    const fieldName = generateFieldName(signerId, value);
    const newTextField = {
      type: value,
      field_name: fieldName.value,
      page: signInfo.page,
      value: handleValue(value),
      read_only: false,
      multiline: true,
      format_type: "ALPHANUMERIC",
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: fieldName.suffix,
      remark: [signerId],
    };
    addTextBox.mutate(
      {
        body: newTextField,
        field: "text",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const initial = (value) => {
    const newInitField = initField(value, signerId, signInfo);
    addTextBox.mutate(
      {
        body: newInitField,
        field: "initials",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const qrCode = (value) => {
    if (field?.qr?.length > 0) {
      toast.error(t("signing.qr_warning"));
      return;
    }
    const qrToken = uuidv4();
    const fieldName = generateFieldName(signerId, value);
    const newInitField = {
      field_name: fieldName.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 20,
        height: 13,
      },
      suffix: fieldName.suffix,
      qr_token: qrToken,
      value: `${window.location.origin}/view/documents/${qrToken}`,
      signing_token: signingToken,
    };
    addTextBox.mutate(
      {
        body: newInitField,
        field: "qrcode",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const QrQrypto = (value) => {
    const fieldName = generateFieldName(signerId, value);
    const newQrQrypto = {
      field_name: fieldName.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 20,
        height: 13,
      },
      suffix: fieldName.suffix,
    };
    addTextBox.mutate(
      {
        body: newQrQrypto,
        field: "qrcode-qrypto",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const hyperlink = async (value) => {
    const hyperlinkField = generateFieldName("GATEWAY", value);
    const newCameraField = {
      type: value,
      field_name: hyperlinkField.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: hyperlinkField.suffix,
      visible_enabled: true,
      remark: [],
      place_holder: "(Hyperlink)",
      show_icon: true,
      // tooltip: data.tooltip,
      seal_required: [],
    };
    await fpsService.addTextBox(
      newCameraField,
      "hyperlink",
      workFlow.documentId
    );
    // if (!response) return;
    // await getFields();
  };

  const handleClickMenu = (value) => () => {
    // console.log("data: ", value);
    handleClose();
    switch (value) {
      case "SIGNATURE":
        signatureField(value);
        break;
      case "NAME":
      case "EMAIL":
      case "JOBTITLE":
      case "COMPANY":
      case "TEXTFIELD":
      case "TEXTAREA":
      case "LOCATION":
        textField(value);
        break;
      case "TEXTBOX":
        addTextField(value);
        break;
      case "INITIAL":
        initial(value);
        break;
      case "QR":
        qrCode(value);
        break;
      case "QRYPTO":
        QrQrypto(value);
        break;
      case "SEAL":
        seal(value);
        break;
      case "HYPERLINK":
        hyperlink(value);
        break;
    }
  };

  const renderPage = (props) => {
    return (
      <div
        className={`cuong-page-${props.pageIndex}`}
        // onContextMenu={handleContextMenu(props)}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ContextMenu
          contextMenu={contextMenu}
          handleClose={handleClose}
          handleClickMenu={handleClickMenu}
          signerType={signer.signerType}
        />
        <Document
          props={props}
          workFlow={workFlow}
          setQryptoInfo={setQryptoInfo}
          signatures={field?.signature.map((item) => ({
            ...item,
            selected: item.field_name === fieldSelect && blink ? true : false,
          }))}
          textbox={field?.textbox
            ?.filter((item) => item.type !== "TEXTBOX" && item.type !== "DATE")
            .map((item) => ({
              ...item,
              selected: item.field_name === fieldSelect && blink ? true : false,
            }))}
          initial={field?.initial.map((item) => ({
            ...item,
            selected: item.field_name === fieldSelect && blink ? true : false,
          }))}
          qr={field?.qr}
          qrypto={field?.qrypto}
          textField={field?.textField}
          addText={field?.textbox
            ?.filter((item) => item.type === "TEXTBOX")
            .map((item) => ({
              ...item,
              selected: item.field_name === fieldSelect && blink ? true : false,
            }))}
          date={field?.textbox
            ?.filter((item) => item.type === "DATE")
            .map((item) => ({
              ...item,
              selected: item.field_name === fieldSelect && blink ? true : false,
            }))}
          numeric={field?.stepper.map((item) => ({
            ...item,
            selected: item.field_name === fieldSelect && blink ? true : false,
          }))}
          seal={field?.stamp?.map((item) => ({
            ...item,
            selected: item.field_name === fieldSelect && blink ? true : false,
          }))}
          cameraField={field?.camera.map((item) => ({
            ...item,
            selected: item.field_name === fieldSelect && blink ? true : false,
          }))}
          attachmentField={field?.attachment.map((item) => ({
            ...item,
            selected: item.field_name === fieldSelect && blink ? true : false,
          }))}
          toggleField={field?.toggle.map((item) => ({
            ...item,
            selected: item.field_name === fieldSelect && blink ? true : false,
          }))}
          comboboxField={field?.combobox.map((item) => ({
            ...item,
            selected: item.field_name === fieldSelect && blink ? true : false,
          }))}
          checkboxs={field?.checkbox}
          radioboxs={field?.radiobox}
        />
        {props.canvasLayer.children}
        {props.annotationLayer.children}
        <div
          onContextMenu={handleContextMenu(props)}
          style={{
            userSelect: "none",
            cursor: `url(${mouse}), auto`,
          }}
        >
          {props.textLayer.children}
        </div>
      </div>
    );
  };

  const pageLayout = {
    transformSize: ({ size }) => ({
      height: size.height + 30,
      width: size.width + 30,
    }),
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Box height="100%">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={`data:application/pdf;base64,${workFlow.pdfBase64}`}
          plugins={[defaultLayoutPluginInstance]}
          renderPage={renderPage}
          pageLayout={pageLayout}
        />
      </Worker>
    </Box>
  );
};
PdfViewer.propTypes = {
  workFlow: PropTypes.shape({
    pdfBase64: PropTypes.string,
  }),
};

export default PdfViewer;
