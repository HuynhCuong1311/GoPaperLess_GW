package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.controller.GatewayAPI;
import vn.mobileid.GoPaperless.dto.rsspDto.MisaRequest;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.dto.rsspDto.TextField;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.LastFile;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.fpsModel.FpsSignRequest;
import vn.mobileid.GoPaperless.model.fpsModel.HashFileRequest;
import vn.mobileid.GoPaperless.model.misaModel.MisaConstants;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MisaCaService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final ProcessDb connect;
    private final FpsService fpsService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final GatewayAPI gatewayAPI;
    private final PostBack postBack;
    private final MisaConstants misaConstants;

    public MisaCaService(ProcessDb connect, FpsService fpsService, GatewayAPI gatewayAPI, PostBack postBack, MisaConstants misaConstants) {
        this.connect = connect;
        this.fpsService = fpsService;
        this.gatewayAPI = gatewayAPI;
        this.postBack = postBack;
        this.misaConstants = misaConstants;
    }

    public void getMisaConnector(RsspRequest data) throws Exception {
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
                    misaConstants.setBaseUrl(value);
                }
                if ("CLIENT_ID".equals(name)) {
                    misaConstants.setXClientid(value);
                }
                if ("CLIENT_KEY".equals(name)) {
                    misaConstants.setXClientKey(value);
                }
            }
        }
    }

    public String login(MisaRequest data, String ipAddress, String userAgentString) throws Exception {
        System.out.println("login");
        String loginUrl = misaConstants.getBaseUrl() + "/webdev/api/auth/api/v1/auth/login-api";

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("UserAgent", userAgentString);
        headers.set("ClientIP", ipAddress);
        headers.set("DeviceId", "GoPaperless");
        headers.set("Culture", data.getLanguage().equals("VN") ? "vi-VN" : "en-US");

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("userName", data.getUserName());
        requestData.put("password", data.getPassword());

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data login as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(loginUrl, HttpMethod.POST, httpEntity,
                    String.class);

//            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            System.out.println("message: " + e.getMessage());

            throw new Exception(CommonFunction.handleLoginError(e.getMessage()));
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String getCertificates(MisaRequest data, String ipAddress, String userAgentString, String remoteSigningAccessToken) throws Exception {
        System.out.println("getCertificates");
        String getCertificatesUrl = misaConstants.getBaseUrl() + "/external/esrm/service/general/api/v1/Certificates/by-userId";
        System.out.println("getCertificatesUrl: " + getCertificatesUrl);

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("UserAgent", userAgentString);
        headers.set("ClientIP", ipAddress);
        headers.set("DeviceId", "GoPaperless");
        headers.set("x-clientid", misaConstants.getXClientid());
        headers.set("x-clientkey", misaConstants.getXClientKey());
        headers.set("AuthorizationRM", "Bearer " + remoteSigningAccessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(getCertificatesUrl, HttpMethod.GET, httpEntity,
                    String.class);
            // System.out.println("response: " + response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
//            if (statusCode.value() == 401) {
//                getAccessToken();
//                return getBase64ImagePdf(documentId);
//            } else {
//                throw new Exception(e.getMessage());
//            }
            throw new Exception(e.getMessage());
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String signHash(String userId, String ipAddress, String userAgentString, String keyAlias, String hash, String remoteSigningAccessToken, String documentId, String fileName) throws Exception {
        System.out.println("getTransaction");
        String signHashUrl = misaConstants.getBaseUrl() + "/external/esrm/service/signing/api/v1/Signing/hash";
        System.out.println("signHashUrl: " + signHashUrl);

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("UserAgent", userAgentString);
        headers.set("ClientIP", ipAddress);
        headers.set("DeviceId", "GoPaperless");
        headers.set("x-clientid", misaConstants.getXClientid());
        headers.set("x-clientkey", misaConstants.getXClientKey());
        headers.set("AuthorizationRM", "Bearer " + remoteSigningAccessToken);

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("DataToBeDisplayed", "Xin mời bạn kí");
        requestData.put("UserId", userId);
        requestData.put("CertAlias", keyAlias);

        Map<String, Object> documents = new HashMap<>();
        documents.put("DocumentId", documentId);
        documents.put("FileToSign", hash);
        documents.put("DocumentName", fileName);
        List<Map<String, Object>> listDocuments = new ArrayList<>();
        listDocuments.add(documents);

        requestData.put("Documents", listDocuments);

        // Convert requestData to JSON string
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request getTransaction as JSON: " + requestDataJson);

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(signHashUrl, HttpMethod.POST, httpEntity,
                    String.class);
            System.out.println("response: " + response.getBody());
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("transactionId").asText();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
//            if (statusCode.value() == 401) {
//                getAccessToken();
//                return getBase64ImagePdf(documentId);
//            } else {
//                throw new Exception(e.getMessage());
//            }
            throw new Exception(e.getMessage());
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }

    }

    public String getStatus(String transactionId, String ipAddress, String userAgentString, String remoteSigningAccessToken) throws Exception {
        System.out.println("getStatus");
        String getStatusUrl = misaConstants.getBaseUrl() + "/external/esrm/service/signing/api/v1/Signing/status/" + transactionId;
        System.out.println("getStatusUrl: " + getStatusUrl);

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("UserAgent", userAgentString);
        headers.set("ClientIP", ipAddress);
        headers.set("DeviceId", "GoPaperless");
        headers.set("x-clientid", misaConstants.getXClientid());
        headers.set("x-clientkey", misaConstants.getXClientKey());
        headers.set("AuthorizationRM", "Bearer " + remoteSigningAccessToken);

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);
        try {
            // Gửi yêu cầu GET và nhận phản hồi
            ResponseEntity<String> response = restTemplate.exchange(getStatusUrl, HttpMethod.GET, httpEntity, String.class);
            System.out.println("response: " + response.getBody());
            // Phân tích JSON từ phản hồi
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            String status = jsonNode.get("status").asText();
            if (status.equals("FAILED")) {
                System.out.println("errorDescription: " + jsonNode.get("errorDescription").asText());
                throw new Exception(jsonNode.get("errorDescription").asText());
            }

            // Kiểm tra nếu trường "signatures" tồn tại
            else if (jsonNode.has("signatures")) {
                JsonNode signaturesNode = jsonNode.get("signatures");

                // Nếu "signatures" là null, trả về chuỗi "null"
                if (signaturesNode.isNull()) {
                    return jsonNode.get("status").asText();
                }

                // Nếu "signatures" là một mảng, trả về chuỗi dạng JSON của mảng
                return signaturesNode.toString();
            } else {
                // Trường hợp không có trường "signatures"
                return jsonNode.get("status").asText();
            }
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
//            if (statusCode.value() == 401) {
//                getAccessToken();
//                return getBase64ImagePdf(documentId);
//            } else {
//                throw new Exception(e.getMessage());
//            }
            throw new Exception(e.getMessage());
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String getSignature(String transactionId, String ipAddress, String userAgentString, String remoteSigningAccessToken) throws Exception {
        try {
            while (true) {
                String signatures = getStatus(transactionId, ipAddress, userAgentString, remoteSigningAccessToken);
                // Kiểm tra nếu signatures không phải là "PENDING" hoặc null
                if (signatures != null && !signatures.equals("PENDING")) {
                    return signatures; // Trả về signatures nếu đã ký
                }
                // Chờ 3 giây trước khi thực hiện kiểm tra lại
                Thread.sleep(3000);
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public String misaSignFile(MisaRequest data, String ipAddress, String userAgentString, HttpServletRequest request) throws Exception {
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
        String keyAlias = data.getCertChain().getKeyAlias();
        String remoteSigningAccessToken = data.getRemoteSigningAccessToken();
        String userId = data.getCertChain().getUserId();
        String assurance = data.getAssurance();
        String codeNumber = data.getCertChain().getKeyAlias();

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

            String transactionId = signHash(userId, ipAddress, userAgentString, keyAlias, hashList, remoteSigningAccessToken, String.valueOf(documentId), fileName);
            String signatureList = getSignature(transactionId, ipAddress, userAgentString, remoteSigningAccessToken);
            JsonNode jsonNode = objectMapper.readTree(signatureList);
            String signature = jsonNode.get(0).get("signature").asText();
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


            return "";
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
