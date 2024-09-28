package vn.mobileid.GoPaperless.dto.apiDto;

import java.util.Date;
import vn.mobileid.GoPaperless.model.apiModel.Participants;

import java.util.List;

public class SigningWorkflowDto {
    private int documentId;
    private int firstFileId;
    private int lastFileId;
    private String fileName;
    private String lastFileUuid;
    private int fileSize;
    private int enterpriseId;
    private int workFlowId;
    private String documentName;
    private String signingToken;
    private List<Participants> participants;
    private String pdfBase64;
    private String deadlineAt;
    private String fileType;
    private String workflowProcessType;
    private int workflowStatus;
    private String createdBy;
    private Date createdAt;
    private Date lastModifiedAt;
    private int signatureLevels;
    private int arrangement_enabled;

    public int getDocumentId() {
        return documentId;
    }

    public void setDocumentId(int documentId) {
        this.documentId = documentId;
    }

    public int getFirstFileId() {
        return firstFileId;
    }

    public void setFirstFileId(int firstFileId) {
        this.firstFileId = firstFileId;
    }

    public int getLastFileId() {
        return lastFileId;
    }

    public void setLastFileId(int lastFileId) {
        this.lastFileId = lastFileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getLastFileUuid() {
        return lastFileUuid;
    }

    public void setLastFileUuid(String lastFileUuid) {
        this.lastFileUuid = lastFileUuid;
    }

    public int getFileSize() {
        return fileSize;
    }

    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }

    public int getEnterpriseId() {
        return enterpriseId;
    }

    public void setEnterpriseId(int enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    public int getWorkFlowId() {
        return workFlowId;
    }

    public void setWorkFlowId(int workFlowId) {
        this.workFlowId = workFlowId;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public String getSigningToken() {
        return signingToken;
    }

    public void setSigningToken(String signingToken) {
        this.signingToken = signingToken;
    }

    public List<Participants> getParticipants() {
        return participants;
    }

    public void setParticipants(List<Participants> participants) {
        this.participants = participants;
    }

    public String getPdfBase64() {
        return pdfBase64;
    }

    public void setPdfBase64(String pdfBase64) {
        this.pdfBase64 = pdfBase64;
    }

    public String getDeadlineAt() {
        return deadlineAt;
    }

    public void setDeadlineAt(String deadlineAt) {
        this.deadlineAt = deadlineAt;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getWorkflowProcessType() {
        return workflowProcessType;
    }

    public void setWorkflowProcessType(String workflowProcessType) {
        this.workflowProcessType = workflowProcessType;
    }

    public int getWorkflowStatus() {
        return workflowStatus;
    }

    public void setWorkflowStatus(int workflowStatus) {
        this.workflowStatus = workflowStatus;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getLastModifiedAt() {
        return lastModifiedAt;
    }

    public void setLastModifiedAt(Date lastModifiedAt) {
        this.lastModifiedAt = lastModifiedAt;
    }
    
    public int getSignatureLevels() {
        return signatureLevels;
    }

    public void setSignatureLevels(int signatureLevels) {
        this.signatureLevels = signatureLevels;
    }

    public int getArrangement_enabled() {
        return arrangement_enabled;
    }

    public void setArrangement_enabled(int arrangement_enabled) {
        this.arrangement_enabled = arrangement_enabled;
    }
}
