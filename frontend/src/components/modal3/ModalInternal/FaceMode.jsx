import { useFaceAndSignScal, usePending } from "@/hook";
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
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaceStep1, FaceStep2 } from ".";
import { getLang } from "@/utils/commonFunction";

export const FaceMode = ({ open, onClose, dataSigning }) => {
  // console.log("dataSigning: ", dataSigning);
  const { t } = useTranslation();
  let lang = getLang();

  const isPending = usePending();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  //   const [skipped, setSkipped] = useState(new Set());
  const [isFetching, setIsFetching] = useState(false);
  const [errorPG, setErrorPG] = useState(null);
  // console.log("errorPG: ", errorPG);
  //   const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [imageFace, setImageFace] = useState(null);
  const [shouldDetectFaces, setShouldDetectFaces] = useState(true);
  const [direction, setDirection] = useState(null);

  const faceAndSignScal = useFaceAndSignScal();
  // console.log("faceAndSignScal2: ", faceAndSignScal2);

  const imageFaceRef = useRef(null);

  useEffect(() => {
    if (imageFace != null) {
      //   faceAndCreate();
      if (imageFaceRef.current) clearTimeout(imageFaceRef.current);
      imageFaceRef.current = setTimeout(() => {
        faceAndSignScal.mutate(
          {
            ...dataSigning,
            lang: lang,
            type: dataSigning.criteriaAlias,
            certChain: dataSigning.certChain.cert,
            credentialID: dataSigning.certChain.credentialID,
            imageFace: imageFace,
          },
          {
            onError: (error) => {
              console.log("error: ", error);
              setIsFetching(false);
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
      }, 1000);
    }
  }, [imageFace]);

  //   const isStepSkipped = (step) => {
  //     return skipped.has(step);
  //   };

  //   const handleNext = (step = 1) => {
  //     let newSkipped = skipped;
  //     if (isStepSkipped(activeStep)) {
  //       newSkipped = new Set(newSkipped.values());
  //       newSkipped.delete(activeStep);
  //     }

  //     setActiveStep((prevActiveStep) => prevActiveStep + step);
  //     setSkipped(newSkipped);
  //   };

  //   const handleDisableSubmit = (disabled) => {
  //     setIsSubmitDisabled(disabled);
  //   };

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        setActiveStep(2);
        break;
      case 2:
        setShouldDetectFaces(true);
        setErrorPG(null);
        break;
    }
  };

  const steps = [
    <FaceStep1 key="step1" />,
    <FaceStep2
      key="step2"
      setImageFace={setImageFace}
      shouldDetectFaces={shouldDetectFaces}
      setShouldDetectFaces={setShouldDetectFaces}
      setIsFetching={setIsFetching}
      setErrorPG={setErrorPG}
      direction={direction}
      setDirection={setDirection}
    />,
  ];
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
            <Box flexGrow={1}>{steps[activeStep - 1]}</Box>
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
          disabled={isFetching || isPending}
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
          {errorPG
            ? t("0-common.retry")
            : activeStep === 2
            ? t("0-common.submit")
            : t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FaceMode.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
};

export default FaceMode;
