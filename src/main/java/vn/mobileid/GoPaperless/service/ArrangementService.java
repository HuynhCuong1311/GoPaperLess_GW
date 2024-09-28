/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.dto.rsspDto.TextField;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.fpsModel.Alignment;
import vn.mobileid.GoPaperless.model.fpsModel.BasicFieldAttribute;
import vn.mobileid.GoPaperless.model.fpsModel.QryptoItems;
import vn.mobileid.GoPaperless.process.ProcessDb;

/**
 * @author Admin
 */
@Service
public class ArrangementService {

    private final FpsService fpsService;
    private final ProcessDb connect;

    public ArrangementService(FpsService fpsService, ProcessDb connect) {
        this.fpsService = fpsService;
        this.connect = connect;
    }

    public String addField(String fields, Integer newWorkflowId, Participants participant, WorkFlowList workflow, Integer documentId,String signingToken) throws JsonProcessingException, Exception {
        // create object to parse fields
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonFields = objectMapper.readTree(fields);
        System.out.println("jsonFields: " + jsonFields);
        int indexSigningTime = 1;
        if (jsonFields.get("signature") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("signature").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                remark.add(newWorkflowId + "_" + participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("signature").get(i).get("field_name").toString(), String.class);
                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("signature").get(i).toString(),
                        BasicFieldAttribute.class);
                System.out.println("fieldName: " + newField.getDimension());
                newField.setFieldName(newField.getFieldName()
                        .replace("GROUP_PROVIDER", participant.getSignerId())
                        .replace(String.valueOf(workflow.getId()), newWorkflowId.toString()));
                newField.setRemark(remark);
                System.out.println("newField.getProcessStatus(): " + newField.getProcessStatus());
                if(!newField.getProcessStatus().equals("PROCESSED")){
                    String signatures = fpsService.addSignature(documentId, "signature", newField, true);
                    System.out.println("signatures: " + signatures);
                }else{
                    System.out.println("Signature field had processed: " + newField.getFieldName());
                    indexSigningTime++;
                    System.out.println("indexSigningTime: " + indexSigningTime);
                }

            }
        }

        if (jsonFields.get("stamp") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("stamp").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("stamp").get(i).get("field_name").toString(), String.class);
                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("stamp").get(i).toString(),
                        BasicFieldAttribute.class);
                newField.setFieldName(newField.getFieldName()
                        .replace("GROUP_PROVIDER", participant.getSignerId()));
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "stamp", newField, true);
                System.out.println("stamp: " + signatures);
            }
        }
        if (jsonFields.get("radioboxV2") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("radioboxV2").toString(), List.class);
            System.out.println("radioboxV2: " + signaturesList.size());
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("radiobox").get(i).get("field_name").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("radioboxV2").get(i).toString(),
                        BasicFieldAttribute.class);
//                System.out.println("fieldName: " + newField.getFieldName());
                newField.setFieldName(newField.getFieldName());
//                newField.setRequired(required);
                newField.setRemark(remark);

                if (jsonFields.get("radioboxV2").get(i).get("checked") != null) {

                    newField.setChecked(gson.fromJson(jsonFields.get("radioboxV2").get(i).get("checked").toString(), Boolean.class));
                }
//                System.out.println("checked radioboxV2: " + jsonFields.get("radioboxV2").get(i).get("align_option"));
//                newField.setAlign_option(gson.fromJson(jsonFields.get("radioboxV2").get(i).get("align_option").toString(), Alignment.class));
                String signatures = fpsService.addTextBox(documentId, "radioboxV2", newField, true);
                System.out.println("radioboxV2: " + signatures);
            }
        }
        if (jsonFields.get("checkboxV2") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("checkboxV2").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("radiobox").get(i).get("field_name").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("checkboxV2").get(i).toString(),
                        BasicFieldAttribute.class);
//                System.out.println("fieldName: " + newField.getFieldName());
                newField.setFieldName(newField.getFieldName());
//                newField.setRequired(required);
                newField.setRemark(remark);
