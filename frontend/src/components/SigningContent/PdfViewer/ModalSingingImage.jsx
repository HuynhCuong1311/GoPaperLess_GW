import CloseIcon from "@mui/icons-material/Close";
import DrawIcon from "@mui/icons-material/Draw";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import UploadIcon from "@mui/icons-material/Upload";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import PropTypes from "prop-types";
import {
  Button,
  ButtonGroup,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Checkbox from "@mui/material/Checkbox";
import Fade from "@mui/material/Fade";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import "cropperjs/dist/cropper.css";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import Cropper from "react-cropper";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";

export function ModalSingingImage({
  isShowModalSignImage,
  handleCloseModalSignImage,
}) {
  const sigTextRef = useRef(null);
  const sigCanvasRef = useRef(null);
  const sigImgCropRef = useRef(null);

  const imgCropSectionRef = useRef(null);
  const [currentTabSignImage, setCurrentTabSignImage] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const [currentImgCropping, setCurrentImgCropping] = useState(null);
  const [showModalEditImage, setShowModalEditImage] = useState(false);

  const CommonForm = () => (
    <>
      <div style={{ marginTop: "1rem" }}>
        <h2 style={{ fontWeight: "500" }}>Contact Information</h2>
        <TextField
          size="small"
          label="Email"
          fullWidth
          style={{ marginTop: "0.5rem", backgroundColor: "white" }}
          variant="outlined"
          {...register("email", { required: true })}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <h2 style={{ fontWeight: "500" }}>Include Text</h2>
        <FormGroup
          style={{
            marginTop: "0.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
        >
          <div>
            <FormControlLabel
              style={{ width: "100%" }}
              control={<Checkbox />}
              label="Name"
              {...register("includeName")}
            />
            <FormControlLabel
              style={{ width: "100%" }}
              control={<Checkbox />}
              label="Date"
              {...register("includeDate")}
            />
            <FormControlLabel
              style={{ width: "100%" }}
              control={<Checkbox />}
              label="Logo"
              {...register("includeLogo")}
            />
            <FormControlLabel
              style={{ width: "100%" }}
              control={<Checkbox />}
              label="Reason"
              {...register("includeReason")}
            />
          </div>
          <div>
            <FormControlLabel
              style={{ width: "100%" }}
              control={<Checkbox />}
              label="Distinguished Name"
              {...register("includeDistinguishedName")}
            />
            <FormControlLabel
              style={{ width: "100%" }}
              control={<Checkbox />}
              label="IText Version"
              {...register("includeITextVersion")}
            />
            <FormControlLabel
              style={{ width: "100%" }}
              control={<Checkbox />}
              label="Location"
              {...register("includeLocation")}
            />
            <FormControlLabel
              style={{ width: "100%" }}
              control={<Checkbox />}
              label="Labels"
              {...register("includeLabels")}
            />
          </div>
        </FormGroup>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
        }}
      >
        <div>
          <h2 style={{ fontWeight: "500" }}>Text Direction</h2>
          <ButtonGroup
            style={{
              display: "flex",
              width: "fit-content",
              alignItems: "center",
              borderRadius: "0.375rem",
              background: "white",
              color: "gray",
            }}
            aria-label="outlined primary button group"
          >
            <Button
              style={{
                borderRight: "1px solid #e2e8f0",
                padding: "0.5rem 1rem",
                backgroundColor:
                  watch("textDirection") === "auto" ? "#357EEB" : "white",
                color: watch("textDirection") === "auto" ? "white" : "black",
              }}
              {...register("textDirection")}
              value="auto"
              onClick={() => setValue("textDirection", "auto")}
            >
              Auto
            </Button>
            <Button
              style={{
                borderRight: "1px solid #e2e8f0",
                padding: "0.5rem 1rem",
                backgroundColor:
                  watch("textDirection") === "ltr" ? "#357EEB" : "white",
                color: watch("textDirection") === "ltr" ? "white" : "black",
              }}
              {...register("textDirection")}
              value="ltr"
              onClick={() => setValue("textDirection", "ltr")}
            >
              <FormatAlignLeftIcon />
            </Button>
            <Button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  watch("textDirection") === "rtl" ? "#357EEB" : "white",
                color: watch("textDirection") === "rtl" ? "white" : "black",
              }}
              {...register("textDirection")}
              value="rtl"
              onClick={() => setValue("textDirection", "rtl")}
            >
              <FormatAlignRightIcon />
            </Button>
          </ButtonGroup>
        </div>
        <div>
          <h2 style={{ fontWeight: "500" }}>Digits format</h2>
          <Select
            size="small"
            fullWidth
            style={{ backgroundColor: "white" }}
            {...register("digitsFormat")}
            defaultValue={"0123456789"}
          >
            <MenuItem key={"0123456789"} value={"0123456789"}>
              0123456789
            </MenuItem>
          </Select>
        </div>
      </div>
    </>
  );

  const getCropData = () => {
    if (typeof imgCropSectionRef.current?.cropper !== "undefined") {
      return imgCropSectionRef.current?.cropper.getCroppedCanvas().toDataURL();
    }
    return null;
  };

  const handleUploadImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      sigImgCropRef.current.style.backgroundImage = `url(${reader.result})`;
      setCurrentImgCropping(reader.result);
      setShowModalEditImage(true);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmitSigningImage = () => {
    switch (currentTabSignImage) {
      case 0:
        html2canvas(sigTextRef.current).then((canvas) => {
          const data = canvas.toDataURL();
        });
        break;
      case 1:
        const data = sigCanvasRef.current.getTrimmedCanvas().toDataURL();
        break;
      case 2:
        const backgroundImage = sigImgCropRef.current.style.backgroundImage;
        const image = backgroundImage
          .slice(4, backgroundImage.length - 1)
          .replace(/"/g, "");
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      className="custom-modal-no-padding"
      open={isShowModalSignImage}
      onClose={handleCloseModalSignImage}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={isShowModalSignImage}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "499px",
            transform: "translate(-50%, -50%)",
            overflow: "hidden",
            borderRadius: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#F3FBFF",
              padding: "8px 16px",
            }}
          >
            <TabContext value={0}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex" }}>
                  <TabList value={0}>
                    <Tab value={0} label={<b>SIGN DOCUMENT</b>}></Tab>
                  </TabList>
                </div>
                <CloseIcon onClick={handleCloseModalSignImage} />
              </div>
              <TabPanel value={0} sx={{ padding: "0px" }}>
                <TabContext value={currentTabSignImage}>
                  <TabList
                    value={currentTabSignImage}
                    onChange={(event, newValue) => {
                      setCurrentTabSignImage(newValue);
                    }}
                    variant="fullWidth"
                    sx={{
                      marginTop: "20px",
                    }}
                  >
                    <Tab
                      value={0}
                      label={
                        <span
                          style={{
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          <KeyboardIcon /> Text
                        </span>
                      }
                    ></Tab>
                    <Tab
                      value={1}
                      label={
                        <span
                          style={{
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          <DrawIcon /> Draw
                        </span>
                      }
                    ></Tab>
                    <Tab
                      value={2}
                      label={
                        <span
                          style={{
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          <UploadIcon /> Upload
                        </span>
                      }
                    ></Tab>
                  </TabList>
                  <TabPanel value={0} style={{ padding: "0px" }}>
                    <form onSubmit={handleSubmit((data) => console.log(data))}>
                      <TextField
                        size="small"
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        sx={{ backgroundColor: "white" }}
                        fullWidth
                        margin="normal"
                        {...register("text", { required: true })}
                        error={errors.text}
                        inputProps={{ maxLength: 32 }}
                      />
                      <div
                        style={{
                          overflow: "hidden",
                          borderRadius: "6px",
                          border: "1px solid #357EEB",
                          backgroundColor: "white",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            padding: "2rem 0",
                          }}
                          ref={sigTextRef}
                        >
                          <div
                            style={{
                              marginLeft: "auto",
                              marginRight: "auto",
                              height: "40px",
                              fontSize: "2rem",
                            }}
                            className="font-moon-dance"
                          >
                            {watch("text") || ""}
                          </div>
                        </div>
                        <div
                          style={{
                            borderTop: "2px dashed #357EEB",
                            paddingTop: "2rem",
                          }}
                        ></div>
                      </div>
                      <CommonForm />
                    </form>
                  </TabPanel>
                  <TabPanel value={1} style={{ padding: "0px" }}>
                    <Button
                      variant="outlined"
                      style={{
                        marginBottom: "0.5rem",
                        marginTop: "1rem",
                        fontWeight: "medium",
                      }}
                      onClick={() => sigCanvasRef.current.clear()}
                    >
                      Clear
                    </Button>
                    <div
                      style={{
                        overflow: "hidden",
                        borderRadius: "6px",
                        border: "1px solid #357EEB",
                        backgroundColor: "white",
                        paddingBottom: "2rem",
                      }}
                    >
                      <SignatureCanvas
                        canvasProps={{
                          height: 96,
                          style: {
                            backgroundColor: "white",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "100%",
                            borderBottom: "2px dashed #357EEB",
                          },
                        }}
                        ref={sigCanvasRef}
                      />
                    </div>
                    <CommonForm />
                  </TabPanel>
                  <TabPanel value={2} style={{ padding: "0px" }}>
                    <div>
                      <Button
                        variant="outlined"
                        component="label"
                        style={{
                          marginBottom: "0.5rem",
                          marginTop: "1rem",
                          fontWeight: "medium",
                        }}
                      >
                        Upload File
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleUploadImage}
                        />
                      </Button>
                      <div
                        style={{
                          overflow: "hidden",
                          borderRadius: "6px",
                          border: "1px solid #357EEB",
                          backgroundColor: "white",
                          paddingBottom: "2rem",
                        }}
                      >
                        <div
                          ref={sigImgCropRef}
                          style={{
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            display: "flex",
                            height: "96px",
                            width: "100%",
                            alignItems: "center",
                            borderBottom: "2px dashed #357EEB",
                          }}
                        ></div>
                      </div>
                      <CommonForm />
                      <Modal
                        open={showModalEditImage}
                        onClose={() => setShowModalEditImage(false)}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                          backdrop: {
                            timeout: 500,
                          },
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            zIndex: 10,
                            width: "499px",
                            transform: "translate(-50%, -50%)",
                            overflow: "hidden",
                            borderRadius: "1rem", // Adjust the value according to your design
                            backgroundColor: "white",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "#F3FBFF",
                              padding: "8px 16px",
                            }}
                          >
                            <TabContext value={0}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <TabList value={0}>
                                    <Tab
                                      value={0}
                                      label={<b>Crop Image</b>}
                                    ></Tab>
                                  </TabList>
                                </div>
                                <CloseIcon
                                  onClick={() => setShowModalEditImage(false)}
                                />
                              </div>
                              <TabPanel
                                value={0}
                                sx={{ marginTop: "1.25rem", padding: "0px" }}
                              >
                                <div style={{ width: "100%" }}>
                                  <Cropper
                                    src={currentImgCropping}
                                    aspectRatio={413 / 136}
                                    guides={false}
                                    ref={imgCropSectionRef}
                                  />
                                </div>
                              </TabPanel>
                            </TabContext>
                          </div>
                          <footer
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "8px",
                              backgroundColor: "white",
                              padding: "16px",
                            }}
                          >
                            <Button
                              variant="contained"
                              style={{
                                borderRadius: "2rem",
                                backgroundColor: "white",
                                fontWeight: "500",
                                color: "black",
                              }}
                              onClick={() => setShowModalEditImage(false)}
                            >
                              Keep Original
                            </Button>
                            <Button
                              variant="contained"
                              style={{
                                borderRadius: "2rem",
                                backgroundColor: "#3B82F6",
                                fontWeight: "500",
                                color: "white",
                              }}
                              onClick={() => {
                                sigImgCropRef.current.style.backgroundImage = `url(${getCropData()})`;
                                setShowModalEditImage(false);
                              }}
                            >
                              Apply
                            </Button>
                          </footer>
                        </div>
                      </Modal>
                    </div>
                  </TabPanel>
                </TabContext>
              </TabPanel>
            </TabContext>
          </div>
          <footer
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              backgroundColor: "white",
              padding: "16px",
            }}
          >
            <Button
              variant="contained"
              style={{
                borderRadius: "2rem",
                backgroundColor: "white",
                fontWeight: "500",
                color: "black",
              }}
              onClick={handleCloseModalSignImage}
            >
              Close
            </Button>
            <Button
              variant="contained"
              style={{
                borderRadius: "2rem",
                backgroundColor: "#3B82F6",
                fontWeight: "500",
                color: "white",
              }}
              onClick={handleSubmitSigningImage}
            >
              Continue
            </Button>
          </footer>
        </div>
      </Fade>
    </Modal>
  );
}

ModalSingingImage.propTypes = {
  isShowModalSignImage: PropTypes.bool,
  handleCloseModalSignImage: PropTypes.func,
};

export default ModalSingingImage;
