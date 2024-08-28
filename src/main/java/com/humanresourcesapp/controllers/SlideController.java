package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.entities.Slide;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.services.SlideService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFPictureData;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static com.humanresourcesapp.constants.Endpoints.GET_ALL;
import static com.humanresourcesapp.constants.Endpoints.ROOT;

import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.UUID;
import java.io.File;
import java.nio.file.*;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;




@RequiredArgsConstructor
@RequestMapping(ROOT+"/slides")
@RestController
@CrossOrigin("*")
public class SlideController {

    private final SlideService slideService;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    @CrossOrigin(origins = "http://yourdomain.com") // Replace with your actual domain
    public ResponseEntity<?> uploadZipFile(@RequestParam(value = "fileMobile", required = false) MultipartFile fileMobile,
                                           @RequestParam(value = "fileDesktop", required = false) MultipartFile fileDesktop) {
        try {
            System.out.println("Uploading zip file...");

            // Check if files are not null and process them
            List<String> mobileImages = fileMobile != null ? slideService.getImages(fileMobile) : Collections.emptyList();
            List<String> desktopImages = fileDesktop != null ? slideService.getImages(fileDesktop) : Collections.emptyList();

            // Save images and return response
            Slide slide = slideService.save(mobileImages, desktopImages);
            return ResponseEntity.ok(slide);
        } catch (Exception e) {
            // Handle exceptions and return appropriate response
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing files");
        }
    }


    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    @CrossOrigin("*")
    public ResponseEntity<List<Slide>> getAll() {
        return ResponseEntity.ok(slideService.getAll());
    }
}
