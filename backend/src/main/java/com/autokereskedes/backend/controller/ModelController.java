package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Brand;
import com.autokereskedes.backend.repository.ModelRepository;
import com.autokereskedes.backend.repository.BrandRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "http://localhost:3000")
public class ModelController {

    private final ModelRepository modelRepository;
    private final BrandRepository brandRepository;

    public ModelController(ModelRepository modelRepository, BrandRepository brandRepository) {
        this.modelRepository = modelRepository;
        this.brandRepository = brandRepository;
    }

    @GetMapping("/by-brand/{brandName}")
    public List<Model> getModelsByBrand(@PathVariable String brandName) {
        Brand brand = brandRepository.findByNameIgnoreCase(brandName)
                .orElseThrow(() -> new RuntimeException("Brand not found: " + brandName));
        return modelRepository.findByBrand(brand);
    }
}
