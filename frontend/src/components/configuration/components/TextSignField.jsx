import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { lazy, Suspense, useEffect } from "react";

const SignatureItem = lazy(() =>
  import("@/components/configuration/components/SignatureItem")
);

const TextSignField = ({ state, dispatch }) => {
  useEffect(() => {
    if (state.data.nameValue && state.data.contactInfor) {
      dispatch({ type: "SET_DISABLED", payload: false });
    } else {
      dispatch({ type: "SET_DISABLED", payload: true });
    }
  }, [state.data.nameValue, state.data.contactInfor, dispatch]);

  return (
    <Box sx={{ minWidth: 400 }}>
      <TextField
        fullWidth
        size="small"
        margin="normal"
        value={state.data.nameValue}
        onChange={(event) => {
          dispatch({ type: "SET_NAME_VALUE", payload: event.target.value });
        }}
        inputProps={{
          sx: {
            py: "11px",
            backgroundColor: "signingWFBackground.main",
          },
        }}
        sx={{ m: "0 0 10px" }}
      />

      <Box
        sx={{
          borderRadius: "6px",
          border: "2px solid #357EEB",
          height: "170px",
          width: "100%",
          p: "3px",
          // maxHeight: "100%",
          overflow: "hidden",
          fontSize: "16px",
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <SignatureItem data={state.data} />
        </Suspense>
      </Box>
    </Box>
  );
};

TextSignField.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
};

export default TextSignField;
