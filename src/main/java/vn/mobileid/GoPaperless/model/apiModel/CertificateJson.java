/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.model.apiModel;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 *
 * @author DELL
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CertificateJson {

    @JsonProperty("action")
    public String action;
    @JsonProperty("token")
    public String token;
    @JsonProperty("signer")
    public String signer;
    @JsonProperty("signerToken")
    public String signerToken;
    @JsonProperty("signers")
    public List<Participants> signers;
    @JsonProperty("signer_info")
    public SignerInfoJson signer_info;
    @JsonProperty("signer_info_dto")
    public SignerInfoJson signer_info_dto;
    @JsonProperty("status")
    public String status;
    @JsonProperty("file")
    public String file;
    @JsonProperty("file_digest")
    public String file_digest;
    @JsonProperty("valid_to")
    public String valid_to;
    @JsonProperty("signature_id")
    public String signature_id;
}