//                System.out.println("checked checkboxV2: " + jsonFields.get("checkboxV2").get(i));
//                newField.setAlign_option(gson.fromJson(jsonFields.get("checkboxV2").get(i).get("align_option").toString(), Alignment.class));
                String signatures = fpsService.addTextBox(documentId, "checkboxV2", newField, true);
                System.out.println("checkbox: " + signatures);
            }
        }
        if (jsonFields.get("initial") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("initial").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("initial").get(i).get("field_name").toString(), String.class);
                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("initial").get(i).toString(),
                        BasicFieldAttribute.class);
                newField.setFieldName(newField.getFieldName()
                        .replace("GROUP_PROVIDER", participant.getSignerId()));
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "initial", newField, true);
                System.out.println("initial: " + signatures);
            }
        }
        if (jsonFields.get("textbox") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            List<TextField> textFields = new ArrayList<>();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("textbox").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();

                System.out.println("participant.getSignerId(): " + jsonFields.get("textbox").get(i).toString());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("textbox").get(i).get("field_name").toString(), String.class);
                String type = gson.fromJson(jsonFields.get("textbox").get(i).get("type").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("textbox").get(i).toString(),
                        BasicFieldAttribute.class);
                newField.setFieldName(newField.getFieldName()
                        .replace("GROUP_PROVIDER", participant.getSignerId()));
                newField.setRemark(remark);


                if ("EMAIL".equals(type)) {

                    newField.setValue(participant.getEmail());
                } else if ("NAME".equals(type)) {
                    newField.setValue(participant.getFirstName() + " " + participant.getLastName());
                }
                if ("DATE".equals(newField.getType())) {
                    String signatures = fpsService.addTextBox(documentId, "date", newField, true);
                    System.out.println("date: " + signatures);
                } else {
                    String signatures = fpsService.addTextBox(documentId, "text", newField, true);
                    System.out.println("textbox: " + signatures);
                }
                if("DOCUMENTID".equals(newField.getType())){
                    TextField textField = new TextField();
                    textField.setField_name(newField.getFieldName());
                    textField.setFile_name(newField.getFileName());
                    textField.setType("text");
                    System.out.println("newField.getValue(): " + newField.getPlaceHolder());
                    textField.setValue(newField.getPlaceHolder());
                    textFields.add(textField);
                }

            }
//            fill anotation in new document
            fpsService.fillVotri(documentId, textFields);
        }
        if (jsonFields.get("qrypto") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("qrypto").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("qrypto").get(i).toString(),
                        BasicFieldAttribute.class);
                List<Object> items = new ArrayList<>();
                System.out.println("qrypto items size: " + gson.fromJson(jsonFields.get("qrypto").get(i).get("items").toString(),List.class).size());
//                set index for signingtime

                for(int j = 0; j< gson.fromJson(jsonFields.get("qrypto").get(i).get("items").toString(),List.class).size(); j++){
                    QryptoItems item = gson.fromJson(jsonFields.get("qrypto").get(i).get("items").get(j).toString(), QryptoItems.class);
                    if(item.getRemark().equals("signer")){
                        Object value = gson.fromJson(jsonFields.get("qrypto").get(i).get("items").get(j).get("value").toString().replace("@Signer"+(indexSigningTime),"@Signer1"),Object.class);
                        item.setValue(value);
                        System.out.println("QryptoItems: " + item.getValue());
                        if( item.getField().equals(participant.getSignerId())){
                            items.add(item);

                        }
                        indexSigningTime++;
                    }else{
                        items.add(item);
                    }
                }

                newField.setFieldName(newField.getFieldName());
                newField.setItems(items);
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "qrcode-qrypto", newField, true);
                System.out.println("qrypto: " + signatures);
            }
        }
        if (jsonFields.get("stepper") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("stepper").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("radiobox").get(i).get("field_name").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("stepper").get(i).toString(),
                        BasicFieldAttribute.class);
//                System.out.println("fieldName: " + newField.getFieldName());
                newField.setFieldName(newField.getFieldName());
//                newField.setRequired(required);
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "numeric_stepper", newField, true);
                System.out.println("stepper: " + signatures);
            }

        }
        if (jsonFields.get("camera") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("camera").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("radiobox").get(i).get("field_name").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("camera").get(i).toString(),
                        BasicFieldAttribute.class);
