package vn.mobileid.GoPaperless.dto.rsspDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RsspRequest {
    private CertChain certChain;
    private String usbCertChain;
    private String usbCertId;
    private String codeNumber;
    private String connectorName;
    private String country;
    private String countryRealtime;
    private int documentId;
    private int enterpriseId;
    private String fileName;
    private String fieldName;
    private String imageBase64;
    private String language;
    private int lastFileId;
    private String lastFileUuid;
    private String provider;
    private String reason;
    private String requestID;
    private String signerId;
    private String signerToken;
    private int signerType;
    private String signingOption;
    private String signingPurpose;
    private String signingToken;
    private String hashList;
    private String relyingParty;
    private String contactInfor;
    private boolean codeEnable;
    private List<String> signatures;
    private int workFlowId;
    private String assurance;
    private String workFlowProcessType;
    private String qrypto;
    private List<TextField> textField;

}
