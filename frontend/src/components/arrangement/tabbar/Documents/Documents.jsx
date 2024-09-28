/* eslint-disable react/prop-types */
import imageNotFound from "@/assets/images/noSignature.png";
import { ReactComponent as DocumentsIcon } from "@/assets/images/svg/mdi_file-document-outline1.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DocumentsInfo } from "./DocumentsInfo";
import { DocumentsModal } from "./DocumentsModal";

// eslint-disable-next-line react/prop-types
export const Documents = ({ workFlow, attachment }) => {
  const { t } = useTranslation();
  //Begin: Open modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //End: Open modal
  return (
    <Box
      sx={{
        height: "100%",
        pointerEvents: workFlow.workflowStatus > 0 ? "none" : "auto",
      }}
    >
      <Stack
        sx={{ px: "20px", height: "50px" }}
        direction="row"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <DocumentsIcon />
          <Typography sx={{ fontWeight: "550" }} variant="h3">
            {t("batch.documents")}
          </Typography>

          <Avatar
            sx={{
              bgcolor: "signingtextBlue.main",
              width: 16,
              height: 16,
              fontSize: "10px",
              lineHeight: 2,
            }}
          >
            {/* {workFlow.length} */}
            {1}
          </Avatar>
        </Stack>
        {workFlow.length !== 0 && (
          <Stack direction="row" justifyContent={"center"}>
            <Tooltip
              title={t("arrangement.manage_documents")}
              arrow
              placement="top"
            >
              <IconButton
                onClick={handleOpen}
                sx={{
                  height: "34px",
                  margin: "auto 0",
                }}
              >
                <SettingIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>
      {workFlow.length === 0 ? (
        <Box>
          {/* <Box width={200} textAlign="center" mx="auto">
            <img
              width="100%"
              // style={{ width: "20px" }}
              src={imageNotFound}
              alt="loading"
            />
          </Box> */}

          <Typography textAlign="center" variant="h5" fontWeight="bold">
            {t("validation.signatureNotFound")}
          </Typography>
        </Box>
      ) : (
        <DocumentsInfo documentsList={workFlow} attachment={attachment} />
      )}

      <DocumentsModal
        workFlow={workFlow}
        open={open}
        handleClose={handleClose}
        title={t("arrangement.setting_documents")}
      />
    </Box>
  );
};
Documents.propTypes = {
  documentsList: PropTypes.array,
};
export default Documents;
