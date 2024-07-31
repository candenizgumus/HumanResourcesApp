package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.FeatureSaveRequest;
import com.humanresourcesapp.entities.Feature;
import com.humanresourcesapp.repositories.FeatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeatureService {
    private final FeatureRepository featureRepository;

    public Feature save(FeatureSaveRequest dto) {
        return featureRepository.save(Feature.builder().name(dto.name()).iconPath(dto.iconPath()).shortDescription(dto.shortDescription()).build());
    }

    public List<Feature> getAll() {
        return featureRepository.findAll();
    }
}
