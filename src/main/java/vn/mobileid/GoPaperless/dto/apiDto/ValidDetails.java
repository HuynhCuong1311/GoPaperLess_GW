package vn.mobileid.GoPaperless.dto.apiDto;

public class ValidDetails {
    private String detailed_validation_report;
    private String diagnostic_data;
    private String validated_document_hash;
    private String validation_report_id;

    public String getDetailed_validation_report() {
        return detailed_validation_report;
    }

    public void setDetailed_validation_report(String detailed_validation_report) {
        this.detailed_validation_report = detailed_validation_report;
    }

    public String getDiagnostic_data() {
        return diagnostic_data;
    }

    public void setDiagnostic_data(String diagnostic_data) {
        this.diagnostic_data = diagnostic_data;
    }

    public String getValidated_document_hash() {
        return validated_document_hash;
    }

    public void setValidated_document_hash(String validated_document_hash) {
        this.validated_document_hash = validated_document_hash;
    }

    public String getValidation_report_id() {
        return validation_report_id;
    }

    public void setValidation_report_id(String validation_report_id) {
        this.validation_report_id = validation_report_id;
    }
}
