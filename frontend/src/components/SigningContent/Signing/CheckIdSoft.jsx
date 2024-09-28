import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useController } from "react-hook-form";

export const CheckIdSoft = ({ name, control }) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control });
  useEffect(() => {
    const ipWS = "127.0.0.1";
    const portWS = "9505";
    const typeOfWS = "wss";

    var url = typeOfWS + "://" + ipWS + ":" + portWS + "/ISPlugin";

    const socket = new WebSocket(url);

    // Xử lý sự kiện khi kết nối mở thành công
    socket.addEventListener("open", () => {
      // console.log("Kết nối WebSocket đã thành công");
      socket.close();
      onChange("open1");
      // onBlur(true);
    });

    // Xử lý sự kiện khi xảy ra lỗi trong quá trình kết nối
    socket.addEventListener("error", () => {
      // console.error("Lỗi kết nối WebSocket:", error);
    });

    // Xử lý sự kiện khi kết nối bị đóng
    socket.addEventListener("close", (event) => {
      // console.log("Kết nối WebSocket đã bị đóng");
      // console.log("Mã đóng:", event.code);
      if (event.code === 1006) {
        // setErrorPG(
        //   "Required software is missing or not available. Download here"
        // );
      }
      // console.log("Lí do:", event.reason);
    });

    // Kiểm tra trạng thái kết nối hiện tại
    // console.log("Trạng thái kết nối:", socket.readyState);
  }, []);
  return (
    <Box name={name} value={value}>
      <FormHelperText
        error={!!error}
        sx={{
          color: "red",
          px: "14px",
          // position: "absolute",
          // bottom: 60,
          // left: "50%",
          // transform: "translateX(-50%)",
        }}
      >
        {error?.message}
      </FormHelperText>
    </Box>
  );
};

CheckIdSoft.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
};

export default CheckIdSoft;
