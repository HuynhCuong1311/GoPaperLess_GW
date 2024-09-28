import logo1 from "@/assets/images/Logo/gopaperless_white.png";
import { AddSubtitle, ContentRight, DialogFile } from "@/components/modal2";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { InputField, UploadField } from "../../form";

const UploadSignForm = forwardRef(
  (
    {
      onFileSubmit,
      signer,
      dataSigning,
      headerFooter,
      formattedDatetime,
      onDisableSubmit,
    },
    ref
  ) => {
    const schema = yup.object().shape({
      fileUrl: yup.string().required("Please choose your file"),
      imageScrop: yup.string(),
      email: yup
        .string()
        .email("Please enter your email")
        .required("This field is required."),
      name: yup.boolean(),
      date: yup.boolean(),
      logo: yup.boolean(),
      reason: yup.boolean(),
      dn: yup.boolean(),
      itver: yup.boolean(),
      location: yup.boolean(),
      label: yup.boolean(),
      alignment: yup.string(),
      format: yup.number(),
    });

    const { control, handleSubmit, watch } = useForm({
      defaultValues: {
        fileUrl: "",
        imageScrop: "",
        name: false,
        email: dataSigning.email,
        date: false,
        logo: false,
        reason: false,
        dn: false,
        itver: false,
        location: false,
        label: false,
        alignment: "auto",
        format: 10,
      },
      resolver: yupResolver(schema),
    });
    const { t } = useTranslation();
    const [errorFile, setErrorFile] = useState(false);

    const [openCrop, setOpenCrop] = useState(false);

    const sigFileRef = useRef(null);

    const handleOpenCrop = () => {
      setOpenCrop(true);
    };

    const handleCloseCrop = () => {
      setOpenCrop(false);
    };

    const nameValue =
      typeof dataSigning.certChain.subject === "string"
        ? dataSigning.certChain.subject
        : dataSigning.certChain.subject.commonName;
    const dnValue = dataSigning.certChain.subjectDN
      ? dataSigning.certChain.subjectDN
      : "";
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
      (watch("dn") && subtitle.dnText) ||
      watch("itver") ||
      watch("location");

    useEffect(() => {
      if (watch("fileUrl") === "" || watch("email") === "") {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
    }, [watch("fileUrl"), onDisableSubmit, watch("email"), watch]);

    const handleFormSubmit = () => {
      html2canvas(sigFileRef.current).then((canvas) => {
        const data64 = canvas.toDataURL();
        onFileSubmit(data64);
      });
    };

    const handleUploadFile = () => {
      handleOpenCrop();
    };

    return (
      <Box
        component="form"
        ref={ref}
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ minWidth: 400 }}
      >
        <Box mb={2}>
          <UploadField
            variant="contained"
            name="fileUrl"
            label={t("0-common.upload")}
            control={control}
            sx={{
              marginBottom: "0.5rem",
              marginTop: "1rem",
              fontWeight: "medium",
            }}
            setErrorFile={setErrorFile}
            onChange={handleUploadFile}
          />
        </Box>
        <Stack
          ref={sigFileRef}
          sx={{
            overflow: "hidden",
            borderRadius: "6px",
            border: "1px solid #357EEB",
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
                  backgroundImage: `url(${logoValue})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }
              : {},
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
              alignItems: "center",
              minHeight: "100px",
              // padding: "2rem 0",
            }}
            // ref={sigFileRef}
          >
            <Box
              sx={{
                marginLeft: "auto",
                marginRight: "auto",
                width: direction ? "50%" : "100%",
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
                  }}
                  alt="The house from the offer."
                  src={watch("imageScrop")}
                />
              ) : null}
            </Box>
            <ContentRight
              direction={direction}
              subtitle={subtitle}
              watch={watch}
            />
          </Stack>
          <Box
            style={{
              borderTop: "2px dashed #357EEB",
              height: "2rem",
            }}
          ></Box>
        </Stack>
        <FormHelperText sx={{ color: "error.main", mx: "14px" }}>
          {errorFile && errorFile}
        </FormHelperText>
        <Typography mt={1}>{t("signing.contact_information")}</Typography>
        <Box mb={1}>
          <InputField
            label={t("0-common.email")}
            name="email"
            type="email"
            control={control}
            sx={{
              my: 1,
            }}
            inputProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
          />
        </Box>
        <Box>
          <AddSubtitle control={control} signer={signer} />
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

UploadSignForm.propTypes = {
  onFileSubmit: PropTypes.func,
  signer: PropTypes.object,
  dataSigning: PropTypes.object,
  headerFooter: PropTypes.object,
  formattedDatetime: PropTypes.string,
  onDisableSubmit: PropTypes.func,
};
UploadSignForm.displayName = "TextSignForm";
export default UploadSignForm;
