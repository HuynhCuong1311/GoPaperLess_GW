package vn.mobileid.GoPaperless.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import vn.mobileid.GoPaperless.model.Electronic.request.CheckCertificateRequest;
import vn.mobileid.GoPaperless.model.rsspModel.CertResponse;
import vn.mobileid.GoPaperless.model.rsspModel.CredentialList;
import vn.mobileid.GoPaperless.service.InternalService;

import java.util.List;

@Controller
@RequestMapping("/internal")
public class InternalController {

    private final InternalService internalService;

    public InternalController(InternalService internalService) {
        this.internalService = internalService;
    }

    @PostMapping("/getRsspCertificate")
    public ResponseEntity<?> getRsspCertificate(@RequestBody CheckCertificateRequest data) throws Exception {
        List<CertResponse> listCertificate = internalService.getRsspCertificate(data);
        return new ResponseEntity<>(listCertificate, HttpStatus.OK);
    }
}
