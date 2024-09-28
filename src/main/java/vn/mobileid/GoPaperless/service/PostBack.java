package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.model.apiModel.MailInfo;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import vn.mobileid.GoPaperless.model.participantsModel.AddParticipant;

@Service
public class PostBack {
    private final ProcessDb connect;
    private final CheckAndSendMailService checkAndSendMailService;

    public PostBack(ProcessDb connect, CheckAndSendMailService checkAndSendMailService) {
        this.connect = connect;
        this.checkAndSendMailService = checkAndSendMailService;
    }

    public void postBackToShareStatus(
            String postBackUrl,String signingToken, List<Map<String, Object>> dataSigners, String processType) throws Exception {
        System.out.println("postBackUrl: " + postBackUrl);
        RestTemplate restTemplate = new RestTemplate();
//        String UrlPostBack = "https://paperless-sa.mobile-id.vn/paperless-sa-url-websocket/api/v1/paperless/signing-file/postback/arrangement/?signingToken="
//                + signingToken;
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("token", signingToken);
        requestData.put("type", "arrangement");
        requestData.put("status", "OK");
        requestData.put("processType", processType);
        if (dataSigners != null) {
            requestData.put("signers", dataSigners);
        }
        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);
        // Log the JSON string
        System.out.println("Request Data postBackToShareStatus as JSON: " + requestDataJson);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData);
