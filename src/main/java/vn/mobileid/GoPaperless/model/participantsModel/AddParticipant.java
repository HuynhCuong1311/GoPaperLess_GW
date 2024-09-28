/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package vn.mobileid.GoPaperless.model.participantsModel;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class AddParticipant {
    private String signerId;
    private String firstName;
    private String lastName;
    private String email;
    private String position;
    private String purpose;
    private String structural_subdivision;
    private String signingToken;
    private String signerToken;
    private String enterpriseId;
    private String process_type;
    
    private String reason;
//    private String reason;
}
