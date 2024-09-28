import ISPluginClient from "./checkid";

export const connectWS = (sdk, cbConnected) => {
  const ipWS = "127.0.0.1";
  const portWS = "9505";
  const typeOfWS = "wss";

  // var url = typeOfWS + "://" + ipWS + ":" + portWS + "/ISPlugin";
  sdk.current = new ISPluginClient(
    ipWS,
    portWS,
    typeOfWS,
    // function () {
    //   console.log("connected");
    //   //            socket onopen => connected
    //   setIsFetching(true);
    //   if (activeStep === 2) {
    //     readCard();
    //   } else {
    //     // faceScan();
    //   }
    //   flagFailedConnectHTML = 1;
    // },
    cbConnected,
    function () {
      //            socket disconnected
      console.log("Connect error");
    },
    function () {
      //            socket stopped
      console.log("socket stopped");
    },
    function () {
      console.log("connected denied");
      disconnectWSHTML();
    },
    function (cmd, id, error, data) {
      //RECEIVE
      console.log("cmd: " + cmd);
      console.log("id: ", id);
      console.log("error: ", error);
      console.log("data: ", data);
    }
  );
};

function disconnectWSHTML(sdk) {
  // console.log("sdk", sdk);
  sdk.current.shutdown();
}

export function getTokenCertificate(sdk) {
  console.log("getTokenCertificate");
  sdk.current.getTokenCertificate(
    60,
    //   dllUSB,
    //   urlWithoutProtocol,
    // "uat-paperless-gw.mobile-id.vn",
    //   connectorName,
    //   workFlowIdList,
    //   enterpriseIdList,
    //   lang,
    function (response) {
      console.log("response: ", response);
      // const currentMoment = moment();
      // // console.log("response: ", currentMoment);
      // setMinLength(response.tokenDetails.minPinLength);
      // setMaxLength(response.tokenDetails.maxPinLength);
      // const newCertList = response.signingCertificates.filter((cer) =>
      //   moment(cer.validTo, "YYYY-MM-DD HH:mm:ss").isAfter(currentMoment)
      // );
      // if (newCertList.length === 0) {
      //   setErrorPG(t("smartID.error3"));
      // } else {
      //   setContent1(newCertList);
      // }
    },
    function (error, mess) {
      console.log("error: ", error);
      console.log("mess: ", mess);
      // setContent1([]);
      // let title = "";
      // {translate("smartID.NoCertificateFound")}

      switch (mess) {
        case "USB Token could not be initialized":
          // title = "USB Token could not be initialized";
          break;
        default:
          // title = mess;
          break;
      }
      // setErrorPG(title);
    },
    function () {
      console.log("timeout");
      sdk.current = null;
    }
  );
}
