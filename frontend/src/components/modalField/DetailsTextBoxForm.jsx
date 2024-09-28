import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { InputField, TitleInputField } from "../form";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  // color: theme.palette.text.secondary,
}));
export const DetailsTextBoxForm = ({ control, type }) => {
  const { t } = useTranslation();
  return (
    <>
      {type !== "group" && (
        <TitleInputField
          name="fieldName"
          title={t("0-common.field name")}
          control={control}
          sx={{
            my: 0,
          }}
          inputProps={{
            readOnly: true,
            sx: {
              py: "11px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
        />
        // <Box mb="10px">
        //   <Typography variant="h6" mb="10px">
        //     {t("0-common.field name")}
        //   </Typography>
        //   <InputField
        //     label=""
        //     name="fieldName"
        //     control={control}
        //     InputLabelProps={{
        //       sx: {
        //         backgroundColor: "signingWFBackground.main",
        //       },
        //     }}
        //     inputProps={{
        //       readOnly: true,
        //       sx: {
        //         py: "11px",
        //         backgroundColor: "signingWFBackground.main",
        //       },
        //     }}
        //     sx={{ my: 0, height: "45px" }}
        //   />

        // </Box>
      )}
      {type === "group" && (
        <TitleInputField
          name="fieldGroup"
          title="Field Group"
          control={control}
          sx={{
            my: 0,
          }}
          inputProps={{
            readOnly: true,
            sx: {
              py: "11px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
        />
        // <Box mb="10px">
        //   <Typography variant="h6" mb="10px">
        //     Field Group
        //   </Typography>
        //   <InputField
        //     label=""
        //     name="fieldGroup"
        //     control={control}
        //     InputLabelProps={{
        //       sx: {
        //         backgroundColor: "signingWFBackground.main",
        //       },
        //     }}
        //     inputProps={{
        //       readOnly: true,
        //       sx: {
        //         py: "11px",
        //         backgroundColor: "signingWFBackground.main",
        //       },
        //     }}
        //     sx={{ my: 0, height: "45px" }}
        //   />
        // </Box>
      )}
      <Box sx={{ width: "100%" }}>
        <Grid
          container
          rowSpacing="10px"
          columnSpacing={{ xs: 4, sm: 5, md: 6 }}
          p="10px"
        >
          <Grid item xs={6}>
            <Item
              sx={{
                borderBottom: "1.25px solid",
                borderColor: "borderColor.main",
                height: "20px",
                p: 0,
                borderRadius: 0,
                textAlign: "center",
              }}
              elevation={0}
            >
              <Typography variant="h6">{t("0-common.screen")}</Typography>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item
              sx={{
                borderBottom: "1.25px solid",
                borderColor: "borderColor.main",
                height: "20px",
                p: 0,
                borderRadius: 0,
                textAlign: "center",
              }}
              elevation={0}
            >
              <Typography variant="h6">PDF</Typography>
            </Item>
          </Grid>

          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.left")}
              </Typography>
              <InputField
                label=""
                name="left"
                control={control}
                InputLabelProps={{
                  sx: {
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                inputProps={{
                  sx: {
                    py: "11px",
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                sx={{ my: 0, height: "45px" }}
              />
              {/* <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={data.dimension.x}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  // readOnly: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              /> */}
            </Item>
          </Grid>
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.left")}
              </Typography>
              <InputField
                label=""
                name="left"
                control={control}
                disabled
                InputLabelProps={{
                  sx: {
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                inputProps={{
                  sx: {
                    py: "11px",
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                sx={{ my: 0, height: "45px" }}
              />
              {/* <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={data.dimension.x}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  disabled: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              /> */}
            </Item>
          </Grid>

          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.top")}
              </Typography>
              <InputField
                label=""
                name="top"
                control={control}
                InputLabelProps={{
                  sx: {
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                inputProps={{
                  sx: {
                    py: "11px",
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                sx={{ my: 0, height: "45px" }}
              />
              {/* <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={data.dimension.y}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  // readOnly: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              /> */}
            </Item>
          </Grid>
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.top")}
              </Typography>
              <InputField
                label=""
                name="top"
                control={control}
                disabled
                InputLabelProps={{
                  sx: {
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                inputProps={{
                  sx: {
                    py: "11px",
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                sx={{ my: 0, height: "45px" }}
              />
              {/* <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={data.dimension.y}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  disabled: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              /> */}
            </Item>
          </Grid>

          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.width")}
              </Typography>
              <InputField
                label=""
                name="width"
                control={control}
                InputLabelProps={{
                  sx: {
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                inputProps={{
                  sx: {
                    py: "11px",
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                sx={{ my: 0, height: "45px" }}
              />
            </Item>
          </Grid>
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.width")}
              </Typography>
              <InputField
                label=""
                name="width"
                control={control}
                disabled
                InputLabelProps={{
                  sx: {
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                inputProps={{
                  sx: {
                    py: "11px",
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                sx={{ my: 0, height: "45px" }}
              />
            </Item>
          </Grid>

          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.height")}
              </Typography>
              <InputField
                label=""
                name="height"
                control={control}
                InputLabelProps={{
                  sx: {
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                inputProps={{
                  sx: {
                    py: "11px",
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                sx={{ my: 0, height: "45px" }}
              />
            </Item>
          </Grid>
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.height")}
              </Typography>
              <InputField
                label=""
                name="height"
                control={control}
                disabled
                InputLabelProps={{
                  sx: {
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                inputProps={{
                  sx: {
                    py: "11px",
                    backgroundColor: "signingWFBackground.main",
                  },
                }}
                sx={{ my: 0, height: "45px" }}
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
DetailsTextBoxForm.propTypes = {
  data: PropTypes.object,
  control: PropTypes.object,
  type: PropTypes.string,
};
