import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Webcam from "react-webcam";

export const Step6 = ({
  setImageFace,
  shouldDetectFaces,
  setShouldDetectFaces,
  setIsFetching,
  setErrorPG,
  direction,
  setDirection,
}) => {
  const { t } = useTranslation();

  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  // const [direction, setDirection] = useState(null);
  const [cameraSetup, setCameraSetup] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  const setupCamera = () => {
    if (webcamRef.current) {
      navigator.mediaDevices
        .getUserMedia({
          video: { width: 440, height: 300 },
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
      const MAX_FACE_WIDTH = 150;
      const MAX_FACE_HEIGHT = 110;

      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(webcamRef.current.video, 0, 0, 440, 300);

      if (prediction.current.length > 1) {
        setDirection(t("electronic.cam oneface"));
      } else {
        setDirection(null);
        const pred = prediction.current[0];
        const faceWidth = pred.bottomRight[0] - pred.topLeft[0];
        const faceHeight = pred.bottomRight[1] - pred.topLeft[1];
        if (faceWidth < MAX_FACE_WIDTH || faceHeight < MAX_FACE_HEIGHT) {
          setDirection(t("electronic.cam closer"));
        } else {
          setDirection(null);
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
            checkFaceDirection(pred.landmarks);
          });
        }
      }
    }
  };

  const isWaitingForCaptureRef = useRef(false);

  const checkFaceDirection = (landmarks) => {
    const eyeLeft = landmarks[0];
    const eyeRight = landmarks[2];

    const dx = eyeRight[0] - eyeLeft[0];
    const dy = eyeRight[1] - eyeLeft[1];

    const angle = Math.atan2(dy, dx);
    const degree = angle * (180 / Math.PI);

    //Kiểm tra hướng khuôn mặt
    if (degree < 30) {
      setDirection(t("electronic.cam lookstraight"));
    } else if (degree > 40) {
      setDirection(t("electronic.cam lookstraight"));
    } else if (degree >= 30 && degree <= 40) {
      setDirection(t("electronic.cam holdsteady"));
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(webcamRef.current.video, 0, 0, 440, 300);

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
      });
      isWaitingForCaptureRef.current = true;
      setTimeout(() => {
        if (isWaitingForCaptureRef.current) {
          clearInterval(intervalId); // Dừng interval sau khi chụp hình
          isWaitingForCaptureRef.current = false;
          captureFace(prediction.current);
          setShouldDetectFaces(false);
        }
      }, 1000); // Chờ 3 giây trước khi chụp hình
    } else {
      // console.log("degree: ", degree);
      isWaitingForCaptureRef.current = false;
    }
  };

  useEffect(() => {
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

    const temp = webcamRef.current;

    return () => {
      // Tắt camera khi component unmount
      if (temp && hasCamera) {
        const tracks = temp.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (shouldDetectFaces) {
      setIsFetching(true);
    }
  }, [shouldDetectFaces]);

  useEffect(() => {
    if (model && cameraSetup && shouldDetectFaces && hasCamera) {
      const id = setInterval(detectFaces, 100);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [model, cameraSetup, shouldDetectFaces, hasCamera]);

  const captureFace = (prediction) => {
    if (shouldDetectFaces) {
      const canvas = document.createElement("canvas");
      canvas.width = canvasRef.current.width;
      canvas.height = canvasRef.current.height;
      const ctx = canvas.getContext("2d");

      prediction.forEach((pred) => {
        const width = pred.bottomRight[0] - pred.topLeft[0];
        const height = pred.bottomRight[1] - pred.topLeft[1] + 20;

        ctx.drawImage(
          canvasRef.current,
          pred.topLeft[0],
          pred.topLeft[1] - 20,
          width,
          height,
          0,
          0,
          width,
          height
        );
      });
      const temp = webcamRef.current;
      const tracks = temp.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setImageFace(canvas.toDataURL("image/png"));

      console.log("Captured image:");
    }
  };
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main" }}
        textAlign={"center"}
      >
        {t("electronic.step61")}
      </Typography>

      <Typography
        variant="h6"
        marginBottom="10px"
        marginTop="10px"
        textAlign={"center"}
        color="textBold.main"
      >
        {t("electronic.step62")}
      </Typography>
      {direction && (
        <Typography
          className="video-direction"
          fontSize="14px"
          bgcolor="#0b95e5"
          textAlign="center"
          color="white"
        >
          {direction}
        </Typography>
      )}

      <Box>
        <Webcam
          ref={webcamRef}
          // mirrored={true}
          autoPlay={true}
          audio={false}
          style={{ zIndex: -100 }}
          videoConstraints={{
            width: 440, //469
            height: 300,
          }}
        />
        <canvas className="step6" width={440} height={300} ref={canvasRef} />
      </Box>
    </Box>
  );
};

Step6.propTypes = {
  setImageFace: PropTypes.func,
  shouldDetectFaces: PropTypes.bool,
  setShouldDetectFaces: PropTypes.func,
  setIsFetching: PropTypes.func,
  setErrorPG: PropTypes.func,
  direction: PropTypes.string,
  setDirection: PropTypes.func,
};

export default Step6;
