package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Engine;
import com.autokereskedes.backend.model.Variant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EngineRepository extends JpaRepository<Engine, Long> {
    List<Engine> findByVariant(Variant variant);
}
