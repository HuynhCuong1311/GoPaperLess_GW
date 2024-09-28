import { Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export const Step2 = ({ setComment }) => {
  const { t } = useTranslation();

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  return (
    <Box>
      <Typography variant="h6" fontWeight={500} mb="15px">
        {t("modal.approve_2")}
      </Typography>
      <TextField
        fullWidth
        size="small"
        margin="normal"
        multiline
        rows={5}
        // defaultValue={item.value}
        onChange={handleCommentChange}
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
        // disabled={true}
        InputProps={{
          // readOnly: true,
          sx: {
            backgroundColor: "signingWFBackground.main",
          },
        }}
      />
    </Box>
  );
};

Step2.propTypes = {
  setComment: PropTypes.func,
};

export default Step2;
