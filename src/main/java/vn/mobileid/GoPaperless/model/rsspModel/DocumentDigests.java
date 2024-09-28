package vn.mobileid.GoPaperless.model.rsspModel;

import java.util.List;

public class DocumentDigests {
    public List<byte[]> hashes;
    public String hashAlgorithmOID;

    public List<byte[]> getHashes() {
        return hashes;
    }

    public void setHashes(List<byte[]> hashes) {
        this.hashes = hashes;
    }

//    public HashAlgorithmOID getHashAlgorithmOID() {
//        return hashAlgorithmOID;
//    }
//
//    public void setHashAlgorithmOID(HashAlgorithmOID hashAlgorithmOID) {
//        this.hashAlgorithmOID = hashAlgorithmOID;
//    }

    public String getHashAlgorithmOID() {
        return hashAlgorithmOID;
    }

    public void setHashAlgorithmOID(String hashAlgorithmOID) {
        this.hashAlgorithmOID = hashAlgorithmOID;
    }
}
