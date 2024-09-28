import lolo_mobileid from "@/assets/images/cookie/Mobileid.png";
import cookie from "@/assets/images/cookie/cookie_fill.png";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CloseIcon from "@mui/icons-material/Close";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Cookie = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(true);

  const handleSwitch1 = (event) => {
    event.stopPropagation();
    setChecked1(event.target.checked);
  };

  const handleSwitch2 = (event) => {
    event.stopPropagation();
    setChecked2(event.target.checked);
  };

  const handleSwitch3 = (event) => {
    event.stopPropagation();
    setChecked3(event.target.checked);
  };

  useEffect(() => {
    const resizeHandler = () => {
      const viewerContainer = document.getElementById("cookieSetting");
      if (viewerContainer) {
        const windowHeight = window.innerHeight;
        const offsetTop = viewerContainer.offsetTop;
        const viewerHeight = windowHeight - offsetTop;
        viewerContainer.style.height = viewerHeight + "px";
      }
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  //translate
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 3,
      }}
    >
      <Button
        sx={{
          position: "fixed",
          bottom: { xs: "10rem", lg: "4rem" },
          left: "1rem",
          zIndex: 3,
          padding: "0",
          borderRadius: "50%",
          height: "64px",
        }}
        onClick={toggleDrawer}
        title="Cookie Settings"
      >
        <img src={cookie} height="50" width="50"></img>
      </Button>
      <Box>
        <Drawer
          open={isOpen}
          onClose={toggleDrawer}
          direction="left"
          className="drawer-container"
        >
          <Box sx={{ width: "480px", height: "auto" }}>
            <Box
              className="header-cookie"
              sx={{
                display: "flex",
                alignItems: "center",
                height: "80px",
                borderBottom: "1px solid #e9e9e9",
                color: "#26293F",
                fontWeight: "bold",
                fontSize: "0.75rem",
                lineHeight: "1.2rem",
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={lolo_mobileid}
                  alt="MobileID"
                  style={{
                    width: "50%",
                    height: "80px",
                  }}
                />
              </Box>
              <Box sx={{}}>
                <Button
                  sx={{
                    width: "100%",
                    height: "64px",
                    borderRadius: "0",
                    color: "#26293F",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                    lineHeight: "1.2rem",
                    textTransform: "none",
                    padding: "0",
                  }}
                  onClick={toggleDrawer}
                >
                  <CloseIcon />
                </Button>
              </Box>
            </Box>
            <Box
              id=""
              sx={{
                height: "calc(100vh - 200px)",
                overflow: "auto",
                margin: "0 10px 0 25px",
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    paddingTop: "20px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {t("cookie.cookieSetting1")}
                </Typography>
              </Box>
              <Box
                sx={{
                  color: "#26293F",
                  fontSize: "0.8rem",
                  lineHeight: "1.75",
                  marginBottom: "25px",
                }}
              >
                <span> {t("cookie.cookieSetting2")}</span>
                <br />
                <Link to="https://paperless-gw.mobile-id.vn/compliance/cookie-policy">
                  {t("cookie.cookieSetting3")}
                </Link>
              </Box>
              {/* Khi nhấn vào tắt Switch hiển thị  button Allow all*/}
              <Button
                variant="contained"
                sx={{ fontFamily: "Montserrat", textTransform: "capitalize" }}
                style={{
                  display:
                    !checked1 || !checked2 || !checked3 ? "block" : "none",
                }}
                onClick={handleClose}
              >
                {t("cookie.cookieSetting16")}
              </Button>
              {/* ---------------------------- Manage consent preferences----------------------------------*/}
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    paddingTop: "20px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {t("cookie.cookieSetting4")}
                </Typography>
              </Box>
              <Box>
                <Box
                  sx={{
                    color: "#26293F",
                    fontSize: "0.8rem",
                    lineHeight: "1.75",
                    marginBottom: "25px",
                  }}
                >
                  <Accordion
                    expanded={expanded === "panel1"}
                    onChange={handleChange("panel1")}
                  >
                    <AccordionSummary
                      aria-controls="panel1d-content"
                      id="panel1d-header"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Montserrat",
                          fontSize: "1em",
                          lineHeight: " 1.75",
                          fontWeight: "700",
                          marginRight: "auto",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {t("cookie.cookieSetting5")}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#1565c0",
                          fontFamily: "Montserrat",
                          fontSize: "1em",
                          lineHeight: " 1.75",
                          fontWeight: "700",
                          marginRight: "10px",
                        }}
                      >
                        {t("cookie.cookieSetting6")}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        style={{
                          fontFamily: "Montserrat",
                          fontSize: "1em",
                          lineHeight: " 1.75",
                        }}
                      >
                        {t("cookie.cookieSetting7")}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    expanded={expanded === "panel2"}
                    onChange={handleChange("panel2")}
                  >
                    <AccordionSummary
                      aria-controls="panel2d-content"
                      id="panel2d-header"
                    >
                      <Typography
                        style={{
                          fontFamily: "Montserrat",
                          fontSize: "1em",
                          lineHeight: " 1.75",
                          fontWeight: "700",
                          marginRight: "auto",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {t("cookie.cookieSetting8")}
                      </Typography>
                      <Switch
                        {...label}
                        defaultChecked={checked1}
                        onClick={handleSwitch1}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        style={{
                          fontFamily: "Montserrat",
                          fontSize: "1em",
                          lineHeight: " 1.75",
                        }}
                      >
                        {t("cookie.cookieSetting9")}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    expanded={expanded === "panel3"}
                    onChange={handleChange("panel3")}
                  >
                    <AccordionSummary
                      aria-controls="panel3d-content"
                      id="panel3d-header"
                    >
                      <Typography
                        style={{
                          fontFamily: "Montserrat",
                          fontSize: "1em",
                          lineHeight: " 1.75",
                          fontWeight: "700",
                          marginRight: "auto",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {t("cookie.cookieSetting10")}
                      </Typography>
                      <Switch
                        {...label}
                        defaultChecked={checked2}
                        onClick={handleSwitch2}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        style={{
                          fontFamily: "Montserrat",
                          fontSize: "1em",
                          lineHeight: " 1.75",
                        }}
                      >
                        {t("cookie.cookieSetting11")}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    expanded={expanded === "panel4"}
                    onChange={handleChange("panel4")}
                  >
                    <AccordionSummary
                      aria-controls="panel3d-content"
                      id="panel3d-header"
                    >
                      <Typography
                        style={{
                          fontFamily: "Montserrat",
                          fontSize: "1em",
                          lineHeight: " 1.75",
                          fontWeight: "700",
                          marginRight: "auto",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {t("cookie.cookieSetting12")}
                      </Typography>
                      <Switch
                        {...label}
                        defaultChecked={checked3}
                        onClick={handleSwitch3}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        style={{
                          fontFamily: "Montserrat",
                          fontSize: "1em",
                          lineHeight: " 1.75",
                        }}
                      >
                        {t("cookie.cookieSetting13")}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
            </Box>
            <Box
              className="footer-cookie "
              sx={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                maxHeight: "calc(100vh - 160px)",
                borderTop: "1px solid #d8d8d8",
                backgroundColor: "#fff",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
                mb={2}
                sx={{
                  marginLeft: "25px",
                  marginRight: "25px",
                  "@media screen and (max-width: 600px)": {
                    display: "block",
                  },
                }}
              >
                <Button
                  sx={{
                    fontFamily: "Montserrat",
                    textTransform: "capitalize",
                    minWidth: "calc(50% - 5px)",
                    width: "calc(100% - 5px)",
                    "@media screen and (max-width: 600px)": {
                      // Điện thoại: Chiếm toàn bộ width
                      minWidth: "unset",
                      width: "calc(100% - 5px)",
                      marginBottom: "10px",
                    },
                    marginRight: "10px",
                  }}
                  p={4}
                  className="btn-left"
                  variant="outlined"
                  onClick={handleClose}
                >
                  {t("cookie.cookieSetting14")}
                </Button>
                <Button
                  sx={{
                    fontFamily: "Montserrat",
                    textTransform: "capitalize",
                    minWidth: "calc(50% - 5px)",
                    width: "calc(100% - 5px)",
                    "@media screen and (max-width: 600px)": {
                      // Điện thoại: Chiếm toàn bộ width
                      minWidth: "unset",
                      width: "calc(100% - 5px)",
                    },
                  }}
                  p={4}
                  className="btn-left"
                  variant="contained"
                  onClick={handleClose}
                >
                  <Box sx={{ whiteSpace: "nowrap" }}>
                    {t("cookie.cookieSetting15")}
                  </Box>
                </Button>
              </Box>
              <Box
                sx={{
                  paddingLeft: "25px",
                  height: "30px",
                  backgroundColor: "#f4f4f4",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Link
                  to="https://www.onetrust.com/products/cookie-consent/"
                  style={{
                    display: "inline-block",
                    margin: ".25rem",
                  }}
                >
                  {" "}
                  <img src="https://cdn.cookielaw.org/logos/static/powered_by_logo.svg"></img>
                </Link>
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};
