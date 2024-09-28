/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.model.qrypto;

import com.qrypto.decoder.model.Layout;
import com.qrypto.decoder.model.QryptoInfo;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 *
 * @author 84766
 */
@Data
//create contructor
@AllArgsConstructor
public class GetKidsResponse {
//    private List<Layout> layouts ;
    private List<HashMap<String, LayoutDataWrapper>> LayoutMaps;
    private QryptoInfo qryptoInfo;
    
//    private X509Certificate certificate;
    private Map<String, String> CertificateInfo;
//    public GetKidsResponse(List<Layout> layouts, QryptoInfo qryptoInfo) {
//        this.layouts = layouts;
//        this.qryptoInfo = qryptoInfo;
//    }
    
}
