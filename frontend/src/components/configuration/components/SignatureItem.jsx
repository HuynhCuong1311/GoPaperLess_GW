import logo from "@/assets/images/Logo/gopaperless_white.png";
import AddingSignatureOptions from "@/components/configuration/components/AddingSignatureOptions";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";

export const SignatureItem = ({ data }) => {
  const direction =
    data.signatureOptions.name ||
    data.signatureOptions.date ||
    data.signatureOptions.reason ||
    data.signatureOptions.dn ||
    data.signatureOptions.itver ||
    data.signatureOptions.location;

  const renderContent = () => {
    switch (data.signatureOptions.signatureType) {
      case "text":
        return data.nameValue;
      case "draw":
        if (data.signatureOptions.drawUrl !== "") {
          return (
            <Box
              component="img"
              sx={{
                maxHeight: "100%",
                maxWidth: "70%",
              }}
              alt="The house from the offer."
              src={data.signatureOptions.drawUrl}
            />
          );
        } else {
          return;
        }
      case "upload":
        if (data.signatureOptions.uploadUrl !== "") {
          return (
            <Box
              component="img"
              sx={{
                maxHeight: "100%",
                maxWidth: "70%",
              }}
              alt="The house from the offer."
              src={data.signatureOptions.uploadUrl}
            />
          );
        } else {
          return;
        }
      default:
        return <img src={logo} />;
    }
  };
  return (
    <Stack
      // ref={ref}
      direction={"row"}
      alignItems={"center"}
      sx={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        // background: "transparent",
        "&:before": data.signatureOptions.logo
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
              backgroundImage: data.logoValue
                ? `url(${data.logoValue})`
                : `url(${logo})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }
          : {},
      }}
    >
      <Stack
        direction={
          data.signatureOptions.alignment === "auto" ||
          data.signatureOptions.alignment === "left"
            ? "row"
            : "row-reverse"
        }
        sx={{
          width: "100%",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: direction ? "50%" : "100%",
            fontSize: "25px",
            textAlign: "center",
            textTransform: "capitalize",
            fontWeight: "bold",
            wordBreak: "break-word",
          }}
          className="font-moon-dance"
        >
          {renderContent()}
          {/* {data.nameValue} */}
        </Box>

        <AddingSignatureOptions data={data} direction={direction} />
      </Stack>
    </Stack>
  );
};

SignatureItem.propTypes = {
  data: PropTypes.object,
};

export default SignatureItem;
