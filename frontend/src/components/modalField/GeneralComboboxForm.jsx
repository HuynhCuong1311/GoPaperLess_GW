import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InputField, SelectField } from "../form";
import AllowRequireField from "../form/AllowRequireField";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  // color: theme.palette.text.secondary,
}));

export const GeneralComboboxForm = ({
  participants,
  control,
  defaultValues,
  setValueForm,
  combobox,
  setCombobox,
}) => {
  const { t } = useTranslation();

  //   const [selected, setSelected] = useState([]);
  //   const [selected2, setSelected2] = useState([]);

  //   const handleChange = (event, type) => {
  //     const value = event.target.value;
  //     // console.log(value);
  //     // added below code to update selected options
  //     const list = type === "allowed" ? [...selected] : [...selected2];
  //     const index = list.indexOf(value);
  //     index === -1 ? list.push(value) : list.splice(index, 1);
  //     type === "allowed" ? setSelected(list) : setSelected2(list);
  //   };
  const removeElementIfNotAllowed = (element, allowArray, requiredArray) => {
    const isAllowed = allowArray.includes(element);
    if (!isAllowed) {
      const index = requiredArray.indexOf(element);
      if (index !== -1) {
        requiredArray.splice(index, 1);
        setValueForm("required", requiredArray);
      }
    }
  };

  useEffect(() => {
    const updatedRequiredArray = [...defaultValues.required];
    defaultValues.required.forEach((element) => {
      removeElementIfNotAllowed(
        element,
        defaultValues.allow,
        updatedRequiredArray
      );
    });
  }, [defaultValues.allow]);

  // const [combobox, setCombobox] = useState([
  //   {
  //     text: "demo",
  //     value: "demo",
  //   },
  // ]);

  const [selectedValue, setSelectedValue] = useState(
    defaultValues.default_item || "Select"
  ); // Khởi tạo giá trị mặc định

  const handleChange = (event) => {
    setSelectedValue(event.target.value); // Cập nhật giá trị khi chọn
    // Xử lý thêm các thao tác khác nếu cần
  };

  // Hàm xử lý sự kiện khi thay đổi nội dung của ô "Text"
  const handleTextChange = (event, type, index) => {
    let value = combobox;
    if (value[index].text === "" && type === "value") {
      return;
    }
    if (type === "text") {
      value[index] = {
        ...value[index],
        text: event.target.value,
        value: event.target.value,
      };
    }
    if (type === "value") {
      value[index] = {
        ...value[index],
        value: event.target.value,
      };
    }

    setCombobox([...value]); // Cập nhật giá trị của ô "Value" vào trạng thái
  };
  const handleAddColumn = (event, type, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của Enter trong một form
      let updatedCombobox = [...combobox]; // Tạo một bản sao của mảng combobox để thay đổi mà không ảnh hưởng đến state trực tiếp
      if (updatedCombobox[updatedCombobox.length - 1].text === "") return;
      if (updatedCombobox[index].text === "") {
        return; // Không thực hiện gì nếu text rỗng
      }

      if (type === "text" && updatedCombobox[index].value === "") {
        // Nếu loại là "text" và giá trị là rỗng
        updatedCombobox[index] = {
          ...updatedCombobox[index],
          value: updatedCombobox[index].text,
        };
      }

      // Thêm một mục mới vào combobox, với text và value rỗng
      updatedCombobox.push({
        text: "",
        value: "",
      });

      setCombobox(updatedCombobox); // Cập nhật state combobox với mảng mới đã được cập nhật
    }
  };

  // {combobox.map((item, index) => {
  //   return (
  //     <MenuItem key={index} value={item.value}>
  //       {item.value}
  //     </MenuItem>
  //   );
  // })}

  const defaultArray = [
    {
      text: defaultValues.placeHolder,
      value: "Select",
    },
    ...combobox,
  ];

  const selectContent = defaultArray
    .filter((item) => item.value !== "")
    .map((item, i) => {
      return (
        <MenuItem key={i} value={item.value}>
          {item.text}
        </MenuItem>
      );
    });

  return (
    <Box>
      <Box mb="10px">
        <Typography variant="h6">{t("modal.camera_1")}</Typography>
      </Box>
      <AllowRequireField
        data={participants}
        defaultValues={defaultValues}
        control={control}
      />
      <Typography
        variant="h6"
        mb="10px"
        mr="10px"
        sx={{ display: "inline-block" }}
      >
        {t("0-common.items")}
      </Typography>
      <Typography
        sx={{
          display: "inline-block",
          color: "#3B82F6",
          fontSize: "12px",
          border: "1px solid #BFDBFE",
          borderRadius: "999px",
          width: "21px",
          height: "18px",
          textAlign: "center",
          // padding: "0px 6px 0px 6px",
        }}
      >
        {combobox.length}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          background: "transparent",
          boxShadow: "none",
          border: "1px solid #E5E7EB",
          borderBottom: "none",
          borderRadius: 0,
        }}
      >
        <Table
          sx={{ tableLayout: "fixed", borderBottom: "none" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{
                  width: "80px",
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
                  width: "80px",
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
            {combobox.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    align="left"
                    sx={{
                      width: "208px",
                      height: "30px",
                      padding: "0 0 0 16px",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    }}
                    type="text"
                  >
                    <TextField
                      sx={{
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
                      }}
                      value={item.text}
                      onChange={(e) => handleTextChange(e, "text", index)}
                      onKeyDown={(e) => handleAddColumn(e, "text", index)}
                      autoFocus={item.text ? false : true}
                    />
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      width: "77px",
                      height: "30px",
                      padding: "0px",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    <TextField
                      sx={{
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
                      }}
                      value={item.value}
                      onChange={(e) => handleTextChange(e, "value", index)}
                      onKeyDown={(e) => handleAddColumn(e, "value", index)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mb="10px" mt="10px" sx={{ width: "100%" }}>
        <Grid
          container
          rowSpacing="10px"
          columnSpacing={{ xs: 4, sm: 5, md: 6 }}
          // p="10px"
        >
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.default_value")}
              </Typography>
              <FormControl fullWidth>
                <SelectField
                  name="default_item"
                  control={control}
                  content={selectContent}
                  value={selectedValue}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: "signingWFBackground.main",
                    height: "45px",
                  }}
                />
              </FormControl>
            </Item>
          </Grid>
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("modal.placeholder")}
              </Typography>
              <FormControl fullWidth>
                <InputField
                  //   label={t("0-common.text")}
                  name="placeHolder"
                  control={control}
                  sx={{
                    my: 0,
                  }}
                  inputProps={{
                    sx: {
                      py: "11px",
                      backgroundColor: "signingWFBackground.main",
                    },
                  }}
                />
              </FormControl>
            </Item>
          </Grid>
        </Grid>
      </Box>

      <Box mb="10px">
        <Typography variant="h6" mb="10px">
          {t("0-common.tooltip")}
        </Typography>

        <InputField
          //   label={t("0-common.text")}
          name="tooltip"
          control={control}
          sx={{
            mt: 0,
          }}
          inputProps={{
            sx: {
              py: "11px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
        />
      </Box>
    </Box>
  );
};

GeneralComboboxForm.propTypes = {
  participants: PropTypes.array,
  control: PropTypes.object,
  defaultValues: PropTypes.object,
  setValueForm: PropTypes.func,
  combobox: PropTypes.array,
  setCombobox: PropTypes.func,
};

export default GeneralComboboxForm;
