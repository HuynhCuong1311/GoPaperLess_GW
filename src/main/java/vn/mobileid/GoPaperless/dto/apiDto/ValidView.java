package vn.mobileid.GoPaperless.dto.apiDto;

public class ValidView {
    private ValidDetails details;
    private String lang;
    private ValidOverView overview;
    private String ppl_file_validation_id;

    public ValidDetails getDetails() {
        return details;
    }

    public void setDetails(ValidDetails details) {
        this.details = details;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public ValidOverView getOverview() {
        return overview;
    }

    public void setOverview(ValidOverView overview) {
        this.overview = overview;
    }

    public String getPpl_file_validation_id() {
        return ppl_file_validation_id;
    }

    public void setPpl_file_validation_id(String ppl_file_validation_id) {
        this.ppl_file_validation_id = ppl_file_validation_id;
    }
}
