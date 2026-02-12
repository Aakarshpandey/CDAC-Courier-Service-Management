package com.cms.CourierKaro.config;

import com.cms.CourierKaro.security.JwtAuthenticationFilter;
import com.cms.CourierKaro.security.OAuth2SuccessHandler;
import com.cms.CourierKaro.service.CustomOAuth2UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
     private final CustomOAuth2UserService customOAuth2UserService;
    
     private final OAuth2SuccessHandler oAuthSuccessHandler;
     @Autowired
     private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	 http
         .cors(cors -> cors.configurationSource(corsConfigurationSource()))
         .csrf(csrf -> csrf.disable())
         .sessionManagement(session ->
         session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
         .authorizeHttpRequests(requests -> requests
         .requestMatchers("/","/login",
         "/register","/oauth2/**","/login/oauth2/**").permitAll()
         .requestMatchers("/api/partners/register").permitAll()
         .requestMatchers("/api/pricing/**", "/api/vehicleTypes/**",
                         "/api/payments/**").permitAll()
         .requestMatchers(HttpMethod.GET, "/api/partners/*/ratings").permitAll()

         // Admin endpoints
         .requestMatchers("/api/admin/**").hasRole("ADMIN")
         .requestMatchers("/api/partners/applications").hasRole("ADMIN")
         .requestMatchers("/api/partners/approve/**").hasRole("ADMIN")
         .requestMatchers("/api/partners/reject/**").hasRole("ADMIN")

         // Partner endpoints
         .requestMatchers("/api/partners/profile").hasRole("PARTNER")
         .requestMatchers("/api/partners/dashboard/**").hasRole("PARTNER")
         .requestMatchers("/api/partners/online-status").hasRole("PARTNER")
         .requestMatchers("/api/partners/available-orders").hasRole("PARTNER")
         .requestMatchers("/api/partners/payouts").hasRole("PARTNER")
         .requestMatchers("/api/partners/transfer-earnings").hasRole("PARTNER")
         .requestMatchers("/api/partners/earnings/**").hasRole("PARTNER")
         .requestMatchers("/api/partners/accept-order/**").hasRole("PARTNER")
         .requestMatchers("/api/partners/profile-photo").hasRole("PARTNER")

         // User endpoints
         .requestMatchers("/api/shipments/**").hasRole("USER")
         .requestMatchers(HttpMethod.POST, "/api/ratings").hasRole("USER")

         // User profile - accessible by any authenticated user
         .requestMatchers("/api/users/**").authenticated()

         //other requests require authentication
         .anyRequest().authenticated())
         
         .oauth2Login(oauth->oauth
         .userInfoEndpoint(userInfo->userInfo
         .oidcUserService(customOAuth2UserService) )
         .successHandler(oAuthSuccessHandler))//redirects after successful login
         .httpBasic(httpBasic -> httpBasic.disable())
         .formLogin(formLogin -> formLogin.disable())
         .addFilterBefore(jwtAuthenticationFilter,
         UsernamePasswordAuthenticationFilter.class);
         return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Use patterns instead of origins to allow
                                                                    // credentials
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "Set-Cookie"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}