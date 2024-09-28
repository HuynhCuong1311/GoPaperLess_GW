/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package vn.mobileid.GoPaperless.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.mobileid.GoPaperless.model.documentsModel.DocumentsObject;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.service.FpsService;

@RestController
@RequestMapping("/documents")
public class DocumentsController {

    private final ProcessDb connect;

    public DocumentsController(ProcessDb connect) {
        this.connect = connect;
    }

//    public ResponseEntity<?> updateParticipant(
//            @RequestBody UpdateParticipantRequest updateParticipantRequest) throws Exception {
//
//        String response = electronicIdService.updateParticipant(updateSubjectRequest);
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
    @PostMapping("/updateDocumentsSetting")
    public ResponseEntity<?> updateDocumentsSetting(@RequestBody DocumentsObject data) throws Exception {
        System.out.println("data SignatureLevels: " + data.getSignatureLevels());
        System.out.println("data LastModifiedBy: " + data.getLastModifiedBy());
        System.out.println("data SigningToken: " + data.getSigningToken());
//        System.out.println("data DeadlineAt: " + data.getDeadlineAt().getTime());
        String result = "";
        if (data.getSigningToken()!= null) {
            result = connect.USP_GW_PPL_WORKFLOW_UPDATE_DOCUMENTS_SETTING(data);
            if (result.equals("1")) {
                System.out.println("update documents setting success");
            } else {
                System.out.println("update documents setting fail");
            }
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
