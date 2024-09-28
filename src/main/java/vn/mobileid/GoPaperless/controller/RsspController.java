package vn.mobileid.GoPaperless.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.model.rsspModel.CredentialInfo;
import vn.mobileid.GoPaperless.model.rsspModel.CredentialList;
import vn.mobileid.GoPaperless.service.RsspService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/rssp")
public class RsspController {
    private final RsspService rsspService;

    public RsspController(RsspService rsspService) {
        this.rsspService = rsspService;
    }

    @PostMapping("/getCertificates")
    public ResponseEntity<?> getCertificates(@RequestBody RsspRequest data) throws Exception {
        System.out.println("getCertificates");
        Map<String, Object> response = rsspService.getCertificates(data);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/signFile")
    public ResponseEntity<?> signFile(@RequestBody RsspRequest data, HttpServletRequest request) throws Throwable {
        System.out.println("signFile");
        String response = rsspService.signFile(data,request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/getVc")
    public ResponseEntity<?> getVc(@RequestBody RsspRequest data) throws Exception {
        System.out.println("getVc");
        String response = rsspService.getVc(data.getRequestID());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
