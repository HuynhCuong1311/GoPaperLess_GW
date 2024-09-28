import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { forwardRef } from "react";

export const AppearanceSignForm = forwardRef(
  ({ signatureImage, showInput }, ref) => {
    // useEffect(() => {
    //   onDisableSubmit(false);
    //   return () => {
    //     onDisableSubmit(true);
    //   };
    // }, []);
    return (
      <Box
        sx={showInput ? { width: "100%", height: "100%" } : { minWidth: 400 }}
      >
        <Box
          sx={{
            borderRadius: "6px",
            border: "2px solid #357EEB",
            height: "100%",
            width: "100%",
            p: "3px",
            // maxHeight: "100%",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            ref={ref}
            sx={{
              height: showInput ? "100%" : "160px",
              overflow: "hidden",
              // borderRadius: "6px",
              // border: !imgBase64 ? "2px solid #357EEB" : "none",
              position: "relative",
            }}
          >
            <Box
              component="img"
              sx={{
                maxHeight: "100%",
                maxWidth: "100%",
              }}
              alt="The house from the offer."
              src={`data:image/png;base64,` + signatureImage}
            />
          </Stack>
        </Box>
      </Box>
    );
  }
);

AppearanceSignForm.propTypes = {
  signatureImage: PropTypes.string,
  showInput: PropTypes.bool,
  onDisableSubmit: PropTypes.func,
};

AppearanceSignForm.displayName = "AppearanceSignForm";

export default AppearanceSignForm;
