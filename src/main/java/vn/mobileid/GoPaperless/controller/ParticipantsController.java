/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package vn.mobileid.GoPaperless.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import static com.sun.corba.se.spi.presentation.rmi.StubAdapter.request;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.fpsModel.BasicFieldAttribute;
import vn.mobileid.GoPaperless.model.participantsModel.AddParticipant;
import vn.mobileid.GoPaperless.model.participantsModel.ParticipantsObject;
import vn.mobileid.GoPaperless.model.participantsModel.PdfInfo;
import vn.mobileid.GoPaperless.model.participantsModel.WorkFlow;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.service.PostBack;

@RestController
@RequestMapping("/participants")
public class ParticipantsController {

    private final GatewayAPI gatewayAPI;
    private final PostBack postBack;

    private final ProcessDb connect;

    public ParticipantsController(GatewayAPI gatewayAPI, ProcessDb connect, PostBack postBack) {
        this.connect = connect;
        this.gatewayAPI = gatewayAPI;
        this.postBack = postBack;
    }

    @PostMapping("/updateParticipant")
    public ResponseEntity<?> updateParticipant(@RequestBody ParticipantsObject data) throws Exception {
        System.out.println("data getFirstName: " + data.getFirstName());
        System.out.println("data getSequenceNumber: " + data.getSequenceNumber());
        System.out.println("data getPurpose: " + data.getPurpose());
        System.out.println("data getSigningToken: " + data.getSigningToken());
        System.out.println("data getWorkflowProcessType: " + data.getWorkflowProcessType());
        System.out.println("data getMetaInformation: " + data.getMetaInformation());
        String result = "";
        if (data.getFirstName() != null) {
            result = connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_INFO(data);
            if (result.equals("1")) {
                System.out.println("update participant success");
            } else {
                System.out.println("update participant fail");
            }
        }
        if (data.getWorkflowProcessType() != null) {
            result = connect.USP_GW_PPL_WORKFLOW_UPDATE_PROCESS_TYPE(data);
            if (result.equals("1")) {
                System.out.println("update workflow success");
            } else {
                System.out.println("update workflow fail");
            }
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/createParticipant")
//    public ResponseEntity<?> createParticipant(@PathVariable int documentId, @PathVariable String field,
//            @RequestBody BasicFieldAttribute data) throws Exception {
    public ResponseEntity<?> createParticipant(@RequestBody AddParticipant data) throws Exception {
        System.out.println("signingToken: " + data.getSigningToken());
        System.out.println("SignerToken: " + data.getSignerToken());
        System.out.println("EnterpriseId: " + data.getEnterpriseId());
        System.out.println("signerId: " + data.getSignerId());
        System.out.println("purpose: " + data.getPurpose());
        System.out.println("reason: " + data.getReason());
        System.out.println("process_type: " + data.getProcess_type());
//        PdfInfo pdf = data.getPdf();
//        if (pdf != null) {
//            System.out.println("reason: " + pdf.getReason());
//        } else {
//            System.out.println("PdfInfo is null");
//        }

        String response = gatewayAPI.addNewSigner(data);
        System.out.println("response: " + response);
        // Tạo ObjectMapper để phân tích cú pháp JSON
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response);

        // Lấy node "signers"
        JsonNode signersNode = rootNode.path("signers");
        JsonNode statusNode = rootNode.path("status");
        System.out.println("signersNode: " + signersNode);
        System.out.println("statusNode: " + statusNode);
        // Lấy giá trị của statusNode dưới dạng chuỗi
        String statusValue = statusNode.asText();

        // Khai báo biến để lưu trữ signerId và signerToken cuối cùng
        String newSignerId = null;
        String newSignerToken = null;

        // Duyệt qua các phần tử trong node "signers"
        Iterator<Map.Entry<String, JsonNode>> fields = signersNode.fields();
        System.out.println("fields: " + fields);
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> field = fields.next();
            System.out.println("field: " + field);
            newSignerId = field.getKey();
            newSignerToken = field.getValue().asText();
        }
        // In ra signerId và signerToken cuối cùng
        System.out.println("Last Signer ID: " + newSignerId);
        System.out.println("Last Signer Token: " + newSignerToken);
        if ("ok".equals(statusValue)) {
            WorkFlowList rsWFList = new WorkFlowList();
            connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, data.getSigningToken());
            String postBackUrl = rsWFList.getPostBackUrl();
            postBack.postBackParticipant(postBackUrl,data, newSignerId, newSignerToken);
        } else {
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
