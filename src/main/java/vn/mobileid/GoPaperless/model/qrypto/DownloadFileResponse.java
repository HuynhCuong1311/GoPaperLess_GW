/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.model.qrypto;

import lombok.Data;

/**
 *
 * @author 84766
 */

@Data
public class DownloadFileResponse {
    public int status;
    public String message;
    public String response_billCode;
    public String content;

    public DownloadFileResponse() {
    }
    
    

    public DownloadFileResponse(int status, String message, String response_billCode, String content) {
        this.status = status;
        this.message = message;
        this.response_billCode = response_billCode;
        this.content = content;
    }
}
