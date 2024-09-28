import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogDraw } from "../modal2";

export const DrawInitForm = forwardRef(
  ({ watch, control, onDisableSubmit }, ref) => {
    const { t } = useTranslation();

    const [openDraw, setOpenDraw] = useState(false);

    useEffect(() => {
      if (watch("drawUrl") === "") {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
    }, [watch("drawUrl"), onDisableSubmit, watch]);

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
            }}
          >
            <Stack
              direction={
                watch("alignment") === "auto" || watch("alignment") === "left"
                  ? "row"
                  : "row-reverse"
              }
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                // height: "150px",
                height: "100%",
              }}
              // ref={sigCanvasRef}
            >
              <Stack
                direction="row"
                justifyContent={"center"}
                alignItems="center"
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "100%",
                  fontSize: "2rem",
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                {/* {watch("drawUrl") || ""} */}
                {watch("drawUrl") ? (
                  <Box
                    component="img"
                    sx={{
                      // height: "100%",
                      maxWidth: "70%",
                    }}
                    alt="The house from the offer."
                    src={watch("drawUrl")}
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

        <DialogDraw
          name="drawUrl"
          control={control}
          open={openDraw}
          handleClose={handleCloseDraw}
        />
      </Box>
    );
  }
);

DrawInitForm.propTypes = {
  watch: PropTypes.func,
  control: PropTypes.object,
  onDisableSubmit: PropTypes.func,
};
DrawInitForm.displayName = "DrawInitForm";
export default DrawInitForm;
