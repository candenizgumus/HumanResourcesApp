package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.SlideRequestDto;
import com.humanresourcesapp.dto.requests.TimeDataSaveRequestDto;
import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.entities.Slide;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.services.SlideService;
import com.humanresourcesapp.services.TimeDataService;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;


@RequiredArgsConstructor
@RequestMapping(ROOT+"/slides")
@RestController
@CrossOrigin("*")
public class SlideController {

    private final SlideService slideService;
    private final TimeDataService timeDataService;
    @PostMapping("/upload-file-for-slide")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    public ResponseEntity<?> uploadZipFile(@RequestParam(value = "fileMobile", required = false) MultipartFile fileMobile,
                                           @RequestParam(value = "fileDesktop", required = false) MultipartFile fileDesktop
    ) {
        try {

            // Check if files are not null and process them
            List<String> mobileImages = fileMobile != null ? slideService.getImages(fileMobile) : Collections.emptyList();
            List<String> desktopImages = fileDesktop != null ? slideService.getImages(fileDesktop) : Collections.emptyList();

            String mobileImagesPath =  mobileImages.getFirst().split("/")[2];
            String desktopImagesPath = desktopImages.getFirst().split("/")[2];
            // Save images and return response
            Slide slide = slideService.saveWithoutDescription(mobileImages, desktopImages, mobileImagesPath, desktopImagesPath);
            return ResponseEntity.ok(slide);
        } catch (Exception e) {
            // Handle exceptions and return appropriate response
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing files");
        }
    }
    @PostMapping("/create-slide")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    public ResponseEntity<?> createSlide(@RequestParam(value = "mobileImageUrls", required = false)  List<String> mobileImageUrls,
                                           @RequestParam(value = "desktopImageUrls", required = false)  List<String> desktopImageUrls,
                                           @RequestParam(value = "city", required = false) String city,
                                           @RequestParam(value = "district", required = false) String district,
                                           @RequestParam(value = "neighborhood", required = false) String neighborhood,
                                           @RequestParam(value = "projection", required = false) String projection,
                                           @RequestParam(value = "concept", required = false) String concept

    ) {
        try {

            String mobileImagesPath =  mobileImageUrls.getFirst().split("/")[2];
            String desktopImagesPath = desktopImageUrls.getFirst().split("/")[2];
            // Save images and return response
            Slide slide = slideService.saveWithDescription(mobileImageUrls, desktopImageUrls, mobileImagesPath, desktopImagesPath,city,district,neighborhood,projection,concept);
            return ResponseEntity.ok(slide);
        } catch (Exception e) {
            // Handle exceptions and return appropriate response
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing files");
        }
    }

    @DeleteMapping("/delete-directory")
    public ResponseEntity<String> deleteDirectory(@RequestParam String directoryPath) {
        return slideService.deleteDirectory(directoryPath);
    }

    @DeleteMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> delete(Long id) {
        return ResponseEntity.ok(slideService.delete(id));
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    @CrossOrigin("*")
    public ResponseEntity<List<Slide>> getAll(@RequestBody SlideRequestDto dto) {
        return ResponseEntity.ok(slideService.getAll(dto));
    }

    @PostMapping(GET_BY_ID)
    @CrossOrigin("*")
    public ResponseEntity<Slide> getById(Long id) {
        return ResponseEntity.ok(slideService.getById(id));
    }

    @GetMapping("/get-ip")
    @CrossOrigin("*")
    public ResponseEntity<Map<String, String>> getUserIP(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");

        // If there are multiple IPs, the user's IP is the first one in the list
        if (ipAddress != null && !ipAddress.isEmpty()) {
            ipAddress = ipAddress.split(",")[0].trim();
        } else {
            ipAddress = request.getRemoteAddr();
        }

        Map<String, String> response = new HashMap<>();
        response.put("ip", ipAddress);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/store-time-data")
    @CrossOrigin("*")
    public ResponseEntity<String> storeTimeData(@RequestBody Map<String, Object> payload) {
        // Cast imageTimes to the correct type
        Map<String, Double> imageTimes = (Map<String, Double>) payload.get("imageTimes");


        String userName = payload.get("userName").toString();

        String slideId = payload.get("slideId").toString();

        String userIp = payload.get("userIp").toString();

        String companyId = payload.get("companyId").toString();

        // Store the image times in the database
        timeDataService.save(TimeDataSaveRequestDto.builder()
                .userName(userName)
                .imageTimes(imageTimes)
                .slideId(Long.parseLong(slideId))
                        .companyId(Long.parseLong(companyId))
                .userIp(userIp).build());

        return ResponseEntity.ok("Data stored successfully");
    }


}
