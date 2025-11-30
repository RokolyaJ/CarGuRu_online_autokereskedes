package com.autokereskedes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class StockVehicleDto {
    private Long id;
    private String brandName;
    private String modelName;
    private String variantName;
    private String imageFrontUrl;
    private Long priceHuf;
}
