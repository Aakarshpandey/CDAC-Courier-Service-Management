package com.cms.CourierKaro.security;

import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtUtils;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        // Get the authenticated user
        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
        String email = oidcUser.getEmail();
        
        // Get user from database (will always exist due to CustomOAuth2UserService)
        User dbUser = userRepository.findByEmail(email).orElse(null);
        
        // Fallback values in case something goes wrong
        String role = "ROLE_USER";
        String redirectPath = "/user-dashboard";
        
        if (dbUser != null) {
            role = dbUser.getRole() != null ? dbUser.getRole().toString() : "ROLE_USER";
            
            // Determine redirect path based on role
            if ("ROLE_PARTNER".equals(role)) {
                redirectPath = "/partner-dashboard";
            } else if ("ROLE_ADMIN".equals(role)) {
                redirectPath = "/admin-dashboard";
            } else {
                redirectPath = "/user-dashboard";
            }
        }
        
        // Generate JWT token
        String token = jwtUtils.generateToken(email, role, true);

        
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days for OAuth users
        response.addCookie(cookie);

        // Get user's name for frontend display
        String name = dbUser != null && dbUser.getFirstName() != null
                ? dbUser.getFirstName() + (dbUser.getLastName() != null ? " " + dbUser.getLastName() : "")
                : oidcUser.getFullName();

        // Build frontend callback URL with user info and redirect path
        String targetUrl = UriComponentsBuilder
                .fromUriString("http://localhost:5173/auth-callback")
                .queryParam("redirect", redirectPath)
                .queryParam("role", role)
                .queryParam("name", name != null ? name : "")
                .queryParam("email", email)
                .build()
                .toUriString();

        System.out.println("OAuth2 login successful. Redirecting to: " + targetUrl);

        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}