/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.bouncycastle.asn1.x500.AttributeTypeAndValue;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.util.encoders.Hex;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import sun.security.util.DerInputStream;
import vn.mobileid.GoPaperless.model.apiModel.*;
import vn.mobileid.GoPaperless.model.rsspModel.CertResponse;
import vn.mobileid.model.x509.CertificateToken;
import vn.mobileid.model.x509.extension.QcStatements;
import vn.mobileid.spi.DSSUtils;
import vn.mobileid.spi.QcStatementUtils;

import javax.xml.bind.DatatypeConverter;
import java.io.*;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;


/**
 * @author PHY
 */

public class CommonFunction {
    final public static OkHttpClient httpClient = new OkHttpClient();
    final public static String HASH_SHA256 = "SHA-256";
    final public static String HASH_SHA1 = "SHA-1";
    public static final String OID_CN = "2.5.4.3";
    public static final String OID_O = "2.5.4.3";

    final public static String HASH_MD5 = "MD5";
    final public static String HASH_SHA384 = "SHA-384";
    final public static String HASH_SHA512 = "SHA-512";

    final public static String HASH_SHA1_ = "SHA1";
    final public static String HASH_SHA256_ = "SHA256";
    final public static String HASH_SHA384_ = "SHA384";
    final public static String HASH_SHA512_ = "SHA512";

    final public static int HASH_MD5_LEN = 16;
    final public static int HASH_MD5_LEN_PADDED = 34;

    final public static int HASH_SHA1_LEN = 20;
    final public static int HASH_SHA1_LEN_PADDED = 35;

    final public static int HASH_SHA256_LEN = 32;
    final public static int HASH_SHA256_LEN_PADDED = 51;

    final public static int HASH_SHA384_LEN = 48;
    final public static int HASH_SHA384_LEN_PADDED = 67;

    final public static int HASH_SHA512_LEN = 64;
    final public static int HASH_SHA512_LEN_PADDED = 83;

    public static String CheckTextNull(String sValue) {
        if (sValue == null) {
            sValue = "";
        } else {
            if (Difinitions.CONFIG_EXCEPTION_STRING_ERROR_NULL.equals(sValue.trim().toUpperCase())) {
                sValue = "";
            }
        }
        return sValue.trim();
    }

