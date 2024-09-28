import { ReactComponent as CardIcon } from "@/assets/images/svg/card.svg";
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

export const Step4 = forwardRef(({ data, onStepSubmit }, ref) => {
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
  //   console.log("data: ", data);

  // if (data?.length === 0)
  //   return <Alert severity="error">No Certificate found!</Alert>;

  const content = data?.map((value, index) => (
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
        <Box width={50} height={50} ml={2} mr={6}>
          <CardIcon />
        </Box>

        <Box flexGrow={1} textAlign="left">
          <Typography fontWeight="bold" fontSize="14px">
            {value.subject}
          </Typography>
          <Typography fontSize="14px">
            {/* {t("usb.usb9")} */}
            Issuer: {value.issuer}
          </Typography>
          <Typography fontSize="14px">
            Valid: {value.validFrom.split(" ")[0]} to{" "}
            {value.validTo.split(" ")[0]}
          </Typography>
        </Box>
      </Stack>
    </ToggleButtonStyle>
  ));

  const handleFormSubmit = (data) => {
    onStepSubmit(data);
  };

  return (
    <Box
      component="form"
      ref={ref}
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ minWidth: 400 }}
    >
      <Box width={"100%"}>
        {data?.length === 0 ? (
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
});

Step4.propTypes = {
  data: PropTypes.array,
  onStepSubmit: PropTypes.func,
};
Step4.displayName = "Step4";
export default Step4;
