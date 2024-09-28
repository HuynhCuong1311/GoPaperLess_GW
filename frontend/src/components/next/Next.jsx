import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";

export const Next = ({ newFields, value, handleChange, signer }) => {
  // console.log("newFields: ", newFields);
  // console.log("value: ", value);

  return (
    <Box
      sx={{
        display:
          signer.signerStatus === 1 && newFields.length > 0 ? "block" : "none",
        position: "fixed",
        top: "20rem",
        left: "1rem",
        zIndex: 3,
        backgroundColor: "#f9da00",
        // p: "10px",
        // userSelect: "none",
        cursor: "pointer", // Thêm style cursor để biểu thị rằng đây là một phần có thể click
      }}
      onClick={handleChange}
    >
      <Stack className="next" justifyContent={"center"}>
        {value !== null
          ? newFields.length > 0
            ? "Next: " + Number(value) + "/" + newFields.length
            : 0
          : "Start"}

        {/* {newFields.length > 0 ? value + 1 + "/" + newFields.length : 0} */}
      </Stack>
    </Box>
  );
};

Next.propTypes = {
  newFields: PropTypes.array,
  value: PropTypes.number,
  handleChange: PropTypes.func,
  signer: PropTypes.object,
};

export default Next;
