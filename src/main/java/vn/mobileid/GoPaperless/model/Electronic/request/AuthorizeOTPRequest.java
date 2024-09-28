package vn.mobileid.GoPaperless.model.Electronic.request;

import vn.mobileid.GoPaperless.dto.rsspDto.TextField;

import java.util.List;

public class AuthorizeOTPRequest extends ElectronicBaseRequest{
    private String credentialID;
    private String requestID;
    private String otp;
    private String signerId;
    private String signingToken;
    private String signingPurpose;
    private String country;
    private String countryRealtime;
    private String imageBase64;
    private String fileName;
    private String signerToken;
    private String signingOption;
    private String codeNumber;
    private String type;
    private String certChain;
    private String fieldName;
    private String contactInfor;
    private int lastFileId;
    private int documentId;
    private String assurance;
    private List<TextField> textField;
    private String qrypto;
    private String workFlowProcessType;
    private String code;
    private String facialImage;
    private String imageFace;
    private String subject_id;
    private String jwt;

    public String getCredentialID() {
        return credentialID;
    }

    public void setCredentialID(String credentialID) {
        this.credentialID = credentialID;
    }

    public String getRequestID() {
        return requestID;
    }

    public void setRequestID(String requestID) {
        this.requestID = requestID;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getSignerId() {
        return signerId;
    }

    public void setSignerId(String signerId) {
        this.signerId = signerId;
    }

    public String getSigningToken() {
        return signingToken;
    }

    public void setSigningToken(String signingToken) {
        this.signingToken = signingToken;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getSignerToken() {
        return signerToken;
    }

    public void setSignerToken(String signerToken) {
        this.signerToken = signerToken;
    }

    public String getSigningOption() {
        return signingOption;
    }

    public void setSigningOption(String signingOption) {
        this.signingOption = signingOption;
    }

    public String getCodeNumber() {
        return codeNumber;
    }

    public void setCodeNumber(String codeNumber) {
        this.codeNumber = codeNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCertChain() {
        return certChain;
    }

    public void setCertChain(String certChain) {
        this.certChain = certChain;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public int getLastFileId() {
        return lastFileId;
    }

    public void setLastFileId(int lastFileId) {
        this.lastFileId = lastFileId;
    }

    public int getDocumentId() {
        return documentId;
    }

    public void setDocumentId(int documentId) {
        this.documentId = documentId;
    }

    public String getSigningPurpose() {
        return signingPurpose;
    }

    public void setSigningPurpose(String signingPurpose) {
        this.signingPurpose = signingPurpose;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getContactInfor() {
        return contactInfor;
    }

    public void setContactInfor(String contactInfor) {
        this.contactInfor = contactInfor;
    }

    public String getCountryRealtime() {
        return countryRealtime;
    }

    public void setCountryRealtime(String countryRealtime) {
        this.countryRealtime = countryRealtime;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public String getAssurance() {
        return assurance;
    }

    public void setAssurance(String assurance) {
        this.assurance = assurance;
    }

    public List<TextField> getTextField() {
        return textField;
    }

    public void setTextField(List<TextField> textField) {
        this.textField = textField;
    }

    public String getQrypto() {
        return qrypto;
    }

    public void setQrypto(String qrypto) {
        this.qrypto = qrypto;
    }

    public String getWorkFlowProcessType() {
        return workFlowProcessType;
    }

    public void setWorkFlowProcessType(String workFlowProcessType) {
        this.workFlowProcessType = workFlowProcessType;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getFacialImage() {
        return facialImage;
    }

    public void setFacialImage(String facialImage) {
        this.facialImage = facialImage;
    }

    public String getImageFace() {
        return imageFace;
    }

    public void setImageFace(String imageFace) {
        this.imageFace = imageFace;
    }

    public String getSubject_id() {
        return subject_id;
    }

    public void setSubject_id(String subject_id) {
        this.subject_id = subject_id;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }
}
