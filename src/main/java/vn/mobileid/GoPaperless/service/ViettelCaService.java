package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.controller.GatewayAPI;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.dto.rsspDto.TextField;
import vn.mobileid.GoPaperless.dto.rsspDto.VtRequest;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.LastFile;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.fpsModel.FpsSignRequest;
import vn.mobileid.GoPaperless.model.fpsModel.HashFileRequest;
import vn.mobileid.GoPaperless.model.vtcaModel.VtConstants;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ViettelCaService {
    private final ProcessDb connect;
    private final VtConstants vtConstants = new VtConstants();
    private final RestTemplate restTemplate = new RestTemplate();
    private final FpsService fpsService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final GatewayAPI gatewayAPI;
    private final PostBack postBack;

    public ViettelCaService(ProcessDb connect, FpsService fpsService, GatewayAPI gatewayAPI, PostBack postBack) {
        this.connect = connect;
        this.fpsService = fpsService;
        this.gatewayAPI = gatewayAPI;
        this.postBack = postBack;
    }

    public String login(String userId) throws Exception {
        System.out.println("login");
        String loginUrl = vtConstants.getBaseUrl() + "/vtss/service/ras/v1/login";

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("client_id", vtConstants.getClientId());
        requestData.put("user_id", userId);
        requestData.put("client_secret", vtConstants.getClientSecret());
        requestData.put("profile_id", vtConstants.getProfileId());

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data login as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(loginUrl, HttpMethod.POST, httpEntity,
                    String.class);

            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            return jsonNode.get("access_token").asText();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(CommonFunction.handleLoginError(e.getMessage()));
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public void getVtConnector(VtRequest data) throws Exception {
        System.out.println("getVtConnector");
        ConnectorName IdentierConnector = connect.getIdentierConnector(data.getConnectorName());
        String prefixCode = IdentierConnector.getPrefixCode();

        JsonNode jsonObject = new ObjectMapper().readTree(IdentierConnector.getIdentifier());
        JsonNode attributes = jsonObject.get("attributes");

        for (JsonNode att : attributes) {
            JsonNode nameNode = att.get("name");
            JsonNode valueNode = att.get("value");

            if (nameNode != null && valueNode != null) {
                String name = nameNode.asText();
                String value = valueNode.asText();

                if ("URI".equals(name)) {
                    vtConstants.setBaseUrl(value);
                }
                if ("CLIENT_ID".equals(name)) {
                    vtConstants.setClientId(value);
                }
                if ("CLIENT_SECRET".equals(name)) {
                    vtConstants.setClientSecret(value);
                }
                if ("PROFILE_ID".equals(name)) {
                    vtConstants.setProfileId(value);
                }
            }
        }
    }

    public String getCertificates(VtRequest data, String accessToken) throws Exception {
        System.out.println("getCertificates");
//        String accessToken = login(data.getCodeNumber());
        String getCertificatesUrl = vtConstants.getBaseUrl() + "/vtss/service/certificates/info";

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + accessToken);

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("client_id", vtConstants.getClientId());
        requestData.put("user_id", data.getUserId());
        requestData.put("client_secret", vtConstants.getClientSecret());
        requestData.put("profile_id", vtConstants.getProfileId());
        requestData.put("certificates", "single");
        requestData.put("certInfo", true);
        requestData.put("authInfo", true);

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data getCertificates as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(getCertificatesUrl, HttpMethod.POST, httpEntity,
                    String.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                accessToken = login(data.getUserId());
                return getCertificates(data, accessToken);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String signHash(String userId, String accessToken, String credentialID, int documentId, String base64FileName, String hash) throws Exception {
        System.out.println("signHash");
        String signHashUrl = vtConstants.getBaseUrl() + "/vtss/service/signHash";
        System.out.println("signHashUrl: " + signHashUrl);

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + accessToken);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("client_id", vtConstants.getClientId());
        requestData.put("client_secret", vtConstants.getClientSecret());
        requestData.put("credentialID", credentialID);
        requestData.put("numSignatures", 1);

        Map<String, Object> documents = new HashMap<>();
        documents.put("document_id", documentId);
        documents.put("document_name", base64FileName);

        List<Map<String, Object>> listDocuments = new ArrayList<>();
        listDocuments.add(documents);

        requestData.put("documents", listDocuments);

        List<String> hashList = new ArrayList<>();
        hashList.add(hash);

        requestData.put("hash", hashList);
        requestData.put("hashAlgo", vtConstants.getHashAlgo());
        requestData.put("signAlgo", vtConstants.getSignAlgo());
        requestData.put("async", 0);

        // Convert requestData to JSON string
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request signHash as JSON: " + requestDataJson);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(signHashUrl, HttpMethod.POST, httpEntity,
                    String.class);
            System.out.println("response: " + response.getBody());

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                accessToken = login(userId);
                return signHash(userId, accessToken, credentialID, documentId, base64FileName, hash);
            } else {
                CommonFunction.handleLoginError(e.getMessage());
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }

    }

    public String vtcaSignFile(VtRequest data, HttpServletRequest request) throws Exception {
        System.out.println("misaSignFile");

        String signerId = "";
        String signingToken = data.getSigningToken();
        String signerToken = data.getSignerToken();
        String signingOption = data.getSigningOption();
        List<TextField> textFields = data.getTextField();
        String certChain = data.getCertChain().getCert();
        String country = data.getCountry();
        String field_name = data.getFieldName();
        String imageBase64 = data.getImageBase64();
        String contactInfor = data.getContactInfor();
        String accessToken = data.getAccessToken();
        String assurance = data.getAssurance();
        String credentialID = data.getCredentialID();
        String codeNumber = data.getUserId();

        try {
            WorkFlowList rsWFList = new WorkFlowList();
            connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);

            if (rsWFList == null || rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
                throw new Exception("Workflow status is not valid or has been signed");
            }

            Participants rsParticipant = new Participants();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
            if (rsParticipant == null || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
//                return sResult = "The document has already been signed";
                throw new Exception("Signer status is not valid or has been signed");
            }
            signerId = rsParticipant.getSignerId();
            LastFile lastFile = new LastFile();
            connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, signingToken);

            String fileName = lastFile.getLastPplFileName();
            int documentId = lastFile.getDocumentId();
            String deadline = lastFile.getDeadlineAt();
            int lastFileId = lastFile.getLastPplFileSignedId();
            int enterpriseId = lastFile.getEnterpriseId();
            String workFlowType = lastFile.getWorkflowProcessType();

            String pDMS_PROPERTY = CommonFunction.getPropertiesFMS();
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

            String base64FileName = CommonFunction.convertBase64(fileName);

