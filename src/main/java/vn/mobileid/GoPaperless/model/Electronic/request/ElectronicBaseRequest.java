package vn.mobileid.GoPaperless.model.Electronic.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ElectronicBaseRequest {
    private String lang;
    private String connectorName;
    private int enterpriseId;
    private int workFlowId;
}
