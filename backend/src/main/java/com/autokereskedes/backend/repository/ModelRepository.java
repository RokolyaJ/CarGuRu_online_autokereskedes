package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ModelRepository extends JpaRepository<Model, Long> {
    List<Model> findByBrand(Brand brand);
    Optional<Model> findBySlugIgnoreCase(String slug);
}
