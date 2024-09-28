import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router-dom";

export const MainLayout = () => {
  const { signing_token: signingToken } = useParams();

  // const { batch_token } = useParams();

  const { data: headerFooter } = useQuery({
    queryKey: ["checkHeader"],
    queryFn: () => apiService.checkHeaderFooter(signingToken),
    enabled: signingToken !== undefined,
  });
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "signingBackground.main",
        padding:
          headerFooter?.data.headerVisible !== 0
            ? (theme) =>
                `${theme.GoPaperless.headerHeight} 0 ${theme.GoPaperless.footerBarHeight}`
            : 0,
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          // height:
          //   headerFooter?.data.headerVisible !== 0
          //     ? (theme) =>
          //         `calc(100vh - ${theme.GoPaperless.headerHeight} - ${theme.GoPaperless.footerBarHeight})`
          //     : "100vh",

          height:
            headerFooter?.data.headerVisible !== 0
              ? (theme) => ({
                  xs: `calc(100vh - ${theme.GoPaperless.headerHeight} - ${theme.GoPaperless.footerBarHeightXs})`,
                  lg: `calc(100vh - ${theme.GoPaperless.headerHeight} - ${theme.GoPaperless.footerBarHeight})`,
                })
              : "100vh",

          mx: "auto",
        }}
      >
        {headerFooter?.data.headerVisible !== 0 && (
          <Header headerFooter={headerFooter?.data} />
        )}
        <Outlet />
        {headerFooter?.data.headerVisible !== 0 && (
          <Footer headerFooter={headerFooter?.data} />
        )}
      </Container>
    </Box>
  );
};

export default MainLayout;
