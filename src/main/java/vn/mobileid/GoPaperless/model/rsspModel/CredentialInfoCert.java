package vn.mobileid.GoPaperless.model.rsspModel;

import java.util.List;

public class CredentialInfoCert {
    private int certId;
    private String credentialID;
    private List<String> certificates;
    private String status;
    private String statusDesc;
    private int authModeId;

    public int getCertId() {
        return certId;
    }

    public void setCertId(int certId) {
        this.certId = certId;
    }

    public String getCredentialID() {
        return credentialID;
    }

    public void setCredentialID(String credentialID) {
        this.credentialID = credentialID;
    }

    public List<String> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<String> certificates) {
        this.certificates = certificates;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusDesc() {
        return statusDesc;
    }

    public void setStatusDesc(String statusDesc) {
        this.statusDesc = statusDesc;
    }

    public int getAuthModeId() {
        return authModeId;
    }

    public void setAuthModeId(int authModeId) {
        this.authModeId = authModeId;
    }
}
