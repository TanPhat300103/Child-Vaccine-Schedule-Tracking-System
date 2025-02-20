package org.gr1fpt.childvaccinescheduletrackingsystem.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
// import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.NoOpPasswordEncoder; // Chỉ dùng cho mục đích thử nghiệm
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
// import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // tắt csrf để đơn giản hóa việc test API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/customer/create").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/staff/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/customer/**").hasAnyRole("CUSTOMER", "STAFF", "ADMIN")
                        .anyRequest().permitAll()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/login")  // URL xử lý đăng nhập là /login
                        .defaultSuccessUrl("/customer", true)
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