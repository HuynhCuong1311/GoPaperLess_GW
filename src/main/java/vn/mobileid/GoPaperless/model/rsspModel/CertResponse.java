package vn.mobileid.GoPaperless.model.rsspModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertResponse {
    private String userId;
    private String subject;
    private String subjectDN;
    private String issuer;
    private String validFrom;
    private String validTo;
    private String cert;
    private String credentialID;
    private String authMode;
    private String phoneNumber;
    private String email;
    private String serialNumber;
    private String country;
    private boolean isSeal;
    private boolean qes;
}
