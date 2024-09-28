import {
  convertTime,
  downloadCertFromPEM,
  formatStringWithSpaces,
} from "@/utils/commonFunction";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import forge from "node-forge";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: "10px 0",
            backgroundColor: "dialogBackground.main",
            color: "black",
          }}
        >
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export const ModalCertInfor = ({ open, onClose, data, certData }) => {
  const { t } = useTranslation();

  const [value, setValue] = useState(0);
  // console.log("value: ", value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [type, setType] = useState("all");
  // console.log("type: ", type);

  const [typeValue, setTypeValue] = useState(0);

  const handleSelectChange = (event) => {
    setType(event.target.value);
  };

  // const issuer = () => {
  //   switch (provider) {
  //     case "USB_TOKEN_SIGNING":
  //       return data.issuer.commonName;
  //     default:
  //       return data.issuer;
  //   }
  // };

  // const pemValue = () => {
  //   switch (provider) {
  //     case "USB_TOKEN_SIGNING":
  //       return data.value;
  //     default:
  //       return data.cert;
  //   }
  // };

  // const subject = () => {
  //   switch (provider) {
  //     case "USB_TOKEN_SIGNING":
  //       return data.subject.commonName;
  //     default:
  //       return data.subject;
  //   }
  // };

  const certificate = [
    {
      title: t("modal.certDetail_4"),
      value: data.subject,
    },
    {
      title: t("modal.certDetail_5"),
      value: data.issuer,
    },
    {
      title: t("0-common.valid_from"),
      value: data.validFrom ? convertTime(data.validFrom) : null,
    },
    {
      title: t("0-common.valid_to"),
      value: data.validTo ? convertTime(data.validTo) : null,
    },
  ].filter((item) => item.value !== null);

  const selectData = [
    {
      value: "all",
      label: "<All>",
    },
    {
      value: "field",
      label: "Version 1 Fields Only",
    },
    {
      value: "ext",
      label: "Extensions Only",
    },
    {
      value: "crit",
      label: "Critical Extensions Only",
    },
    {
      value: "proper",
      label: "Properties Only",
    },
  ];

  const columns = [{ label: "Field" }, { label: "Details" }];

  const all = [
    {
      key: "version",
      label: "Version",
      value: certData?.version,
    },
    {
      key: "serialNumber",
      label: "Serial number",
      value: certData?.serialNumber,
    },
    {
      key: "sigAlgName",
      label: "Signature algorithm",
      value: certData?.sigAlgName,
    },
    {
      key: "sigHashAlgName",
      label: "Signature hash algorithm",
      value: certData?.algorithm,
    },
    {
      key: "issuer",
      label: "Issuer",
      value: certData?.issuerDN,
    },
    {
      key: "validFrom",
      label: "Valid from",
      value: certData?.validFrom,
    },
    {
      key: "validTo",
      label: "Valid to",
      value: certData?.validTo,
    },
    {
      key: "subject",
      label: "Subject",
      value: certData?.subjectDN,
    },
    {
      key: "publicKey",
      label: "Public key",
      value: certData?.publicKey?.split("\n")[0],
    },
    {
      key: "authInfoAccess",
      label: "Authority information access",
      value: certData?.authorityInformationAccess,
    },
    {
      key: "subjectKeyIdentifier",
      label: "Subject key identifier",
      value: certData?.subjectKeyIdentifier?.replace("0414", ""),
    },
    {
      key: "authorityKeyIdentifier",
      label: "Authority key identifier",
      value: certData?.authorityKeyIdentifier,
    },
    {
      key: "crlDistributionPoints",
      label: "CRL distribution point",
      value: certData?.crlDistributionPoints,
    },
    {
      key: "EnhancedkeyUsage",
      label: "Enhanced key usage",
      value: certData?.enhancedKeyUsage,
    },
    {
      key: "QualifiedCertificateStatements",
      label: "Qualified Certificate Statements",
      value: formatStringWithSpaces(certData?.qes),
    },
    {
      key: "subjectAlternativeName",
      label: "Subject alternative name",
      value: certData?.subjectAlternativeName,
    },
    {
      key: "basicConstraints",
      label: "Basic Constraints",
      value: certData?.basicConstraints,
    },
    {
      key: "keyUsage",
      label: "Key usage",
      value: certData?.keyUsage,
    },
    {
      key: "thumbprint",
      label: "Thumbprint",
      value: certData?.thumbprint,
    },
  ].filter((item) => item.value !== null && item.value !== "");

  const field = [
    {
      key: "version",
      label: "Version",
      value: certData?.version,
    },
    {
      key: "serialNumber",
      label: "Serial number",
      value: certData?.serialNumber,
    },
    {
      key: "sigAlgName",
      label: "Signature algorithm",
      value: certData?.sigAlgName,
    },
    {
      key: "sigHashAlgName",
      label: "Signature hash algorithm",
      value: certData?.algorithm,
    },
    {
      key: "issuer",
      label: "Issuer",
      value: certData?.issuerDN,
    },
    {
      key: "validFrom",
      label: "Valid from",
      value: certData?.validFrom,
    },
    {
      key: "validTo",
      label: "Valid to",
      value: certData?.validTo,
    },
    {
      key: "subject",
      label: "Subject",
      value: certData?.subjectDN,
    },
    {
      key: "publicKey",
      label: "Public key",
      value: certData?.publicKey?.split("\n")[0],
    },
  ].filter((item) => item.value !== null && item.value !== "");

  const ext = [
    {
      key: "authInfoAccess",
      label: "Authority information access",
      value: certData?.authorityInformationAccess,
    },
    {
      key: "subjectKeyIdentifier",
      label: "Subject key identifier",
      value: certData?.subjectKeyIdentifier?.replace("0414", ""),
    },
    {
      key: "authorityKeyIdentifier",
      label: "Authority key identifier",
      value: certData?.authorityKeyIdentifier,
    },
    {
      key: "crlDistributionPoints",
      label: "CRL distribution point",
      value: certData?.crlDistributionPoints,
    },
    {
      key: "EnhancedkeyUsage",
      label: "Enhanced key usage",
      value: certData?.enhancedKeyUsage,
    },
    {
      key: "QualifiedCertificateStatements",
      label: "Qualified Certificate Statements",
      value: certData?.qes,
    },
    {
      key: "subjectAlternativeName",
      label: "Subject alternative name",
      value: certData?.subjectAlternativeName,
    },
    {
      key: "basicConstraints",
      label: "Basic Constraints",
      value: certData?.basicConstraints,
    },
    {
      key: "keyUsage",
      label: "Key usage",
      value: certData?.keyUsage,
    },
    {
      key: "thumbprint",
      label: "Thumbprint",
      value: certData?.thumbprint,
    },
  ].filter((item) => item.value !== null && item.value !== "");

  const crit = [
    {
      key: "basicConstraints",
      label: "Basic Constraints",
      value: certData?.basicConstraints,
    },
    {
      key: "keyUsage",
      label: "Key usage",
      value: certData?.keyUsage,
    },
  ].filter((item) => item.value !== null && item.value !== "");

  const proper = [
    {
      key: "thumbprint",
      label: "Thumbprint",
      value: certData?.thumbprint,
    },
  ].filter((item) => item.value !== null && item.value !== "");

  const rowData = {
    all,
    field,
    ext,
    crit,
    proper,
  };

  // console.log("rowData: ", rowData);

  useEffect(() => {
    setTypeValue(0);
  }, [type]);

  const handleRowClick = (value) => {
    setTypeValue(value);
  };

  return (
    <Dialog
      keepMounted={false}
      TransitionComponent={Transition}
      open={!!open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        sx: {
          width: "500px",
          maxWidth: "500px", // Set your width here
          height: "700px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{
          backgroundColor: "dialogBackground.main",
          p: "10px 20px",
          height: "51px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            display: "inline-block",
            color: "signingtextBlue.main",
            borderBottom: "4px solid",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
          }}
        >
          {t("modal.modal5_title")}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "dialogBackground.main",
          height: "100%",
          // py: "10px",
          borderBottom: "1px solid",
          borderColor: "borderColor.main",
          p: "0 20px 10px",
        }}
      >
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
        >
          <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
            <AppBar position="static" elevation={0}>
              <Box sx={{ borderBottom: 1, borderColor: "#E5E7EB" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  // textColor="inherit"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                  sx={{
                    height: "45px",
                    minHeight: "45px",
                    backgroundColor: "dialogBackground.main",
                  }}
                >
                  <Tab
                    label={t("0-common.general")}
                    {...a11yProps(0)}
                    sx={{
                      minHeight: "45px",
                      height: "45px",
                      textTransform: "none",
                      color: "#1F2937",
                    }}
                  />
                  <Tab
                    label={t("0-common.details")}
                    {...a11yProps(1)}
                    sx={{
                      minHeight: "45px",
                      height: "45px",
                      textTransform: "none",
                      color: "#1F2937",
                    }}
                  />
                </Tabs>
              </Box>
            </AppBar>
            <TabPanel value={value} index={0}>
              <Box width={"100%"}>
                <Typography variant="h6" color="textBold.main">
                  {t("modal.certDetail_1")}
                </Typography>
                <Box p={"10px 20px"}>
                  <ul style={{ margin: 0 }}>
                    <li>
                      <Typography variant="h6" color="textBold.main">
                        {t("modal.certDetail_2")}
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="h6" color="textBold.main">
                        {t("modal.certDetail_3")}
                      </Typography>
                    </li>
                  </ul>
                </Box>
                {certificate.map((item, index) => (
                  <Box key={index} mb="10px">
                    <Typography
                      variant="h6"
                      height="17px"
                      fontWeight={600}
                      mb="10px"
                    >
                      {item.title}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      margin="normal"
                      multiline
                      defaultValue={item.value}
                      sx={{
                        my: 0,
                        "& .MuiInputBase-root": {
                          minHeight: "45px",
                          height: "auto !important",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#1F2937",
                        },
                      }}
                      disabled={true}
                      InputProps={{
                        // readOnly: true,
                        sx: {
                          backgroundColor: "#EFEFEF",
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Stack direction="column" sx={{ height: "513px" }}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  width={"100%"}
                  mb={"10px"}
                >
                  <Typography variant="h6" sx={{ mr: 1 }} fontWeight={600}>
                    Show:
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      labelId="demo-simple-select1-label"
                      id="demo-simple-select"
                      value={type}
                      onChange={handleSelectChange}
                      sx={{
                        "& .MuiListItemSecondaryAction-root": {
                          right: "30px",
                          display: "flex",
                        },
                        backgroundColor: "signingWFBackground.main",
                        fontSize: "12px",
                      }}
                    >
                      {selectData?.map((item, index) => (
                        <MenuItem
                          key={index}
                          value={item.value}
                          sx={{ fontSize: "12px" }}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Box flexGrow={1} alignSelf={"stretch"}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      maxHeight: 300,
                      mb: "10px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Table
                      sx={{
                        width: "100%",
                        tableLayout: "fixed",
                        overflow: "auto",
                      }}
                      stickyHeader
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow
                          sx={{ height: "30px", backgroundColor: "#F9FAFB" }}
                        >
                          {columns.map((column, index) => (
                            <TableCell
                              key={index}
                              align={column.align}
                              sx={{
                                p: "0 20px",
                                width: "50%",
                                fontSize: "12px",
                                backgroundColor: "#F9FAFB",
                              }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rowData[type]?.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              height: "30px",
                              backgroundColor:
                                index === typeValue ? "#A6D1FF" : "",
                            }}
                            onClick={() => handleRowClick(index)}
                          >
                            {/* <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell> */}
                            <TableCell sx={{ p: "0 20px", fontSize: "12px" }}>
                              {row.label}
                            </TableCell>
                            <TableCell
                              sx={{
                                p: "0 20px",
                                fontSize: "12px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row.value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box
                  width={"100%"}
                  height={"120px"}
                  bgcolor={"white"}
                  border={"1px solid #E5E7EB"}
                  borderRadius={"6px"}
                  p={"10px"}
                  fontSize={"12px"}
                  sx={{
                    wordBreak: "break-all",
                    overflow: "auto",
                    // textOverflow: "ellipsis",
                  }}
                >
                  {rowData[type]?.[typeValue]?.key !== "publicKey"
                    ? rowData[type]?.[typeValue]?.value
                    : certData.publicKeyHex}
                  {/* {rowData[type]?.[typeValue]?.value} */}
                </Box>
                {/* <Typography
                  variant="h4"
                  sx={{ mt: "10px" }}
                  onClick={() => downloadCertFromPEM(data.cert)}
                >
                  click
                </Typography> */}
                <Stack
                  width={"100%"}
                  height={"19px"}
                  direction={"row"}
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                  mt={"9px"}
                >
                  <Box
                    onClick={() => downloadCertFromPEM(data.cert, data.subject)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                      color: "#357EEB",
                      fontSize: "12px",
                    }}
                  >
                    <SaveAltIcon fontSize="small" color="borderColor.light" />
                    {t("modal.download")}
                  </Box>
                  {/* <Chip
                    label={t("modal.download")}
                    component="div"
                    sx={{
                      // padding: "8px 16px",
                      height: "19px",
                      // fontWeight: "500",
                      // borderRadius: "25px",
                      backgroundColor: "transparent",
                      color: "blue",
                      gap: "10px",
                      "& span": {
                        padding: "0",
                      },
                      "& svg.MuiChip-icon": {
                        margin: "0",
                      },
                    }}
                    className="hover-underline-animation"
                    onClick={() => downloadCertFromPEM(pemValue(), subject())}
                    icon={
                      <SaveAltIcon fontSize="small" color="borderColor.light" />
                    }
                    clickable
                  /> */}
                </Stack>
              </Stack>
            </TabPanel>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            backgroundColor: "#FFF",
            border: "1px solid var(--Gray-200, #E5E7EB)",
            boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            color: "#1F2937",
            fontWeight: 600,
          }}
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalCertInfor.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  certData: PropTypes.object,
};

export default ModalCertInfor;
