import "@/assets/style/next.css";
import { useAppContext } from "@/hook/use-appContext";
import { apiService } from "@/services/api_service";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Next } from "../next";
import { PdfViewer, PdfViewerDocument } from "./PdfViewer";
import { TabBar } from "./TabBar";

export const SigningContent = ({
  workFlow,
  page,
  qrSigning,
  field,
  signer,
}) => {
  const [qryptoInfo, setQryptoInfo] = useState(null);
  const { data: signedInfo } = useQuery({
    queryKey: ["getSignedInfo"],
    queryFn: () => apiService.getSignedInfo(workFlow),
    enabled: Object.keys(workFlow).length > 0,
  });
  const [newFields, setNewFields] = useState(
    Object.entries(field)
      .filter(
        ([key, value]) =>
          key !== "textField" &&
          key !== "qr" &&
          key !== "qrypto" &&
          Array.isArray(value)
      ) // Loại bỏ các phần tử không phải là mảng
      .flatMap(([, value]) => value)
      .filter(
        (item) =>
          item.process_status === "UN_PROCESSED" &&
          (item.remark?.includes(signer?.signerId) ||
            item.remark?.includes(workFlow.workFlowId + "_" + signer?.signerId))
      )
  );

  useEffect(() => {
    setNewFields(
      Object.entries(field)
        .filter(
          ([key, value]) =>
            key !== "textField" &&
            key !== "qr" &&
            key !== "qrypto" &&
            Array.isArray(value)
        ) // Loại bỏ các phần tử không phải là mảng
        .flatMap(([, value]) => value)
        .filter(
          (item) =>
            item.process_status === "UN_PROCESSED" &&
            (item.remark?.includes(signer?.signerId) ||
              item.remark?.includes(
                workFlow.workFlowId + "_" + signer?.signerId
              ))
        )
    );
  }, [field]);
  // console.log("NewFields: ", newFields);

  const [value, setValue] = useState(null);
  // const [blink, setBlink] = useState(false);
  const { blink, sigSelected, handleSigSelected } = useAppContext();

  useEffect(() => {
    if (
      page !== "document" &&
      signer.signerStatus === 1 &&
      newFields.length > 0
    ) {
      setValue(1);
    } else {
      setValue(null);
    }
  }, [newFields]);

  // const timeoutRef = useRef(null);

  const handleChange = () => {
    // console.log("object");
    // if (timeoutRef.current) {
    //   clearTimeout(timeoutRef.current);
    // }
    // setBlink(true);
    // setValue(value === newFields.length ? 1 : value + 1);
    // timeoutRef.current = setTimeout(() => setBlink(false), 5000);

    setValue(value === newFields.length ? 1 : value + 1);
    handleSigSelected(
      value === newFields.length
        ? newFields[0].field_name
        : newFields[value].field_name
    );
  };

  // console.log("newFields: ", newFields);

  //code thêm
  function checkPDFView(page) {
    if (page === "document") {
      return <PdfViewerDocument workFlow={workFlow} />;
    } else {
      return (
        <PdfViewer
          workFlow={workFlow}
          field={{ ...field }}
          fieldSelect={sigSelected}
          setQryptoInfo={setQryptoInfo}
          blink={blink}
        />
      );
    }
  }
  // code thêm

  return (
    <Container
      disableGutters
      maxWidth="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        height: { lg: "100%" },
        border: "1px solid #E8EBF0",
        pt: 2,
        gap: 4,
      }}
    >
      <Box
        width={{ xs: "100%", lg: "72%" }}
        height={{ xs: "500px", lg: "100%" }}
        sx={{
          border: "1px solid #E8EBF0",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          height="53px"
          bgcolor="signingWFBackground.main"
        >
          <Typography
            variant="h6"
            fontWeight={600}
            height={"25px"}
            lineHeight={"25px"}
            bgcolor="signingWFBackground.main"
            // lineHeight="25px"
            pl={2}
          >
            {workFlow.fileName}
          </Typography>
        </Stack>
        <Box overflow="auto" height={{ xs: "500px", lg: "calc(100% - 53px)" }}>
          {/* <PdfViewer workFlow={workFlow} /> code a Cường */}
          {/* code thêm */}
          {checkPDFView(page)}
          {/* code thêm */}
        </Box>
      </Box>
      <Box
        width={{ xs: "100%", lg: "28%" }}
        // height={{ xs: "100%", lg: "100%" }}
      >
        <TabBar
          workFlow={workFlow}
          signedInfo={signedInfo}
          qrSigning={qrSigning}
          qryptoInfo={qryptoInfo}
        />
      </Box>
      {page !== "document" && (
        <Next
          newFields={newFields}
          handleChange={handleChange}
          value={value}
          signer={signer}
        />
      )}
    </Container>
  );
};

SigningContent.propTypes = {
  workFlow: PropTypes.shape({
    // Define the structure of the object if needed
    // For example:
    // key1: PropTypes.string,
    // key2: PropTypes.number,
    fileId: PropTypes.string,
    fileName: PropTypes.string,
    workFlowId: PropTypes.number,
  }),
  page: PropTypes.string,
  qrSigning: PropTypes.string,
  field: PropTypes.object,
  signer: PropTypes.object,
};

export default SigningContent;
