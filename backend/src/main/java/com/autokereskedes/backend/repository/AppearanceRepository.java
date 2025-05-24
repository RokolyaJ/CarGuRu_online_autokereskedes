package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Appearance;
import com.autokereskedes.backend.model.Model;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppearanceRepository extends JpaRepository<Appearance, Long> {
    List<Appearance> findByModel(Model model);
}
