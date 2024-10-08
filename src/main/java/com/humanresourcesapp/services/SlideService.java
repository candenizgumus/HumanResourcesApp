package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.SlideRequestDto;
import com.humanresourcesapp.entities.Slide;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.SlideRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
@RequiredArgsConstructor
public class SlideService {
    private final SlideRepository slideRepository;
    private static final String UPLOAD_DIR = "uploads/";
    private final TimeDataService timeDataService;
    private final UserService userService;
    public Slide saveWithoutDescription(List<String> mobileImages, List<String> desktopImages, String mobileImagesPath, String desktopImagesPath) {
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return slideRepository.save(Slide.builder()
                .mobileImageUrls(mobileImages)
                .desktopImageUrls(desktopImages)
                .desktopImagesPath("uploads/"+desktopImagesPath)
                .companyId(manager.getCompanyId())
                .mobileImagesPath("uploads/"+mobileImagesPath).build());
    }

    public Slide saveWithDescription(List<String> mobileImages, List<String> desktopImages, String mobileImagesPath, String desktopImagesPath,String city,String district,String neighbourhood,String projection, String concept) {
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return slideRepository.save(Slide.builder()
                .mobileImageUrls(mobileImages)
                .city(city)
                .district(district)
                .neighborhood(neighbourhood)
                .projection(projection)
                .concept(concept)
                .desktopImageUrls(desktopImages)
                .desktopImagesPath("uploads/"+desktopImagesPath)
                .companyId(manager.getCompanyId())
                .mobileImagesPath("uploads/"+mobileImagesPath).build());
    }

    public List<Slide> getAll(SlideRequestDto dto) {
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return slideRepository.findAllByCityContainingIgnoreCaseAndDistrictContainingIgnoreCaseAndNeighborhoodContainingIgnoreCaseAndProjectionContainingIgnoreCaseAndConceptContainingIgnoreCaseAndCompanyId(dto.city(),dto.district(),dto.neighborhood(),dto.projection(),dto.concept(),manager.getCompanyId());
    }

    public List<String> getImages(MultipartFile file) {
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


            Files.createDirectories(zipFilePath.getParent());
            Files.write(zipFilePath, file.getBytes());

            // Debugging: Check if the file was written correctly
            if (!Files.exists(zipFilePath) || Files.size(zipFilePath) == 0) {

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
            deleteDirectory(zipFilePath.toString());
            throw new HumanResourcesAppException(ErrorType.FILE_UPLOAD_FAILED);
        }

        // Return the list of image URLs
        deleteDirectory(zipFilePath.toString());
        return imageUrls;
    }

    public List<File> extractImagesFromZip(String zipFilePath, UUID fileName) throws IOException {

        File dir = new File(UPLOAD_DIR + fileName);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("Failed to create directory: " + dir.getAbsolutePath());
        }

        List<File> imageFiles = new ArrayList<>();

        try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(Paths.get(zipFilePath)))) {

            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {

                if (!entry.isDirectory() && (entry.getName().endsWith(".png") || entry.getName().endsWith(".jpg"))) {
                    File newFile = new File(dir, entry.getName());
                    // Use NIO Files API to copy the file
                    Files.copy(zis, newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

                    imageFiles.add(newFile);
                }
            }
        }
        return imageFiles;
    }

    public Slide getById( Long id) {
        return slideRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.SLIDE_NOT_FOUND));
    }

    public ResponseEntity<String> deleteDirectory(String directoryPath) {
        File directory = new File(directoryPath);

        if (directory.exists()) {
            boolean result = deleteDirectoryRecursively(directory);
            if (result) {
                return new ResponseEntity<>("Klasör başarıyla silindi.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Klasör silinemedi.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>("Belirtilen klasör bulunamadı.", HttpStatus.NOT_FOUND);
        }
    }

    private boolean deleteDirectoryRecursively(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectoryRecursively(file);
            }
        }
        return directoryToBeDeleted.delete();
    }

    @Transactional
    public Boolean delete(Long id)
    {

        Slide slide = slideRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.SLIDE_NOT_FOUND));
        deleteDirectory(slide.getDesktopImagesPath());
        deleteDirectory(slide.getMobileImagesPath());
        timeDataService.deleteTimeDataBySlideId(id);
        slideRepository.deleteById(id);

        return true;
    }
}
