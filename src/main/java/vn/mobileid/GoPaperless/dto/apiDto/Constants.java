package vn.mobileid.GoPaperless.dto.apiDto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;

public class Constants {
    public static String JSON_VALUE = "{\n" +
            "    \"algorithm\": \"sha256\",\n" +
            "    \"certificate\": {\n" +
            "        \"issuer\": {\n" +
            "            \"C\": [\n" +
            "                \"VN\"\n" +
            "            ],\n" +
            "            \"CN\": [\n" +
            "                \"Mobile-ID Trusted Network\"\n" +
            "            ],\n" +
            "            \"L\": [\n" +
            "                \"Ho Chi Minh\"\n" +
            "            ],\n" +
            "            \"O\": [\n" +
            "                \"Mobile-ID Technologies and Services Joint Stock Company\"\n" +
            "            ],\n" +
            "            \"OU\": [\n" +
            "                \"Mobile-ID Technical Department\"\n" +
            "            ],\n" +
            "            \"ST\": [\n" +
            "                \"Ho Chi Minh\"\n" +
            "            ]\n" +
            "        },\n" +
            "        \"name\": \"CN=Mobile-ID Trusted Network,OU=Mobile-ID Technical Department,O=Mobile-ID Technologies and Services Joint Stock Company,L=Ho Chi Minh,ST=Ho Chi Minh,C=VN\",\n" +
            "        \"subject\": {\n" +
            "            \"C\": [\n" +
            "                \"VN\"\n" +
            "            ],\n" +
            "            \"CN\": [\n" +
            "                \"MOBILE-ID\"\n" +
            "            ],\n" +
            "            \"O\": [\n" +
            "                \"MOBILE-ID\"\n" +
            "            ],\n" +
            "            \"ST\": [\n" +
            "                \"Hồ Chí Minh\"\n" +
            "            ],\n" +
            "            \"UID\": [\n" +
            "                \"MST:0313994173\"\n" +
            "            ]\n" +
            "        },\n" +
            "        \"valid_from\": \"2023-06-16T11:24:33+07:00\",\n" +
            "        \"valid_to\": \"2025-06-15T11:24:33+07:00\",\n" +
            "        \"value\": \"LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUdRRENDQkNpZ0F3SUJBZ0lNSU1wZFdHdm92S0xNZnZzdU1BMEdDU3FHU0liM0RRRUJDd1VBTUlISU1Rc3cKQ1FZRFZRUUdFd0pXVGpFVU1CSUdBMVVFQ0JNTFNHOGdRMmhwSUUxcGJtZ3hGREFTQmdOVkJBY1RDMGh2SUVObwphU0JOYVc1b01VQXdQZ1lEVlFRS0V6ZE5iMkpwYkdVdFNVUWdWR1ZqYUc1dmJHOW5hV1Z6SUdGdVpDQlRaWEoyCmFXTmxjeUJLYjJsdWRDQlRkRzlqYXlCRGIyMXdZVzU1TVNjd0pRWURWUVFMRXg1TmIySnBiR1V0U1VRZ1ZHVmoKYUc1cFkyRnNJRVJsY0dGeWRHMWxiblF4SWpBZ0JnTlZCQU1UR1UxdlltbHNaUzFKUkNCVWNuVnpkR1ZrSUU1bApkSGR2Y21zd0hoY05Nak13TmpFMk1EUXlORE16V2hjTk1qVXdOakUxTURReU5ETXpXakJ1TVFzd0NRWURWUVFHCkV3SldUakVYTUJVR0ExVUVDQXdPU09HN2t5QkRhTU90SUUxcGJtZ3hFakFRQmdOVkJBb01DVTFQUWtsTVJTMUoKUkRFU01CQUdBMVVFQXd3SlRVOUNTVXhGTFVsRU1SNHdIQVlLQ1pJbWlaUHlMR1FCQVF3T1RWTlVPakF6TVRNNQpPVFF4TnpNd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0SUJEd0F3Z2dFS0FvSUJBUURnZTk3Q3RXOGNKcmFXCkdhd01Qc0NjMjg0M012TXpsNFlwb2wwMzFpSXZoUW1xRzlZRVQyOWg2S0NYVGloRStWNkhjc0x5enR6d2RXdVMKUDFFWXNRUHk1RU9ERThTcWFsQkdRU0VnSUMyanVaRFV6WnNHWDBuNjA0ai9ZQmh5enNVWmloVk1RWUtjT0FSNAo2UUlmOEhRbWg2VDhWc08vUnFkejVsZ0pHUXgwYktnSlZ1MkZxT01CazQrbDJiU3Z5cUFJM2ZEV0podFNsL2pDCmxnRXkvOTdzNXgrM0dZYjdFbUxRblJOTm1ZbHZrS2I4Ky84STRoZXR1MXA0NWlOVlJGeWNHZzJZem9qaGlCUGgKN1UrRFR5UmJlSEowTzV1cmpMNGR3YWIvZWc2SEFNc1lheC8wODNUZzBWNUhnMHRpc2N2Yk51OGwrNzBRV0hEVgpsOUV1OVV0TEFnTUJBQUdqZ2dHQk1JSUJmVEFNQmdOVkhSTUJBZjhFQWpBQU1COEdBMVVkSXdRWU1CYUFGUE5rCk1uMnlQRjNsTHVCSmZMVHFZaFdVZUM2ck1ISUdDQ3NHQVFVRkJ3RUJCR1l3WkRBeUJnZ3JCZ0VGQlFjd0FvWW0KYUhSMGNITTZMeTl0YjJKcGJHVXRhV1F1ZG00dmNHdHBMMjF2WW1sc1pTMXBaQzVqY25Rd0xnWUlLd1lCQlFVSApNQUdHSW1oMGRIQTZMeTl0YjJKcGJHVXRhV1F1ZG00dmIyTnpjQzl5WlhOd2IyNWtaWEl3UlFZRFZSMGdCRDR3ClBEQTZCZ3NyQmdFRUFZSHRBd0VFQVRBck1Da0dDQ3NHQVFVRkJ3SUJGaDFvZEhSd2N6b3ZMMjF2WW1sc1pTMXAKWkM1MmJpOWpjSE11YUhSdGJEQTBCZ05WSFNVRUxUQXJCZ2dyQmdFRkJRY0RBZ1lJS3dZQkJRVUhBd1FHQ2lzRwpBUVFCZ2pjS0F3d0dDU3FHU0liM0x3RUJCVEFzQmdOVkhSOEVKVEFqTUNHZ0g2QWRoaHRvZEhSd09pOHZiVzlpCmFXeGxMV2xrTG5adUwyTnliQzluWlhRd0hRWURWUjBPQkJZRUZFVlU4UzZwYi96dHVOMlZYdWxudWFRanBLZHEKTUE0R0ExVWREd0VCL3dRRUF3SUU4REFOQmdrcWhraUc5dzBCQVFzRkFBT0NBZ0VBZkdSaVA2alVmK202WlZldQpHcVJRd2EvT2RtRnYxTDdOL1hTOFo1dWFYS2J3WWEvblFmdEYxM29rZHV4MlZUVG5QWDB1cVliNHFUa0VPUHRnCkpHSkFCWVc2WGZVanJUY0xxdTFUWXdybE11em0rYitDZmp0K2Z5MGVzcGNLTzZUeTlxOHFpQWhvN0JLNmJZcmcKeDFRbTBNSHR5NTI5REdlekZkb0doVE8vazBpT203WUw5aEY5Mnl3VXBpZWV0YzV4RGl0Nk1sbXBGREZ6WUN5TgoxdWRiN2V1UUlvYUF0dytpK3c2ZTJWV25KWmdEWnBsd21Xa2lTQSt4TnhRN051d0xFUGMzVjdlTk5STEJXanoxCmJ3WTZORmZ3MXZYVk8xNTNtMFBQMUlWU3NsdjAyMHlJcEorUGFUOW5XVExFbThVcXEzN2FPWUhkSXZyOGtDVm0KSmh2ODRtc0NYVVJjWHUzNis4MUpma050T0lLclZSaVQvaXF5c3Y5bGduN1c3cTBpVEIxRnVHRkNlSVVkQUt0aAo4S3FtZ3E1SGthbWhHaEd6Ly8rVy94Umk1MkZpN3VDQ3NsVGp4a2wwYXgwMjhiWSt4ck1KTHc2U2NjRFlmSWpXCkZkd09JcVliQVpISzlsQTJJQW5SckhNWnF5YTdWejFHd0hEd2NRV1hqMHZyK0VIRTNBTVZnaFNCNGtWMWdIdjkKUjJSUzY2ZWFmL0RGRStCbWdQdFRiL1F3OTAxK3ZoVVVJRVJHdXJWT1hFV1lVQWFhUW1uK1BSUVRlZUVETHQyeAp5RVpqMUNZem9HeWdtTUQ0ODNKampKTVZkWGlVdzd1d2dIMzRlNllWS256MXphY0Nld1pRLzlsdWFtUW4veGxTCjRkQmczYmUzYVM4NzZRMU9FNUI4cFVqdjFSTT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=\"\n" +
            "    },\n" +
            "    \"errors\": [\n" +
            "    ],\n" +
            "    \"format\": \"PKCS7-B\",\n" +
            "    \"grace_period_end_time\": null,\n" +
            "    \"id\": \"S-B049C49E72C68951318916DEFB97C9762928381839DC30F8CAD18ECC97069581\",\n" +
            "    \"indication\": \"TOTAL_PASSED\",\n" +
            "    \"is_archived\": false,\n" +
            "    \"is_ltv_timestamp\": false,\n" +
            "    \"is_seal\": true,\n" +
            "    \"is_valid\": true,\n" +
            "    \"metadata\": {\n" +
            "        \"contact\": \"\",\n" +
            "        \"location\": \"\",\n" +
            "        \"reason\": \"visa\"\n" +
            "    },\n" +
            "    \"scope\": {\n" +
            "        \"name\": \"Partial PDF\",\n" +
            "        \"value\": \"ByteRange: [0, 77147, 97629, 15936]\"\n" +
            "    },\n" +
            "    \"signing_purpose\": \"visa\",\n" +
            "    \"signing_reason\": \"visa\",\n" +
            "    \"signing_time\": \"2023-06-22T14:13:56+07:00\",\n" +
            "    \"sub_indication\": null,\n" +
            "    \"timestamp_time\": null,\n" +
            "    \"type\": \"aes\",\n" +
            "    \"valid_to\": \"2025-06-15T11:24:33+07:00\",\n" +
            "    \"value\": \"yLxYqFIc5l5W2W0W92JiYrtKkCTLGY6+MQJaerw/vjHGhseDsw+VQQwSfXulg/36TUY09SVmDG1TAmj5GSPC1yCWe3Dxm0Wjp4wdVijCRHxvtfGI/RDZc9Naq2jgzYr+Qc8pZTYbYoCur+eQLNzMT5Snpss5vzsIlRfi2WA+2orTjEK09wLHPt2k1C8ougtYS4kopNRsiilBD/i5RLPOUp2lG7AhkEVN4+rqcQmdu5Dhb2WxabLiAkCZFggR+5pJeYX1ZB7hk8afkGgAz6lEZGfBdsRFZXKeTahXQZ058TuLNS8JLZMJeOjjVybJhOrkrJ0kE+s7DLW3QM4nY+nKEA==\",\n" +
            "    \"warnings\": [\n" +
            "        {\n" +
            "            \"key\": \"BBB_ICS_ISASCP_ANS\",\n" +
            "            \"value\": \"The signed attribute: 'signing-certificate' is absent!\"\n" +
            "        }\n" +
            "    ]\n" +
            "}";

//    public static void main(String[] args) throws JsonProcessingException {
//        ObjectMapper objectMapper = new ObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
//        SignatureValidation signatureValidation = objectMapper.readValue(JSON_VALUE, SignatureValidation.class);
//        System.out.println("aaaa");
//    }
}
