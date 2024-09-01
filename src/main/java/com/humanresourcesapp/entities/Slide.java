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
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ElementCollection
    private List<String> mobileImageUrls;
    @ElementCollection
    private List<String> desktopImageUrls;

    String mobileImagesPath;
    String desktopImagesPath;
    private String sehir;
    private String ilce;
    private String mahalle;
    private String projeksiyon;
    private String konsept;
    private Long companyId;

}
