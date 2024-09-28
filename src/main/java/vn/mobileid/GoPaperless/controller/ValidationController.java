package vn.mobileid.GoPaperless.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.mobileid.GoPaperless.dto.apiDto.ValidView;
import vn.mobileid.GoPaperless.model.apiModel.PplFileDetail;
import vn.mobileid.GoPaperless.model.gwModal.ValidPostBackRequest;
import vn.mobileid.GoPaperless.model.gwModal.ValidationResquest;
import vn.mobileid.GoPaperless.service.ValidationService;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/val")
public class ValidationController {
    @Autowired
    private ValidationService validationService;

    @Autowired
    private GatewayAPI gatewayAPI;

    @PostMapping("/getView")
    public ResponseEntity<?> getView(@RequestBody ValidationResquest validationResquest) throws Exception {
        String result = validationService.getView(validationResquest);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/getFileDetail")
    public ResponseEntity<?> getFileDetail(@RequestBody ValidationResquest validationResquest) throws Exception {
        List<PplFileDetail> listPplFileDetail = validationService.getFileDetail(validationResquest);
        return new ResponseEntity<>(listPplFileDetail, HttpStatus.OK);
    }

    @PostMapping("/postback")
    public ResponseEntity<?> postback(@RequestBody ValidPostBackRequest validPostBackRequest) throws Exception {

        String result = validationService.postback(validPostBackRequest);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/checkStatus")
    public ResponseEntity<?> checkStatus(@RequestBody ValidPostBackRequest validPostBackRequest) throws Exception {

        int result = validationService.checkStatus(validPostBackRequest);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{upload_token}/downloadReport")
    public ResponseEntity<?> downloadReport(@PathVariable String upload_token) throws Exception {

        System.out.println("downloadReport o day ne");
        System.out.println("upload_token: " + upload_token);
        String response = gatewayAPI.downloadReport(upload_token);

        // Decode base64 data to byte array
        byte[] pdfBytes = Base64.getDecoder().decode(response);
        System.out.println("toi day ne");
        HttpHeaders headers = new HttpHeaders();
        String fileName = "file.pdf"; // Tên file PDF muốn trả về
        String encodedFileName = new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
        headers.add("Content-Disposition", "attachment; filename=" + encodedFileName);

        // Set content length
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(pdfBytes);

    }
}
