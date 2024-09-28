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

    socket.addEventListener("open", () => {
      socket.close();
      onChange("open1");
    });

    socket.addEventListener("error", () => {});

    socket.addEventListener("close", (event) => {
      if (event.code === 1006) {
        // setErrorPG(
        //   "Required software is missing or not available. Download here"
        // );
      }
    });
  }, []);
  return (
    <Box name={name} value={value}>
      <FormHelperText
        error={!!error}
        sx={{
          color: "red",
          px: "14px",
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
