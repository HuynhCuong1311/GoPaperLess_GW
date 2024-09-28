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
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.dto.rsspDto.VtRequest;
import vn.mobileid.GoPaperless.model.rsspModel.CertResponse;
import vn.mobileid.GoPaperless.service.ViettelCaService;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.model.x509.CertificateToken;
import vn.mobileid.spi.DSSUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/vtca")
public class ViettelCAController {
    private final ViettelCaService viettelCAService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ViettelCAController(ViettelCaService viettelCAService) {
        this.viettelCAService = viettelCAService;
    }

    @PostMapping("/getCertificates")
    public ResponseEntity<?> getCertificates(@RequestBody VtRequest data) throws Exception {

        viettelCAService.getVtConnector(data);
        String accessToken = viettelCAService.login(data.getUserId());
        String certList = viettelCAService.getCertificates(data, accessToken);

        JsonNode jsonCertList = objectMapper.readTree(certList);
        Map<String, Object> response = new HashMap<>();
        if (jsonCertList.isArray() && jsonCertList.size() > 0) {
            for (JsonNode certItem : jsonCertList) {
                String certChain = certItem.get("cert").get("certificates").get(0).asText();

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
//                Object[] info1 = new Object[3];
//                String[] time = new String[2];
//                int[] intRes = new int[1];
//
//                CommonFunction.VoidCertificateComponents(certChain, info1, time, intRes);
//                if (intRes[0] == 0) {
//                    String uid = CommonFunction.getUID(info1[0].toString());
//                    ((ObjectNode) certItem).put("subjectDN", info1[0].toString());
//                    ((ObjectNode) certItem).put("subject", CommonFunction.getCommonnameInDN(info1[0].toString()));
//                    ((ObjectNode) certItem).put("issuer", CommonFunction.getCommonnameInDN(info1[1].toString()));
//                    ((ObjectNode) certItem).put("validFrom", time[0]);
//                    ((ObjectNode) certItem).put("validTo", time[1]);
//                    ((ObjectNode) certItem).put("cert", certChain);
//                    ((ObjectNode) certItem).put("serialNumber", info1[2].toString());
//                    ((ObjectNode) certItem).put("seal", CommonFunction.isSeal(info1[0].toString()));
//                    CertificateToken cert = DSSUtils.loadCertificateFromBase64EncodedString(certChain);
//                    ((ObjectNode) certItem).put("qes", CommonFunction.hasQESType(cert));
//                }
            }
        }
        response.put("listCertificate", jsonCertList);
        response.put("accessToken", accessToken);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/vtcaSignFile")
    public ResponseEntity<?> vtcaSignFile(@RequestBody VtRequest data, HttpServletRequest request) throws Exception {
        String result = viettelCAService.vtcaSignFile(data, request);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
