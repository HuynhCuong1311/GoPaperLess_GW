import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
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

export const UploadField = ({
  name,
  label,
  control,
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

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
      externalOnChange();
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Button
      component="label"
      name={name}
      startIcon={<CloudUploadIcon />}
      sx={{
        marginBottom: "0.5rem",
        marginTop: "1rem",
        fontWeight: "medium",
      }}
      {...rest}
    >
      {label}
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        onChange={handleUploadImage}
      />
    </Button>
  );
};

UploadField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default UploadField;
