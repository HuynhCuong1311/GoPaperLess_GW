/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.model.qrypto;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;
import lombok.Data;

/**
 *
 * @author 84766
 */
@Data
public class Certificate {
   private int version;
   private String subject;
   private String issuer; 
   private BigInteger seri;
   private Date notBefore;
   private Date notAfter;

    public Certificate() {
    }


    public Certificate(int version, String subject, String issuer, BigInteger seri, Date notBefore, Date notAfter) {
        this.version = version;
        this.subject = subject;
        this.issuer = issuer;
        this.seri = seri;
        this.notBefore = notBefore;
        this.notAfter = notAfter;
    }
}
