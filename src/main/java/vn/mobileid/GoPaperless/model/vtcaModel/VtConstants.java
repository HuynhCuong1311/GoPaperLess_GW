package vn.mobileid.GoPaperless.model.vtcaModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class VtConstants {
    private String clientId;
    private String clientSecret;
    private String profileId;
    private String baseUrl;
    private String accessToken;
    private final String hashAlgo = "2.16.840.1.101.3.4.2.1";
    private final String signAlgo = "1.2.840.113549.1.1.1";
}
