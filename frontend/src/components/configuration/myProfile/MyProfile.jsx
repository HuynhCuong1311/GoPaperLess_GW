import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

export const MyProfile = ({ data }) => {
  // console.log("data: ", data);
  return (
    <Box
      sx={{
        maxWidth: "1114px",
        margin: "24px auto 36px",
        padding: "24px 30px",
        backgroundColor: "signingWFBackground.main",
        borderRadius: "10px",
      }}
    >
      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: "600",
          lineHeight: "36px",
          color: "#26293F",
        }}
      >
        My Profile
      </Typography>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          Name
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            lineHeight: "18px",
            marginTop: "4px",
            color: "#262626",
          }}
        >
          {data?.general?.name}
        </Typography>
      </Box>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          Surname
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            lineHeight: "18px",
            marginTop: "4px",
            color: "#262626",
          }}
        >
          {data?.general?.surname}
        </Typography>
      </Box>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          Email
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            lineHeight: "18px",
            marginTop: "4px",
            color: "#262626",
          }}
        >
          {data?.general?.email}
        </Typography>
      </Box>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          Code
        </Typography>
      </Box>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          Role
        </Typography>
      </Box>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          Phone
        </Typography>
        {/* <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            lineHeight: "18px",
            marginTop: "4px",
            color: "#262626",
          }}
        >
          Khong co
        </Typography> */}
      </Box>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          Company
        </Typography>
      </Box>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          Country code
        </Typography>
      </Box>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          City
        </Typography>
      </Box>
      <Box sx={{ padding: "16px 0", borderBottom: "1px solid #E2E8F0" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#6B7280",
          }}
        >
          Postal code
        </Typography>
      </Box>
    </Box>
  );
};

MyProfile.propTypes = {
  data: PropTypes.object,
};

export default MyProfile;
