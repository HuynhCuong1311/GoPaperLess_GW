import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { checkSignerStatus } from "@/utils/commonFunction";
import { ReactComponent as PerSonIcon } from "@/assets/images/svg/person_icon.svg";
import { ReactComponent as SignedIcon } from "@/assets/images/svg/signed_icon.svg";
import { ReactComponent as WaitingMySig } from "@/assets/images/svg/waiting_mysig.svg";
import { ReactComponent as WaitingSig } from "@/assets/images/svg/waiting_sig.svg";
import { ReactComponent as WarningIcon } from "@/assets/images/svg/warning_icon.svg";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ChildModal = ({ data }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState([false]);

  const [search] = useSearchParams();
  const signerToken = search.get("access_token");

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

  const Signed = data?.reduce((count, item) => {
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
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            elevation: 0,
            borderCollapse: "separate",
            borderSpacing: "0px 8px",
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
                }}
              >
                {t("0-common.custom")} [{Signed}/{data?.length}]
              </TableCell>
            </TableRow>
            <TableRow>
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
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => {
              const status = checkSignerStatus(item, signerToken);
              return (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: "white",
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PerSonIcon />
                      {/* {tableCheckStatus(item, signerToken)} */}
                      {status === 2 ? (
                        <SignedIcon />
                      ) : status === 1 ? (
                        <WaitingMySig />
                      ) : (
                        <WaitingSig />
                      )}
                      <Typography variant="h6">
                        {item.firstName} {item.lastName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="left">{item.lastName}</TableCell>
                  <TableCell align="left">{item.email}</TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px",
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpen(index)}
                    >
                      <WarningIcon />
                    </IconButton>
                  </TableCell>

                  {open[index] && (
                    <Modal
                      open={open[index]}
                      onClose={() => handleClose(index)}
                      aria-labelledby="child-modal-title"
                      aria-describedby="child-modal-description"
                    >
                      <Box sx={{ ...style, width: 200 }}>
                        <h2 id="child-modal-title">Text in a child modal</h2>
                        <p id="child-modal-description">
                          Lorem ipsum, dolor sit amet consectetur adipisicing
                          elit.
                        </p>
                        <Button onClick={() => handleClose(index)}>
                          Close Child Modal
                        </Button>
                      </Box>
                    </Modal>
                  )}
                </TableRow>
              );
            })}
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

ChildModal.propTypes = {
  data: PropTypes.array,
};

export default ChildModal;
