package vn.mobileid.GoPaperless.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.service.IsService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("/is")
public class IsController {

    private final IsService isService;

    public IsController(IsService isService) {
        this.isService = isService;
    }

    @PostMapping("/getHash")
    public ResponseEntity<?> getHash(@RequestBody RsspRequest data) throws Exception {
        System.out.println("getHash");
        Map<String, String> response = isService.getHash(data);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/packFile")
    public ResponseEntity<?> packFile(@RequestBody RsspRequest data, HttpServletRequest request) throws Exception {
        System.out.println("packFile");
        String response = isService.packFile(data, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
