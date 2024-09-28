import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
// import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InputField, SelectField } from "../form";
import AllowRequireField from "../form/AllowRequireField";

export const GeneralToggleForm = ({
  participants,
  control,
  defaultValues,
  setValueForm,
  toggle,
  setToggle,
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

  // const [toggle, setToggle] = useState([
  //   {
  //     text: "demo",
  //     value: "demo",
  //   },
  // ]);

  const [selectedValue, setSelectedValue] = useState(
    defaultValues.default_item
  ); // Khởi tạo giá trị mặc định

  const handleChange = (event) => {
    setSelectedValue(event.target.value); // Cập nhật giá trị khi chọn
    // Xử lý thêm các thao tác khác nếu cần
  };

  // Hàm xử lý sự kiện khi thay đổi nội dung của ô "Text"
  const handleTextChange = (event, type, index) => {
    let value = toggle;
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
    if (value.length < 1) return;
    setToggle([...value]); // Cập nhật giá trị của ô "Value" vào trạng thái
  };
  const handleAddColumn = (event, type, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của Enter trong một form
      let updatedToggle = [...toggle]; // Tạo một bản sao của mảng toggle để thay đổi mà không ảnh hưởng đến state trực tiếp
      if (updatedToggle[updatedToggle.length - 1].text === "") return;
      if (updatedToggle[index].text === "") {
        return; // Không thực hiện gì nếu text rỗng
      }

      if (type === "text" && updatedToggle[index].value === "") {
        // Nếu loại là "text" và giá trị là rỗng
        updatedToggle[index] = {
          ...updatedToggle[index],
          value: updatedToggle[index].text,
        };
      }

      // Thêm một mục mới vào toggle, với text và value rỗng
      updatedToggle.push({
        text: "",
        value: "",
      });

      setToggle(updatedToggle); // Cập nhật state toggle với mảng mới đã được cập nhật
    }
  };

  // {toggle.map((item, index) => {
  //   return (
  //     <MenuItem key={index} value={item.value}>
  //       {item.value}
  //     </MenuItem>
  //   );
  // })}
  const selectContenUpdate = toggle.filter((item) => item.value !== "");
  const selectContent = selectContenUpdate.map((item, i) => (
    <MenuItem key={i} value={item.value}>
      {item.value}
    </MenuItem>
  ));

  // useEffect(() => {
  //   const updatedSelectContent = toggle
  //     .filter((item) => item.value !== "")
  //     .map((item, i) => (
  //       <MenuItem key={i} value={item.value}>
  //         {item.value}
  //       </MenuItem>
  //     ));
  //   setSelectContent(updatedSelectContent);
  // }, [toggle]);

  useEffect(() => {
    const index = toggle.find(
      (item) => item.value === defaultValues.default_item
    );
    if (!index && selectContenUpdate.length > 0) {
      // if (selectContent.length > 0) {
      //   setValueForm("default_item", selectContent[0].value);
      //   setSelectedValue(selectContent[0].value);
      // }
      setValueForm("default_item", selectContenUpdate[0].value);
      setSelectedValue(selectContenUpdate[0].value);
    }
  }, [toggle]);

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
        }}
      >
        {toggle.length}
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
        <Table sx={{ tableLayout: "fixed" }} aria-label="simple table">
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
            {toggle.map((item, index) => {
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
      <Box my="10px">
        <Typography variant="h6" mb="10px">
          {t("0-common.default_value")}
        </Typography>
        <FormControl fullWidth>
          {/* <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={handleChange}
            value={selectedValue} // Giá trị được chọn
            name="default_item"
          >
            {toggle.map((item, index) => {
              return (
                <MenuItem key={index} value={item.value}>
                  {item.value}
                </MenuItem>
              );
            })}
          </Select> */}
          <SelectField
            name="default_item"
            control={control}
            content={selectContent}
            value={selectedValue}
            onChange={handleChange}
            sx={{
              backgroundColor: "signingWFBackground.main",
              height: "45px",
              color: "#1F2937",
            }}
          />
        </FormControl>
        {/* <InputField
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
        /> */}
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
              color: "#1F2937",
            },
          }}
        />
      </Box>
    </Box>
  );
};

GeneralToggleForm.propTypes = {
  participants: PropTypes.array,
  control: PropTypes.object,
  defaultValues: PropTypes.object,
  setValueForm: PropTypes.func,
  toggle: PropTypes.array,
  setToggle: PropTypes.func,
};

export default GeneralToggleForm;
