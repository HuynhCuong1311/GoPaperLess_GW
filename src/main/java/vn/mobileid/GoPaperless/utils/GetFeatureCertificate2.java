/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PublicKey;
import java.security.SignatureException;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import javax.xml.bind.DatatypeConverter;
import org.bouncycastle.asn1.ASN1InputStream;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.ASN1OctetString;
import org.bouncycastle.asn1.ASN1Sequence;
import org.bouncycastle.asn1.DERIA5String;
import org.bouncycastle.asn1.DEROctetString;
import org.bouncycastle.asn1.DERTaggedObject;
import org.bouncycastle.asn1.x509.AccessDescription;
import org.bouncycastle.asn1.x509.AuthorityInformationAccess;
import org.bouncycastle.asn1.x509.AuthorityKeyIdentifier;
import org.bouncycastle.asn1.x509.CRLDistPoint;
import org.bouncycastle.asn1.x509.CertificatePolicies;
import org.bouncycastle.asn1.x509.DistributionPoint;
import org.bouncycastle.asn1.x509.DistributionPointName;
import org.bouncycastle.asn1.x509.GeneralName;
import org.bouncycastle.asn1.x509.GeneralNames;
import org.bouncycastle.asn1.x509.PolicyInformation;
import org.bouncycastle.asn1.x509.X509Extension;
import org.bouncycastle.asn1.x509.X509ObjectIdentifiers;
import org.bouncycastle.util.encoders.Hex;
import sun.security.util.DerInputStream;

/**
 *
 * @author USER
 */
public class GetFeatureCertificate2 {

    private static final String CRL_DISTRIBUTION_POINTS_OID = "2.5.29.31";
    private static final String AUTHORITY_KEY_IDENTIFIER_OID = "2.5.29.35";
    private static final String CERTIFICATE_POLICY_OID = "2.5.29.32";

    public static String getCertificatePolicyId(X509Certificate cert, int certificatePolicyPos, int policyIdentifierPos)
            throws IOException {
        byte[] extPolicyBytes = cert.getExtensionValue(CERTIFICATE_POLICY_OID);
        if (extPolicyBytes == null) {
            return null;
        }

        DEROctetString oct = (DEROctetString) (new ASN1InputStream(new ByteArrayInputStream(extPolicyBytes)).readObject());
        ASN1Sequence seq = (ASN1Sequence) new ASN1InputStream(new ByteArrayInputStream(oct.getOctets())).readObject();

        if (seq.size() <= (certificatePolicyPos)) {
            return null;
        }

        CertificatePolicies certificatePolicies = new CertificatePolicies(PolicyInformation.getInstance(seq.getObjectAt(certificatePolicyPos)));
        if (certificatePolicies.getPolicyInformation().length <= policyIdentifierPos) {
            return null;
        }

        PolicyInformation[] policyInformation = certificatePolicies.getPolicyInformation();
        return policyInformation[policyIdentifierPos].getPolicyIdentifier().getId();
    }

