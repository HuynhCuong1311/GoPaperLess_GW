import avatar from "@/assets/images/avatar.png";
import { ReactComponent as TrashIcon } from "@/assets/images/svg/trash.svg";
import AddIcon from "@mui/icons-material/Add";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import { MenuItem, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { t } from "i18next";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { InputField } from "../form";
import { AddFieldQrypto } from "./AddFieldQrypto";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { toast } from "react-toastify";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const QryptoGeneralForm = ({
  control,
  watch,
  register,
  setValue,
  unregister,
}) => {
  const { items } = watch();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const handleAddField = (type, label) => {
    const index = items.length;
    switch (type) {
      case "text":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 1);
        setValue(`items[${index}].value`, "");
        setValue(`items[${index}].remark`, "text");
        setValue(`items[${index}].mandatory_enable`, false);
        break;
      case "boldLabel":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 6);
        setValue(`items[${index}].remark`, "boldLabel");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "date":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 1);
        // setValue(
        //   `items[${index}].value`,

        //   new Date().getMonth +
        //     "/" +
        //     new Date().getDay +
        //     "/" +
        //     new Date().getFullYear()
        // );
        setValue(`items[${index}].remark`, "date");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "choice":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 7);
        setValue(`items[${index}].value`, []);
        setValue(`items[${index}].remark`, "choice");
        setValue(`items[${index}].mandatory_enable`, false);
        break;
      case "picture":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 9);
        setValue(`items[${index}].value`, "");
        setValue(`items[${index}].remark`, "picture");
        setValue(`items[${index}].file_format`, "");
        setValue(`items[${index}].file_name`, "");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "file":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 9);
        setValue(`items[${index}].value`, "");
        setValue(`items[${index}].remark`, "file");
        setValue(`items[${index}].file_format`, "");
        setValue(`items[${index}].file_name`, "");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "table":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 8);
        setValue(`items[${index}].value`, [
          {
            column_1: "",
            column_2: "",
            column_3: "",
            text: "",
          },
        ]);
        setValue(`items[${index}].remark`, "table");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "pictureLabel":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 11);
        setValue(`items[${index}].value`, {
          label_1: "",
          label_2: "",
          label_3: "",
          label_4: "",
          file_data: "",
        });
        setValue(`items[${index}].remark`, "pictureLabel");
        setValue(`items[${index}].file_format`, "");
        setValue(`items[${index}].file_name`, "");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "url":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 10);
        setValue(`items[${index}].value.url`, "");
        setValue(`items[${index}].value.label`, "");
        setValue(`items[${index}].remark`, "url");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
    }
  };
  const removeField = (index) => {
    unregister(`items.${index}`);
  };
  return (
    <>
      <Box>
        {items?.map((field, index) => {
          switch (field.remark) {
            case "text":
              return (
                <TextElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  control={control}
                  field={field}
                />
              );
            case "boldLabel":
              return (
                <BoldLabelElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  field={field}
                />
              );
            case "date":
              return (
                <DateElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                />
              );
            case "choice":
              return (
                <ChoiceElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                  control={control}
                  unregister={unregister}
                />
              );
            case "picture":
              return (
                <PictureElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                />
              );
            case "file":
              return (
                <FileElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                />
              );
            case "pictureLabel":
              return (
                <PictureLabelElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                  control={control}
                />
              );
            case "signer":
              return (
                <Box sx={{ my: "10px" }}>
                  <SignerElement
                    register={register}
                    index={index}
                    removeField={removeField}
                    field={field}
                    control={control}
                  />
                </Box>
              );
            case "table":
              return (
                <Box sx={{ my: "10px" }}>
                  <TableElement
                    register={register}
                    index={index}
                    removeField={removeField}
                    field={field}
                    control={control}
                    unregister={unregister}
                    setValue={setValue}
                  />
                </Box>
              );
            case "url":
              return (
                <UrlElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  control={control}
                  field={field}
                />
              );
          }
        })}
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
        >
          <AddRoundedIcon />
          {t("arrangement.add_element")}
        </Button>
      </Box>
      {open && (
        <AddFieldQrypto
          open={open}
          setOpen={setOpen}
          handleAddField={handleAddField}
        />
      )}
    </>
  );
};
QryptoGeneralForm.propTypes = {
  control: PropTypes.object,
  watch: PropTypes.func,
  register: PropTypes.func,
  setValue: PropTypes.func,
  unregister: PropTypes.func,
};
const TextElement = ({ register, index, removeField, control, field }) => {
  return (
    <Box key={index} sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
              padding: "0",
            },
            "& .Mui-disabled": {
              WebkitTextFillColor: "#1F2937 !important",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
          disabled={field.mandatory_enable}
        />
        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
      <InputField
        label=""
        name={`items[${index}].value`}
        control={control}
        InputLabelProps={{
          sx: {
            backgroundColor: "signingWFBackground.main",
          },
        }}
        inputProps={{
          sx: {
            py: "12px",
            borderRadius: "5px",
            backgroundColor: "signingWFBackground.main",
          },
        }}
        sx={{
          my: 0,
          height: "45px",
        }}
        disabled={field.mandatory_enable}
      />
    </Box>
  );
};
TextElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  control: PropTypes.func,
  field: PropTypes.object,
};
const BoldLabelElement = ({ register, index, removeField, field }) => {
  return (
    <Box key={index} sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 700,
              padding: "0",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
          disabled={field.mandatory_enable}
        />
        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
    </Box>
  );
};
BoldLabelElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  field: PropTypes.object,
};
const DateElement = ({ register, index, removeField, setValue, field }) => {
  return (
    <Box key={index} sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
              padding: "0",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
        />
        {/* <input
        style={{ display: "none" }}
        {...register(`items[${index}].type`)}
      /> */}
        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]} sx={{ p: 0, width: "100%" }}>
          <DatePicker
            value={field.value ? dayjs(field.value, "DD/MM/YYYY") : null}
            // slotProps={{ textField: { placeholder: "cuong" } }}
            sx={{
              padding: 0,
              width: "100%",
              "& .MuiInputBase-input": { py: 0 },
              backgroundColor: "signingWFBackground.main",
            }}
            format={"DD/MM/YYYY"}
            // onChange={(newValue) => setDateValue(newValue)}
            onChange={(newValue) => {
              setValue(
                `items[${index}].value`,
                dayjs(newValue.$d).format("DD/MM/YYYY")
              );
            }}
            disabled={field.mandatory_enable}
          />
        </DemoContainer>
        {/* <DatePicker
          sx={{ width: "100%", backgroundColor: "signingWFBackground.main" }}
          value={dayjs(field.value)}
          onChange={(newValue) => {
            setValue(
              `items[${index}].value`,
              newValue.month() +
                1 +
                "/" +
                newValue.date() +
                "/" +
                newValue.year()
            );
          }}
          disabled={field.mandatory_enable}
        /> */}
      </LocalizationProvider>
    </Box>
  );
};
DateElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  field: PropTypes.object,
  setValue: PropTypes.func,
};
const ChoiceElement = ({
  register,
  index,
  removeField,
  setValue,
  field,
  control,
  unregister,
}) => {
  return (
    <Box key={index} sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
              padding: "0",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
          disabled={field.mandatory_enable}
        />
        {/* <input
        style={{ display: "none" }}
        {...register(`items[${index}].type`)}
      /> */}
        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
      <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
        <Box sx={{ display: "flex ", gap: "10px" }}>
          <Select
            labelId="demo-simple-select1-label-step1"
            id="demo-simple-select-step1"
            value={
              field?.value?.filter((item) => item?.choice === true)
                ? field?.value?.filter((item) => item?.choice === true)[0]
                    ?.element
                : ""
            }
            onChange={(e) => {
              field.value.map((item, i) => {
                if (item.element === e.target.value) {
                  setValue(`items[${index}].value[${i}].choice`, true);
                } else {
                  setValue(`items[${index}].value[${i}].choice`, false);
                }
              });
            }}
            sx={{
              maxWidth: "371px",
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
                display: "flex",
              },
              backgroundColor: "signingWFBackground.main",
              width: "100%",
            }}
          >
            {field.value?.map((item, i) => {
              return (
                item &&
                item.element !== "" && (
                  <MenuItem key={i} value={item.element}>
                    {item.element}
                  </MenuItem>
                )
              );
            })}
          </Select>
          <Button
            variant="contained"
            onClick={() => {
              if (field.value) {
                setValue(`items[${index}].value`, [
                  ...field.value,
                  { element: "", choice: false },
                ]);
              } else {
                setValue(`items[${index}].value`, [
                  { element: "", choice: false },
                ]);
              }
            }}
          >
            <AddIcon />
          </Button>
        </Box>

        {field.value?.map((values, i) => {
          return (
            values && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                  gap: "10px",
                }}
                key={i}
              >
                <InputField
                  label=""
                  name={`items[${index}].value[${i}].element`}
                  control={control}
                  InputLabelProps={{
                    sx: {
                      backgroundColor: "signingWFBackground.main",
                    },
                  }}
                  inputProps={{
                    sx: {
                      py: "12px",
                      borderRadius: "5px",
                      backgroundColor: "signingWFBackground.main",
                    },
                  }}
                  sx={{ my: 0, height: "45px" }}
                />
                <Button
                  variant=""
                  onClick={() => {
                    unregister(`items.[${index}].value.[${i}]`);
                  }}
                  sx={{ color: "#F24E1E" }}
                >
                  <CloseRoundedIcon />
                </Button>
              </Box>
            )
          );
        })}
      </FormControl>
    </Box>
  );
};
ChoiceElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  field: PropTypes.object,
  setValue: PropTypes.func,
  control: PropTypes.func,
  unregister: PropTypes.func,
};
const SignerElement = ({ register, index, removeField, field, control }) => {
  return (
    <Box
      key={index}
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: "6px",
        padding: "5px",
        margin: "10px -6px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
              padding: "0",
            },
            "& .Mui-disabled": {
              WebkitTextFillColor: "#1F2937 !important",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
          disabled={field.mandatory_enable}
        />
        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {field.value?.map((values, i) => {
          if (
            Object.values(values).length > 1 &&
            Object.values(values)[Object.values(values).length - 1] !==
              undefined
          ) {
            return (
              <Grid container spacing={1} key={i} sx={{ marginBottom: "10px" }}>
                <Grid item xs={5.3}>
                  <InputField
                    label=""
                    name={`items[${index}].value[${i}].column_${i + 1}`}
                    control={control}
                    InputLabelProps={{
                      sx: {
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    inputProps={{
                      sx: {
                        py: "12px",
                        borderRadius: "5px",
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    sx={{ my: 0, height: "45px" }}
                    disabled={field.mandatory_enable}
                  />
                </Grid>
                <Grid item xs={5.3}>
                  <InputField
                    label=""
                    name={`items[${index}].value[${i}].column_${i + 2}`}
                    control={control}
                    InputLabelProps={{
                      sx: {
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    inputProps={{
                      sx: {
                        py: "12px",
                        borderRadius: "5px",
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    sx={{ my: 0, height: "45px" }}
                    disabled={field.mandatory_enable}
                  />
                </Grid>
                <Grid
                  item
                  xs={1.4}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #ccc",
                      height: "44px",
                      borderRadius: "5px",
                      width: "48px",
                    }}
                  >
                    <Tooltip title={"Signing Time"} placement="top">
                      <WatchLaterRoundedIcon sx={{ color: "#6B7280" }} />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    label=""
                    name={`items[${index}].value[${i}].text`}
                    control={control}
                    InputLabelProps={{
                      sx: {
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    inputProps={{
                      sx: {
                        py: "12px",
                        borderRadius: "5px",
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    sx={{ my: 0, height: "45px" }}
                    disabled={field.mandatory_enable}
                  />
                </Grid>
              </Grid>
            );
          }
        })}
      </Box>
    </Box>
  );
};
SignerElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  field: PropTypes.object,
  setValue: PropTypes.func,
  control: PropTypes.func,
  unregister: PropTypes.func,
};
const TableElement = ({
  register,
  index,
  removeField,
  field,
  control,
  unregister,
  setValue,
}) => {
  return (
    <Box
      key={index}
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: "6px",
        padding: "5px",
        margin: "10px -6px",
        // margin: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
              padding: "0",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
          disabled={field.mandatory_enable}
        />
        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {field.value?.map((values, i) => {
          return (
            <Box
              sx={{ display: "flex", gap: "5px", marginBottom: "10px" }}
              key={i}
            >
              <Box>
                <Grid
                  container
                  spacing={1}
                  key={i}
                  sx={{ marginBottom: "10px" }}
                >
                  <Grid item xs={4}>
                    <InputField
                      label=""
                      name={`items[${index}].value[${i}].column_${1}`}
                      control={control}
                      InputLabelProps={{
                        sx: {
                          backgroundColor: "signingWFBackground.main",
                        },
                      }}
                      inputProps={{
                        sx: {
                          py: "12px",
                          borderRadius: "5px",
                          backgroundColor: "signingWFBackground.main",
                        },
                      }}
                      sx={{ my: 0, height: "45px" }}
                      disabled={field.mandatory_enable}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputField
                      label=""
                      name={`items[${index}].value[${i}].column_${2}`}
                      control={control}
                      InputLabelProps={{
                        sx: {
                          backgroundColor: "signingWFBackground.main",
                        },
                      }}
                      inputProps={{
                        sx: {
                          py: "12px",
                          borderRadius: "5px",
                          backgroundColor: "signingWFBackground.main",
                        },
                      }}
                      sx={{ my: 0, height: "45px" }}
                      disabled={field.mandatory_enable}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputField
                      label=""
                      name={`items[${index}].value[${i}].column_${3}`}
                      control={control}
                      InputLabelProps={{
                        sx: {
                          backgroundColor: "signingWFBackground.main",
                        },
                      }}
                      inputProps={{
                        sx: {
                          py: "12px",
                          borderRadius: "5px",
                          backgroundColor: "signingWFBackground.main",
                        },
                      }}
                      sx={{ my: 0, height: "45px" }}
                      disabled={field.mandatory_enable}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputField
                      label=""
                      name={`items[${index}].value[${i}].text`}
                      control={control}
                      InputLabelProps={{
                        sx: {
                          backgroundColor: "signingWFBackground.main",
                        },
                      }}
                      inputProps={{
                        sx: {
                          py: "12px",
                          borderRadius: "5px",
                          backgroundColor: "signingWFBackground.main",
                        },
                      }}
                      sx={{ my: 0, height: "45px" }}
                      disabled={field.mandatory_enable}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Button
                variant=""
                onClick={() => {
                  unregister(`items.[${index}].value.[${i}]`);
                }}
                sx={{ color: "#F24E1E" }}
              >
                <CloseRoundedIcon />
              </Button>
            </Box>
          );
        })}
      </Box>
      <Button
        onClick={() => {
          const index1 = field.value.length;
          setValue(`items[${index}].value[${index1}]`, {
            column_1: "",
            column_2: "",
            column_3: "",
            text: "",
          });
        }}
        variant="contained"
        sx={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
      >
        <AddRoundedIcon />
        {t("arrangement.addTableRow")}
      </Button>
    </Box>
  );
};
TableElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  field: PropTypes.object,
  setValue: PropTypes.func,
  control: PropTypes.func,
  unregister: PropTypes.func,
};
const PictureElement = ({ register, index, removeField, setValue, field }) => {
  const readFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      if (file.type.split("/")[0] === "image") {
        setValue(`items[${index}].file_format`, file.type);
        setValue(`items[${index}].file_name`, file.name);
        setValue(
          `items[${index}].value`,
          e.target.result.replace(`data:${file.type};base64,`, "")
        );
      } else {
        toast.error("Please upload image file");
      }
    };
  };
  return (
    <Box key={index} sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
              padding: "0",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
        />

        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
      <Box>
        <Box
          sx={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px auto 0",
            backgroundColor: "#E5E7EB",
          }}
        >
          {field.value && (
            <img
              style={{ width: "auto", height: "100%" }}
              src={`data:${field.file_format};base64,${field.value}`}
            />
          )}
          {!field.value && (
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "100%",
              }}
              alt=""
              src={avatar}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{ borderRadius: "50px" }}
            startIcon={<FileUploadOutlinedIcon />}
            role={undefined}
            component="label"
            tabIndex={-1}
          >
            {t("arrangement.upload")}
            <VisuallyHiddenInput
              accept="image/*"
              type="file"
              onChange={(e) => {
                readFile(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </Button>
          <Typography
            variant="body"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {field.file_name || t("arrangement.noFileChosen")}
          </Typography>
          {field.file_name && (
            <Button
              variant=""
              onClick={() => {
                setValue(`items[${index}].file_format`, "");
                setValue(`items[${index}].file_name`, "");
                setValue(`items[${index}].value`, "");
              }}
              sx={{ color: "#F24E1E" }}
            >
              <CloseRoundedIcon />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
PictureElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  field: PropTypes.object,
  setValue: PropTypes.func,
  control: PropTypes.func,
  unregister: PropTypes.func,
};
const PictureLabelElement = ({
  register,
  index,
  removeField,
  setValue,
  field,
  control,
}) => {
  const readFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      if (file.type.split("/")[0] === "image") {
        setValue(`items[${index}].file_format`, file.type);
        setValue(`items[${index}].file_name`, file.name);
        setValue(
          `items[${index}].value.file_data`,
          e.target.result.replace(`data:${file.type};base64,`, "")
        );
      } else {
        toast.error("Please upload image file");
      }
    };
  };
  return (
    <Box key={index} sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
              padding: "0",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
        />

        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
      <Box>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Box
            sx={{
              width: "150px",
              height: "auto",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
              backgroundColor: "#E5E7EB",
              flexGrow: "1",
            }}
          >
            {field.value.file_data && (
              <img
                style={{ width: "100%", height: "100%" }}
                src={`data:${field.file_format};base64,${field.value.file_data}`}
              />
            )}
            {!field.value.file_data && (
              <Box
                component="img"
                sx={{
                  width: "100%",
                  height: "100%",
                }}
                alt=""
                src={avatar}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              flexGrow: "1",
            }}
          >
            <InputField
              label=""
              name={`items[${index}].value.label_1`}
              control={control}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  py: "12px",
                  borderRadius: "5px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              sx={{ my: 0, height: "45px" }}
            />
            <InputField
              label=""
              name={`items[${index}].value.label_2`}
              control={control}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  py: "12px",
                  borderRadius: "5px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              sx={{ my: 0, height: "45px" }}
            />
            <InputField
              label=""
              name={`items[${index}].value.label_3`}
              control={control}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  py: "12px",
                  borderRadius: "5px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              sx={{ my: 0, height: "45px" }}
            />
            <InputField
              label=""
              name={`items[${index}].value.label_4`}
              control={control}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  py: "12px",
                  borderRadius: "5px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              sx={{ my: 0, height: "45px" }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{ borderRadius: "50px" }}
            startIcon={<FileUploadOutlinedIcon />}
            role={undefined}
            component="label"
            tabIndex={-1}
          >
            {t("arrangement.upload")}
            <VisuallyHiddenInput
              accept="image/*"
              type="file"
              onChange={(e) => {
                readFile(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </Button>
          <Typography
            variant="body"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {field.file_name || t("arrangement.noFileChosen")}
          </Typography>
          {field.file_name && (
            <Button
              variant=""
              onClick={() => {
                setValue(`items[${index}].file_format`, "");
                setValue(`items[${index}].file_name`, "");
                setValue(`items[${index}].value`, "");
              }}
              sx={{ color: "#F24E1E" }}
            >
              <CloseRoundedIcon />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
PictureLabelElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  field: PropTypes.object,
  setValue: PropTypes.func,
  control: PropTypes.func,
  unregister: PropTypes.func,
};
const FileElement = ({ register, index, removeField, setValue, field }) => {
  const readFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      setValue(`items[${index}].file_format`, file.type);
      setValue(`items[${index}].file_name`, file.name);
      setValue(
        `items[${index}].value`,
        e.target.result.replace(`data:${file.type};base64,`, "")
      );
    };
  };
  return (
    <Box key={index} sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
              padding: "0",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
        />

        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
      <Box>
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{ borderRadius: "50px" }}
            startIcon={<FileUploadOutlinedIcon />}
            role={undefined}
            component="label"
            tabIndex={-1}
          >
            Upload
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => readFile(e.target.files[0])}
              accept="image/*,application/pdf"
            />
          </Button>
          <Typography
            variant="body"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {field.file_name || "No File Chosen"}
          </Typography>
          {field.file_name && (
            <Button
              variant=""
              onClick={() => {
                setValue(`items[${index}].file_format`, "");
                setValue(`items[${index}].file_name`, "");
                setValue(`items[${index}].value`, "");
              }}
              sx={{ color: "#F24E1E" }}
            >
              <CloseRoundedIcon />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
FileElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  field: PropTypes.object,
  setValue: PropTypes.func,
  control: PropTypes.func,
  unregister: PropTypes.func,
};
const UrlElement = ({ register, index, removeField, control }) => {
  return (
    <Box key={index} sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              height: "auto",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
              padding: "0",
            },
          }}
          inputProps={{
            maxLength: 50,
          }}
          fullWidth
          {...register(`items[${index}].field`)}
        />
        {/* <input
          style={{ display: "none" }}
          {...register(`items[${index}].type`)}
        /> */}
        <Button
          sx={{ color: "#F24E1E", padding: 0 }}
          onClick={() => removeField(index)}
        >
          <TrashIcon />
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ marginBottom: "5px" }}>
          Link Text
        </Typography>
        <InputField
          label=""
          name={`items[${index}].value.label`}
          control={control}
          InputLabelProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
          inputProps={{
            sx: {
              py: "12px",
              borderRadius: "5px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
          sx={{ mt: 0, mb: "10px", height: "45px" }}
        />
        <Typography variant="h6" sx={{ marginBottom: "5px" }}>
          URL
        </Typography>
        <InputField
          label=""
          name={`items[${index}].value.url`}
          control={control}
          InputLabelProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
          inputProps={{
            sx: {
              py: "12px",
              borderRadius: "5px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
          sx={{ my: 0, height: "45px" }}
        />
      </Box>
    </Box>
  );
};
UrlElement.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  removeField: PropTypes.func,
  field: PropTypes.object,
  setValue: PropTypes.func,
  control: PropTypes.func,
  unregister: PropTypes.func,
};
