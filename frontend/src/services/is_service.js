import ISPluginClient from "@/assets/js/checkid";
import { api } from "@/utils/api";
import { getUrlWithoutProtocol } from "@/utils/commonFunction";

let sdk = null;
export const isService = {
  connectWS: () => {
    return new Promise((resolve, reject) => {
      const ipWS = "127.0.0.1";
      const portWS = "9505";
      const typeOfWS = "wss";

      sdk = new ISPluginClient(
        ipWS,
        portWS,
        typeOfWS,
        // onOpen (connection successful)
        () => {
          // Kết nối thành công, gọi hàm lấy chứng chỉ
          // isService.getCertificate(data, resolve, reject);
          console.log("Connection successful");
          resolve("Connection successful");
        },
        // onError (connection error)
        () => {
          console.log("Connection error");
          isService.disconnectWSHTML();
          reject("Connection error");
        },
        // onStop (connection stopped)
        () => {
          console.log("Connection stopped");
          reject("Connection stopped");
        },
        // onDeny (connection denied)
        () => {
          console.log("Connection denied");
          isService.disconnectWSHTML();
          reject("Connection denied");
        },
        // onReceive (handle data received)
        (id, cmd, error, data) => {
          if (error) {
            console.log("Error received:", error);
            reject(error);
          } else {
            console.log("Data received:", data);
          }
        }
      );
    });
  },

  getCertificate: (data) => {
    if (!sdk) {
      // reject("SDK is not initialized");
      throw new Error("SDK is not initialized");
      // return;
    }

    return new Promise((resolve, reject) => {
      sdk.getTokenCertificate(
        60,
        JSON.parse(data.dllUsb),
        getUrlWithoutProtocol(), // Assuming `urlWithoutProtocol` means the current host
        data.lang, // Assuming default language, replace `lang` as needed
        (response) => {
          resolve(response);
          isService.disconnectWSHTML();
          // return response;
        },
        (error, mess) => {
          console.log("Error during certificate retrieval:", mess);
          reject(mess);
          isService.disconnectWSHTML();
          // throw new Error(mess);
        },
        () => {
          console.log("Certificate retrieval timeout");
          reject("Certificate retrieval timeout");
          sdk = null;
        }
      );
    });
  },

  readCard: (data) => {
    return new Promise((resolve, reject) => {
      sdk.getInformationDetails(
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        data.lang,
        data.code.slice(-6),
        60,
        function (response) {
          isService.disconnectWSHTML();
          resolve(response);
        },
        function (error, mess) {
          console.log("Error during read card:", mess);
          isService.disconnectWSHTML();
          reject({ error: error, message: mess });
          // switch (error) {
          //   case 1001:
          //     setErrorPG(t("electronic.eid not found"));
          //     break;
          //   case 1102:
          //     setErrorPG(t("electronic.can wrong"));
          //     break;
          //   default:
          //     setErrorPG(mess);
          //     break;
          // }
          // setIsFetching(false);
        },
        function () {
          console.log("Read card timeout");
          // setIsFetching(false);
          sdk = null;
        }
      );
    });
  },

  signTokenCertificate: (data) => {
    console.log("data: ", data);
    return new Promise((resolve, reject) => {
      sdk.signTokenCertificate(
        data.certId,
        data.pin,
        data.signObjects,
        data.urlWithoutProtocol,
        60,
        data.lang,
        function (response) {
          isService.disconnectWSHTML();
          resolve(response);
        },
        function (error, mess) {
          console.log("Error during read card:", mess);
          isService.disconnectWSHTML();
          reject({ error: error, message: mess });
        },
        function () {
          console.log("Read card timeout");
          // setIsFetching(false);
          sdk = null;
        }
      );
    });
  },

  disconnectWSHTML: () => {
    if (sdk) {
      sdk.shutdown();
      sdk = null; // Clear SDK instance to prevent future calls
      console.log("WebSocket disconnected");
    }
  },

  getHash: (data) => {
    return api.post("/is/getHash", data);
  },

  packFile: (data) => {
    return api.post("/is/packFile", data);
  },
};