    public static boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty() || value.trim().equalsIgnoreCase("null");
    }

    public static boolean isNotNullOrEmpty(String value) {
        return value != null && !value.trim().isEmpty() && !value.trim().equalsIgnoreCase("null");
    }

    public static String getCommonNameInDN(String dn) {
        X500Name subject = new X500Name(dn);
        RDN[] rdn = subject.getRDNs();
        for (RDN value : rdn) {
            AttributeTypeAndValue[] attributeTypeAndValue = value.getTypesAndValues();
            if (attributeTypeAndValue[0].getType().toString().equals(OID_CN)) {
                return attributeTypeAndValue[0].getValue().toString();
            }
        }
        return "";
    }

    public static String getPKCS1Signature(String data, String relyingPartyKeyStore, String relyingPartyKeyStorePassword) throws Exception {
        KeyStore keystore = KeyStore.getInstance("PKCS12");
        InputStream is = new FileInputStream(relyingPartyKeyStore);
        System.out.println("relyingPartyKeyStorePassword: " + relyingPartyKeyStorePassword);
        keystore.load(is, relyingPartyKeyStorePassword.toCharArray());

        Enumeration<String> e = keystore.aliases();
        PrivateKey key = null;
        String aliasName = "";
        while (e.hasMoreElements()) {
            aliasName = e.nextElement();
            key = (PrivateKey) keystore.getKey(aliasName, relyingPartyKeyStorePassword.toCharArray());
            if (key != null) {
                break;
            }
        }

        Signature sig = Signature.getInstance("SHA1withRSA");
        sig.initSign(key);
        sig.update(data.getBytes());
        return DatatypeConverter.printBase64Binary(sig.sign());
    }

    public static void VoidCertificateComponents(String certstr, Object[] info, String[] time, int[] intRes) {
        try {
            if (certstr.toUpperCase().contains("BEGIN CERTIFICATE")) {
                certstr = certstr.replace("-----BEGIN CERTIFICATE-----", "");
            }
            if (certstr.toUpperCase().contains("END CERTIFICATE")) {
                certstr = certstr.replace("-----END CERTIFICATE-----", "");
            }
            if (certstr.contains("\r")) {
                certstr = certstr.replaceAll("\r", "");
            }
            if (certstr.contains("\n")) {
                certstr = certstr.replaceAll("\n", "");
            }
//            DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            CertificateFactory certFactory1 = CertificateFactory.getInstance("X.509");
//            InputStream in = new ByteArrayInputStream(DatatypeConverter.parseBase64Binary(certstr));
            byte[] certBytes = Base64.getDecoder().decode(certstr);
            InputStream in = new ByteArrayInputStream(certBytes);
            X509Certificate cert = (X509Certificate) certFactory1.generateCertificate(in);
            info[0] = cert.getSubjectDN();
            info[0] = info[0].toString().replace("\\", "");

            info[1] = cert.getIssuerDN();
            info[2] = cert.getSerialNumber().toString(16);
//            time[0] = formatter.format(cert.getNotBefore());
//            time[1] = formatter.format(cert.getNotAfter());
//            time[0] = cert.getNotBefore().toString();
//            time[1] = cert.getNotAfter().toString();
            time[0] = convertToISO8601(cert.getNotBefore());
            time[1] = convertToISO8601(cert.getNotAfter());
            intRes[0] = 0;
        } catch (Exception e) {
            System.out.print("VoidCertificateComponents: " + e.getMessage());
            intRes[0] = 1;
        }
    }

    public static String getCommonnameInDN(String dn) {
        X500Name subject = new X500Name(dn);
        RDN[] rdn = subject.getRDNs();
        for (int j = 0; j < rdn.length; j++) {
            AttributeTypeAndValue[] attributeTypeAndValue = rdn[j].getTypesAndValues();
            if (attributeTypeAndValue[0].getType().toString().equals(OID_O)) {
                return attributeTypeAndValue[0].getValue().toString();
            }
        }
        return "";
    }

    public static String getUID(String dn) {
        X500Name subject = new X500Name(dn);
        RDN[] rdn = subject.getRDNs();
        for (int j = 0; j < rdn.length; j++) {
            AttributeTypeAndValue[] attributeTypeAndValue = rdn[j].getTypesAndValues();

            if (attributeTypeAndValue[0].getType().toString().equals("0.9.2342.19200300.100.1.1")) {
                return attributeTypeAndValue[0].getValue().toString();
            }
        }
        return "";
    }

    public static String getPropertiesFMS() throws Exception {

        String sPropertiesFMS = "";

        List<ConnectorName> connector = LoadParamSystem.getConnectorStart(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME);
        if (connector.size() > 0) {
            for (ConnectorName connectorName : connector) {
                if (connectorName.getConnectorName().equals(Difinitions.CONFIG_CONNECTOR_DMS_MOBILE_ID)) {
                    sPropertiesFMS = connectorName.getIdentifier();
                }
            }
//            for (int m = 0; m < connector.size(); m++) {
//                if (connector.get(m).CONNECTOR_NAME.equals(Difinitions.CONFIG_CONNECTOR_DMS_MOBILE_ID)) {
//                    sPropertiesFMS = connector.get(m).IDENTIFIER;
//                }
//            }
        }
        return sPropertiesFMS;
    }

    public static byte[] base64Decode(String s) {
        return Base64.getMimeDecoder().decode(s);
    }

    public static String convertBase64(String sValue) {
        String sResult = "";
        try {
            sResult = Base64.getEncoder().encodeToString(sValue.getBytes());
        } catch (Exception e) {
            System.out.println("convertBase64: " + e.getMessage());
        }
        return sResult;
    }

    private static int findMaxLen(byte[][] hashes) {
        int max = 0;
        for (byte[] hh : hashes) {
            if (max < hh.length) {
                max = hh.length;
            }
        }
        return max;
    }

    public static byte[][] padding(byte[][] hashes) {
        int max = findMaxLen(hashes);
        byte[][] rsp = new byte[hashes.length][];

        for (int idx = 0; idx < hashes.length; idx++) {
            int len = hashes[idx].length;
            if (len < max) {
                byte[] tmp = new byte[len];
                System.arraycopy(hashes[idx], 0, tmp, 0, len);
                hashes[idx] = new byte[max];
                System.arraycopy(tmp, 0, hashes[idx], 0, len);
                for (int ii = len; ii < max; ii++) {
                    hashes[idx][ii] = (byte) 0xFF;
                }
            }
        }
        return rsp;
    }

    public static String computeVC(List<byte[]> hashesList) throws NoSuchAlgorithmException {

        byte[][] hashes = new byte[hashesList.size()][];
        for (int i = 0; i < hashesList.size(); i++) {
            hashes[i] = hashesList.get(i);
        }
        if (hashes == null || hashes.length == 0) {
            throw new RuntimeException("The input is null or empty");
        }
        //single hash
        byte[] vcData = new byte[hashes[0].length];
        System.arraycopy(hashes[0], 0, vcData, 0, vcData.length);

        if (hashes.length > 1) {
            padding(hashes);

            for (int ii = 1; ii < hashes.length; ii++) {
                if (hashes[ii].length > vcData.length) {
                    byte[] tmp = new byte[hashes[ii].length];
                    System.arraycopy(vcData, 0, tmp, 0, vcData.length);
                    for (int ttt = vcData.length; ttt < hashes[ii].length; ttt++) {
                        tmp[ttt] = (byte) 0xFF;
                    }
                    vcData = new byte[tmp.length];
                    System.arraycopy(tmp, 0, vcData, 0, tmp.length);
                }
                for (int idx = 0; idx < hashes[ii].length; idx++) {
                    vcData[idx] |= hashes[ii][idx];
                }
            }
        }

        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(vcData);
        byte[] vc = md.digest();
        short first = (short) (vc[0] << 8 | vc[1] & 0x00FF);
        short last = (short) (vc[vc.length - 2] << 8 | vc[vc.length - 1] & 0x00FF);
        return String.format("%04X-%04X", first, last);
    }


    public static String getCryptoHash(String input) {
        try {
            String algorithm = HASH_SHA1;
            if (algorithm.compareToIgnoreCase(HASH_MD5) == 0) {
                algorithm = HASH_MD5;
            } else if (algorithm.compareToIgnoreCase(HASH_SHA1) == 0
                    || algorithm.compareToIgnoreCase(HASH_SHA1_) == 0) {
                algorithm = HASH_SHA1;
            } else if (algorithm.compareToIgnoreCase(HASH_SHA256) == 0
                    || algorithm.compareToIgnoreCase(HASH_SHA256_) == 0) {
                algorithm = HASH_SHA256;
            } else if (algorithm.compareToIgnoreCase(HASH_SHA384) == 0
                    || algorithm.compareToIgnoreCase(HASH_SHA384_) == 0) {
                algorithm = HASH_SHA384;
            } else if (algorithm.compareToIgnoreCase(HASH_SHA512) == 0
                    || algorithm.compareToIgnoreCase(HASH_SHA512_) == 0) {
                algorithm = HASH_SHA512;
            } else {
                algorithm = HASH_SHA256;
            }
            // MessageDigest classes Static getInstance method is called with MD5 hashing
            MessageDigest msgDigest = MessageDigest.getInstance(algorithm);

            // digest() method is called to calculate message digest of the input
            // digest() return array of byte.
            byte[] inputDigest = msgDigest.digest(input.getBytes());

            // Convert byte array into signum representation
            // BigInteger class is used, to convert the resultant byte array into its signum
            // representation
            BigInteger inputDigestBigInt = new BigInteger(1, inputDigest);

            // Convert the input digest into hex value
            String hashtext = inputDigestBigInt.toString(16);

            // Add preceding 0's to pad the hashtext to make it 32 bit
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } // Catch block to handle the scenarios when an unsupported message digest
        // algorithm is provided.
        catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static String cleanCertificate(String base64EncodedCertificate) {
        // Step 1: Decode Base64 string

        // Step 2: Remove "\t", "\r", and "\n"
        String cleanedCertificate = new String(base64EncodedCertificate)
                .replaceAll("\t", "")
                .replaceAll("\r", "")
                .replaceAll("\n", "");

        return cleanedCertificate;
    }

    public static String JsonCertificateObject(String sCertificate, String sCode, String signingTime,
                                               String signingOption,
                                               String sAction, String sToken, String sSigner, String sStatus, String sFile, String sFileSigest,
                                               String sSignature_id, String sCountryCode) {
        String sJson = "";
        try {
            Object[] info = new Object[3];
            String[] time = new String[2];
            int[] intRes = new int[1];
            CertificateObject certObj = null;
            SignerInfoJson signerJson = new SignerInfoJson();
            String cert = cleanCertificate(sCertificate);
            VoidCertificateComponents(cert, info, time, intRes);
            if (intRes[0] == 0) {
                certObj = new CertificateObject();
                certObj.subject = info[0].toString();
                certObj.issuer = info[1].toString();
                certObj.valid_from = time[0];
                certObj.valid_to = time[1];
                certObj.value = sCertificate;
            }
            // signerJson.type = sType;
            signerJson.code = sCode;
            signerJson.certificate = certObj;
            signerJson.signing_time = signingTime;
            signerJson.signing_option = signingOption;
            signerJson.country_code = sCountryCode;
            CertificateJson certJson = new CertificateJson();
            certJson.action = sAction;
            certJson.token = sToken;
            certJson.signer = sSigner;
            certJson.signer_info = signerJson;
            certJson.status = sStatus;
            certJson.file = sFile;
            certJson.file_digest = sFileSigest;
            certJson.valid_to = time[1];
            certJson.signature_id = sSignature_id;
            ObjectMapper oMapperParse = new ObjectMapper();
            sJson = oMapperParse.writeValueAsString(certJson);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return sJson;
    }

    public static String PostBackJsonCertificateObject(String url, String sCertificate, String sCode,
                                                       String signingTime, String signingOption,
                                                       String sAction, String sToken, String sSigner, String sStatus, String sFile, String sFileSigest,
                                                       String sSignature_id, String sCountryCode, List<Participants> participants, String signerToken) {
        String sResult = "0";
        try {
            Object[] info = new Object[3];
            String[] time = new String[2];
            int[] intRes = new int[1];
            CertificateObject certObj = null;
            SignerInfoJson signerJson = new SignerInfoJson();
            VoidCertificateComponents(sCertificate, info, time, intRes);
            if (intRes[0] == 0) {
                certObj = new CertificateObject();
                certObj.subject = info[0].toString();
                certObj.issuer = info[1].toString();
                certObj.valid_from = time[0];
                certObj.valid_to = time[1];
                certObj.value = sCertificate;
            }
            // signerJson.type = sType;
            signerJson.code = sCode;
            signerJson.country_code = sCountryCode;
            // signerJson.certificate = certObj;
            signerJson.signing_time = signingTime;
            signerJson.signing_option = signingOption;
            CertificateJson certJson = new CertificateJson();
            certJson.action = sAction;
            certJson.token = sToken;
            certJson.signerToken = signerToken;
            certJson.signer = sSigner;
            certJson.signers = participants;
            certJson.signer_info = signerJson;
            certJson.status = sStatus;
            certJson.file = sFile;
            certJson.file_digest = sFileSigest;
            certJson.valid_to = time[1];
            certJson.signature_id = sSignature_id;
            ObjectMapper oMapperParse = new ObjectMapper();
            String sJson = oMapperParse.writeValueAsString(certJson);
            System.err.println("UrlPostBack: " + url);
            System.err.println("Requet: " + sJson);
            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), sJson);
            Request request = new Request.Builder().url(url).post(requestBody).build();
            Response response = httpClient.newCall(request).execute();
            System.out.println("requestbody PostBackJsonCertificateObject " + response.toString());


            // HttpPost request = new HttpPost(url);
            // StringEntity params = new StringEntity(sJson);
            // request.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
            // request.setEntity(params);
            // HttpResponse response = httpClient.execute(request);
            // System.out.println("requestbody PostBackJsonCertificateObject " + response.toString());
        } catch (IOException e) {
            System.out.println(e.getMessage());
            sResult = e.getMessage();
        }
        return sResult;
    }

    public static String PostBackJsonObject(String url, String sCertificate, String sCode,
                                            String signingOption, String sAction, String sToken,
                                            String sSigner, String sStatus, String sFile, String sCountryCode, String file_digest) {
        String sResult = "0";
        try {
            // SignerInfoJson signerJson = new SignerInfoJson();
            // signerJson.type = sType;
            // signerJson.code = sCode;
            // signerJson.signing_option = signingOption;
            // signerJson.country_code = sCountryCode;
            Object[] info = new Object[3];
            String[] time = new String[2];
            int[] intRes = new int[1];
            CertificateObject certObj = null;
            SignerInfoJson signerJson = new SignerInfoJson();
            VoidCertificateComponents(sCertificate, info, time, intRes);
//            PostbackJson certJson = new PostbackJson();
//            certJson.action = sAction;
//            certJson.token = sToken;
//            certJson.status = sStatus;
//            certJson.file = sFile;
//            certJson.file_digest = file_digest;
//            certJson.valid_to = CommonFunction.CheckTextNull(time[1]);
//            // certJson.signer_info = signerJson;
//            ObjectMapper oMapperParse = new ObjectMapper();
//            String sJson = oMapperParse.writeValueAsString(certJson);
//            System.err.println("UrlPostBack: " + url);
//            System.err.println("Request: " + sJson);
//            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), sJson);
//            Request request = new Request.Builder().url(url).post(requestBody).build();
//            Response response = httpClient.newCall(request).execute();
//            System.out.println("requestbody PostBackJsonCertificateObject " + response.toString());

            RestTemplate restTemplate = new RestTemplate();
            String UrlPostBack = url;
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("action", sAction);
            requestData.put("token", sToken);
            requestData.put("status", sStatus);
            requestData.put("file", sFile);
            requestData.put("file_digest", file_digest);
            requestData.put("valid_to", CommonFunction.CheckTextNull(time[1]));
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData);
            ResponseEntity<String> response = restTemplate.exchange(UrlPostBack, HttpMethod.POST, httpEntity, String.class);
            System.out.println("response: " + response.getBody());

            // HttpPost request = new HttpPost(url);
            // StringEntity params = new StringEntity(sJson);
            // request.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
            // request.setEntity(params);
            // HttpResponse response = httpClient.execute(request);
            // System.out.println("requestbody PostBackJsonObject " + response.toString());
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            sResult = e.getMessage();
        }
        return sResult;
    }

    public static byte[] hashPass(String input) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        return md.digest(input.getBytes(StandardCharsets.UTF_8));
    }

    public static String toHexString(byte[] hash) {
        BigInteger number = new BigInteger(1, hash);
        StringBuilder hexString = new StringBuilder(number.toString(16));
        while (hexString.length() < 64) {
            hexString.insert(0, '0');
        }
        return hexString.toString();
    }

    public static String getQCStatementsIdList(X509Certificate xcert) {
        String sValueQC = "";
        try {
            if (xcert != null) {
                byte[] extVal = xcert.getExtensionValue("1.3.6.1.5.5.7.1.3");
                if (extVal != null) {
                    DerInputStream inSS = new DerInputStream(extVal);
                    byte[] certSubjectKeyID = inSS.getOctetString();
                    sValueQC = new String(Hex.encode(certSubjectKeyID));
                    System.out.println("sValueQC: " + sValueQC);
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        }
        return sValueQC;
    }

    public static String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02X", b));
        }
        return result.toString();
    }

    public static String convertToGetTimeZone(String time) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());

        String zonedDateTimeString = zonedDateTime.toString();
        String[] zonedDateTimeStringArray = zonedDateTimeString.split("\\[");
        //        System.out.println(zonedDateTimeStringWithoutTimeZone);
        return zonedDateTimeStringArray[0];
    }

    public static String convertToGetTimeZoneSmartCert(String time) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss zzz yyyy");
        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
        String zonedDateTimeString = zonedDateTime.toString();
        String[] zonedDateTimeStringArray = zonedDateTimeString.split("\\[");
        //        System.out.println(zonedDateTimeStringWithoutTimeZone);
        return zonedDateTimeStringArray[0];
    }

    public static String convertTimeToUpDb(String time) {

//        String time = "2023-08-28T10:30:48+07:00";
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Date date = inputFormat.parse(time);
            return outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }

    }

    public static String convertTimeSentPostBack(String inputDateString) {
//        OffsetDateTime offsetDateTime = OffsetDateTime.parse(inputDateString, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
//
//        // Convert to the desired time zone (e.g., UTC+0)
//        OffsetDateTime adjustedDateTime = offsetDateTime.withOffsetSameInstant(ZoneOffset.UTC);
//
//        // Format the adjusted OffsetDateTime to the desired output format
//        String outputDateString = adjustedDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S"));

        // Parse the input string
        OffsetDateTime offsetDateTime = OffsetDateTime.parse(inputDateString);

        // Define the desired output format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");

        // Format the OffsetDateTime using the formatter
        String output = offsetDateTime.format(formatter);

        System.out.println("Original Date String: " + inputDateString);
        System.out.println("Formatted Date String: " + output);
        return output;
    }

    public static String convertToISO8601(Date date) {
        // Convert Date to Instant
        Instant instant = date.toInstant();

        // Specify the target timezone (UTC+7)
        ZoneId zoneId = ZoneId.of("Asia/Ho_Chi_Minh");

        // Create ZonedDateTime from Instant
        ZonedDateTime zonedDateTime = instant.atZone(zoneId);

        // Format ZonedDateTime to ISO 8601 string
        DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

        return zonedDateTime.format(formatter);
    }

    public static boolean isSeal(String UID) {
        // check UID is empty or null and UID contains CCCD, CMND, HC, BHXH
        return (UID == null || UID.isEmpty()) || (!UID.contains("CCCD:")
                && !UID.contains("CMND:")
                && !UID.contains("HC:")
                && !UID.contains("BHXH:")
                && !UID.contains("PID:")
                && !UID.contains("PPID:"));
    }
