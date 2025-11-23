package com.autokereskedes.backend.config;

import com.autokereskedes.backend.repository.UserRepository;
import com.autokereskedes.backend.security.JwtAuthFilter;
import com.autokereskedes.backend.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig implements WebMvcConfigurer {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public SecurityConfig(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtService, userRepository);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration cfg = new CorsConfiguration();
            cfg.setAllowCredentials(true);
            cfg.setAllowedOriginPatterns(List.of(
                    "http://localhost:3000",
                    "https://carguru-online-autokereskedes.onrender.com",
                    "https://resilient-halva-e23069.netlify.app",
                    "https://*.netlify.app"
            ));
            cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            cfg.setAllowedHeaders(List.of("*"));
            cfg.setExposedHeaders(List.of("Authorization"));
            cfg.setMaxAge(3600L);
            return cfg;
        }));

        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(auth -> auth

                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/test-email").permitAll()
                .requestMatchers("/api/offer/**").permitAll()
                .requestMatchers("/api/brands/**").permitAll()
                .requestMatchers("/api/cars/**").permitAll()
                .requestMatchers("/api/models/**").permitAll()
                .requestMatchers("/api/variants/**").permitAll()
                .requestMatchers("/api/engines/**").permitAll()
                .requestMatchers("/api/catalog/**").permitAll()
                .requestMatchers("/api/stock/**").permitAll()
                .requestMatchers("/api/test-drive/**").permitAll()
                .requestMatchers("/api/stock-vehicle/**").permitAll()
                .requestMatchers("/api/images/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/images/**").permitAll()
                .requestMatchers("/static/**").permitAll()
                .requestMatchers("/resources/**").permitAll()
                .requestMatchers("/webjars/**").permitAll()
                .requestMatchers("/favicon.ico").permitAll()

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                .requestMatchers(HttpMethod.GET, "/api/usedcars/featured").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usedcars/*").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usedcars/search").permitAll()

                .requestMatchers("/api/favorites/**").authenticated()
                .requestMatchers("/api/users/**").authenticated()
                .requestMatchers("/api/tradein/**").authenticated()
                .requestMatchers("/api/documents/**").authenticated()
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/paymentinfo/**").authenticated()
                .requestMatchers("/api/leasing/**").authenticated()
                .requestMatchers("/api/insurance/**").authenticated()
                .requestMatchers("/api/delivery/**").authenticated()

                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/usedcars/admin/**").hasRole("ADMIN")

                .requestMatchers("/api/messages/**").authenticated()

                .anyRequest().permitAll()
        );

        http.addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        http.exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                })
                .accessDeniedHandler((req, res, e) -> {
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                })
        );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {

    registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/");

    registry.addResourceHandler("/images/**")
            .addResourceLocations(
                "file:./public/images/",
                "classpath:/static/images/"
            );
}


}
