//package com.humanresourcesapp.services;
//
//
//import com.google.cloud.storage.BlobInfo;
//import com.google.cloud.storage.Storage;
//import com.humanresourcesapp.entities.enums.BucketSubDirectoryName;
//import lombok.RequiredArgsConstructor;
//import org.springdoc.webmvc.ui.SwaggerResourceResolver;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.net.URL;
//import java.util.concurrent.TimeUnit;
//
//@Service
//@RequiredArgsConstructor
//public class MediaService {
//    @Autowired
//    private Storage storage;
//    @Autowired
//    private SwaggerResourceResolver swaggerResourceResolver;
//
//    public String uploadAvatarPhotos(MultipartFile file) throws IOException {
//        String UUID = java.util.UUID.randomUUID().toString();
//        storage.create(
//                BlobInfo.newBuilder("java-boost-14", "avatars/"+UUID+".png").build(),
//                file.getInputStream()
//        );
//        return UUID+".png";
//    }
//
//    public String uploadPostPhotos(MultipartFile file) throws IOException {
//        String UUID = java.util.UUID.randomUUID().toString();
//        storage.create(
//                BlobInfo.newBuilder("java-boost-14", "post-photos/"+UUID+".png").build(),
//                file.getInputStream()
//        );
//        return UUID+".png";
//    }
//
//    public String getPhotoUrl(BucketSubDirectoryName directoryName, String photoName ){
//        try{
//            String subDirectory = switch (directoryName){
//                case POST -> "post-photos";
//                case AVATAR -> "avatars";
//            };
//            BlobInfo blobInfo = BlobInfo.newBuilder("java-boost-14",subDirectory+"/"+photoName).build();
//            URL url = storage.signUrl(blobInfo, 30,TimeUnit.MINUTES,Storage.SignUrlOption.withV4Signature());
//            return url.toString();
//        }catch (Exception exception){
//            return  photoName;
//        }
//    }
//}