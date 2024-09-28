/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.model.qrypto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 *
 * @author 84766
 */
@Data // lib init getter and setter in java
public class LoginResponse {
    private int status;
    private String message;
    private String response_billCode;
    private String access_token;
    private long access_token_expired_in;
    private String refresh_token;
    private long refresh_token_expired_in;

    public LoginResponse() {
    }
    
    

    public LoginResponse(int status, String message, String response_billCode, String access_token, long access_token_expired_in, String refresh_token, long refresh_token_expired_in) {
        this.status = status;
        this.message = message;
        this.response_billCode = response_billCode;
        this.access_token = access_token;
        this.access_token_expired_in = access_token_expired_in;
        this.refresh_token = refresh_token;
        this.refresh_token_expired_in = refresh_token_expired_in;
    }

    
}
