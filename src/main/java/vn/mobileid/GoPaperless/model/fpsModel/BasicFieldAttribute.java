package vn.mobileid.GoPaperless.model.fpsModel;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class BasicFieldAttribute {
    
    @SerializedName(value = "fieldName", alternate = {"field_name"})
    private String fieldName;
    private Integer page;
    private String suffix;
    private Integer maxLength;
    private String type;
    private String embedded;
    @SerializedName(value = "processStatus", alternate = {"process_status"})
    private String processStatus;
    private String processOn;
    private String processBy;
    @SerializedName(value = "placeHolder", alternate = {"place_holder"})
    private String placeHolder;
    private CheckboxFrame checkbox_frame;
    private CheckboxFrame uncheckbox_frame;
    private String address;
    private String tooltip;
    private Dimension dimension;
    @SerializedName(value = "visibleEnabled", alternate = {"visible_enabled"})
    private Boolean visibleEnabled;
    private Object required;
    private Boolean read_only;
    private Boolean multiline;
    private Boolean showIcon;
    private Boolean apply_to_all;
    private Boolean replicateAllPages;
    private String renamedAs;
    private String value;
    private String image;
    private List<String> remark;
    private String qrToken;
    private String signingToken;
    private String default_item;
    private String formatType;
    private List<Integer> initial_pages;
    private List<Integer> replicate;
    private AddTextValue font;
    private List<Object> items;
    private List<String> sealRequired;
    private List<String> initialField;
    private DateModel date;
    private NumericModel numeric_stepper;
    private String groupName;
    private String fileName;
//    @SerializedName(value = "checked", alternate = {"checked"})
    private Boolean checked;
    private String text_next_to;
    private Boolean multiple_checked;
    private Integer document_id;
//    @SerializedName(value = "align_option", alternate = {"align_option"})
    private Alignment align_option;
}
