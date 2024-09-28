import imageNotFound from "@/assets/images/noSignature.png";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { ReactComponent as ValidSealIcon } from "@/assets/images/svg/seal_icon.svg";
import { ReactComponent as ValidSealWFIcon } from "@/assets/images/svg/sealwf.svg";
import { ReactComponent as WarningIcon } from "@/assets/images/svg/warningError.svg";
import { ReactComponent as InValidIcon } from "@/assets/images/svg/error.svg";
import { ReactComponent as WarningWFIcon } from "@/assets/images/svg/warningErrorwf.svg";
import { ReactComponent as InValidWFIcon } from "@/assets/images/svg/errorwf.svg";
import { Divider, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SignaturesInfo } from "../Signatures/SignaturesInfo";

export const Seals = ({ eSealList1, eSealList2 }) => {
  const signedInfo = [...eSealList1, ...eSealList2];
  // const signedInfo = [...eSealList1];
  // console.log("Seals: ", signedInfo);
  const { t } = useTranslation();

  const signType = "eseal";

  const valueSign = [
    {
      name: t("validation.sealValidTitle"),
      value: signedInfo?.filter((sig) => {
        return sig.indication === "TOTAL_PASSED" && sig.is_valid === true;
      }),
      icon: {
        signed: (
          <SvgIcon viewBox={"0 0 40 40"}>
            <ValidSealIcon height={40} width={40} />
          </SvgIcon>
        ),
        notSigned: (
          <SvgIcon viewBox={"0 0 35 35"}>
            <ValidSealWFIcon height={35} width={35} />
          </SvgIcon>
        ),
      },
      title: t("validation.sealValidTitle2"),
    },
    {
      name: t("validation.indeterminateTitle"),
      value: signedInfo?.filter((sig) => {
        return sig.indication === "INDETERMINATE";
      }),
      icon: {
        signed: (
          <SvgIcon viewBox={"0 0 35 35"}>
            <WarningIcon height={35} width={35} />
          </SvgIcon>
        ),
        notSigned: (
          <SvgIcon viewBox={"0 0 40 40"}>
            <WarningWFIcon height={40} width={40} />
          </SvgIcon>
        ),
      },
      title: t("validation.indeterminateSeal"),
    },
    {
      name: t("validation.invalidSeal"),
      value: signedInfo?.filter((sig) => {
        // console.log("invalid: ", sig.signature.is_valid);

        return (
          sig.indication !== "INDETERMINATE" &&
          sig.indication !== "TOTAL_PASSED"
        );
      }),
      icon: {
        signed: (
          <SvgIcon viewBox={"0 0 40 40"}>
            <InValidIcon height={40} width={40} />
          </SvgIcon>
        ),
        notSigned: (
          <SvgIcon viewBox={"0 0 35 35"}>
            <InValidWFIcon height={35} width={35} />
          </SvgIcon>
        ),
      },
      title: t("validation.invalidSeal"),
    },
  ];

  const newSign = valueSign.filter((sig) => sig.value.length > 0);
  console.log("newSign: ", newSign);

  return (
    <Box sx={{ height: "100%" }}>
      <Stack direction="row" sx={{ px: "20px", height: "50px" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SealIcon />
          <Typography variant="h3" sx={{ fontWeight: "550" }}>
            {t("0-common.seals")}
          </Typography>
          <Avatar
            sx={{
              bgcolor: "signingtextBlue.main",
              width: 16,
              height: 16,
              fontSize: "10px",
            }}
          >
            {signedInfo.length}
          </Avatar>
        </Stack>
      </Stack>

      <Divider sx={{ color: "borderColor.main" }} />
      {newSign.length === 0 ? (
        <Box width="100%">
          <Box width={200} textAlign="center" mx="auto">
            <img
              width="100%"
              // style={{ width: "20px" }}
              src={imageNotFound}
              alt="loading"
            />
          </Box>
          {/* <Box
            component="img"
            sx={{
              width: "200px",
            }}
            alt="The house from the offer."
            src={imageNotFound}
          /> */}
          <Typography textAlign="center" variant="h5" fontWeight="bold">
            {t("validation.sealNotFound")}
          </Typography>
        </Box>
      ) : (
        newSign.map((val, i) => (
          <SignaturesInfo sign={val} signType={signType} key={i} />
        ))
      )}
    </Box>
  );
};

Seals.propTypes = {
  eSealList1: PropTypes.array,
  eSealList2: PropTypes.array,
};

export default Seals;
