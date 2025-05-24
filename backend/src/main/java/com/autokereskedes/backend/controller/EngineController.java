package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.Engine;
import com.autokereskedes.backend.model.Variant;
import com.autokereskedes.backend.repository.EngineRepository;
import com.autokereskedes.backend.repository.VariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/engines")
@CrossOrigin
public class EngineController {

    @Autowired
    private EngineRepository engineRepository;

    @Autowired
    private VariantRepository variantRepository;

    @GetMapping("/by-variant/{variantId}")
    public List<Engine> getEnginesByVariant(@PathVariable Long variantId) {
        Variant variant = variantRepository.findById(variantId).orElse(null);
        if (variant == null) {
            return List.of();
        }
        return engineRepository.findByVariant(variant);
    }
}
