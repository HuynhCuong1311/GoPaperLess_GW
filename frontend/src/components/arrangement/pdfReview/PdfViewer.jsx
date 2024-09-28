/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
import "@/assets/style/cursor.css";
import { useCommonHook } from "@/hook";
import useCountry from "@/hook/use-country";
import { fpsService } from "@/services/fps_service";
import { initField, sigField } from "@/utils/AddField";
import { checkTimeIsBeforeNow, getSigner } from "@/utils/commonFunction";
import { generateFieldName } from "@/utils/getField";
import Box from "@mui/material/Box";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { Document } from ".";
import { ContextMenu } from "../../ContextMenu";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const PdfViewer = ({ workFlow, tabBar, setAttachment }) => {
  const { t } = useTranslation();
  // const queryClient = useQueryClient();
  // console.log("time now: ", new Date());
  const { address } = useCountry();

  const [contextMenu, setContextMenu] = useState(null);
  const [openResize, setOpenResize] = useState(false);
  const signerId = getSigner(workFlow)?.signerId;
  const [field, setField] = useState(null);

  const signer = getSigner(workFlow);
  const { signingToken } = useCommonHook();

  const [signInfo, setSignInFo] = useState(null);

  const participantsType = workFlow.participants.filter(
    (item) => item.signerToken === workFlow.signerToken
  );
  // eslint-disable-next-line no-unused-vars
  // remove fields
  const removeSignature = async (documentId, fileName) => {
    const res = await fpsService.removeSignature(
      { documentId: documentId },
      fileName
    );

    if (res.status === 200) {
      return true;
    } else {
      alert("Error: ", res.message);
    }
  };

  // Get fields
  const getFields = async () => {
    const response = await fpsService.getFields({
      documentId: workFlow.documentId,
    });
    if (!response) return;
    const newData = { ...response };
    const textField = response.textbox
      .filter(
        (item) =>
          item.type !== "TEXTFIELD" &&
          item.process_status !== "PROCESSED" &&
          item.value !== ""
      )
      .map((item) => {
        return {
          field_name: item.field_name,
          value: item.value,
        };
      });
    workFlow.participants.map((participant) => {
      let reload = false;
      switch (participant.signerType) {
        case 2:
          // eslint-disable-next-line no-case-declarations
          const removeSign = newData.signature.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 17) ===
              participant.signerId
            );
          });
          if (removeSign.length > 0) {
            removeSign.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }
          break;
        case 3:
          const removeSign3 = newData.signature.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 17) ===
              participant.signerId
            );
          });
          if (removeSign3.length > 0) {
            removeSign3.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }
          break;
        case 4:
          const removeSign4 = newData.signature.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 17) ===
              participant.signerId
            );
          });
          if (removeSign4.length > 0) {
            removeSign4.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }
          break;
        case 5:
          // remove signature
          const removeSign5 = newData.signature.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 17) ===
              participant.signerId
            );
          });
          if (removeSign5.length > 0) {
            removeSign5.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }
          // remove initial
          const removeinitial5 = newData.initial.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 15) ===
              participant.signerId
            );
          });
          if (removeinitial5.length > 0) {
            removeinitial5.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }
          // remove Email
          const removeEmmail5 = newData.textbox.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 13) ===
              participant.signerId
            );
          });
          if (removeEmmail5.length > 0) {
            removeEmmail5.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }
          // remove Email
          const removeName5 = newData.textbox.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 12) ===
              participant.signerId
            );
          });
          if (removeName5.length > 0) {
            removeName5.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }
          // remove Job
          const removeJob5 = newData.textbox.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 16) ===
              participant.signerId
            );
          });
          if (removeJob5.length > 0) {
            removeJob5.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }
          // remove Company
          const removeCompany5 = newData.textbox.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 15) ===
              participant.signerId
            );
          });
          if (removeCompany5.length > 0) {
            removeCompany5.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }
          // remove Company
          const removeTextFields5 = newData.textbox.filter((item) => {
            return (
              item.field_name.substring(0, item.field_name.length - 17) ===
              participant.signerId
            );
          });
          if (removeTextFields5.length > 0) {
            removeTextFields5.map(async (item) => {
              await removeSignature(workFlow.documentId, item.field_name);
            });
            reload = true;
          }

          break;
      }
      reload ? getFields() : null;
    });
    const checkBox = () => {
      let groupArray = [];
      newData.checkboxV2.map((item) => {
        if (groupArray.includes(item.group_name)) return null;
        groupArray.push(item.group_name);
      });
      return groupArray.map((item) => {
        return newData.checkboxV2.filter((item2) => item2.group_name === item);
      });
    };
    const radioBox = () => {
      let groupArray = [];
      newData.radioboxV2.map((item) => {
        if (groupArray.includes(item.group_name)) return null;
        groupArray.push(item.group_name);
      });
      return groupArray.map((item) => {
        return newData.radioboxV2.filter((item2) => item2.group_name === item);
      });
    };
    // console.log({
    //   ...newData,
    //   checkbox: checkBox(),
    //   textField,
    //   workFlowId: workFlow.workFlowId,
    // });
    setAttachment(newData.attachment);
    setField({
      ...newData,
      checkbox: checkBox(),
      radiobox: radioBox(),
      textField,
      workFlowId: workFlow.workFlowId,
    });
  };
  useEffect(() => {
    getFields();
  }, [workFlow]);

  // const addSignature = UseAddSig();
  // const addTextBox = UseAddTextField();
  // const updateQr = UseUpdateQr();

  const handleContextMenu = (page) => (event) => {
    event.preventDefault();
    // console.log("page: ", event);
    if (
      openResize ||
      (workFlow.deadlineAt && checkTimeIsBeforeNow(workFlow.deadlineAt))
    )
      return;
    if (
      // checkSignerStatus(signer, signerToken) === 2 ||
      event.target.className !== "rpv-core__text-layer" &&
      event.target.className !== "rpv-core__text-layer-text"
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    const data = {
      x: (x * 100) / rect.width,
      y: (y * 100) / rect.height,
      width: 22,
      height: 5,
      page: page.pageIndex + 1,
    };
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
    setSignInFo(data);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const signatureField = async (value) => {
    for (const item of field.signature) {
      if (workFlow.workflowProcessType !== "individual") {
        if (
          item.field_name.substring(0, item.field_name.length - 7) ===
          workFlow.workFlowId + "_" + signerId + "_" + value
        ) {
          // alert(t("signing.sig_warning"));
          toast.error(t("signing.sig_warning"));
          return;
        }
      } else {
        if (
          item.field_name.substring(0, item.field_name.length - 7) ===
          workFlow.workFlowId + "_" + "GROUP_PROVIDER" + "_" + value
        ) {
          // alert(t("signing.sig_warning"));
          toast.error(t("signing.sig_warning"));
          return;
        }
      }
    }
    // const signatureField = generateFieldName(signerId, value);
    const newSignature = sigField(
      value,
      workFlow.workflowProcessType === "individual"
        ? workFlow.workFlowId + "_" + "GROUP_PROVIDER"
        : workFlow.workFlowId + "_" + signerId,
      signInfo
    );
    const response = await fpsService.addSignature(
      newSignature,
      newSignature.type.toLowerCase(),
      workFlow.documentId
    );
    if (!response) return;

    await getFields();
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
      case "NUMERIC_STEPPER":
        return 1;
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

  const textField = async (value) => {
    // console.log("value: ", value);
    // const fieldName = generateFieldName(signerId, value);
    const fieldName = generateFieldName(
      workFlow.workflowProcessType === "individual"
        ? "GROUP_PROVIDER"
        : signerId,
      value
    );
    const newTextField = {
      type: value,
      field_name: fieldName.value,
      page: signInfo.page,
      value:
        workFlow.workflowProcessType === "individual" ? "" : handleValue(value),
      read_only: false,
      multiline: value === "TEXTAREA" ? true : false,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: value === "TEXTAREA" ? 23.4 : 15,
        height: value === "TEXTAREA" ? 9.2 : 2,
      },
      // font: {
      //   name: "montserrat_regular",
      //   size: 13,
      // },
      required: false,

      place_holder: handlePlaceHolder(value),
      suffix: fieldName.suffix,
      remark: [signerId],
    };
    const response = await fpsService.addTextBox(
      newTextField,
      "text",
      workFlow.documentId
    );

    if (!response) return;

    await getFields();
  };

  const numericStepper = async (value) => {
    // console.log("value: ", value);
    const fieldName = generateFieldName("GATEWAY", value);
    const newTextField = {
      type: value,
      field_name: fieldName.value,
      page: signInfo.page,
      value: handleValue(value),
      read_only: false,
      multiline: false,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 18,
        height: 2,
      },
      place_holder: "(Numeric Stepper)",
      suffix: fieldName.suffix,
      remark: [],
      visible_enabled: true,
      show_icon: true,
      // tooltip: data.tooltip,
      seal_required: [],
      numeric_stepper: {
        default_value: 1,
        unit_of_change: 1,
        minimum_value: 0,
        maximum_value: 1000000,
      },
    };

    const response = await fpsService.addTextBox(
      newTextField,
      "numeric_stepper",
      workFlow.documentId
    );

    if (!response) return;

    await getFields();
  };

  const seal = async (value) => {
    // const sealField = generateFieldName(signerId, value);
    const sealField = generateFieldName(
      workFlow.workflowProcessType === "individual"
        ? "GROUP_PROVIDER"
        : signerId,
      value
    );
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
    const response = await fpsService.addTextBox(
      newSeal,
      "stamp",
      workFlow.documentId
    );
    if (!response) return;

    await getFields();
  };

  const addTextField = async (value) => {
    // const fieldName = generateFieldName(signerId, value);
    const fieldName = generateFieldName(
      workFlow.workflowProcessType === "individual"
        ? "GROUP_PROVIDER"
        : signerId,
      value
    );
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
    const response = await fpsService.addTextBox(
      newTextField,
      "text",
      workFlow.documentId
    );

    if (!response) return;

    await getFields();
  };

  const initial = async (value) => {
    const newInitField = initField(
      value,
      workFlow.workflowProcessType === "individual"
        ? "GROUP_PROVIDER"
        : signerId,
      signInfo
    );
    const response = await fpsService.addTextBox(
      newInitField,
      "initials",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const qrCode = async (value) => {
    if (field?.qr?.length > 0) {
      // alert(t("signing.qr_warning"));
      toast.error(t("signing.qr_warning"));
      return;
    }
    const qrToken = uuidv4();
    const fieldName = generateFieldName("GATEWAY", value);
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
    const response = await fpsService.addTextBox(
      newInitField,
      "qrcode",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const queryClient = useQueryClient();
  const signedInfor = queryClient.getQueryData(["getSignedInfo"]);

  const QrQrypto = async (value) => {
    const qrypto = field?.qrypto.find(
      (item) => item.process_status === "UN_PROCESSED"
    );
    if (qrypto) {
      // alert(t("signing.qr_warning"));
      toast.error(t("signing.qr_warning"));
      return;
    }
    const signerInfo = workFlow.participants
      .filter((e) => e.signerType === 1)
      .map((item, index) => {
        return {
          field: item.signerId,
          type: 8,
          mandatory_enable: true,
          value: [
            {
              column_1: item.lastName + " " + item.firstName,
              column_2: item.email,
              column_3: `@Signer${signedInfor.length + index + 1}`,
              text: "",
            },
          ],
          remark: "signer",
        };
      });
    const fieldName = generateFieldName("GATEWAY", value);
    const newQrQrypto = {
      field_name: fieldName.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 20,
        height: 13,
      },
      type: "QRYPTO",
      suffix: fieldName.suffix,
      items: [
        {
          field: "Workflow Name",
          type: 1,
          value: workFlow.documentName,
          remark: "text",
          mandatory_enable: true,
        },
        {
          field: "File Name",
          type: 1,
          value: workFlow.fileName,
          remark: "text",
          mandatory_enable: true,
        },
        ...signerInfo,
      ],
    };
    const response = await fpsService.addTextBox(
      newQrQrypto,
      "qrcode-qrypto",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const camera = async (value) => {
    const cameraField = generateFieldName("GATEWAY", value);
    const newCameraField = {
      type: value,
      field_name: cameraField.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: cameraField.suffix,
      visible_enabled: true,
      remark: [],
      place_holder: "(Camera)",
      show_icon: true,
      // tooltip: data.tooltip,
      seal_required: [],
    };
    const response = await fpsService.addTextBox(
      newCameraField,
      "camera",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const attachment = async (value) => {
    const attachmentField = generateFieldName("GATEWAY", value);
    const newCameraField = {
      type: value,
      field_name: attachmentField.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: attachmentField.suffix,
      visible_enabled: true,
      remark: [],
      place_holder: "(Attachment)",
      show_icon: true,
      // tooltip: data.tooltip,
      seal_required: [],
    };
    const response = await fpsService.addTextBox(
      newCameraField,
      "attachment",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const toggle = async (value) => {
    const toggleField = generateFieldName("GATEWAY", value);
    const newToggleField = {
      type: value,
      field_name: toggleField.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: toggleField.suffix,
      visible_enabled: true,
      remark: [],
      place_holder: "(Toggle)",
      show_icon: true,
      default_item: "Item1",
      value: "Item1",
      items: [
        {
          text: "Item1",
          value: "Item1",
        },
      ],
      // tooltip: data.tooltip,
      seal_required: [],
    };
    const response = await fpsService.addTextBox(
      newToggleField,
      "toggle",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const date = async (value) => {
    // console.log("value: ", value);
    const fieldName = generateFieldName("GATEWAY", value);
    const newTextField = {
      type: value,
      field_name: fieldName.value,
      page: signInfo.page,
      value: handleValue(value),
      read_only: false,
      multiline: value === false,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 3.7,
      },
      date: {
        date_format: "DD-MM-YYYY",
        minimum_date: "",
        maximum_date: "",
        default_date_enabled: false,
        default_date: "",
      },
      place_holder: value,
      suffix: fieldName.suffix,
      remark: [],
      seal_required: [],
    };

    const response = await fpsService.addTextBox(
      newTextField,
      "date",
      workFlow.documentId
    );

    if (!response) return;

    await getFields();
  };

  const combobox = async (value) => {
    const comboboxField = generateFieldName("GATEWAY", value);
    const newComboboxField = {
      type: value,
      field_name: comboboxField.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 3.5,
      },
      suffix: comboboxField.suffix,
      visible_enabled: true,
      remark: [],
      place_holder: "-- Select --",
      show_icon: true,
      items: [
        {
          text: "Item1",
          value: "Item1",
        },
      ],
      // tooltip: data.tooltip,
      seal_required: [],
    };
    const response = await fpsService.addTextBox(
      newComboboxField,
      "combo",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const hyperlink = async (value) => {
    const hyperlinkField = generateFieldName("GATEWAY", value);
    const newHyperlinkField = {
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
    const response = await fpsService.addTextBox(
      newHyperlinkField,
      "hyperlink",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const documentID = async (value) => {
    const documentIDField = generateFieldName("GATEWAY", value);
    const newDocumentIDField = {
      type: value,
      field_name: documentIDField.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: documentIDField.suffix,
      visible_enabled: true,
      remark: [],
      place_holder: workFlow.workFlowId,
      show_icon: true,
      // tooltip: data.tooltip,
      seal_required: [],
    };
    const response = await fpsService.addTextBox(
      newDocumentIDField,
      "text",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };
  const CheckBox = async (value) => {
    const fieldName = generateFieldName("GATEWAY", value);
    const newCheckBox = {
      field_name: fieldName.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 20,
        height: 5,
      },
      multiple_checked: true,
      suffix: fieldName.suffix,
      text_next_to: "",
      checked: false,
      seal_required: [],
      remark: [],
      uncheckbox_frame: {
        background_rgbcode: "#FFFFFF",
        border_rgbcode: "#E5E7EB",
        checked_rgbcode: "#FFFFFF",
      },
      checkbox_frame: {
        background_rgbcode: "#3B82F6",
        border_rgbcode: "#3B82F6",
        checked_rgbcode: "#FFFFFF",
      },
      type: value === "CHECKBOXV2" ? "CHECKBOXV2" : "RADIOBOXV2",
      participants: "123123",
      group_name: `group_${fieldName.suffix}`,
    };
    const response = await fpsService.addTextBox(
      newCheckBox,
      value === "CHECKBOXV2" ? "checkboxV2" : "radioboxV2",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };
  const handleClickMenu = (value) => () => {
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
      case "NUMERIC_STEPPER":
        numericStepper(value);
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
      case "CAMERA":
        camera(value);
        break;
      case "ATTACHMENT":
        attachment(value);
        break;
      case "TOGGLE":
        toggle(value);
        break;
      case "DATE":
        date(value);
        break;
      case "COMBOBOX":
        combobox(value);
        break;
      case "HYPERLINK":
        hyperlink(value);
        break;
      case "DOCUMENTID":
        documentID(value);
        break;
      case "CHECKBOXV2":
        CheckBox(value);
        break;
      case "RADIOBOXV2":
        CheckBox(value);
        break;
    }
  };
  const renderPage = (props) => {
    return (
      <div
        className={`cuong-page-${props.pageIndex}`}
        onContextMenu={
          workFlow.workflowProcessType === "individual"
            ? handleContextMenu(props)
            : participantsType[0]?.signerType || tabBar !== 1
            ? handleContextMenu(props)
            : null
        }
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {workFlow.workflowStatus < 1 && (
          <ContextMenu
            contextMenu={contextMenu}
            handleClose={handleClose}
            handleClickMenu={handleClickMenu}
            tabBar={tabBar}
            signerType={participantsType[0]?.signerType}
            workflowProcessType={workFlow.workflowProcessType}
          />
        )}

        <Document
          props={props}
          workFlow={workFlow}
          signatures={field?.signature}
          textbox={field?.textbox?.filter(
            (item) =>
              item.type !== "TEXTBOX" &&
              item.type !== "DATE" &&
              item.type !== "DOCUMENTID"
          )}
          initial={field?.initial}
          checkboxs={field?.checkbox}
          qr={field?.qr}
          qrypto={field?.qrypto}
          textField={field?.textField}
          addText={field?.textbox?.filter((item) => item.type === "TEXTBOX")}
          date={field?.textbox?.filter((item) => item.type === "DATE")}
          numeric={field?.stepper}
          seal={field?.stamp?.filter((item) => item.type === "SEAL")}
          cameraField={field?.camera}
          attachmentField={field?.attachment}
          hyperlinkField={field?.hyperlink}
          documentIDField={field?.textbox?.filter(
            (item) => item.type === "DOCUMENTID"
          )}
          toggleField={field?.toggle}
          comboboxField={field?.combobox}
          radioboxs={field?.radiobox}
          openResize={openResize}
          setOpenResize={setOpenResize}
          getFields={getFields}
        />
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
