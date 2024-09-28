package vn.mobileid.GoPaperless.model.apiModel;

import java.sql.Timestamp;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkFlowList {

    private int Id;
    private String WorkFlowType;
    private int WorkFlowStatus;
    private String WorkflowProcessType;
    private int EnterpriseId;
    private int DocumentId;
    private String PostBackUrl;
    private String RedirectUri;
    private String Language;
    private Timestamp DealineAt;
    private Byte HardDealine;
    private Byte RequireQualifiedSignatures;
    private Byte AllowVideoIdentification;
    private Byte AllowDocumentSaving;
    private String Comment;
    private Byte AnnotationPersonalCode;
    private String AnnotationPosition;
    private Byte FlattenPdf;
    private Integer LastPplFileSignerId;
    private String FileUuid;
    private String SigningToken;
    private String WorkFlowDocumentName;
    private String WorkFlowDocumentFormat;
    private int VisibleHeaderFooter;
    private String AllowSigningMethod;
    private String QrToken;
    private Byte SignatureLevels;
    private String CreatedBy;

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getWorkFlowType() {
        return WorkFlowType;
    }

    public void setWorkFlowType(String workFlowType) {
        WorkFlowType = workFlowType;
    }

    public int getWorkFlowStatus() {
        return WorkFlowStatus;
    }

    public void setWorkFlowStatus(int workFlowStatus) {
        WorkFlowStatus = workFlowStatus;
    }

    public int getEnterpriseId() {
        return EnterpriseId;
    }

    public void setEnterpriseId(int enterpriseId) {
        EnterpriseId = enterpriseId;
    }

    public int getDocumentId() {
        return DocumentId;
    }

    public void setDocumentId(int documentId) {
        DocumentId = documentId;
    }

    public String getPostBackUrl() {
        return PostBackUrl;
    }

    public void setPostBackUrl(String postBackUrl) {
        PostBackUrl = postBackUrl;
    }

    public String getRedirectUri() {
        return RedirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        RedirectUri = redirectUri;
    }

    public String getFileUuid() {
        return FileUuid;
    }

    public void setFileUuid(String fileUuid) {
        FileUuid = fileUuid;
    }

    public String getSigningToken() {
        return SigningToken;
    }

    public void setSigningToken(String signingToken) {
        SigningToken = signingToken;
    }

    public String getWorkFlowDocumentName() {
        return WorkFlowDocumentName;
    }

    public void setWorkFlowDocumentName(String workFlowDocumentName) {
        WorkFlowDocumentName = workFlowDocumentName;
    }

    public String getWorkFlowDocumentFormat() {
        return WorkFlowDocumentFormat;
    }

    public void setWorkFlowDocumentFormat(String workFlowDocumentFormat) {
        WorkFlowDocumentFormat = workFlowDocumentFormat;
    }

    public int getVisibleHeaderFooter() {
        return VisibleHeaderFooter;
    }

    public void setVisibleHeaderFooter(int visibleHeaderFooter) {
        VisibleHeaderFooter = visibleHeaderFooter;
    }
}
