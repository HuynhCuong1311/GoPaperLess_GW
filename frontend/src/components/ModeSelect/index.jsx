import { useColorScheme } from "@mui/material";
import DarkModeOutLinedIcon from "@mui/icons-material/DarkModeOutLined";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const ModeSelect = () => {
  const { mode, setMode } = useColorScheme();
  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dark-light-mode" sx={{ color: "#fff" }}>
        Mode
      </InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="demo-select-small"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light">
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ color: "#fff" }}
          >
            <LightModeIcon fontSize="small" />
            Light
          </Stack>
        </MenuItem>

        <MenuItem value="dark">
          <Stack direction="row" alignItems="center" gap={1}>
            <DarkModeOutLinedIcon fontSize="small" />
            Dark
          </Stack>
        </MenuItem>
        <MenuItem value="system">
          <Stack direction="row" alignItems="center" gap={1}>
            <SettingsBrightnessIcon fontSize="small" />
            System
          </Stack>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default ModeSelect;
