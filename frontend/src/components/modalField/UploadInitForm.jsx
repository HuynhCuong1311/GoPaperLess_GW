import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogFile } from "../modal2";
import { UploadField } from "../form";

export const UploadInitForm = forwardRef(
  ({ watch, control, onDisableSubmit }, ref) => {
    const { t } = useTranslation();
    const [openCrop, setOpenCrop] = useState(false);

    useEffect(() => {
      if (watch("fileUrl") === "") {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
      // if (provider === "USB_TOKEN_SIGNING" && errorPG) {
      //   onDisableSubmit(true);
      // }
    }, [watch("fileUrl"), onDisableSubmit, watch]);

    const handleUploadFile = () => {
      handleOpenCrop();
    };

    const handleOpenCrop = () => {
      setOpenCrop(true);
    };

    const handleCloseCrop = () => {
      setOpenCrop(false);
    };
    return (
      <Box
        // component="form"
        // ref={ref}
        // onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ minWidth: 400 }}
      >
        <Box mb="10px">
          <UploadField
            variant="outlined"
            name="fileUrl"
            label={t("0-common.upload")}
            control={control}
            sx={{ border: "2px solid #357EEB", height: "45px" }}
            onChange={handleUploadFile}
          />
        </Box>
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
            ref={ref}
            sx={{
              height: "160px",
              overflow: "hidden",
              borderRadius: "6px",
              // border: "2px solid #357EEB",
              position: "relative",
              // backgroundColor: "white",
              // set background image
            }}
          >
            <Stack
              // direction="row-reverse"
              direction={
                watch("alignment") === "auto" || watch("alignment") === "left"
                  ? "row"
                  : "row-reverse"
              }
              sx={{
                // flexDirection: "row-reversed",
                display: "flex",
                width: "100%",
                // height: "150px",
                height: "100%",
                alignItems: "center",
                minHeight: "100px",
                // padding: "2rem 0",
              }}
              // ref={sigFileRef}
            >
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "100%",
                  height: "100%",
                  fontSize: "2rem",
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
                className="font-moon-dance"
              >
                {/* {watch("text") || ""} */}
                {watch("imageScrop") ? (
                  <Box
                    component="img"
                    sx={{
                      // height: "100%",
                      maxWidth: "70%",
                      maxHeight: "100%",
                    }}
                    alt="The house from the offer."
                    src={watch("imageScrop")}
                  />
                ) : null}
              </Stack>
            </Stack>
            {/* <Box
            style={{
              borderTop: "2px dashed #357EEB",
              height: "20px",
            }}
          ></Box> */}
          </Stack>
        </Box>

        <DialogFile
          name="imageScrop"
          control={control}
          open={openCrop}
          handleClose={handleCloseCrop}
          data={watch("fileUrl")}
        />
      </Box>
    );
  }
);

UploadInitForm.propTypes = {
  onDisableSubmit: PropTypes.func,
  watch: PropTypes.func,
  control: PropTypes.object,
};
UploadInitForm.displayName = "UploadInitForm";
export default UploadInitForm;
