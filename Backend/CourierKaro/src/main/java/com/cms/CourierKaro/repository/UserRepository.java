package com.cms.CourierKaro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.CourierKaro.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
	boolean existsByEmail(String email);
}
