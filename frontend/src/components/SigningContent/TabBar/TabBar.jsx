import { ReactComponent as OverviewIcon } from "@/assets/images/svg/overview.svg";
import { ReactComponent as ParticipantIcon } from "@/assets/images/svg/participant.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OverView } from "./OverView";
import { Participant } from "./Participant";
import { Signatures } from "./Signatures";
import { Seals } from "./Seals";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ flexGrow: 1, height: "100%" }}
      {...other}
    >
      {value === index && <Box height="100%">{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

// eslint-disable-next-line react/prop-types
export const TabBar = ({ workFlow, signedInfo, qrSigning, qryptoInfo }) => {
  // console.log("workFlow: ", workFlow);
  // console.log("signedInfo: ", signedInfo);
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  // const participantsList = workFlow.participants.filter(
  //   (item) => item.signerId !== ""
  // );

  //1: signature, 3: seal
  const sigList1 = signedInfo
    ?.map((sig) => {
      if (sig.ppl_file_attr_type_id === 1) {
        return { isSigned: true, ...sig.value };
      }
    })
    .filter((value) => value !== undefined);
  // console.log("sigList1: ", sigList1);

  const sigList2 = workFlow.participants
    .filter((sig) => sig.signedType === "NORMAL")
    .map((sig) => {
      return { isSigned: false, ...sig.certificate };
    });

  const eSealList1 = signedInfo
    ?.map((sig) => {
      if (sig.ppl_file_attr_type_id === 3) {
        return { isSigned: true, ...sig.value };
      }
    })
    .filter((value) => value !== undefined);

  const eSealList2 = workFlow.participants
    .filter((sig) => sig.signedType === "ESEAL")
    .map((sig) => {
      return { isSigned: false, ...sig.certificate };
    });

  // console.log("eSealList2: ", eSealList2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        flexDirection: "row-reverse",
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
        borderRadius: "5px",
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.20)",
      }}
    >
      <Tabs
        orientation="vertical"
        // variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        // textColor="primary"
        sx={{
          borderLeft: 1,
          borderColor: "divider",
          width: "120px",
          minWidth: "120px",

          "& .MuiButtonBase-root.Mui-selected": {
            backgroundColor: "tabBackground.main",
            borderRadius: "10px",
            color: "signingtext1.main",
          },
          ".MuiTab-root ": {
            textTransform: "none",
            wordWrap: "break-word",
          },
          // color: "red",
          p: 1,
          textTransform: "capitalize",
          fontSize: "12px",
        }}
        // TabIndicatorProps={{
        //   sx: {
        //     left: 0,
        //   },
        // }}
        TabIndicatorProps={{
          style: { display: "none" },
        }}
      >
        <Tab
          label={t("0-common.overview")}
          icon={
            <SvgIcon color="inherit">
              <OverviewIcon />
            </SvgIcon>
          }
          sx={{ fontSize: "12px" }}
          {...a11yProps(0)}
        />
        <Tab
          label={t("0-common.participants")}
          icon={
            <SvgIcon color="inherit">
              <ParticipantIcon />
            </SvgIcon>
          }
          sx={{ fontSize: "12px" }}
          {...a11yProps(1)}
        />
        <Tab
          label={t("0-common.signatures")}
          icon={
            <SvgIcon color="inherit">
              <SignatureIcon />
            </SvgIcon>
          }
          sx={{ fontSize: "12px" }}
          {...a11yProps(2)}
        />
        <Tab
          label={t("0-common.seals")}
          icon={
            <SvgIcon color="inherit">
              <SealIcon />
            </SvgIcon>
          }
          sx={{ fontSize: "12px" }}
          {...a11yProps(3)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <OverView
          workFlow={workFlow}
          qrSigning={qrSigning}
          qryptoInfo={qryptoInfo}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Participant workFlow={workFlow} signType="Signature" />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Signatures sigList1={sigList1} sigList2={sigList2} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Seals eSealList1={eSealList1} eSealList2={eSealList2} />
      </TabPanel>
    </Box>
  );
};
TabBar.propTypes = {
  workFlow: PropTypes.object,
  signedInfo: PropTypes.array,
};
export default TabBar;
