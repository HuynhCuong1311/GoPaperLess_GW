package vn.mobileid.GoPaperless.model.apiModel;

import java.util.Date;

public class LastFile {
    private int pplWorkflowId;
    private int firstPplFileSignedId;
    private int lastPplFileSignedId;
    private String lastPplFileName;
    private String lastPplFileUuid;
    private int fileSize;
    private String fileType;
    private String uploadToken;
    private int documentId;
    private String workflowProcessType;;
    private int workflowStatus;;
    private String workflowDocumentName;
    private String workflowDocumentFormat;
    private int enterpriseId;
    private String deadlineAt;
    private String createdBy;
    private Date createdAt;
    private Date lastModifiedAt;
    private int signatureLevels;
    private int arrangement_enabled;

    public int getPplWorkflowId() {
        return pplWorkflowId;
    }

    public void setPplWorkflowId(int pplWorkflowId) {
        this.pplWorkflowId = pplWorkflowId;
    }

    public int getFirstPplFileSignedId() {
        return firstPplFileSignedId;
    }

    public void setFirstPplFileSignedId(int firstPplFileSignedId) {
        this.firstPplFileSignedId = firstPplFileSignedId;
    }

    public int getLastPplFileSignedId() {
        return lastPplFileSignedId;
    }

    public void setLastPplFileSignedId(int lastPplFileSignedId) {
        this.lastPplFileSignedId = lastPplFileSignedId;
    }

    public String getLastPplFileName() {
        return lastPplFileName;
    }

    public void setLastPplFileName(String lastPplFileName) {
        this.lastPplFileName = lastPplFileName;
    }

    public String getLastPplFileUuid() {
        return lastPplFileUuid;
    }

    public void setLastPplFileUuid(String lastPplFileUuid) {
        this.lastPplFileUuid = lastPplFileUuid;
    }

    public int getFileSize() {
        return fileSize;
    }

    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getUploadToken() {
        return uploadToken;
    }

    public void setUploadToken(String uploadToken) {
        this.uploadToken = uploadToken;
    }

    public int getDocumentId() {
        return documentId;
    }

    public void setDocumentId(int documentId) {
        this.documentId = documentId;
    }

    public String getWorkflowDocumentName() {
        return workflowDocumentName;
    }

    public void setWorkflowDocumentName(String workflowDocumentName) {
        this.workflowDocumentName = workflowDocumentName;
    }

    public String getWorkflowDocumentFormat() {
        return workflowDocumentFormat;
    }

    public void setWorkflowDocumentFormat(String workflowDocumentFormat) {
        this.workflowDocumentFormat = workflowDocumentFormat;
    }

    public int getEnterpriseId() {
        return enterpriseId;
    }

    public void setEnterpriseId(int enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    public String getDeadlineAt() {
        return deadlineAt;
    }

    public void setDeadlineAt(String deadlineAt) {
        this.deadlineAt = deadlineAt;
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
