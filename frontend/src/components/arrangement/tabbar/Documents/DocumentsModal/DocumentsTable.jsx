/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import * as React from "react";
import { ReactComponent as PencilIcon } from "@/assets/images/svg/pencil_wait.svg";
import { ReactComponent as QuestionIcon } from "@/assets/images/svg/question.svg";
import { ReactComponent as UserCheckIcon } from "@/assets/images/svg/uil_user-check.svg";
import { Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import {
  MobileDateTimePicker,
  PickersLayoutContentWrapper,
  PickersLayoutRoot,
  usePickerLayout,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DocumentsEdit from "./DocumentsEdit";

function MyCustomLayout(props) {
  // const actionClear = { actions: ["clear"] };
  const { t } = useTranslation();
  const { toolbar, tabs, content, actionBar, onClear, onCancel } =
    usePickerLayout(props);
  const actions = [
    { text: t("0-common.done"), method: () => actionBar.props.onAccept() },
    {
      text: t("0-common.clear"),
      method: () => {
        actionBar.props.onClear();
      },
    },
  ];

  // const CustomToolbar = React.cloneElement(toolbar, {
  //   children: React.Children.map(toolbar.props.children, (child) => {
  //     if (
  //       child &&
  //       child.type &&
  //       child.type.name === "span" &&
  //       child.props.className &&
  //       child.props.className.includes("MuiTypography-root")
  //     ) {
  //       return React.cloneElement(child, {
  //         style: {
  //           display: "none",
  //         },
  //       });
  //     }
  //     return child;
  //   }),
  // });

  // const { dateTimeValue, setDateTimeValue } = props;
  // console.log("dateTimeValue: ", dateTimeValue);

  // const handleDateTimeChange = (newValue) => {
  //   setDateTimeValue(newValue); // Cập nhật giá trị DateTime mới vào state bên ngoài
  // };

  // Put the action bar before the content
  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: "none",
          width: "320px",
          borderBottom: "1px",
          "& .MuiDateCalendar-root": {
            maxHeight: "300px",
          },
        }}
      >
        {toolbar}
        {tabs}
        <Box />
        {content}
        <Box
          sx={{
            borderTop: "1px solid var(--Gray-200, #E5E7EB)",
          }}
        >
          {actions.map(({ text, method }, index) => (
            <Button
              key={text}
              variant="contained"
              onClick={method}
              sx={{
                margin: 1,
                float: "right",
                borderRadius: "10px",
                "& .MuiButtonBase-root": {
                  color: "#FFFFFF",
                },
              }}
            >
              {text}
            </Button>
          ))}
        </Box>
      </Box>
    </React.Fragment>
    // <PickersLayoutRoot ownerState={props}>
    //   {/* {toolbar} */}
    //   {/* {actionBar} */}
    //   <PickersLayoutContentWrapper
    //     sx={{
    //       "& .MuiDateCalendar-root ": {
    //         height: "290px",
    //         width: "300px",
    //       },
    //     }}
    //   >
    //     {/* {tabs} */}
    //     {content}

    //     {/* <Box
    //       sx={{
    //         paddingLeft: "15px",
    //         paddingRight: "15px",
    //       }}
    //     >
    //       <div style={{ borderTop: "1px solid #F0F3F7" }}></div>
    //       <LocalizationProvider dateAdapter={AdapterDayjs}>
    //         <DemoContainer components={["TimePicker"]} sx={{ height: "57px" }}>
    //           <TimePicker label="Time picker" />
    //         </DemoContainer>
    //       </LocalizationProvider>
    //     </Box> */}
    //     <Box
    //       sx={{
    //         paddingLeft: "15px",
    //         paddingRight: "15px",
    //       }}
    //     >
    //       <FormControlLabel
    //         sx={{
    //           "& .MuiTypography-root ": {
    //             color: "#1F2937",
    //             fontFamily: "Montserrat",
    //             fontSize: "12px",
    //             fontWeight: "500",
    //           },
    //         }}
    //         control={<Checkbox defaultChecked />}
    //         label="Do not allow signing after deadline"
    //       />
    //     </Box>
    //     <Box
    //       sx={{
    //         textAlign: "center",
    //         paddingBottom: "10px",
    //         paddingLeft: "309px",
    //       }}
    //     >
    //       {actions.map(({ text, method }, index) => (
    //         <Button
    //           key={text}
    //           variant="contained"
    //           onClick={method} // Gắn hàm xử lý cho sự kiện onClick của nút
    //           sx={{
    //             width: "65.13px",
    //             height: "36.5px",
    //             borderRadius: "10px",
    //             "& .MuiButtonBase-root": {
    //               color: "#FFFFFF",
    //             },
    //             marginLeft: index !== 0 ? "10px" : 0,
    //           }}
    //         >
    //           {text}
    //         </Button>
    //       ))}
    //       {/* <Button
    //         variant="contained"
    //         sx={{
    //           width: "65.13px",
    //           height: "36.5px",
    //           borderRadius: "10px",
    //           "& .MuiButtonBase-root": {
    //             color: "#FFFFFF",
    //           },
    //         }}
    //       >
    //         {actionBar}
    //       </Button> */}
    //     </Box>
    //   </PickersLayoutContentWrapper>
    // </PickersLayoutRoot>
  );
}

