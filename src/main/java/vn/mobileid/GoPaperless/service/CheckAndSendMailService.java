package vn.mobileid.GoPaperless.service;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import vn.mobileid.GoPaperless.model.apiModel.MailInfo;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.Difinitions;

import java.util.ArrayList;
import java.util.List;

@Service
public class CheckAndSendMailService {

    private final ProcessDb connect;

    public CheckAndSendMailService(ProcessDb connect) {
        this.connect = connect;
    }

    public int shareToSign(
            String deadline,
            String workFlowType,
            String signingToken,
            String signerName,
            String signerEmail,
            String fileName,
            Participants participants,
            byte[] data) throws Exception {
        String textMailKey = "email_invite_signing";
        String attachMailKey = "email_send_a_copy";
        MailInfo textMailInfo = connect.USP_GW_EMAIL_TEMPLATE_GET(2, textMailKey);
        MailInfo attachMailInfo = connect.USP_GW_EMAIL_TEMPLATE_GET(2, attachMailKey);
        int response = 1;
        Participants signerFirst = participants;
        System.out.println("deadline:" + deadline);

        String url = "https://rssp.mobile-id.vn/downloads/paperless/images/logo_paperless-color.png";
        if (workFlowType.equals("serial")) {
            String participantName = signerFirst.getLastName() + " " + signerFirst.getFirstName();
            String newAttachSubject = attachMailInfo.getSubject().replaceAll("\\[filename]", fileName);
            String newTextContent = textMailInfo.getBody()
                    .replaceAll("@FirstLastNameSigner", signerName)
                    .replaceAll("@FirstLastName", participantName)
                    .replaceAll("@EmailSigner", signerEmail)
                    .replaceAll("@LinkSign",
                            "https://uat-paperless-gw.mobile-id.vn/view/signing/" + signingToken
                                    + "?access_token=" + signerFirst.getSignerToken())
                    .replaceAll("@logoUrl", url)
                    .replaceAll("@FileName", fileName)
                    .replaceAll("@SigningDeadline", deadline)
                    .replaceAll("@Message", "");
            ;
            String newAttachContent = attachMailInfo.getBody()
                    .replaceAll("@FirstLastNameSigner", signerName)
                    .replaceAll("@FirstLastName", participantName)
                    .replaceAll("<@EmailSigner>", "&lt;" + signerEmail + "&gt;");
            if (signerFirst.getSignerType() != 5) {
                // Gửi mail
                try {
                    System.out.println("send mail :" + signerFirst.getEmail());
                    // Gửi mail
                    MailService.sendMail(null, null, signerFirst.getEmail(), newAttachSubject,
                            newTextContent);
                    response = 0;
                } catch (Exception e) {
                    e.printStackTrace(); // In ra stack trace của lỗi
                    // Ném lại ngoại lệ để dừng chương trình
                    throw new RuntimeException(
                            "Error occurred while sending text mail to " + signerFirst.getEmail(), e);
                }
            } else {
                try {
                    System.out.println("send mail :" + signerFirst.getEmail());
                    // Convert content from base64 to byte[]

                    // Gửi attachment
                    MailService.sendMail(fileName, data, signerFirst.getEmail(), newAttachSubject,
                            newAttachContent);
                    response = 0;
                } catch (Exception e) {
                    e.printStackTrace(); // In ra stack trace của lỗi
                    // Ném lại ngoại lệ để dừng chương trình
                    throw new RuntimeException(
                            "Error occurred while sending attachment to " + signerFirst.getEmail(), e);
                }
                // Tiến hành cập nhật trạng thái và thực hiện lại từ đầu
                connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(signerFirst.getSignerToken(),
                        Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_COPY_STATUS_ID_SENT_A_COPY, "", 0);

            }

        } else if (workFlowType.equals("custom")) {
            List<Participants> responseList = connect
                    .USP_GW_PPL_WORKFLOW_GET_FIRST_PARTICIPANT(signingToken);
            if (!responseList.isEmpty()) {
                for (Participants participant : responseList) {
                    System.out.println("token:" + participant.getSignerToken());
                    String participantName = participant.getLastName() + " " + participant.getFirstName();
                    String newAttachSubject = attachMailInfo.getSubject().replaceAll("\\[filename\\]", fileName);
                    String newTextContent = textMailInfo.getBody()
                            .replaceAll("@FirstLastNameSigner", signerName)
                            .replaceAll("@FirstLastName", participantName)
                            .replaceAll("@EmailSigner", signerEmail)
                            .replaceAll("@LinkSign",
                                    "https://uat-paperless-gw.mobile-id.vn/view/signing/" + signingToken
                                            + "?access_token=" + participant.getSignerToken())
                            .replaceAll("@logoUrl", url)
                            .replaceAll("@FileName", fileName)
                            .replaceAll("@SigningDeadline", deadline != null ? deadline : "")
                            .replaceAll("@Message", "");
                    String newAttachContent = attachMailInfo.getBody()
                            .replaceAll("@FirstLastNameSigner", signerName)
                            .replaceAll("@FirstLastName", participantName)
                            .replaceAll("<@EmailSigner>", "&lt;" + signerEmail + "&gt;");
                    if (participant.getSignerType() != 5) {
                        // Gửi mail
                        try {
                            // Gửi mail
                            System.out.println("send mail begin");
                            MailService.sendMail(null, null, participant.getEmail(), newAttachSubject,
                                    newTextContent);
                            System.out.println("send mail success");
                            response = 0;
                        } catch (Exception e) {
                            e.printStackTrace(); // In ra stack trace của lỗi
                            response = 1;
                            // Ném lại ngoại lệ để dừng chương trình
                            throw new RuntimeException(
                                    "Error occurred while sending text mail to " + participant.getEmail(), e);
                        }
                    } else {
                        try {
                            // Convert content from base64 to byte[]

                            // Gửi attachment
                            MailService.sendMail(fileName, data, participant.getEmail(), newAttachSubject,
                                    newAttachContent);
                            response = 0;
                        } catch (Exception e) {
                            e.printStackTrace(); // In ra stack trace của lỗi
                            response = 1;
                            // Ném lại ngoại lệ để dừng chương trình
                            throw new RuntimeException(
                                    "Error occurred while sending attachment to " + participant.getEmail(), e);
                        }
                        System.out.println("copy");
                        // Tiến hành cập nhật trạng thái và thực hiện lại từ đầu
                        connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(participant.getSignerToken(),
                                Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_COPY_STATUS_ID_SENT_A_COPY, "", 0);

                    }
                }
            }
        }else  {
            List<Participants> responseList = new ArrayList<>();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_LIST(responseList, signingToken);
            System.out.println("parallel participant:" + responseList);
            System.out.println("parallel singing:" + signingToken);
            for (Participants participant : responseList) {
                System.out.println("https://uat-paperless-gw.mobile-id.vn/view/signing/" + signingToken
                        + "?access_token=" + participant.getSignerToken() + "," + fileName + signerEmail);
                String participantName = participant.getLastName() + " " + participant.getFirstName();
                String newAttachSubject = attachMailInfo.getSubject().replaceAll("\\[filename]", fileName);

                String newTextContent = textMailInfo.getBody()
                        .replaceAll("@FirstLastNameSigner", signerName)
                        .replaceAll("@FirstLastName", participantName)
                        .replaceAll("@EmailSigner", signerEmail)
                        .replaceAll("@LinkSign",
                                "https://uat-paperless-gw.mobile-id.vn/view/signing/" + signingToken
                                        + "?access_token=" + participant.getSignerToken())
                        .replaceAll("@logoUrl", url)
                        .replaceAll("@FileName", fileName)
                        .replaceAll("@SigningDeadline", deadline)
                        .replaceAll("@Message", "");

                String newAttachContent = attachMailInfo.getBody()
                        .replaceAll("@FirstLastNameSigner", signerName)
                        .replaceAll("@FirstLastName", participantName)
                        .replaceAll("<@EmailSigner>", "&lt;" + signerEmail + "&gt;");
                if (participant.getSignerType() != 5) {
                    // Gửi mail
                    try {
                        System.out.println("send mail :" + participant.getEmail());
                        // Gửi mail
                        MailService.sendMail(null, null, participant.getEmail(), textMailInfo.getSubject().replaceAll("\\[filename]", fileName),
                                newTextContent);
                        response = 0;

                    } catch (Exception e) {
                        e.printStackTrace(); // In ra stack trace của lỗi
                        // Ném lại ngoại lệ để dừng chương trình
                        response = 1;
                        System.out.println("Error occurred while sending text mail to " + participant.getEmail());
                        throw new RuntimeException(
                                "Error occurred while sending text mail to " + participant.getEmail(), e);
                    }
                } else {
                    try {
                        // Convert content from base64 to byte[]
                        System.out.println("send mail :" + participant.getEmail());
                        // Gửi attachment
                        MailService.sendMail(fileName, data, participant.getEmail(), newAttachSubject,
                                newAttachContent);
                        response = 0;
                    } catch (Exception e) {
                        e.printStackTrace(); // In ra stack trace của lỗi
                        // Ném lại ngoại lệ để dừng chương trình
                        response = 1;
                        throw new RuntimeException(
                                "Error occurred while sending attachment to " + participant.getEmail(), e);
                    }
                    // Tiến hành cập nhật trạng thái và thực hiện lại từ đầu
                    connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(participant.getSignerToken(),
                            Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_COPY_STATUS_ID_SENT_A_COPY, "", 0);

                }
            }

        }
        return response;
    }

