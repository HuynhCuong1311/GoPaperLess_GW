import {
  useCheckIdentity,
  useConnectWS,
  useCreateCertificate,
  useGetInforTaxCode,
  useIssCertificate,
  useOTPResend,
  usePending,
  usePerFormProcess,
  useReadCard,
  useUpdateSubject,
} from "@/hook";
import { convertTypeEid, getLang } from "@/utils/commonFunction";
import { assurance as assuranceList, authModeList } from "@/utils/Constant";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { lazy, Suspense, useEffect, useMemo, useReducer } from "react";
import { useTranslation } from "react-i18next";

const SmartIdCriteria = lazy(() =>
  import("@/components/configuration/components/SmartIdCriteria")
);

const SelectAssurance = lazy(() =>
  import("@/components/configuration/components/SelectAssurance")
);

const SelectCertificate = lazy(() =>
  import("@/components/configuration/components/SelectCertificate")
);

const IdentityGreeting = lazy(() =>
  import("@/components/configuration/components/IdentityGreeting")
);

const IdentityPolicy = lazy(() =>
  import("@/components/configuration/components/IdentityPolicy")
);

const IdentityReadCard = lazy(() =>
  import("@/components/configuration/components/IdentityReadCard")
);

const IdentityPersonalInfor = lazy(() =>
  import("@/components/configuration/components/IdentityPersonalInfor")
);

const IdentityPreFaceScan = lazy(() =>
  import("@/components/configuration/components/IdentityPreFaceScan")
);

const IdentityFaceScan = lazy(() =>
  import("@/components/configuration/components/IdentityFaceScan")
);

const IdentityRegisterPhone = lazy(() =>
  import("@/components/configuration/components/IdentityRegisterPhone")
);

const OTPConfirm = lazy(() =>
  import("@/components/configuration/components/OTPConfirm")
);

const IdentityRegisterEmail = lazy(() =>
  import("@/components/configuration/components/IdentityRegisterEmail")
);

const SelectMeThodForCreate = lazy(() =>
  import("@/components/configuration/components/SelectMeThodForCreate")
);

const SelectTaxCodeForCreate = lazy(() =>
  import("@/components/configuration/components/SelectTaxCodeForCreate")
);

const defaultValue = {
  assurance: "",
  certSelected: null,
  code: "",
  codeEnable: false,
  codeNumber: "",
  connectorName: "",
  criteria: "CITIZEN-IDENTITY-CARD",
  email: null,
  phoneNumber: "",
  jwt: null,
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "SET_DEFAULT":
      return {
        data: defaultValue,
        activeStep: 1,
        certList: [],
        filterCertList: [],
        shouldDetectFaces: true,
        otp: null,
        password: "",
        identityImage: null,
        identitySubjectId: null,

        processId: null,
        taxCode: "",
        authMode: "",
        dialCode: "",
        isLoading: false,
        isError: false,
        isPGError: "",
        isDisabled: true,
        errorMessage: "",
        taxInformations: [],
      };

    case "SET_DATA":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case "SET_ACTIVE_STEP":
      return {
        ...state,
        activeStep: action.payload,
      };
    case "SET_CONNECTOR_NAME":
      return {
        ...state,
        isError: false,
        // isDisabled: false,
        data: { ...state.data, connectorName: action.payload },
      };
    case "SET_CODE":
      return {
        ...state,
        data: { ...state.data, code: action.payload },
        isError: false,
        errorMessage: "",
      };
    case "SET_CRITERIA":
      return {
        ...state,
        data: { ...state.data, criteria: action.payload },
        isError: false,
        errorMessage: "",
      };

    case "SET_ASSURANCE":
      return {
        ...state,
        data: { ...state.data, assurance: action.payload },
      };
    case "SET_CERT_LIST":
      return {
        ...state,
        certList: action.payload,
      };
    case "SET_FILTER_CERT_LIST":
      return {
        ...state,
        filterCertList: action.payload,
      };
    case "SET_CODE_NUMBER":
      return {
        ...state,
        data: { ...state.data, codeNumber: action.payload },
        isError: false,
        errorMessage: "",
      };
    case "SET_CERT_SELECTED":
      return {
        ...state,
        data: { ...state.data, certSelected: action.payload },
      };
    case "SET_IDENTITY_IMAGE":
      return {
        ...state,
        identityImage: action.payload,
      };
    case "SET_IDENTITY_SUBJECT_ID":
      return {
        ...state,
        identitySubjectId: action.payload,
      };
    case "SET_JWT":
      return {
        ...state,
        data: { ...state.data, jwt: action.payload },
      };
    case "SET_EMAIL":
      return {
        ...state,
        data: { ...state.data, email: action.payload },
      };
    case "SET_PHONE_NUMBER":
      return {
        ...state,
        data: { ...state.data, phoneNumber: action.payload },
      };
    case "SET_PROCESS_ID":
      return {
        ...state,
        processId: action.payload,
      };
    case "SET_TAX_CODE":
      return {
        ...state,
        taxCode: action.payload,
      };
    case "SET_AUTH_MODE":
      return {
        ...state,
        authMode: action.payload,
      };
    case "SET_DIAL_CODE":
      return {
        ...state,
        dialCode: action.payload,
      };
    case "SET_DISABLED":
      return {
        ...state,
        isDisabled: action.payload,
      };

    case "SET_PERSONAL_INFORMATIONS":
      return {
        ...state,
        personalInformations: action.payload,
      };
    case "SET_SHOULD_DETECT_FACES":
      return {
        ...state,
        shouldDetectFaces: action.payload,
      };
    case "SET_OTP":
      return {
        ...state,
        otp: action.payload,
      };
    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_IS_ERROR":
      return {
        ...state,
        isError: true,
        errorMessage: action.payload,
      };
    case "CLEAR_IS_ERROR":
      return {
        ...state,
        isError: false,
        errorMessage: "",
      };
    case "SET_ISPG_ERROR":
      return {
        ...state,
        isPGError: action.payload,
      };
    case "SET_TAXINFORMATIONS":
      return {
        ...state,
        taxInformations: action.payload,
      };
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
        isDisabled: false,
        errorMessage: "",
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: "",
        // data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload,
      };
    default:
      throw new Error();
  }
};