const DocumentsTable = ({
  dateTimeString,
  workFlow,
  updateDocumentsSetting,
  setDateTimeString,
}) => {
  // console.log("workFlow: ", workFlow);
  const { t } = useTranslation();
  // const [open, setOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [layout, setLayout] = useState(undefined);
  // console.log(new Date(workFlow.deadlineAt));
  const [dateTimeValue, setDateTimeValue] = useState(
    workFlow.deadlineAt ? dayjs(workFlow.deadlineAt) : null
  ); // State để lưu trữ giá trị DateTime

  const onClear = () => {
    // Thêm logic xử lý khi nhấn vào nút "Clear"
    setDateTimeValue(null);
  };
  const handleDateTimeChange = (newValue) => {
    // setDateTimeValue(newValue);
    // setDateTimeString(dayjs(newValue).format("YYYY-MM-DD HH:mm:ss"));
    if (newValue === null || (newValue && newValue.isValid())) {
      setDateTimeValue(newValue);
      setDateTimeString(dayjs(newValue).format("YYYY-MM-DD HH:mm:ss"));
    } else {
      console.error("Invalid date value: ", newValue);
    }
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [levels, setLevels] = useState(workFlow.signatureLevels || 2);

  return (
    <div>
      <Typography variant="h6" fontWeight="bold" pt={1}>
        {t("arrangement.set_signing_deadline")}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={[
            "DateTimePicker",
            "MobileDateTimePicker",
            "DesktopDateTimePicker",
            "StaticDateTimePicker",
          ]}
          sx={{
            "& .MuiStack-root": {
              overflow: "hidden",
              width: "219px",
              borderColor: "none",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "none",
            },
            "& .MuiDialog-paper.MuiDialog-paperScrollPaper": {
              borderRadius: "10px solid",
            },
          }}
        >
          <DemoItem>
            <MobileDateTimePicker
              value={dateTimeValue}
              format="DD/MM/YYYY HH:mm"
              onChange={handleDateTimeChange}
              minDate={dayjs(new Date())}
              slots={{
                layout: (props) => (
                  <MyCustomLayout
                    {...props}
                    dateTimeValue={dateTimeValue} // Truyền giá trị DateTime vào MyCustomLayout
                    setDateTimeValue={setDateTimeValue} // Callback để cập nhật giá trị DateTime
                    format="DD/MM/YYYY HH:mm a"
                    // minDate={dayjs(new Date())}
                    onClick={() => {
                      updateDocumentsSetting(dateTimeString);
                    }}
                    dateTimeString={dateTimeString}
                    // onClear={onClear}
                  />
                ),
                mobilePaper: (props) => (
                  <Box
                    {...props}
                    sx={{
                      // width: "100%",
                      backgroundColor: "dialogBackground.main",
                      "& .MuiTypography-root.MuiTypography-overline": {
                        display: "none",
                      },
                      "& .MuiButtonBase-root .MuiPickersToolbarText-root": {
                        fontSize: "20px",
                      },
                      "& .MuiDateTimePickerToolbar-separator": {
                        lineHeight: "4",
                      },
                      "& .MuiTimeClock-root": {
                        minHeight: "300px",
                        itemAlign: "center",
                        justifyContent: "center",
                      },
                      borderRadius: "10px",
                      minHeight: "497.36px",
                    }}
                  ></Box>
                ),
              }}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={["DateTimePicker"]}
          sx={{
            "& .MuiStack-root": {
              overflow: "hidden",
              width: "219px",
              borderColor: "none",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "none",
            },
          }}
        >
          <DemoItem>
            <DateTimePicker
              value={dateTimeValue}
              // format="DD/MM/YYYY HH:mm a"
              format="DD/MM/YYYY HH:mm"
              onChange={handleDateTimeChange}
              minDate={dayjs(new Date())}
              // minTime={dayjs(new Date())}
              slots={{
                layout: (props) => (
                  <MyCustomLayout
                    {...props}
                    dateTimeValue={dateTimeValue} // Truyền giá trị DateTime vào MyCustomLayout
                    setDateTimeValue={setDateTimeValue} // Callback để cập nhật giá trị DateTime
                    format="DD/MM/YYYY HH:mm a"
                    // minDate={dayjs(new Date())}
                    onClick={() => {
                      updateDocumentsSetting(dateTimeString);
                    }}
                    dateTimeString={dateTimeString}
                    // onClear={onClear}
                  />
                ),
              }}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider> */}
      <Box>
        <Grid container spacing={0} sx={{ flexGrow: 0 }}>
          <Typography
            fontSize="12px"
            color="#1F2937"
            fontWeight="bold"
            pt={2}
            pr={5}
            display="inline-block"
            textAlign="center"
          >
            {t("arrangement.allowed_e-signature_levels")}
          </Typography>
          <div
            style={{
              display: "inline-block",
              paddingTop: "12px",
            }}
          >
            <div
              style={{
                width: "125px",
                height: "24px",
                display: "inline-block",
                background: "#EEE",
                textAlign: "center",
                borderRadius: "10px",
                border: "1px solid var(--Gray-200, #E5E7EB)",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              }}
            >
              <SvgIcon
                // color="primary"
                sx={{
                  fontSize: 15,
                  color: "primary.main",
                  display: "inline-block",
                  marginTop: "4px",
                }}
                viewBox={"0 0 15 14"}
              >
                <UserCheckIcon />
              </SvgIcon>
              <Typography
                sx={{
                  color: "#1F2937",
                  display: "inline-block",
                  fontSize: 12,
                  fontWeight: "bold",
                  verticalAlign: "middle", // Canh chỉnh theo chiều dọc
                  paddingLeft: "10px",
                  paddingBottom: "5px",
                }}
              >
                {workFlow.signatureLevels === 1
                  ? t("arrangement.QES_only")
                  : workFlow.signatureLevels === 2
                  ? t("arrangement.all_levels")
                  : t("arrangement.all_levels")}
              </Typography>
            </div>
            <div
              style={{
                width: "110px",
                height: "24px",
                display: "inline-block",
                background: "#FFF",
                textAlign: "center",
                borderRadius: "10px",
                border: "1px solid var(--Gray-200, #E5E7EB)",
                marginLeft: "30px",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
                cursor: "pointer",
              }}
              onClick={handleOpen}
            >
              <SvgIcon
                // color="primary"
                sx={{
                  fontSize: 14.5,
                  color: "primary.main",
                  display: "inline-block",
                  marginTop: "4px",
                }}
                viewBox={"0 0 16 16"}
              >
                <PencilIcon />
              </SvgIcon>
              <Typography
                sx={{
                  color: "#1F2937",
                  display: "inline-block",
                  fontSize: 12,
                  fontWeight: "bold",
                  verticalAlign: "middle", // Canh chỉnh theo chiều dọc
                  paddingLeft: "10px",
                  paddingBottom: "5px",
                }}
              >
                {t("arrangement.edit")}
              </Typography>
            </div>
          </div>
        </Grid>
      </Box>
      <Grid container spacing={0} sx={{ flexGrow: 0 }}>
        <Grid xs={0}>
          <Checkbox
            defaultChecked
            style={{
              maxWidth: "4.333333%",
            }}
          />
        </Grid>
        <Grid container xs={11} pt={1}>
          <Grid item>
            <span
              style={{
                color: "#1F2937",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {t("arrangement.documentsSetting1")}
            </span>
          </Grid>
          <Grid item style={{ marginTop: "2px", paddingLeft: "5px" }}>
            <QuestionIcon sx={{ width: "12px", height: "12px" }} />
          </Grid>
        </Grid>
      </Grid>
      <Alert
        severity="warning"
        sx={{
          // "& .MuiPaper-root": {
          //   background: "#FEFCE8",
          // },
          background: "#FEFCE8",
          color: "#A16207",
        }}
      >
        {t("arrangement.documentsSetting2")}
      </Alert>
      <Grid container spacing={0} sx={{ flexGrow: 0 }}>
        <Grid xs={0}>
          <Checkbox
            style={{
              maxWidth: "4.333333%",
            }}
          />
        </Grid>
        <Grid xs={11} pt={1}>
          <span
            style={{
              // display: "inline-block",
              color: "#1F2937",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {t("arrangement.documentsSetting3")}
          </span>
        </Grid>
      </Grid>
      {/* <Box sx={{ width: 1 }}>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
          <Box gridColumn="span 1"></Box>
          <Box gridColumn="span 11"></Box>
        </Box>
      </Box> */}
      <DocumentsEdit
        workFlow={workFlow}
        open={open}
        handleClose={handleClose}
        title={t("arrangement.documentsSetting4")}
        dateTimeString={dateTimeString}
        levels={levels}
        setLevels={setLevels}
      />
    </div>
  );
};

DocumentsTable.propTypes = {
  data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default DocumentsTable;
