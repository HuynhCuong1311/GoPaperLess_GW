package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.model.apiModel.BindConfigurationResponse;
import vn.mobileid.GoPaperless.process.ProcessDb;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ApiService {
    public final RestTemplate restTemplate = new RestTemplate();
    public final Gson gson = new Gson();

    private final ProcessDb connect;

    public ApiService(ProcessDb connect) {
        this.connect = connect;
    }

    public String saveConfig(Map<String, Object> request) throws Exception {
        String postbackUrl = (String) request.get("postbackUrl");
        String bindToken = (String) request.get("bindToken");
        List<Object> metadata = (List<Object>) request.get("signatureList");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("token", bindToken);
        requestData.put("metadata", metadata);

        System.out.println("postback Data: " + gson.toJson(requestData));

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(postbackUrl, HttpMethod.POST, httpEntity, String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error  đây: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }

    }

    public JsonNode getBindData(String bind_token) throws Exception {
        BindConfigurationResponse response = connect.USP_GW_PPL_BIND_CONFIGURATION_GET(bind_token);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(response.getMetadata());
//        String profile = jsonNode.get("profile").asText();
//        JsonNode jsonNode2 = objectMapper.readTree(profile);
//        ((ObjectNode) jsonNode).put("profile", jsonNode2);
        return objectMapper.readTree(response.getMetadata());
//        return response.getMetadata();
    }
}