//            (String userId, String accessToken, String credentialID, int documentId, String base64FileName, String hash)
            String signatureList = signHash(codeNumber, accessToken, credentialID, documentId, base64FileName, hashList);

            JsonNode jsonNode = objectMapper.readTree(signatureList);
            JsonNode signaturesNode = jsonNode.get("signatures");
            String signature = signaturesNode.get(0).asText();
            System.out.println("signatures: " + signature);

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

            String signedType = assurance.equals("ESEAL") || assurance.equals("QSEAL") ? "ESEAL" : "NORMAL";
            int isSetPosition = 1;
            postBack.postBack2(deadline, rsParticipant, workFlowType, content, dataResponse, signedType, isSetPosition, signerId, fileName, signingToken, pDMS_PROPERTY, signatureId, signerToken, signedTime, rsWFList, lastFileId, certChain, codeNumber, signingOption, uuid, fileSize, enterpriseId, digest, signedHash, signature, request);


            return "OK";
        } catch (Exception e) {
            e.printStackTrace();
//            if (field_name == null || field_name.isEmpty()) {
//                fpsService.deleteSignatue(documentId, signerId);
//            }
            System.out.println("error: " + e.getMessage());
            throw new Exception(e.getMessage());
//            throw new Exception("Server error occurred. Please try again later.");
        }
    }
}
