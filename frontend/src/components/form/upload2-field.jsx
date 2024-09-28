import { ReactComponent as Camera } from "@/assets/images/contextmenu/camera.svg";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

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

export const Upload2Field = ({
  name,
  label,
  control,
  cameraData,
  allow,
  // eslint-disable-next-line no-unused-vars
  onChange: externalOnChange, // không cho user overide lại các thuộc tính này
  // onBlur: externalOnBlur,
  // ref: externalRef,
  // value: externalValue,
  ...rest
}) => {
  const {
    field: { onChange },
  } = useController({ name, control });

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
        onChange(reader.result);
        // externalOnChange();
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Không có tệp tin được chọn.");
    }
  };

  // const showIcon = (type) => {
  //   switch (type) {
  //     case "CAMERA":
  //       return <Camera />;
  //     case "ATTACHMENT":
  //       return <Attachment />;
  //   }
  // };

  return (
    <Box
      component="label"
      name={name}
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
      // onClick={() => buttonRef.current.click()}
      {...rest}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
      >
        {cameraData.show_icon_enabled && <Camera />}
        <Typography>{label}</Typography>
      </Stack>
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        disabled={!allow}
        onChange={handleUploadImage}
      />
    </Box>
  );
};

Upload2Field.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
  cameraData: PropTypes.object,
  allow: PropTypes.bool,
};

export default Upload2Field;
