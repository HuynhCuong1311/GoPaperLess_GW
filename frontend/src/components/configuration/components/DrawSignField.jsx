import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DrawSignature = lazy(() =>
  import("@/components/configuration/components/DrawSignature")
);

const SignatureItem = lazy(() =>
  import("@/components/configuration/components/SignatureItem")
);

const DrawSignField = ({ state, dispatch }) => {
  // console.log("state: ", state);
  const { t } = useTranslation();

  const [openDraw, setOpenDraw] = useState(false);

  useEffect(() => {
    if (
      state.data.signatureOptions.drawUrl === "" ||
      !state.data.contactInfor
    ) {
      dispatch({ type: "SET_DISABLED", payload: true });
    } else {
      dispatch({ type: "SET_DISABLED", payload: false });
    }
  }, [state.data.signatureOptions.drawUrl, dispatch, state.data.contactInfor]);

  const handleOpenDraw = () => {
    setOpenDraw(true);
  };

  const handleCloseDraw = () => {
    setOpenDraw(false);
  };
  return (
    <Box sx={{ minWidth: 400 }}>
      <Box mb="10px">
        <Button
          variant="outlined"
          sx={{ border: "2px solid #357EEB", height: "45px" }}
          onClick={handleOpenDraw}
        >
          {t("0-common.draw")}
        </Button>
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
        <DrawSignature
          open={openDraw}
          handleClose={handleCloseDraw}
          dispatch={dispatch}
        />
      </Suspense>
    </Box>
  );
};

DrawSignField.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
};

export default DrawSignField;