    public static String getSubjectType(X509Certificate cert) {
        int pathLen = cert.getBasicConstraints();
        if (pathLen == -1) {
            if (cert.getKeyUsage()[5] || cert.getKeyUsage()[6]) { //simple check, there my be needed more key usage and extended key usage verification
                return "Subject Type=Service";
            } else {
                return "Subject Type=EndEntity";
            }
        } else {
            try {
                cert.verify(cert.getPublicKey());
                return "RootCA";
            } catch (SignatureException | InvalidKeyException e) {
                return "SubCA";
            } catch (NoSuchAlgorithmException | NoSuchProviderException | CertificateException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static String getSubjectKeyID(X509Certificate xcert)
            throws IOException {
        byte[] extVal = xcert.getExtensionValue("2.5.29.14");
        DerInputStream in = new DerInputStream(extVal);
        byte[] certSubjectKeyID = in.getOctetString();
        return new String(Hex.encode(certSubjectKeyID));
    }

    public static String getAuthorityKeyIdentifier(X509Certificate cert) {
        //NOPMD
        byte[] extensionValue = cert.getExtensionValue(AUTHORITY_KEY_IDENTIFIER_OID);
        if (extensionValue != null) {
            byte[] octets = ASN1OctetString.getInstance(extensionValue).getOctets();
            AuthorityKeyIdentifier authorityKeyIdentifier = AuthorityKeyIdentifier.getInstance(octets);
            return new String(Hex.encode(authorityKeyIdentifier.getKeyIdentifier()));
        }
        return null;
    }
    
    public static String getAccessLocation(X509Certificate certificate) throws IOException {

        final ASN1ObjectIdentifier ocspAccessMethod = X509ObjectIdentifiers.ocspAccessMethod;
        final byte[] authInfoAccessExtensionValue = certificate.getExtensionValue(X509Extension.authorityInfoAccess.getId());
        if (null == authInfoAccessExtensionValue) {

            return null;
        }
        ASN1InputStream ais1 = null;
        ASN1InputStream ais2 = null;
        try {

            final ByteArrayInputStream bais = new ByteArrayInputStream(authInfoAccessExtensionValue);
            ais1 = new ASN1InputStream(bais);
            final DEROctetString oct = (DEROctetString) (ais1.readObject());
            ais2 = new ASN1InputStream(oct.getOctets());
            final AuthorityInformationAccess authorityInformationAccess = AuthorityInformationAccess.getInstance(ais2.readObject());

            final AccessDescription[] accessDescriptions = authorityInformationAccess.getAccessDescriptions();
            for (AccessDescription accessDescription : accessDescriptions) {

                final boolean correctAccessMethod = accessDescription.getAccessMethod().equals(ocspAccessMethod);
                if (!correctAccessMethod) {

                    continue;
                }
                ASN1ObjectIdentifier sss = accessDescription.getAccessMethod();
//                System.out.println("b: "+sss.toString());
                final GeneralName gn = accessDescription.getAccessLocation();
                if (gn.getTagNo() != GeneralName.uniformResourceIdentifier) {
                    //Not a uniform resource identifier
                    continue;
                }
                final DERIA5String str = (DERIA5String) ((DERTaggedObject) gn.toASN1Primitive()).getObject();
                final String accessLocation = str.getString();

                return accessLocation;
            }
            return null;

        } finally {
            ais1.close();
            ais2.close();
        }
    }

    public static String getAuthorityInformationAccess(X509Certificate cert) {
        //NOPMD
        byte[] extensionValue = cert.getExtensionValue("1.3.6.1.5.5.7.1.1");
        if (extensionValue != null) {
            byte[] octets = ASN1OctetString.getInstance(extensionValue).getOctets();
            AuthorityKeyIdentifier authorityKeyIdentifier = AuthorityKeyIdentifier.getInstance(octets);
            return new String(Hex.encode(authorityKeyIdentifier.getKeyIdentifier()));
        }
        return null;
    }

    public static String getThumprintCert(X509Certificate cert, String sThumbprintAlgorithm)
            throws NoSuchAlgorithmException, CertificateEncodingException {
        MessageDigest md = MessageDigest.getInstance(sThumbprintAlgorithm);
        md.update(cert.getEncoded());
        byte[] hash = md.digest();
        return DatatypeConverter.printHexBinary(hash);
    }

    public static List<String> getCRLDistributionPoints(X509Certificate cert) throws IOException {
        byte[] data = cert.getExtensionValue(CRL_DISTRIBUTION_POINTS_OID);
        if (data == null) {
            return Collections.emptyList();
        }
        List<String> distributionPointUrls = new LinkedList<>();
        DEROctetString octetString;
        try (ASN1InputStream crldpExtensionInputStream = new ASN1InputStream(new ByteArrayInputStream(data))) {
            octetString = (DEROctetString) crldpExtensionInputStream.readObject();
        }
        byte[] octets = octetString.getOctets();
        CRLDistPoint crlDP;
        try (ASN1InputStream crldpInputStream = new ASN1InputStream(new ByteArrayInputStream(octets))) {
            crlDP = CRLDistPoint.getInstance(crldpInputStream.readObject());
        }
        for (DistributionPoint dp : crlDP.getDistributionPoints()) {
            DistributionPointName dpn = dp.getDistributionPoint();
            if (dpn != null && dpn.getType() == DistributionPointName.FULL_NAME) {
                GeneralName[] names = GeneralNames.getInstance(dpn.getName()).getNames();
                for (GeneralName gn : names) {
                    if (gn.getTagNo() == GeneralName.uniformResourceIdentifier) {
                        String url = DERIA5String.getInstance(gn.getName()).getString();
                        distributionPointUrls.add(url);
                    }
                }
            }
        }
        return distributionPointUrls;
    }

//    public static void parserCertificateComponent(String certstr, String[] sComponent)
//        throws CertificateException, IOException, NoSuchAlgorithmException, Exception {
//        Config confWs = new Config();
//        if (certstr.toUpperCase().contains(Definitions.CONFIG_WORKER_TAG_CERTIFICATE_BEGIN_CONTAINS)) {
//            certstr = certstr.replace(Definitions.CONFIG_WORKER_TAG_CERTIFICATE_BEGIN, "");
//        }
//        if (certstr.toUpperCase().contains(Definitions.CONFIG_WORKER_TAG_CERTIFICATE_END_CONTAINS)) {
//            certstr = certstr.replace(Definitions.CONFIG_WORKER_TAG_CERTIFICATE_END, "");
//        }
//        CertificateFactory certFactory1 = CertificateFactory.getInstance("X.509");
//        InputStream in = new ByteArrayInputStream(DatatypeConverter.parseBase64Binary(certstr));
//        X509Certificate cert = (X509Certificate) certFactory1.generateCertificate(in);
//        if (cert != null) {
//            PublicKey publicKey = cert.getPublicKey();
//            sComponent[0] = "0";
//            sComponent[1] = "V" + cert.getVersion();
//            sComponent[2] = cert.getSigAlgName();
//            sComponent[3] = publicKey.getAlgorithm();
//            sComponent[4] = GetFeatureCertificate2.getAccessLocation(cert);
//            sComponent[5] = GenFeatureCertificate.getKeyUsage(certstr);
//            sComponent[6] = cert.getExtendedKeyUsage() == null ? "" : cert.getExtendedKeyUsage().toString();
//            sComponent[7] = GetFeatureCertificate2.getSubjectKeyID(cert);
//            sComponent[8] = GetFeatureCertificate2.getAuthorityKeyIdentifier(cert);
//            sComponent[9] = GetFeatureCertificate2.getCertificatePolicyId(cert, 0, 0);
//            List<String> sCRL = getCRLDistributionPoints(cert);
//            sComponent[10] = sCRL.toString();
//            sComponent[11] = GetFeatureCertificate2.getSubjectType(cert);
//            sComponent[12] = cert.getSubjectAlternativeNames() == null ? "" : cert.getSubjectAlternativeNames().toString();
//            String thumbprintAlgorithm = confWs.GetPropertybyCode(Definitions.CONFIG_REPORT_NEAC_THUMBPRINT_ALGORITHM_API);
//            sComponent[13] = thumbprintAlgorithm;
//            sComponent[14] = GetFeatureCertificate2.getThumprintCert(cert, thumbprintAlgorithm);
//            sComponent[15] = DatatypeConverter.printHexBinary(publicKey.getEncoded());
//        } else {
//            sComponent[0] = "1";
//        }
//    }
}
