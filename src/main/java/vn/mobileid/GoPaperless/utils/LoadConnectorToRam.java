package vn.mobileid.GoPaperless.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.CountryName;
import vn.mobileid.GoPaperless.model.apiModel.Enterprise;
import vn.mobileid.GoPaperless.process.ProcessDb;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;

@Component
public class LoadConnectorToRam implements ServletContextListener {

    /**
     * @param arg0
     * @throws Exception
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */

    @Autowired
    private ProcessDb connect;

    @Override
    public void contextInitialized(ServletContextEvent arg0) {
        System.out.println("*********Load ConnectorToRAM started*********");
        try {
            List<Enterprise> enterpriseList = new ArrayList<>();
            connect.USP_GW_ENTERPRISE_LIST(enterpriseList);
            if(enterpriseList.size() > 0 && enterpriseList != null){
                LoadParamSystem.updateEnterpriseSystem(Difinitions.CONFIG_LOAD_PARAM_ENTERPRISE, enterpriseList);
            }
            System.out.println("*********load enterprise ram done started*********");

            List<ConnectorName> connectorNameList = new ArrayList<>();
            connect.USP_GW_CONNECTOR_LIST(connectorNameList);
            if(connectorNameList.size() > 0 && connectorNameList != null){
                LoadParamSystem.updateConnectorSystem(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME, connectorNameList);
            }
            System.out.println("*********load connector ram done started*********");

            List<CountryName> countryNameList = new ArrayList<>();
            connect.USP_GW_COUNTRY_WITH_ELECTRONIC_LIST(countryNameList);
            if(countryNameList.size() > 0 && countryNameList != null){
                LoadParamSystem.updateCountryList(Difinitions.CONFIG_LOAD_PARAM_COUNTRY, countryNameList);
            }
            System.out.println("*********load country ram done started*********");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * @param arg0
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    @Override
    public void contextDestroyed(ServletContextEvent arg0) {
        ServletContext servletContext = arg0.getServletContext();
// get our timer from the Context
        Timer timer = (Timer) servletContext.getAttribute("timerSynchNEAC");

// cancel all pending tasks in the timers queue
        if (timer != null) {
            timer.cancel();
        }

// remove the timer from the servlet context
        servletContext.removeAttribute("timerSynchNEAC");
        System.out.println("SynchNEACListener destroyed");

    }
}
