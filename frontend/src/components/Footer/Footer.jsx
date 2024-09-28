import EmailIcon from "@mui/icons-material/Email";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LanguageSelect } from "../Languages";

export const Footer = ({ headerFooter }) => {
  const { t } = useTranslation();
  const check =
    headerFooter &&
    headerFooter.metadataGatewayView !== "null" &&
    headerFooter.metadataGatewayView !== undefined;
  let metaData = null;
  if (check) {
    metaData = JSON.parse(headerFooter.metadataGatewayView);
  }
  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      justifyContent={{ xs: "center", lg: "space-between" }}
      alignItems={{ xs: "flex-start", lg: "center" }}
      component={"footer"}
      height={{ xs: "100px", lg: "55px" }}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        px: 5,
        background: check ? metaData.footerBackgroundColor : "#0b95e5",
        color: check ? metaData.footerTextColor : "#FFF",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 0, lg: 1 }}
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
        }}
      >
        <Typography
          variant="h6"
          color={check ? metaData.footerTextColor : "#FFF"}
          // sx={{ textWrap: "nowrap" }}
        >
          {t("0-common.version")} {check ? metaData.version : "1.20231116"}{" "}
          {t("0-common.copyright")} {new Date().getFullYear()} ©
        </Typography>
        {/* <Typography
          variant="h6"
          color={check ? metaData.footerTextColor : "#FFF"}
          // sx={{ textWrap: "nowrap" }}
        >
          {t("0-common.copyright")} {new Date().getFullYear()} ©
        </Typography> */}
        <Typography
          variant="h6"
          color={check ? metaData.footerTextColor : "#FFF"}
          // sx={{ textWrap: "wrap" }}
        >
          {check
            ? metaData.companyName
            : "Mobile-ID Technologies and Service Joint Stock company"}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <LanguageSelect />
        <EmailIcon
          sx={{
            fontSize: "15px",
            display: { xs: "none", md: "block" },
          }}
        />
        <Typography
          variant="h6"
          sx={{ textWrap: "nowrap" }}
          color={check ? metaData.footerTextColor : "#FFF"}
        >
          {check ? metaData.email : "info@mobile-id.vn"}
        </Typography>

        <SvgIcon
          sx={{ fontSize: "15px", display: { xs: "none", md: "block" } }}
        >
          <svg
            fill="#ffffff"
            width="20"
            height="15"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 612.001 612"
            xmlSpace="preserve"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <g>
                <path d="M588.074,199.311c-11.954-12.377-25.671-16.74-35.288-18.225c-8.256-62.36-15.939-94.828-275.988-94.828 C16.75,86.258,0,125.46,0,193.498v11.605c0,18.411,14.925,33.336,33.336,33.336h83.427c18.411,0,33.336-14.925,33.336-33.336 v-11.605c0-52.705,80.699-54.319,126.698-54.319c45.998,0,126.697,1.614,126.697,54.319v11.605 c0,18.411,14.926,33.336,33.337,33.336h83.427c18.411,0,33.337-14.925,33.337-33.336v-4.464c6.146,1.51,13.907,4.794,20.776,11.905 c16.747,17.347,22.305,50.861,16.068,96.927c-10.815,79.816-42.181,108.325-75.585,117.813v-13.886 c0-14.097-3.524-28.05-10.668-40.242c-33.336-57.053-80.674-107.677-140.823-152.301v-33.717c0-2.619-2.143-4.762-4.762-4.762 h-49.481c-2.667,0-4.762,2.143-4.762,4.762v33.527h-56.481v-33.527c0-2.619-2.143-4.762-4.762-4.762h-49.529 c-2.62,0-4.762,2.143-4.762,4.762v33.527C128.581,265.384,81.195,316.007,47.81,373.156c-7.144,12.192-10.668,26.146-10.668,40.242 v31.384c0,44.72,36.242,80.961,80.961,80.961h315.793c44.018,0,79.744-35.135,80.855-78.884 c53.54-12.54,83.912-56.224,94.562-134.831C616.467,259.232,609.318,221.31,588.074,199.311z M358.727,414.231l-31.774-11.313 c3.371-6.792,5.314-14.421,5.314-22.522c0-28.003-22.716-50.72-50.767-50.72c-28.003,0-50.767,22.717-50.767,50.72 c0,28.051,22.764,50.768,50.767,50.768c10.371,0,20.003-3.121,28.037-8.453l17.429,28.648 c-13.129,8.43-28.707,13.379-45.465,13.379c-46.576,0-84.294-37.766-84.294-84.341c0-46.529,37.718-84.294,84.294-84.294 c46.576,0,84.342,37.766,84.342,84.294C365.842,392.437,363.275,403.867,358.727,414.231z" />
              </g>
            </g>
          </svg>
        </SvgIcon>
        <Typography
          variant="h6"
          color={check ? metaData.footerTextColor : "#FFF"}
        >
          {check ? metaData.phone : "+84978377152"}
        </Typography>
      </Stack>
    </Stack>
  );
};
Footer.propTypes = {
  headerFooter: PropTypes.shape({
    metadataGatewayView: PropTypes.string,
    loGo: PropTypes.string,
  }),
};
export default Footer;
