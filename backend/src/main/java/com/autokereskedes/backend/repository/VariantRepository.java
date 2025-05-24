package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Variant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VariantRepository extends JpaRepository<Variant, Long> {
    List<Variant> findByModel(Model model);

 
    Optional<Variant> findById(Long id);
}
