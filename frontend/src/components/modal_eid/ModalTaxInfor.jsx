import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const ModalTaxInfor = ({ open, onClose, data }) => {
  const [tax, setTax] = useState([]);
  const { t } = useTranslation();
  useEffect(() => {
    const taxDemo = [];

    taxDemo.push({
      title: "electronic.step151.businessNumber",
      value: data?.company_information?.business_license,
    });

    taxDemo.push({
      title: "electronic.step151.dateOfIssue",
      value: data?.company_information?.tax_code_issuance_date,
    });

    taxDemo.push({
      title: "electronic.step151.taxCodeClosingDate",
      value: data?.company_information?.tax_code_revoke_date,
    });

    taxDemo.push({
      title: "electronic.step151.officialName",
      value: data?.company_information?.official_name,
    });

    taxDemo.push({
      title: "electronic.step151.tradingName",
      value: data?.company_information?.short_name,
    });

    taxDemo.push({
      title: "electronic.step151.whereToRegisterForTaxAdministration",
      value: data?.company_information?.place_of_registration_tax_management,
    });

    taxDemo.push({
      title: "electronic.step151.headOfficeAddress",
      value: data?.company_information?.address,
    });

    taxDemo.push({
      title: "electronic.step151.whereToRegisterToPayTaxes",
      value: data?.company_information?.place_of_registration_pay_taxes,
    });

    taxDemo.push({
      title: "electronic.step151.addressToReceiveTaxNotices",
      value: data?.company_information?.address_receive_tax_notices,
    });

    taxDemo.push({
      title: "electronic.step151.establishmentDecisionDateOfIssue",
      value: "-",
    });

    taxDemo.push({
      title: "electronic.step151.decisionMakingBody",
      value: "-",
    });

    taxDemo.push({
      title: "electronic.step151.businessLicenseDateOfIssue",
      value:
        data?.company_information?.business_license +
        " - " +
        data?.company_information?.business_license_issuance_date,
    });

    taxDemo.push({
      title: "electronic.step151.issuingAuthority",
      value: "",
    });

    taxDemo.push({
      title: "electronic.step151.dateOfReceiptOfTheDeclaration",
      value: data?.company_information?.receipt_declaration_date,
    });

    taxDemo.push({
      title: "electronic.step151.dateMonthOfStartOfFiscalYear",
      value: data?.company_information?.financial_start_time,
    });

    taxDemo.push({
      title: "electronic.step151.dateMonthOfTheEndOfTheFiscalYear",
      value: data?.company_information?.financial_end_time,
    });

    taxDemo.push({
      title: "electronic.step151.currentCode",
      value: "",
    });

    taxDemo.push({
      title: "electronic.step151.contractStartDate",
      value: data?.company_information?.operation_start_date,
    });
    taxDemo.push({
      title: "electronic.step151.chapterClause",
      value: data?.company_information?.chapter_clause,
    });

    taxDemo.push({
      title: "electronic.step151.formHMath",
      value: data?.company_information?.payment_form,
    });

    taxDemo.push({
      title: "electronic.step151.vatMethod",
      value: data?.company_information?.method_VAT,
    });

    taxDemo.push({
      title: "electronic.step151.ownerLegalRepresentative",
      value: data?.owner_information?.full_name,
    });

    taxDemo.push({
      title: "electronic.step151.addressOfOwnerLegalRepresentative",
      value: data?.owner_information?.address,
    });

    taxDemo.push({
      title: "electronic.step151.directorsName",
      value: data?.director_information?.full_name,
    });

    taxDemo.push({
      title: "electronic.step151.directorsAddress",
      value: data?.director_information?.address,
    });
    taxDemo.push({
      title: "electronic.step151.chiefAccountant",
      value: data?.chief_accountant_information?.full_name,
    });
    taxDemo.push({
      title: "electronic.step151.chiefAccountantAddress",
      value: data?.chief_accountant_information?.address,
    });
    setTax(taxDemo);
  }, [data]);
  return (
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
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
          {/* {title} */}
          {t("0-common.details")}
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
          // className="choyoyoy"
        >
          <Stack sx={{ mt: 0, mb: 1, height: "100%" }}>
            <TableContainer
              component={Paper}
              sx={{
                marginTop: "10px",
                boxShadow: "none",
                border: "1px solid rgba(224, 224, 224, 1)",
              }}
            >
              <Table aria-label="simple table">
                <TableBody
                  sx={{
                    "& td": {
                      padding: "5px 20px",
                    },
                  }}
                >
                  {tax.map((taxInfo, index) => (
                    <TableRow key={index + taxInfo.title}>
                      <TableCell
                        align="left"
                        sx={{
                          textWrap: "wrap",
                          borderRight: "1px solid rgba(224, 224, 224, 1)",
                          backgroundColor: "#F9FAFB",
                          width: "200px",
                        }}
                      >
                        <Typography variant="h4" sx={{ fontWeight: "500" }}>
                          {t(taxInfo.title)}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          backgroundColor: "dialogBackground.main",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "500",
                            // "&:hover": {
                            //   color: "primary.main",
                            // },
                          }}
                          // onClick={() => setActiveStep(15)}
                        >
                          {taxInfo.value}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalTaxInfor.propTypes = {
  data: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