const IssFlow = ({
  initData,
  filterPrefix,
  open,
  onClose,
  handleSubmitModel,
}) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: defaultValue,
    activeStep: 1,
    certList: [],
    filterCertList: [],
    shouldDetectFaces: true,
    otp: null,
    password: "",
    identityImage: null,
    identitySubjectId: null,
    processId: null,
    taxCode: "",
    methodAuthorization: "",
    dialCode: "",
    isLoading: false,
    isError: false,
    isPGError: "",
    isDisabled: true,
    errorMessage: "",
    taxInformations: [],
  });
  //   console.log("IssFlow: ", state);

  const lang = useMemo(() => getLang(), []);
  const isPending = usePending();
  const issCertificate = useIssCertificate();
  const checkIdentiy = useCheckIdentity();
  const connectWS = useConnectWS();
  const readCard = useReadCard();
  const updateIdentitySubject = useUpdateSubject();
  const OTPResend = useOTPResend();
  const perFormProcess = usePerFormProcess();
  const createCertificate = useCreateCertificate();
  const getInforTaxCode = useGetInforTaxCode();

  useEffect(() => {
    if (open && initData) {
      dispatch({ type: "SET_DATA", payload: initData });
    }
  }, [initData, open]);

  const handleClose = () => {
    dispatch({ type: "SET_DEFAULT" });
    onClose();
  };

  const handleClickCancel = () => {
    switch (state.activeStep) {
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 8:
      case 9:
      case 11:
      case 15:
        handleBack();
        break;
      default:
        handleClose();
        break;
    }
  };
  const submitText = () => {
    switch (state.activeStep) {
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 8:
      case 9:
      case 11:
      case 15:
        return t("0-common.back");
      default:
        return t("0-common.cancel");
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_ACTIVE_STEP", payload: state.activeStep - 1 });
  };

  const handleStepFaceScan = (data) => {
    dispatch({
      type: "SET_IDENTITY_SUBJECT_ID",
      payload: data.subject_id,
    });
    dispatch({
      type: "SET_JWT",
      payload: data.jwt,
    });
    try {
      var decoded = jwtDecode(data.jwt);

      if (decoded.email) {
        dispatch({
          type: "SET_EMAIL",
          payload: data.perform_result.final_result.email,
        });
      }
      if (decoded.phone_number) {
        dispatch({
          type: "SET_PHONE_NUMBER",
          payload: data.perform_result.final_result.mobile,
        });
      }

      if (!decoded.phone_number) {
        dispatch({
          type: "SET_ACTIVE_STEP",
          payload: 11,
        });
      } else if (!decoded.email) {
        dispatch({
          type: "SET_ACTIVE_STEP",
          payload: 13,
        });
      } else {
        dispatch({ type: "SET_CONNECTOR_NAME", payload: "" });
        dispatch({
          type: "SET_ACTIVE_STEP",
          payload: 15,
        });
      }
    } catch (error) {
      console.error("Lỗi khi giải mã JWT:", error);
    }
  };

  const handleStepProcessPerForm = () => {
    switch (state.activeStep) {
      case 12:
        if (!state.data.email) {
          dispatch({ type: "SET_ACTIVE_STEP", payload: 13 });
        } else {
          dispatch({ type: "SET_ACTIVE_STEP", payload: 15 });
        }
        break;
      case 14:
        dispatch({ type: "SET_ACTIVE_STEP", payload: 15 });
        break;
    }
  };

  const handleSubmitClick = () => {
    switch (state.activeStep) {
      case 1:
        issCertificate.mutate(
          {
            lang: lang,
            connectorName: "SMART_ID_MOBILE_ID",
            criteria: state.data.criteria,
            code: state.data.code,
          },
          {
            onSuccess: (data) => {
              dispatch({
                type: "SET_CERT_LIST",
                payload: data,
              });
              dispatch({ type: "SET_ACTIVE_STEP", payload: 2 });
              // setstate.(2);
            },
            onError: (error) => {
              console.log("error: ", error);
              dispatch({
                type: "SET_IS_ERROR",
                payload: error.response.data.message,
              });
            },
          }
        );
        break;
      case 2:
        {
          let newList = [];
          switch (state.data.assurance) {
            case "ESEAL":
              newList = state.certList.filter(
                (item) => item.seal === true && item.qes === false
              );
              break;
            case "QSEAL":
              newList = state.certList.filter(
                (item) => item.seal === true && item.qes === true
              );
              break;
            case "NORMAL":
              newList = state.certList.filter(
                (item) => item.seal === false && item.qes === false
              );
              break;
            case "QES":
              newList = state.certList.filter(
                (item) => item.seal === false && item.qes === true
              );
              break;
            default:
              break;
          }
          dispatch({ type: "SET_FILTER_CERT_LIST", payload: newList });
          dispatch({ type: "SET_ACTIVE_STEP", payload: 3 });
        }
        break;
      case 3:
        if (!state.data.certSelected) {
          if (state.data.criteria === "CITIZEN-IDENTITY-CARD") {
            checkIdentiy.mutate(
              {
                lang: lang,
                code: state.data.code,
                type: convertTypeEid(state.data.criteria),
              },
              {
                onSuccess: (data) => {
                  dispatch({
                    type: "SET_PERSONAL_INFORMATIONS",
                    payload: data.personal_informations,
                  });
                  if (data.personal_informations) {
                    dispatch({
                      type: "SET_IDENTITY_IMAGE",
                      payload: data.personal_informations.dg2,
                    });
                    dispatch({
                      type: "SET_IDENTITY_SUBJECT_ID",
                      payload: data.personal_informations.subject_id,
                    });
                    dispatch({ type: "SET_ACTIVE_STEP", payload: 8 });
                    // setActiveStep(8);
                  } else {
                    dispatch({ type: "SET_ACTIVE_STEP", payload: 5 });
                    // setActiveStep(5);
                  }
                },
              }
            );
          } else {
            dispatch({ type: "SET_ACTIVE_STEP", payload: 4 });
          }
        } else {
          handleSubmitModel(state.data);
          dispatch({ type: "SET_DEFAULT" });
        }
        break;
      case 4:
        checkIdentiy.mutate(
          {
            lang: lang,
            code: state.data.code,
            type: convertTypeEid(state.data.criteria),
          },
          {
            onSuccess: (data) => {
              dispatch({
                type: "SET_PERSONAL_INFORMATIONS",
                payload: data.personal_informations,
              });
              if (data.personal_informations) {
                dispatch({
                  type: "SET_IDENTITY_IMAGE",
                  payload: data.personal_informations.dg2,
                });
                dispatch({
                  type: "SET_IDENTITY_SUBJECT_ID",
                  payload: data.personal_informations.subject_id,
                });
                dispatch({ type: "SET_ACTIVE_STEP", payload: 8 });
                // setActiveStep(8);
              } else {
                dispatch({ type: "SET_ACTIVE_STEP", payload: 5 });
                // setActiveStep(5);
              }
            },
          }
        );
        break;
      case 5:
        dispatch({ type: "SET_ACTIVE_STEP", payload: 6 });
        // setActiveStep(6);
        break;
      case 6:
        dispatch({ type: "SET_ACTIVE_STEP", payload: 7 });
        // setActiveStep(7);
        break;
      case 7:
        dispatch({ type: "CLEAR_IS_ERROR" });
        connectWS.mutate(
          {},
          {
            onSuccess: (data) => {
              console.log("connectWS: ", data);
              readCard.mutate(
                {
                  lang: lang,
                  code: state.data.code,
                },
                {
                  onSuccess: (data) => {
                    console.log("readCard data: ", data);
                    dispatch({
                      type: "SET_PERSONAL_INFORMATIONS",
                      payload: data.optionalDetails,
                    });
                    dispatch({
                      type: "SET_IDENTITY_IMAGE",
                      payload: data.image,
                    });
                    dispatch({ type: "SET_ACTIVE_STEP", payload: 8 });
                    // setActiveStep(8);
                  },
                  onError: (error) => {
                    console.log("readCard error: ", error);
                    dispatch({
                      type: "SET_IS_ERROR",
                      payload: error.message,
                    });
                  },
                }
              );
            },
            onError: (error) => {
              console.log("connectWS error: ", error);
              dispatch({
                type: "SET_IS_ERROR",
                payload: t("modal.checkidwarning"),
              });
            },
          }
        );
        break;
      case 8:
        dispatch({ type: "SET_ACTIVE_STEP", payload: 9 });
        // setActiveStep(9);
        break;
      case 9:
        dispatch({ type: "SET_ACTIVE_STEP", payload: 10 });
        // setActiveStep(10);
        break;
      case 10:
        dispatch({ type: "FETCH_INIT" });
        dispatch({ type: "SET_SHOULD_DETECT_FACES", payload: true });
        break;
      case 11:
        // sửa lại chỗ dial code
        updateIdentitySubject.mutate(
          {
            lang: lang,
            jwt: state.data.jwt,
            phoneNumber: state.data.phoneNumber,
            email: state.data.email,
            subject_id: state.identitySubjectId,
          },
          {
            onSuccess: (data) => {
              console.log("data: ", data);
              dispatch({ type: "SET_PROCESS_ID", payload: data });
              dispatch({ type: "SET_DISABLED", payload: true });
              dispatch({ type: "SET_ACTIVE_STEP", payload: 12 });
            },
            onError: (error) => {
              console.log("error: ", error);
              dispatch({
                type: "SET_IS_ERROR",
                payload: error.response.data.message,
              });
            },
          }
        );
        break;
      case 12:
        perFormProcess.mutate(
          {
            lang: lang,
            otp: state.otp,
            subject_id: state.identitySubjectId,
            process_id: state.processId,
          },
          {
            onSuccess: (data) => {
              console.log("data: ", data);
              if (data.status === 0) {
                dispatch({
                  type: "SET_JWT",
                  payload: data.jwt,
                });
              }
              if (!state.data.email) {
                dispatch({ type: "SET_ACTIVE_STEP", payload: 13 });
              } else {
                dispatch({ type: "SET_ACTIVE_STEP", payload: 15 });
              }
            },
            onError: (error) => {
              console.log("perFormProcess error: ", error);
              dispatch({
                type: "SET_IS_ERROR",
                payload: error.response.data.message,
              });
            },
          }
        );
        break;
      case 13:
        updateIdentitySubject.mutate(
          {
            lang: lang,
            jwt: state.data.jwt,
            phoneNumber: state.data.phoneNumber,
            email: state.data.email,
            subject_id: state.identitySubjectId,
          },
          {
            onSuccess: (data) => {
              console.log("data: ", data);
              dispatch({ type: "SET_PROCESS_ID", payload: data });
              dispatch({ type: "SET_DISABLED", payload: true });
              dispatch({ type: "SET_ACTIVE_STEP", payload: 14 });
            },
            onError: (error) => {
              console.log("error: ", error);
              dispatch({
                type: "SET_IS_ERROR",
                payload: error.response.data.message,
              });
            },
          }
        );
        break;
      case 14:
        perFormProcess.mutate(
          {
            lang: lang,
            otp: state.otp,
            subject_id: state.identitySubjectId,
            process_id: state.processId,
          },
          {
            onSuccess: (data) => {
              console.log("data: ", data);
              if (data.status === 0) {
                dispatch({
                  type: "SET_JWT",
                  payload: data.jwt,
                });
              }
              dispatch({ type: "SET_ACTIVE_STEP", payload: 15 });
            },
            onError: (error) => {
              console.log("perFormProcess error: ", error);
              dispatch({
                type: "SET_IS_ERROR",
                payload: error.response.data.message,
              });
            },
          }
        );
        break;
      case 15:
        dispatch({ type: "SET_ACTIVE_STEP", payload: 16 });
        break;
      case 16:
        console.log("submit");
        switch (state.data.assurance) {
          case "NORMAL":
            // createCertificate();
            createCertificate.mutate(
              {
                lang: lang,
                jwt: state.data.jwt,
                assurance: state.data.assurance,
                taxCode: state.taxCode,
                authMode: state.authMode, // xem lại
              },
              {
                onSuccess: (data) => {
                  console.log("data: ", data);
                  dispatch({ type: "SET_CERT_SELECTED", payload: data });
                  // onClose();
                  handleSubmitModel({ ...state.data, certSelected: data });
                  dispatch({ type: "SET_DEFAULT" });
                  // dispatch({
                  //   type: "SET_IS_SHOW_SETTING_SIGNATURE",
                  //   payload: true,
                  // });
                },
                onError: (error) => {
                  console.log("error: ", error);
                  dispatch({
                    type: "SET_IS_ERROR",
                    payload: error.response.data.message,
                  });
                },
              }
            );
            break;
          case "ESEAL":
            getInforTaxCode.mutate(
              {
                lang: lang,
                // code: state.data.code,
                code: "048080000061",
              },
              {
                onSuccess: (data) => {
                  console.log("data: ", data);
                  dispatch({
                    type: "SET_TAXINFORMATIONS",
                    payload: data.document_data.tax_informations,
                  });
                  dispatch({ type: "SET_ACTIVE_STEP", payload: 17 });
                },
                onError: (error) => {
                  console.log("error: ", error);
                  dispatch({
                    type: "SET_IS_ERROR",
                    payload: error.response.data.message,
                  });
                },
              }
            );
            break;
        }
        break;
      case 17:
        createCertificate.mutate(
          {
            lang: lang,
            jwt: state.data.jwt,
            assurance: state.data.assurance,
            taxCode: state.taxCode,
            authMode: state.authMode, // xem lại
          },
          {
            onSuccess: (data) => {
              console.log("data: ", data);
              dispatch({ type: "SET_CERT_SELECTED", payload: data });
              handleSubmitModel({ ...state.data, certSelected: data });
              dispatch({ type: "SET_DEFAULT" });
              // dispatch({
              //   type: "SET_IS_SHOW_SETTING_SIGNATURE",
              //   payload: true,
              // });
            },
            onError: (error) => {
              console.log("error: ", error);
              dispatch({
                type: "SET_IS_ERROR",
                payload: error.response.data.message,
              });
            },
          }
        );
        break;
      default:
        break;
    }
  };

  const titleOtpPhone = {
    title: t("electronic.step81"),
    subtitle: t("electronic.step81"),
  };

  const titleOtpEmail = {
    title: t("electronic.step101"),
    subtitle: t("electronic.step101"),
  };

  const steps = [
    <Suspense key={1} fallback={<div>Loading...</div>}>
      <SmartIdCriteria
        state={state}
        dispatch={dispatch}
        criteriaList={filterPrefix?.filter(
          (item) => item.type !== "PHONE-ID" && item.type !== "ENTERPRISE-ID"
        )}
        handleSubmit={handleSubmitClick}
      />
    </Suspense>,
    <Suspense key={2} fallback={<div>Loading...</div>}>
      <SelectAssurance
        state={state}
        dispatch={dispatch}
        assuranceList={assuranceList}
      />
    </Suspense>,
    <Suspense key={3} fallback={<div>Loading...</div>}>
      <SelectCertificate state={state} dispatch={dispatch} />
    </Suspense>,
    <Suspense key={4} fallback={<div>Loading...</div>}>
      <SmartIdCriteria
        state={state}
        dispatch={dispatch}
        criteriaList={filterPrefix?.filter(
          (item) => item.type !== "PHONE-ID" && item.type !== "ENTERPRISE-ID"
        )}
        handleSubmit={handleSubmitClick}
      />
    </Suspense>,
    <Suspense key={5} fallback={<div>Loading...</div>}>
      <IdentityGreeting state={state} />
    </Suspense>,
    <Suspense key={6} fallback={<div>Loading...</div>}>
      <IdentityPolicy dispatch={dispatch} />
    </Suspense>,
    <Suspense key={7} fallback={<div>Loading...</div>}>
      <IdentityReadCard />
    </Suspense>,
    <Suspense key={8} fallback={<div>Loading...</div>}>
      <IdentityPersonalInfor state={state} />
    </Suspense>,
    <Suspense key={9} fallback={<div>Loading...</div>}>
      <IdentityPreFaceScan />
    </Suspense>,
    <Suspense key={10} fallback={<div>Loading...</div>}>
      <IdentityFaceScan
        state={state}
        dispatch={dispatch}
        handleStepFaceScan={handleStepFaceScan}
      />
    </Suspense>,
    <Suspense key={11} fallback={<div>Loading...</div>}>
      <IdentityRegisterPhone
        state={state}
        dispatch={dispatch}
        handleSubmit={handleSubmitClick}
      />
    </Suspense>,
    <Suspense key={12} fallback={<div>Loading...</div>}>
      <OTPConfirm
        state={state}
        title={titleOtpPhone}
        dispatch={dispatch}
        processOTPResend={OTPResend}
        handleStepProcessPerForm={handleStepProcessPerForm}
      />
    </Suspense>,
    <Suspense key={13} fallback={<div>Loading...</div>}>
      <IdentityRegisterEmail
        state={state}
        dispatch={dispatch}
        handleSubmit={handleSubmitClick}
      />
    </Suspense>,
    <Suspense key={14} fallback={<div>Loading...</div>}>
      <OTPConfirm
        state={state}
        title={titleOtpEmail}
        dispatch={dispatch}
        processOTPResend={OTPResend}
        handleStepProcessPerForm={handleStepProcessPerForm}
      />
    </Suspense>,
    <Suspense key={15} fallback={<div>Loading...</div>}>
      <SelectMeThodForCreate
        state={state}
        dispatch={dispatch}
        authModeList={authModeList}
      />
    </Suspense>,
    <Suspense key={16} fallback={<div>Loading...</div>}>
      <SelectAssurance
        state={state}
        dispatch={dispatch}
        assuranceList={assuranceList.filter(
          (item) => item.value === "NORMAL" || item.value === "ESEAL"
        )}
      />
    </Suspense>,
    <Suspense key={17} fallback={<div>Loading...</div>}>
      <SelectTaxCodeForCreate state={state} dispatch={dispatch} />
    </Suspense>,
  ];

  const title = useMemo(() => {
    switch (state.activeStep) {
      case 1:
        return "Internal Signing Service";
      case 2:
        return t("signingForm.title5");
      case 3:
        return t("modal.title1");
      case 16:
        return t("signingForm.title5");
      default:
        return "Internal Signing Service";
    }
  }, [state.activeStep, t]);
  return (
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
      open={!!open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        sx: {
          width: "500px",
          maxWidth: "500px", // Set your width here
          height: "700px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{
          backgroundColor: "dialogBackground.main",
          p: "10px 20px",
          height: "51px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            display: "inline-block",
            color: "signingtextBlue.main",
            borderBottom: "4px solid",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
          }}
        >
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "dialogBackground.main",
          height: "100%",
          // py: "10px",
          borderBottom: "1px solid",
          borderColor: "borderColor.main",
          p: "0 20px 10px",
        }}
      >
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
          // className="choyoyoy"
        >
          <Stack sx={{ mt: 0, mb: 1, height: "100%" }}>
            {/* {steps[activeStep]} */}
            <Box flexGrow={1}>{steps[state.activeStep - 1]}</Box>
            {/* {activeStep} */}
            {state.isError && (
              <Alert severity="error">{state.errorMessage}</Alert>
            )}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleClickCancel}
        >
          {submitText()}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || state.isDisabled || state.isLoading}
          startIcon={
            isPending || state.isLoading ? (
              <CircularProgress color="inherit" size="1em" />
            ) : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {state.isError ? t("0-common.retry") : t("0-common.continue")}
          {/* {t("0-common.continue")} */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

IssFlow.propTypes = {
  initData: PropTypes.object,
  filterPrefix: PropTypes.array,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleSubmitModel: PropTypes.func,
};

export default IssFlow;
