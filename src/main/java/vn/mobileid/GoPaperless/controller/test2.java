package vn.mobileid.GoPaperless.controller;

import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.utils.GenFeatureCertificate;
import vn.mobileid.GoPaperless.utils.GetFeatureCertificate2;

import javax.xml.bind.DatatypeConverter;
import java.math.BigInteger;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.List;

import static vn.mobileid.GoPaperless.utils.GetFeatureCertificate2.getCRLDistributionPoints;

@Service
public class test2 {

    public static void main(String[] args) throws Exception {
        String certs = "MIIE1TCCA72gAwIBAgIQNumfxxfv7H9TQ6cR58hWSjANBgkqhkiG9w0BAQsFADAwMQswCQYDVQQGEwJWTjEQMA4GA1UECgwHVEVTVCBDQTEPMA0GA1UEAwwGRUFTWUNBMB4XDTIzMDcxMjA3MTgzOVoXDTI0MDcxMTA3MTgzOVowgZ4xCzAJBgNVBAYTAlZOMRcwFQYDVQQIDA5I4buTIENow60gTWluaDEZMBcGA1UEAwwQSHXhu7NuaCBDxrDhu51uZzEhMB8GCgmSJomT8ixkAQEMEUNDQ0Q6MDc5MDgzMDExMzE1MSMwIQYJKoZIhvcNAQkBFhRodXluaGN1b25nQGdtYWlsLmNvbTETMBEGA1UEFBMKMDkwMTc5MDc2NzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKvzy0cqIoZwl8+J7VymGM5ixYcxpzqaUk8kxI2wcOQ7/SwNGiov/My77zfGXxun9YsgUFDpqrmTS+RzWwEt1TjxvdISjzOlefe3k0jTknbHW2qJ6vMlorDLJY/w3JZhkV2MDpHbPMq7thVpq/QCpIoYo8F/wE7Vue4T+hkMJ7nndChwA90s/wuIkUOnsGgRGVAOocIxyKa3zuQ4pKsm+Zb5xDFThXKTrm9hTlqEbDNK6NJyzvccUn6KuTCs+fMwksv5aLIgF9G+vaO+Negkpigs19LUJTdStDWc0aBqGqqSlGoo7xV5Dy7aEqe+v4FaRnLXPg04uwv46GtzExChZJMCAwEAAaOCAXowggF2MAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUkpdsPAiDPZ9qtU3jS9rKVkqv1F8wPgYIKwYBBQUHAQEEMjAwMC4GCCsGAQUFBzABhiJodHRwOi8vbW9iaWxlLWlkLnZuL29jc3AvcmVzcG9uZGVyMB8GA1UdEQQYMBaBFGh1eW5oY3VvbmdAZ21haWwuY29tMEUGA1UdIAQ+MDwwOgYLKwYBBAGB7QMBBAEwKzApBggrBgEFBQcCARYdaHR0cHM6Ly9tb2JpbGUtaWQudm4vY3BzLmh0bWwwNAYDVR0lBC0wKwYIKwYBBQUHAwIGCCsGAQUFBwMEBgorBgEEAYI3CgMMBgkqhkiG9y8BAQUwOAYDVR0fBDEwLzAtoCugKYYnaHR0cDovL21vYmlsZS1pZC52bi9jcmwvZ2V0P25hbWU9RUFTWUNBMB0GA1UdDgQWBBQ8MXAEsiObaIBe6MSoUvSgKsv1UzAOBgNVHQ8BAf8EBAMCBPAwDQYJKoZIhvcNAQELBQADggEBAHHdPQ8bv7qK6iDqQOD/rM4112BTDOEoQyYUz0fZifl5cx+/zE6Jp7ZbaYlGOYMgTt+qhCDT5ZYXXknJylh8nmuNeUVRf9WQAm7tcQjj4/eD1qYDVz5mkvOZ51Bwyh1oD8CnZ6MgvRxjf9y1exOGu+zfjgm02YlKGhyiecr/t3UNrUfjB2XwWfNke9XrfKnX0yapXdSeX5O0HHxPrqnGr5AvkYM0VoglbSACvJ3OXHtptTqDaST+AtsIPTue1qHeWUGfgCee6/OwiyDvFwnLxDPcwH1S7t/k4WAQkhqcRCxCLpDJF6EcuktaahYWaV2rITaVZbD/NnROs1z5qKQsKqg=";
        String pemData = "-----BEGIN CERTIFICATE-----\n" + certs + "-----END CERTIFICATE-----";

        // Chuyển đổi chuỗi PEM thành đối tượng X509Certificate
        CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
        X509Certificate cert = (X509Certificate) certFactory.generateCertificate(
                new java.io.ByteArrayInputStream(pemData.getBytes())
        );

        BigInteger bi = new BigInteger(cert.getSerialNumber().toString());
        System.out.println("SN: " + bi.toString(16));
        PublicKey publicKey = cert.getPublicKey();

        // Convert the public key to a byte array
        byte[] publicKeyBytes = publicKey.getEncoded();

// Convert the byte array to a hexadecimal string
//        String publicKeyHex = DatatypeConverter.printHexBinary(publicKeyBytes);

//        sComponent[0] = "0";
        String version = "V" + cert.getVersion();
        String sigAlgName = cert.getSigAlgName();
        String algorithm = publicKey.getAlgorithm();
        String issuerDN = cert.getIssuerDN().toString();
        String validFrom = cert.getNotBefore().toString();
        String validTo = cert.getNotAfter().toString();
        String subjectDN = cert.getSubjectDN().toString();
        String authorityInformationAccess  = GetFeatureCertificate2.getAccessLocation(cert);
        String keyUsage = GenFeatureCertificate.getKeyUsage(pemData        );
        String enhancedKeyUsage = cert.getExtendedKeyUsage() == null ? "" : cert.getExtendedKeyUsage().toString();
        String subjectKeyIdentifier = GetFeatureCertificate2.getSubjectKeyID(cert);
        String authorityKeyIdentifier = GetFeatureCertificate2.getAuthorityKeyIdentifier(cert);
        String certificatePolicies = GetFeatureCertificate2.getCertificatePolicyId(cert, 0, 0);
        List<String> sCRL = getCRLDistributionPoints(cert);
        String crlDistributionPoints = sCRL.toString();
        String basicConstraints = GetFeatureCertificate2.getSubjectType(cert);
        String subjectAlternativeName = cert.getSubjectAlternativeNames() == null ? "" : cert.getSubjectAlternativeNames().toString();
//            String thumbprintAlgorithm = confWs.GetPropertybyCode(Definitions.CONFIG_REPORT_NEAC_THUMBPRINT_ALGORITHM_API);
//        sComponent[13] = "SHA-1";
        String thumbprint = GetFeatureCertificate2.getThumprintCert(cert, "SHA-1");
        String publicKeyHex = javax.xml.bind.DatatypeConverter.printHexBinary(publicKey.getEncoded());

        System.out.println("version: " + version);
        System.out.println("sigAlgName: " + sigAlgName);
        System.out.println("algorithm: " + algorithm);
        System.out.println("issuerDN: " + issuerDN);
        System.out.println("validFrom: " + validFrom);
        System.out.println("validTo: " + validTo);
        System.out.println("subjectDN: " + subjectDN);
        System.out.println("publicKey: " + publicKey);
//        System.out.println("publicKeyHex" + publicKeyHex);
//        System.out.println("publicKeyParam: " + publicKeyParam);
        System.out.println("authorityInformationAccess: " + authorityInformationAccess);
        System.out.println("keyUsage: " + keyUsage);
        System.out.println("enhancedKeyUsage: " + enhancedKeyUsage);
        System.out.println("subjectKeyIdentifier: " + subjectKeyIdentifier);
        System.out.println("authorityKeyIdentifier: " + authorityKeyIdentifier);
        System.out.println("certificatePolicies: " + certificatePolicies);
        System.out.println("crlDistributionPoints: " + crlDistributionPoints);
        System.out.println("basicConstraints: " + basicConstraints);
        System.out.println("subjectAlternativeName: " + subjectAlternativeName);
        System.out.println("thumbprint: " + thumbprint);
        System.out.println("publicKeyHex: " + publicKeyHex);

    }


}
