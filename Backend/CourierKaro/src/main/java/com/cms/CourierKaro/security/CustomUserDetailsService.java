package com.cms.CourierKaro.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.cms.CourierKaro.entity.Role;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String principal) throws UsernameNotFoundException {
        // Principal format: "email:role"
        String[] parts = principal.split(":");
        
        if (parts.length != 2) {
            throw new UsernameNotFoundException("Invalid principal format");
        }
        
        String email = parts[0];
        Role role = Role.valueOf(parts[1]);
        
        User user = userRepository.findByEmailAndRole(email, role)
                .orElseThrow(() -> 
                    new UsernameNotFoundException("User not found with email: " + email + " and role: " + role)
                );

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
}