package vn.mobileid.GoPaperless.dto.elecdto;

import vn.mobileid.GoPaperless.model.Electronic.response.AWSResponse;
public class GetSubjectDto extends AWSResponse {
    private PersonalDto personal_informations;

    public PersonalDto getPersonal_informations() {
        return personal_informations;
    }

    public void setPersonal_informations(PersonalDto personal_informations) {
        this.personal_informations = personal_informations;
    }
}
