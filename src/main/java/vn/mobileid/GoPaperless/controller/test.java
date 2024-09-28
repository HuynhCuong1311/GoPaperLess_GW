package vn.mobileid.GoPaperless.controller;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.util.Date;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Map;

import static vn.mobileid.GoPaperless.utils.TimeUtils.convertToCurrentTimezone;


public class test {
    public static void main(String[] args) throws ParseException {
        String time = "OID.2.5.4.20=84379670541, EMAILADDRESS=nganntt@mobile-id.vn, UID=MST:123456789, UID=HC:E00851967, CN=CTS Cá nhân Ngô Th? Thanh Ngân, T=Tester, O=mobile-id, ST=H? Chí Minh, C=VN";


        System.out.println("kq: " + isSeal(time));

    }

    public static boolean isSeal(String UID) {
        // check UID is empty or null and UID contains CCCD, CMND, HC, BHXH
        return (UID == null || UID.isEmpty()) || (!UID.contains("CCCD:")
                && !UID.contains("CMND:")
                && !UID.contains("HC:")
                && !UID.contains("BHXH:")
                && !UID.contains("PID:")
                && !UID.contains("PPID:"));
    }
}
