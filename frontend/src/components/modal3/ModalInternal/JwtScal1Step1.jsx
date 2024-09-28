import facescan from "@/assets/images/facescal1.png";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export const JwtScal1Step1 = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main", height: "17px" }}
        // textAlign={"center"}
      >
        {/* Scan Face */}
        {t("electronic.stepFace1")}
      </Typography>
      <Typography
        variant="h6"
        marginBottom="15px"
        // textAlign="center"
        color="textBold.main"
        mt="10px"
      >
        {/* Please, look to the camera to scan your face */}
        {t("electronic.stepFace2")}
      </Typography>
      <Box width={263} marginX="auto" my="10px" p="64px 0">
        <img
          src={facescan}
          width="100%"
          //   height={250}
          alt="chip"
        />
      </Box>
    </Box>
  );
};

JwtScal1Step1.propTypes = {};

export default JwtScal1Step1;
