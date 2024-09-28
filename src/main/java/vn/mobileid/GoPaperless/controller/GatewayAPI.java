package vn.mobileid.GoPaperless.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.model.gwModal.ValidationResquest;
import vn.mobileid.GoPaperless.model.gwModal.PrepareSigningRequest;
import vn.mobileid.GoPaperless.model.gwModal.PrepareSigningResponse;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.web.bind.annotation.RequestBody;
import vn.mobileid.GoPaperless.model.participantsModel.AddParticipant;
import vn.mobileid.GoPaperless.model.participantsModel.PdfInfo;
import vn.mobileid.GoPaperless.model.participantsModel.WorkFlow;

@Component
public class GatewayAPI {

    @Value("${dev.mode}")
    private boolean devUrl;

    @Value("${gateway.public.url}")
    private String publicUrl;

    @Value("${gateway.local.url}")
    private String localUrl;

    private int timeOut = 50000;

    public String getBaseUrl() {
        return devUrl ? publicUrl : localUrl;
    }

    public byte[] previewFile(String uploadToken, String signerToken) throws MalformedURLException {
        String baseUrl = getBaseUrl();
        String previewUrl = baseUrl + "/file/" + uploadToken + "/preview/" + signerToken;

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<byte[]> responseEntity = null;
        responseEntity = restTemplate.exchange(previewUrl, HttpMethod.GET, null, byte[].class);

        return responseEntity.getBody();
    }

    public String PrepareSign(PrepareSigningRequest prepareSigningRequest) {
        System.out.println("PrepareSign");
        String baseUrl = getBaseUrl();
//        String prepareUrl = baseUrl + "/apigw/signing/" + prepareSigningRequest.getSigning_token() + "/prepare.json?access_token=" + prepareSigningRequest.getSigner_token();
        // convert String to base64
        String prepareUrl = baseUrl + "/api/internalusage/signing/" + prepareSigningRequest.getSigning_token() + "/prepare.json?access_token=" + prepareSigningRequest.getSigner_token();

        StringBuilder pemBuilder = new StringBuilder();
        pemBuilder.append("-----BEGIN CERTIFICATE-----\n");

        int index = 0;
        int chunkSize = 64;
        while (index < prepareSigningRequest.getCertificate().length()) {
            pemBuilder.append(prepareSigningRequest.getCertificate(), index, Math.min(index + chunkSize, prepareSigningRequest.getCertificate().length()));
            pemBuilder.append("\n");
            index += chunkSize;
        }

        pemBuilder.append("-----END CERTIFICATE-----");

        String pemString = pemBuilder.toString();
//        System.out.println(pemString);

        String base64CertChain = Base64.getEncoder().encodeToString(pemString.getBytes());
//        System.out.println("base64CertChain: " + base64CertChain);
        RestTemplate restTemplate = new RestTemplate();

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.set("Authorization", "Bearer YourAccessToken"); // Thay thế bằng header bạn muốn gửi

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("signer_id", prepareSigningRequest.getSigner_id());
        requestData.put("certificate", base64CertChain);
        requestData.put("connector_name", prepareSigningRequest.getConnector_name());
        requestData.put("signing_option", prepareSigningRequest.getSigning_option());

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        // Gửi yêu cầu POST và nhận phản hồi
        ResponseEntity<String> responseEntity = restTemplate.exchange(prepareUrl, HttpMethod.POST, httpEntity, String.class);
        Gson gson = new Gson();
        PrepareSigningResponse prepareSigningResponse = gson.fromJson(responseEntity.getBody(), PrepareSigningResponse.class);
        return prepareSigningResponse.getDtbs_hash();

    }

    public String sign(String signingToken, String SignerToken, String signerId, String signature) {
        String baseUrl = getBaseUrl();
        String prepareUrl = baseUrl + "/api/internalusage/signing/" + signingToken + "/sign?access_token=" + SignerToken;
        // convert String to base64
        System.out.println("signingToken: " + signingToken);
        System.out.println("SignerToken: " + SignerToken);
        System.out.println("signerId: " + signerId);
        System.out.println("signature_value: " + signature);

        RestTemplate restTemplate = new RestTemplate();

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.set("Authorization", "Bearer YourAccessToken"); // Thay thế bằng header bạn muốn gửi

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("signer_id", signerId);
        requestData.put("signature_value", signature);
        Gson gson = new Gson();
        System.out.println("requestData: " + gson.toJson(requestData));

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        // Gửi yêu cầu POST và nhận phản hồi
        ResponseEntity<String> responseEntity = restTemplate.exchange(prepareUrl, HttpMethod.POST, httpEntity, String.class);

        return responseEntity.getBody();

    }

