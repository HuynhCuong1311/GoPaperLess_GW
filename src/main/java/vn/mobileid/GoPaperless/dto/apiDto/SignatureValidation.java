package vn.mobileid.GoPaperless.dto.apiDto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;


@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true, value = {"valid", "archived", "ltv_timestamp", "seal"})
public class SignatureValidation {
    private String indication;
    private String subIndication;
    private String algorithm;
    private String field_name;
    private String id;
    @JsonProperty("is_archived")
    private boolean archived;
    @JsonProperty("is_ltv_timestamp")
    private boolean ltvTimestamp;
    @JsonProperty("is_seal")
    private boolean seal;
    @JsonProperty("is_valid")
    private boolean valid;
    private String value;
    private String signing_purpose;
    private String signing_reason;
    private String signing_time;
    private String type;
    private String valid_to;
    private String format;
    private String grace_period_end_time;
    private String timestamp_time;
    private Scope scope;
    private Metadata metadata;
    private Certificate certificate;
    private List<Message> errors;
    private List<Message> warnings;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class Scope {
        private String name;
        private String value;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class Certificate {
        private String name;
        private Map<String, List<String>> subject;
        private Map<String, List<String>> issuer;
        private String valid_from;
        private String valid_to;
        private String value;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class Metadata {
        private String reason;
        private String contact;
        private String location;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class Message {

        /**
         * Represents the message key
         */
        private String key;

        /**
         * Represents the message text value
         */
        private String value;
    }
}
