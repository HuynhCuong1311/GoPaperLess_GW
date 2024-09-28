package vn.mobileid.GoPaperless.service;

import com.google.gson.Gson;
import com.qrypto.decoder.DefaultDecoder;
import com.qrypto.decoder.QryptoDecoder;
import com.qrypto.decoder.json_decoder.JsonDecoder;
import com.qrypto.decoder.model.*;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.bouncycastle.asn1.*;
import org.bouncycastle.asn1.x509.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.model.qrypto.*;
import vn.mobileid.GoPaperless.model.qrypto.Certificate;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.PublicKey;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class QryptoService {
    @Value("${qrypto.url}")
    private String URL_HOST;

    @Value("${qrypto.client.id}")
    private String client_ID;

    @Value("${qrypto.client.secret}")
    private String client_Secret;

    private LoginResponse loginRespnonseDto = new LoginResponse();
    private DownloadFileResponse downloadResponse = new DownloadFileResponse();
    public static final MediaType JSON
            = MediaType.get("application/json; charset=utf-8");
    private FileAttributeGet fileAttributeGet = new FileAttributeGet();
    private Certificate cer = new Certificate();

    //set URL call API
    private final QryptoDecoder qryptoDecoder = new com.qrypto.decoder.DefaultDecoder() {
        @Override
        protected ApiCredential getApiCredential() {
            return new ApiCredential(URL_HOST, client_ID, client_Secret);
        }
    };

    // Helper method to convert bytes to a hexadecimal string
    public static String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            hexString.append(String.format("%02X ", b));
        }
        return hexString.toString();
    }

    // Helper method to get the key usage name based on the index
    public static String getKeyUsageName(int index) {
        String[] keyUsageNames = {
                "Digital Signature",
                "Non-Repudiation",
                "Key Encipherment",
                "Data Encipherment",};

        if (index >= 0 && index < keyUsageNames.length) {
            return keyUsageNames[index];
        } else {
            return "Unknown";
        }
    }

    // Map OIDs to human-readable names
    public static String mapOIDToName(String oid) {
        // Define a mapping from OID to name here
        if ("1.3.6.1.5.5.7.3.2".equals(oid)) {
            return "Client Authentication";
        } else if ("1.3.6.1.5.5.7.3.4".equals(oid)) {
            return "Email Protection";
        } else if ("1.3.6.1.4.1.311.10.3.12".equals(oid)) {
            return "MS Document Signing";
        } else if ("1.2.840.113583.1.1.5".equals(oid)) {
            return "Adobe PDF Signing";
        }
        // Add more mappings as needed

        // If the OID is not recognized, return it as-is
        return oid;
    }

    private static String calculateFingerprint(X509Certificate certificate, String algorithm) throws Exception {
        MessageDigest md = MessageDigest.getInstance(algorithm);
        byte[] der = certificate.getEncoded();
        md.update(der);
        byte[] digest = md.digest();

        StringBuilder fingerprint = new StringBuilder();
        for (byte b : digest) {
            if (fingerprint.length() > 0) {
                fingerprint.append(" ");
            }
            fingerprint.append(String.format("%02X", b));
        }
        return fingerprint.toString();
    }

    public ResponseEntity<String> getAccessToken() throws IOException {
        //throws IOException  giống với try catch
        //must create requestBody
        String loginEndpoint = "/general/auth/login";
        String clientId = client_ID;
        String clientSecret = client_Secret;
        String credentials = clientId + ":" + clientSecret;
        String base64Credentials = java.util.Base64.getEncoder().encodeToString(credentials.getBytes());
//        System.out.println("base64Credentials" + base64Credentials);
        RequestBody requestBody = RequestBody.create(JSON, "");
        Request request = new Request.Builder()
                //                .url("http://192.168.9.236:8282/general/auth/login")
                //                .url("https://qryptoservice.mobile-id.vn/general/auth/login")
                .url(URL_HOST + loginEndpoint)
                .addHeader("Accept", "*/*")
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Basic " + base64Credentials)
                .post(requestBody)
                .build();

        // Thực hiện cuộc gọi API
        OkHttpClient client = new OkHttpClient();

        okhttp3.Response response = client.newCall(request).execute();

        if (response.isSuccessful()) {
            String responseData = response.body().string();
            // convert json to object
            loginRespnonseDto = new Gson().fromJson(responseData, LoginResponse.class);

            return ResponseEntity.ok(responseData);
        } else {
            // Đóng response body trong trường hợp lỗi
            response.close();
            // Xử lý lỗi hoặc trả về giá trị rỗng
            return ResponseEntity.status(response.code()).body("Error occurred");
        }
    }

    //pass qrUrl from frontend into lib QryptoVerificationResult
    private QryptoVerificationResult verifyQrCode(String qrUrl) throws CertificateException, Exception {
        return qryptoDecoder.getQryptoResult(qrUrl, null);
    }

    //get CTS from X05
    private Map<String, String> CertificateInfo(QryptoInfo qryptoInfo) throws CertificateException, Exception {
        // Decode Base64 encoded certificate key
        assert qryptoInfo.getRelyingParty() != null;
        byte[] decoded = Base64.getDecoder().decode(qryptoInfo.getRelyingParty().getKey());
        InputStream inputStream = new ByteArrayInputStream(decoded);

        // Generate X.509 certificate from decoded byte array
        X509Certificate certificate = (X509Certificate) CertificateFactory.getInstance("X.509").generateCertificate(inputStream);

        // Retrieve certificate information
        Map<String, String> certificateInfo = new HashMap<>();
        certificateInfo.put("issuer", certificate.getIssuerDN().toString());
        certificateInfo.put("subject", certificate.getSubjectDN().toString());

        //convert to day/month/year
        String dateStringBefore = certificate.getNotBefore().toString();
        // Định dạng ngày giờ từ chuỗi đầu vào
        SimpleDateFormat inputDateFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss 'ICT' yyyy");
        Date date = inputDateFormat.parse(dateStringBefore);
        // Định dạng lại ngày giờ thành chuỗi mới
        SimpleDateFormat outputDateFormat = new SimpleDateFormat("dd/MM/yyyy");
        String formattedDateBefore = outputDateFormat.format(date);
        certificateInfo.put("notBefore", formattedDateBefore);
        //----------------------------------------------------//
        String dateStringAfter = certificate.getNotAfter().toString();
        // Định dạng ngày giờ từ chuỗi đầu vào After
        SimpleDateFormat inputDateFormat1 = new SimpleDateFormat("EEE MMM dd HH:mm:ss 'ICT' yyyy");
        Date date1 = inputDateFormat1.parse(dateStringAfter);
        // Định dạng lại ngày giờ thành chuỗi mới
        SimpleDateFormat outputDateFormat1 = new SimpleDateFormat("dd/MM/yyyy");
        String formattedDateAfter = outputDateFormat1.format(date1);
        certificateInfo.put("notAfter", formattedDateAfter);
        //Get the certificate's serial number
        byte[] serialNumberBytes = certificate.getSerialNumber().toByteArray();
        //Convert the serial number to a hexadecimal string
        String hexSerialNumber = bytesToHex(serialNumberBytes);
        certificateInfo.put("serialNumber", hexSerialNumber);
        //covert length algorithm
        certificateInfo.put("algorithm", certificate.getPublicKey().getAlgorithm());
        // Get the public key from the X.509 certificate
        PublicKey publicKey = certificate.getPublicKey();
//        int publicKeySize = publicKey.getEncoded().length;
//        certificateInfo.put("publicKSeySize", Integer.toString(publicKeySize));

        byte[] data = certificate.getPublicKey().getEncoded();
        ASN1Sequence sequence = DERSequence.getInstance(data);
        DERBitString subjectPublicKey = (DERBitString) sequence.getObjectAt(1);
        byte[] subjectPublicKeyBytes = subjectPublicKey.getBytes();
        long size = subjectPublicKeyBytes.length;
        certificateInfo.put("publicKeySize", String.valueOf(size));

        certificateInfo.put("publicKeyContent", bytesToHex((publicKey).getEncoded()));

        // Kiểm tra tính cấp thiết của mở rộng Authority Information Access
        Set<String> critSet = certificate.getCriticalExtensionOIDs();
        boolean isAIAExtensionCritical = (critSet != null && critSet.contains("1.3.6.1.5.5.7.1.1"));
        certificateInfo.put("critical", Boolean.toString(isAIAExtensionCritical));

        //truy cập thông tin quyền chứng nhận (API Public)
        byte[] extensionValue = certificate.getExtensionValue("1.3.6.1.5.5.7.1.1"); // OID for Authority Information Access

        ASN1InputStream asn1InputStream = new ASN1InputStream(extensionValue);
        ASN1Object obj = asn1InputStream.readObject();

        DEROctetString octetString = (DEROctetString) obj;
        byte[] octets = octetString.getOctets();

        ASN1InputStream extensionStream = new ASN1InputStream(octets);
        ASN1Object extensionObj = extensionStream.readObject();

        AuthorityInformationAccess aia = AuthorityInformationAccess.getInstance(extensionObj);

        org.bouncycastle.asn1.x509.AccessDescription[] accessDescriptions = aia.getAccessDescriptions();
        List<Map<String, String>> accessInfoList = new ArrayList<>();
        for (org.bouncycastle.asn1.x509.AccessDescription accessDescription : accessDescriptions) {
            ASN1ObjectIdentifier accessMethod = accessDescription.getAccessMethod();
            String method = null;

            if (accessMethod.equals(X509ObjectIdentifiers.id_ad_caIssuers)) {
                method = "Certificate Authority Issuers";
            } else if (accessMethod.equals(X509ObjectIdentifiers.id_ad_ocsp)) {
                method = "Online Certificate Status Protocol(OCSP)";
            } else {
                method = accessMethod.toString();
            }

            GeneralName accessLocation = accessDescription.getAccessLocation();
//            String uri = accessLocation.toString();
            String uri = null;

            if (accessLocation.getTagNo() == GeneralName.uniformResourceIdentifier) {
                uri = accessLocation.getName().toString();
            }
            // Tạo một Map JSON cho mỗi "Access method" và "URI"
            Map<String, String> accessInfoMap = new HashMap<>();
            accessInfoMap.put("AccessMethod", method);
            accessInfoMap.put("URI", uri);
            // Thêm Map này vào danh sách
            accessInfoList.add(accessInfoMap);
        }
        certificateInfo.put("accessInfo", new Gson().toJson(accessInfoList));

        // Kiểm tra tính cấp thiết của mở rộng Authority Information Access
        Set<String> critSet1 = certificate.getCriticalExtensionOIDs();
        boolean isAIAExtensionCritical1 = (critSet != null && critSet.contains("2.5.29.14"));
        certificateInfo.put("criticalIdentifier", Boolean.toString(isAIAExtensionCritical1));
        // Get the Subject Key Identifier extension
        byte[] subjectKeyIdentifierExtension = certificate.getExtensionValue("2.5.29.14");
        // Remove the OCTET STRING tag (0x04) and length bytes
        byte[] keyIdentifier = Arrays.copyOfRange(subjectKeyIdentifierExtension, 4, subjectKeyIdentifierExtension.length);
        certificateInfo.put("subjectKeyIdentifier", bytesToHex(keyIdentifier));

//        certificateInfo.put("basicContrainst", String.valueOf(((X509CertImpl) certificate).getBasicConstraintsExtension().isCritical()));
        //HẠN CHẾ CƠ BẢN
        boolean isCritical = certificate.getCriticalExtensionOIDs().contains("2.5.29.19");
        certificateInfo.put("basicContrainst", String.valueOf(isCritical));

        // Check if the certificate is a Certificate Authority (CA)
        boolean isCA = certificate.getBasicConstraints() != -1;
        certificateInfo.put("ca", String.valueOf(isCA));

        //Mã định danh khoá quyền
//        certificateInfo.put("criticalAuthorityKeyIdentifier", String.valueOf(((X509CertImpl) certificate).getAuthorityKeyIdentifierExtension().isCritical()));
        boolean isCriticalAuthorityKeyIdentifier = certificate.getCriticalExtensionOIDs().contains("2.5.29.35");
        certificateInfo.put("criticalAuthorityKeyIdentifier", String.valueOf(isCriticalAuthorityKeyIdentifier));
        // Get the Authority Key Identifier extension
        byte[] authorityKeyIdentifierExtension = certificate.getExtensionValue("2.5.29.35");
        // Remove the OCTET STRING tag (0x04) and length bytes
        byte[] keyIdentifier1 = Arrays.copyOfRange(authorityKeyIdentifierExtension, 6, authorityKeyIdentifierExtension.length);
        certificateInfo.put("authorityKeyIdentifier", bytesToHex(keyIdentifier1));
//        certificateInfo.put("criticalCRL", String.valueOf(((X509CertImpl) certificate).getCRLDistributionPointsExtension().isCritical()));
        boolean iscriticalCRL = certificate.getCriticalExtensionOIDs().contains("2.5.29.31");
        certificateInfo.put("criticalCRL", String.valueOf(iscriticalCRL));

        byte[] crldpExt = certificate.getExtensionValue(Extension.cRLDistributionPoints.getId());
        ASN1InputStream oAsnInStream = new ASN1InputStream(new ByteArrayInputStream(crldpExt));
        ASN1Primitive derObjCrlDP = oAsnInStream.readObject();
        DEROctetString dosCrlDP = (DEROctetString) derObjCrlDP;
        byte[] crldpExtOctets = dosCrlDP.getOctets();
        ASN1InputStream oAsnInStream2 = new ASN1InputStream(new ByteArrayInputStream(crldpExtOctets));
        ASN1Primitive derObj2 = oAsnInStream2.readObject();
        CRLDistPoint distPoint = CRLDistPoint.getInstance(derObj2);
        List<String> crlUrls = new ArrayList<>();
        for (org.bouncycastle.asn1.x509.DistributionPoint dp : distPoint.getDistributionPoints()) {
            DistributionPointName dpn = dp.getDistributionPoint();
            // Look for URIs in fullName
            if (dpn != null && dpn.getType() == DistributionPointName.FULL_NAME) {
                // Look for an URI
                for (GeneralName genName : GeneralNames.getInstance(dpn.getName()).getNames()) {
                    if (genName.getTagNo() == GeneralName.uniformResourceIdentifier) {
                        String url = DERIA5String.getInstance(genName.getName()).getString();
                        crlUrls.add(url);
                    }
                }
            }
        }
        certificateInfo.put("crlDistPoint", new Gson().toJson(crlUrls));

        // Get the key usages
        boolean[] keyUsage = certificate.getKeyUsage();
        // Check if the KeyUsage extension is marked as critical
        Set<String> criticalExtensions = certificate.getCriticalExtensionOIDs();
        boolean isCritical1KeyUsag = (criticalExtensions != null && criticalExtensions.contains("2.5.29.15"));
        certificateInfo.put("criticalKeyUsage", Boolean.toString(isCritical1KeyUsag));

        //get Name
        List<String> keyUsageNames = new ArrayList<>();
        if (keyUsage != null) {
            for (int i = 0; i < keyUsage.length; i++) {
                if (keyUsage[i]) {
                    String keyUsageName = getKeyUsageName(i);
                    keyUsageNames.add(keyUsageName);
                }
            }
        } else {
            System.out.println("Key usages not defined in the certificate.");
        }
        String keyUsagesString = String.join(", ", keyUsageNames);
        certificateInfo.put("keyUsages", keyUsagesString);

        //get oid
        List<String> extendedKeyUsages = certificate.getExtendedKeyUsage();
        List<Map<String, String>> extendedKeyUsagesList = new ArrayList<>();
        // Check if the KeyUsage extension is marked as critical
        Set<String> criticalExtensions1 = certificate.getCriticalExtensionOIDs();
        boolean isCritical1KeyUsag1 = (criticalExtensions1 != null && criticalExtensions1.contains("2.5.29.37"));
        certificateInfo.put("criticalKeyUsageExtended", Boolean.toString(isCritical1KeyUsag1));
        // Get the extended key usages
        if (extendedKeyUsages != null && !extendedKeyUsages.isEmpty()) {
            for (String oid : extendedKeyUsages) {
                String name = mapOIDToName(oid);
                Map<String, String> extendedKeyUsage = new HashMap<>();
                extendedKeyUsage.put("oid", oid);
                extendedKeyUsage.put("name", name);
                extendedKeyUsagesList.add(extendedKeyUsage);
            }
        } else {
            System.out.println("No extended key usages found in the certificate.");
        }
        certificateInfo.put("extendedKeyUsages", new Gson().toJson(extendedKeyUsagesList));

        //signature
        certificateInfo.put("algorithmSig", certificate.getSigAlgName());

        byte[] sigAlgParams = certificate.getSigAlgParams();
        String sigAlgParamsStr = (sigAlgParams != null) ? bytesToHex(sigAlgParams) : "N/A";
        certificateInfo.put("Param", sigAlgParamsStr);

        certificateInfo.put("DataSignature", bytesToHex(certificate.getSignature()));

        //get fingerprints
        // Calculate SHA-256 fingerprint
        X509Certificate x509Certificate = (X509Certificate) certificate;
        String sha256Fingerprint = calculateFingerprint(x509Certificate, "SHA-256");
        certificateInfo.put("SHA256", sha256Fingerprint);

        // Calculate SHA-1 fingerprint (not recommended due to vulnerabilities)
        String sha1Fingerprint = calculateFingerprint(x509Certificate, "SHA-1");
        certificateInfo.put("SHA1", sha1Fingerprint);

        //version
        Integer version = certificate.getVersion();
        certificateInfo.put("version", version.toString());

        // Add more certificate information as needed
        return certificateInfo;
    }

