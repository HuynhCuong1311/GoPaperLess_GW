import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InputField, PhoneInputField, SelectField } from "../../form";

export const Step3_smartid = forwardRef(
  ({ onStepSubmit, data, dialCode, errorApi }, ref) => {
    const schema = yup.object().shape({
      criteria: yup.string().required("Please Select Signing Method"),

      personalCode: yup.string().when("criteria", (criteria, schema) => {
        if (
          criteria.includes("CITIZEN-IDENTITY-CARD") ||
          criteria.includes("PERSONAL-ID") ||
          criteria.includes("PASSPORT-ID")
        ) {
          return schema
            .required("This field is required.")
            .length(12, "This field must be at 12 character.");
        }
      }),
      phoneNumber: yup.string().when("criteria", (criteria, schema) => {
        if (criteria.includes("PHONE")) {
          return schema
            .required("This field is required.")
            .length(11, "This field must be at 11 character.");
        }
      }),
    });

    // eslint-disable-next-line no-unused-vars
    const { control, handleSubmit, reset } = useForm({
      defaultValues: {
        criteria: "PHONE",
        personalCode: "",
        phoneNumber: "",
      },
      resolver: yupResolver(schema),
    });

    const [isPhoneSelect, setIsPhoneSelect] = useState(true);

    const data1 = data?.map((item) => (
      <MenuItem key={item.id} value={item.name}>
        {item.remark}
      </MenuItem>
    ));

    // console.log("error: ", errorApi);

    const handleChange1 = (event) => {
      // console.log("event: ", event.target.value);
      if (event.target.value === "PHONE") {
        reset({
          criteria: event.target.value,
          personalCode: "",
        });
        setIsPhoneSelect(true);
      } else {
        reset({
          criteria: event.target.value,
          phoneNumber: "",
        });
        setIsPhoneSelect(false);
      }
    };

    const onchange = (phone, country) => {
      // console.log("data: ", phone);
      // console.log("event: ", country);
      dialCode.current = country.dialCode;
    };

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
            onChange={handleChange1}
            sx={{
              backgroundColor: "signingWFBackground.main",
            }}
            //   sx={{
            //     "& .MuiListItemSecondaryAction-root": {
            //       right: "30px",
            //       display: "flex",
            //     },
            //   }}
          />
        </Box>

        <Box
          width={"100%"}
          display={isPhoneSelect ? "block" : "none"}
          // mt={6}
          flexGrow={1}
        >
          <PhoneInputField
            label=""
            name="phoneNumber"
            control={control}
            onChange={onchange}
          />
        </Box>
        {/* ) : ( */}
        <Box
          width={"100%"}
          display={isPhoneSelect ? "none" : "block"}
          flexGrow={1}
        >
          <InputField
            label=""
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
        {/* <FormHelperText
          error={!!errorApi}
          sx={{
            color: "red",
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {errorApi}
        </FormHelperText> */}
        {errorApi && (
          <Box width={"100%"}>
            <Alert severity="error">{errorApi}</Alert>
          </Box>
        )}
      </Stack>
    );
  }
);

Step3_smartid.propTypes = {
  onStepSubmit: PropTypes.func,
  data: PropTypes.array,
  dialCode: PropTypes.object,
  errorApi: PropTypes.string,
};
Step3_smartid.displayName = "Step3";
export default Step3_smartid;
