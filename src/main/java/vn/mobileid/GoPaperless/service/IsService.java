package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.controller.GatewayAPI;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.dto.rsspDto.TextField;
import vn.mobileid.GoPaperless.model.apiModel.LastFile;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.fpsModel.FpsSignRequest;
import vn.mobileid.GoPaperless.model.fpsModel.HashFileRequest;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service
public class IsService {

    private final ProcessDb connect;
    private final FpsService fpsService;
    private final PostBack postBack;
    private final GatewayAPI gatewayAPI;

    public IsService(ProcessDb connect, FpsService fpsService, PostBack postBack, GatewayAPI gatewayAPI) {
        this.connect = connect;
        this.fpsService = fpsService;
        this.postBack = postBack;
        this.gatewayAPI = gatewayAPI;
    }

    public Map<String, String> getHash(RsspRequest data) throws Exception {
        System.out.println("getHash");
        String sResult = "";

        String fieldName = data.getFieldName();
        String signerToken = data.getSignerToken();
        String signingToken = data.getSigningToken();
        String certChain = data.getCertChain().getCert();
        String signingPurpose = data.getSigningPurpose();
        String country = !Objects.equals(data.getCountry(), "") ? data.getCountry() : data.getCountryRealtime();
        String imageBase64 = data.getImageBase64();
        String contactInfor = data.getContactInfor();
        List<TextField> textFields = data.getTextField();

        try {
            Participants rsParticipant = new Participants();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
            if (rsParticipant == null || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
                sResult = "Signer Status invalid";// trạng thái không hợp lệ
                throw new Exception(sResult);
            }

            LastFile lastFile = new LastFile();
            connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, signingToken);
            int documentId = lastFile.getDocumentId();

            fpsService.fillVotri(documentId, textFields);

            List<String> listCertChain = new ArrayList<>();
            listCertChain.add(certChain);

            HashFileRequest hashFileRequest = new HashFileRequest();

            hashFileRequest.setCertificateChain(listCertChain);
            hashFileRequest.setSigningReason(signingPurpose);
            hashFileRequest.setSignatureAlgorithm("RSA");
            hashFileRequest.setSignedHash("SHA256");
            hashFileRequest.setSigningLocation(country);
            hashFileRequest.setFieldName(fieldName);
            hashFileRequest.setHandSignatureImage(imageBase64);
            hashFileRequest.setSignerContact(contactInfor);

            String hashList = fpsService.hashSignatureField(documentId, hashFileRequest);
            System.out.println("hash file xong:");
            // convert base64 to hex

//        byte[] decoded = Base64.decodeBase64(hashList);
//        String hash = Hex.encodeHexString(decoded);
            byte[] decodedBytes = Base64.getDecoder().decode(hashList);
            String hash = CommonFunction.bytesToHex(decodedBytes);

            Map<String, String> response = new HashMap<>();
            response.put("hashPG", hash);
            response.put("hash", hashList);

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("erver error: " + e.getMessage());
            throw new Exception(e.getMessage());
//            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String packFile(RsspRequest data, HttpServletRequest request) throws Exception {
        System.out.println("packFile");
        try {
            String signingToken = data.getSigningToken();
            String signerToken = data.getSignerToken();
            String hashList = data.getHashList();
//            String certChain = data.getUsbCertChain();
            String certChain = data.getCertChain().getCert();
//            String signerId = data.getSignerId();
            List<String> signatures = data.getSignatures();
//            int documentId = data.getDocumentId();
//            String fileName = data.getFileName();
//            int lastFileId = data.getLastFileId();
            String codeNumber = data.getCertChain().getSerialNumber();
            String signingOption = data.getSigningOption();
//            int enterpriseId = data.getEnterpriseId();
            String assurance = data.getAssurance();
            String sResult = "";
            List<TextField> textFields = data.getTextField();
//            String workFlowType = data.getWorkFlowProcessType();

            WorkFlowList rsWFList = new WorkFlowList();
            connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);

            if (rsWFList == null || rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
                return sResult = "Signer Status invalid";// trạng thái không hợp lệ

            }

            Participants rsParticipant = new Participants();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
            if (rsParticipant == null || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
                return sResult = "The document has already been signed";
            }
            String signerId = rsParticipant.getSignerId();

            LastFile lastFile = new LastFile();
            connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, signingToken);

            String fileName = lastFile.getLastPplFileName();
            int documentId = lastFile.getDocumentId();
            String deadline = lastFile.getDeadlineAt();
            int lastFileId = lastFile.getLastPplFileSignedId();
            int enterpriseId = lastFile.getEnterpriseId();
            String workFlowType = lastFile.getWorkflowProcessType();

            String pDMS_PROPERTY = CommonFunction.getPropertiesFMS();

//            fpsService.fillForm(documentId, textFields);

//            String sSignature_id = data.getUsbCertId();
//            System.out.println("sSignature_id: " + sSignature_id);
            String signature = signatures.get(0);

            List<String> listCertChain = new ArrayList<>();
            listCertChain.add(certChain);
            FpsSignRequest fpsSignRequest = new FpsSignRequest();
            fpsSignRequest.setFieldName(data.getFieldName());
            fpsSignRequest.setHashValue(hashList);
            fpsSignRequest.setSignatureValue(signature);

            fpsSignRequest.setCertificateChain(listCertChain);

            String responseSign = fpsService.signDocument(documentId, fpsSignRequest);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode signNode = objectMapper.readTree(responseSign);
            String uuid = signNode.get("uuid").asText();
            int fileSize = signNode.get("file_size").asInt();
            String digest = signNode.get("digest").asText();
            String signedHash = signNode.get("signed_hash").asText();
            String signedTime = signNode.get("signed_time").asText();
            String signatureName = signNode.get("signature_name").asText();
            String content = signNode.get("file_data").asText();

            String dataResponse = gatewayAPI.getSignatureId(signatureName, fileName, content, digest);

            JsonNode dataNode = objectMapper.readTree(dataResponse);
            String signatureId = dataNode.get("id").asText();


//            String sSignature_id = gatewayService.getSignatureId(uuid, fileName);
//            String sSignature_id = requestID; // temporary
            String signedType = assurance.equals("ESEAL") || assurance.equals("QSEAL") ? "ESEAL" : "NORMAL";
            int isSetPosition = 1;
            postBack.postBack2(deadline, rsParticipant, workFlowType, content, dataResponse, signedType, isSetPosition, signerId, fileName, signingToken, pDMS_PROPERTY, signatureId, signerToken, signedTime, rsWFList, lastFileId, certChain, codeNumber, signingOption, uuid, fileSize, enterpriseId, digest, signedHash, signature, request);
            return responseSign;

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("server error: " + e.getMessage());
            throw new Exception(e.getMessage());
//            throw new Exception("Server error occurred. Please try again later.");
        }

    }
}
