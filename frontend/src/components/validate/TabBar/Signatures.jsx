import imageNotFound from "@/assets/images/noSignature.png";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { ReactComponent as InValidIcon } from "@/assets/images/svg/error.svg";
import { ReactComponent as WarningWFIcon } from "@/assets/images/svg/warningError.svg";
import { Box, Divider, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SignDetail } from ".";
import Avatar from "@mui/material/Avatar";
import SvgIcon from "@mui/material/SvgIcon";
export const Signatures = ({ validFile, signType, signIcon }) => {
  // console.log("validFile: ", validFile);
  const { t } = useTranslation();

  const valueSign = [
    {
      name:
        signType == "Signature"
          ? t("validation.sigValidTitle")
          : t("validation.sealValidTitle"),
      value: validFile.filter((sig) => sig.indication === "TOTAL_PASSED"),
      icon: signIcon,
      title:
        signType == "Signature"
          ? t("signing.signature_valid")
          : t("validation.sealValidTitle2"),
    },
    {
      name: t("validation.indeterminateTitle"),
      value: validFile.filter((sig) => sig.indication === "INDETERMINATE"),
      icon: (
        <SvgIcon viewBox={"0 0 40 40"}>
          <WarningWFIcon height={35} width={35} />
        </SvgIcon>
      ),

      title:
        signType == "Signature"
          ? t("signing.indeterminate signatures")
          : t("validation.indeterminateSeal"),
    },
    {
      name:
        signType == "Signature"
          ? t("validation.invalidSig")
          : t("validation.invalidSeal"),
      value: validFile.filter((sig) => sig.indication === "TOTAL_FAILED"),
      icon: (
        <SvgIcon viewBox={"0 0 35 35"}>
          <InValidIcon height={40} width={40} color="#EB6A00" />
        </SvgIcon>
      ),

      title:
        signType == "Signature"
          ? t("signing.invalid signatures")
          : t("validation.invalidSeal"),
    },
  ];
  const newSign = valueSign.filter((sig) => sig.value.length > 0);
  // console.log("newSign: ", newSign);

  return (
    <>
      <Stack direction="row" sx={{ px: "20px", height: "50px" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {signType == "Signature" ? <SignatureIcon /> : <SealIcon />}
          <Typography variant="h3" sx={{ fontWeight: "550" }}>
            {signType == "Signature"
              ? t("0-common.signatures")
              : t("0-common.seals")}
          </Typography>
          <Avatar
            sx={{
              bgcolor: "signingtextBlue.main",
              width: 16,
              height: 16,
              fontSize: "10px",
            }}
          >
            {validFile.length}
          </Avatar>
        </Stack>
      </Stack>
      {/* <Box p={3} fontWeight={550}>
        {signType === "Signature" ? t("validation.tab2") : t("validation.tab3")}
      </Box> */}
      <Divider />
      {newSign.length === 0 ? (
        <Box>
          <Box width={200} textAlign="center" mx="auto">
            <img
              width="100%"
              // style={{ width: "20px" }}
              src={imageNotFound}
              alt="loading"
            />
          </Box>
          <Typography textAlign="center" variant="h5" fontWeight="bold">
            {t("validation.signatureNotFound")}
          </Typography>
        </Box>
      ) : (
        newSign.map((val, i) => (
          <SignDetail sign={val} signType={signType} key={i} />
        ))
      )}
    </>
  );
};
Signatures.propTypes = {
  validFile: PropTypes.array,
  signType: PropTypes.string,
  signIcon: PropTypes.node,
};
export default Signatures;
