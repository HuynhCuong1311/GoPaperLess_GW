import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { MenuProps } from "@/hook/utils";
import { fpsService } from "@/services/fps_service";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReplicateForm = ({
  control,
  name,
  totalPages,
  initList,
  workFlow,
  type,
  getFields,
}) => {
  // console.log("totalPages: ", totalPages);
  const { t } = useTranslation();

  const {
    field: { onChange, value },
    // fieldState: { error },
  } = useController({ name, control });

  const queryClient = useQueryClient();

  const removeSignature = useMutation({
    mutationFn: ({ field_name }) => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        field_name
      );
    },
    onSuccess: async () => {
      await getFields();
      queryClient.invalidateQueries({ queryKey: ["getField"] });
    },
  });

  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(Array.from(Array(totalPages), (_, index) => index + 1));
  }, [totalPages]);

  // const options = Array.from(
  //   Array(pdfInfo?.totalPage),
  //   (_, index) => index + 1
  // );

  // const [selected, setSelected] = useState([]);
  const isAllSelected =
    options?.length > 0 && value?.length === options?.length;

  const handleChange = (event) => {
    // console.log("event: ", event);
    const value1 = event.target.value;
    if (value1[value1?.length - 1] === "all") {
      onChange(value?.length === options?.length ? [] : options);
      return;
    }
    onChange(value1);
  };

  const options2 = initList
    .filter((item) => item.process_status !== "PROCESSED")
    .map((item) => item?.field_name);

  const [selected2, setSelected2] = useState([]);
  const isAllSelected2 =
    options2.length > 0 && selected2.length === options2.length;

  const handleChange2 = (event) => {
    const value2 = event.target.value;
    if (value2 === "all") {
      setSelected2(selected2.length === options2.length ? [] : options2);
      return;
    }
    // added below code to update selected options
    const list = [...selected2];
    const index = list.indexOf(value2);
    index === -1 ? list.push(value2) : list.splice(index, 1);
    setSelected2(list);
  };

  const handleRemoveInit = () => {
    // console.log("selected2: ", selected2);
    if (selected2.length === 0) {
      return;
    }
    for (const item of selected2) {
      removeSignature.mutateAsync({ field_name: item });
    }
  };

  return (
    <Box>
      <Box mb="10px">
        <Typography variant="h6" mb="10px">
          {t("modal.replicate_to_pages")}
        </Typography>
        <FormControl fullWidth>
          {/* <InputLabel id="mutiple-select-label">Multiple Select</InputLabel> */}
          <Select
            labelId="mutiple-select-label"
            multiple
            // name="replicate"
            control={control}
            value={value}
            placeholder="Select pages"
            onChange={handleChange}
            renderValue={(value) => {
              return value.length === options.length
                ? t("modal.select_all")
                : value.join(", ");
            }}
            MenuProps={MenuProps}
            sx={{
              backgroundColor: "signingWFBackground.main",
              height: "45px",
            }}
          >
            <MenuItem value="all" sx={{ py: 0 }}>
              <ListItemIcon>
                <Checkbox
                  // classes={{ indeterminate: classes.indeterminateColor }}
                  checked={isAllSelected}
                  indeterminate={
                    value.length > 0 && value.length < options.length
                  }
                />
              </ListItemIcon>
              <ListItemText
                // classes={{ primary: classes.selectAllText }}
                primary={t("modal.select_all")}
              />
            </MenuItem>
            <Divider
              sx={{ mx: "20px" }}
              // variant="middle"
              // orientation="horizontal"
              // flexItem={true}
            />
            {options.map((option) => (
              <MenuItem key={option} value={option} sx={{ py: 0 }}>
                <ListItemIcon>
                  <Checkbox checked={value.indexOf(option) > -1} />
                </ListItemIcon>
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer>
        <Table sx={{ tableLayout: "fixed" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "116px" }}>
                {type === "initials"
                  ? t("0-common.initials")
                  : t("0-common.seals")}{" "}
                ({initList.length})
              </TableCell>
              <TableCell align="center" sx={{ width: "208px" }}>
                {t("modal.document_name")}
              </TableCell>
              <TableCell align="center" sx={{ width: "77px" }}>
                {t("0-common.page")}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  padding: "16px 14px 16px 2px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SvgIcon
                    component={GarbageIcon}
                    inheritViewBox
                    sx={{
                      width: "15px",
                      height: "15px",
                      color: "#545454",
                      cursor: "pointer",
                      margin: "0 4px 2px",
                    }}
                    onClick={handleRemoveInit}
                  />
                  <Checkbox
                    value="all"
                    onChange={handleChange2}
                    checked={isAllSelected2}
                    indeterminate={
                      selected2.length > 0 && selected2.length < options2.length
                    }
                    size="small"
                    sx={{ padding: "0" }}
                    disableRipple
                  />{" "}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initList
              .sort((a, b) => a.page - b.page)
              .map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.type} {index + 1}
                  </TableCell>
                  <TableCell align="center">{row.documentName}</TableCell>
                  <TableCell align="center">{row.page}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      value={row.field_name}
                      onChange={handleChange2}
                      checked={
                        row.process_status !== "PROCESSED" &&
                        selected2.includes(row.field_name)
                      }
                      size="small"
                      disableRipple
                      disabled={row.process_status === "PROCESSED"}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
ReplicateForm.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  totalPages: PropTypes.number,
  initList: PropTypes.array,
  workFlow: PropTypes.object,
  type: PropTypes.string,
  getFields: PropTypes.func,
};
