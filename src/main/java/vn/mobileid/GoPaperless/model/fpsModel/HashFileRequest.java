package vn.mobileid.GoPaperless.model.fpsModel;

import java.util.List;

public class HashFileRequest {
    private String fieldName;
    private String handSignatureImage;
    private String signingReason;
    private String signingLocation;
    private String signatureAlgorithm;
    private String signedHash;
    private String signerContact;
    private List<String> certificateChain;

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getHandSignatureImage() {
        return handSignatureImage;
    }

    public void setHandSignatureImage(String handSignatureImage) {
        this.handSignatureImage = handSignatureImage;
    }

    public String getSigningReason() {
        return signingReason;
    }

    public void setSigningReason(String signingReason) {
        this.signingReason = signingReason;
    }

    public String getSigningLocation() {
        return signingLocation;
    }

    public void setSigningLocation(String signingLocation) {
        this.signingLocation = signingLocation;
    }

    public String getSignatureAlgorithm() {
        return signatureAlgorithm;
    }

    public void setSignatureAlgorithm(String signatureAlgorithm) {
        this.signatureAlgorithm = signatureAlgorithm;
    }

    public String getSignedHash() {
        return signedHash;
    }

    public void setSignedHash(String signedHash) {
        this.signedHash = signedHash;
    }

    public String getSignerContact() {
        return signerContact;
    }

    public void setSignerContact(String signerContact) {
        this.signerContact = signerContact;
    }

    public List<String> getCertificateChain() {
        return certificateChain;
    }

    public void setCertificateChain(List<String> certificateChain) {
        this.certificateChain = certificateChain;
    }
}
