package com.cms.CourierKaro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.CourierKaro.entity.User;
import java.util.List;
import java.util.Optional;

import com.cms.CourierKaro.entity.Role;


public interface UserRepository extends JpaRepository<User, Long>{
	boolean existsByEmail(String email);
	Optional<User> findByEmailAndRole(String email, Role role);
	boolean existsByEmailAndRole(String email, Role role);
}
