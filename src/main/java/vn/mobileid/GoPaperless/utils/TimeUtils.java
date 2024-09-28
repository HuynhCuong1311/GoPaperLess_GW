package vn.mobileid.GoPaperless.utils;

import java.time.*;
import java.util.Date;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class TimeUtils {
    public static final String iso8601Pattern = "^\\d{4}-\\d{2}-\\d{2}[Tt]\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?([Zz]|([+-]\\d{2}:\\d{2}))?$";
    public static final String ISO_8601 = "yyyy-MM-dd HH:mm:ss"; // 2023-06-17 13:05:52
    public static final String GO_PAPERLESS_VIEW_FORMAT_DATE = "dd/MM/yyyy HH:mm:ss"; // 13/11/2023 13:05:52
    public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(ISO_8601);

    public static ZonedDateTime convertToUTCTime(String inputISO8601) {
        OffsetDateTime utcOffsetDateTime = convertISO8601ToOffsetDateTime(inputISO8601);
        ZonedDateTime utcZonedDateTime = utcOffsetDateTime.atZoneSameInstant(ZoneId.of("UTC"));
        return utcZonedDateTime;
    }

    public static String convertToISO8601(Date date) {
        // Convert Date to Instant
        Instant instant = date.toInstant();

        // Create ZonedDateTime from Instant
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());

        // Format ZonedDateTime to ISO 8601 string
        DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
        String iso8601String = zonedDateTime.format(formatter);

        return iso8601String;
    }

    public static String convertToISO8601(LocalDateTime localDateTime) {
        // Convert LocalDateTime to ZonedDateTime in the system default time zone
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());

        // Format ZonedDateTime to ISO 8601 string
        return zonedDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

    }

    public static ZonedDateTime convertToCurrentTimezone(String inputISO8601) {
        ZoneId timezone = ZoneId.systemDefault();

        OffsetDateTime utcOffsetDateTime = convertISO8601ToOffsetDateTime(inputISO8601);
        ZonedDateTime vietnamZonedDateTime = utcOffsetDateTime.atZoneSameInstant(timezone);
        return vietnamZonedDateTime;
    }

    public static ZonedDateTime getCurrentZonedDateTime() {
        return ZonedDateTime.now(ZoneId.systemDefault());
    }

    public static Timestamp convertISO8601ToTimestamp(String inputISO8601) {
        ZonedDateTime zonedDateTime = convertToCurrentTimezone(inputISO8601);
        Timestamp timestamp = new Timestamp(Date.from(zonedDateTime.toInstant()).getTime());
        return timestamp;
    }

    public static String convertToISO8601(Timestamp timestamp) {
        Instant instant = timestamp.toInstant();
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());
        return zonedDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }

    public static String convertToISO8601(ZonedDateTime zonedDateTime) {
        return zonedDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }

    public static String convertToUTCISO8601(ZonedDateTime zonedDateTime) {
        return zonedDateTime.format(DateTimeFormatter.ISO_INSTANT);
    }

    // Convert ISO 8601 String to OffsetDateTime with timezone
    public static OffsetDateTime convertISO8601ToOffsetDateTime(String iso8601String) {
        return OffsetDateTime.parse(iso8601String, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }

    public static boolean isValidISO8601(String dateStr) {
        try {
            OffsetDateTime.parse(dateStr, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
            return true;
        } catch (DateTimeParseException e) {
            return false;
        }
    }
}
