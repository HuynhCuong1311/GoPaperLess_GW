package vn.mobileid.GoPaperless.model.apiModel;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostbackJson {

    @JsonProperty("action")
    public String action;
    @JsonProperty("status")
    public String status;
    @JsonProperty("token")
    public String token;
    @JsonProperty("file")
    public String file;
    @JsonProperty("signer")
    public String signer;
    @JsonProperty("file_digest")
    public String file_digest;
    @JsonProperty("valid_to")
    public String valid_to;
    @JsonProperty("signer_info")
    public SignerInfoJson signer_info;
}
