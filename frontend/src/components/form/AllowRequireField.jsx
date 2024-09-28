import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import { CheckBoxField2 } from ".";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

export const AllowRequireField = ({ data, defaultValues, control }) => {
  const { t } = useTranslation();
  return (
    <TableContainer>
      <Table
        sx={{
          tableLayout: "fixed",
          mb: "10px",
          // borderCollapse: "separate",
          // borderSpacing: "15px",
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
        <TableBody
          sx={{
            "& > :not(:last-child)": {
              marginBottom: "10px", // Adjust spacing as needed
            },
          }}
        >
          {data.map((row, index) => (
            <TableRow
              key={index}
              // sx={{
              //   "&:last-child td, &:last-child th": { border: 0 },
              //   lineHeight: "24px",
              //   mb: "5px",
              // }}
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
                {row.lastName} {row.firstName}
              </TableCell>
              <TableCell align="center" sx={{ p: 0, border: "none" }}>
                {/* <Checkbox
                    value={row.signerId}
                    onChange={(e) => handleChange(e, "allowed")}
                    checked={selected.includes(row.signerId)}
                    size="small"
                    // disableRipple
                  /> */}
                <CheckBoxField2
                  control={control}
                  name="allow"
                  label=""
                  value={row.signerId}
                  sx={{ height: "24px" }}
                />
              </TableCell>

              <TableCell align="center" sx={{ p: 0, border: "none" }}>
                {/* <Checkbox
                    value={row.signerId}
                    onChange={(e) => handleChange(e, "required")}
                    checked={selected2.includes(row.signerId)}
                    disabled={selected.includes(row.signerId) ? false : true}
                    size="small"
                    // disableRipple
                  /> */}
                <CheckBoxField2
                  control={control}
                  name="required"
                  label=""
                  value={row.signerId}
                  sx={{ height: "24px" }}
                  disabled={
                    defaultValues.allow.includes(row.signerId) ? false : true
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

AllowRequireField.propTypes = {
  data: PropTypes.array,
  control: PropTypes.object,
  defaultValues: PropTypes.object,
};

export default AllowRequireField;
