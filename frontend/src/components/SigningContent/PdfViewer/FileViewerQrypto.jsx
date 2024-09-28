import { Box, Tooltip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import adobe from "@/assets/images/adobe_pdf.jpg";
export const FileViewerQrypto = ({ fileUrl, fileType, item }) => {
  const openFile = () => {
    // Chuyển base64 thành byte[]
    const byteCharacters = atob(fileUrl);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Tạo Blob từ byte[]
    let blob;
    if (fileType === "application/pdf") {
      blob = new Blob([byteArray], { type: "application/pdf" });
    } else if (fileType === "image/png" || fileType === "image/jpeg") {
      blob = new Blob([byteArray], { type: fileType });
    } else {
      console.error("Unsupported file type");
      return;
    }

    // Tạo object URL cho Blob
    const blobUrl = URL.createObjectURL(blob);

    // Mở một tab mới để xem PDF
    window.open(blobUrl, "_blank");
  };

  return (
    <Tooltip title="Click here to view details" arrow>
      <Box
        container
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "10px",
          component: "section",
          background: "#E8E8E8",
        }}
        onClick={openFile}
      >
        <Box>
          <img
            src={adobe}
            style={{
              height: "109px",
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ textAlign: "right", wordWrap: "break-word" }}>
            {item.ModelF1.fileName}
          </Typography>
          <Typography sx={{ textAlign: "right", wordWrap: "break-word" }}>
            ({item.ModelF1.fileSize}KB)
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};
FileViewerQrypto.propTypes = {
  fileUrl: PropTypes.string,
  fileType: PropTypes.string,
  item: PropTypes.object,
};

export default FileViewerQrypto;
