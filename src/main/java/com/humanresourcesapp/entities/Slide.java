package com.humanresourcesapp.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "slides")
public class Slide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @ElementCollection
    private List<String> mobileImageUrls;
    @ElementCollection
    private List<String> desktopImageUrls;
    String mobileImagesPath;
    String desktopImagesPath;
    private String city;
    private String district;
    private String neighborhood;
    private String projection;
    private String concept;
    private Long companyId;

}
