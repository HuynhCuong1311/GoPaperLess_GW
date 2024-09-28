import logo1 from "@/assets/images/Logo/gopaperless_white.png";
import { ContentRight } from "@/components/modal2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { forwardRef, useEffect } from "react";
import { InputField } from "../form";

export const TextSignForm = forwardRef(
  (
    {
      watch,
      dataSigning,
      headerFooter,
      formattedDatetime,
      onDisableSubmit,
      control,
      showInput,
      imgBase64,
    },
    ref
  ) => {
    const nameValue =
      typeof dataSigning.certChain.subject === "string"
        ? dataSigning.certChain.subject
        : dataSigning.certChain.subject.commonName;
    const dnValue = dataSigning.certChain.subjectDN
      ? dataSigning.certChain.subjectDN
      : dataSigning.certChain.name;
    const reasonValue = dataSigning.reason;
    const logoValue = headerFooter.loGo ? headerFooter.loGo : logo1;
    const location = dataSigning.countryRealtime;

    const subtitle = {
      labelText: false,
      nameText: nameValue,
      dnText: dnValue,
      reasonText: reasonValue || "signature",
      locationText: location,
      dateText: formattedDatetime,
      itverText: "itext core 8.0.2",
    };

    const direction =
      watch("name") ||
      watch("date") ||
      watch("reason") ||
      watch("dn") ||
      watch("itver") ||
      watch("location");

    useEffect(() => {
      if (watch("text") === "" || watch("email") === "") {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
    }, [watch("text"), onDisableSubmit, watch("email"), watch]);

    return (
      <Box
        sx={showInput ? { width: "100%", height: "100%" } : { minWidth: 400 }}
      >
        <Box sx={showInput ? { display: "none" } : {}}>
          <InputField
            label=""
            name="text"
            control={control}
            inputProps={{
              sx: {
                py: "11px",
                backgroundColor: "signingWFBackground.main",
              },
            }}
            sx={{ m: "0 0 10px" }}
          />
        </Box>
        <Box
          sx={{
            borderRadius: "6px",
            border: !imgBase64 ? "2px solid #357EEB" : "none",
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
              height: showInput ? "100%" : "160px",
              overflow: "hidden",
              // borderRadius: "6px",
              // border: !imgBase64 ? "2px solid #357EEB" : "none",
              position: "relative",
              "&:before": watch("logo")
                ? {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.2,
                    zIndex: 1,
                    backgroundImage: !imgBase64 ? `url(${logoValue})` : "none",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }
                : {},
            }}
          >
            {imgBase64 && (
              <img src={imgBase64} style={{ width: "auto", height: "100%" }} />
            )}
            {!imgBase64 && (
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
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: direction ? "50%" : "100%",
                    fontSize: "25px",
                    textAlign: "center",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    wordBreak: "break-word",
                  }}
                  className="font-moon-dance"
                >
                  {watch("text") || ""}
                </Box>
                <ContentRight
                  direction={direction}
                  subtitle={subtitle}
                  watch={watch}
                />
              </Stack>
            )}
            {/* <Box
            style={{
              borderTop: "2px dashed #357EEB",
              height: "20px",
            }}
          ></Box> */}
          </Stack>
        </Box>
      </Box>
    );
  }
);

TextSignForm.propTypes = {
  onTextSubmit: PropTypes.func,
  signer: PropTypes.object,
  dataSigning: PropTypes.object,
  headerFooter: PropTypes.object,
  formattedDatetime: PropTypes.string,
  onDisableSubmit: PropTypes.func,
  watch: PropTypes.func,
  control: PropTypes.object,
  showInput: PropTypes.bool,
  imgBase64: PropTypes.string,
};
TextSignForm.displayName = "TextSignForm";
export default TextSignForm;