//    public static boolean isSeal(String subjectDn) {
//        // Parse the subjectDn string to extract UIDs
//        Map<String, List<String>> attributes = parseSubjectDn(subjectDn);
//        List<String> UIDs = attributes.get("UID");
//
//        // If there are no UIDs, return true (satisfies the condition by default)
//        if (UIDs == null || UIDs.isEmpty()) {
//            return true;
//        }
//
//        // Check the conditions for each UID
//        for (String UID : UIDs) {
//            System.out.println("UID: " + UID);
//            if (UID == null || UID.isEmpty() ||
//                    (!UID.contains("CCCD") && !UID.contains("CMND") && !UID.contains("HC") &&
//                            !UID.contains("BHXH") && !UID.contains("PID") && !UID.contains("PPID"))) {
//                return true;
//            }
//        }
//
//        // If all UIDs fail the check, return false
//        return false;
//    }
//
//    private static Map<String, List<String>> parseSubjectDn(String subjectDn) {
//        Map<String, List<String>> attributes = new HashMap<>();
//        String[] pairs = subjectDn.split(", (?=[^,]+=)");
//        for (String pair : pairs) {
//            String[] keyValue = pair.split("=", 2);
//            if (keyValue.length == 2) {
//                String key = keyValue[0].trim();
//                String value = keyValue[1].trim();
//                attributes.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
//            }
//        }
//        return attributes;
//    }

    public static boolean checkTimeExpired(String time) {
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
//        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);
//        LocalDateTime now = LocalDateTime.now();
//        return localDateTime.isBefore(now);
        // Định dạng thời gian theo kiểu yyyyMMddHHmmss
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        // Chuyển chuỗi thời gian từ UTC (+0) sang LocalDateTime
        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);

        // Chuyển LocalDateTime sang ZonedDateTime với múi giờ UTC
        ZonedDateTime utcZonedDateTime = localDateTime.atZone(ZoneId.of("UTC"));

        // Lấy thời gian hiện tại trong múi giờ UTC
        ZonedDateTime nowUtc = ZonedDateTime.now(ZoneId.of("UTC"));

        return utcZonedDateTime.isBefore(nowUtc);
    }

    public static String getSubstringAfterSecondUnderscore(String input) {
        int underscoreCount = 0;
        int index = input.length() - 1;
        int firstIndex = 0;

        // Tìm vị trí của dấu "_" thứ hai từ phải sang
        while (index >= 0) {
            if (input.charAt(index) == '_') {
                underscoreCount++;
                if (underscoreCount == 1) {
                    firstIndex = index;
                }
                if (underscoreCount == 2) {
                    break;
                }
            }
            index--;
        }

        // Lấy chuỗi sau dấu "_" thứ hai từ phải sang
        if (index >= 0 && index < input.length() - 1) {
            return input.substring(index + 1, firstIndex);
        } else {
            return ""; // Trả về chuỗi rỗng nếu không tìm thấy dấu "_"
        }
    }

    public static boolean hasQESType(CertificateToken cert) {
        QcStatements qcStatements = QcStatementUtils.getQcStatements(cert);
        return qcStatements != null;
    }

    public static String encodeObjectToBase64(Map<String, Object> obj) {
        try {
            // Chuyển đối tượng thành chuỗi JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonString = objectMapper.writeValueAsString(obj);

            // Mã hóa chuỗi JSON thành base64
            byte[] encodedBytes = Base64.getEncoder().encode(jsonString.getBytes(StandardCharsets.UTF_8));
            return new String(encodedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String handleLoginError(String errorMessage) throws Exception {
        try {
            // Bước 1: Tìm và trích xuất chuỗi JSON từ thông báo lỗi
            int jsonStartIndex = errorMessage.indexOf("[{");
            int jsonEndIndex = errorMessage.lastIndexOf("}]") + 2;

            if (jsonStartIndex != -1 && jsonEndIndex != -1) {
                String jsonString = errorMessage.substring(jsonStartIndex, jsonEndIndex);

                // Bước 2: Parse chuỗi JSON thành đối tượng JsonNode
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(jsonString);

                // Bước 3: Lấy giá trị của userMsg
                String userMsg = "";
                if (jsonNode.get(0).has("userMsg")) {
                    userMsg = jsonNode.get(0).get("userMsg").asText();
                } else if (jsonNode.get(0).has("error_description")) {
                    userMsg = jsonNode.get(0).get("error_description").asText();
                }

                // Bước 4: Throw exception với thông báo userMsg
//                throw new Exception(userMsg);
                return userMsg;
            } else {
//                throw new Exception("Định dạng thông báo lỗi không hợp lệ");
                return "Định dạng thông báo lỗi không hợp lệ";
            }
        } catch (Exception e) {
            // Trường hợp có lỗi trong quá trình xử lý, throw ra thông báo gốc
            throw new Exception(e.getMessage());
        }
    }

    public static CertResponse certificateInfo(String certChain, String authMode, String credentialID) {
        Object[] info1 = new Object[3];
        String[] time = new String[2];
        int[] intRes = new int[1];

        CertResponse certResponse = new CertResponse();

        CommonFunction.VoidCertificateComponents(certChain, info1, time, intRes);
        if (intRes[0] == 0) {
            String subjectDN = info1[0].toString();

            certResponse.setSubjectDN(info1[0].toString());
            System.out.println("subjectDN: " + subjectDN);
            String[] dnComponents = info1[0].toString().split(",");
            for (String component : dnComponents) {
                component = component.trim();
                if (component.startsWith("OID.2.5.4.20=")) {
                    // Lấy giá trị của OID
                    String oid = component.substring(13);
                    certResponse.setPhoneNumber(oid);
                    System.out.println("OID: " + oid);
                } if (component.startsWith("EMAILADDRESS=")) {
                    // Lấy giá trị của emailAddress
                    String email = component.substring(13);
                    certResponse.setEmail(email);
                    System.out.println("Email Address: " + email);
                } if (component.startsWith("C=")) {
                    // Lấy giá trị của emailAddress
                    String country = component.substring(2);
                    certResponse.setCountry(country);
                    System.out.println("Email Address: " + country);
                }
            }
            certResponse.setSubject(CommonFunction.getCommonnameInDN(subjectDN));
            certResponse.setIssuer(CommonFunction.getCommonnameInDN(info1[1].toString()));
            certResponse.setValidFrom(time[0]);
            certResponse.setValidTo(time[1]);
            certResponse.setCert(certChain);
            certResponse.setCredentialID(credentialID);
            certResponse.setSerialNumber(info1[2].toString());
//                                String uid = CommonFunction.getUID(info1[0].toString());
            certResponse.setSeal(CommonFunction.isSeal(subjectDN));
//                        certResponse.setCodeNumber(codeNumber);
            CertificateToken cert = DSSUtils.loadCertificateFromBase64EncodedString(certChain);
            boolean isQes = CommonFunction.hasQESType(cert);
            certResponse.setQes(isQes);
            certResponse.setAuthMode(authMode);

        }
        return certResponse;
    }
}
