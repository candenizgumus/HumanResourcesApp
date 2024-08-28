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
import org.springframework.http.ResponseEntity;
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
    private static final String UPLOAD_DIR = "uploads/";
    private final SlideService slideService;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    @CrossOrigin("*")
    public ResponseEntity<Slide> uploadZipFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new HumanResourcesAppException(ErrorType.NO_IMAGES_FOUND);
        }

        // Save the uploaded zip file
        String zipFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path zipFilePath = Paths.get(UPLOAD_DIR, zipFileName);
        List<File> images;
        List<String> imageUrls = new ArrayList<>();
        try {
            // Debugging: Log the zip file path
            System.out.println("Saving zip file to: " + zipFilePath.toString());

            Files.createDirectories(zipFilePath.getParent());
            Files.write(zipFilePath, file.getBytes());

            // Debugging: Check if the file was written correctly
            if (!Files.exists(zipFilePath) || Files.size(zipFilePath) == 0) {
                System.out.println("Failed to write the zip file or file is empty.");
                throw new HumanResourcesAppException(ErrorType.FILE_UPLOAD_FAILED);
            }
            UUID fileName = UUID.randomUUID();
            images = extractImagesFromZip(zipFilePath.toString(),fileName);
            if (images.isEmpty()) {
                throw new HumanResourcesAppException(ErrorType.NO_IMAGES_FOUND);
            }

            // Convert file paths to URLs
            for (File image : images) {
                String imageUrl = "/uploads/"+ fileName + '/' + image.getName(); // Adjust the URL path according to your server configuration
                imageUrls.add(imageUrl);
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new HumanResourcesAppException(ErrorType.FILE_UPLOAD_FAILED);
        }

        // Return the list of image URLs
        return ResponseEntity.ok(slideService.save(imageUrls));
    }



    public List<File> extractImagesFromZip(String zipFilePath, UUID fileName) throws IOException {
        System.out.println("Extracting images from zip file: " + zipFilePath + " ...");
        File dir = new File(UPLOAD_DIR + fileName);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("Failed to create directory: " + dir.getAbsolutePath());
        }
        System.out.println("Extracting images to: " + dir.getAbsolutePath());
        List<File> imageFiles = new ArrayList<>();

        try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(Paths.get(zipFilePath)))) {
            System.out.println("Available bytes: " +zis.available());
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                System.out.println("Extracting: " + entry.getName());
                if (!entry.isDirectory() && (entry.getName().endsWith(".png") || entry.getName().endsWith(".jpg"))) {
                    File newFile = new File(dir, entry.getName());
                    // Use NIO Files API to copy the file
                    Files.copy(zis, newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    System.out.println("File saved: " + newFile.getAbsolutePath());
                    imageFiles.add(newFile);
                }
            }
        }
        return imageFiles;
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    @CrossOrigin("*")
    public ResponseEntity<List<Slide>> getAll() {
        return ResponseEntity.ok(slideService.getAll());
    }
}
