package org.gr1fpt.childvaccinescheduletrackingsystem.security;

import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String phoneNumber) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByPhoneNumber(phoneNumber).orElseThrow(() -> new UsernameNotFoundException("User not found with Phone: " + phoneNumber));
        if (!customer.isActive()) {
            throw new UsernameNotFoundException("Account is inactive");
        }
        String role;
        switch (customer.getRoleId()) {
            case 1:
                role = "CUSTOMER";
                break;
            case 2:
                role = "STAFF";
                break;
            case 3:
                role = "ADMIN";
                break;
            default:
                role = "GUEST";
        }
        // Chuyển đổi Customer sang UserDetails
        return User.builder()
                .username(customer.getPhoneNumber())  // Dùng số điện thoại làm username
                .password(customer.getPassword())  // Lấy password từ DB
                .roles(role)
                .disabled(!customer.isActive())
                .build();
    }
}
