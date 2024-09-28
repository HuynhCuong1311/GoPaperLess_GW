package vn.mobileid.GoPaperless.model.Electronic.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckCertificateRequest extends ElectronicBaseRequest{
    private String jwt;
    private String credentialID;
    private String connectorNameRSSP;
    private String assurance;
    private String taxCode;
    private String criteria;
    private String code;
    private String authMode;
}
