package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.*;
import com.autokereskedes.backend.dto.OrderResponse;
import com.autokereskedes.backend.dto.StockVehicleDto;
import com.autokereskedes.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final StockVehicleRepository stockVehicleRepository;

    public OrderService(
        OrderRepository orderRepository,
        UserRepository userRepository,
        StockVehicleRepository stockVehicleRepository
) {
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
    this.stockVehicleRepository = stockVehicleRepository;
}
    @Transactional
    public OrderResponse createOrder(Order orderRequest) {
        if (orderRequest.getUser() == null || orderRequest.getUser().getId() == null) {
            throw new RuntimeException("Hiányzó felhasználó ID a rendelésben!");
        }
        User user = userRepository.findById(orderRequest.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található!"));
        orderRequest.setUser(user);
        orderRequest.setCreatedAt(OffsetDateTime.now());
        if (orderRequest.getPaymentStatus() == null) {
            orderRequest.setPaymentStatus("PENDING");
        }
        Order savedOrder = orderRepository.save(orderRequest);
        StockVehicleDto carDto = null;
        if (savedOrder.getCarId() != null) {
            StockVehicle car = stockVehicleRepository.findById(savedOrder.getCarId())
                    .orElse(null);
            if (car != null) {
                carDto = new StockVehicleDto(
                        car.getId(),
                        car.getBrandName(),
                        car.getModelName(),
                        car.getVariant() != null ? car.getVariant().getName() : null,
                        car.getImageFrontUrl(),
                        car.getPriceHuf()
                );
            }
        }
        return new OrderResponse(savedOrder, carDto);
    }
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
    @Transactional
    public Order purchaseWithBalance(Long userId, Long carId, Long totalPrice) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található!"));

        Long balance = user.getBalance();

        if (balance >= totalPrice) {

            user.setBalance(balance - totalPrice);
            userRepository.save(user);

            Order order = new Order();
            order.setUser(user);
            order.setCarId(carId);
            order.setTotalPriceHuf(totalPrice);
            order.setPayment(PaymentMethod.BALANCE);
            order.setPaymentStatus("PAID");
            order.setBalanceUsed(totalPrice);
            order.setCreatedAt(OffsetDateTime.now());

            return orderRepository.save(order);
        }

        if (balance > 0) {

            user.setBalance(0L);
            userRepository.save(user);

            Order order = new Order();
            order.setUser(user);
            order.setCarId(carId);
            order.setTotalPriceHuf(totalPrice);
            order.setPayment(PaymentMethod.PARTIAL_BALANCE);
            order.setPaymentStatus("PARTIALLY_PAID");
            order.setBalanceUsed(balance);
            order.setCreatedAt(OffsetDateTime.now());

            return orderRepository.save(order);
        }

        throw new RuntimeException("Nincs elég egyenleg a vásárláshoz!");
    }
    public List<Order> getOrdersByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található!"));

        return orderRepository.findByUser(user);
    }
}
