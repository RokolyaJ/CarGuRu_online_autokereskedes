package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Variant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VariantRepository extends JpaRepository<Variant, Long> {

    List<Variant> findByModel(Model model);
    Optional<Variant> findById(Long id);

    List<Variant> findByModel_Brand_NameIgnoreCase(String brandName);

    List<Variant> findByModel_Brand_NameIgnoreCaseAndModel_CategoryIgnoreCase(
            String brandName,
            String category
    );

    Optional<Variant> findFirstByModel_IdOrderByIdAsc(Long modelId);

    Optional<Variant> findByModel_IdAndNameIgnoreCase(Long modelId, String name);

    // -------------- KÉPEK A KÜLÖN TÁBLÁKBÓL --------------

    // Külső képek a variant_exterior_images táblából
    @Query(
            value = "SELECT image_url FROM variant_exterior_images WHERE variant_id = :variantId",
            nativeQuery = true
    )
    List<String> findExteriorImagesByVariantId(@Param("variantId") Long variantId);

    // Belső képek a variant_interior_images táblából
    @Query(
            value = "SELECT image_url FROM variant_interior_images WHERE variant_id = :variantId",
            nativeQuery = true
    )
    List<String> findInteriorImagesByVariantId(@Param("variantId") Long variantId);
}
