package vn.mobileid.GoPaperless.model.rsspModel;

import java.util.List;

public class CredentialInfo extends RsspResponse{
    private CredentialInfoKey key;
    private CredentialInfoCert cert;
    private String sharedMode;
    private String createdRP;
    private int multisign;
    private List<String> authModes;
    private String authMode;
    private int SCAL;
    private String contractExpirationDate;
    private int remainingSigningCounter;
    private boolean defaultPassphrase;

    public CredentialInfoKey getKey() {
        return key;
    }

    public void setKey(CredentialInfoKey key) {
        this.key = key;
    }

    public CredentialInfoCert getCert() {
        return cert;
    }

    public void setCert(CredentialInfoCert cert) {
        this.cert = cert;
    }

    public String getSharedMode() {
        return sharedMode;
    }

    public void setSharedMode(String sharedMode) {
        this.sharedMode = sharedMode;
    }

    public String getCreatedRP() {
        return createdRP;
    }

    public void setCreatedRP(String createdRP) {
        this.createdRP = createdRP;
    }

    public int getMultisign() {
        return multisign;
    }

    public void setMultisign(int multisign) {
        this.multisign = multisign;
    }

    public List<String> getAuthModes() {
        return authModes;
    }

    public void setAuthModes(List<String> authModes) {
        this.authModes = authModes;
    }

    public String getAuthMode() {
        return authMode;
    }

    public void setAuthMode(String authMode) {
        this.authMode = authMode;
    }

    public int getSCAL() {
        return SCAL;
    }

    public void setSCAL(int SCAL) {
        this.SCAL = SCAL;
    }

    public String getContractExpirationDate() {
        return contractExpirationDate;
    }

    public void setContractExpirationDate(String contractExpirationDate) {
        this.contractExpirationDate = contractExpirationDate;
    }

    public int getRemainingSigningCounter() {
        return remainingSigningCounter;
    }

    public void setRemainingSigningCounter(int remainingSigningCounter) {
        this.remainingSigningCounter = remainingSigningCounter;
    }

    public boolean isDefaultPassphrase() {
        return defaultPassphrase;
    }

    public void setDefaultPassphrase(boolean defaultPassphrase) {
        this.defaultPassphrase = defaultPassphrase;
    }
}
