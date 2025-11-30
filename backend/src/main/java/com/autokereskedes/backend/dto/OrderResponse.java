package com.autokereskedes.backend.dto;

import com.autokereskedes.backend.model.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OrderResponse {
    private Order order;
    private StockVehicleDto car;
}
