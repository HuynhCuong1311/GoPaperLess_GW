package vn.mobileid.GoPaperless.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.mobileid.GoPaperless.dto.rsspDto.MisaRequest;
import vn.mobileid.GoPaperless.model.rsspModel.CertResponse;
import vn.mobileid.GoPaperless.service.MisaCaService;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.model.x509.CertificateToken;
import vn.mobileid.spi.DSSUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/misa")
public class MisaCAController {
    private final MisaCaService misaCaService;
    private ObjectMapper objectMapper = new ObjectMapper();

    public MisaCAController(MisaCaService misaCaService) {
        this.misaCaService = misaCaService;
    }

    @PostMapping("/getCertificates")
    public ResponseEntity<?> getCertificates(@RequestBody MisaRequest data, HttpServletRequest header) throws Exception {
        misaCaService.getMisaConnector(data);
        String ipAddress = header.getHeader("X-Forwarded-For");

        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = header.getHeader("X-Real-IP");
        }

        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = header.getRemoteAddr();
        }

        // Trường hợp IP Address là chuỗi các IP, lấy IP đầu tiên
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }

        // Lấy User-Agent string từ request
        String userAgentString = header.getHeader("User-Agent");

        String result = misaCaService.login(data, ipAddress, userAgentString);
        JsonNode jsonNode = objectMapper.readTree(result);
        String remoteSigningAccessToken = jsonNode.get("data").get("remoteSigningAccessToken").asText();

        String certList = misaCaService.getCertificates(data, ipAddress, userAgentString, remoteSigningAccessToken);
        JsonNode jsonCertList = objectMapper.readTree(certList);
        Map<String, Object> response = new HashMap<>();
        if (jsonCertList.isArray() && jsonCertList.size() > 0) {
            for (JsonNode certItem : jsonCertList) {
                String certChain = certItem.get("certificate").asText();
                CertResponse certResponse = CommonFunction.certificateInfo(certChain, null, null);
                ((ObjectNode) certItem).put("subjectDN", certResponse.getSubjectDN());
                ((ObjectNode) certItem).put("subject", certResponse.getSubject());
                ((ObjectNode) certItem).put("issuer", certResponse.getIssuer());
                ((ObjectNode) certItem).put("validFrom", certResponse.getValidFrom());
                ((ObjectNode) certItem).put("validTo", certResponse.getValidTo());
                ((ObjectNode) certItem).put("serialNumber", certResponse.getSerialNumber());
                ((ObjectNode) certItem).put("seal", certResponse.isSeal());
                ((ObjectNode) certItem).put("qes", certResponse.isQes());
                ((ObjectNode) certItem).put("phoneNumber", certResponse.getPhoneNumber());
                ((ObjectNode) certItem).put("email", certResponse.getEmail());
                ((ObjectNode) certItem).put("country", certResponse.getCountry());
                ((ObjectNode) certItem).put("cert", certChain);
            }
        }
        response.put("listCertificate", jsonCertList);
        response.put("login", jsonNode);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/misaSignFile")
    public ResponseEntity<?> misaSignFile(@RequestBody MisaRequest data, HttpServletRequest header) throws Exception {
        String ipAddress = header.getHeader("X-Forwarded-For");

        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = header.getHeader("X-Real-IP");
        }

        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = header.getRemoteAddr();
        }

        // Trường hợp IP Address là chuỗi các IP, lấy IP đầu tiên
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }

        // Lấy User-Agent string từ request
        String userAgentString = header.getHeader("User-Agent");

        String response = misaCaService.misaSignFile(data, ipAddress, userAgentString, header);


        return new ResponseEntity<>("response", HttpStatus.OK);
    }
}
