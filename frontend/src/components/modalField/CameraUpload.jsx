/* eslint-disable no-unused-vars */
import { ReactComponent as ImageIcon } from "@/assets/images/svg/imageFile.svg";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import Dropzone from "react-dropzone-uploader";
import { useTranslation } from "react-i18next";

// const Preview = ({ meta }) => {
//   console.log("meta: ", meta);
//   const { name, percent, status } = meta;
//   return (
//     <span
//       style={{
//         alignSelf: "flex-start",
//         margin: "10px 3%",
//         fontFamily: "Helvetica",
//       }}
//     >
//       {name}, {Math.round(percent)}%, {status}
//     </span>
//   );
// };

// Preview.propTypes = {
//   meta: PropTypes.any,
// };

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

export const CameraUpload = () => {
  const [files, setFiles] = useState([]);
  const { t } = useTranslation();

  const handleChangeStatus = ({ meta, file }, status, fileWithMeta) => {
    // console.log("fileWithMeta: ", fileWithMeta);
    setFiles(fileWithMeta);
    // console.log("meta: ", meta);
    // console.log(status, meta, file);
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
  };

  const handleSubmitClick = () => {
    files.forEach((f) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", f.meta.previewUrl, true);
      xhr.responseType = "blob";
      xhr.onload = function (event) {
        var blob = xhr.response;
        var reader = new FileReader();
        reader.onload = function (event) {
          var base64data = event.target.result;
          //   putSignature.mutate(
          //     {
          //       body: {
          //         field_name: cameraData.field_name,
          //         file_name: f.meta.name,
          //         value: removeBase64Prefix(base64data),
          //         visible_enabled: true,
          //         type: cameraData.type,
          //       },
          //       field: "attachment",
          //       documentId: workFlow.documentId,
          //     },
          //     {
          //       onSuccess: async () => {
          //         await getFields();
          //         queryClient.invalidateQueries({ queryKey: ["getField"] });
          //         // files.forEach((f) => f.remove());
          //       },
          //     }
          //   );
          // fillForm.mutate(
          //   {
          //     body: [
          //       {
          //         field_name: cameraData.field_name,
          //         file_name: f.meta.name,
          //         value: removeBase64Prefix(base64data),
          //       },
          //     ],
          //     type: "attachment",
          //     documentId: workFlow.documentId,
          //   },
          //   {
          //     onSuccess: () => {
          //       queryClient.invalidateQueries({ queryKey: ["getField"] });
          //       queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
          //       files.forEach((f) => f.remove());
          //       onClose();
          //     },
          //   }
          // );
        };
        reader.readAsDataURL(blob);
      };
      xhr.send();
    });
  };

  return (
    <Dropzone
      //   getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*,application/pdf"
      //   PreviewComponent={Preview}
      LayoutComponent={Layout}
      inputContent={(files, extra) => {
        // return extra.reject ? "Image, pdf files only" : "Drag Files";
        return (
          <Stack direction="column" justifyContent="center" alignItems="center">
            <ImageIcon />
            <Typography
              variant="h6"
              mt="20px"
              mb="5px"
              fontWeight="600"
              lineHeight="20px"
            >
              <span style={{ color: "#3B82F6" }}>Browse</span> your files here
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
      styles={{
        dropzone: { minHeight: 214, maxHeight: 250, overflow: "auto" },
      }}
      //   initialFiles={initFile ? [initFile] : []}
      // styles={{
      //   dropzoneReject: {
      //     borderColor: "f44336",
      //     backgroundSize: "150% 100%",
      //     backgroundImage:
      //       "repeating-linear-gradient(-45deg, #fff, #fff 25px, rgba(0, 0, 0, 0.12) 25px, rgba(0, 0, 0, 0.12) 50px)",
      //     animationName: "pulse",
      //     animationDuration: "2s",
      //     animationTimingFunction: "linear",
      //     animationIterationCount: "infinite",
      //   },
      //   // inputLabel: (files, extra) =>
      //   //   extra.reject ? { color: "black" } : {},
      // }}
    />
  );
};

CameraUpload.propTypes = {};

export default CameraUpload;
