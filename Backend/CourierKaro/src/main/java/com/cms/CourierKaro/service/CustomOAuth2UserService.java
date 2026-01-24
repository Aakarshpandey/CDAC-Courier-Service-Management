package com.cms.CourierKaro.service;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.entity.Role;
import com.cms.CourierKaro.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends OidcUserService {
    
    private final UserRepository userRepository;
    
    @Override
    public OidcUser loadUser(OidcUserRequest request) {
        // Load user info from OAuth2 provider (Google)
        OidcUser oidcUser = super.loadUser(request);
        
        // Extract user details
        String email = oidcUser.getAttribute("email");
        String firstName = oidcUser.getAttribute("given_name");
        String lastName = oidcUser.getAttribute("family_name");
        String picture = oidcUser.getAttribute("picture");
        System.out.println(picture);
        
        // Find existing user or create new one
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isEmpty()) {
            // User doesn't exist - create new user with default ROLE_USER
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName(firstName);
            newUser.setLastName(lastName);
            newUser.setPassword(null); // OAuth users don't have passwords
            newUser.setRole(Role.ROLE_USER); // Default role
            newUser.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(newUser);
            
            System.out.println("New user auto-registered: " + email + " with role: ROLE_USER");
        } else {
            System.out.println("Existing user logged in: " + email + " with role: " + existingUser.get().getRole());
        }
        
        // Return the OAuth2 user (Spring Security handles the rest)
        return oidcUser;
    }
}

