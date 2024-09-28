import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const Step4 = ({ image, personalInfomation }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main" }}
        height="17px"
      >
        {/* Personal Information */}
        {t("electronic.step41")}
      </Typography>

      <Box
        width="120px"
        height="120px"
        marginX="auto"
        borderRadius="50%"
        overflow="hidden"
        my="10px"
      >
        <img
          src={`data:image/png;base64,${image}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt="image123"
        />
      </Box>

      <Grid container rowSpacing="10px" columnSpacing={{ xs: "20px" }}>
        <Grid item xs={12}>
          <Typography variant="h6" height="17px" fontWeight={600} mb="10px">
            {t("electronic.step42")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            // name={name}
            defaultValue={personalInfomation?.fullName}
            sx={{ my: 0 }}
            InputProps={{
              readOnly: true,
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" height="17px" fontWeight={600} mb="10px">
            {t("electronic.step43")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            // name={name}
            defaultValue={personalInfomation?.gender}
            sx={{ my: 0 }}
            InputProps={{
              readOnly: true,
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" height="17px" fontWeight={600} mb="10px">
            {t("electronic.step44")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            // name={name}
            defaultValue={personalInfomation?.birthDate}
            sx={{ my: 0 }}
            InputProps={{
              readOnly: true,
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display:
              personalInfomation.documentType === "E-PASSPORT"
                ? "block"
                : "none",
          }}
        >
          <Typography variant="h6" height="17px" fontWeight={600} mb="10px">
            {t("electronic.step48")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            // name={name}
            defaultValue={personalInfomation?.passportNumber}
            sx={{ my: 0 }}
            InputProps={{
              readOnly: true,
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display:
              personalInfomation.documentType === "E-PASSPORT"
                ? "none"
                : "block",
          }}
        >
          <Typography variant="h6" height="17px" fontWeight={600} mb="10px">
            {t("electronic.step45")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            // name={name}
            defaultValue={personalInfomation?.personalNumber}
            sx={{ my: 0 }}
            InputProps={{
              readOnly: true,
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" height="17px" fontWeight={600} mb="10px">
            {t("electronic.step46")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            // name={name}
            defaultValue={personalInfomation?.nationality}
            sx={{ my: 0 }}
            InputProps={{
              readOnly: true,
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" height="17px" fontWeight={600} mb="10px">
            {/* {t("electronic.step47")} */}
            {personalInfomation.documentType === "E-PASSPORT"
              ? t("electronic.step49")
              : t("electronic.step47")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            // name={name}
            defaultValue={
              personalInfomation.documentType === "E-PASSPORT"
                ? personalInfomation.placeOfBirth
                : personalInfomation?.placeOfOrigin
            }
            sx={{ my: 0 }}
            InputProps={{
              readOnly: true,
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

Step4.propTypes = {
  image: PropTypes.string,
  personalInfomation: PropTypes.object,
};

export default Step4;