    public byte[] getFileFromUploadToken(String uploadToken) {
        String baseUrl = getBaseUrl();
        String getFileUrl = baseUrl + "/api/internalusage/open/" + uploadToken;

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<byte[]> responseEntity = null;
        responseEntity = restTemplate.exchange(getFileUrl, HttpMethod.GET, null, byte[].class);

        return responseEntity.getBody();
    }

    public byte[] getLastFile(String signingToken, String signerToken) {
        String baseUrl = getBaseUrl();
        String getLastFileUrl = baseUrl + "/api/internalusage/signing/" + signingToken + "/download";

        //{{url}}/apigw/signing/{{signing_token}}/download?access_token={{signer_token}}
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<byte[]> responseEntity = null;
        responseEntity = restTemplate.exchange(getLastFileUrl, HttpMethod.GET, null, byte[].class);

        return responseEntity.getBody();
    }

    public String ValidView(ValidationResquest validationResquest) {
        String baseUrl = getBaseUrl();
        String getValidViewUrl = baseUrl + "/api/internalusage/validation/" + validationResquest.getUploadToken() + "/view.json";
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        ResponseEntity<String> responseEntity = restTemplate.exchange(getValidViewUrl, HttpMethod.GET, null, String.class);

        return responseEntity.getBody();
    }

