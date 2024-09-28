/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package vn.mobileid.GoPaperless.model.participantsModel;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class ParticipantsObject {
    private String firstName;
    private String lastName;
    private int sequenceNumber;
    private String customReason;
    private String signingPurpose;
    private int purpose;
    private String metaInformation;
    private String signerToken;
    private String workflowProcessType;
    private String signingToken;
    
    private MetaInformation metaInformationObj;

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

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
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

    public String getMetaInformation() {
        return metaInformation;
    }

    public void setMetaInformation(String metaInformation) {
        this.metaInformation = metaInformation;
    }

    public String getSignerToken() {
        return signerToken;
    }

    public void setSignerToken(String signerToken) {
        this.signerToken = signerToken;
    }

    public int getPurpose() {
        return purpose;
    }

    public void setPurpose(int purpose) {
        this.purpose = purpose;
    }

    public String getWorkflowProcessType() {
        return workflowProcessType;
    }

    public void setWorkflowProcessType(String workflowProcessType) {
        this.workflowProcessType = workflowProcessType;
    } 

    public String getSigningToken() {
        return signingToken;
    }

    public void setSigningToken(String signingToken) {
        this.signingToken = signingToken;
    }
    
    
}
