package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.dto.fpsDto.AccessTokenDto;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.dto.rsspDto.TextField;
import vn.mobileid.GoPaperless.model.fpsModel.BasicFieldAttribute;
import vn.mobileid.GoPaperless.model.fpsModel.FpsSignRequest;
import vn.mobileid.GoPaperless.model.fpsModel.HashFileRequest;
import vn.mobileid.GoPaperless.model.fpsModel.Signature;
import vn.mobileid.GoPaperless.utils.CommonFunction;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.util.*;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
public class FpsService {
    @Value("${dev.mode}")
    private boolean devMode;

    @Value("${fps.public.url}")
    private String publicUrl;

    @Value("${fps.local.url}")
    private String localUrl;

    private String baseUrl;
    private String accessToken;

    public FpsService() {
        getBaseUrl();
    }

    private final RestTemplate restTemplate = new RestTemplate();

    public void getBaseUrl() {
        this.baseUrl = devMode ? publicUrl : localUrl;
    }

    public void getAccessToken() {
        System.out.println("getAccessToken");
        getBaseUrl();
        String authorizeUrl = baseUrl + "/fps/v1/authenticate";

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("grant_type", "client_credentials");
        requestData.put("client_id", "Dokobit_Gateway");
        requestData.put("remember_me_enabled", false);
        requestData.put("client_secret",
                "TmFtZTogRG9rb2JpdCBHYXRld2F5IFdlYgpDcmVhdGVkIGF0OiAxNjk3NjAzNDE5CkNyZWF0ZWQgYnk6IEdpYVRLClZlcnNpb24gY2xpZW50IFNlY3JldDogMSA=");

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        ResponseEntity<AccessTokenDto> responseEntity = restTemplate.exchange(authorizeUrl, HttpMethod.POST, httpEntity,
                AccessTokenDto.class);
        this.accessToken = Objects.requireNonNull(responseEntity.getBody()).getAccess_token();
    }

