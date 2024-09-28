package vn.mobileid.GoPaperless.model.misaModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MisaConstants {
    private String xClientid;
    private String xClientKey;
    private String baseUrl;
}
