package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.*;
import com.nimbusds.jwt.JWTParser;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.controller.GatewayAPI;
import vn.mobileid.GoPaperless.dto.rsspDto.TextField;
import vn.mobileid.GoPaperless.model.Electronic.datatypes.JwtModel;
import vn.mobileid.GoPaperless.model.Electronic.datatypes.PadesConstants;
import vn.mobileid.GoPaperless.model.Electronic.request.*;
import vn.mobileid.GoPaperless.model.Electronic.response.PerformResponse;
import vn.mobileid.GoPaperless.model.Electronic.response.SubjectResponse;
import vn.mobileid.GoPaperless.model.Electronic.response.TokenResponse;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.LastFile;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.fpsModel.FpsSignRequest;
import vn.mobileid.GoPaperless.model.fpsModel.HashFileRequest;
import vn.mobileid.GoPaperless.model.rsspModel.*;
import vn.mobileid.GoPaperless.process.AWSCall;
import vn.mobileid.GoPaperless.process.HttpUtilsAWS;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;
import vn.mobileid.GoPaperless.utils.LoadParamSystem;
import vn.mobileid.model.x509.CertificateToken;
import vn.mobileid.spi.DSSUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class ElectronicService {

    private Gson gson = new Gson();
    final private int timeOut = 5000;
    final private String contentType = "application/json";
    private String accessToken;
    private final FpsService fpsService;
    private final PostBack postBack;
    private final GatewayAPI gatewayAPI;

    private final ProcessDb connect;

    @Autowired
    private AWSCall aWSCall;

    private final RsspService rsspService;

    public ElectronicService(FpsService fpsService, PostBack postBack, GatewayAPI gatewayAPI, ProcessDb connect, RsspService rsspService) {
        this.fpsService = fpsService;
        this.postBack = postBack;
        this.gatewayAPI = gatewayAPI;
        this.connect = connect;
        this.rsspService = rsspService;
    }

    public String checkPersonalCode(String lang, String code, String type, String connectorName) throws IOException {
        String sPropertiesFMS = "";
        List<ConnectorName> connector = LoadParamSystem.getConnectorStart(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME);
        if (connector.size() > 0) {
            for (int m = 0; m < connector.size(); m++) {
                if (connector.get(m).getConnectorName().equals(connectorName)) {
                    sPropertiesFMS = connector.get(m).getIdentifier();
                }
            }
            JsonObject jsonObject = new JsonParser().parse(sPropertiesFMS).getAsJsonObject();
            JsonArray attributes = jsonObject.getAsJsonArray("attributes");

            for (JsonElement att : attributes) {
                JsonObject annotationObject = att.getAsJsonObject();
                if (annotationObject.get("name").getAsString().equals("URI")) {
                    PadesConstants.BASE_URL = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("ACCESSKEY")) {
                    PadesConstants.ACCESSKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("SECRETKEY")) {
                    PadesConstants.SECRETKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("REGIONNAME")) {
                    PadesConstants.REGIONNAME = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("SERVICENAME")) {
                    PadesConstants.SERVICENAME = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("XAPIKEY")) {
                    PadesConstants.XAPIKEY = annotationObject.get("value").getAsString();
                }
            }
        }

        String token = getToken();
        return token;
    }

    public String getToken() throws IOException {
        String sPropertiesFMS = "";
        List<ConnectorName> connector = LoadParamSystem.getConnectorStart(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME);
        if (connector.size() > 0) {
            for (int m = 0; m < connector.size(); m++) {
                if (connector.get(m).getConnectorName().equals("MOBILE_ID_IDENTITY")) {
                    sPropertiesFMS = connector.get(m).getIdentifier();
                }
            }
            JsonObject jsonObject = new JsonParser().parse(sPropertiesFMS).getAsJsonObject();
            JsonArray attributes = jsonObject.getAsJsonArray("attributes");

            for (JsonElement att : attributes) {
                JsonObject annotationObject = att.getAsJsonObject();
                if (annotationObject.get("name").getAsString().equals("URI")) {
                    PadesConstants.BASE_URL = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("ACCESSKEY")) {
                    PadesConstants.ACCESSKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("SECRETKEY")) {
                    PadesConstants.SECRETKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("REGIONNAME")) {
                    PadesConstants.REGIONNAME = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("SERVICENAME")) {
                    PadesConstants.SERVICENAME = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("XAPIKEY")) {
                    PadesConstants.XAPIKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("BASICTOKEN")) {
                    PadesConstants.BASIC_TOKEN = annotationObject.get("value").getAsString();
                }
            }
        }
        System.out.println("PadesConstants.BASE_URL: " + PadesConstants.BASE_URL);
        System.out.println("PadesConstants.ACCESSKEY: " + PadesConstants.ACCESSKEY);
        System.out.println("PadesConstants.SECRETKEY: " + PadesConstants.SECRETKEY);
        System.out.println("PadesConstants.BASIC_TOKEN: " + PadesConstants.BASIC_TOKEN);

        String tokenUrl = PadesConstants.BASE_URL + "/v2/e-identity/general/token/get";
        System.out.println("tokenUrl" + tokenUrl);
        aWSCall = new AWSCall(tokenUrl,
                "GET",
                PadesConstants.ACCESSKEY,
                PadesConstants.SECRETKEY,
                PadesConstants.REGIONNAME,
                PadesConstants.SERVICENAME,
                5000,
                PadesConstants.XAPIKEY,
                contentType,
                null);
        // /v1/e-verification/oidc/token {get acess_token}
//        String token = aWSCall.v1VeriOidcToken("/v2/e-identity/general/token/get", basicToken);

        String response = HttpUtilsAWS.invokeHttpRequest(
                new URL(tokenUrl),
                "GET",
                this.timeOut,
                aWSCall.getAWSV4Auth(null, "/v2/e-identity/general/token/get", PadesConstants.BASIC_TOKEN),
                null);

        //Response
        System.out.println("response" + response);
        ObjectMapper objectMapper = new ObjectMapper();
        TokenResponse tokenResponse = gson.fromJson(response, TokenResponse.class);
        //Past Bearer for Step 2 (E-verification/pades)
//        String bearerToken = "Bearer " + tokenResponse.access_token;
//        System.out.println("Bearer Token: " + bearerToken);
        this.accessToken = tokenResponse.access_token;
        return tokenResponse.access_token;
    }

    public SubjectResponse getSubject(CheckIdentityRequest checkIdentityRequest) throws IOException {
        String access_token = getToken();
        String bearerToken = "Bearer " + access_token;
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> identity_document = new HashMap<>();

        request.put("email", "");
        request.put("mobile", "");
        identity_document.put("type", checkIdentityRequest.getType());
        identity_document.put("value", checkIdentityRequest.getCode());
        request.put("identity_document", identity_document);
        request.put("dg1_enabled", false);
        request.put("dg2_enabled", true);
        request.put("dg3_enabled", false);
        request.put("dg13_enabled", false);
        request.put("lang", checkIdentityRequest.getLang());

        String bodyRequest = gson.toJson(request);

        String getSubjectUrl = PadesConstants.BASE_URL + "/v2/e-identity/subject/get";
        System.out.println("ownerUrl: " + getSubjectUrl);
        TreeMap<String, String> queryParametes = new TreeMap<>();
        String base64 = Base64.getEncoder().encodeToString(bodyRequest.getBytes(StandardCharsets.UTF_8));
        queryParametes.put("request_data_base64", base64);

        aWSCall = new AWSCall(getSubjectUrl,
                "GET",
                PadesConstants.ACCESSKEY,
                PadesConstants.SECRETKEY,
                PadesConstants.REGIONNAME,
                PadesConstants.SERVICENAME,
                5000,
                PadesConstants.XAPIKEY,
                contentType,
                queryParametes);

        String response = HttpUtilsAWS.invokeHttpRequest(
                new URL(getSubjectUrl),
                "GET",
                this.timeOut,
                aWSCall.getAWSV4AuthForFormData(null, bearerToken, null),
                bodyRequest);

        System.out.println("getSubject: " + response);
        SubjectResponse subjectResponse = gson.fromJson(response, SubjectResponse.class);
        return subjectResponse;
    }

    public String createSubject(FaceAndCreateRequest faceAndCreateRequest) throws Exception {
        String bearerToken = "Bearer " + accessToken;
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> identity_document = new HashMap<>();

//        request.put("email", "");
//        request.put("mobile", "");
        request.put("facial_image", faceAndCreateRequest.getFacialImage());
        identity_document.put("type", faceAndCreateRequest.getType());
        identity_document.put("value", faceAndCreateRequest.getCode());
        request.put("identity_document", identity_document);
        request.put("lang", faceAndCreateRequest.getLang());

        String bodyRequest = gson.toJson(request);
        System.out.println("bodyRequest: " + bodyRequest);

        String createUrl = PadesConstants.BASE_URL + "/v2/e-identity/subject/create";
        System.out.println("createUrl: " + createUrl);

        aWSCall = new AWSCall(
                createUrl,
                "POST",
                PadesConstants.ACCESSKEY,
                PadesConstants.SECRETKEY,
                PadesConstants.REGIONNAME,
                PadesConstants.SERVICENAME,
                5000,
                PadesConstants.XAPIKEY,
                contentType,
                null);

        String response = HttpUtilsAWS.invokeHttpRequest(
                new URL(createUrl),
                "POST",
                this.timeOut,
                aWSCall.getAWSV4AuthForFormData(bodyRequest, bearerToken, null),
                bodyRequest);
        System.out.println("createSubject: " + response);
        JsonObject jsonObject = gson.fromJson(response, JsonObject.class);
        if (jsonObject.get("status").getAsInt() == 4007) {
            getToken();
        } else if (jsonObject.get("status").getAsInt() != 0) {
            throw new Exception(jsonObject.get("message").getAsString());
        }
        return jsonObject.get("subject_id").getAsString();
    }

    public String createProcess(String lang, String mobile, String email, String subject_id, String jwt, String process_type, String purpose) throws Exception {
//        updateSubject(lang, mobile, subject_id);

        String bearerToken = "Bearer " + accessToken;
//        String process_type = "MOBILE_AUTHENTICATION";
        String provider = "mobile-id";
//        String purpose = "AMEND";

        Map<String, Object> request = new HashMap<>();
        Map<String, Object> claim_sources = new HashMap<>();

        request.put("subject_id", subject_id);
        request.put("provider", provider);
        request.put("purpose", purpose);
        if (mobile != null && !mobile.equals("null")) {
            request.put("mobile", mobile);
        }

        if (email != null && !email.equals("null")) {
            request.put("email", email);
        }

        request.put("process_type", process_type);
        request.put("lang", lang);
        if (jwt != null) {
            claim_sources.put("JWT", jwt);
            request.put("claim_sources", claim_sources);
        }

        String bodyRequest = gson.toJson(request);
        System.out.println("bodyRequest: " + bodyRequest);

        String createProcessUrl = PadesConstants.BASE_URL + "/v2/e-identity/process/create";
        System.out.println("createProcessUrl: " + createProcessUrl);

        aWSCall = new AWSCall(
                createProcessUrl,
                "POST",
                PadesConstants.ACCESSKEY,
                PadesConstants.SECRETKEY,
                PadesConstants.REGIONNAME,
                PadesConstants.SERVICENAME,
                5000,
                PadesConstants.XAPIKEY,
                contentType,
                null);

        String response = HttpUtilsAWS.invokeHttpRequest(
                new URL(createProcessUrl),
                "POST",
                this.timeOut,
                aWSCall.getAWSV4AuthForFormData(bodyRequest, bearerToken, null),
                bodyRequest);
        System.out.println("SubjectResponse: " + response);

        JsonObject jsonObject = gson.fromJson(response, JsonObject.class);
        if (jsonObject.get("status").getAsInt() != 0) {
            throw new Exception(jsonObject.get("message").getAsString());
        }
        String processId = jsonObject.get("process_id").getAsString();
        System.out.println("processId: " + processId);

        return processId;
    }

    public String getInformation(TaxInformationRequest data) throws Exception {
        String bearerToken = "Bearer " + accessToken;

        Map<String, Object> request = new HashMap<>();
        request.put("document_type", "TAX");
        request.put("owner_id_card_number", data.getCode());

        List<String> tax_states = new ArrayList<>();
        tax_states.add("OPERATED");
        tax_states.add("STOPPED_TAX_PAID");

        request.put("tax_states", tax_states);
        request.put("lang", data.getLang());

        String bodyRequest = gson.toJson(request);
        System.out.println("getInforRequest: " + bodyRequest);

        String getInforUrl = PadesConstants.BASE_URL + "/v2/e-identity/utility/info/document/get";

        aWSCall = new AWSCall(
                getInforUrl,
                "POST",
                PadesConstants.ACCESSKEY,
                PadesConstants.SECRETKEY,
                PadesConstants.REGIONNAME,
                PadesConstants.SERVICENAME,
                50000,
                PadesConstants.XAPIKEY,
                contentType,
                null);

        String response = HttpUtilsAWS.invokeHttpRequest(
                new URL(getInforUrl),
                "POST",
                50000,
                aWSCall.getAWSV4AuthForFormData(bodyRequest, bearerToken, null),
                bodyRequest);
        System.out.println("SubjectResponse: " + response);
        JsonObject jsonObject = gson.fromJson(response, JsonObject.class);
//        if (jsonObject.get("status").getAsInt() != 0) {
//            throw new Exception(jsonObject.get("message").getAsString());
//        }
        return response;
    }

    public PerformResponse processPerForm(String lang, String code, String type, String otp, String subject_id, String process_id, String imageFace, String documentDigestsBase64) throws Exception {
        String bearerToken = "Bearer " + accessToken;

        String boundary = "===" + System.currentTimeMillis() + "===";

        Map<String, Object> request = new HashMap<>();
        if (imageFace != null) {
            List<String> list = new ArrayList<>();
            list.add(imageFace);
            request.put("frames", list);
            Map<String, Object> identity_document = new HashMap<>();

            identity_document.put("type", type);
            identity_document.put("value", code);
            request.put("identity_document", identity_document);
        }

        if (documentDigestsBase64 != null) {
            request.put("sign_data", documentDigestsBase64);
        }

        request.put("subject_id", subject_id);
        request.put("process_id", process_id);
        if (otp != null) {
            request.put("otp", otp);
        }

        request.put("lang", lang);

        String bodyRequest = gson.toJson(request);
        System.out.println("bodyRequest: " + bodyRequest);

        String processPerFormUrl = PadesConstants.BASE_URL + "/v2/e-identity/process/perform";
        System.out.println("processPerFormUrl: " + processPerFormUrl);

        aWSCall = new AWSCall(
                processPerFormUrl,
                "PUT",
                PadesConstants.ACCESSKEY,
                PadesConstants.SECRETKEY,
                PadesConstants.REGIONNAME,
                PadesConstants.SERVICENAME,
                5000,
                PadesConstants.XAPIKEY,
                contentType,
                null);

        String response = HttpUtilsAWS.invokeHttpMutltiPartRequest(
                new URL(processPerFormUrl),
                "PUT",
                this.timeOut,
                aWSCall.getAWSV4AuthForFormDataReal(bodyRequest, bearerToken, null, boundary),
                bodyRequest,
                null,
                boundary);
        PerformResponse performResponse = gson.fromJson(response, PerformResponse.class);
        if (performResponse.getStatus() != 0) {
            throw new Exception(performResponse.getMessage());
        }

        System.out.println("processPerForm: " + response);

        return performResponse;
    }

    public PerformResponse faceAndCreate(FaceAndCreateRequest faceAndCreateRequest) throws Exception {
        String subject_id = "";
        System.out.println("subject_id ton tai: " + faceAndCreateRequest.getSubject_id());
        if (faceAndCreateRequest.getSubject_id() != null) {
            subject_id = faceAndCreateRequest.getSubject_id();
        } else {
            subject_id = createSubject(faceAndCreateRequest);
        }
//        String subject_id = createSubject(faceAndCreateRequest);
        String process_type = "FACIAL_MATCHING";
        String purpose = "AUTHORIZE";
//        String purpose = "CREATE";
        String process_id = createProcess(faceAndCreateRequest.getLang(), null, null, subject_id, null, process_type, purpose);

        String sImageFace = faceAndCreateRequest.getImageFace().replace("data:image/png;base64,", "");
        // using split

        PerformResponse performResponse = processPerForm(faceAndCreateRequest.getLang(), faceAndCreateRequest.getCode(), faceAndCreateRequest.getType(), null, subject_id, process_id, sImageFace, null);
        performResponse.setSubject_id(subject_id);
        return performResponse;
    }

    public PerformResponse faceMatching(FaceAndCreateRequest faceAndCreateRequest, String documentDigestsBase64) throws Exception {
        if (accessToken == null) {
            getToken();
        }
        String subject_id = "";
        if (faceAndCreateRequest.getSubject_id() != null) {
            subject_id = faceAndCreateRequest.getSubject_id();
        } else {
            subject_id = createSubject(faceAndCreateRequest);
        }
//        String subject_id = createSubject(faceAndCreateRequest);
        String process_type = "FACIAL_MATCHING";
        String purpose = "AUTHORIZE";
        String process_id = createProcess(faceAndCreateRequest.getLang(), null, null, subject_id, null, process_type, purpose);

        String sImageFace = faceAndCreateRequest.getImageFace().replace("data:image/png;base64,", "");
        // using split

        PerformResponse performResponse = processPerForm(faceAndCreateRequest.getLang(), faceAndCreateRequest.getCode(), faceAndCreateRequest.getType(), null, subject_id, process_id, sImageFace, documentDigestsBase64);
        performResponse.setSubject_id(subject_id);
        return performResponse;
    }

    public PerformResponse processOtp(ProcessPerFormRequest processPerFormRequest) throws Exception {
        return processPerForm(processPerFormRequest.getLang(), null, null, processPerFormRequest.getOtp(), processPerFormRequest.getSubject_id(), processPerFormRequest.getProcess_id(), null, null);
    }

    public String updateSubject(UpdateSubjectRequest updateSubjectRequest) throws Exception {
        String process_type = "MOBILE_AUTHENTICATION";
        String purpose = "AMEND";
        if (updateSubjectRequest.getPhoneNumber() != null && !updateSubjectRequest.getPhoneNumber().equals("null")) {
            process_type = "MOBILE_AUTHENTICATION";
            purpose = "AMEND";
        }

        if (updateSubjectRequest.getEmail() != null && !updateSubjectRequest.getEmail().equals("null")) {
            process_type = "EMAIL_AUTHENTICATION";
            purpose = "AMEND";
        }
        return createProcess(updateSubjectRequest.getLang(), updateSubjectRequest.getPhoneNumber(), updateSubjectRequest.getEmail(), updateSubjectRequest.getSubject_id(), updateSubjectRequest.getJwt(), process_type, purpose);
    }

    public String processOTPResend(ProcessPerFormRequest processPerFormRequest) throws Exception {
//        String response = electronicRepository.processOTPResend(processPerFormRequest.getLang(), processPerFormRequest.getJwt(), processPerFormRequest.getSubject_id(), processPerFormRequest.getProcess_id());
        String subject_id = processPerFormRequest.getSubject_id();
        String process_id = processPerFormRequest.getProcess_id();
        String lang = processPerFormRequest.getLang();
        String jwt = processPerFormRequest.getJwt();

        String bearerToken = "Bearer " + accessToken;
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> claim_sources = new HashMap<>();

        request.put("subject_id", subject_id);
        request.put("process_id", process_id);
        request.put("lang", lang);
        if (jwt != null) {
            claim_sources.put("JWT", jwt);
            request.put("claim_sources", claim_sources);
        }

        String bodyRequest = gson.toJson(request);

        String otpResendUrl = PadesConstants.BASE_URL + "/v2/e-identity/process/otp/resend ";
        System.out.println("otpResendUrl: " + otpResendUrl);

        aWSCall = new AWSCall(
                otpResendUrl,
                "PUT",
                PadesConstants.ACCESSKEY,
                PadesConstants.SECRETKEY,
                PadesConstants.REGIONNAME,
                PadesConstants.SERVICENAME,
                5000,
                PadesConstants.XAPIKEY,
                contentType,
                null);
        String response = HttpUtilsAWS.invokeHttpRequest(
                new URL(otpResendUrl),
                "PUT",
                this.timeOut,
                aWSCall.getAWSV4AuthForFormData(bodyRequest, bearerToken, null),
                bodyRequest);
        System.out.println("SubjectResponse: " + response);

        JsonObject jsonObject = gson.fromJson(response, JsonObject.class);
        String message = jsonObject.get("message").getAsString();
        System.out.println("processId: " + message);

        return message;
    }

    public List<CertResponse> checkCertificate(CheckCertificateRequest checkCertificateRequest) throws Exception {
        SignedJWT jwt1 = (SignedJWT) JWTParser.parse(checkCertificateRequest.getJwt());

        JwtModel jwtModel = gson.fromJson(jwt1.getPayload().toString(), JwtModel.class);

        if (jwtModel.getDocument_type().equals("CITIZENCARD")) {
            jwtModel.setDocument_type("CITIZEN-IDENTITY-CARD");
        }
//        String mobile = jwtModel.getPhone_number().replace("84", "0");
//        jwtModel.setPhone_number(mobile);

//        session = rsspService.handShake(lang, connectorNameRSSP, enterpriseId, workFlowId);
//        if (session == null) {
//            session = rsspService.handShake(checkCertificateRequest.getLang(), checkCertificateRequest.getConnectorNameRSSP(), checkCertificateRequest.getEnterpriseId(), checkCertificateRequest.getWorkFlowId());
////            commonRepository.connectorLog(connectorLogRequest);
//        }
//        session = rsspService.handShake(checkCertificateRequest.getLang(), checkCertificateRequest.getConnectorNameRSSP(), checkCertificateRequest.getEnterpriseId(), checkCertificateRequest.getWorkFlowId());
        rsspService.getProperty(checkCertificateRequest);

        rsspService.login();
        rsspService.ownerCreate(jwtModel, checkCertificateRequest.getLang());
        try {
            CredentialList credentialList = rsspService.credentialsList(checkCertificateRequest.getLang(), jwtModel.getDocument_type() + ":" + jwtModel.getDocument_number());
            CredentialInfo credentialinFo = null;

            List<CertResponse> listCertificate = new ArrayList<>();
            if (credentialList.getCerts().size() > 0) {
                for (CredentialItem credential : credentialList.getCerts()) {
                    if (credential.getValidTo() == null || credentialList.getCerts().isEmpty() || CommonFunction.checkTimeExpired(credential.getValidTo())) {
                        continue;
                    }
                    String credentialID = credential.getCredentialID();
                    credentialinFo = rsspService.getCredentialinFo(checkCertificateRequest.getLang(), credentialID);
                    if (credentialinFo != null) {
                        String authMode = credentialinFo.getAuthMode();
                        String status = credentialinFo.getCert().getStatus();
//                    System.out.println("authMode ne: " + authMode);
//                    System.out.println("status ne: " + status);
                        if ("EXPLICIT/JWT".equals(authMode) && "OPERATED".equals(status)) {
                            int lastIndex = credentialinFo.getCert().getCertificates().size() - 1;
                            String certChain = credentialinFo.getCert().getCertificates().get(lastIndex);
                            listCertificate.add(CommonFunction.certificateInfo(certChain, authMode, credentialID));
                        }
                    }
                }
            }
            return listCertificate;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    public CertResponse createCertificate(CheckCertificateRequest checkCertificateRequest) throws Throwable {

        SignedJWT jwt1 = (SignedJWT) JWTParser.parse(checkCertificateRequest.getJwt());
        Gson gson = new Gson();
        JwtModel jwtModel = gson.fromJson(jwt1.getPayload().toString(), JwtModel.class);
        String assurance = checkCertificateRequest.getAssurance();
//        System.out.println("assurance: " + assurance);
        String taxCode = checkCertificateRequest.getTaxCode();
        System.out.println("type: " + jwtModel.getDocument_type());
        if (jwtModel.getDocument_type().equals("CITIZENCARD")) {
            jwtModel.setDocument_type("CITIZEN-IDENTITY-CARD");
        }

        String credentialID = rsspService.credentialsIssue(jwtModel, checkCertificateRequest.getLang(), checkCertificateRequest.getAuthMode(), assurance, taxCode);
        System.out.println("credentialID: " + credentialID);

        CredentialInfo credentialinFo = rsspService.getCredentialinFo(checkCertificateRequest.getLang(), credentialID);
        if (credentialinFo != null) {
            int lastIndex = credentialinFo.getCert().getCertificates().size() - 1;
            String certChain = credentialinFo.getCert().getCertificates().get(lastIndex);
            return CommonFunction.certificateInfo(certChain, checkCertificateRequest.getAuthMode() , credentialID);
        }
        return null;
    }


    public String credentialOTP(CheckCertificateRequest checkCertificateRequest) throws Throwable {
        return rsspService.sendOTP(checkCertificateRequest.getLang(), checkCertificateRequest.getCredentialID());
    }

    public String authorizeOTPFps(AuthorizeOTPRequest authorizeOTPRequest, HttpServletRequest request) throws Throwable {
        String field_name = authorizeOTPRequest.getFieldName();
        System.out.println("field_name: " + field_name);
        String signingToken = authorizeOTPRequest.getSigningToken();
        String signerToken = authorizeOTPRequest.getSignerToken();
        String lang = authorizeOTPRequest.getLang();
        String codeNumber = authorizeOTPRequest.getCodeNumber();
        String credentialID = authorizeOTPRequest.getCredentialID();
        String signingOption = authorizeOTPRequest.getSigningOption();
        String certChain = authorizeOTPRequest.getCertChain();
        String country = !Objects.equals(authorizeOTPRequest.getCountry(), "") ? authorizeOTPRequest.getCountry() : authorizeOTPRequest.getCountryRealtime();
        String imageBase64 = authorizeOTPRequest.getImageBase64();
        String otpRequestID = authorizeOTPRequest.getRequestID() == null ? "" : authorizeOTPRequest.getRequestID();
        String otp = authorizeOTPRequest.getOtp();
        String contactInfor = authorizeOTPRequest.getContactInfor();
        String assurance = authorizeOTPRequest.getAssurance();
        List<TextField> textFields = authorizeOTPRequest.getTextField();

        try {
            boolean error = false;
            WorkFlowList rsWFList = new WorkFlowList();
            connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);
            String sResult = "0";

            if (rsWFList == null || rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
//                error = true;
                sResult = "Signer Status invalid";// trạng thái không hợp lệ
                return sResult;
//                throw new Exception(sResult);
            }

            // check workflow participant
            Participants rsParticipant = new Participants();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
            if (rsParticipant == null || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
                return sResult = "The document has already been signed";
            }
            String signerId = rsParticipant.getSignerId();

            LastFile lastFile = new LastFile();
            connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, signingToken);

            String fileName = lastFile.getLastPplFileName();
            int documentId = lastFile.getDocumentId();
            String deadline = lastFile.getDeadlineAt();
            int lastFileId = lastFile.getLastPplFileSignedId();
            int enterpriseId = lastFile.getEnterpriseId();
            String workFlowType = lastFile.getWorkflowProcessType();

            String pDMS_PROPERTY = CommonFunction.getPropertiesFMS();

//            if (textFields.size() > 0) {
//                fpsService.fillForm(documentId, textFields,"text");
//            }
            fpsService.fillVotri(documentId, textFields);

            List<String> listCertChain = new ArrayList<>();
            listCertChain.add(certChain);

            HashFileRequest hashFileRequest = new HashFileRequest();

            hashFileRequest.setCertificateChain(listCertChain);
            hashFileRequest.setSigningReason(rsParticipant.getSigningPurpose() != null ? rsParticipant.getSigningPurpose() : "Sign Document");
            hashFileRequest.setSignatureAlgorithm("RSA");
            hashFileRequest.setSignedHash("SHA256");
            hashFileRequest.setSigningLocation(country);
            hashFileRequest.setFieldName(field_name);
            hashFileRequest.setHandSignatureImage(imageBase64);
            hashFileRequest.setSignerContact(contactInfor);

            String hashList = fpsService.hashSignatureField(documentId, hashFileRequest);

            HashAlgorithmOID hashAlgo = HashAlgorithmOID.SHA_256;
            DocumentDigests doc = new DocumentDigests();
            doc.hashAlgorithmOID = "2.16.840.1.101.3.4.2.1";
            doc.hashes = new ArrayList<>();
            doc.hashes.add(CommonFunction.base64Decode(hashList));

            String sad = rsspService.authorizeOtp(lang, credentialID, 1, otpRequestID, otp, null, null, null);

            String signAlgo = "1.2.840.113549.1.1.1";
            List<byte[]> signatures = rsspService.signHash(lang, credentialID, doc, signAlgo, sad);
            String signature = Base64.getEncoder().encodeToString(signatures.get(0));
            System.out.println("kiem tra signature: " + signature);

            FpsSignRequest fpsSignRequest = new FpsSignRequest();
            fpsSignRequest.setFieldName(field_name);
            fpsSignRequest.setHashValue(hashList);
            fpsSignRequest.setSignatureValue(signature);

            fpsSignRequest.setCertificateChain(listCertChain);

            System.out.println("dong goi signature: ");

            String responseSign = fpsService.signDocument(documentId, fpsSignRequest);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode signNode = objectMapper.readTree(responseSign);
            String uuid = signNode.get("uuid").asText();
            int fileSize = signNode.get("file_size").asInt();
            String digest = signNode.get("digest").asText();
            String signedHash = signNode.get("signed_hash").asText();
            String signedTime = signNode.get("signed_time").asText();
            String signatureName = signNode.get("signature_name").asText();
            String content = signNode.get("file_data").asText();

            String dataResponse = gatewayAPI.getSignatureId(signatureName, fileName, content, digest);

            JsonNode dataNode = objectMapper.readTree(dataResponse);
            String signatureId = dataNode.get("id").asText();

            String signedType = assurance.equals("ESEAL") || assurance.equals("QSEAL") ? "ESEAL" : "NORMAL";
            int isSetPosition = 1;
            postBack.postBack2(deadline, rsParticipant, workFlowType, content, dataResponse, signedType, isSetPosition, signerId, fileName, signingToken, pDMS_PROPERTY, signatureId, signerToken, signedTime, rsWFList, lastFileId, certChain, codeNumber, signingOption, uuid, fileSize, enterpriseId, digest, signedHash, signature, request);
            return responseSign;

        } catch (Exception e) {
            e.printStackTrace();
//            if (field_name == null || field_name.isEmpty()) {
//                fpsService.deleteSignatue(documentId, signerId);
//            }

            throw new Exception(e.getMessage());
        }

//        return sad;
    }

    public String authorizeJwt(AuthorizeOTPRequest authorizeOTPRequest, HttpServletRequest request) throws Throwable {
        String fieldName = authorizeOTPRequest.getFieldName();
        String signingToken = authorizeOTPRequest.getSigningToken();
        String signerToken = authorizeOTPRequest.getSignerToken();
        String lang = authorizeOTPRequest.getLang();
        String codeNumber = authorizeOTPRequest.getCodeNumber();
        String credentialID = authorizeOTPRequest.getCredentialID();
        String signingOption = authorizeOTPRequest.getSigningOption();
        String certChain = authorizeOTPRequest.getCertChain();
        String country = !Objects.equals(authorizeOTPRequest.getCountry(), "") ? authorizeOTPRequest.getCountry() : authorizeOTPRequest.getCountryRealtime();
        String imageBase64 = authorizeOTPRequest.getImageBase64();
        String otpRequestID = authorizeOTPRequest.getRequestID();

        String contactInfor = authorizeOTPRequest.getContactInfor();
        String assurance = authorizeOTPRequest.getAssurance();
        List<TextField> textFields = authorizeOTPRequest.getTextField();

        try {
            boolean error = false;
            WorkFlowList rsWFList = new WorkFlowList();
            connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);
            String sResult = "0";

            if (rsWFList == null || rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
//                error = true;
                sResult = "Signer Status invalid";// trạng thái không hợp lệ
                return sResult;
//                throw new Exception(sResult);
            }

            // check workflow participant
            Participants rsParticipant = new Participants();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
            if (rsParticipant == null || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
                return sResult = "The document has already been signed";
            }
            String signerId = rsParticipant.getSignerId();

            LastFile lastFile = new LastFile();
            connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, signingToken);

            String fileName = lastFile.getLastPplFileName();
            int documentId = lastFile.getDocumentId();
            String deadline = lastFile.getDeadlineAt();
            int lastFileId = lastFile.getLastPplFileSignedId();
            int enterpriseId = lastFile.getEnterpriseId();
            String workFlowType = lastFile.getWorkflowProcessType();

            String pDMS_PROPERTY = CommonFunction.getPropertiesFMS();

//            if (textFields.size() > 0) {
//                fpsService.fillForm(documentId, textFields,"text");
//            }
            fpsService.fillVotri(documentId, textFields);

            List<String> listCertChain = new ArrayList<>();
            listCertChain.add(certChain);

            HashFileRequest hashFileRequest = new HashFileRequest();

            hashFileRequest.setCertificateChain(listCertChain);
            hashFileRequest.setSigningReason(rsParticipant.getSigningPurpose() != null ? rsParticipant.getSigningPurpose() : "Sign Document");
            hashFileRequest.setSignatureAlgorithm("RSA");
            hashFileRequest.setSignedHash("SHA256");
            hashFileRequest.setSigningLocation(country);
            hashFileRequest.setFieldName(fieldName);
            hashFileRequest.setHandSignatureImage(imageBase64);
            hashFileRequest.setSignerContact(contactInfor);

            String hash = fpsService.hashSignatureField(documentId, hashFileRequest);

            String jwt = authorizeOTPRequest.getJwt();
            String documentDigestsBase64 = "";
            String sad = "";
            System.out.println("kiem tra image: " + authorizeOTPRequest.getImageFace());
            if (authorizeOTPRequest.getImageFace() != null && !authorizeOTPRequest.getImageFace().isEmpty()) {
                List<String> hashList = new ArrayList<>();
                hashList.add(hash);

                Map<String, Object> documentDigests = new HashMap<>();
                documentDigests.put("hashes", hashList);
                documentDigests.put("hashAlgorithmOID", "2.16.840.1.101.3.4.2.1");

                // convert Map<String, Object> documentDigests to base64
                documentDigestsBase64 = CommonFunction.encodeObjectToBase64(documentDigests);

                FaceAndCreateRequest faceAndCreateRequest = new FaceAndCreateRequest();
                faceAndCreateRequest.setImageFace(authorizeOTPRequest.getImageFace());
                faceAndCreateRequest.setCode(authorizeOTPRequest.getCode());
                faceAndCreateRequest.setType(authorizeOTPRequest.getType());
                faceAndCreateRequest.setLang(authorizeOTPRequest.getLang());
                PerformResponse performResponse = faceMatching(faceAndCreateRequest, documentDigestsBase64);
                if (performResponse.getStatus() == 0) {
//                    performResponse.setJwt(performResponse.getPerform_result().getFinal_result().getClaim_sources().getJWT());
                    jwt = performResponse.getPerform_result().getFinal_result().getClaim_sources().getJWT();
                }
                int scal = 2;

                sad = rsspService.authorizeOtp(lang, credentialID, 1, otpRequestID, null, jwt, scal, documentDigests);
            } else {
                int scal = 1;
                sad = rsspService.authorizeOtp(lang, credentialID, 1, otpRequestID, null, jwt, scal, null);
            }

//            List<String> hashList = new ArrayList<>();
//            hashList.add(hash);
//
//            Map<String, Object> documentDigests = new HashMap<>();
//            documentDigests.put("hashes", hashList);
//            documentDigests.put("hashAlgorithmOID", "2.16.840.1.101.3.4.2.1");
//
//            // convert Map<String, Object> documentDigests to base64
//            String documentDigestsBase64 = CommonFunction.encodeObjectToBase64(documentDigests);
//
//            FaceAndCreateRequest faceAndCreateRequest = new FaceAndCreateRequest();
//            faceAndCreateRequest.setImageFace(authorizeOTPRequest.getImageFace());
//            faceAndCreateRequest.setCode(authorizeOTPRequest.getCode());
//            faceAndCreateRequest.setType(authorizeOTPRequest.getType());
//            faceAndCreateRequest.setLang(authorizeOTPRequest.getLang());
//            PerformResponse performResponse = faceMatching(faceAndCreateRequest, documentDigestsBase64);
//            if (performResponse.getStatus() == 0) {
//                performResponse.setJwt(performResponse.getPerform_result().getFinal_result().getClaim_sources().getJWT());
//            }


            DocumentDigests doc = new DocumentDigests();
            doc.hashAlgorithmOID = "2.16.840.1.101.3.4.2.1";
            doc.hashes = new ArrayList<>();
            doc.hashes.add(CommonFunction.base64Decode(hash));

//            int scal = 2;

//            String sad = rsspService.authorizeOtp(lang, credentialID, 1, otpRequestID, null, jwt, scal, documentDigests);

            String signAlgo = "1.2.840.113549.1.1.1";
            List<byte[]> signatures = rsspService.signHash(lang, credentialID, doc, signAlgo, sad);
            String signature = Base64.getEncoder().encodeToString(signatures.get(0));
            System.out.println("kiem tra signature: " + signature);

            FpsSignRequest fpsSignRequest = new FpsSignRequest();
            fpsSignRequest.setFieldName(fieldName);
            fpsSignRequest.setHashValue(hash);
            fpsSignRequest.setSignatureValue(signature);

            fpsSignRequest.setCertificateChain(listCertChain);

            System.out.println("dong goi signature: ");

            String responseSign = fpsService.signDocument(documentId, fpsSignRequest);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode signNode = objectMapper.readTree(responseSign);
            String uuid = signNode.get("uuid").asText();
            int fileSize = signNode.get("file_size").asInt();
            String digest = signNode.get("digest").asText();
            String signedHash = signNode.get("signed_hash").asText();
            String signedTime = signNode.get("signed_time").asText();
            String signatureName = signNode.get("signature_name").asText();
            String content = signNode.get("file_data").asText();

            String dataResponse = gatewayAPI.getSignatureId(signatureName, fileName, content, digest);

            JsonNode dataNode = objectMapper.readTree(dataResponse);
            String signatureId = dataNode.get("id").asText();

            String signedType = assurance.equals("ESEAL") || assurance.equals("QSEAL") ? "ESEAL" : "NORMAL";
            int isSetPosition = 1;
            postBack.postBack2(deadline, rsParticipant, workFlowType, content, dataResponse, signedType, isSetPosition, signerId, fileName, signingToken, pDMS_PROPERTY, signatureId, signerToken, signedTime, rsWFList, lastFileId, certChain, codeNumber, signingOption, uuid, fileSize, enterpriseId, digest, signedHash, signature, request);
            return responseSign;

        } catch (Exception e) {
            e.printStackTrace();
//            if (field_name == null || field_name.isEmpty()) {
//                fpsService.deleteSignatue(documentId, signerId);
//            }

            throw new Exception(e.getMessage());
        }

//        return sad;
    }
}
