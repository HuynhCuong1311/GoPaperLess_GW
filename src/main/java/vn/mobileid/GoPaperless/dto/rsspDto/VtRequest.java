package vn.mobileid.GoPaperless.dto.rsspDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VtRequest extends RsspRequest{
    private String accessToken;
    private String credentialID;
    private String userId;
}
