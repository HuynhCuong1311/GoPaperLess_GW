package vn.mobileid.GoPaperless.model.Electronic.request;

public class FaceAndCreateRequest extends ElectronicBaseRequest {
    private String code;
    private String type;
    private String facialImage;
    private String imageFace;
    private String subject_id;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFacialImage() {
        return facialImage;
    }

    public void setFacialImage(String facialImage) {
        this.facialImage = facialImage;
    }

    public String getImageFace() {
        return imageFace;
    }

    public void setImageFace(String imageFace) {
        this.imageFace = imageFace;
    }

    public String getSubject_id() {
        return subject_id;
    }

    public void setSubject_id(String subject_id) {
        this.subject_id = subject_id;
    }
}