//        System.out.println("Postback Url: " + UrlPostBack);
        ResponseEntity<String> response = restTemplate.exchange(postBackUrl, HttpMethod.POST, httpEntity, String.class);
        System.out.println("response: " + response.getBody());
    }

    public void postBackForIndividual(String signingToken) {
        RestTemplate restTemplate = new RestTemplate();
        String UrlPostBack = "https://paperless-sa.mobile-id.vn/paperless-sa-url-websocket/api/v1/paperless/signing-file/postback/arrangement/?signingToken="
                + signingToken;
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("token", signingToken);
        requestData.put("status", "OK");
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData);
        System.out.println("Postback Url: " + UrlPostBack);
        ResponseEntity<String> response = restTemplate.exchange(UrlPostBack, HttpMethod.POST, httpEntity, String.class);
        System.out.println("response: " + response.getBody());
    }

    public void postBack2(
            String deadline,
            Participants signer,
            String workFlowType,
            String content,
            String dataResponse,
            String signedType,
            int isSetPosition,
            String signerId,
            String fileName,
            String signingToken,
            String pDMS_PROPERTY,
            String signatureId,
            String signerToken,
            String signedTime,
            WorkFlowList rsWFList,
            int sFileID_Last,
            String certEncode,
            String serialNumber,
            String signingOption,
            String uuid,
            int fileSize,
            int enterpriseId,
            String digest,
            String signedHash,
            String pSIGNATURE_VALUE,
            HttpServletRequest request) throws Exception {
        String pLAST_MODIFIED_BY = "CoreGateway";
        Path path = new File(fileName).toPath();
        String mimeType = Files.probeContentType(path);

        UUID uuid1 = UUID.randomUUID();
        String uploadToken = CommonFunction.getCryptoHash(uuid1.toString());
        String fileType = FilenameUtils.getExtension(fileName);
        String pHMAC = "";
        String pCREATED_BY = "";
        String pURL = "";
        String SIGNATURE_TYPE = "aes";
        int[] pFILE_ID = new int[1];

        String sInsertFile = connect.USP_GW_PPL_FILE_ADD(enterpriseId, fileName, fileSize,
                Difinitions.CONFIG_PPL_FILE_STATUS_PENDING,
                pURL, fileType, mimeType, digest, "", "", pDMS_PROPERTY, uploadToken,
                pHMAC, pCREATED_BY, pFILE_ID);
        if ("1".equals(sInsertFile)) {
            // test
            // sFileID_Last = pFILE_ID[0];
            String sAction = "signer_signed";
            String sSigner = CommonFunction.CheckTextNull(signerId);
            String sStatus = "ok";
            String sFileSigner = "";
            String sFileComplete = "";
            String sCountryCode = "vn";
            String sSignature_id = signatureId;

            // update file signed
            String sUpdateFile = connect.USP_GW_PPL_FILE_UPDATE(pFILE_ID[0],
                    Difinitions.CONFIG_PPL_FILE_STATUS_UPLOADED,
                    "", "", "", "", "", "", "", uuid, pDMS_PROPERTY, "", pLAST_MODIFIED_BY);
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(signerToken,
                    Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_SIGNED, "", isSetPosition);
            int pPPL_WORKFLOW_ID = rsWFList.getId();// sStatusWFCheck[0];
            String result = connect.USP_GW_PPL_WORKFLOW_FILE_ADD(pPPL_WORKFLOW_ID, pFILE_ID[0],
                    Difinitions.CONFIG_WORKFLOW_FILE_SIGNED_FILE, "", sFileID_Last, "", "");
            System.out.println("result: " + result);
            System.out.println("signedTime: " + signedTime);

            try {
                String sDateSign = CommonFunction.convertTimeToUpDb(signedTime);
                System.out.println("sDateSign: " + sDateSign);
                // call again to get the latest status
                rsWFList = new WorkFlowList();
                connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);
                // khởi tạo request
                String protocol = request.getHeader("X-Forwarded-Proto");
                if (protocol == null) {
                    protocol = request.getScheme(); // fallback to default scheme
                }

                sFileSigner = protocol + "://" + request.getHeader("host") + "/view/uiApi/signing/"
                        + signingToken + "/download/" + sSigner;
                String sJsonCertResult = CommonFunction.JsonCertificateObject(certEncode, serialNumber, sDateSign,
                        signingOption, sAction, signingToken,
                        sSigner, sStatus, sFileSigner, digest, sSignature_id, sCountryCode);

                byte[] data = CommonFunction.base64Decode(content);
                connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE(signerToken,
                        signedType, sDateSign, sSignature_id, signedHash, dataResponse, SIGNATURE_TYPE, signingOption,
                        sDateSign, pSIGNATURE_VALUE, pFILE_ID[0], pLAST_MODIFIED_BY);
                String signerName = signer.getLastName() + " " + signer.getFirstName();

                checkAndSendMailService.updateStatus(workFlowType, signerToken, signingToken, signerName,
                        signer.getEmail(), fileName, deadline, data);

                List<Participants> participants = new ArrayList<>();
                connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_LIST(participants, signingToken);

                if (!"".equals(rsWFList.getPostBackUrl()) && rsWFList.getPostBackUrl() != null) {
                    CommonFunction.PostBackJsonCertificateObject(rsWFList.getPostBackUrl(), certEncode, serialNumber,
                            signedTime, signingOption, sAction, signingToken,
                            sSigner, sStatus, sFileSigner, digest, sSignature_id, sCountryCode, participants,
                            signerToken);
                }

                if (rsWFList != null) {
                    if (rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
                        // connect.USP_GW_PPL_WORKFLOW_UPDATE_STATUS(signingToken,
                        // Difinitions.CONFIG_PPL_WORKFLOW_STATUS_COMPLETED, "");
                        if (!"".equals(rsWFList.getPostBackUrl())) {
                            sAction = "signing_completed";
                            // log.info(
                            // "link download : " + protocol + "://"
                            // + request.getHeader("host") + "/api/signing/"
                            // + signingToken
                            // + "/download/");
                            sFileComplete = protocol + "://" + request.getHeader("host") + "/view/uiApi/signing/"
                                    + signingToken + "/download/";
                            CommonFunction.PostBackJsonObject(rsWFList.getPostBackUrl(), certEncode,
                                    serialNumber, signingOption, sAction, signingToken, sSigner, sStatus, sFileComplete,
                                    sCountryCode, digest);

                        }
                    }
                }

            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    public void postBackParticipant(
            String postBackUrl,AddParticipant data, String newSignerId, String newSignerToken) {
        RestTemplate restTemplate = new RestTemplate();
//        String UrlPostBack = "https://paperless-sa.mobile-id.vn/paperless-sa-url-websocket/api/v1/paperless/signing-file/postback/arrangement/?signingToken="
//                + data.getSigningToken();
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("token", data.getSigningToken());
        requestData.put("processType", data.getProcess_type());
        requestData.put("firstName", data.getFirstName());
        requestData.put("lastName", data.getLastName());
        requestData.put("email", data.getEmail());
        requestData.put("position", data.getPosition());
        requestData.put("purpose", data.getPurpose());
        requestData.put("structural_subdivision", data.getStructural_subdivision());
        requestData.put("enterpriseId", data.getEnterpriseId());
        requestData.put("status", "add");
        // Tạo signer Map
        Map<String, String> signerData = new HashMap<>();
        signerData.put("signer_id", newSignerId);
        signerData.put("signer_token", newSignerToken);
        // Thêm signer Map vào requestData Map
        requestData.put("signer", signerData);
        System.out.println("requestData: " + requestData);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData);
        System.out.println("Postback Url: " + postBackUrl);
        ResponseEntity<String> response = restTemplate.exchange(postBackUrl, HttpMethod.POST, httpEntity, String.class);
        System.out.println("response: " + response.getBody());
    }
}
