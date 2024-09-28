import { ReactComponent as TextArea } from "@/assets/images/contextmenu/TextArea.svg";
import { ReactComponent as TextField } from "@/assets/images/contextmenu/TextField.svg";
import { ReactComponent as Attachment } from "@/assets/images/contextmenu/attachment.svg";
import { ReactComponent as Toggle } from "@/assets/images/contextmenu/bi_toggles.svg";
import { ReactComponent as Camera } from "@/assets/images/contextmenu/camera.svg";
import { ReactComponent as Company } from "@/assets/images/contextmenu/checkbox.svg";
import { ReactComponent as Combobox } from "@/assets/images/contextmenu/combobox.svg";
import { ReactComponent as Date } from "@/assets/images/contextmenu/date.svg";
import { ReactComponent as DocumentId } from "@/assets/images/contextmenu/document_id.svg";
import { ReactComponent as Email } from "@/assets/images/contextmenu/email.svg";
import { ReactComponent as HyperLink } from "@/assets/images/contextmenu/hyperlink.svg";
import { ReactComponent as Initial } from "@/assets/images/contextmenu/initial.svg";
import { ReactComponent as JobTitle } from "@/assets/images/contextmenu/jobtitle.svg";
import { ReactComponent as Location } from "@/assets/images/contextmenu/location.svg";
import { ReactComponent as Name } from "@/assets/images/contextmenu/name.svg";
import { ReactComponent as NumericStepper } from "@/assets/images/contextmenu/numeric_stepper.svg";
import { ReactComponent as QRCode } from "@/assets/images/contextmenu/qrcode.svg";
import { ReactComponent as QrQrypto } from "@/assets/images/contextmenu/qrypto.svg";
import { ReactComponent as RadioButton } from "@/assets/images/contextmenu/radiobutton.svg";
import { ReactComponent as Seal } from "@/assets/images/contextmenu/seal.svg";
import { ReactComponent as Signature } from "@/assets/images/contextmenu/signature.svg";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const ContextMenu = ({
  contextMenu,
  handleClose,
  handleClickMenu,
  tabBar,
  signerType,
  workflowProcessType,
}) => {
  const { t } = useTranslation();
  let data = [
    {
      icon: <Signature />,
      label: t("0-common.signature"),
      value: "SIGNATURE",
      common: false,
    },
    // {
    //   icon: <InPerson />,
    //   label: t("0-common.in-person"),
    //   value: "INPERSON",
    //   common: false,
    // },
    {
      icon: <Initial />,
      label: t("0-common.initials"),
      value: "INITIAL",
      common: false,
    },
    {
      icon: <Seal />,
      label: t("0-common.seal"),
      value: "SEAL",
      common: false,
    },

    { icon: <Name />, label: t("0-common.name"), value: "NAME", common: false },
    {
      icon: <Email />,
      label: t("0-common.email"),
      value: "EMAIL",
      common: false,
    },
    {
      icon: <JobTitle />,
      label: t("0-common.jobtitle"),
      value: "JOBTITLE",
      common: false,
    },
    {
      icon: <Company />,
      label: t("0-common.company"),
      value: "COMPANY",
      common: false,
    },
    // { icon: <Date />, label: "Date" },
    // { icon: <TextField />, label: "Text Field" },
    // { icon: <TextArea />, label: "Text Area" },
    {
      icon: <RadioButton />,
      label: "Radio Button",
      value: "RADIOBOXV2",
      common: true,
    },
    {
      icon: <Company />,
      label: "Check Box",
      value: "CHECKBOXV2",
      common: true,
    },
    {
      icon: <QRCode />,
      label: t("0-common.qrcode"),
      value: "QR",
      common: true,
    },
    { icon: <QrQrypto />, label: "QR Qrypto", value: "QRYPTO", common: true },
    {
      icon: <NumericStepper />,
      label: t("0-common.numeric_stepper"),
      value: "NUMERIC_STEPPER",
      common: true,
    },
    {
      icon: <Camera />,
      label: t("0-common.camera"),
      value: "CAMERA",
      common: true,
    },
    {
      icon: <Attachment />,
      label: t("0-common.attachment"),
      value: "ATTACHMENT",
      common: true,
    },
    {
      icon: <Location />,
      label: t("0-common.Location"),
      value: "LOCATION",
      common: false,
    },
    {
      icon: <TextField />,
      label: t("0-common.text field"),
      value: "TEXTFIELD",
      common: false,
    },
    {
      icon: <TextArea />,
      label: t("0-common.text area"),
      value: "TEXTAREA",
      common: false,
    },
    {
      icon: <HyperLink />,
      label: t("0-common.hyperlink"),
      value: "HYPERLINK",
      common: true,
    },
    {
      icon: <DocumentId />,
      label: t("0-common.documentId"),
      value: "DOCUMENTID",
      common: true,
    },
    {
      icon: <Date />,
      label: t("0-common.date"),
      value: "DATE",
      common: true,
    },
    {
      icon: <Toggle />,
      label: t("0-common.toggle"),
      value: "TOGGLE",
      common: true,
    },
    {
      icon: <Combobox />,
      label: t("0-common.combobox"),
      value: "COMBOBOX",
      common: true,
    },
  ];
  let menu = [];
  switch (signerType) {
    case 1:
      menu = data.filter((item) => item.common === false);
      break;
    case 2:
    case 3:
      menu = data.filter(
        (item) => item.common === false && item.value !== "SIGNATURE"
      );
      break;
    case 4:
      menu = data.filter((item) => item.value !== "SIGNATURE");
      break;
    case 5:
      menu = [];
      break;
  }
  // Arrangement Overview
  // console.log("tabBar", workflowProcessType === "individual");
  switch (tabBar) {
    case 0:
      menu = data.filter((item) => item.common === true);
      break;

    case 1:
      if (workflowProcessType === "individual") {
        menu = data.filter((item) => item.common === false);
      } else {
        menu = menu.filter(
          (item) => item.value !== "QRYPTO" && item.value !== "QR"
        );
        signerType ? null : (menu = []);
      }
      break;
    case 2:
    case 3:
    case 4:
      return;
  }
  // Check workflow process type by individual
  // console.log(
  //   workflowProcessType === "individual"
  //     ? "block"
  //     : signerType === 5
  //     ? "none"
  //     : "block"
  // );
  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 4,
          display: signerType === 5 ? "none" : "block",
        },
      }}
    >
      {menu.map((item, index) => (
        <MenuItem key={index} onClick={handleClickMenu(item.value)}>
          <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: "medium",
              color: "#1F2937",
            }}
          />
        </MenuItem>
      ))}
    </Menu>
  );
};
ContextMenu.propTypes = {
  contextMenu: PropTypes.shape({
    mouseY: PropTypes.number,
    mouseX: PropTypes.number,
  }),
  handleClose: PropTypes.func,
  handleClickMenu: PropTypes.func,
  signerType: PropTypes.number,
  tabBar: PropTypes.number,
  workflowProcessType: PropTypes.string,
};
export default ContextMenu;
