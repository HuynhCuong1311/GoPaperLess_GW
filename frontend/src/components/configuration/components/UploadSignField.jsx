import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { lazy, Suspense, useEffect, useState } from "react";

const SignatureItem = lazy(() =>
  import("@/components/configuration/components/SignatureItem")
);

const UploadField = lazy(() =>
  import("@/components/configuration/components/UploadField")
);

const UploadSignature = lazy(() =>
  import("@/components/configuration/components/UploadSignature")
);

const UploadSignField = ({ state, dispatch }) => {
  const [openCrop, setOpenCrop] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);

  useEffect(() => {
    if (
      state.data.signatureOptions.uploadUrl === "" ||
      !state.data.contactInfor
    ) {
      dispatch({ type: "SET_DISABLED", payload: true });
    } else {
      dispatch({ type: "SET_DISABLED", payload: false });
    }
  }, [
    state.data.signatureOptions.uploadUrl,
    dispatch,
    state.data.contactInfor,
  ]);

  const handleOpenCrop = () => {
    setOpenCrop(true);
  };

  const handleCloseCrop = () => {
    setOpenCrop(false);
  };

  const handleUploadFile = () => {
    handleOpenCrop();
  };
  return (
    <Box sx={{ minWidth: 400 }}>
      <Box mb="10px">
        <Suspense fallback={<div>Loading...</div>}>
          <UploadField
            setFileUpload={setFileUpload}
            handleUploadFile={handleUploadFile}
          />
        </Suspense>
      </Box>
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

      <Suspense fallback={<div>Loading...</div>}>
        <UploadSignature
          open={openCrop}
          data={fileUpload}
          dispatch={dispatch}
          handleClose={handleCloseCrop}
        />
      </Suspense>
    </Box>
  );
};

UploadSignField.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
};

export default UploadSignField;
