/* eslint-disable react/prop-types */
import { ReactComponent as DocumentIcon } from "@/assets/images/svg/mdi_file-document-outline.svg";
import { ReactComponent as OverviewIcon } from "@/assets/images/svg/overview.svg";
import { ReactComponent as ParticipantIcon } from "@/assets/images/svg/participant.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Seals } from "../SigningContent/TabBar/Seals";
import { Signatures } from "../SigningContent/TabBar/Signatures";
import { Documents } from "./tabbar/Documents/Documents";
import OverView from "./tabbar/Overview";
import { Participants } from "./tabbar/participants/Participants";

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
export const TabBar = ({
  workFlow,
  signedInfo,
  qrSigning,
  tabBar,
  setTabBar,
  // attachment,
}) => {
  // End: Change params for participants
  const { t } = useTranslation();

  // console.log("workFlow: ", workFlow);
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
  const handleChange = (event, newValue) => {
    setTabBar(newValue);
    if (workFlow.workflowStatus < 1) {
      if (newValue !== 1) {
        workFlow.setSignerToken("");
      } else {
        workFlow.workflowProcessType !== "individual" &&
          workFlow.setSignerToken(workFlow.participants[0].signerToken);
      }
    }
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
        value={tabBar}
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
        <Tab
          label={t("batch.documents")}
          icon={
            <SvgIcon color="inherit">
              <DocumentIcon />
            </SvgIcon>
          }
          sx={{ fontSize: "12px" }}
          {...a11yProps(4)}
        />
      </Tabs>
      <TabPanel value={tabBar} index={0}>
        <OverView workFlow={workFlow} qrSigning={qrSigning} />
      </TabPanel>
      <TabPanel value={tabBar} index={1}>
        <Participants
          workFlow={workFlow}
          participantsList={workFlow.participants}
        />
      </TabPanel>
      <TabPanel value={tabBar} index={2}>
        <Signatures sigList1={sigList1} sigList2={sigList2} />
      </TabPanel>

      <TabPanel value={tabBar} index={3}>
        <Seals eSealList1={eSealList1} eSealList2={eSealList2} />
      </TabPanel>
      <TabPanel value={tabBar} index={4}>
        <Documents workFlow={workFlow} />
      </TabPanel>
    </Box>
  );
};
TabBar.propTypes = {
  workFlow: PropTypes.object,
  signedInfo: PropTypes.array,
};
export default TabBar;
