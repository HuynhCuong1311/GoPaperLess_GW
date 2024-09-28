package vn.mobileid.GoPaperless.dto.rsspDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertChain {
    private String cert;
    private boolean codeEnable;
    private String credentialID;
    private String issuer;
    private String prefixCode;
    private String relyingParty;
    private String subject;
    private String validFrom;
    private String validTo;
    private String keyAlias;
    private String userId;
    private String serialNumber;
}
