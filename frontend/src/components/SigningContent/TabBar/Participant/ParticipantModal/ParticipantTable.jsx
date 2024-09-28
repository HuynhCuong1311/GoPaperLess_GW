import { ReactComponent as PerSonIcon } from "@/assets/images/svg/person_icon.svg";
import { ReactComponent as WarningIcon } from "@/assets/images/svg/warning_icon.svg";
import { renderIcon } from "@/hook";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ParticipantDetail } from ".";
import { capitalLize } from "@/utils/commonFunction";
// import DialogField from "./Dialog_field";

const ParticipantTable = ({ workFlow }) => {
  // console.log("workFlow: ", workFlow);
  const { t } = useTranslation();

  const [open, setOpen] = useState([false]);

  const columns = [
    { id: "stt", label: "#", minWidth: 40 },
    {
      id: "participants",
      label: `${t("0-common.participants")}`,
      minWidth: 90,
    },
    {
      id: "name",
      label: `${t("0-common.name")}`,
      minWidth: 140,
      // align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "email",
      label: `${t("0-common.email")}`,
      minWidth: 40,
      // align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "density",
      label: "",
      minWidth: 40,
      // align: "right",
      format: (value) => value.toFixed(2),
    },
  ];

  const Signed = workFlow.participants.reduce((count, item) => {
    // If the status is 1, increment the count
    if (item.signerStatus === 2) {
      count++;
    }
    return count;
  }, 0); // Initial count is 0

  const handleClickOpen = (index) => {
    const newIsOpen = [...open];
    newIsOpen[index] = true;

    setOpen(newIsOpen);
  };
  const handleClose = (index) => {
    const newIsOpen = [...open];
    newIsOpen[index] = false;

    setOpen(newIsOpen);
  };
  return (
    <Paper elevation={0}>
      <TableContainer sx={{ maxHeight: "100%" }}>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            elevation: 0,
            borderCollapse: "separate",
            borderSpacing: "0px 10px",
            backgroundColor: "dialogBackground.main",
          }}
        >
          <TableHead>
            <TableRow
              sx={
                {
                  // "&:last-child td": {
                  //   borderTopLeftRadius: "10px",
                  //   borderBottomLeftRadius: "10px",
                  // },
                }
              }
            >
              <TableCell
                align="left"
                colSpan={5}
                sx={{
                  // borderRadius: "10px",
                  backgroundColor: "dialogBackground.main",
                  fontSize: "12px",
                  p: "15px 20px",
                }}
              >
                {capitalLize(workFlow.workflowProcessType)} ({Signed}/
                {workFlow.participants.length})
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: "46px" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    top: 57,
                    minWidth: column.minWidth,
                    // borderTopLeftRadius: i === 0 ? "10px" : "",
                    // borderBottomLeftRadius: i === 0 ? "10px" : "",
                    // borderTopRightRadius:
                    //   i === columns.length - 1 ? "10px" : "",
                    // borderBottomRightRadius:
                    //   i === columns.length - 1 ? "10px" : "",
                    backgroundColor: "dialogBackground.main",
                    fontSize: "16px",
                    p: "10px 26px",
                    my: "10px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {workFlow.participants.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: "white",
                  fontSize: "16px",
                  height: "45px",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    p: "10px 26px",
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell align="left" sx={{ p: "10px 26px" }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PerSonIcon />
                    {/* {tableCheckStatus(item, signerToken)} */}
                    {renderIcon(item.signerType, item.signerStatus, 17)}
                    <Typography>
                      {item.lastName} {item.firstName}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontSize: "16px", p: "10px 26px" }}
                >
                  {item.firstName}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontSize: "16px", p: "10px 26px" }}
                >
                  {item.email}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                    p: "10px 26px",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleClickOpen(index)}
                  >
                    <WarningIcon />
                  </IconButton>
                </TableCell>
                {/* {open[index] && (
                    <DialogField
                      open={open[index]}
                      title={"signer information"}
                      data={<SignerInfor data={item} />}
                      handleClose={() => handleClose(index)}
                    />
                  )} */}
                {open[index] && (
                  <ParticipantDetail
                    open={open[index]}
                    title={t("signing.participant_information")}
                    data={item}
                    handleClose={() => handleClose(index)}
                  />
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <DialogField
    open={open}
    title={"signer information"}
    data={<SignerInfor data={data} />}
    handleClose={handleClose}
  /> */}
    </Paper>
  );
};

ParticipantTable.propTypes = {
  data: PropTypes.array,
  workFlow: PropTypes.object,
};

export default ParticipantTable;