    public void checkAndSendMail(
            String workFlowType,
            String signerToken,
            String signingToken,
            String signerName,
            String signerEmail,
            String fileName,
            String deadline,
            byte[] data) throws Exception {
        String textMailKey = "email_invite_signing";
        String attachMailKey = "email_send_a_copy";
        MailInfo textMailInfo = connect.USP_GW_EMAIL_TEMPLATE_GET(2, textMailKey);
        MailInfo attachMailInfo = connect.USP_GW_EMAIL_TEMPLATE_GET(2, attachMailKey);
        String newSignerToken = signerToken;
        String url = "https://rssp.mobile-id.vn/downloads/paperless/images/logo_paperless-color.png";
        if (!workFlowType.equals("parallel")) {
            boolean restart = false; // Biến này để kiểm tra xem có cần thực hiện lại từ đầu không
            do {
                List<Participants> responseList = connect
                        .USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET_NEXT_PARTICIPANT(newSignerToken);
                restart = false; // Gán lại giá trị mặc định trước khi lặp lại
                System.out.println("responseList:" + responseList.size());
                if (responseList.size() > 0) {
                    // Duyệt qua list participant và tiến hành gửi mail
                    for (Participants participant : responseList) {
                        System.out.println("token:" + participant.getSignerToken());
                        String participantName = participant.getLastName() + " " + participant.getFirstName();
                        String newAttachSubject = attachMailInfo.getSubject().replaceAll("\\[filename\\]", fileName);
                        String newTextContent = textMailInfo.getBody()
                                .replaceAll("@FirstLastNameSigner", signerName)
                                .replaceAll("@FirstLastName", participantName)
                                .replaceAll("@EmailSigner", signerEmail)
                                .replaceAll("@LinkSign",
                                        "https://uat-paperless-gw.mobile-id.vn/view/signing/" + signingToken
                                                + "?access_token=" + participant.getSignerToken())
                                .replaceAll("@logoUrl", url)
                                .replaceAll("@FileName", fileName)
                                .replaceAll("@SigningDeadline", deadline != null ? deadline : "")
                                .replaceAll("@Message", "");
                        String newAttachContent = attachMailInfo.getBody()
                                .replaceAll("@FirstLastNameSigner", signerName)
                                .replaceAll("@FirstLastName", participantName)
                                .replaceAll("<@EmailSigner>", "&lt;" + signerEmail + "&gt;");
                        if (participant.getSignerType() != 5) {
                            // Gửi mail
                            try {
                                // Gửi mail
                                System.out.println("send mail begin");
                                MailService.sendMail(null, null, participant.getEmail(), newAttachSubject,
                                        newTextContent);
                                System.out.println("send mail success");
                            } catch (Exception e) {
                                e.printStackTrace(); // In ra stack trace của lỗi
                                // Ném lại ngoại lệ để dừng chương trình
                                throw new RuntimeException(
                                        "Error occurred while sending text mail to " + participant.getEmail(), e);
                            }
                        } else {
                            try {
                                // Convert content from base64 to byte[]

                                // Gửi attachment
                                MailService.sendMail(fileName, data, participant.getEmail(), newAttachSubject,
                                        newAttachContent);
                            } catch (Exception e) {
                                e.printStackTrace(); // In ra stack trace của lỗi
                                // Ném lại ngoại lệ để dừng chương trình
                                throw new RuntimeException(
                                        "Error occurred while sending attachment to " + participant.getEmail(), e);
                            }
                            System.out.println("copy");

                            // Tiến hành cập nhật trạng thái và thực hiện lại từ đầu
                            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(participant.getSignerToken(),

                                    Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_COPY_STATUS_ID_SENT_A_COPY, "", 0);
                            newSignerToken = participant.getSignerToken();
                            restart = true; // Đánh dấu để thực hiện lại từ đầu
                        }
                    }
                }
            } while (restart); // Lặp lại nếu cần thực hiện lại từ đầu
        }
    }

