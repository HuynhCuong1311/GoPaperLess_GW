package vn.mobileid.GoPaperless.model.fpsModel;

public class NumericModel {
    private Integer default_value;
    private Integer maximum_value;
    private Integer minimum_value;
    private Integer unit_of_change;

    public Integer getDefault_value() {
        return default_value;
    }

    public void setDefault_value(Integer default_value) {
        this.default_value = default_value;
    }

    public Integer getMaximum_value() {
        return maximum_value;
    }

    public void setMaximum_value(Integer maximum_value) {
        this.maximum_value = maximum_value;
    }

    public Integer getMinimum_value() {
        return minimum_value;
    }

    public void setMinimum_value(Integer minimum_value) {
        this.minimum_value = minimum_value;
    }

    public Integer getUnit_of_change() {
        return unit_of_change;
    }

    public void setUnit_of_change(Integer unit_of_change) {
        this.unit_of_change = unit_of_change;
    }
}
