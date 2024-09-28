/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package vn.mobileid.GoPaperless.model.documentsModel;

import com.fasterxml.jackson.annotation.JsonFormat;
import vn.mobileid.GoPaperless.model.participantsModel.*;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class DocumentsObject {
    private int signatureLevels;
    private String lastModifiedBy;
    private String signingToken;
    private Date deadlineAt;
    
    public int getSignatureLevels() {
        return signatureLevels;
    }

    public void setSignatureLevels(int signatureLevels) {
        this.signatureLevels = signatureLevels;
    }
    
    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getSigningToken() {
        return signingToken;
    }

    public void setSigningToken(String signingToken) {
        this.signingToken = signingToken;
    }
    
    public Date getDeadlineAt() {
        return deadlineAt;
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+7")
    public void setDeadlineAt(Date deadlineAt) {
        if (deadlineAt == null) {
        this.deadlineAt = null;
    } else {
        this.deadlineAt = deadlineAt;
    }
    }
    
}