    public String downloadReport(String uploadToken) throws Exception {
        String baseUrl = getBaseUrl();
        String getValidViewUrl = baseUrl + "/api/internalusage/validation/" + uploadToken + "/download/report-pdf";
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(0, new ResourceHttpMessageConverter());
        System.out.println("getValidViewUrl: " + getValidViewUrl);


        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> responseEntity = restTemplate.exchange(getValidViewUrl, HttpMethod.GET, null, String.class);
//            String responseBody = response.getBody();

//            ObjectMapper objectMapper = new ObjectMapper();
//            JsonNode jsonNode = objectMapper.readTree(responseBody);
//
//            return jsonNode.get("signature_id").asText();
            System.out.println("responseGet Data to downloadReport: " + responseEntity.getBody());
            return responseEntity.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
//            throw new Exception(e.getMessage());
            throw new Exception("Server error occurred. Please try again later.");
        }

    }

    public String getSignatureId(String signatureName, String fileName, String content, String digest) throws Exception {
        System.out.println("get signature id");
        String baseUrl = getBaseUrl();
        String getSignatureIdUrl = baseUrl + "/api/internalusage/validation/signature-name.json";

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("signature_name", signatureName);

        Map<String, Object> file = new HashMap<>();
        file.put("name", fileName);
        file.put("digest", digest);
        file.put("content", content);

        requestData.put("file", file);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(getSignatureIdUrl, HttpMethod.POST, httpEntity, String.class);
//            String responseBody = response.getBody();

//            ObjectMapper objectMapper = new ObjectMapper();
//            JsonNode jsonNode = objectMapper.readTree(responseBody);
//
//            return jsonNode.get("signature_id").asText();
            System.out.println("responseGet Data to update DB: " + response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
//            throw new Exception(e.getMessage());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String addNewSigner(@RequestBody AddParticipant data) {
        System.out.println("signingToken: " + data.getSigningToken());
        System.out.println("SignerToken: " + data.getSignerToken());
        System.out.println("signerId: " + data.getSignerId());
        System.out.println("purpose: " + data.getPurpose());
        System.out.println("reason: " + data.getReason());
//        PdfInfo pdf = data.getPdf();
//        if (pdf != null) {
//            System.out.println("reason: " + pdf.getReason());
//        } else {
//            System.out.println("PdfInfo is null");
//        }

        String baseUrl = getBaseUrl();
        RestTemplate restTemplate = new RestTemplate();

//        String accessTokenUrl = baseUrl + "/api/core/create_token.json";
//        System.out.println("accessTokenUrl: " + accessTokenUrl);
//
//        // Tạo object chứa mảng signers
//        Map<String, Object> getaAccessToken = new HashMap<>();
//        getaAccessToken.put("enterpriseId", data.getEnterpriseId());
//        getaAccessToken.put("clientId", "MI_MobileApp");
//        System.out.println("accessToken: " + getaAccessToken);
//
        // Chuyển object thành JSON
        Gson gson = new Gson();
        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.set("Authorization", "Bearer YourAccessToken"); // Thay thế bằng header bạn muốn gửi
//        String accessToken = gson.toJson(getaAccessToken);
//        System.out.println("AccessToken: " + accessToken);
//
//        // Tạo HttpEntity với dữ liệu JSON và headers
//        HttpEntity<String> entity = new HttpEntity<>(accessToken, headers);
//        System.out.println("httpEntity: " + entity);
//
//        ResponseEntity<String> responseAccessToken = restTemplate.exchange(accessTokenUrl, HttpMethod.POST, entity, String.class);
//        System.out.println("responseAccessToken: " + responseAccessToken.getBody());
//        // Khai báo ObjectMapper
//        ObjectMapper objectMapper = new ObjectMapper();
//        // Kiểm tra xem phản hồi có dữ liệu không
//        String token = "";
//        if (responseAccessToken.getBody() != null) {
//            try {
//                // Phân tích phản hồi thành một đối tượng JsonNode
//                JsonNode responseJson = objectMapper.readTree(responseAccessToken.getBody());
//
//                // Trích xuất token từ JsonNode
//                token = responseJson.get("token").asText();
//
//                // Sử dụng token đã trích xuất
//                System.out.println("Tokennnnnnn: " + token);
//            } catch (Exception e) {
//                // Xử lý ngoại lệ nếu có lỗi trong quá trình phân tích JSON
//                e.printStackTrace();
//            }
//        } else {
//            System.out.println("No data in response body.");
//        }

        String prepareUrl = baseUrl + "/api/internalusage/" + data.getSigningToken() + "/addsigner.json";
        System.out.println("prepareUrl: " + prepareUrl);
//        String prepareUrl = baseUrl + "/api/signing/" + "3593f1bc25252ed4d10f92925541791ea1b8235a" + "/addsigner.json?access_token=" + "4d495f4d6f62696c654170703a68396653796a6f62384f4632536a6c4c534a5930";
        // convert String to base64

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("id", data.getSignerId());
        requestData.put("name", data.getFirstName());
        requestData.put("email", data.getEmail());
        requestData.put("surname", data.getLastName());
        requestData.put("role", data.getPurpose());
//        requestData.put("signing_purpose", "signature");
        requestData.put("position", data.getPosition());
        requestData.put("structural_subdivision", data.getStructural_subdivision());
//        requestData.put("reason", data.getReason());
        // Thêm PDF cho signer
        Map<String, Object> pdfInfo = new HashMap<>();
        if (data.getReason() != null) {
            pdfInfo.put("reason", data.getReason());
        } else {
            pdfInfo.put("reason", "");
        }
        requestData.put("pdf", pdfInfo);
//        Gson gson = new Gson();
//        System.out.println("requestData: " + gson.toJson(requestData));

        // Tạo danh sách signers
        List<Map<String, Object>> signers = new ArrayList<>();
//        Map<String, Object> requestDataCopy = new HashMap<>(requestData);
        signers.add(requestData);
        System.out.println("signers: " + signers);

        // Tạo object chứa mảng signers
        Map<String, Object> dataToSend = new HashMap<>();
        dataToSend.put("signers", signers);
        System.out.println("dataToSend: " + dataToSend);

        // Chuyển object thành JSON
//        Gson gson = new Gson();
        String jsonData = gson.toJson(dataToSend);
        System.out.println("Data to send: " + jsonData);

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<String> httpEntity = new HttpEntity<>(jsonData, headers);
        System.out.println("httpEntity: " + httpEntity);
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        // Gửi yêu cầu POST và nhận phản hồi
        ResponseEntity<String> responseEntity = restTemplate.exchange(prepareUrl, HttpMethod.POST, httpEntity, String.class);

        return responseEntity.getBody();

    }
}
