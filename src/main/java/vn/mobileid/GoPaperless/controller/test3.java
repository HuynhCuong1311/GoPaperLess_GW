package vn.mobileid.GoPaperless.controller;

import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.model.apiModel.MailInfo;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import static vn.mobileid.GoPaperless.utils.CommonFunction.HASH_SHA256;

public class test3 {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String loginUrl = "https://api.mobile-id.vn/facialsense/v1/management/auth/token";

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Tạo dữ liệu dưới dạng application/x-www-form-urlencoded
        MultiValueMap<String, String> requestData = new LinkedMultiValueMap<>();
        requestData.add("username", "thinhtn");
        requestData.add("password", "thinhtn1");

        // Tạo HttpEntity với request data và headers
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // Gửi request và nhận response
            ResponseEntity<String> responseEntity = restTemplate.exchange(loginUrl, HttpMethod.POST, httpEntity, String.class);

            // In ra response body
            System.out.println(responseEntity.getBody());
        } catch (HttpClientErrorException e) {
            String responseBody = e.getResponseBodyAsString();
            if (responseBody != null && !responseBody.isEmpty()) {
                try {
//                    ObjectMapper objectMapper = new ObjectMapper();
//                    ErrorResponse errorResponse = objectMapper.readValue(responseBody, ErrorResponse.class);
//                    String errorMessage = errorResponse.getMessage();
                    System.out.println("Error: ");

                    // Show thông báo lỗi lên giao diện (phần này tùy vào cách bạn hiển thị giao diện)
                    // JOptionPane.showMessageDialog(null, errorMessage, "Error", JOptionPane.ERROR_MESSAGE);
                } catch (Exception jsonException) {
                    System.out.println("Error parsing error response: " + jsonException.getMessage());
                }
            } else {
                System.out.println("Error: " + e.getStatusCode() + " - " + e.getStatusText());
            }

        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
        }
    }


}
