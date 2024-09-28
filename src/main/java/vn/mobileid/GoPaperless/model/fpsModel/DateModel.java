package vn.mobileid.GoPaperless.model.fpsModel;

public class DateModel {
    private String date_format;
    private String minimum_date;
    private String maximum_date;
    private String default_date;
    private boolean default_date_enabled;

    public String getDate_format() {
        return date_format;
    }

    public void setDate_format(String date_format) {
        this.date_format = date_format;
    }

    public String getMinimum_date() {
        return minimum_date;
    }

    public void setMinimum_date(String minimum_date) {
        this.minimum_date = minimum_date;
    }

    public String getMaximum_date() {
        return maximum_date;
    }

    public void setMaximum_date(String maximum_date) {
        this.maximum_date = maximum_date;
    }

    public String getDefault_date() {
        return default_date;
    }

    public void setDefault_date(String default_date) {
        this.default_date = default_date;
    }

    public boolean isDefault_date_enabled() {
        return default_date_enabled;
    }

    public void setDefault_date_enabled(boolean default_date_enabled) {
        this.default_date_enabled = default_date_enabled;
    }
}
