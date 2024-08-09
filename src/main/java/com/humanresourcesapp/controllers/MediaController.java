//package com.humanresourcesapp.controllers;
//
//import static com.humanresourcesapp.constants.Endpoints.*;
//import com.humanresourcesapp.entities.enums.BucketSubDirectoryName;
//import com.humanresourcesapp.services.MediaService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//
//
//@RestController
//@RequestMapping(MEDIA)
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*",methods = {RequestMethod.POST,RequestMethod.GET})
//public class MediaController {
//
//    private final MediaService mediaService;
//
//    @PostMapping(value = "/add-storage-avatar")
//    @CrossOrigin("*")
//    public ResponseEntity<String> uploadAvatarFile(@RequestParam("file")MultipartFile file) throws IOException {
//        return  ResponseEntity.ok(mediaService.uploadAvatarPhotos(file)
//
//        );
//    }
//
//    @PostMapping(value = "/add-storage-post")
//    @CrossOrigin("*")
//    public ResponseEntity<String> uploadPostFile(@RequestParam("file") MultipartFile file) throws IOException {
//        return  ResponseEntity.ok(mediaService.uploadPostPhotos(file)
//
//        );
//    }
//
//    @GetMapping("/test")
//    public void test(){
//        mediaService.getPhotoUrl(BucketSubDirectoryName.AVATAR,"fcc56ead-a1fc-4dfa-a864-4915674a7e23.png");
//    }
//
//
//}