//    public String getQryptoInfo(String qrypto) throws Exception {
////        System.out.println("qrypto dong 387: " + qrypto);
//        System.out.println("URL_HOST: " + URL_HOST);
//        System.out.println("client_ID: " + client_ID);
//        System.out.println("client_Secret: " + client_Secret);
//        getAccessToken();
////        System.out.println("getAccess_token done");
//        QryptoVerificationResult result = verifyQrCode(qrypto);
////        QryptoDecoder qryptoDecoder = new DefaultDecoder();
////        QryptoVerificationResult result = qryptoDecoder.getQryptoResult(qrypto, null);
//
//        QryptoInfo qryptoInfo = ((QryptoVerificationResult.Success) result).getQryptoInfo();
//
//        if (result instanceof QryptoVerificationResult.Failure) {
////            return ResponseEntity.badRequest().body("{}");
//            throw new Exception("Qrypto verification failed");
//        }
//
//        //-----------------------------------------------GET CHỨNG THƯ SỐ -----------------------------------------------------------------
//        Map<String, String> certificateInfo = CertificateInfo(qryptoInfo);
//
//        //-----------------------------------------GET LAYOUT --------------------------------------------------------------
//        List<Layout> layouts = JsonDecoder.INSTANCE.decode(qryptoInfo);
////        System.out.println(qryptoInfo);
//
//        List<HashMap<String, LayoutDataWrapper>> layoutMaps = new ArrayList<>();
//        List<String> responseDataListModel4T1P = new ArrayList<>();
////        List<String> responseDataList = new ArrayList<>();
//        List<FileData> responseDataList = new ArrayList<>();
//
//        for (Layout layout : layouts) {
//            System.out.println("layout: " + layout);
//            if (layout instanceof ModelT2) {
//                System.out.println("render t2 layout");
//                String key = ((ModelT2) layout).getKey();
//                String value = ((ModelT2) layout).getValue();
////                layoutMaps.put("ModelT2", layout);
//                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
//                layoutMap.put("ModelT2", new LayoutDataWrapper(layout, null));
//                layoutMaps.add(layoutMap); // Thêm HashMap này vào danh sách
//                // Lấy giá trị "type" từ giá trị của key
//                System.out.println("Key: " + key);
//                System.out.println("Value: " + value);
//                continue;
//            }
//            if (layout instanceof ModelT2WithOption) {
//                System.out.println("render t2 with option layout");
////                layoutMaps.put("ModelT2WithOption", layout);
//                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
//                layoutMap.put("ModelT2WithOption", new LayoutDataWrapper(layout, null));
//                layoutMaps.add(layoutMap); // Thêm HashMap này vào danh sách
//                continue;
//            }
//            if (layout instanceof ModelUrl) {
//                System.out.println("render url layout");
//                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
//                layoutMap.put("ModelUrl", new LayoutDataWrapper(layout, null));
//                layoutMaps.add(layoutMap);
//                continue;
//            }
//            if (layout instanceof Table) {
//                System.out.println("render table layout");
//                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
//                layoutMap.put("Model_1L3_2L1", new LayoutDataWrapper(layout, null));
//                layoutMaps.add(layoutMap);
//                continue;
//            }
//            if (layout instanceof SignerTable) {
//                System.out.println("render signer table layout");
//                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
//                layoutMap.put("SignerTable", new LayoutDataWrapper(layout, null));
//                layoutMaps.add(layoutMap);
//                continue;
//            }
//
//            if (layout instanceof Model4T1P) {
//                System.out.println("render id picture with 4 labels layout");
//                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
////                layoutMap.put("responseDataListModel4T1P", (Layout) responseDataListModel4T1P);
//                layoutMaps.add(layoutMap);
//
//                Model4T1P model4T1P = (Model4T1P) layout; // Ép kiểu về ModelF1
//
//                String imageToken = model4T1P.getImageToken();
//                //Nếu layout là Model4T1P
//                // Thực hiện cuộc gọi API tới URL chứa fileToken
//                String content = null;
//                String apiUrl = URL_HOST + "/verifier/" + imageToken + "/download/base64";
//                try {
//                    OkHttpClient client = new OkHttpClient();
//
//                    // Tạo yêu cầu và thêm header
//                    Request request = new Request.Builder()
//                            .url(apiUrl)
//                            .addHeader("Accept", "*/*")
//                            .addHeader("Content-Type", "application/json")
//                            .addHeader("Authorization", "Bearer " + loginRespnonseDto.getAccess_token()
//                            )
//                            .build();
//
//                    // Thực hiện cuộc gọi API
//                    okhttp3.Response response = client.newCall(request).execute();
//
//                    if (response.isSuccessful()) {
//                        String responseData = response.body().string();
//                        downloadResponse = new Gson().fromJson(responseData, DownloadFileResponse.class
//                        );
//                        // Truy cập thuộc tính content từ downloadResponse
//                        content = downloadResponse.getContent();
//
//                        responseDataListModel4T1P.add(content);
//                    } else {
//                        // Xử lý lỗi hoặc trả về giá trị rỗng
//                        response.close();
////                        return ResponseEntity.status(response.code()).body("Error occurred");
//                        throw new Exception("Error occurred");
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                    // Xử lý ngoại lệ, trả về giá trị rỗng
////                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred");
//                    throw new Exception("Error occurred");
//                }
//                layoutMap.put("Model4T1P", new LayoutDataWrapper(layout, content));
//                continue;
//            }
//            if (layout instanceof ModelF1) {
//                System.out.println("render attachment layout");
//                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
//                layoutMap.put("ModelF1", new LayoutDataWrapper(layout, null));
//                layoutMaps.add(layoutMap);
//
//                // Thực hiện cuộc gọi API nếu layout là ModelF1
//                ModelF1 modelF1 = (ModelF1) layout; // Ép kiểu về ModelF1
//                List<F1> f1List = modelF1.getList();
//
//                for (F1 f1 : f1List) {
//                    String fileToken = f1.getFile_token();
//
//                    // Thực hiện cuộc gọi API tới URL chứa fileToken
//                    String apiUrl = URL_HOST + "/verifier/" + fileToken + "/download/base64";
//                    String apiUrlAttribute = URL_HOST + "/verifier/" + fileToken + "/fileAttributeGet";
//                    try {
//                        OkHttpClient client = new OkHttpClient();
//
//                        // Tạo yêu cầu và thêm header
//                        Request request = new Request.Builder()
//                                .url(apiUrl)
//                                .addHeader("Accept", "*/*")
//                                .addHeader("Content-Type", "application/json")
//                                .addHeader("Authorization", "Bearer " + loginRespnonseDto.getAccess_token())
//                                .build();
//
//                        // Thực hiện cuộc gọi API
//                        okhttp3.Response response = client.newCall(request).execute();
//
//                        try {
//                            if (response.isSuccessful()) {
//                                String responseData = response.body().string();
//                                downloadResponse = new Gson().fromJson(responseData, DownloadFileResponse.class);
//
//                                // Truy cập thuộc tính content từ downloadResponse
//                                String content = downloadResponse.getContent();
//
//                                // Gọi API để lấy tên tệp
//                                Request requestAttribute = new Request.Builder()
//                                        .url(apiUrlAttribute)
//                                        .addHeader("Accept", "*/*")
//                                        .addHeader("Content-Type", "application/json")
//                                        .addHeader("Authorization", "Bearer " + loginRespnonseDto.getAccess_token())
//                                        .build();
//
//                                okhttp3.Response responseAttribute = client.newCall(requestAttribute).execute();
//                                try {
//                                    if (responseAttribute.isSuccessful()) {
//                                        String attributeData = responseAttribute.body().string();
//                                        fileAttributeGet = new Gson().fromJson(attributeData, FileAttributeGet.class);
//                                    }
//
//                                    // Truy cập thuộc tính content từ downloadResponse
//                                    String fileName = fileAttributeGet.getFile_name();
//                                    String fileSize = String.format("%.2f", (double) fileAttributeGet.getFile_size() / 1024);
//
//                                    FileData fileData1 = new FileData(fileName, content, fileSize); // Create a FileData object
//                                    responseDataList.add(fileData1);
//                                } finally {
//                                    responseAttribute.close();
//                                }
//                            } else {
//                                // Xử lý lỗi hoặc trả về giá trị rỗng
////                                return ResponseEntity.status(response.code()).body("Error occurred");
//                                throw new Exception("Error occurred");
//                            }
//                        } finally {
//                            response.close();
//                        }
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                        // Xử lý ngoại lệ, trả về giá trị rỗng
////                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred");
//                        throw new Exception("Error occurred");
//                    }
//                }
//            }
//
//        }
//        GetKidsResponse getkidsresponse = new GetKidsResponse(layoutMaps, qryptoInfo, certificateInfo);
////        System.out.println("getkidsresponseJSON: " + new Gson().toJson(getkidsresponse));
//        // Tạo một đối tượng chứa cả hai giá trị
//        Map<String, Object> responseMap = new HashMap<>();
//        responseMap.put("getkidsresponse", getkidsresponse);
//        responseMap.put("responseDataList", responseDataList);
////        return ResponseEntity.ok(new Gson().toJson(responseMap));
//        return new Gson().toJson(responseMap);
//    }

    public String getQryptoInfo(String qrypto) throws Exception {
        System.out.println("qrypto dong 387: " + qrypto);
        System.out.println("URL_HOST: " + URL_HOST);
        System.out.println("client_ID: " + client_ID);
        System.out.println("client_Secret: " + client_Secret);
        getAccessToken();
        QryptoVerificationResult result = verifyQrCode(qrypto);

        QryptoInfo qryptoInfo = ((QryptoVerificationResult.Success) result).getQryptoInfo();

        if (result instanceof QryptoVerificationResult.Failure) {
//            return ResponseEntity.badRequest().body("{}");
            throw new Exception("Qrypto verification failed");
        }

        //-----------------------------------------------GET CHỨNG THƯ SỐ -----------------------------------------------------------------
        Map<String, String> certificateInfo = CertificateInfo(qryptoInfo);

        //-----------------------------------------GET LAYOUT --------------------------------------------------------------
        List<Layout> layouts = JsonDecoder.INSTANCE.decode(qryptoInfo);

        List<HashMap<String, LayoutDataWrapper>> layoutMaps = new ArrayList<>();
        List<String> responseDataListModel4T1P = new ArrayList<>();
//        List<String> responseDataList = new ArrayList<>();
        List<FileData> responseDataList = new ArrayList<>();

        for (Layout layout : layouts) {
            if (layout instanceof ModelT2) {
                String key = ((ModelT2) layout).getKey();
                String value = ((ModelT2) layout).getValue();
                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
                layoutMap.put("ModelT2", new LayoutDataWrapper(layout, null, null, null));
                layoutMaps.add(layoutMap);
                continue;
            }
            if (layout instanceof ModelT2WithOption) {
//                System.out.println("render t2 with option layout");
//                layoutMaps.put("ModelT2WithOption", layout);
                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
                layoutMap.put("ModelT2WithOption", new LayoutDataWrapper(layout, null, null, null));
                layoutMaps.add(layoutMap); // Thêm HashMap này vào danh sách
                continue;
            }
            if (layout instanceof ModelUrl) {
//                System.out.println("render url layout");
                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
                layoutMap.put("ModelUrl", new LayoutDataWrapper(layout, null, null, null));
                layoutMaps.add(layoutMap);
                continue;
            }
            if (layout instanceof Table) {
//                System.out.println("render table layout");
                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
                layoutMap.put("Model_1L3_2L1", new LayoutDataWrapper(layout, null, null, null));
                layoutMaps.add(layoutMap);
                continue;
            }
            if (layout instanceof SignerTable) {
//                System.out.println("render signer table layout");
                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
                layoutMap.put("SignerTable", new LayoutDataWrapper(layout, null, null, null));
                layoutMaps.add(layoutMap);
                continue;
            }

            if (layout instanceof Model4T1P) {
//                System.out.println("render id picture with 4 labels layout");
                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
//                layoutMap.put("responseDataListModel4T1P", (Layout) responseDataListModel4T1P);
                layoutMaps.add(layoutMap);

                Model4T1P model4T1P = (Model4T1P) layout; // Ép kiểu về ModelF1

                String imageToken = model4T1P.getImageToken();
                //Nếu layout là Model4T1P
                // Thực hiện cuộc gọi API tới URL chứa fileToken
                String content = null;
                String apiUrl = URL_HOST + "/verifier/" + imageToken + "/download/base64";
                try {
                    OkHttpClient client = new OkHttpClient();

                    // Tạo yêu cầu và thêm header
                    Request request = new Request.Builder()
                            .url(apiUrl)
                            .addHeader("Accept", "*/*")
                            .addHeader("Content-Type", "application/json")
                            .addHeader("Authorization", "Bearer " + loginRespnonseDto.getAccess_token()
                            )
                            .build();

                    // Thực hiện cuộc gọi API
                    okhttp3.Response response = client.newCall(request).execute();

                    if (response.isSuccessful()) {
                        String responseData = response.body().string();
                        downloadResponse = new Gson().fromJson(responseData, DownloadFileResponse.class
                        );
                        // Truy cập thuộc tính content từ downloadResponse
                        content = downloadResponse.getContent();

                        responseDataListModel4T1P.add(content);
                    } else {
                        // Xử lý lỗi hoặc trả về giá trị rỗng
                        response.close();
//                        return ResponseEntity.status(response.code()).body("Error occurred");
                        throw new Exception("Error occurred");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    // Xử lý ngoại lệ, trả về giá trị rỗng
//                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred");
                    throw new Exception("Error occurred");
                }
                layoutMap.put("Model4T1P", new LayoutDataWrapper(layout, content, null, null));
                continue;
            }
            if (layout instanceof ModelF1) {
//                System.out.println("render attachment layout");
                HashMap<String, LayoutDataWrapper> layoutMap = new HashMap<>();
                layoutMap.put("ModelF1", new LayoutDataWrapper(layout, null, null, null));
                layoutMaps.add(layoutMap);

                // Thực hiện cuộc gọi API nếu layout là ModelF1
                ModelF1 modelF1 = (ModelF1) layout; // Ép kiểu về ModelF1
                List<F1> f1List = modelF1.getList();
                String content = null;
                String fileName = null;
                String fileSize = null;
                for (F1 f1 : f1List) {
                    String fileToken = f1.getFile_token();

                    // Thực hiện cuộc gọi API tới URL chứa fileToken
                    String apiUrl = URL_HOST + "/verifier/" + fileToken + "/download/base64";
                    String apiUrlAttribute = URL_HOST + "/verifier/" + fileToken + "/fileAttributeGet";
                    try {
                        OkHttpClient client = new OkHttpClient();

                        // Tạo yêu cầu và thêm header
                        Request request = new Request.Builder()
                                .url(apiUrl)
                                .addHeader("Accept", "*/*")
                                .addHeader("Content-Type", "application/json")
                                .addHeader("Authorization", "Bearer " + loginRespnonseDto.getAccess_token())
                                .build();

                        // Thực hiện cuộc gọi API
                        okhttp3.Response response = client.newCall(request).execute();

                        try {
                            if (response.isSuccessful()) {
                                String responseData = response.body().string();
                                downloadResponse = new Gson().fromJson(responseData, DownloadFileResponse.class);

                                // Truy cập thuộc tính content từ downloadResponse
                                content = downloadResponse.getContent();

                                // Gọi API để lấy tên tệp
                                Request requestAttribute = new Request.Builder()
                                        .url(apiUrlAttribute)
                                        .addHeader("Accept", "*/*")
                                        .addHeader("Content-Type", "application/json")
                                        .addHeader("Authorization", "Bearer " + loginRespnonseDto.getAccess_token())
                                        .build();

                                okhttp3.Response responseAttribute = client.newCall(requestAttribute).execute();
                                try {
                                    if (responseAttribute.isSuccessful()) {
                                        String attributeData = responseAttribute.body().string();
                                        fileAttributeGet = new Gson().fromJson(attributeData, FileAttributeGet.class);
                                    }

                                    // Truy cập thuộc tính content từ downloadResponse
                                    fileName = fileAttributeGet.getFile_name();
                                    fileSize = String.format("%.2f", (double) fileAttributeGet.getFile_size() / 1024);

                                    FileData fileData1 = new FileData(fileName, content, fileSize); // Create a FileData object
                                    responseDataList.add(fileData1);
                                } finally {
                                    responseAttribute.close();
                                }
                            } else {
                                throw new Exception("Error occurred");
                            }
                        } finally {
                            response.close();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new Exception("Error occurred");
                    }
                    layoutMap.put("ModelF1", new LayoutDataWrapper(layout, content, fileName, fileSize));
                }
            }

        }
        GetKidsResponse getkidsresponse = new GetKidsResponse(layoutMaps, qryptoInfo, certificateInfo);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("getkidsresponse", getkidsresponse);
        return new Gson().toJson(responseMap);
    }
}
