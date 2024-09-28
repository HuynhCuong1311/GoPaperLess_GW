/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.model.qrypto;

import com.qrypto.decoder.model.Layout;
import com.qrypto.decoder.model.Model4T1P;
import java.util.HashMap;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 *
 * @author 84766
 */
@Data
public class LayoutDataWrapper {
    private Layout layout;
    private String base64Content;
    private  String fileName;
    private String fileSize;

    public LayoutDataWrapper(Layout layout, String base64Content, String fileName, String fileSize) {
        this.layout = layout;
        this.base64Content = base64Content;
        this.fileName = fileName;
        this.fileSize = fileSize;
    }



}
