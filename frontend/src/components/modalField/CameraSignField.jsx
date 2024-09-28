import { ReactComponent as Camera } from "@/assets/images/contextmenu/camera.svg";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { removeBase64Prefix } from "@/utils/commonFunction";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";

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

export const CameraSignField = ({ cameraData, workFlow, allow, getFields }) => {
  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();
  // const fillForm = UseFillForm();

  // useEffect(() => {
  //   if (defaultValues.fileUrl) {
  //     fillForm.mutate(
  //       {
  //         body: [
  //           {
  //             field_name: cameraData.field_name,
  //             value: removeBase64Prefix(defaultValues.fileUrl),
  //           },
  //         ],
  //         type: "camera",
  //         documentId: workFlow.documentId,
  //       },
  //       {
  //         onSuccess: async () => {
  //           queryClient.invalidateQueries({ queryKey: ["getField"] });
  //           queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
  //         },
  //       }
  //     );
  //   }
  // }, [defaultValues.fileUrl]);

  const handleUploadImage = (e) => {
    // const file = e.target.files[0];

    // if (file && file.size > 4 * 1024) {
    //   alert("File size exceeds the limit (4KB). Please choose a smaller file.");
    //   return;
    // }

    const file = e.target.files[0]; // Lấy tệp tin từ sự kiện change
    if (file) {
      // Kiểm tra xem tệp tin có tồn tại không
      const reader = new FileReader();
      reader.onload = () => {
        putSignature.mutate(
          {
            body: {
              field_name: cameraData.field_name,
              visible_enabled: true,
              value: removeBase64Prefix(reader.result),
              type: cameraData.type,
            },
            field: "camera",
            documentId: workFlow.documentId,
          },
          {
            onSuccess: async () => {
              await getFields();
              queryClient.invalidateQueries({ queryKey: ["getField"] });
            },
          }
        );
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Không có tệp tin được chọn.");
    }
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      // onSubmit={handleSubmit(handleFormSubmit)}
    >
      {/* <UploadField
        variant="outlined"
        name="fileUrl"
        label={t("0-common.upload")}
        control={control}
        sx={{ border: "2px solid #357EEB", height: "45px" }}
        onChange={() => {}}
      /> */}

      <Box
        component="label"
        // startIcon={<CloudUploadIcon />}
        sx={{
          marginBottom: "0.5rem",
          marginTop: "1rem",
          fontWeight: "medium",
          width: "100%",
          height: "100%",
          display: "flex",
          my: 0,
          textAlign: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          {cameraData.camera?.value ? (
            <Box
              component="img"
              sx={{
                maxHeight: "100%",
                maxWidth: "100%",
              }}
              alt="The house from the offer."
              src={`data:image/png;base64,` + cameraData.camera?.value}
            />
          ) : (
            <>
              {cameraData.show_icon_enabled && <Camera />}
              <Typography color="#a19b6e">{cameraData.place_holder}</Typography>
            </>
          )}

          {/* {cameraData.show_icon_enabled && <Camera />}
          <Typography>{cameraData.place_holder}</Typography> */}
        </Stack>
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          disabled={!allow}
          onChange={handleUploadImage}
        />
      </Box>
    </Box>
  );
};

CameraSignField.propTypes = {
  cameraData: PropTypes.object,
  workFlow: PropTypes.object,
  allow: PropTypes.bool,
  getFields: PropTypes.func,
};

export default CameraSignField;
