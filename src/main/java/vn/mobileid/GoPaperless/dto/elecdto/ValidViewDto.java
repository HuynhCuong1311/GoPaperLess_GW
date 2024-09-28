package vn.mobileid.GoPaperless.dto.elecdto;

import java.util.List;

public class ValidViewDto {
    private String lang;
    private OverviewDto overview;
    private List<SignatureDto> signatures;
    private List<SignatureDto> seals;
    private DetailsDto details;
    private FileDto file;

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public OverviewDto getOverview() {
        return overview;
    }

    public void setOverview(OverviewDto overview) {
        this.overview = overview;
    }

    public List<SignatureDto> getSignatures() {
        return signatures;
    }

    public void setSignatures(List<SignatureDto> signatures) {
        this.signatures = signatures;
    }

    public List<SignatureDto> getSeals() {
        return seals;
    }

    public void setSeals(List<SignatureDto> seals) {
        this.seals = seals;
    }

    public DetailsDto getDetails() {
        return details;
    }

    public void setDetails(DetailsDto details) {
        this.details = details;
    }

    public FileDto getFile() {
        return file;
    }

    public void setFile(FileDto file) {
        this.file = file;
    }
}