//                System.out.println("fieldName: " + newField.getFieldName());
                newField.setFieldName(newField.getFieldName());
//                newField.setRequired(required);
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "camera", newField, true);
                System.out.println("camera: " + signatures);
            }

        }
        if (jsonFields.get("attachment") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("attachment").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("radiobox").get(i).get("field_name").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("attachment").get(i).toString(),
                        BasicFieldAttribute.class);
//                System.out.println("fieldName: " + newField.getFieldName());
                newField.setFieldName(newField.getFieldName());
//                newField.setRequired(required);
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "attachment", newField, true);
                System.out.println("attachment: " + signatures);
            }

        }
        if (jsonFields.get("hyperlink") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("hyperlink").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("radiobox").get(i).get("field_name").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("hyperlink").get(i).toString(),
                        BasicFieldAttribute.class);
//                System.out.println("fieldName: " + newField.getFieldName());
                newField.setFieldName(newField.getFieldName());
//                newField.setRequired(required);
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "hyperlink", newField, true);
                System.out.println("hyperlink: " + signatures);
            }

        }
        if (jsonFields.get("date") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("date").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("radiobox").get(i).get("field_name").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("date").get(i).toString(),
                        BasicFieldAttribute.class);
//                System.out.println("fieldName: " + newField.getFieldName());
                newField.setFieldName(newField.getFieldName());
//                newField.setRequired(required);
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "date", newField, true);
                System.out.println("date: " + signatures);
            }

        }
        if (jsonFields.get("toggle") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("toggle").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                List<Object> items = gson.fromJson(jsonFields.get("toggle").get(i).get("toggle_item").get("items").toString(), List.class);

                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("radiobox").get(i).get("field_name").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("toggle").get(i).toString(),
                        BasicFieldAttribute.class);
                newField.setDefault_item(jsonFields.get("toggle").get(i).get("toggle_item").get("default_item").toString());
                newField.setItems(items);
                System.out.println("getDefault_item: " + jsonFields.get("toggle").get(i).get("type"));
                newField.setFieldName(newField.getFieldName());
//                newField.setRequired(required);
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "toggle", newField, true);
                System.out.println("toggle: " + signatures);
            }

        }
        if (jsonFields.get("combo") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("combo").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                List<String> remark = new ArrayList<>();
                List<String> required = new ArrayList<>();
                required.add(participant.getSignerId());
                remark.add(participant.getSignerId());
//                String fieldName = gson.fromJson(jsonFields.get("radiobox").get(i).get("field_name").toString(), String.class);

                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("combo").get(i).toString(),
                        BasicFieldAttribute.class);
//                System.out.println("fieldName: " + newField.getFieldName());
                newField.setFieldName(newField.getFieldName());
//                newField.setRequired(required);
                newField.setRemark(remark);
                String signatures = fpsService.addTextBox(documentId, "combo", newField, true);
                System.out.println("combo: " + signatures);
            }

        }
        if(jsonFields.get("qr") != null) {
            // Create a Gson instance
            Gson gson = new Gson();
            // Convert field Signature from string to list
            List<String> signaturesList = gson.fromJson(jsonFields.get("qr").toString(), List.class);
            for (int i = 0; i < signaturesList.size(); i++) {
                String qrToken = UUID.randomUUID().toString();
                System.out.println("qrCode: " + qrToken);
                BasicFieldAttribute newField = gson.fromJson(jsonFields.get("qr").get(i).toString(),
                        BasicFieldAttribute.class);
                newField.setQrToken(qrToken);
                newField.setSigningToken(signingToken);
                newField.setValue("https://uat-paperless-gw.mobile-id.vn/view/documents/"+qrToken);
                String qrCode = fpsService.addTextBox(documentId, "qrcode", newField, true);
                System.out.println("qrCode: " + qrCode);
                String result = connect.USP_GW_PPL_WORKFLOW_UPDATE_QR_TOKEN(signingToken, qrToken,
                        "Gateway view");
                if (result.equals("1")) {
                    System.out.println("update qr token success");
                } else {
                    System.out.println("update qr token fail");
                }
            }
        }
        return null;
    }
}
