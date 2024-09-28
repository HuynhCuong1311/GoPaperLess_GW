import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InputField, SelectField } from "../../form";

export const Step6_eid = forwardRef(({ onStepSubmit, data }, ref) => {
  const schema = yup.object().shape({
    criteria: yup.string().required("Please Select Signing Method"),

    personalCode: yup
      .string()
      .test(
        "personalCode",
        `Must be from 12 to 16 characters `,
        (val) => val.length >= 12 && val.length <= 16
      )
      .required("This field is required."),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      criteria: "CITIZEN-IDENTITY-CARD",
      personalCode: "",
    },
    resolver: yupResolver(schema),
  });

  const data1 = data?.map((item) => (
    <MenuItem key={item.id} value={item.name}>
      {item.remark}
    </MenuItem>
  ));

  const handleFormSubmit = (data) => {
    // console.log("data: ", data);
    onStepSubmit(data);
  };

  return (
    <Stack
      component="form"
      ref={ref}
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ minWidth: 400, height: 300 }}
    >
      <Box mb={4} width={"100%"}>
        <SelectField
          name="criteria"
          control={control}
          label="Signing method"
          content={data1}
          //   onChange={handleChange1}
          sx={{
            backgroundColor: "signingWFBackground.main",
          }}
        />
      </Box>

      <Box width={"100%"} flexGrow={1}>
        <InputField
          label="Code"
          name="personalCode"
          control={control}
          InputLabelProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
          inputProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
        />
      </Box>

      {/* {errorApi && (
    <Box width={"100%"}>
      <Alert severity="error">{errorApi}</Alert>
    </Box>
  )} */}
    </Stack>
  );
});

Step6_eid.propTypes = {
  onStepSubmit: PropTypes.func,
  data: PropTypes.array,
};
Step6_eid.displayName = "Step6";
export default Step6_eid;
