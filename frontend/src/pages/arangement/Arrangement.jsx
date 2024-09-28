import ArragementDocument from "@/components/arrangement/ArrengementDocument";
import { Cookie } from "@/components/cookie";
import { useCommonHook } from "@/hook";
import { apiService } from "@/services/api_service";
import { fpsService } from "@/services/fps_service";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { CircularProgress } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const Arrangement = () => {
  const { t } = useTranslation();
  const { signingToken } = useCommonHook();
  const [signerToken, setSignerToken] = useState("");
  const [pendding, setPendding] = useState(false);

  const workFlow = useQuery({
    queryKey: ["getWorkFlow"],
    queryFn: () => apiService.getSigningWorkFlow(signingToken),
    // enabled: workFlowValid && workFlowValid.data === 1,
    select: (data) => {
      const newData = { ...data.data };

      if (newData.participants === null) {
        return {
          ...newData,
          participants: [],
          signerToken: signerToken,
          setSignerToken: setSignerToken,
          workflowProcessType: newData.workflowProcessType.toLowerCase(),
        };
      }
      const transformedParticipantsList = newData.participants.map(
        (participant) => {
          // Parse metaInformation and signingOptions

          const parsedAnnotation = JSON.parse(participant.annotation); // Parse annotation
          const parsedMetaInformation = JSON.parse(participant.metaInformation);
          const parsedSigningOptions = JSON.parse(participant.signingOptions);
          const parsedCertificate = JSON.parse(participant.certificate);

          // Return the participant with transformed data

          return {
            ...participant,
            annotation: parsedAnnotation,
            metaInformation: parsedMetaInformation,
            signingOptions: parsedSigningOptions?.signing_options,
            certificate: parsedCertificate,
          };
        }
      );

      // Return the data with transformed participantsList

      return {
        ...newData,
        participants: transformedParticipantsList,
        signerToken: signerToken,
        setSignerToken: setSignerToken,
        workflowProcessType: newData.workflowProcessType.toLowerCase(),
      };
    },
  });
  const getFields = async () => {
    const response = await fpsService.getFields({
      documentId: workFlow.data.documentId,
    });
    if (!response) return;
    const newData = { ...response };
    const textField = response.textbox
      .filter(
        (item) =>
          item.type !== "TEXTFIELD" &&
          item.process_status !== "PROCESSED" &&
          item.value !== ""
      )
      .map((item) => {
        return {
          field_name: item.field_name,
          value: item.value,
        };
      });
    return {
      ...newData,
      textField,
      workFlowId: workFlow.workFlowId,
    };
  };
  // let checkWorkFlowStatus = checkWorkflowStatus(workFlow?.data);
  const queryClient = useQueryClient();
  const handleShareToSign = async () => {
    try {
      if (
        workFlow.data.deadlineAt &&
        new Date(workFlow.data.deadlineAt) < new Date()
      ) {
        toast.error("Deadline has expired");
        return;
      }

      setPendding(true);
      const fields = await getFields();
      const checkFields = workFlow.data.participants
        .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
        .map((participant) => {
          let data = false;

          // check signerType
          switch (participant.signerType) {
            case 1:
              if (fields.signature.length > 0) {
                data = false;
                // Check have Signature field for this signer

                if (workFlow.data.workflowProcessType !== "individual") {
                  fields.signature.map((item) => {
                    if (
                      item.field_name.slice(0, -17) ===
                      workFlow.data.workFlowId + "_" + participant.signerId
                    ) {
                      data = true;
                      return;
                    }
                  });
                } else {
                  fields.signature.map((item) => {
                    if (
                      item.field_name.slice(0, -17) ===
                      workFlow.data.workFlowId + "_" + "GROUP_PROVIDER"
                    ) {
                      data = true;
                      return;
                    }
                  });
                }
                // If have Signature field for this signer
              }
              break;
            case 3:
              if (fields.initial.length > 0) {
                data = false;
                // Check have Signature field for this signer

                fields.initial.map((item) => {
                  if (item.field_name.slice(0, -15) === participant.signerId) {
                    data = true;
                    return;
                  }
                });
                // If have Signature field for this signer
              }
              break;
            default:
              data = true;
              break;
          }
          return data;
        });
      const signer = workFlow.data.participants.filter(
        (item) => item.signerType === 1
      );

      if (signer.length === 0) {
        toast.error(t("arrangement.error-2"));
        setPendding(false);
        return;
      }
      const FormFill = [];
      if (fields.textbox) {
        const documentId = fields.textbox
          .filter((item) => item.type === "DOCUMENTID")
          .map((item) => {
            return {
              field_name: item.field_name,
              type: "text",
              value: workFlow.data.workFlowId,
            };
          });
        FormFill.push(...documentId);
      }
      if (fields.qr) {
        const qr = fields.qr.map((item) => {
          return {
            field_name: item.field_name,
            type: "qrcode",
            value: workFlow.data.workFlowId,
          };
        });
        FormFill.push(...qr);
      }
      if (fields.hyperlink) {
        const hyperlink = fields.hyperlink.map((item) => {
          if (item?.address) {
            return {
              field_name: item.field_name,
              type: item.type,
              value: item.address,
            };
          } else {
            return;
          }
        });
        FormFill.push(...hyperlink);
      }
      if (
        !checkFields.includes(false) &&
        FormFill.every((item) => item !== undefined)
      ) {
        // TODO: Share to sign
        const data = {
          workFlowId: workFlow.data.workFlowId,
          participant: {
            ...workFlow.data.participants[0],
            metaInformation: null,
            annotation: workFlow.data.participants[0].annotation
              ? JSON.stringify(workFlow.data.participants[0].annotation)
              : null,
          },
          signerName:
            workFlow.data.participants[0].lastName +
            " " +
            workFlow.data.participants[0].firstName,
          fileName: workFlow.data.fileName,
          signingToken: workFlow.data.signingToken,
          workFlowProcessType: workFlow.data.workflowProcessType,
          documentId: workFlow.data.documentId,
          textFields: FormFill,
        };
        const res = await apiService.shareToSign(data);
        toast.success("Share to sign success!!");
        setSignerToken("");
        queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
        if (res === "Success") {
          setPendding(false);
        }
      } else {
        if (FormFill.every((item) => item !== undefined)) {
          toast.error(t("arrangement.error-1"));
        } else {
          toast.error(t("Hyperlink is not valid"));
        }
        setPendding(false);
      }
    } catch (error) {
      toast.error("Share to sign fail!!");
      setPendding(false);
    }
  };

  // console.log("checkWorkFlowStatusRef: ", checkWorkFlowStatus);

  // if (workFlowValid && workFlowValid.data === 0) {
  //   return <NotFound />;
  // } else {
  return (
    <Stack height="100%" overflow="auto">
      <Box>
        <AppBar
          position="static"
          sx={{
            height: (theme) => theme.GoPaperless.appBarHeight,
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              backgroundColor: "signingWFBackground.main",
              gap: 2,
              height: (theme) => theme.GoPaperless.appBarHeight,
              padding: "13px 0",
            }}
          >
            <Chip
              label="PDF"
              size="small"
              sx={{
                backgroundColor: "#4F4E4E",
                color: "white",
                fontWeight: "500",
              }}
            />
            <Typography
              color="signingtext1.main"
              variant="h3"
              component="div"
              sx={{ flexGrow: 1, textTransform: "uppercase" }}
            >
              {/* {t("signing.document_information")} */}
              {workFlow?.data?.documentName}
            </Typography>
            {/* <VisibilityIcon sx={{ color: "signingtext1.main" }} /> */}
            <Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <Chip
                // label={t("signing.download_completed")}
                component="a"
                // color={checkWorkFlowStatus ? "primary" : undefined}
                // disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",

                  fontWeight: "500",
                  borderRadius: "25px",
                  backgroundColor: "transparent",
                  color: "signingWFBackground.main",

                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                    color: "#3B82F6",
                  },
                }}
                // href="#basic-chip"
                icon={<KeyboardDoubleArrowLeftIcon fontSize="small" />}
              />
              <Chip
                // label={t("signing.download_completed")}
                component="a"
                // color={checkWorkFlowStatus ? "primary" : undefined}
                // disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",

                  fontWeight: "500",
                  borderRadius: "25px",
                  backgroundColor: "transparent",
                  color: "signingWFBackground.main",

                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                    color: "#3B82F6",
                  },
                }}
                // href="#basic-chip"
                icon={<KeyboardDoubleArrowRightIcon fontSize="small" />}
              />
              <Chip
                // label={t("signing.download_completed")}
                component="a"
                // color={checkWorkFlowStatus ? "primary" : undefined}
                // disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",

                  fontWeight: "500",
                  borderRadius: "25px",
                  backgroundColor: "transparent",
                  color: "signingWFBackground.main",

                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                    color: "#3B82F6",
                  },
                }}
                // href="#basic-chip"
                icon={<PrintOutlinedIcon fontSize="small" />}
              />
              <Chip
                // label={t("signing.download_completed")}
                component="a"
                // color={checkWorkFlowStatus ? "primary" : undefined}
                // disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",

                  fontWeight: "500",
                  borderRadius: "25px",
                  backgroundColor: "transparent",
                  color: "signingWFBackground.main",

                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                    color: "#3B82F6",
                  },
                }}
                href={`${window.location.origin}/view/uiApi/signing/${signingToken}/download`}
                // href="#basic-chip"
                icon={<SaveAltIcon fontSize="small" />}
                clickable
              />
              <Button
                variant="contained"
                onClick={handleShareToSign}
                sx={{ height: "36.5px" }}
                disabled={workFlow.data?.workflowStatus > 0 || pendding}
              >
                {pendding ? (
                  <CircularProgress color="inherit" size="1em" />
                ) : (
                  t("arrangement.share_now")
                )}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Container
        maxWidth={false}
        sx={{
          maxWidth: (theme) => theme.GoPaperless.containerMaxWidth,
          height: (theme) => `calc(100% - ${theme.GoPaperless.appBarHeight})`,
        }}
      >
        {workFlow.data && <ArragementDocument workFlow={workFlow.data} />}
      </Container>
      <Cookie />
    </Stack>
  );
  // }
};

export default Arrangement;
