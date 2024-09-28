/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.utils;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import javax.xml.bind.DatatypeConverter;

/**
 * @author THANH-PC
 */
public class GenFeatureCertificate {

    public static final HashMap<String, String> keyUsages = new HashMap<>();

    public static final String CONFIG_WORKER_TAG_CERTIFICATE_BEGIN_CONTAINS = "BEGIN CERTIFICATE";
    public static final String CONFIG_WORKER_TAG_CERTIFICATE_BEGIN = "-----BEGIN CERTIFICATE-----";
    public static final String CONFIG_WORKER_TAG_CERTIFICATE_END_CONTAINS = "END CERTIFICATE";
    public static final String CONFIG_WORKER_TAG_CERTIFICATE_END = "-----END CERTIFICATE-----";


    static {
        keyUsages.put("1.3.6.1.5.5.7.3.1", "Server Authentication");
        keyUsages.put("1.3.6.1.5.5.7.3.2", "Client Authentication");
        keyUsages.put("1.3.6.1.5.5.7.3.3", "Code Signing");
        keyUsages.put("1.3.6.1.5.5.7.3.4", "Secure Email");

        keyUsages.put("1.3.6.1.5.5.7.3.8", "Time Stamping");
        keyUsages.put("1.3.6.1.5.5.7.3.9", "OCSP Signing");
    }

    public static String getKeyUsage(List<String> extendedKeyUsage, boolean[] keyUsage) {
        List<String> result = new ArrayList<>();

        if (extendedKeyUsage != null && extendedKeyUsage.size() > 0) {
            for (int i = 0; i < extendedKeyUsage.size(); i++) {
                if (keyUsages.get(extendedKeyUsage.get(i)) != null) {
                    result.add(keyUsages.get(extendedKeyUsage.get(i)));
                }
            }
        }

        if (keyUsage[0]) {
            result.add("Digital Signature");
        }
        if (keyUsage[1]) {
            result.add("Non-Repudiation");
        }
        if (keyUsage[2]) {
            result.add("Key Encipherment");
        }
        if (keyUsage[3]) {
            result.add("Data Encipherment");
        }
        if (keyUsage[4]) {
            result.add("Key Agreement");
        }
        if (keyUsage[5]) {
            result.add("Key CertSign");
        }
        if (keyUsage[6]) {
            result.add("CRL Sign");
        }
        if (keyUsage[7]) {
            result.add("Encipher Only");
        }
        if (keyUsage[8]) {
            result.add("Decipher Only");
        }

        String tmp = "";
        for (int j = 0; j < result.size(); j++) {
            if (j != result.size() - 1) {
                tmp += result.get(j) + ", ";
            } else {
                tmp += result.get(j);
            }
        }
        return tmp;
    }

    public static String getKeyUsage(String sCert) throws Exception {
        if (sCert.toUpperCase().contains(CONFIG_WORKER_TAG_CERTIFICATE_BEGIN_CONTAINS)) {
            sCert = sCert.replace(CONFIG_WORKER_TAG_CERTIFICATE_BEGIN, "");
        }
        if (sCert.toUpperCase().contains(CONFIG_WORKER_TAG_CERTIFICATE_END_CONTAINS)) {
            sCert = sCert.replace(CONFIG_WORKER_TAG_CERTIFICATE_END, "");
        }
        CertificateFactory certFactory1 = CertificateFactory.getInstance("X.509");
        InputStream in = new ByteArrayInputStream(DatatypeConverter.parseBase64Binary(sCert));
        X509Certificate cert = (X509Certificate) certFactory1.generateCertificate(in);
        return GenFeatureCertificate.getKeyUsage(cert.getExtendedKeyUsage(), cert.getKeyUsage());
    }
}
