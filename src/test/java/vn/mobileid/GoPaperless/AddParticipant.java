/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package vn.mobileid.GoPaperless;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author chaud
 */
public class AddParticipant {

    @Value("${dev.url}")
    private boolean devUrl;

    public String getBaseUrl() {
        return devUrl ? "https://dev-paperless-gw.mobile-id.vn" : "https://uat-paperless-gw.mobile-id.vn";
    }

    public static void main(String[] args) {
        String baseUrl = "https://uat-paperless-gw.mobile-id.vn";
        String signingToken = "d772785b1c228d4883d49f1b84387a84e1ebe0ad";
        String signerToken = "78334f40978f7a49e4f532d4cde7d3511228a0eb";
        String prepareUrl = baseUrl + "/api/signing/" + signingToken + "/addsigner.json?access_token=" + signerToken;
        System.out.println("prepareUrl: " + prepareUrl);
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("id", "123456");
        requestData.put("name", "hfghf");
        requestData.put("email", "fghfg");
        requestData.put("surname", "gfh");
        requestData.put("role", "signer");
        requestData.put("signing_purpose", "signature");
        requestData.put("position", "abc");
        requestData.put("structural_subdivision", "abc");
        // Thêm PDF cho signer
        Map<String, Object> pdfInfo = new HashMap<>();
        pdfInfo.put("reason", "abc");
        requestData.put("pdf", pdfInfo);
//        Gson gson = new Gson();
//        System.out.println("requestData: " + gson.toJson(requestData));
        // Tạo danh sách signers
        List<Map<String, Object>> signers = new ArrayList<>();
//        Map<String, Object> requestDataCopy = new HashMap<>(requestData);
        signers.add(requestData);
        // In nội dung của danh sách signers
        System.out.println("signers: " + signers);
//        for (Map<String, Object> signer : signers) {
//            System.out.println(signer);
//        }
        // Tạo object chứa mảng signers
        Map<String, Object> dataToSend = new HashMap<>();
        dataToSend.put("signers", signers);
        System.out.println("dataToSend: " + dataToSend);
        
        // Chuyển object thành JSON
        Gson gson = new Gson();
        String jsonData = gson.toJson(dataToSend);
        System.out.println("Data to send: " + jsonData);

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<String> httpEntity = new HttpEntity<>(jsonData, headers);
        System.out.println("httpEntity: " + httpEntity);

        // Gửi yêu cầu POST và nhận phản hồi
        ResponseEntity<String> responseEntity = restTemplate.exchange(prepareUrl, HttpMethod.POST, httpEntity, String.class);

//        return responseEntity.getBody();
        System.out.println("responseEntity: " + responseEntity);
    }
}
