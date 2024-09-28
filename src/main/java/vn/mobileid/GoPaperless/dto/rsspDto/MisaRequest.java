package vn.mobileid.GoPaperless.dto.rsspDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MisaRequest extends RsspRequest{
    private String userName;
    private String password;
    private String remoteSigningAccessToken;
    private String refreshToken;
}
