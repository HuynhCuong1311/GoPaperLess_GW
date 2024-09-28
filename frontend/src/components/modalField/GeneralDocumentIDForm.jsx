import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { InputField, SelectField } from "../form";

export const GeneralDocumentIDForm = ({ participants, control }) => {
  // console.log("participants: ", participants);
  const { t } = useTranslation();

  const valid = [
    {
      id: 1,
      label: "Mandatory",
      value: true,
    },
    {
      id: 2,
      label: "None",
      value: false,
    },
  ];

  const font = [
    {
      id: 1,
      label: "Vernada",
      value: "vernada",
    },
  ];

  const fontSize = [
    {
      id: 1,
      label: "13",
      value: 13,
    },
    {
      id: 2,
      label: "14",
      value: 14,
    },
    {
      id: 3,
      label: "18",
      value: 18,
    },
    {
      id: 4,
      label: "20",
      value: 20,
    },
  ];

  const data1 = participants?.map((item) => (
    <MenuItem key={item.id} value={item.signerId}>
      {item.lastName + " " + item.firstName}
    </MenuItem>
  ));

  const data2 = valid?.map((item) => (
    <MenuItem key={item.id} value={item.value}>
      {item.label}
    </MenuItem>
  ));

  const data3 = font?.map((item) => (
    <MenuItem key={item.id} value={item.value}>
      {item.label}
    </MenuItem>
  ));

  const data4 = fontSize?.map((item) => (
    <MenuItem key={item.id} value={item.value}>
      {item.label}
    </MenuItem>
  ));

  // const handleChangeSelect = (event, setSelect) => {
  //   setSelect(event.target.value);
  // };
  return (
    <Box
      sx={{
        "& >.MuiBox-root": {
          marginBottom: "10px",
        },
      }}
    >
      <Box>
        <Typography variant="h6" mb="10px">
          {t("modal.allowed_length")}
        </Typography>

        <InputField
          label=""
          name="length"
          control={control}
          InputLabelProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
          inputProps={{
            sx: {
              py: "11px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
          sx={{ my: 0, height: "45px" }}
        />

        {/* <TextField
          control={control}
          name="length"
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          // defaultValue={signer.lastName + " " + signer.firstName}
          sx={{ my: 0, height: "45px" }}
          InputProps={{
            //   readOnly: true,
            sx: {
              height: "45px",
              backgroundColor: "signingWFBackground.main",
              fontSize: "14px",
            },
          }}
        /> */}
      </Box>
      <Box>
        <Typography variant="h6" mb="10px">
          {t("0-common.documentId")}
        </Typography>

        <InputField
          disabled
          label=""
          name="placeHolder"
          control={control}
          InputLabelProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
          inputProps={{
            sx: {
              py: "11px",
              backgroundColor: "signingWFBackground.main",
            },
          }}
          sx={{ my: 0, height: "45px" }}
        />
        {/* <TextField
          control={control}
          name="placeHolder"
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          // defaultValue={signer.lastName + " " + signer.firstName}
          sx={{ my: 0, height: "45px" }}
          InputProps={{
            //   readOnly: true,
            sx: {
              height: "44px",
              backgroundColor: "signingWFBackground.main",
              fontSize: "14px",
            },
          }}
        /> */}
      </Box>
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Box sx={{ width: "50%" }}>
          <Typography variant="h6" mb="10px">
            {t("modal.font_type")}
          </Typography>
          <FormControl fullWidth>
            {/* <InputLabel size="small" sx={{ fontSize: "14px", mt: "4px" }}>
              Select Font
            </InputLabel> */}

            <SelectField
              name="font"
              control={control}
              label=""
              margin="dense"
              content={data3}
              // onChange={handleChange1}
              sx={{
                backgroundColor: "signingWFBackground.main",
              }}
            />
            {/* <Select
              control={control}
              name="font"
              fullWidth
              size="small"
              margin="dense"
              value={fontType}
              // label="  Select Font"
              sx={{
                my: 0,
                height: "45px",
                backgroundColor: "signingWFBackground.main",
                fontSize: "14px",
              }}
              onChange={(e) => handleChangeSelect(e, setFontType)}
              IconComponent={ExpandMoreIcon}
            >
              <MenuItem value={1}>small</MenuItem>
              <MenuItem value={2}>medium</MenuItem>
              <MenuItem value={3}>bold</MenuItem>
            </Select> */}
          </FormControl>
        </Box>
        <Box sx={{ width: "50%" }}>
          <Typography variant="h6" mb="10px">
            {t("modal.font_size")}
          </Typography>
          <FormControl fullWidth>
            <SelectField
              name="fontSize"
              control={control}
              label=""
              margin="dense"
              content={data4}
              // onChange={handleChange1}
              sx={{
                backgroundColor: "signingWFBackground.main",
              }}
            />
            {/* <Select
              control={control}
              name="fontSize"
              fullWidth
              size="small"
              margin="dense"
              value={fontSize}
              //   label="Select Font"
              sx={{
                my: 0,
                height: "45px",
                backgroundColor: "signingWFBackground.main",
                fontSize: "14px",
              }}
              onChange={(e) => handleChangeSelect(e, setFontSize)}
              IconComponent={ExpandMoreIcon}
            >
              <MenuItem value={1}>10</MenuItem>
              <MenuItem value={2}>12</MenuItem>
              <MenuItem value={3}>20</MenuItem>
            </Select> */}
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

GeneralDocumentIDForm.propTypes = {
  control: PropTypes.object,
  participants: PropTypes.array,
};
