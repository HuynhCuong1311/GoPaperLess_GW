package vn.mobileid.GoPaperless.model.apiModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BindConfigurationResponse {
private int id;
private String bindConfigurationToken;
private String metadata;
private String hmac;
private String createdBy;
private String createdAt;
private String lastModifiedBy;
private String lastModifiedAt;
}
