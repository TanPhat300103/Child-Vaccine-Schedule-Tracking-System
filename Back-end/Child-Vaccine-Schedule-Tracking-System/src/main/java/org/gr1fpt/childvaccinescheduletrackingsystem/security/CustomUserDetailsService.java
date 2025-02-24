package org.gr1fpt.childvaccinescheduletrackingsystem.security;

import org.gr1fpt.childvaccinescheduletrackingsystem.admin.Admin;
import org.gr1fpt.childvaccinescheduletrackingsystem.admin.AdminRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerRepository;

import org.gr1fpt.childvaccinescheduletrackingsystem.satff.Staff;
import org.gr1fpt.childvaccinescheduletrackingsystem.satff.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String phoneNumber) throws UsernameNotFoundException {

        Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            return buildUserDetails(customer.getPhoneNumber(), customer.getPassword(),"CUSTOMER", customer.isActive());
        }

        Optional<Staff> staffOpt = staffRepository.findByPhone(phoneNumber);
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            return buildUserDetails(staff.getPhone(), staff.getPassword(), "STAFF", staff.isActive());
        }

        Optional<Admin> adminOpt = adminRepository.findByPhone(phoneNumber);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return buildUserDetails(admin.getPhone(), admin.getPassword(), "ADMIN", admin.isActive());
        }

        throw new UsernameNotFoundException("User not found with phone: " + phoneNumber);
    }

    private UserDetails buildUserDetails(String username, String password, String roleName, boolean active) {
        if (!active) {
            throw new UsernameNotFoundException("Account is inactive");
        }
        return User.builder()
                .username(username)
                .password(password)
                .roles(roleName)
                .disabled(!active)
                .build();
    }
}
