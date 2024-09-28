// import React from 'react'
import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import TabBar from "./tabbar";
import { PdfViewer } from "./pdfReview";
import { useState } from "react";

export const ArragementDocument = ({ workFlow, qrSigning }) => {
  const [tabBar, setTabBar] = useState(0);
  const [attachment, setAttachment] = useState([]);
  const { data: signedInfo } = useQuery({
    queryKey: ["getSignedInfo"],
    queryFn: () => apiService.getSignedInfo(workFlow),
    enabled: Object.keys(workFlow).length > 0,
  });

  return (
    <Container
      disableGutters
      maxWidth="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        height: { lg: "100%" },

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
        <Typography
          variant="h6"
          fontWeight={600}
          height={"50px"}
          lineHeight={"50px"}
          bgcolor="signingWFBackground.main"
          pl={2}
        >
          {workFlow.fileName}
        </Typography>
        <Box overflow="auto" height={{ xs: "500px", lg: "calc(100% - 25px)" }}>
          {/* <PdfViewer workFlow={workFlow} /> code a Cường */}
          {/* code thêm */}
          <PdfViewer
            workFlow={workFlow}
            tabBar={tabBar}
            setAttachment={setAttachment}
          />
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
          tabBar={tabBar}
          setTabBar={setTabBar}
          attachment={attachment}
        />
      </Box>
    </Container>
  );
};

ArragementDocument.propTypes = {
  workFlow: PropTypes.shape({
    // Define the structure of the object if needed
    // For example:
    // key1: PropTypes.string,
    // key2: PropTypes.number,
    fileId: PropTypes.string,
    fileName: PropTypes.string,
  }),
  page: PropTypes.string,
  qrSigning: PropTypes.string,
};

export default ArragementDocument;
