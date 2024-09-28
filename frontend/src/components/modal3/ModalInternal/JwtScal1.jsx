import facescan from "@/assets/images/facescal1.png";
import { useFaceAndSignScal, usePending } from "@/hook";
import {
  convertProviderToSignOption,
  convertTypeEid,
  getLang,
} from "@/utils/commonFunction";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const JwtScal1 = ({ open, onClose, dataSigning }) => {
  // console.log("dataSigning: ", dataSigning);
  const { t } = useTranslation();
  let lang = getLang();

  const faceAndSignScal = useFaceAndSignScal();

  const isPending = usePending();
  const queryClient = useQueryClient();

  const [errorPG, setErrorPG] = useState(null);

  const handleSubmitClick = () => {
    faceAndSignScal.mutate(
      {
        fieldName: dataSigning.signatureData.field_name,
        signerToken: dataSigning.workFlow.signerToken,
        signingOption: convertProviderToSignOption(dataSigning.provider),
        signingToken: dataSigning.workFlow.signingToken,
        codeNumber: dataSigning.criteria + ":" + dataSigning.code,
        credentialID: dataSigning.certSelected.credentialID,
        lang: lang,
        type: convertTypeEid(dataSigning.criteria),
        certChain: dataSigning.certSelected.cert,
        country: dataSigning.locationValue,
        imageBase64: dataSigning.signatureImage,
        contactInfor: dataSigning.contactInfor,
        assurance: dataSigning.assurance,
        textField: dataSigning.textField,
        jwt: dataSigning.jwt,
      },
      {
        onError: (error) => {
          console.log("error: ", error);
          setErrorPG(error.response.data.message);
        },
        onSuccess: (data) => {
          window.parent.postMessage(
            { data: data.data, status: "Success" },
            "*"
          );
          queryClient.invalidateQueries({ queryKey: ["getField"] });
          // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
          queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
          onClose();
          return data;
        },
      }
    );
  };

  return (
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
      open={!!open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        sx: {
          width: "500px",
          maxWidth: "500px",
          height: "700px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{
          backgroundColor: "dialogBackground.main",
          p: "10px 20px",
          height: "51px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            display: "inline-block",
            color: "signingtextBlue.main",
            borderBottom: "4px solid",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
          }}
        >
          {t("signing.sign_document")}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "dialogBackground.main",
          height: "100%",
          // py: "10px",
          borderBottom: "1px solid",
          borderColor: "borderColor.main",
          p: "0 20px 10px",
        }}
      >
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
          // className="choyoyoy"
        >
          <Stack sx={{ mt: 0, mb: 1, height: "100%" }}>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "textBold.main", height: "17px" }}
                // textAlign={"center"}
              >
                {/* Scan Face */}
                {t("electronic.stepFace1")}
              </Typography>
              <Typography
                variant="h6"
                marginBottom="15px"
                // textAlign="center"
                color="textBold.main"
                mt="10px"
              >
                {/* Please, look to the camera to scan your face */}
                {t("electronic.stepFace2")}
              </Typography>
              <Box width={263} marginX="auto" my="10px" p="64px 0">
                <img
                  src={facescan}
                  width="100%"
                  //   height={250}
                  alt="chip"
                />
              </Box>
            </Box>
            {errorPG && <Alert severity="error">{errorPG}</Alert>}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{ p: "15px 20px", height: "70px", backgroundColor: "#F9FAFB" }}
      >
        <Button
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            fontWeight: 600,
            backgroundColor: "white",
          }}
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending}
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
            fontWeight: 600,
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {errorPG ? t("0-common.retry") : t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

JwtScal1.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
};

export default JwtScal1;
