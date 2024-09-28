import i18n from "@/utils/languages/i18n";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom/dist";

export const LanguageSelect = ({ color = "white" }) => {
  const location = useLocation();
  const isValidationPath = location.pathname.includes("/validation");

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let lang = null;
  if (
    typeof window.localStorage === "object" &&
    typeof window.localStorage?.getItem !== "undefined"
  ) {
    lang = localStorage.getItem("language");
  }
  if (!lang) {
    lang = "English";
    if (
      typeof window.localStorage === "object" &&
      typeof window.localStorage?.setItem !== "undefined"
    ) {
      localStorage.setItem("language", "English");
    } else {
      console.error("localStorage is not available!");
    }
  }

  useEffect(() => {
    if (lang) {
      switch (lang) {
        case "English":
          i18n.changeLanguage("en");
          break;
        case "Việt Nam":
          i18n.changeLanguage("vi");
          break;
        case "Germany":
          i18n.changeLanguage("ger");
          break;
        case "China":
          i18n.changeLanguage("china");
          break;
        case "Estonian":
          i18n.changeLanguage("esto");
          break;
        case "Russian":
          i18n.changeLanguage("rus");
          break;
        default:
          break;
      }
    }
  }, []);

  const handleLanguage = (lang) => {
    // setLanguage(lang);
    handleClose();
    switch (lang) {
      case "English":
        i18n.changeLanguage("en");
        break;
      case "Việt Nam":
        i18n.changeLanguage("vi");
        break;
      case "Germany":
        i18n.changeLanguage("ger");
        break;
      case "China":
        i18n.changeLanguage("china");
        break;
      case "Estonian":
        i18n.changeLanguage("esto");
        break;
      case "Russian":
        i18n.changeLanguage("rus");
        break;
      default:
        break;
    }
    localStorage.setItem("language", lang);
  };
  return (
    <Box>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        style={{ color: color, zIndex: "2" }}
        disabled={isValidationPath}
        sx={{
          p: 0,
        }}
      >
        {lang}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        // keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleLanguage("Việt Nam")}>Việt Nam</MenuItem>
        <MenuItem onClick={() => handleLanguage("English")}>English</MenuItem>
        <MenuItem onClick={() => handleLanguage("Germany")}>Germany</MenuItem>
        <MenuItem onClick={() => handleLanguage("China")}>China</MenuItem>
        <MenuItem onClick={() => handleLanguage("Estonian")}>Estonian</MenuItem>
        <MenuItem onClick={() => handleLanguage("Russian")}>Russian</MenuItem>
      </Menu>
    </Box>
  );
};
LanguageSelect.propTypes = {
  color: PropTypes.string,
};
export default LanguageSelect;
