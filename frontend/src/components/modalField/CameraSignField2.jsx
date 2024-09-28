import { ReactComponent as Camera } from "@/assets/images/contextmenu/camera.svg";
import { ReactComponent as Retry } from "@/assets/images/svg/retry.svg";
import { ReactComponent as UploadIcon } from "@/assets/images/svg/upload.svg";
import { usePending } from "@/hook";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { removeBase64Prefix } from "@/utils/commonFunction";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import * as blazeface from "@tensorflow-models/blazeface";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Webcam from "react-webcam";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const CameraSignField2 = ({
  open,
  onClose,
  cameraData,
  workFlow,
  getFields,
}) => {
  const { t } = useTranslation();

  const [fileName, setFileName] = useState("");
  const [showTrash, setShowTrash] = useState(false);

  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();
  const isPending = usePending();

  const [shouldDetectFaces, setShouldDetectFaces] = useState(true);
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [cameraSetup, setCameraSetup] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [errorPG, setErrorPG] = useState(null);

  const setupCamera = () => {
    if (webcamRef.current) {
      navigator.mediaDevices
        .getUserMedia({
          video: { width: 460, height: 300 },
          audio: false,
        })
        .then((stream) => {
          webcamRef.current.srcObject = stream;
          setCameraSetup(true);
          setHasCamera(true);
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
          setErrorPG(t("electronic.camera not found"));
          setHasCamera(false);
        });
    }
  };
  const canvasRef = useRef(null);

  const prediction = useRef(null);
  const detectFaces = async () => {
    if (model && webcamRef.current) {
      prediction.current = await model.estimateFaces(
        webcamRef.current.video,
        false
      );

      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(webcamRef.current.video, 0, 0, 460, 300);

      prediction.current.forEach((pred) => {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "transparent";
        ctx.globalAlpha = 0.5;
        ctx.rect(
          pred.topLeft[0],
          pred.topLeft[1] - 20,
          pred.bottomRight[0] - pred.topLeft[0],
          pred.bottomRight[1] - pred.topLeft[1] + 20
        );
        ctx.stroke();
        ctx.fillStyle = "transparent";
        pred.landmarks.forEach((landmark) => {
          ctx.fillRect(landmark[0], landmark[1], 5, 5);
        });
        // checkFaceDirection(pred.landmarks);
      });
    }
  };

  useEffect(() => {
    if (webcamRef.current) {
      setupCamera();
      blazeface
        .load()
        .then((loadedModel) => {
          console.log(loadedModel);
          setModel(loadedModel);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          console.log("done");
        });
    }
    const temp = webcamRef.current;

    return () => {
      // Tắt camera khi component unmount
      if (temp && hasCamera) {
        const tracks = temp.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [webcamRef.current]);

  const [intervalId, setIntervalId] = useState(null);

  // useEffect(() => {
  //   if (shouldDetectFaces) {
  //     setIsFetching(true);
  //   }
  // }, [shouldDetectFaces]);

  useEffect(() => {
    if (model && cameraSetup && shouldDetectFaces && hasCamera) {
      const id = setInterval(detectFaces, 100);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [model, cameraSetup, shouldDetectFaces, hasCamera]);

  const captureFace = () => {
    if (shouldDetectFaces) {
      clearInterval(intervalId);
      setShouldDetectFaces(false);
      const canvas = document.createElement("canvas");
      canvas.width = canvasRef.current.width;
      canvas.height = canvasRef.current.height;
      const ctx = canvas.getContext("2d");

      // Vẽ toàn bộ khung hình từ webcam lên canvas
      ctx.drawImage(webcamRef.current.video, 0, 0, canvas.width, canvas.height);
      const temp = webcamRef.current;
      const tracks = temp.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setImage(canvas.toDataURL("image/png"));

      console.log("Captured image: ", canvas.toDataURL("image/png"));
    }
  };

  const handleRetry = () => {
    setShouldDetectFaces(true);
    setShowTrash(false);
    setImage(null);
    setFileName(null);
  };

  const handleUploadImage = (e) => {
    clearInterval(intervalId);
    setShouldDetectFaces(false);
    setShowTrash(true);
    console.log("e: ", e.target.files[0]);
    setFileName(e.target.files[0].name);
    // const file = e.target.files[0];

    // if (file && file.size > 4 * 1024) {
    //   alert("File size exceeds the limit (4KB). Please choose a smaller file.");
    //   return;
    // }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      console.log(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setShowTrash(false);
    setImage(null);
    setFileName(null);
  };

  const handleSubmitClick = () => {
    putSignature.mutate(
      {
        body: {
          field_name: cameraData.field_name,
          visible_enabled: true,
          value: removeBase64Prefix(image),
          type: cameraData.type,
        },
        field: "camera",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: async () => {
          await getFields();
          queryClient.invalidateQueries({ queryKey: ["getField"] });
          onClose();
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
          maxWidth: "500px", // Set your width here
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
          {t("modal.apply_camera")}
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
          <Box
            sx={{
              // bgcolor: "background.paper",
              width: "100%",
              position: "relative",
              // height: "300px",
            }}
          >
            <Stack direction="row" alignItems="center" gap={2} mb="10px">
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<UploadIcon />}
              >
                {t("modal.upload_file")}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </Button>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {fileName}
              </Typography>
              {showTrash && (
                <Typography
                  variant="h6"
                  sx={{ cursor: "pointer", color: "red" }}
                  onClick={handleRemoveFile}
                >
                  X
                </Typography>
              )}
            </Stack>
            <Typography variant="h6" mb="10px">
              {t("modal.or_use_camera")}
            </Typography>
            {errorPG ? (
              <Alert severity="warning">{errorPG}</Alert>
            ) : (
              <>
                <Box>
                  <Webcam
                    ref={webcamRef}
                    // mirrored={true}
                    autoPlay={true}
                    audio={false}
                    style={{ zIndex: -100 }}
                    videoConstraints={{
                      width: 460, //469
                      height: 300,
                    }}
                  />
                  <canvas
                    // className="step6"
                    style={{
                      zIndex: 2,
                    }}
                    width={460}
                    height={300}
                    ref={canvasRef}
                  />
                </Box>
                <Stack
                  direction="row"
                  justifyContent="center"
                  width={"100%"}
                  mt="3px"
                >
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "50%",
                      height: "62px",
                      width: "62px",
                      background: "#DBEAFE",
                      boxShadow: "none",
                      "&:hover": {
                        background: "#DBEAFE",
                        boxShadow: "none",
                      },
                      display: shouldDetectFaces ? "flex" : "none",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={captureFace}
                  >
                    <Camera width="20" height="20" />
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "50%",
                      height: "62px",
                      width: "62px",
                      background: "#DBEAFE",
                      boxShadow: "none",
                      "&:hover": {
                        background: "#DBEAFE",
                      },
                      color: "#3B82F6",
                      display: shouldDetectFaces ? "none" : "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={handleRetry}
                  >
                    <Retry width="20" height="20" />
                  </Button>
                </Stack>
              </>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={onClose}
        >
          {t("0-common.close")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || !image}
          //   startIcon={
          //     isPending ? <CircularProgress color="inherit" size="1em" /> : null
          //   }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CameraSignField2.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  cameraData: PropTypes.object,
  workFlow: PropTypes.object,
  allow: PropTypes.bool,
  getFields: PropTypes.func,
};

export default CameraSignField2;
