/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.model.Electronic.response;

/**
 * 2021/30/08
 * @author TuoiCM
 */
public class TokenResponse {
    public int status;
    public String message;
    public String dtis_id;
    public String access_token;
    public String token_type;
    public int expires_in;
}
