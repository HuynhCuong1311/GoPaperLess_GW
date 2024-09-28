package vn.mobileid.GoPaperless.service;

import com.sun.mail.util.MailSSLSocketFactory;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.GeneralSecurityException;
import java.util.Properties;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;

public class MailService {
    private static final String sslEnable = "true";
    private static final String startTlsEnable = "true";
    private static final String auth = "true";
    private static final String host = "smtppro.zoho.com";
    private static final String port = "465";
    private static final String username = "helpdesk@qrypto.ee";
    private static final String password = "T@mic@8x";
    private static final String from = "helpdesk@qrypto.ee";
    private static final String name = "GoPaperless";

    public static void sendMail(String filename, byte[] data, String sendTo, String subject, String content) throws MessagingException, GeneralSecurityException, IOException {
//        String sendTo = "giatk@mobile-id.vn";
//        String subject = "Test hàm gửi email";
//        String content = "Đây là mail có file đính kèm";

//        byte[] config = IOUtils.toByteArray(new FileInputStream("config.properties"));

        // parsing properties
        final Properties props = new Properties();
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.ssl.enable", sslEnable);
        props.put("mail.smtp.starttls.enable", startTlsEnable);
        props.put("mail.smtp.port", port);
        props.put("mail.smtp.username", username);
        props.put("mail.smtp.password", password);
        props.put("mail.smtp.sendfromaddr", from);
        props.put("mail.smtp.sendfromname", name);

        final String username = props.getProperty("mail.smtp.username");
        final String password = props.getProperty("mail.smtp.password");

        final String sendFromAddr = props.getProperty("mail.smtp.sendfromaddr", username);
        final String sendFromName = props.getProperty("mail.smtp.sendfromname", username);

        MailSSLSocketFactory sf = new MailSSLSocketFactory();
        sf.setTrustAllHosts(true);
        props.put("mail.smtp.ssl.socketFactory", sf);

        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        Session session = null;
        if (username == null || password == null) {
            // Get the Session object.
            session = Session.getInstance(props, null);
        } else {
            // Get the Session object.
            session = Session.getInstance(props,
                    new javax.mail.Authenticator() {
                        protected PasswordAuthentication getPasswordAuthentication() {
                            return new PasswordAuthentication(username,
                                    password);
                        }
                    });
        }

        // Create a default MimeMessage object.
        Message message = new MimeMessage(session);
        // Set From: header field of the header.
        message.setFrom(new InternetAddress(sendFromAddr, sendFromName));

        // Set To: header field of the header.
        message.setRecipients(Message.RecipientType.TO,
                InternetAddress.parse(sendTo));

        // Set Subject: header field
        message.setSubject(subject);

        //Create Body mail
        Multipart multipart = new MimeMultipart();

        //Text in mail
        MimeBodyPart textBodyPart = new MimeBodyPart();
        textBodyPart.setContent(content, "text/html; charset=utf-8");

        if (data != null && data.length > 0) {
            //Create attachment
            MimeBodyPart textBodyPart2 = new MimeBodyPart();
            DataSource source = new ByteArrayDataSource(data, "application/octet-stream");
            textBodyPart2.setDataHandler(new DataHandler(source));
            textBodyPart2.setFileName(filename);
            multipart.addBodyPart(textBodyPart2);
        }


        multipart.addBodyPart(textBodyPart);
        message.setContent(multipart);

        // Send message
        Transport.send(message);
        System.out.println("OK");
    }


}
