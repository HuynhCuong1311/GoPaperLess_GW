package vn.mobileid.GoPaperless.model.rsspModel;

import java.util.List;

public class CredentialList extends RsspResponse {
    private List<CredentialItem> certs;

    public List<CredentialItem> getCerts() {
        return certs;
    }

    public void setCerts(List<CredentialItem> certs) {
        this.certs = certs;
    }
}
