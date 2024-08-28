package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.Slide;
import com.humanresourcesapp.repositories.SlideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SlideService {
    private final SlideRepository slideRepository;

    public Slide save(List<String> imageUrls) {
        return slideRepository.save(Slide.builder().imageUrls(imageUrls).build());
    }

    public List<Slide> getAll() {
        return slideRepository.findAll();
    }
}
