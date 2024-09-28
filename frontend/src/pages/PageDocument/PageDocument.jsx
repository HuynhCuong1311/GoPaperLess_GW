// import "@/assets/style/documents.css";
import { SigningContent } from "@/components/SigningContent";
import { Cookie } from "@/components/cookie";
import { apiService } from "@/services/api_service";
import { checkWorkflowStatus, getSigner } from "@/utils/commonFunction";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { NotFound } from "../NotFound";
import { fpsService } from "@/services/fps_service";

export const PageDocument = () => {
  const { t } = useTranslation();
  const [signingToken, setSigningToken] = useState();
  const [checkEnable, setCheckEnable] = useState(0);

  const { qr } = useParams();

  // const { signingToken, signerToken } = useCommonHook();

  const getView = async () => {
    try {
      const response = await apiService.getView({ qr });
      setSigningToken(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (qr) {
      getView();
    }
  }, []);

  useEffect(() => {
    if (signingToken && signingToken !== "") {
      setCheckEnable(1);
    }
  }, [signingToken]);

  const workFlow = useQuery({
    queryKey: ["getWorkFlow"],
    queryFn: () => apiService.getSigningWorkFlow(signingToken),
    enabled: !!signingToken,
    select: (data) => {
      const newData = { ...data.data };
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
        // signerToken: signerToken,
      };
    },
  });

  let signer = getSigner(workFlow?.data);

  const { data: field } = useQuery({
    queryKey: ["getField"],
    queryFn: () =>
      fpsService.getFields({ documentId: workFlow?.data?.documentId }),
    enabled: !!workFlow?.data?.documentId,
    select: (data) => {
      // console.log("data: ", data);
      const newData = { ...data };
      const textField = data.textbox
        .filter(
          (item) =>
            item.type !== "TEXTFIELD" &&
            item.process_status !== "PROCESSED" &&
            item.value !== "" &&
            item.field_name.includes(signer.signerId)
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
        workFlowId: workFlow.data.workFlowId,
      };
    },
  });

  // const workFlow = useQuery({
  //   queryKey: ["getWorkFlow"],
  //   queryFn: () => apiService.getSigningWorkFlow(signingToken),
  //   enabled: checkEnable === 1,
  //   select: (data) => {
  //     const newData = { ...data.data };
  //     const transformedParticipantsList = newData.participants.map(
  //       (participant) => {
  //         // Parse metaInformation and signingOptions
  //         const parsedAnnotation = JSON.parse(participant.annotation); // Parse annotation
  //         const parsedMetaInformation = JSON.parse(participant.metaInformation);
  //         const parsedSigningOptions = JSON.parse(participant.signingOptions);
  //         const parsedCertificate = JSON.parse(participant.certificate);

  //         // Return the participant with transformed data
  //         return {
  //           ...participant,
  //           annotation: parsedAnnotation,
  //           metaInformation: parsedMetaInformation,
  //           signingOptions: parsedSigningOptions?.signing_options,
  //           certificate: parsedCertificate,
  //         };
  //       }
  //     );
  //     // Return the data with transformed participantsList
  //     return {
  //       ...newData,
  //       participants: transformedParticipantsList,
  //       // signerToken: signerToken,
  //     };
  //   },
  // });

  let checkWorkFlowStatus = checkWorkflowStatus(workFlow?.data);

  if (signingToken === "") {
    return <NotFound />;
  } else {
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
                sx={{
                  flexGrow: 1,
                  textTransform: "uppercase",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {workFlow?.data?.documentName}
              </Typography>
              <Chip
                label={t("signing.download_completed")}
                component="a"
                color={checkWorkFlowStatus ? "primary" : undefined}
                disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",
                  height: "36px",
                  fontWeight: "500",
                  borderRadius: "25px",
                  color: "signingWFBackground.main",
                  gap: "10px",
                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                  },
                  "& .MuiChip-label": {
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  },
                }}
                href={`${window.location.origin}/view/uiApi/signing/${signingToken}/download`}
                icon={
                  <SaveAltIcon fontSize="small" color="borderColor.light" />
                }
                clickable
              />
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
          {workFlow.data && field && (
            <SigningContent
              workFlow={workFlow.data}
              page="document"
              qrSigning={signingToken}
              field={field}
            />
          )}
        </Container>
        <Cookie />
      </Stack>
    );
  }
};

export default PageDocument;
