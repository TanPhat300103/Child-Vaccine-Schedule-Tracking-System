package org.gr1fpt.childvaccinescheduletrackingsystem.security;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

// import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.NoOpPasswordEncoder; // Chỉ dùng cho mục đích thử nghiệm
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@CrossOrigin(origins = "*")
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Origin của frontend
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(Arrays.asList("*"));
                    config.setAllowCredentials(true); // Cho phép gửi cookie/session
                    return config;
                }))
                .csrf(csrf -> csrf.disable())  // tắt csrf để đơn giản hóa việc test API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/customer/create", "/vaccine/findid", "/vaccine/findbyage", "/vaccine/findbycountry", "/vaccine/findbyprice", "/vaccine/findbyname", "/vaccinecombo", "/vaccine", "/vaccinecombo/findid", "/vaccinecombo/findname", "/vaccinedetail", "/vaccinedetail/findbyvaccine", "/combodetail", "/combodetail/findid", "/combodetail/findcomboid", "/combodetail/findvaccineid", "/feedback/**")
                        .permitAll()


                        .requestMatchers("/customer/findid", "/booking/create", "/booking/findbycustomer", "/bookingdetail/findbybooking", "/bookingdetail/updatereaction", "/booking/cancel", "/child/create", "/child/findbycustomer", "/child/update", "/customer/update", "/marketing", "/medicalhistory/updatereaction", "/medicalhistory/findbychildid", "/payment/findbybooking", "/payment/update")
                        .hasAnyRole("CUSTOMER", "STAFF", "ADMIN")


                        .requestMatchers("/staff/create", "/vaccine/**", "/booking/**", "/bookingdetail/**", "/child/**", "/combodetail/**", "/email/**", "/marketing/**", "/medicalhistory/**", "/payment/**", "/vaccinecombo/**", "/vaccinedetail/**")
                        .hasAnyRole("STAFF", "ADMIN","CUSTOMER")

                        .requestMatchers("/admin/**", "/staff/**")
                        .hasRole("ADMIN")
                        .anyRequest().permitAll()
                ).oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .defaultSuccessUrl("/auth/user", true)
                )

                .formLogin(form -> form
                        .loginProcessingUrl("/login")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK); // Trả về 200
                        })
                        .failureHandler((request, response, exception) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Sai tên đăng nhập hoặc mật khẩu");
                        })
                        .permitAll()
                )
                .httpBasic(Customizer.withDefaults())  // Test trên postman
                .logout(logout -> logout
                        .logoutUrl("/logout")  // Đường dẫn để logout
                        .logoutSuccessUrl("/login")  // URL sau khi logout thành công
                        .invalidateHttpSession(true)  // Hủy session khi logout
                        .clearAuthentication(true)  // Xóa thông tin xác thực khi logout
                        .permitAll()
                );

        return http.build();
    }

    // Khai báo đối tượng mã hóa password - tạm thời dùng NoOpPasswordEncoder để test
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();  // không mã hóa password
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }
}