package vn.mobileid.GoPaperless.model.apiModel;

public class Enterprise {
    private String metadataGatewayView;
    private String logo;
    private String name;
    private String notificationEmail;
    private int id;

    public String getMetadataGatewayView() {
        return metadataGatewayView;
    }

    public void setMetadataGatewayView(String metadataGatewayView) {
        this.metadataGatewayView = metadataGatewayView;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNotificationEmail() {
        return notificationEmail;
    }

    public void setNotificationEmail(String notificationEmail) {
        this.notificationEmail = notificationEmail;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
