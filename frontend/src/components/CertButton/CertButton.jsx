import { ReactComponent as CardIcon } from "@/assets/images/svg/card.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { ModalCertInfor } from "@/components/modal1";
import { UseGetCertDetail } from "@/hook/use-apiService";
import { convertTime } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CertButton = ({ certdata }) => {
  const { t } = useTranslation();
  const getCertDetail = UseGetCertDetail();

  const [isShowCertInfor, setShowCertInfor] = useState([false]);

  const handleShowCertInfor = (index) => {
    const newValue = [...isShowCertInfor];
    newValue[index] = true;
    setShowCertInfor(newValue);
  };

  const handleCloseCertInfor = (index) => {
    const newValue = [...isShowCertInfor];
    newValue[index] = false;
    setShowCertInfor(newValue);
  };
  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
        <Tooltip title={t("signing.cert_tooltip")} followCursor>
          <Box height="60px" minWidth="60px" mx={2}>
            <SvgIcon
              component={
                certdata.assurance === "ESEAL" || certdata.assurance === "QSEAL"
                  ? SealIcon
                  : CardIcon
              }
              inheritViewBox
              sx={{
                width: "100%",
                height: "100%",
                color: "signingtextBlue.main",
                cursor: "pointer",
                // mx: 2,
              }}
              onClick={() => {
                getCertDetail.mutate(
                  {
                    cert: certdata.cert,
                  },
                  {
                    onSuccess: () => {
                      handleShowCertInfor(certdata.index);
                    },
                  }
                );
              }}
            />
          </Box>
        </Tooltip>

        <Box flexGrow={1} textAlign="left">
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ textTransform: "uppercase" }}
          >
            {certdata.subject}
          </Typography>
          <Typography variant="h6">
            {t("0-common.issuer")}: {certdata.issuer}
          </Typography>
          <Typography variant="h6">
            {t("0-common.valid")}:{" "}
            {convertTime(certdata.validFrom).split(" ")[0]} {t("0-common.to")}{" "}
            {convertTime(certdata.validTo).split(" ")[0]}
          </Typography>
        </Box>
      </Stack>
      {isShowCertInfor[certdata.index] && (
        <ModalCertInfor
          open={isShowCertInfor[certdata.index]}
          onClose={() => handleCloseCertInfor(certdata.index)}
          data={certdata}
          certData={getCertDetail.data}
          provider={certdata.provider}
        />
      )}
    </>
  );
};

CertButton.propTypes = {
  certdata: PropTypes.object,
};

export default CertButton;
