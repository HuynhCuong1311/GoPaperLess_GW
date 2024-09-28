package vn.mobileid.GoPaperless.service;

import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.model.Electronic.request.CheckCertificateRequest;
import vn.mobileid.GoPaperless.model.rsspModel.CertResponse;
import vn.mobileid.GoPaperless.model.rsspModel.CredentialInfo;
import vn.mobileid.GoPaperless.model.rsspModel.CredentialItem;
import vn.mobileid.GoPaperless.model.rsspModel.CredentialList;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.model.x509.CertificateToken;
import vn.mobileid.spi.DSSUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class InternalService {
    private final RsspService rsspService;

    public InternalService(RsspService rsspService) {
        this.rsspService = rsspService;
    }

    public List<CertResponse> getRsspCertificate(CheckCertificateRequest request) throws Exception {
        System.out.println("getRsspCertificate");
        rsspService.getProperty(request);
        rsspService.login();
//        CredentialList credentialList = new CredentialList();
        try {
            CredentialList credentialList = rsspService.credentialsList(request.getLang(), request.getCriteria() + ":" + request.getCode());
            CredentialInfo credentialinFo = null;

            List<CertResponse> listCertificate = new ArrayList<>();
            if (credentialList.getCerts().size() > 0) {
                for (CredentialItem credential : credentialList.getCerts()) {
                    if (credential.getValidTo() == null || credentialList.getCerts().isEmpty() || CommonFunction.checkTimeExpired(credential.getValidTo())) {
                        continue;
                    }
                    String credentialID = credential.getCredentialID();
                    credentialinFo = rsspService.getCredentialinFo(request.getLang(), credentialID);
                    if (credentialinFo != null) {
                        String authMode = credentialinFo.getAuthMode();
                        String status = credentialinFo.getCert().getStatus();
//                    System.out.println("authMode ne: " + authMode);
//                    System.out.println("status ne: " + status);
                        if (("EXPLICIT/OTP-SMS".equals(authMode) || "EXPLICIT/OTP-EMAIL".equals(authMode) || "EXPLICIT/PIN".equals(authMode) || "EXPLICIT/JWT".equals(authMode)) && "OPERATED".equals(status)) {
                            int lastIndex = credentialinFo.getCert().getCertificates().size() - 1;
                            String certChain = credentialinFo.getCert().getCertificates().get(lastIndex);
                            listCertificate.add(CommonFunction.certificateInfo(certChain, authMode, credentialID));
                        }
                    }
                }
            }
            return listCertificate;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }
}
