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
public class FileAttributeGet {
    public int status;
    public String message;
    public String response_billCode;
    public String file_name;
    public String uuid;
    public int file_size;
    public String file_digest;

    public FileAttributeGet() {
    }
    

    public FileAttributeGet(int status, String message, String response_billCode, String file_name, String uuid, int file_size, String file_digest) {
        this.status = status;
        this.message = message;
        this.response_billCode = response_billCode;
        this.file_name = file_name;
        this.uuid = uuid;
        this.file_size = file_size;
        this.file_digest = file_digest;
    }
    
}