    public void updateStatus(
            String workFlowType,
            String signerToken,
            String signingToken,
            String signerName,
            String signerEmail,
            String fileName,
            String deadline,
            byte[] data) throws Exception {
        String newSignerToken = signerToken;
        if (!workFlowType.equals("parallel")) {
            boolean restart = false; // Biến này để kiểm tra xem có cần thực hiện lại từ đầu không
            do {
                List<Participants> responseList = connect
                        .USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET_NEXT_PARTICIPANT(newSignerToken);
                restart = false; // Gán lại giá trị mặc định trước khi lặp lại
                System.out.println("responseList:" + responseList.size());
                if (responseList.size() > 0) {
                    // Duyệt qua list participant và tiến hành gửi mail
                    for (Participants participant : responseList) {
                        System.out.println("token:" + participant.getSignerToken());

                        if (participant.getSignerType() != 5) {
                            // Gửi mail
                            continue;
                        } else {
                            System.out.println("copy");
                            // Tiến hành cập nhật trạng thái và thực hiện lại từ đầu
                            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(participant.getSignerToken(),
                                    Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_COPY_STATUS_ID_SENT_A_COPY, "", 0);
                            newSignerToken = participant.getSignerToken();
                            restart = true; // Đánh dấu để thực hiện lại từ đầu
                        }
                    }
                }
            } while (restart); // Lặp lại nếu cần thực hiện lại từ đầu
        }
    }
}
