package vn.mobileid.GoPaperless.model.apiModel;

public class Participants {
    private int id;
    private int pplWorkflowId;
    private String signerId;
    private int sequenceNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String metaInformation;
    private int signerType;
    private int signerStatus;
    private String signerToken;
    private String signingOptions;
    private String annotation;
    private String customReason;
    private String signingPurpose;
    private String signedType;
    private String signedTime;
    private String certificate;
    private String issuer;
    private String owner;
    private String validFrom;
    private String validTo;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPplWorkflowId() {
        return pplWorkflowId;
    }

    public void setPplWorkflowId(int pplWorkflowId) {
        this.pplWorkflowId = pplWorkflowId;
    }

    public String getSignerId() {
        return signerId;
    }

    public void setSignerId(String signerId) {
        this.signerId = signerId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMetaInformation() {
        return metaInformation;
    }

    public void setMetaInformation(String metaInformation) {
        this.metaInformation = metaInformation;
    }

    public int getSignerStatus() {
        return signerStatus;
    }

    public void setSignerStatus(int signerStatus) {
        this.signerStatus = signerStatus;
    }

    public String getSignerToken() {
        return signerToken;
    }

    public void setSignerToken(String signerToken) {
        this.signerToken = signerToken;
    }

    public String getSigningOptions() {
        return signingOptions;
    }

    public void setSigningOptions(String signingOptions) {
        this.signingOptions = signingOptions;
    }

    public String getAnnotation() {
        return annotation;
    }

    public void setAnnotation(String annotation) {
        this.annotation = annotation;
    }

    public String getCustomReason() {
        return customReason;
    }

    public void setCustomReason(String customReason) {
        this.customReason = customReason;
    }

    public String getSigningPurpose() {
        return signingPurpose;
    }

    public void setSigningPurpose(String signingPurpose) {
        this.signingPurpose = signingPurpose;
    }

    public String getSignedType() {
        return signedType;
    }

    public void setSignedType(String signedType) {
        this.signedType = signedType;
    }

    public String getSignedTime() {
        return signedTime;
    }

    public void setSignedTime(String signedTime) {
        this.signedTime = signedTime;
    }

    public String getCertificate() {
        return certificate;
    }

    public void setCertificate(String certificate) {
        this.certificate = certificate;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(String validFrom) {
        this.validFrom = validFrom;
    }

    public String getValidTo() {
        return validTo;
    }

    public void setValidTo(String validTo) {
        this.validTo = validTo;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public int getSignerType() {
        return signerType;
    }

    public void setSignerType(int signerType) {
        this.signerType = signerType;
    }
}
