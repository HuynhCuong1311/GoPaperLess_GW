package vn.mobileid.GoPaperless.dto.apiDto;

import java.util.List;

public class ApiDtoRequest {
    private String signingToken;
    private String signerToken;
    private String language;
    private List<String> signingOptions;
    private int enterpriseId;
    private int fileId;

    public String getSigningToken() {
        return signingToken;
    }

    public void setSigningToken(String signingToken) {
        this.signingToken = signingToken;
    }

    public String getSignerToken() {
        return signerToken;
    }

    public void setSignerToken(String signerToken) {
        this.signerToken = signerToken;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<String> getSigningOptions() {
        return signingOptions;
    }

    public void setSigningOptions(List<String> signingOptions) {
        this.signingOptions = signingOptions;
    }

    public int getEnterpriseId() {
        return enterpriseId;
    }

    public void setEnterpriseId(int enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    public int getFileId() {
        return fileId;
    }

    public void setFileId(int fileId) {
        this.fileId = fileId;
    }
}
