package vn.mobileid.GoPaperless.model.apiModel;

public class CountryName {
    private int id;
    private int electronicProviderEnabled;
    private int enabled;
    private String name;
    private String uri;
    private String metadata;
    private String remarkEn;
    private String remark;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getElectronicProviderEnabled() {
        return electronicProviderEnabled;
    }

    public void setElectronicProviderEnabled(int electronicProviderEnabled) {
        this.electronicProviderEnabled = electronicProviderEnabled;
    }

    public int getEnabled() {
        return enabled;
    }

    public void setEnabled(int enabled) {
        this.enabled = enabled;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public String getRemarkEn() {
        return remarkEn;
    }

    public void setRemarkEn(String remarkEn) {
        this.remarkEn = remarkEn;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
