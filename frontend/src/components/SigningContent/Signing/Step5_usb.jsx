import { ReactComponent as CardIcon } from "@/assets/images/svg/card.svg";
import { convertTime } from "@/utils/commonFunction";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ToggleButtonField } from "../../form";

const ToggleButtonStyle = styled(ToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    border: "2px solid #0f6dca !important",
  },
  "&:not(.Mui-selected)": {
    color: "#111",
  },
  marginBottom: "4px",
  border: "1px solid gray !important",
  borderRadius: "10px",
});

export const Step5_usb = forwardRef(
  ({ listCertificate, onStepSubmit }, ref) => {
    // console.log("tokenDetails: ", tokenDetails);
    // console.log("listCertificate: ", listCertificate);
    const schema = yup.object().shape({
      certificate: yup.number().required("Please Select Certificate"),
    });

    // eslint-disable-next-line no-unused-vars
    const { control, handleSubmit } = useForm({
      defaultValues: {
        certificate: null,
      },
      resolver: yupResolver(schema),
    });

    const content = listCertificate?.map((value, index) => (
      <ToggleButtonStyle
        sx={{
          textTransform: "capitalize",
          backgroundColor: "signingWFBackground.main",
        }}
        value={index}
        aria-label="list"
        key={index}
        onMouseDown={(e) => {
          if (e.detail === 2) {
            e.preventDefault();
            handleSubmit(handleFormSubmit)();
          }
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
          <Box width={50} height={50} mx={1}>
            <CardIcon />
          </Box>

          <Box flexGrow={1} textAlign="left">
            <Typography fontWeight="bold" fontSize="14px">
              {value.subject.commonName}
            </Typography>
            <Typography fontSize="14px">
              {/* {t("usb.usb9")} */}
              Issuer: {value.issuer.commonName}
            </Typography>
            <Typography fontSize="14px">
              Valid: {convertTime(value.validFrom).split(" ")[0]} to{" "}
              {convertTime(value.validTo).split(" ")[0]}
            </Typography>
          </Box>
        </Stack>
      </ToggleButtonStyle>
    ));

    const handleFormSubmit = (data) => {
      // console.log("data: ", data);
      onStepSubmit(data);
    };

    return (
      <Box
        component="form"
        ref={ref}
        onSubmit={handleSubmit(handleFormSubmit)}
        // sx={{ minWidth: 200 }}
      >
        <Box width={"100%"}>
          {listCertificate?.length === 0 ? (
            <Alert severity="error">No Certificate found!</Alert>
          ) : (
            <ToggleButtonField
              name="certificate"
              control={control}
              content={content}
            />
          )}
        </Box>
      </Box>
    );
  }
);

Step5_usb.propTypes = {
  listCertificate: PropTypes.array,
  onStepSubmit: PropTypes.func,
};
Step5_usb.displayName = "Step5";
export default Step5_usb;
