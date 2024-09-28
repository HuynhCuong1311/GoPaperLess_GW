import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { InputField } from "../form";

export const CheckBoxSettingForm = ({
  participants,
  checkBoxData,
  control,
  type,
  remark,
  setRemark,
  checked,
  setChecked,
  required,
  setRequired,
  radio,
  setRadio,
  multipleChecked,
  setMultipleChecked,
  styles,
  alignment,
  setAlignment,
}) => {
  const { t } = useTranslation();

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <Box>
      <Box mb="10px">
        <Typography variant="h6"> {t("modal.camera_1")}</Typography>
      </Box>

      <TableContainer>
        <Table
          sx={{
            tableLayout: "fixed",
            mb: "10px",
            // borderCollapse: "separate",
            // borderSpacing: "5px",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow sx={{ height: "15px" }}>
              <TableCell sx={{ width: "306px", p: 0, border: "none" }} />
              <TableCell
                sx={{ p: 0, border: "none", fontWeight: 500 }}
                align="center"
              >
                <Typography variant="h4" color="#475569" height="15px">
                  {t("0-common.allowed")}
                </Typography>
              </TableCell>
              <TableCell
                sx={{ p: 0, border: "none", fontWeight: 500 }}
                align="center"
              >
                <Typography variant="h4" color="#475569" height="15px">
                  {t("0-common.required")}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  lineHeight: "24px",
                  mb: "5px",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    p: 0,
                    border: "none",
                    fontWeight: 500,
                    color: "#1F2937",
                  }}
                >
                  {participant.lastName} {participant.firstName}
                </TableCell>
                <TableCell align="center" sx={{ p: 0, border: "none" }}>
                  <Checkbox
                    size="small"
                    sx={{ height: "24px" }}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (!remark.includes(participant.signerId))
                          setRemark([...remark, participant.signerId]);
                      } else {
                        setRemark(
                          remark.filter((id) => id !== participant.signerId)
                        );
                        setRequired(
                          required.filter((id) => id !== participant.signerId)
                        );
                      }
                    }}
                    checked={remark?.includes(participant.signerId)}
                  />
                </TableCell>

                <TableCell align="center" sx={{ p: 0, border: "none" }}>
                  <Checkbox
                    size="small"
                    sx={{ height: "24px" }}
                    // disabled={
                    //   !remark?.find((remark) => remark === participant.signerId)
                    // }
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (!required.includes(participant.signerId))
                          setRequired([...required, participant.signerId]);
                      } else {
                        setRequired(
                          required.filter((id) => id !== participant.signerId)
                        );
                      }
                    }}
                    checked={required?.includes(participant.signerId)}
                    disabled={
                      remark.includes(participant.signerId) ? false : true
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={"10px"} sx={{ mb: "10px" }}>
        <Typography variant="h6">{t("0-common.items")} </Typography>
        <Chip
          label={checkBoxData.length}
          variant="outlined"
          sx={{
            height: "18px",
            borderColor: "#BFDBFE",
            color: "#3B82F6",
            "& .MuiChip-label": {
              padding: "0 3px",
            },
          }}
        />
      </Stack>
      {type !== "radio" && (
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => {
                setMultipleChecked(e.target.checked);
                setChecked(checked.map(() => false));
              }}
              checked={multipleChecked}
              size="small"
            />
          }
          label={
            <Typography variant="h6">{t("0-common.multiSelect")}</Typography>
          }
          sx={{ height: "20px", mb: "10px" }}
        />
      )}

      <TableContainer sx={{ border: "1px solid #E5E7EB" }}>
        <RadioGroup value={radio} onChange={(e) => setRadio(e.target.value)}>
          <Table
            sx={{
              "& th,td": {
                padding: "0 10px",
              },
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                <TableCell align="center">
                  {type !== "radio" && multipleChecked && (
                    <Checkbox
                      size="small"
                      sx={{
                        padding: 0,
                      }}
                      onChange={(e) => {
                        e.target.checked
                          ? setChecked(checked.map(() => true))
                          : setChecked(checked.map(() => false));
                      }}
                      checked={
                        checked.some((item) => item === false) ? false : true
                      }
                    />
                  )}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    // width: "80px",
                    height: "30px",
                    padding: "0 0 0 16px",
                    color: "#6B7280",
                    fontSize: "12px",
                    fontWeight: "500",
                    background: "#F9FAFB",
                  }}
                >
                  {t("0-common.text")}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    // width: "80px",
                    height: "30px",
                    padding: "0px",
                    color: "#6B7280",
                    fontSize: "12px",
                    fontWeight: "500",
                    background: "#F9FAFB",
                  }}
                >
                  {t("0-common.value")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {type !== "radio" &&
                checkBoxData.map((checkBox, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" align="center" scope="row">
                      <Checkbox
                        size="small"
                        sx={{
                          padding: 0,
                        }}
                        checkedIcon={
                          <Box
                            sx={{
                              background:
                                styles.checkedStyle[styles.checkedStyles]
                                  .background_rgbcode,
                              border: `1px solid ${
                                styles.checkedStyle[styles.checkedStyles]
                                  .border_rgbcode
                              }`,
                              borderRadius: "4px",
                              width: "16px",
                              height: "16px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M11.1436 3.47369C11.2033 3.41276 11.2745 3.36436 11.3532 3.33131C11.4318 3.29827 11.5163 3.28125 11.6016 3.28125C11.6869 3.28125 11.7714 3.29827 11.85 3.33131C11.9287 3.36436 12 3.41276 12.0597 3.47369C12.3099 3.72657 12.3134 4.13519 12.0684 4.39244L6.89456 10.5087C6.83581 10.5732 6.76453 10.625 6.68506 10.661C6.60559 10.6971 6.51962 10.7165 6.43239 10.7181C6.34516 10.7198 6.25851 10.7036 6.17775 10.6706C6.09698 10.6376 6.0238 10.5884 5.96268 10.5262L2.81443 7.33594C2.69301 7.21212 2.625 7.04561 2.625 6.87219C2.625 6.69877 2.69301 6.53227 2.81443 6.40844C2.87415 6.34751 2.94542 6.29911 3.02407 6.26606C3.10272 6.23302 3.18718 6.216 3.27249 6.216C3.35781 6.216 3.44226 6.23302 3.52092 6.26606C3.59957 6.29911 3.67084 6.34751 3.73056 6.40844L6.40106 9.11482L11.1261 3.49294C11.1315 3.48618 11.1373 3.47975 11.1436 3.47369Z"
                                fill={
                                  styles.checkedStyle[styles.checkedStyles]
                                    .checked_rgbcode
                                }
                              />
                            </svg>
                          </Box>
                        }
                        icon={
                          <Box
                            sx={{
                              background:
                                styles.uncheckedStyle[styles.uncheckedStyles]
                                  .background_rgbcode,
                              borderRadius: "4px",
                              border: `1px solid ${
                                styles.uncheckedStyle[styles.uncheckedStyles]
                                  .border_rgbcode
                              }`,
                              color:
                                styles.uncheckedStyle[styles.uncheckedStyles]
                                  .checked_rgbcode,
                              width: "16px",
                              height: "16px",
                            }}
                          ></Box>
                        }
                        onChange={(e) => {
                          if (multipleChecked) {
                            const currentChecked = [...checked];
                            currentChecked[index] = e.target.checked;
                            setChecked(currentChecked);
                          } else {
                            let currentChecked = [...checked].map((status, i) =>
                              index === i ? e.target.checked : false
                            );
                            setChecked(currentChecked);
                          }
                        }}
                        checked={checked[index]}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        height: "30px",
                        padding: "0 0 0 16px",
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      }}
                      type="text"
                    >
                      <InputField
                        name={`checkBoxData[${index}].text_next_to`}
                        control={control}
                        InputLabelProps={{
                          sx: {
                            background: "none",
                            "& .MuiInputBase-input": {
                              padding: "0",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiInputBase-root": {
                              height: "30px",
                            },
                            color: "#1F2937",
                            fontSize: "14px",
                            fontWeight: "500",
                          },
                        }}
                        // inputProps={{
                        //   sx: {},
                        // }}
                        sx={{
                          my: 0,
                          height: "30px",

                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiInputBase-input": {
                            padding: 0,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        height: "30px",
                        padding: "0px",
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      }}
                    >
                      <InputField
                        label=""
                        name={`checkBoxData[${index}].text_next_to`}
                        control={control}
                        InputLabelProps={{
                          sx: {
                            background: "none",
                            "& .MuiInputBase-input": {
                              padding: "0",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiInputBase-root": {
                              height: "30px",
                            },
                            color: "#1F2937",
                            fontSize: "14px",
                            fontWeight: "500",
                          },
                        }}
                        inputProps={{
                          readOnly: true,
                          sx: {},
                        }}
                        sx={{
                          my: 0,
                          height: "30px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiInputBase-input": {
                            padding: 0,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {type === "radio" &&
                checkBoxData.map((checkBox, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" align="center" scope="row">
                      <Radio
                        size="small"
                        sx={{
                          padding: 0,
                        }}
                        checkedIcon={
                          <Box
                            sx={{
                              background:
                                styles.checkedStyle[styles.checkedStyles]
                                  .background_rgbcode,
                              borderRadius: "50%",
                              border: `1px solid ${
                                styles.checkedStyle[styles.checkedStyles]
                                  .border_rgbcode
                              }`,
                              width: "16px",
                              height: "16px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <circle
                                cx="4"
                                cy="4"
                                r="3.5"
                                fill={
                                  styles.checkedStyle[styles.checkedStyles]
                                    .checked_rgbcode
                                }
                              />
                            </svg>
                          </Box>
                        }
                        icon={
                          <Box
                            sx={{
                              background:
                                styles.uncheckedStyle[styles.uncheckedStyles]
                                  .background_rgbcode,
                              borderRadius: "50%",
                              border: `1px solid ${
                                styles.uncheckedStyle[styles.uncheckedStyles]
                                  .border_rgbcode
                              }`,
                              width: "16px",
                              height: "16px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          ></Box>
                        }
                        value={checkBox.field_name}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <InputField
                        label=""
                        name={`checkBoxData[${index}].text_next_to`}
                        control={control}
                        InputLabelProps={{
                          sx: {
                            backgroundColor: "signingWFBackground.main",
                          },
                        }}
                        // inputProps={{
                        //   sx: {},
                        // }}
                        sx={{
                          my: 0,
                          height: "30px",

                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiInputBase-input": {
                            padding: 0,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <InputField
                        label=""
                        name={`checkBoxData[${index}].text_next_to`}
                        control={control}
                        InputLabelProps={{
                          sx: {
                            backgroundColor: "signingWFBackground.main",
                          },
                        }}
                        inputProps={{
                          readOnly: true,
                          sx: {},
                        }}
                        sx={{
                          my: 0,
                          height: "30px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiInputBase-input": {
                            padding: 0,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </RadioGroup>
      </TableContainer>
      <Box
        sx={{
          margin: "10px 0",
          display: "grid",
          gridTemplateColumns: "auto auto",
          gap: "20px",
        }}
      >
        <Box>
          <Typography variant="h6" mb={"10px"}>
            {/* Checked Style */}
            {type === "radio"
              ? t("0-common.selected_style")
              : t("0-common.checked_style")}
          </Typography>
          {type === "radio" && (
            <Select
              fullWidth
              sx={{
                background: "#fff",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "6px",
                },
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "10px",
                  padding: "5px 10px",
                  // "& .MuiBox-root": {
                  //   marginTop: "2px",
                  // },
                },
              }}
              onChange={(e) => {
                styles.setCheckedStyles(e.target.value);
              }}
              value={styles.checkedStyles}
            >
              {styles.checkedStyle.map((style, index) => (
                <MenuItem
                  value={index}
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "10px",
                    padding: "5px 10px",
                  }}
                >
                  <Box
                    sx={{
                      background: style.background_rgbcode,
                      borderRadius: "50%",
                      border: `1px solid ${style.border_rgbcode}`,
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <circle
                        cx="4"
                        cy="4"
                        r="3.5"
                        fill={style.checked_rgbcode}
                      />
                    </svg>
                  </Box>
                  <label htmlFor="">
                    {index == 0 && "Solid Blue"}
                    {index == 1 && "Solid Green"}
                    {index == 2 && "Solid Red"}
                    {index == 3 && "Solid Black"}
                    {index == 4 && "Soft Blue"}
                    {index == 5 && "Soft Red"}
                    {index == 6 && "Soft Black"}
                  </label>
                </MenuItem>
              ))}
            </Select>
          )}
          {type !== "radio" && (
            <Select
              fullWidth
              sx={{
                background: "#fff",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "6px",
                },
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "10px",
                  padding: "5px 10px",
                  // "& .MuiBox-root": {
                  //   marginTop: "2px",
                  // },
                },
              }}
              onChange={(e) => {
                styles.setCheckedStyles(e.target.value);
              }}
              value={styles.checkedStyles}
            >
              {styles.checkedStyle.map((style, index) => (
                <MenuItem
                  value={index}
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "10px",
                    padding: "5px 10px",
                  }}
                >
                  <Box
                    sx={{
                      background: style.background_rgbcode,
                      border: `1px solid ${style.border_rgbcode}`,
                      borderRadius: "4px",
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M11.1436 3.47369C11.2033 3.41276 11.2745 3.36436 11.3532 3.33131C11.4318 3.29827 11.5163 3.28125 11.6016 3.28125C11.6869 3.28125 11.7714 3.29827 11.85 3.33131C11.9287 3.36436 12 3.41276 12.0597 3.47369C12.3099 3.72657 12.3134 4.13519 12.0684 4.39244L6.89456 10.5087C6.83581 10.5732 6.76453 10.625 6.68506 10.661C6.60559 10.6971 6.51962 10.7165 6.43239 10.7181C6.34516 10.7198 6.25851 10.7036 6.17775 10.6706C6.09698 10.6376 6.0238 10.5884 5.96268 10.5262L2.81443 7.33594C2.69301 7.21212 2.625 7.04561 2.625 6.87219C2.625 6.69877 2.69301 6.53227 2.81443 6.40844C2.87415 6.34751 2.94542 6.29911 3.02407 6.26606C3.10272 6.23302 3.18718 6.216 3.27249 6.216C3.35781 6.216 3.44226 6.23302 3.52092 6.26606C3.59957 6.29911 3.67084 6.34751 3.73056 6.40844L6.40106 9.11482L11.1261 3.49294C11.1315 3.48618 11.1373 3.47975 11.1436 3.47369Z"
                        fill={style.checked_rgbcode}
                      />
                    </svg>
                  </Box>
                  <label htmlFor="">
                    {" "}
                    {index == 0 && "Solid Blue"}
                    {index == 1 && "Solid Green"}
                    {index == 2 && "Solid Red"}
                    {index == 3 && "Solid Black"}
                    {index == 4 && "Soft Blue"}
                    {index == 5 && "Soft Red"}
                    {index == 6 && "Soft Black"}
                  </label>
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
        <Box sx={{ marginBottom: "10px" }}>
          <Typography variant="h6" mb="10px">
            {/* Unchecked Style */}
            {type === "radio"
              ? t("0-common.unselected_style")
              : t("0-common.uncheckedStyle")}
          </Typography>
          {type === "radio" && (
            <Select
              fullWidth
              sx={{
                background: "#fff",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "6px",
                },
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "10px",
                  padding: "5px 10px",
                  // "& .MuiBox-root": {
                  //   marginTop: "2px",
                  // },
                },
              }}
              onChange={(e) => {
                styles.setUncheckedStyles(e.target.value);
              }}
              value={styles.uncheckedStyles}
            >
              {styles.uncheckedStyle.map((style, index) => (
                <MenuItem
                  value={index}
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "10px",
                    padding: "5px 10px",
                  }}
                >
                  <Box
                    sx={{
                      background: style.background_rgbcode,
                      borderRadius: "50%",
                      border: `1px solid ${style.border_rgbcode}`,
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  ></Box>
                  <label htmlFor="">
                    {index == 0 && "default"}
                    {index == 1 && "disable"}
                    {index == 2 && "Outline black"}
                    {index == 3 && " Outline blue"}
                    {index == 4 && " Outline Green"}
                    {index == 5 && "Outline Red"}
                  </label>
                </MenuItem>
              ))}
            </Select>
          )}
          {type !== "radio" && (
            <Select
              fullWidth
              sx={{
                background: "#fff",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "6px",
                },
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "10px",
                  padding: "5px 10px",
                  // "& .MuiBox-root": {
                  //   marginTop: "2px",
                  // },
                },
              }}
              onChange={(e) => {
                styles.setUncheckedStyles(e.target.value);
              }}
              value={styles.uncheckedStyles}
            >
              {styles.uncheckedStyle.map((style, index) => (
                <MenuItem
                  value={index}
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "10px",
                    padding: "5px 10px",
                  }}
                >
                  <Box
                    sx={{
                      background: style.background_rgbcode,
                      borderRadius: "4px",
                      border: `1px solid ${style.border_rgbcode}`,
                      width: "16px",
                      height: "16px",
                    }}
                  ></Box>
                  <label htmlFor="">
                    {index == 0 && "default"}
                    {index == 1 && "disable"}
                    {index == 2 && "Outline black"}
                    {index == 3 && " Outline blue"}
                    {index == 4 && " Outline Green"}
                    {index == 5 && "Outline Red"}
                  </label>
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
        <Box sx={{ marginTop: "-20px" }}>
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            {/* Check box alignment */}
            {type === "radio"
              ? t("0-common.radioButtonAlignement")
              : t("0-common.checkBoxAlignment")}
          </Typography>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            sx={{ backgroundColor: "#fff" }}
            aria-label="text alignment"
          >
            <ToggleButton value="AUTO" aria-label="centered">
              <Typography
                variant="h6"
                sx={{ fontWeight: "600", textTransform: "capitalize" }}
              >
                Auto
              </Typography>
            </ToggleButton>
            <ToggleButton value="LEFT" aria-label="left aligned">
              <FormatAlignLeftIcon />
            </ToggleButton>
            <ToggleButton value="RIGHT" aria-label="right aligned">
              <FormatAlignRightIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ marginTop: "-20px" }}>
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            {/* Tooltip Text */}
            {t("0-common.tooltip")}
          </Typography>
          <InputField
            label=""
            name="tooltip"
            control={control}
            InputLabelProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
            inputProps={{
              // readOnly: true,
              sx: {
                py: "11px",
                backgroundColor: "signingWFBackground.main",
              },
            }}
            sx={{ my: 0, height: "45px" }}
          />
        </Box>
      </Box>
    </Box>
  );
};
CheckBoxSettingForm.propTypes = {
  participants: PropTypes.array,
  checkBoxData: PropTypes.array,
  control: PropTypes.object,
  type: PropTypes.string,
  setValue: PropTypes.func,
  remark: PropTypes.array,
  setRemark: PropTypes.func,
  setChecked: PropTypes.func,
  checked: PropTypes.array,
  required: PropTypes.array,
  setRequired: PropTypes.func,
  radio: PropTypes.array,
  setRadio: PropTypes.func,
  multipleChecked: PropTypes.bool,
  setMultipleChecked: PropTypes.func,
  styles: PropTypes.object,
  alignment: PropTypes.string,
  setAlignment: PropTypes.func,
};
