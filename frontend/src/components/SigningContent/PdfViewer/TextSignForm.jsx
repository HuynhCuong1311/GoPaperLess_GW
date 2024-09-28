import logo1 from "@/assets/images/Logo/gopaperless_white.png";
import { AddSubtitle, ContentRight } from "@/components/modal2";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { InputField } from "../../form";

export const TextSignForm = forwardRef(
  (
    {
      onTextSubmit,
      signer,
      dataSigning,
      headerFooter,
      formattedDatetime,
      onDisableSubmit,
    },
    ref
  ) => {
    const schema = yup.object().shape({
      text: yup.string().required("Please enter your name"),
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
        text:
          typeof dataSigning.certChain.subject === "string"
            ? dataSigning.certChain.subject
            : dataSigning.certChain.subject.commonName,
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
    const sigTextRef = useRef(null);

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

    const handleFormSubmit = () => {
      // console.log("data: ", data);
      html2canvas(sigTextRef.current).then((canvas) => {
        const data64 = canvas.toDataURL();
        //   console.log(data64);
        onTextSubmit(data64);
      });
    };

    const direction =
      watch("name") ||
      watch("date") ||
      watch("reason") ||
      (watch("dn") && subtitle.dnText) ||
      watch("itver") ||
      watch("location");
    // console.log("alignment: ", watch("alignment"));

    useEffect(() => {
      if (watch("text") === "" || watch("email") === "") {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
    }, [watch("text"), onDisableSubmit, watch("email"), watch]);

    return (
      <Box
        component="form"
        ref={ref}
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ minWidth: 400 }}
      >
        <Box mb={2}>
          <InputField
            label={t("0-common.text")}
            name="text"
            control={control}
            inputProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
          />
        </Box>
        <Stack
          ref={sigTextRef}
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
            // ref={sigTextRef}
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
              {watch("text") || ""}
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
        <Typography mt={1}>{t("signing.contact_information")}</Typography>
        <Box mb={1}>
          <InputField
            label={t("0-common.email")}
            name="email"
            type="email"
            // defaultValues={dataSigning.email}
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
};
TextSignForm.displayName = "TextSignForm";
export default TextSignForm;
