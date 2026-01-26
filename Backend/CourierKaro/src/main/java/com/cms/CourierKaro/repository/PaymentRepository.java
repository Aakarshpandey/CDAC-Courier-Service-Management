package com.cms.CourierKaro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cms.CourierKaro.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}