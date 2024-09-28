package vn.mobileid.GoPaperless.dto.apiDto;

public class ValidOverView {
    private String status;
    private int status_code;
    private int total_seals;
    private int total_signatures;
    private int total_valid_seal;
    private int total_valid_signatures;
    private String validation_time;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getStatus_code() {
        return status_code;
    }

    public void setStatus_code(int status_code) {
        this.status_code = status_code;
    }

    public int getTotal_seals() {
        return total_seals;
    }

    public void setTotal_seals(int total_seals) {
        this.total_seals = total_seals;
    }

    public int getTotal_signatures() {
        return total_signatures;
    }

    public void setTotal_signatures(int total_signatures) {
        this.total_signatures = total_signatures;
    }

    public int getTotal_valid_seal() {
        return total_valid_seal;
    }

    public void setTotal_valid_seal(int total_valid_seal) {
        this.total_valid_seal = total_valid_seal;
    }

    public int getTotal_valid_signatures() {
        return total_valid_signatures;
    }

    public void setTotal_valid_signatures(int total_valid_signatures) {
        this.total_valid_signatures = total_valid_signatures;
    }

    public String getValidation_time() {
        return validation_time;
    }

    public void setValidation_time(String validation_time) {
        this.validation_time = validation_time;
    }
}
