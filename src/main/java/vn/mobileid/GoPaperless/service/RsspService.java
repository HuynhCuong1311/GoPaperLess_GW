package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import ua_parser.Client;
import ua_parser.Parser;
import vn.mobileid.GoPaperless.controller.GatewayAPI;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.dto.rsspDto.TextField;
import vn.mobileid.GoPaperless.model.Electronic.datatypes.JwtModel;
import vn.mobileid.GoPaperless.model.Electronic.request.CheckCertificateRequest;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.LastFile;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.fpsModel.FpsSignRequest;
import vn.mobileid.GoPaperless.model.fpsModel.HashFileRequest;
import vn.mobileid.GoPaperless.model.rsspModel.*;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;
import vn.mobileid.GoPaperless.utils.VCStoringService;
import vn.mobileid.model.x509.CertificateToken;
import vn.mobileid.spi.DSSUtils;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class RsspService {

    private final RestTemplate restTemplate = new RestTemplate();

    private String refreshToken;
    private String bearer;
    private String lang;
    private final String profile = "rssp-119.432-v2.0";

    private int retryLogin = 0;

    private final ProcessDb connect;

    private final PostBack postBack;

    private final GatewayAPI gatewayAPI;

    private final Property property;

    private final FpsService fpsService;

    private final VCStoringService vcStoringService;

    public RsspService(ProcessDb connect, PostBack postBack, GatewayAPI gatewayAPI, Property property, FpsService fpsService, VCStoringService vcStoringService) {
        this.connect = connect;
        this.postBack = postBack;
        this.gatewayAPI = gatewayAPI;
        this.property = property;
        this.fpsService = fpsService;
        this.vcStoringService = vcStoringService;
    }

    @Value("${dev.mode}")
    private boolean devMode;

    public void login() throws Exception {
        System.out.println("____________auth/login____________");
//        Property property = new Property();

        String loginUrl = property.getBaseUrl() + "auth/login";

        String authHeader;

        if (refreshToken != null) {
            authHeader = refreshToken;
        } else {
            retryLogin++;
            authHeader = property.getAuthorization();
        }

//        authHeader = property.getAuthorization();

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("rememberMeEnabled", true);
        requestData.put("relyingParty", property.getRelyingParty());
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<LoginResponse> response = restTemplate.exchange(loginUrl, HttpMethod.POST, httpEntity, LoginResponse.class);

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006) {
                refreshToken = null;
                if (retryLogin >= 5) {
                    retryLogin = 0;
                    System.out.println("Response code: " + response.getBody().getError());
                    System.out.println("Response Desscription: " + response.getBody().getErrorDescription());
                    System.out.println("Response ID: " + response.getBody().getResponseID());
                    System.out.println("AccessToken: " + response.getBody().getAccessToken());
//                    throw new Exception(response.getBody().getErrorDescription());
                }
                login();
            } else if (response.getBody().getError() != 0) {
                System.out.println("Err code khac 0: " + response.getBody().getError());
                System.out.println("Err Desscription: " + response.getBody().getErrorDescription());
                System.out.println("Response ID: " + response.getBody().getResponseID());
//                throw new Exception(response.getBody().getErrorDescription());
            } else {
                this.bearer = "Bearer " + response.getBody().getAccessToken();

                if (response.getBody().getRefreshToken() != null) {
                    this.refreshToken = "Bearer " + response.getBody().getRefreshToken();
                    System.out.println("Response code: " + response.getBody().getError());
                    System.out.println("Response Desscription: " + response.getBody().getErrorDescription());
                    System.out.println("Response ID: " + response.getBody().getResponseID());
                    System.out.println("AccessToken: " + response.getBody().getAccessToken());
                }
            }
        } catch (HttpClientErrorException e) {
            System.out.println("____________auth/login____________ error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
//            if (statusCode.value() == 401) {
//                getAccessToken();
//                return addSignature(documentId, field, data, drag);
//            } else {
            throw new Exception(e.getMessage());
//            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }

//        return "response";
    }

    public CredentialList credentialsList(String lang, String codeNumber) throws Exception {
        System.out.println("____________credentialsLists/list____________");

        String credentialsListUrl = property.getBaseUrl() + "credentials/list";
        String authHeader = bearer;

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("userID", codeNumber);
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        Map<String, Object> searchConditions = new HashMap<>();
        searchConditions.put("certificateStatus", "GOOD");

        requestData.put("searchConditions", searchConditions);
        requestData.put("certInfoEnabled", true);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        try {

            ResponseEntity<CredentialList> response = restTemplate.exchange(credentialsListUrl, HttpMethod.POST, httpEntity, CredentialList.class);
            System.out.println("response: " + response.getBody().getError());
            System.out.println("error: " + response.getBody().getError());
            System.out.println("getErrorDescription: " + response.getBody().getErrorDescription());
            System.out.println("response: " + response.getStatusCode());

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006) {
                login();
                return credentialsList(lang, codeNumber);
            } else if (response.getBody().getError() != 0) {
                System.out.println("Err Code: " + response.getBody().getError());
                System.out.println("Err Desscription: " + response.getBody().getErrorDescription());
                throw new Exception(response.getBody().getErrorDescription());
            }

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("____________auth/login____________ error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            System.out.println("error: " + e.getMessage());
//            throw new Exception(e.getMessage());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public CredentialInfo getCredentialinFo(String lang, String credentialID) throws Exception {
//        System.out.println("____________credentialsLists/info____________");

        String credentialInfoUrl = property.getBaseUrl() + "credentials/info";
        String authHeader = bearer;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("credentialID", credentialID);
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<CredentialInfo> response = restTemplate.exchange(credentialInfoUrl, HttpMethod.POST, httpEntity, CredentialInfo.class);
//            System.out.println("error: " + response.getBody().getError());
//            System.out.println("getErrorDescription: " + response.getBody().getErrorDescription());
            System.out.println("response: " + response.getStatusCode());

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006) {
                login();
                return getCredentialinFo(lang, credentialID);
            } else if (response.getBody().getError() != 0) {
//                System.out.println("Err Code: " + response.getBody().getError());
//                System.out.println("Err Desscription: " + response.getBody().getErrorDescription());
//                throw new Exception(response.getBody().getErrorDescription());
                return null;
            }

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("credentialsLists/info error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
//            throw new Exception(e.getMessage());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String authorizeVc(String lang, String credentialID, DocumentDigests doc, MobileDisplayTemplate displayTemplate, int numSignatures) throws Exception {
        System.out.println("____________credentialsLists/authorizeVc____________");

        String authorizeVcUrl = property.getBaseUrl() + "credentials/authorize";
        System.out.println("authorizeVcUrl: " + authorizeVcUrl);
        String authHeader = bearer;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("credentialID", credentialID);
        requestData.put("numSignatures", numSignatures);
        requestData.put("documentDigests", doc);
        requestData.put("notificationMessage", displayTemplate.getNotificationMessage());
        requestData.put("messageCaption", displayTemplate.getMessageCaption());
        requestData.put("message", displayTemplate.getMessage());
        requestData.put("rpName", displayTemplate.getRpName());
        requestData.put("scaIdentity", displayTemplate.getScaIdentity());
        requestData.put("vcEnabled", displayTemplate.isVcEnabled());
        requestData.put("acEnabled", displayTemplate.isAcEnabled());
//        requestData.put("signAlgo", "1.2.840.113549.1.1.11");
        requestData.put("validityPeriod", 300);
        requestData.put("operationMode", "S");

        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(authorizeVcUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return authorizeVc(lang, credentialID, doc, displayTemplate, numSignatures);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
                throw new Exception(jsonNode.get("errorDescription").asText());
            }
            return jsonNode.get("SAD").asText();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public String authorizeOtp(String lang, String credentialID, int numSignatures,
                               String otpRequestID, String otp, String jwt, Integer scal, Map<String, Object> documentDigests) throws Exception {
        System.out.println("____________credentials/authorize____________");
        String authorizeOtpUrl = property.getBaseUrl() + "credentials/authorize";
        System.out.println("authorizeOtpUrl: " + authorizeOtpUrl);
        // numSignatures =1;
        String authHeader = bearer;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("vcEnabled", true);
        requestData.put("credentialID", credentialID);
        requestData.put("numSignatures", numSignatures);
        if (otpRequestID != null) {
            requestData.put("requestID", otpRequestID);
        }
        if (jwt != null) {
            requestData.put("jwt", jwt);
        }
        if (scal != null) {
            requestData.put("SCAL", scal);
        }
        if (documentDigests != null) {
            requestData.put("documentDigests", documentDigests);
        }
        if (otp != null) {
            requestData.put("authorizeCode", otp);
        }

        requestData.put("validityPeriod", 300);
        requestData.put("operationMode", "S");
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data credentials/authorize as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(authorizeOtpUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

//            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return authorizeOtp(lang, credentialID, numSignatures, otpRequestID, otp, jwt, null, null);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
                throw new Exception(jsonNode.get("errorDescription").asText());
            }
            return jsonNode.get("SAD").asText();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public String sendOTP(String lang, String credentialID) throws Throwable {
        System.out.println("____________credentials/sendOTP____________");

        String sendOTPUrl = property.getBaseUrl() + "credentials/sendOTP";
        String authHeader = bearer;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("credentialID", credentialID);
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(sendOTPUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return sendOTP(lang, credentialID);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
                throw new Exception(jsonNode.get("errorDescription").asText());
            }
            return jsonNode.get("responseID").asText();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public List<byte[]> signHash(String lang, String credentialID, DocumentDigests doc, String signAlgo, String sad) throws Exception {
        System.out.println("____________signatures/signHash____________");
        String signHashUrl = property.getBaseUrl() + "signatures/signHash";

        String authHeader = bearer;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("credentialID", credentialID);
        requestData.put("documentDigests", doc);
        requestData.put("operationMode", "S");
        requestData.put("signAlgo", signAlgo);
        requestData.put("validityPeriod", 300);
        requestData.put("SAD", sad);
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(requestData);
        System.out.println("jsonSignHash: " + json);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<SignHashResponse> response = restTemplate.exchange(signHashUrl, HttpMethod.POST, httpEntity, SignHashResponse.class);
            System.out.println("error: " + response.getBody().getError());
            System.out.println("getErrorDescription: " + response.getBody().getErrorDescription());
            System.out.println("response: " + response.getStatusCode());

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006) {
                login();
                return signHash(lang, credentialID, doc, signAlgo, sad);
            } else if (response.getBody().getError() != 0) {
                System.out.println("Err Code: " + response.getBody().getError());
                System.out.println("Err Desscription: " + response.getBody().getErrorDescription());
//                throw new Exception(response.getBody().getErrorDescription());
                throw new Exception("Server error occurred. Please try again later.");
//                return null;
            }

            return response.getBody().getSignatures();
        } catch (HttpClientErrorException e) {
            System.out.println("credentialsLists/signHash error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }

    }

    public void getProperty(CheckCertificateRequest checkCertificateRequest) throws Exception {
        ConnectorName connectorName = connect.getIdentierConnector(checkCertificateRequest.getConnectorName());
        System.out.println("getCertificates");
        String prefixCode = connectorName.getPrefixCode();
//        this.lang = request.getLanguage();
//        boolean codeEnable = true;
//        Property property = new Property();
        JsonNode jsonObject = new ObjectMapper().readTree(connectorName.getIdentifier());
        JsonNode attributes = jsonObject.get("attributes");

        for (JsonNode att : attributes) {
            JsonNode nameNode = att.get("name");
            JsonNode valueNode = att.get("value");

            if (nameNode != null && valueNode != null) {
                String name = nameNode.asText();
                String value = valueNode.asText();

                if ("URI".equals(name)) {
//                    BaseURL = value;
                    property.setBaseUrl(value);
                }
                if ("NAME".equals(name)) {
                    property.setRelyingParty(value);
                }
                if ("USERNAME".equals(name)) {
                    property.setRelyingPartyUser(value);
                }
                if ("PASSWORD".equals(name)) {
                    property.setRelyingPartyPassword(value);
                }
                if ("SIGNATURE".equals(name)) {
                    property.setRelyingPartySignature(value);
                }
                if (devMode) {
                    if ("SMART_ID_LCA".equals(name)) {
                        property.setRelyingPartyKeyStore("D:/project/file/LCA_GOPAPERLESS.p12");

                    } else {
                        property.setRelyingPartyKeyStore("D:/project/file/PAPERLESS.p12");
                    }
                } else if ("KEYSTORE_FILE_URL".equals(name)) {
                    property.setRelyingPartyKeyStore(value);
                }
//                if ("KEYSTORE_FILE_URL".equals(name)) {
//                    if (devMode) {
//                        property.setRelyingPartyKeyStore("D:/project/file/PAPERLESS.p12");
//                    } else {
//                        property.setRelyingPartyKeyStore(value);
//                    }
//                }
                if ("KEYSTORE_PASSWORD".equals(name)) {
                    property.setRelyingPartyKeyStorePassword(value);
                }
//                if ("VERIFICATION_CODE_ENABLED".equals(name)) {
//                    codeEnable = Boolean.parseBoolean(value);
//                }
            }
        }
//        return property;
    }

    public String ownerCreate(JwtModel jwt, String lang) throws Exception {
        System.out.println("____________owner/create____________");

        String ownerCreateUrl = property.getBaseUrl() + "owner/create";
//        OwnerCreateRequest request = new OwnerCreateRequest();

//        request.phone = jwt.getPhone_number();
//        request.username = jwt.getDocument_number();
//        request.fullname = jwt.getName();
//        request.email = (jwt.getEmail() != null && !"".equals(jwt.getEmail())) ? jwt.getEmail() : jwt.getDocument_number() + "@gmail.com";
//        request.identificationType = jwt.getDocument_type();
//        request.identification = jwt.getDocument_number();
//        request.lang = lang;

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("phone", jwt.getPhone_number());
        requestData.put("username", jwt.getDocument_number());
        requestData.put("fullname", jwt.getName());
        requestData.put("email", (jwt.getEmail() != null && !"".equals(jwt.getEmail())) ? jwt.getEmail() : jwt.getDocument_number() + "@gmail.com");
        requestData.put("identificationType", jwt.getDocument_type());
        requestData.put("identification", jwt.getDocument_number());
        requestData.put("lang", lang);
        requestData.put("profile", profile);


        String authHeader = bearer;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(ownerCreateUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return ownerCreate(jwt, lang);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
//                throw new Exception(jsonNode.get("errorDescription").asText());
//                throw new Exception("Server error occurred. Please try again later.");
            }
            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("credentialsLists/info error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }
    }

    public String credentialsIssue(JwtModel jwt, String lang, String authMode, String assurance, String taxCode) throws Exception {
        System.out.println("____________credentials/issue____________");
        String credentialsIssueUrl = property.getBaseUrl() + "credentials/issue";

        System.out.println("type: " + jwt.getDocument_type());
        System.out.println("stateOrProvince: " + jwt.getCity_province());
        String authHeader = bearer;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("user", jwt.getDocument_number());
        requestData.put("userType", jwt.getDocument_type());
        requestData.put("authorizeCode", "");
        requestData.put("certificateProfile", "PER1D");
//        requestData.put("signingProfileValue", 0);
//        requestData.put("SCAL", 1);
        requestData.put("authMode", authMode);
        requestData.put("multisign", 1);
        requestData.put("requestID", "");
        requestData.put("hsmProfileID", 0);
        requestData.put("certificates", "single");
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        Map<String, Object> certificateDetails = new HashMap<>();
        certificateDetails.put("commonName", jwt.getName());
        certificateDetails.put("telephoneNumber", jwt.getPhone_number());
        certificateDetails.put("stateOrProvince", jwt.getCity_province());
        certificateDetails.put("country", "VN");
        certificateDetails.put("email", (jwt.getEmail() != null && !"".equals(jwt.getEmail())) ? jwt.getEmail() : jwt.getDocument_number() + "@gmail.com");


        Map<String, Object> identification = new HashMap<>();
        if (assurance.equals("NORMAL")) {
            System.out.println("assurance: " + assurance);
            identification.put("type", "CITIZEN-IDENTITY-CARD");
            identification.put("value", jwt.getDocument_number());
        } else {
            System.out.println("assurance: " + assurance);
            identification.put("type", "TAX-CODE");
            identification.put("value", taxCode);
        }
//        identification.put("type", "CITIZEN-IDENTITY-CARD");
//        identification.put("value", jwt.getDocument_number());
        List<Map<String, Object>> identifications = new ArrayList<>();
        identifications.add(identification);

        certificateDetails.put("identifications", identifications);

        requestData.put("certDetails", certificateDetails);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(credentialsIssueUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return credentialsIssue(jwt, lang, authMode, assurance, taxCode);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
//                throw new Exception(jsonNode.get("errorDescription").asText());
                throw new Exception("Server error occurred. Please try again later.");
            }
            return jsonNode.get("credentialID").asText();
        } catch (HttpClientErrorException e) {
            System.out.println("credentialsLists/info error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }
    }

    public ConnectorName getIdentierConnector(String connectorName) throws Exception {
        return connect.getIdentierConnector(connectorName);
    }

    public Map<String, Object> getCertificates(RsspRequest request) throws Exception {
        ConnectorName IdentierConnector = connect.getIdentierConnector(request.getConnectorName());
        System.out.println("connectorName: " + request.getConnectorName());
        System.out.println("getCertificates");
        String prefixCode = IdentierConnector.getPrefixCode();
        this.lang = request.getLanguage();
        boolean codeEnable = true;
//        Property property = new Property();
        JsonNode jsonObject = new ObjectMapper().readTree(IdentierConnector.getIdentifier());
        JsonNode attributes = jsonObject.get("attributes");

        for (JsonNode att : attributes) {
            JsonNode nameNode = att.get("name");
            JsonNode valueNode = att.get("value");

            if (nameNode != null && valueNode != null) {
                String name = nameNode.asText();
                String value = valueNode.asText();

                if ("URI".equals(name)) {
//                    BaseURL = value;
                    property.setBaseUrl(value);
                }
                if ("NAME".equals(name)) {
                    property.setRelyingParty(value);
                }
                if ("USERNAME".equals(name)) {
                    property.setRelyingPartyUser(value);
                }
                if ("PASSWORD".equals(name)) {
                    property.setRelyingPartyPassword(value);
                }
                if ("SIGNATURE".equals(name)) {
                    property.setRelyingPartySignature(value);
                }
                if ("KEYSTORE_FILE_URL".equals(name)) {
                    if (devMode) {
                        if ("SMART_ID_LCA".equals(request.getConnectorName())) {
                            property.setRelyingPartyKeyStore("D:/project/file/LCA_GOPAPERLESS.p12");
                        } else {
                            property.setRelyingPartyKeyStore("D:/project/file/PAPERLESS.p12");
                        }
                    } else {
                        property.setRelyingPartyKeyStore(value);
                    }
                }

                if ("KEYSTORE_PASSWORD".equals(name)) {
                    property.setRelyingPartyKeyStorePassword(value);
                }
                if ("VERIFICATION_CODE_ENABLED".equals(name)) {
                    codeEnable = Boolean.parseBoolean(value);
                }
            }
        }

        login();
        CredentialList credentialList = credentialsList(request.getLanguage(), request.getCodeNumber());
        CredentialInfo credentialinFo = null;

        Map<String, Object> response = new HashMap<>();
        response.put("relyingParty", property.getRelyingParty());
        response.put("prefixCode", prefixCode);
        response.put("codeEnable", codeEnable);

        List<CertResponse> listCertificate = new ArrayList<>();
        if (credentialList.getCerts().size() > 0) {
            for (CredentialItem credential : credentialList.getCerts()) {
                if (credential.getValidTo() == null || credentialList.getCerts().isEmpty() || CommonFunction.checkTimeExpired(credential.getValidTo())) {
                    continue;
                }
                String credentialID = credential.getCredentialID();
                credentialinFo = getCredentialinFo(request.getLanguage(), credentialID);
                if (credentialinFo != null) {
                    String authMode = credentialinFo.getAuthMode();
                    String status = credentialinFo.getCert().getStatus();
//                    System.out.println("authMode ne: " + authMode);
//                    System.out.println("status ne: " + status);
                    if ("IMPLICIT/TSE".equals(authMode) && "OPERATED".equals(status)) {
                        int lastIndex = credentialinFo.getCert().getCertificates().size() - 1;
                        String certChain = credentialinFo.getCert().getCertificates().get(lastIndex);
                        listCertificate.add(CommonFunction.certificateInfo(certChain, authMode, credentialID));
                    }
                }
            }
            response.put("listCertificate", listCertificate);
        }
        return response;
    }

    public String signFile(
            RsspRequest signRequest,
            HttpServletRequest request) throws Throwable {
        String field_name = signRequest.getFieldName();
        System.out.println("field_name: " + field_name);
        String codeNumber = signRequest.getCodeNumber();
        String connectorName = signRequest.getConnectorName();
        String country = !Objects.equals(signRequest.getCountry(), "") ? signRequest.getCountry() : signRequest.getCountryRealtime();

        int documentId = 0;
//        int enterpriseId = signRequest.getEnterpriseId();
//        String fileName = signRequest.getFileName();
        String imageBase64 = signRequest.getImageBase64();
        String lang = signRequest.getLanguage();
//        int lastFileId = signRequest.getLastFileId();
        String requestID = signRequest.getRequestID();
        String signerId = "";
        String signerToken = signRequest.getSignerToken();
        String signingOption = signRequest.getSigningOption();
//        String signingPurpose = signRequest.getSigningPurpose();
//        System.out.println("signingPurpose: " + signingPurpose);
        String signingToken = signRequest.getSigningToken();
        String relyingParty = property.getRelyingParty();
        boolean codeEnable = signRequest.isCodeEnable();
        String credentialID = signRequest.getCertChain().getCredentialID();
        String certChain = signRequest.getCertChain().getCert();
        String contactInfor = signRequest.getContactInfor();
        String assurance = signRequest.getAssurance();
        List<TextField> textFields = signRequest.getTextField();
//        String workFlowType = signRequest.getWorkFlowProcessType();

        try {
            System.out.println("connectorName: " + connectorName);
            boolean error = false;

            WorkFlowList rsWFList = new WorkFlowList();
            connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);
            String sResult = "0";

            if (rsWFList == null || rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
//                error = true;
                sResult = "Signer Status invalid";// trạng thái không hợp lệ
//                return sResult;
                throw new Exception("Workflow status is not valid or has been signed");
            }

            // check workflow participant
            Participants rsParticipant = new Participants();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
            if (rsParticipant == null || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
//                return sResult = "The document has already been signed";
                throw new Exception("Signer status is not valid or has been signed");
            }
            signerId = rsParticipant.getSignerId();

//            String meta = rsParticipant.getMetaInformation();

//            int isSetPosition = CommonFunction.checkIsSetPosition(field_name, meta);
//
//            System.out.println("isSetPosition: " + isSetPosition);

            LastFile lastFile = new LastFile();
            connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, signingToken);

            String fileName = lastFile.getLastPplFileName();
            documentId = lastFile.getDocumentId();
            String deadline = lastFile.getDeadlineAt();
            int lastFileId = lastFile.getLastPplFileSignedId();
            int enterpriseId = lastFile.getEnterpriseId();
            String workFlowType = lastFile.getWorkflowProcessType();

            String pDMS_PROPERTY = CommonFunction.getPropertiesFMS();

//            long millis = System.currentTimeMillis();
//            String sSignatureHash = signerToken + millis;
//            String sSignature_id = prefixCode + "-" + CommonFunction.toHexString(CommonFunction.hashPass(sSignatureHash)).toUpperCase();

//            if (textFields.size() > 0) {
//                fpsService.fillForm(documentId, textFields,"text");
//            }
            System.out.println("textFields: " + textFields);
            fpsService.fillVotri(documentId, textFields);
            // get user-agent
            String userAgent = request.getHeader("User-Agent");
            Parser parser = new Parser();
            Client c = parser.parse(userAgent);
            // set app interface
            String rpName = "{\"OPERATING SYSTEM\":\"" + c.os.family + " " + c.os.major + "\",\"BROWSER\":\"" + c.userAgent.family + " " + c.userAgent.major + "\",\"RP NAME\":\"" + relyingParty + "\"}";

            String fileType2 = fileName.substring(fileName.lastIndexOf(".") + 1);
            String message = " {\"FILE NAME\":\"" + fileName + "\", \"FILE TYPE\":\"" + fileType2 + "\"}";

            MobileDisplayTemplate template = new MobileDisplayTemplate();
            template.setScaIdentity("PAPERLESS GATEWAY");
            template.setMessageCaption("DOCUMENT SIGNING");
            template.setNotificationMessage("PAPERLESS GATEWAY ACTIVITES");
            template.setMessage(message);
            template.setRpName(rpName);
            template.setVcEnabled(codeEnable);
            template.setAcEnabled(true);

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

            if (codeEnable) {
                List<byte[]> list = new ArrayList<>();
                list.add(Base64.getMimeDecoder().decode(hashList));
                String codeVC = CommonFunction.computeVC(list);
                vcStoringService.store(requestID, codeVC);
            }

//            String sad = crt.authorize(connectorLogRequest, lang, credentialID, 1, doc, null, template);
//            authorizeVc(request, credentialID, doc, template, numSignatures)
            String sad = authorizeVc(lang, credentialID, doc, template, 1);
            System.out.println("kiem tra sad: " + sad);

//            commonRepository.connectorLog(connectorLogRequest);
//            SignAlgo signAlgo = SignAlgo.RSA;
            String signAlgo = "1.2.840.113549.1.1.1";
            List<byte[]> signatures = signHash(lang, credentialID, doc, signAlgo, sad);
            String signature = Base64.getEncoder().encodeToString(signatures.get(0));
            System.out.println("kiem tra signature: " + signature);

            FpsSignRequest fpsSignRequest = new FpsSignRequest();
            fpsSignRequest.setFieldName(field_name);
            fpsSignRequest.setHashValue(hashList);
            fpsSignRequest.setSignatureValue(signature);

            fpsSignRequest.setCertificateChain(listCertChain);

            System.out.println("kiem tra progress: ");

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
            System.out.println("signedTime: " + signedTime);

            String dataResponse = gatewayAPI.getSignatureId(signatureName, fileName, content, digest);

            JsonNode dataNode = objectMapper.readTree(dataResponse);
            String signatureId = dataNode.get("id").asText();

//            String sSignature_id = gatewayService.getSignatureId(uuid, fileName);
//            String sSignature_id = requestID; // temporary


            String signedType = assurance.equals("ESEAL") || assurance.equals("QSEAL") ? "ESEAL" : "NORMAL";
            int isSetPosition = 1;
            postBack.postBack2(deadline, rsParticipant, workFlowType, content, dataResponse, signedType, isSetPosition, signerId, fileName, signingToken, pDMS_PROPERTY, signatureId, signerToken, signedTime, rsWFList, lastFileId, certChain, codeNumber, signingOption, uuid, fileSize, enterpriseId, digest, signedHash, signature, request);
            return responseSign;

        } catch (Exception e) {
            e.printStackTrace();
//            if (field_name == null || field_name.isEmpty()) {
//                fpsService.deleteSignatue(documentId, signerId);
//            }
            System.out.println("error: " + e.getMessage());
            throw new Exception(e.getMessage());
//            throw new Exception("Server error occurred. Please try again later.");
        } finally {
            vcStoringService.remove(requestID);
        }

    }

    public String getVc(String requestID) {
        Long startTime = System.currentTimeMillis();
        try {
            while (true) {
                String VC = vcStoringService.get(requestID);
                if (VC != null) {
                    vcStoringService.remove(requestID);
                    return VC;
                } else {
                    Long endTime = System.currentTimeMillis();
                    if (endTime - startTime > 60000) {
                        return VC;
                    }
                    Thread.sleep(1000);
                }
            }
        } catch (Exception e) {
            return null;
        }
    }

}
