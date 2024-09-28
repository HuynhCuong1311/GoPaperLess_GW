/* eslint-disable no-unused-vars */
import { ReactComponent as ImageIcon } from "@/assets/images/svg/imageFile.svg";
import { usePending } from "@/hook";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { removeBase64Prefix } from "@/utils/commonFunction";
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
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import "@/assets/style/dragdropfile.css";
import { useTranslation } from "react-i18next";

const Layout = ({
  input,
  previews,
  submitButton,
  dropzoneProps,
  files,
  extra: { maxFiles },
}) => {
  return (
    <div>
      {previews}

      {files.length < maxFiles && <div {...dropzoneProps}>{input}</div>}

      {/* {files.length > 0 && submitButton} */}
    </div>
  );
};

Layout.propTypes = {
  input: PropTypes.any,
  previews: PropTypes.any,
  submitButton: PropTypes.any,
  dropzoneProps: PropTypes.any,
  files: PropTypes.any,
  extra: PropTypes.any,
};

export const AttachmentSign = ({
  open,
  onClose,
  cameraData,
  workFlow,
  initFile,
  getFields,
}) => {
  const putSignature = UseUpdateSig();
  const { t } = useTranslation();
  // const fillForm = UseFillForm();
  const queryClient = useQueryClient();
  const isPending = usePending();

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (files.length > 0) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [files]);

  // specify upload params and url for your files
  //   const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status, fileWithMeta) => {
    setFiles(fileWithMeta);

    // if (status === "done") {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     const base64data = reader.result;
    //     // Kiểm tra đầu ra của base64
    //     console.log(base64data);
    //     // base64data sẽ có dạng 'data:application/pdf;base64,...'
    //   };
    //   reader.readAsDataURL(file); // Đảm bảo bạn sử dụng readAsDataURL để nhận data URI
    // }
  };

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    files.forEach((f) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", f.meta.previewUrl, true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        var blob = xhr.response;
        var reader = new FileReader();
        reader.onload = function (event) {
          var base64data = event.target.result;
        };
        reader.readAsDataURL(blob);
      };
      xhr.send();
    });
    allFiles.forEach((f) => f.remove());
    onClose();
  };

  const handleSubmitClick = () => {
    files.forEach((f) => {
      console.log("f: ", f);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        // Kiểm tra đầu ra của base64
        // base64data sẽ có dạng 'data:application/pdf;base64,...'
        putSignature.mutate(
          {
            body: {
              field_name: cameraData.field_name,
              file_name: f.meta.name,
              value: removeBase64Prefix(base64data),
              visible_enabled: true,
              type: cameraData.type,
            },
            field: "attachment",
            documentId: workFlow.documentId,
          },
          {
            onSuccess: async () => {
              await getFields();
              queryClient.invalidateQueries({ queryKey: ["getField"] });
              // files.forEach((f) => f.remove());
              onClose();
            },
          }
        );
      };
      reader.readAsDataURL(f.file); // Đảm b
    });
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
          {/* {title} */}
          {t("0-common.attachment")}
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
            {/* {steps[activeStep]} */}
            {/* <Box flexGrow={1}>{steps[activeStep - 1]}</Box> */}
            <Dropzone
              //   getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              accept="image/*,application/pdf"
              LayoutComponent={Layout}
              inputContent={(files, extra) => {
                // return extra.reject ? "Image, pdf files only" : "Drag Files";
                return (
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ImageIcon />
                    <Typography
                      variant="h6"
                      mt="20px"
                      mb="5px"
                      fontWeight="600"
                      lineHeight="20px"
                    >
                      <span style={{ color: "#3B82F6" }}>Browse</span> your
                      files here
                    </Typography>
                    <Typography
                      variant="h4"
                      color="#9CA3AF"
                      fontWeight="500"
                      lineHeight="20px"
                    >
                      Maximum size: 50MB
                    </Typography>
                  </Stack>
                );
              }}
              multiple={false}
              maxFiles={1}
              initialFiles={initFile ? [initFile] : []}
              styles={{
                dropzone: {
                  minHeight: 214,
                  maxHeight: 250,
                  overflow: "auto",
                },
              }}
            />
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || isSubmitDisabled}
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AttachmentSign.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  cameraData: PropTypes.object,
  workFlow: PropTypes.object,
  attachData: PropTypes.object,
  initFile: PropTypes.object,
  getFields: PropTypes.func,
};

export default AttachmentSign;
