import { ReactComponent as EidIcon } from "@/assets/images/svg/e-id.svg";
import { ReactComponent as MobileIdIcon } from "@/assets/images/svg/mobile-id.svg";
import { ReactComponent as SmartIdIcon } from "@/assets/images/svg/smart-id.svg";
import { ReactComponent as UsbIcon } from "@/assets/images/svg/usb-token.svg";
import ISPluginClient from "@/assets/js/checkid";
import { getLang, getUrlWithoutProtocol } from "@/utils/commonFunction";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import MenuItem from "@mui/material/MenuItem";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { forwardRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { SelectField } from "../../form";
import CheckIdSoft from "./CheckIdSoft";

export const Step2 = forwardRef(
  ({ onStepSubmit, providerName, connectorList, filterConnector }, ref) => {
    // console.log("filterConnector: ", filterConnector);
    // console.log("connectorList: ", connectorList);
    const schema = yup.object().shape({
      provider: yup.string().required("Please Select Signing Method"),
      connector: yup
        .string()
        .required("Please Select Remote Signing Service Provider"),
      messageError: yup.string().when("provider", (provider, schema) => {
        if (
          provider.includes("USB_TOKEN_SIGNING") ||
          provider.includes("ELECTRONIC_ID")
        ) {
          return schema.required(
            "Required software is missing or not available. Download here."
          );
        }
      }),
    });

    // eslint-disable-next-line no-unused-vars
    const { control, handleSubmit, setValue, watch } = useForm({
      defaultValues: {
        provider: "",
        connector: "",
        messageError: "",
      },
      resolver: yupResolver(schema),
    });

    const mapProvider = providerName.reduce((acc, option, i) => {
      switch (option) {
        case "MOBILE_ID_SIGNING":
          acc[i] = {
            label: "Mobile-ID",
            icon: <MobileIdIcon />,
            value: "MOBILE_ID_SIGNING",
          };
          break;
        case "SMART_ID_SIGNING":
          acc[i] = {
            label: "Smart-ID",
            icon: <SmartIdIcon />,
            value: "SMART_ID_SIGNING",
          };
          break;
        case "USB_TOKEN_SIGNING":
          acc[i] = {
            label: "USB-Token",
            icon: <UsbIcon />,
            value: "USB_TOKEN_SIGNING",
          };
          break;
        case "ELECTRONIC_ID":
          acc[i] = {
            label: "Electronic video base Identification",
            icon: <EidIcon />,
            value: "ELECTRONIC_ID",
          };
          break;
        default:
          // Handle unknown signing option
          break;
      }
      return acc;
    }, []);

    const data1 = mapProvider.map((item, i) => {
      return (
        <MenuItem key={i} value={item.value}>
          {item.label}
          <ListItemSecondaryAction>{item.icon}</ListItemSecondaryAction>
        </MenuItem>
      );
    });

    const [data2, setData2] = useState(null);

    const handleChange1 = (e) => {
      setValue("provider", e.target.value);
      setValue("connector", "");
      const filterValue = e.target.value;
      const filterProvider = connectorList?.[filterValue];
      // console.log("filteredData: ", filterProvider);

      if (filterProvider) {
        const filterData = filterProvider.filter((item) =>
          filterConnector.includes(item.connectorName)
        );
        const content = filterData.length > 0 ? filterData : filterProvider;
        const content2 = content.map((item, i) => {
          return (
            <MenuItem
              key={i}
              value={
                item.connectorName !== "MOBILE_ID_IDENTITY"
                  ? item.connectorName
                  : item.remark
              }
            >
              {item.remark}
              <ListItemSecondaryAction>
                <img src={item.logo} height="25" alt="logo" />
              </ListItemSecondaryAction>
            </MenuItem>
          );
        });
        setData2(content2);
      } else {
        setData2(null); // Handle the case where filteredData is undefined or null
      }
    };

    const handleChange2 = () => {
      // setCert({});
    };

    const sdk = useRef(null);
    let lang = getLang();

    function disconnectWSHTML() {
      sdk.current.shutdown();
    }

    const urlWithoutProtocol = getUrlWithoutProtocol();
    // const urlWithoutProtocol = "localhost:3000";

    const certificateInfor = useMutation({
      mutationFn: async (data) => {
        try {
          const response = await connectWS(data);
          // console.log("response: ", response);
          return response;
        } catch (error) {
          // console.log("error: ", error);
          throw new Error(error);
        }
      },
      // onSuccess: (data) => {
      //   console.log("data: ", data);
      // },
    });

    // console.log("cuong: ", certificateInfor);

    const connectWS = (dllUsb) => {
      return new Promise(function (resolve, reject) {
        const ipWS = "127.0.0.1";
        const portWS = "9505";
        const typeOfWS = "wss";
        sdk.current = new ISPluginClient(
          ipWS,
          portWS,
          typeOfWS,
          function () {
            console.log("connected");
            //            socket onopen => connected
            getCertificate(dllUsb, resolve, reject);
            // flagFailedConnectHTML = 1;
          },
          function () {
            //            socket disconnected
            console.log("Connect error");
          },
          function () {
            //            socket stopped
          },
          function () {
            console.log("connected denied");
            // console.log("statusCallBack: ", statusCallBack);
            disconnectWSHTML();
          },
          function (cmd, id, error, data) {
            // console.log("id: ", id);
            //RECEIVE
            // console.log("cmd: ", cmd);
            // console.log("error: ", error);
            // console.log("data: ", data);
          }
        );
      });
    };

    const getCertificate = (dllUsb, resolve, reject) => {
      // console.log("sdk.current: ", sdk.current);
      sdk.current.getTokenCertificate(
        60,
        JSON.parse(dllUsb),
        urlWithoutProtocol,
        lang,
        function (response) {
          // console.log("response: ", response);
          resolve(response);
          disconnectWSHTML();
        },
        function (error, mess) {
          console.log("error: ", error);
          console.log("mess: ", mess);
          reject(mess);
          // setErrorGetCert(mess);
          disconnectWSHTML();
        },
        function () {
          console.log("timeout");
          sdk.current = null;
        }
      );
    };

    const handleFormSubmit = (data1) => {
      // console.log("data: ", data);
      // setErrorGetCert(null);
      if (data1.provider === "USB_TOKEN_SIGNING") {
        const dllUsb = connectorList.USB_TOKEN_SIGNING.filter(
          (item) => item.connectorName === data1.connector
        )[0].identifier;
        // connectWS(dllUsb);
        certificateInfor.mutate(dllUsb, {
          onSuccess: (data) => {
            // console.log("data: ", data);
            onStepSubmit({ ...data1, ...data });
          },
        });
        // if (certificateInfor.data) {
        //   onStepSubmit({ ...data, ...certificateInfor?.data });
        // }
      } else {
        onStepSubmit(data1);
      }
    };

    return (
      <Box
        component="form"
        ref={ref}
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ minWidth: 400 }}
      >
        <Box mb={4} width={"100%"}>
          <SelectField
            name="provider"
            control={control}
            label="Signing method"
            content={data1}
            onChange={handleChange1}
            sx={{
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
                display: "flex",
              },
              backgroundColor: "signingWFBackground.main",
            }}
          />
        </Box>
        <Box width={"100%"}>
          <SelectField
            name="connector"
            control={control}
            label="Select Remote Signing Service Provider"
            disabled={!data2}
            content={data2}
            onChange={handleChange2}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            sx={{
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
                display: "flex",
              },
              backgroundColor: "signingWFBackground.main",
            }}
          />
        </Box>
        <CheckIdSoft name="messageError" control={control} />
        {certificateInfor?.error && (
          <Box width={"100%"} mt={2}>
            <Alert severity="error">{certificateInfor?.error?.message}</Alert>
          </Box>
        )}
      </Box>
    );
  }
);

Step2.propTypes = {
  providerName: PropTypes.array,
  onStepSubmit: PropTypes.func,
  connectorList: PropTypes.object,
  filterConnector: PropTypes.array,
};

Step2.displayName = "Step2";
export default Step2;