    public String getBase64ImagePdf(int documentId) throws Exception {
        System.out.println("getBase64ImagePdf");
        getBaseUrl();
        String getImageBase64Url = baseUrl + "/fps/v1/documents/" + documentId + "/base64";
        System.out.println("getImageBase64Url: " + getImageBase64Url);

        // if (accessToken == null) {
        // getAccessToken();
        // }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(getImageBase64Url, HttpMethod.GET, httpEntity,
                    String.class);
            // System.out.println("response: " + response.getBody());
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("file_data").asText();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getBase64ImagePdf(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String getBase64RemoveAppearance(int documentId) throws Exception {
        System.out.println("getBase64RemoveAppearance");
        getBaseUrl();
        String getImageBase64Url = baseUrl + "/fps/v1/documents/" + documentId + "/base64/remove_appearance";
        System.out.println("getImageBase64Url: " + getImageBase64Url);

        // if (accessToken == null) {
        // getAccessToken();
        // }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(getImageBase64Url, HttpMethod.GET, httpEntity,
                    String.class);
            // System.out.println("response: " + response.getBody());
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("file_data").asText();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getBase64RemoveAppearance(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String getFields(int documentId) throws Exception {
        System.out.println("getFields");
        getBaseUrl();
        String getImageBasse64Url = baseUrl + "/fps/v1/documents/" + documentId + "/fields";

        // RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(getImageBasse64Url, HttpMethod.GET, httpEntity,
                    String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getFields(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public List<Signature> getVerification(int documentId) throws Exception {
        System.out.println("getVerification");
        getBaseUrl();
        if (accessToken == null) {
            getAccessToken();
        }
        String verificationUrl = baseUrl + "/fps/v1/documents/" + documentId + "/verification";

        // RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ParameterizedTypeReference<List<Signature>> responseType = new ParameterizedTypeReference<List<Signature>>() {
            };

            ResponseEntity<List<Signature>> response = restTemplate.exchange(verificationUrl, HttpMethod.GET,
                    httpEntity, responseType);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getVerification(documentId);
            } else {
                return Collections.emptyList();
                // throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String addSignature(int documentId, String field, BasicFieldAttribute data, boolean drag) throws Exception {
        System.out.println("addSignature");
        getBaseUrl();
        String addSignatureUrl = baseUrl + "/fps/v1/documents/" + documentId + "/fields/" + field;

        // RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        if (drag) {
            headers.set("x-dimension-unit", "percentage");
        }

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        requestData.put("page", data.getPage());
        requestData.put("suffix", data.getSuffix());
        requestData.put("dimension", data.getDimension());
        requestData.put("visible_enabled", data.getVisibleEnabled());
        if (data.getRemark() != null) {
            requestData.put("remark", data.getRemark());
        }

        System.out.println("requestData: " + requestData);
        List<String> list = new ArrayList<>();
        list.add("cades signature");
        requestData.put("level_of_assurance", list);

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // ResponseEntity<SynchronizeDto> responseEntity =
            // restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
            // SynchronizeDto.class);
            // return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
                    String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return addSignature(documentId, field, data, drag);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String putSignature(int documentId, String field, BasicFieldAttribute data) throws Exception {
        System.out.println("putSignature");
        getBaseUrl();
        String putSignatureUrl = baseUrl + "/fps/v1/documents/" + documentId + "/fields/" + field;
        System.out.println("putSignatureUrl: " + putSignatureUrl);
        System.out.println("font: " + data.getFont());

        // RestTemplate restTemplate = new RestTemplate();
        // System.out.println("default value: " +
        // data.getNumeric_stepper().getDefault_value());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        headers.set("x-dimension-unit", "percentage");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());

        if (data.getPage() != null) {
            requestData.put("page", data.getPage());
        }
        if (data.getGroupName() != null) {
            requestData.put("group_name", data.getGroupName());
        }
        if (data.getType() != null) {
            requestData.put("type", data.getType());
        }

        if (data.getChecked() != null) {
            requestData.put("checked", data.getChecked());
        }
        if (data.getMultiple_checked() != null) {
            requestData.put("multiple_checked", data.getMultiple_checked());
        }
        // requestData.put("page", data.getPage());

        // System.out.println("x: " + data.getDimension().getX());
        // System.out.println("y: " + data.getDimension().getY());
        // System.out.println("width: " + data.getDimension().getWidth());
        // System.out.println("height: " + data.getDimension().getHeight());
        // System.out.println("height: " + data.getItems());

        Map<String, Object> dimension = new HashMap<>();
        if (data.getCheckbox_frame() != null) {
            requestData.put("checkbox_frame", data.getCheckbox_frame());
        }
        if (data.getUncheckbox_frame() != null) {
            requestData.put("uncheckbox_frame", data.getUncheckbox_frame());
        }
        if (data.getDimension() != null) {
            if (data.getDimension().getX() != -1) {
                dimension.put("x", data.getDimension().getX());
            }
            if (data.getDimension().getY() != -1) {
                dimension.put("y", data.getDimension().getY());
            }
            if (data.getDimension().getWidth() != -1) {
                dimension.put("width", data.getDimension().getWidth());
            }
            if (data.getDimension().getHeight() != -1) {
                dimension.put("height", data.getDimension().getHeight());
            }

            if (data.getDimension().getX() != -1 || data.getDimension().getY() != -1
                    || data.getDimension().getWidth() != -1 || data.getDimension().getHeight() != -1) {
                requestData.put("dimension", dimension);
            }
        }
        if (data.getValue() != null) {
            requestData.put("value", data.getValue());
        }
        if (data.getText_next_to() != null) {
            requestData.put("text_next_to", data.getText_next_to());
        }
        if (data.getFont() != null && data.getFont().getName() != null) {
            requestData.put("font", data.getFont());
        }
        if (data.getPlaceHolder() != null) {
            requestData.put("place_holder", data.getPlaceHolder());
        }
        if (data.getRequired() != null) {
            requestData.put("required", data.getRequired());
        } else if (data.getSealRequired() != null) {
            requestData.put("required", data.getSealRequired());
        }
        if (data.getAlign_option() != null) {
            requestData.put("align_option", data.getAlign_option());
        }
        if (data.getRenamedAs() != null) {
            requestData.put("renamed_as", data.getRenamedAs());
        }
        if (data.getMaxLength() != null) {
            requestData.put("max_length", data.getMaxLength());
        }
        if (data.getReplicateAllPages() != null) {
            requestData.put("replicate_all_pages", data.getReplicateAllPages());
        }
        if (data.getReplicate() != null) {
            requestData.put("replicate_pages", data.getReplicate());
        }
        // if (data.getItems() != null) {
        // requestData.put("items", data.getItems());
        // }
        if ("QRYPTO".equals(data.getType()) && data.getItems() != null) {
            requestData.put("items", data.getItems());
        }
        Map<String, Object> combo_item = new HashMap<>();
        if ("TOGGLE".equals(data.getType()) && data.getItems() != null) {
            combo_item.put("default_item", data.getDefault_item());
            combo_item.put("items", data.getItems());
            requestData.put("toggle_item", combo_item);
        } else if ("COMBOBOX".equals(data.getType()) && data.getItems() != null) {
            combo_item.put("default_item", data.getDefault_item());
            combo_item.put("items", data.getItems());
            requestData.put("combo_item", combo_item);
        } else if ("ATTACHMENT".equals(data.getType())) {
            combo_item.put("field_name", data.getFieldName());
            combo_item.put("file_name", data.getFileName());
            combo_item.put("value", data.getValue());
            requestData.put("file", combo_item);
        } else if ("CAMERA".equals(data.getType())) {
            combo_item.put("field_name", data.getFieldName());
            combo_item.put("value", data.getValue());
            requestData.put("camera", combo_item);
        }

        // if (data.getType() != null && data.getType().equals("CAMERA")) {
        // requestData.put("required", data.getSealRequired());
        // }
        if (data.getRemark() != null) {
            requestData.put("remark", data.getRemark());
        }
        if (data.getShowIcon() != null) {
            requestData.put("show_icon_enabled", data.getShowIcon());
        }
        if (data.getTooltip() != null) {
            requestData.put("tool_tip_text", data.getTooltip());
        }
        if (data.getAddress() != null) {
            requestData.put("address", data.getAddress());
        }
        if (data.getDate() != null) {
            requestData.put("date", data.getDate());
        }

        // setNumeric(data, requestData);
        if (data.getNumeric_stepper() != null) {
            requestData.put("numeric_stepper", data.getNumeric_stepper());
        }
        // requestData.put("numeric_stepper", data.getNumeric_stepper());

        // System.out.println("default value: " +
        // data.getNumeric_stepper().getDefault_value());
        // requestData.put("max_length", data.getMaxLength());
        requestData.put("visible_enabled", data.getVisibleEnabled());

        // System.out.println("x: " + data.getDimension().getX());
        // System.out.println("y: " + data.getDimension().getY());
        // System.out.println("width: " + data.getDimension().getWidth());
        // System.out.println("height: " + data.getDimension().getHeight());
        // System.out.println("putSignature: " + requestData);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);
        System.out.println("Request Data put signature: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // ResponseEntity<SynchronizeDto> responseEntity =
            // restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
            // SynchronizeDto.class);
            // return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(putSignatureUrl, HttpMethod.PUT, httpEntity,
                    String.class);
            // Get the response body as a String

            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return putSignature(documentId, field, data);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String addTextBox(int documentId, String field, BasicFieldAttribute data, boolean drag) throws Exception {
        System.out.println("addTextBox");
        getBaseUrl();
        String addTextBoxUrl = baseUrl + "/fps/v1/documents/" + documentId + "/fields/" + field;

        System.out.println("addTextBox: " + addTextBoxUrl);
        // RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        if (drag) {
            headers.set("x-dimension-unit", "percentage");
        }

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        requestData.put("visible_enabled", true);
        requestData.put("page", data.getPage());
        if (data.getRemark() != null) {
            requestData.put("remark", data.getRemark());
        }
        if (data.getCheckbox_frame() != null) {
            requestData.put("checkbox_frame", data.getCheckbox_frame());
        }
        if (data.getUncheckbox_frame() != null) {
            requestData.put("uncheckbox_frame", data.getUncheckbox_frame());
        }
        if (data.getText_next_to() != null) {
            requestData.put("text_next_to", data.getText_next_to());
        }
        if (data.getGroupName() != null) {
            requestData.put("group_name", data.getGroupName());
        }
        // if (data.getType() != null) {
        // requestData.put("type", data.getType());
        // switch (data.getType()) {
        // case "CAMERA":
        // case "ATTACHMENT":
        // case "DATE":
        // case "NUMERIC_STEPPER":
        // requestData.put("required", data.getSealRequired());
        // break;
        // }
        // }
        // if (data.getSealRequired().size() > 0) {
        // requestData.put("required", data.getSealRequired());
        // }
        // setNumeric(data, requestData);
        if (data.getNumeric_stepper() != null) {
            requestData.put("numeric_stepper", data.getNumeric_stepper());
        }
        System.out.println("data.getMultiple_checked(): " + data.getMultiple_checked());
        if (data.getMultiple_checked() != null) {
            requestData.put("multiple_checked", data.getMultiple_checked());
        }
        if (data.getType() != null) {
            requestData.put("type", data.getType());
        }
        if (data.getFont() != null && data.getFont().getName() != null) {
            requestData.put("font", data.getFont());
        } else {
            Map<String, Object> font = new HashMap<>();
            font.put("name", "montserrat_regular");
            font.put("size", 13);
            requestData.put("font", font);
        }
        // if(data.getType() != null && data.getType().equals("CAMERA")) {
        // requestData.put("required", data.getSealRequired());
        // }
        if (data.getRequired() != null) {
            requestData.put("required", data.getRequired());
        } else {
            requestData.put("required", data.getSealRequired());
        }
        if (data.getValue() != null) {
            requestData.put("value", data.getValue());
        }
        if (data.getMultiline() != null) {
            requestData.put("multiline", data.getMultiline());
        }
        if (data.getFormatType() != null) {
            requestData.put("format_type", data.getFormatType());
        }
        if (data.getAlign_option() != null) {
            requestData.put("align_option", data.getAlign_option());
        }
        if (data.getPlaceHolder() != null) {
            requestData.put("place_holder", data.getPlaceHolder());
        }
        System.out.println("items: " + data.getItems());
        if ("QRYPTO".equals(data.getType()) && data.getItems() != null) {
            System.out.println("vo day");
            requestData.put("items", data.getItems());
        }
        Map<String, Object> combo_item = new HashMap<>();
        if ("TOGGLE".equals(data.getType()) && data.getItems() != null) {
            combo_item.put("default_item", data.getDefault_item());
            combo_item.put("items", data.getItems());
            requestData.put("toggle_item", combo_item);
        }
        if ("COMBOBOX".equals(data.getType()) && data.getItems() != null) {
            combo_item.put("default_item", data.getDefault_item());
            combo_item.put("items", data.getItems());
            requestData.put("combo_item", combo_item);
        }

        // if (data.getType() != null && data.getType().equals("CAMERA")) {
        // requestData.put("required", data.getSealRequired());
        // }

        if (data.getShowIcon() != null) {
            requestData.put("show_icon_enabled", data.getShowIcon());
        }
        if (data.getChecked() != null) {
            requestData.put("checked", data.getChecked());
        }
        if (data.getDate() != null) {
            requestData.put("date", data.getDate());
        }

        requestData.put("suffix", data.getSuffix());
        requestData.put("dimension", data.getDimension());
        // requestData.put("visible_enabled", data.getVisibleEnabled());
        // List<String> list = new ArrayList<>();
        // list.add("cades signature");
        // requestData.put("level_of_assurance", list);

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data addTextBox as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // ResponseEntity<SynchronizeDto> responseEntity =
            // restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
            // SynchronizeDto.class);
            // return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(addTextBoxUrl, HttpMethod.POST, httpEntity,
                    String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return addTextBox(documentId, field, data, drag);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    private void setNumeric(BasicFieldAttribute data, Map<String, Object> requestData) {
        Map<String, Object> numeric_stepper = new HashMap<>();
        if (data.getNumeric_stepper().getDefault_value() != null) {
            numeric_stepper.put("default_value", data.getNumeric_stepper().getDefault_value());
        }
        if (data.getNumeric_stepper().getMaximum_value() != null) {
            numeric_stepper.put("maximum_value", data.getNumeric_stepper().getMaximum_value());
        }
        if (data.getNumeric_stepper().getMinimum_value() != null) {
            numeric_stepper.put("minimum_value", data.getNumeric_stepper().getMinimum_value());
        }
        if (data.getNumeric_stepper().getUnit_of_change() != null) {
            numeric_stepper.put("unit_of_change", data.getNumeric_stepper().getUnit_of_change());
        }
        if (data.getNumeric_stepper().getDefault_value() != null || data.getNumeric_stepper().getMaximum_value() != null
                || data.getNumeric_stepper().getMinimum_value() != null
                || data.getNumeric_stepper().getUnit_of_change() != null) {
            requestData.put("numeric_stepper", numeric_stepper);
        }
    }

    public String fillForm(int documentId, List<TextField> data, String type) throws Exception {
        System.out.println("fillForm");
        getBaseUrl();
        String fillFormUrl = baseUrl + "/fps/v1/documents/" + documentId + "/fields";

        System.out.println("fillForm: " + fillFormUrl);
        // RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestData = new HashMap<>();
        // if (type.equals("CAMERA")) {
        // requestData.put("image", data);
        // } else {
        // requestData.put("text", data);
        // }

        switch (type) {
            case "name":
            case "email":
            case "jobtitle":
            case "company":
            case "textarea":
            case "location":
            case "textfield":
                requestData.put("text", data);
                break;
            case "checkboxv2":
                requestData.put("checkboxV2", data);
                break;
            case "radioboxv2":
                requestData.put("radioboxV2", data);
                break;
            default:
                requestData.put(type, data);
                break;
        }
        // requestData.put("text", data);
        requestData.put("visible_enabled", true);

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data fillForm as JSON: " + requestDataJson);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // ResponseEntity<SynchronizeDto> responseEntity =
            // restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
            // SynchronizeDto.class);
            // return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(fillFormUrl, HttpMethod.PUT, httpEntity,
                    String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return fillForm(documentId, data, type);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String fillInit(int documentId, BasicFieldAttribute data, String field_name) throws Exception {
        System.out.println("fillInit");
        getBaseUrl();
        String fillInitUrl = baseUrl + "/fps/v2/documents/" + documentId + "/" + field_name;

        System.out.println("fillInit: " + fillInitUrl);
        // RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        // requestData.put("apply_to_all", data.getApply_to_all());
        // requestData.put("visible_enabled", true);
        if (data.getApply_to_all()) {
            requestData.put("initial_field", data.getInitialField());
            switch (field_name) {
                case "stamp":
                    requestData.put("fill_fields", data.getInitialField());
                    break;
                case "initial":
                    requestData.put("initial_field", data.getInitialField());
                    break;
            }
        }
        requestData.put("value", data.getValue());

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data fillInit as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // ResponseEntity<SynchronizeDto> responseEntity =
            // restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
            // SynchronizeDto.class);
            // return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(fillInitUrl, HttpMethod.POST, httpEntity,
                    String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return fillInit(documentId, data, field_name);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String fillQrypto(int documentId, String qryptoFieldName) throws Exception {
        System.out.println("fillQrypto");
        getBaseUrl();
        String fillQryptoUrl = baseUrl + "/fps/v2/documents/" + documentId + "/qrcode-qrypto";

        System.out.println("fillQryptoUrl: " + fillQryptoUrl);
        // RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestData = new HashMap<>();
        if (qryptoFieldName != null) {
            requestData.put("field_name", qryptoFieldName);
        }

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data fillQrypto as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // ResponseEntity<SynchronizeDto> responseEntity =
            // restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
            // SynchronizeDto.class);
            // return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(fillQryptoUrl, HttpMethod.POST, httpEntity,
                    String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return fillQrypto(documentId, qryptoFieldName);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String deleteSignatue(int documentId, String field_name) throws Exception {
        System.out.println("deleteSignatue");
        getBaseUrl();
        String deleteSignatureUrl = baseUrl + "/fps/v1/documents/" + documentId + "/fields";

        // RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", field_name);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // ResponseEntity<SynchronizeDto> responseEntity =
            // restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
            // SynchronizeDto.class);
            // return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(deleteSignatureUrl, HttpMethod.DELETE, httpEntity,
                    String.class);
            // Get the response body as a String

            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return deleteSignatue(documentId, field_name);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String hashSignatureField(int documentId, HashFileRequest data) throws Exception {
        System.out.println("hashSignatureField");
        getBaseUrl();
        String hashSignatureFieldUrl = baseUrl + "/fps/v1/documents/" + documentId + "/hash";

        // RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        requestData.put("hand_signature_image", data.getHandSignatureImage());
        requestData.put("signing_reason", data.getSigningReason());
        requestData.put("signing_location", data.getSigningLocation());
        requestData.put("skip_verification", true);
        requestData.put("signature_algorithm", "RSA");
        requestData.put("signed_hash", "SHA256");
        requestData.put("certificate_chain", data.getCertificateChain());
        requestData.put("signer_contact", data.getSignerContact());

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data hashSignatureField as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // ResponseEntity<SynchronizeDto> responseEntity =
            // restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
            // SynchronizeDto.class);
            // return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(hashSignatureFieldUrl, HttpMethod.POST, httpEntity,
                    String.class);
            // Get the response body as a String
            String responseBody = response.getBody();

            // JsonObject jsonObject1 = gson.fromJson(responseBody, JsonObject.class);
            // return jsonObject1.get("hash_value").getAsString();
            // ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            return jsonNode.get("hash_value").asText();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return hashSignatureField(documentId, data);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String signDocument(int documentId, FpsSignRequest data) throws Exception {
        System.out.println("signDocument");
        getBaseUrl();
        String signDocumentUrl = baseUrl + "/fps/v1/documents/" + documentId + "/sign";

        // RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        requestData.put("hash_value", data.getHashValue());
        requestData.put("signature_value", data.getSignatureValue());
        requestData.put("certificate_chain", data.getCertificateChain());

        System.out.println("signDocument Data: " + requestData);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
            // ResponseEntity<SynchronizeDto> responseEntity =
            // restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity,
            // SynchronizeDto.class);
            // return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(signDocumentUrl, HttpMethod.POST, httpEntity,
                    String.class);
            // Get the response body as a String
            // System.out.println("signDocument: " + response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return signDocument(documentId, data);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public InputStream getImagePdf(int documentId) throws Exception {
        System.out.println("getImagePdf");
        getBaseUrl();
        String getImageBasse64Url = baseUrl + "/fps/v1/documents/" + documentId;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(getImageBasse64Url, HttpMethod.GET, httpEntity,
                    byte[].class);
            InputStream inputStreamFile = null;

            if (response.getBody() != null) {
                inputStreamFile = new ByteArrayInputStream(response.getBody());
            }

            return inputStreamFile;
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getImagePdf(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public byte[] getByteImagePdf(int documentId) throws Exception {
        System.out.println("getByteImagePdf");
        getBaseUrl();
        String getImageBasse64Url = baseUrl + "/fps/v1/documents/" + documentId;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(getImageBasse64Url, HttpMethod.GET, httpEntity,
                    byte[].class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getByteImagePdf(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public void fillVotri(int documentId, List<TextField> textFields) throws Exception {
        System.out.println("fillVotri");
        getBaseUrl();
        if (!textFields.isEmpty()) {
            Map<String, List<TextField>> groupedFields = new HashMap<>();
            // Phân nhóm các text field theo loại
            for (TextField textField : textFields) {
                String fieldNameItem = textField.getField_name();
                // String type =
                // CommonFunction.getSubstringAfterSecondUnderscore(fieldNameItem).toLowerCase();
                String type = textField.getType().toLowerCase();
                if (type.equals("stepper")) {
                    type = "numeric_stepper";
                }

                if (!groupedFields.containsKey(type)) {
                    groupedFields.put(type, new ArrayList<>());
                }
                groupedFields.get(type).add(textField);
            }

            // Duyệt qua từng loại và gọi fpsService.fillForm nếu danh sách không rỗng
            for (Map.Entry<String, List<TextField>> entry : groupedFields.entrySet()) {
                String type = entry.getKey();
                List<TextField> fieldsOfType = entry.getValue();
                if (!fieldsOfType.isEmpty()) {
                    fillForm(documentId, fieldsOfType, type.toLowerCase());
                }
            }
        }

    }

    public Integer getDocumentId(byte[] data) throws Exception {
        System.out.println("getDocumentId");
        getBaseUrl();
        String getImageBasse64Url = baseUrl + "/fps/v1/documents";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setBearerAuth(accessToken);

        HttpEntity<byte[]> httpEntity = new HttpEntity<>(data, headers);
        try {
            ResponseEntity<BasicFieldAttribute> response = restTemplate.exchange(getImageBasse64Url, HttpMethod.POST,
                    httpEntity,
                    BasicFieldAttribute.class);
            // Get the response body as a String
            return response.getBody().getDocument_id();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getDocumentId(data);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }
}
