/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.model.qrypto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 *
 * @author 84766
 */
@AllArgsConstructor
@Data
public class FileData {

    private String filename;
    private String content;
    private String filesize;

}
