package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Variant;
import com.autokereskedes.backend.repository.ModelRepository;
import com.autokereskedes.backend.repository.VariantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/variants")
@CrossOrigin(origins = "http://localhost:3000")
public class VariantController {

    private final VariantRepository variantRepository;
    private final ModelRepository modelRepository;

    public VariantController(VariantRepository variantRepository, ModelRepository modelRepository) {
        this.variantRepository = variantRepository;
        this.modelRepository = modelRepository;
    }


    @GetMapping("/by-model/{slugOrId}")
    public ResponseEntity<List<Variant>> getVariantsByModel(@PathVariable String slugOrId) {
        Optional<Model> modelOpt;

     
        if (slugOrId.matches("\\d+")) {
            modelOpt = modelRepository.findById(Long.parseLong(slugOrId));
        } else {
            modelOpt = modelRepository.findBySlugIgnoreCase(slugOrId);
        }

        if (modelOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Variant> variants = variantRepository.findByModel(modelOpt.get());
        return ResponseEntity.ok(variants);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVariantById(@PathVariable Long id) {
        return variantRepository.findById(id).map(variant -> {
            Map<String, Object> response = new HashMap<>();
            response.put("id", variant.getId());
            response.put("name", variant.getName());
            response.put("price", variant.getPrice());
            response.put("imageUrl", variant.getImageUrl());
            response.put("power", variant.getPower());
            response.put("drive", variant.getDrive());
            response.put("range", variant.getRange());
            response.put("brand", variant.getModel().getBrand().getName());
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }
}
