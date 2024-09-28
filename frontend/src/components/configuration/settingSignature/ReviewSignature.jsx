import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";

const SignatureItem = lazy(() =>
  import("@/components/configuration/components/SignatureItem")
);

const ReviewSignature = ({
  state,
  dispatch,
  handleClose,
  // handleRemoveSignature,
}) => {
  const { t } = useTranslation();

  const handleDelete = () => {
    // if (state.index) {
    //   handleRemoveSignature(state.index);
    // } else {
    //   handleClose();
    // }
    handleClose();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction="row"
        gap="16px"
        justifyContent="flex-end"
        alignItems="center"
      >
        <IconButton aria-label="Example" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
        <Chip
          label={t("0-common.edit")}
          // color={checkWorkFlowStatus ? "primary" : "secondary"}
          //   color="success"
          variant="outlined"
          sx={{
            padding: "8px 16px",
            height: "40px",
            fontWeight: "500",
            // border: "2px solid ",
            borderRadius: "25px",
            boxShadow: "0px 0px 2px #DFD9E7 inset",
            backgroundColor: "#fff",
            // backgroundColor: checkWorkFlowStatus ? "#3B82F6" : "#9b9895",
            cursor: "pointer",
            color: "#1E40AF",
            gap: "10px",
            "& span": {
              padding: "0",
            },
            "& svg.MuiChip-icon": {
              margin: "0",
            },
            "& .MuiChip-label": {
              display: { xs: "none", md: "flex" },
            },
          }}
          icon={<CreateIcon fontSize="small" color="borderColor.light" />}
          // clickable
          onClick={() => dispatch({ type: "SET_ACTIVE_STEP", payload: 1 })}
        />
      </Stack>
      <Box
        sx={{
          padding: "25px",
          mt: "10px",
          backgroundColor: "#F7F9FC",
          borderRadius: "4px",
          border: "5px solid white",
          boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.10)",
        }}
      >
        <Box
          sx={{
            height: "134px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #DFDBD6",
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <SignatureItem data={state.data} />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};

ReviewSignature.propTypes = {
  state: PropTypes.object,
  dispatch: PropTypes.func,
  handleClose: PropTypes.func,
  handleRemoveSignature: PropTypes.func,
};

export default ReviewSignature;
