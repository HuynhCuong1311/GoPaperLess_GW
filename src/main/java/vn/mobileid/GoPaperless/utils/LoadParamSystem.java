package vn.mobileid.GoPaperless.utils;

import org.springframework.stereotype.Component;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.CountryName;
import vn.mobileid.GoPaperless.model.apiModel.Enterprise;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LoadParamSystem {
    private static final Map<String, List<ConnectorName>> mapConnector = new HashMap<>();

    private static final Map<String, List<Enterprise>> mapEnterprise = new HashMap<>();

    private static final Map<String, List<CountryName>> mapCountry = new HashMap<>();

    public static List<ConnectorName> getConnectorStart(String value) {
        List<ConnectorName> result = mapConnector.get(value.trim());
        return result;
    }

    public static void updateConnectorSystem(String sKey, List<ConnectorName> sValue) {
        mapConnector.put(sKey, sValue);
    }

    public static List<Enterprise> getEnterpriseStart(String value) {
        List<Enterprise> result = mapEnterprise.get(value.trim());

        return result;
    }

    public static void updateEnterpriseSystem(String sKey, List<Enterprise> sValue) {
        mapEnterprise.put(sKey, sValue);
    }

    public static List<CountryName> getCountryNameList(String value) {
        List<CountryName> result = mapCountry.get(value.trim());

        return result;
    }

    public static void updateCountryList(String sKey, List<CountryName> sValue) {
        mapCountry.put(sKey, sValue);
    }
}
