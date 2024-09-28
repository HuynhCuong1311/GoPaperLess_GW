import { ReactComponent as SaveAltIcon } from "@/assets/images/svg/save1.svg";
import { MyProfile } from "@/components/configuration";
import SignaturesList from "@/components/configuration/signatures/SignaturesList";
import { UseGetBindData, UseSaveConfig } from "@/hook";
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const Configuration = () => {
  const { t } = useTranslation();
  const { bind_token } = useParams();
  // console.log("bind_token: ", bind_token);

  const bindData = UseGetBindData(bind_token);
  // console.log("bindData: ", bindData);
  const saveConfig = UseSaveConfig();
  const queryClient = useQueryClient();

  const [signatureList, setSignatureList] = useState([]);
  console.log("signatureList: ", signatureList);

  const handleSave = () => {
    console.log("save");
    saveConfig.mutate(
      {
        bindToken: bind_token,
        postbackUrl: bindData.data.postback_url,
        signatureList: signatureList,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getBindData"] });
        },
        onError: () => {
          console.log("error");
        },
      }
    );
  };

  return (
    <Container sx={{ maxWidth: "1440px", height: "100%", overflow: "auto" }}>
      <AppBar
        position="static"
        sx={{
          height: (theme) => theme.GoPaperless.appBarConfigHeight,
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            backgroundColor: "signingWFBackground.main",
            gap: 2,
            height: (theme) => theme.GoPaperless.appBarConfigHeight,
            padding: "16px 45px !important",
            justifyContent: "flex-end",
          }}
        >
          <Chip
            label={t("0-common.save")}
            // color={checkWorkFlowStatus ? "primary" : "secondary"}
            color="primary"
            // disabled={!checkWorkFlowStatus}
            sx={{
              padding: "8px 16px",
              height: "40px",
              fontWeight: "500",
              borderRadius: "25px",
              backgroundColor: "#3B82F6",
              // backgroundColor: checkWorkFlowStatus ? "#3B82F6" : "#9b9895",
              cursor: "pointer",
              color: "white",
              gap: "10px",
              "& span": {
                padding: "0",
              },
              "& svg.MuiChip-icon": {
                margin: "0",
              },
              "& .MuiChip-label": {
                display: { xs: "none", md: "flex" },
              },
            }}
            icon={<SaveAltIcon fontSize="small" color="borderColor.light" />}
            // clickable
            onClick={handleSave}
          />
        </Toolbar>
      </AppBar>
      <MyProfile data={bindData.data?.profile_props} />
      <SignaturesList
        initData={bindData.data?.signed_props}
        setSignatureList={setSignatureList}
      />
    </Container>
  );
};

Configuration.propTypes = {};

export default Configuration;
