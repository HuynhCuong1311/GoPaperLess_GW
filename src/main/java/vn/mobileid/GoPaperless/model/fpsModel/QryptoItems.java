package vn.mobileid.GoPaperless.model.fpsModel;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class QryptoItems {
    private String field;
    private Boolean mandatory_enable;
    private String remark;
    private Integer type;
    private Object value;
}
